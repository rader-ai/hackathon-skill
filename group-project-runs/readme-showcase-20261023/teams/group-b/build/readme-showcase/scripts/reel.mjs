#!/usr/bin/env node
// Render the README "Reel": a short, data-bound input -> output animation, from beats.json.
// Usage: node reel.mjs <beats.json> --out <assets-dir>
// Writes: reel-light.svg, reel-dark.svg (CSS animation, one play then settles, reduced-motion = final frame)
//         reel-final.png (light, final frame) if Playwright+Chromium are available; otherwise
//         reel-final.svg (static) and a WARNING. Prints a JSON summary incl. suggested alt text.
// Dependencies: Node 18+. Optional: Playwright + Chromium for the PNG (scripts/lib/pw.mjs).
// Exit codes: 0 ok | 1 invalid beats.json or limit exceeded | 2 usage / unreadable file |
//             3 no input->output pair (nothing written: use ladder rung 3 or 4).
// beats.json: {"duration": 6, "beats":[{"type":"in|step|out|gap","text":"...","source":"path:line","claim":"c1"}]}
// All on-screen words come from `text` (verbatim from the repo) plus fixed tags (INPUT/CHECK/OUTPUT/GAP)
// and the file path taken from `source`. The model never writes SVG. Limits: 3 beats, 8 s, 150 KB per SVG.
import fs from 'node:fs';
import path from 'node:path';
import { tryLoadPlaywright, launch } from './lib/pw.mjs';

const MAX_BEATS = 3, MAX_SECONDS = 8, MAX_SVG_BYTES = 150 * 1024;
const TYPES = { in: 'INPUT', step: 'CHECK', out: 'OUTPUT', gap: 'GAP' };
const MAX_LINES = { in: 3, out: 3, step: 2, gap: 2 };
const fail = (m, c = 1) => { console.error('reel: ' + m); process.exit(c); };

const argv = process.argv.slice(2); let outDir = null; const rest = [];
for (let i = 0; i < argv.length; i++) { if (argv[i] === '--out') outDir = argv[++i]; else rest.push(argv[i]); }
if (rest.length !== 1 || !outDir) fail('usage: node reel.mjs <beats.json> --out <assets-dir>', 2);
let spec;
try { spec = JSON.parse(fs.readFileSync(rest[0], 'utf8')); }
catch (e) { fail(`cannot read/parse ${rest[0]}: ${e.message}`, 2); }

const beats = spec.beats;
if (!Array.isArray(beats) || beats.length === 0) fail('beats.json needs a non-empty "beats" array');
if (beats.length > MAX_BEATS) fail(`${beats.length} beats; the maximum is ${MAX_BEATS}. Cut beats, do not shrink them.`);
const duration = spec.duration === undefined ? 6 : Number(spec.duration);
if (!(duration > 0) || duration > MAX_SECONDS) fail(`duration ${spec.duration} is invalid; must be > 0 and <= ${MAX_SECONDS} seconds`);
beats.forEach((b, i) => {
  const at = `beat ${i + 1}`;
  if (!TYPES[b.type]) fail(`${at}: type "${b.type}" is not one of in, step, out, gap`);
  if (typeof b.text !== 'string' || !b.text.trim()) fail(`${at}: "text" is required (verbatim from the repo)`);
  if (typeof b.source !== 'string' || !b.source.trim()) fail(`${at}: "source" is required (file:line or capture:<id>); no source means no beat`);
  if (typeof b.claim !== 'string' || !b.claim.trim()) fail(`${at}: "claim" (ledger id) is required; no ledger row means no beat`);
  if (/[\r\n]/.test(b.text)) fail(`${at}: text must be one line (no newlines)`);
  if (/\*\*|__[^_]+__|\]\(|&quot;|&amp;|`/.test(b.text)) fail(`${at}: text contains markdown or HTML entities ("${b.text.slice(0, 40)}"). Strip the markers; put the cleaned text in the ledger row's "text" and keep the raw line in its "quote".`);
});
if (!beats.some((b) => b.type === 'in') || !beats.some((b) => b.type === 'out')) {
  console.error('reel: no pair: beats.json needs at least one "in" and one "out" beat. Use ladder rung 3 (real code/CLI block) or rung 4 (typographic launch). Nothing was written.');
  process.exit(3);
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const W = 880, PAD = 24, CARD_W = W - PAD * 2, FS = 16, CH = FS * 0.602, LINE_H = 24;
const maxChars = Math.floor((CARD_W - 56 - 24) / CH);
function wrap(text) {
  const words = text.trim().split(/\s+/); const lines = []; let cur = '';
  for (const w of words) {
    if (w.length > maxChars) fail(`a single word is ${w.length} characters (max ${maxChars}): "${w.slice(0, 30)}..."`);
    if ((cur + ' ' + w).trim().length > maxChars) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur); return lines;
}
const laid = beats.map((b, i) => {
  const lines = wrap(b.text);
  if (lines.length > MAX_LINES[b.type]) fail(`beat ${i + 1} (${b.type}): text needs ${lines.length} lines; max is ${MAX_LINES[b.type]} at ${maxChars} characters per line. Shorten it with a verbatim prefix ending in "...", not a paraphrase.`);
  return { ...b, lines, h: 20 + 22 + lines.length * LINE_H + 16 };
});
const GAP = 30; let y = PAD; const ys = [];
laid.forEach((b) => { ys.push(y); y += b.h + GAP; });
const H = y - GAP + PAD;
const STEP = (duration - 0.8) / laid.length;

const PALETTES = {
  light: { bg: '#f6f8fa', border: '#d0d7de', card: '#ffffff', text: '#1f2328', muted: '#59636e', in: '#0969da', step: '#8250df', out: '#1a7f37', gap: '#9a6700', arrow: '#8c959f' },
  dark: { bg: '#0d1117', border: '#30363d', card: '#161b22', text: '#e6edf3', muted: '#9198a1', in: '#58a6ff', step: '#bc8cff', out: '#3fb950', gap: '#d29922', arrow: '#6e7681' },
};
function svg(theme, animated) {
  const c = PALETTES[theme]; const FONT = `ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace`;
  const SANS = `-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif`;
  let css = '', body = '';
  laid.forEach((b, i) => {
    const d = (0.3 + i * STEP).toFixed(2); const col = c[b.type]; const top = ys[i];
    const file = b.source.replace(/:[\d-]+$/, '');
    body += `<g transform="translate(${PAD} ${top})"><g class="b b${i}">`;
    body += `<rect width="${CARD_W}" height="${b.h}" rx="10" fill="${c.card}" stroke="${b.type === 'gap' ? col : c.border}" stroke-width="${b.type === 'gap' ? 2 : 1}"${b.type === 'gap' ? ' stroke-dasharray="7 5"' : ''}/>`;
    body += `<rect width="6" height="${b.h}" rx="3" fill="${col}"/>`;
    body += `<text x="24" y="28" font-family="${SANS}" font-size="14" font-weight="700" letter-spacing="1.2" fill="${col}">${TYPES[b.type]}</text>`;
    body += `<text x="${CARD_W - 20}" y="28" text-anchor="end" font-family="${FONT}" font-size="14" fill="${c.muted}">${esc(file)}</text>`;
    b.lines.forEach((ln, k) => { body += `<text x="24" y="${58 + k * LINE_H}" font-family="${FONT}" font-size="${FS}" fill="${c.text}" xml:space="preserve">${esc(ln)}</text>`; });
    if (b.type === 'out' || b.type === 'step') body += `<path class="tick t${i}" d="M${CARD_W - 52} 50 l7 7 l14 -15" fill="none" stroke="${col}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1"/>`;
    if (b.type === 'gap') body += `<circle cx="${CARD_W - 44}" cy="50" r="9" fill="none" stroke="${col}" stroke-width="2.5"/>`;
    body += `</g></g>`;
    if (i < laid.length - 1) {
      const x = PAD + 30, y1 = top + b.h + 3, y2 = top + b.h + GAP - 3;
      body += `<path class="a a${i}" d="M${x} ${y1} V${y2} m-5 -7 l5 7 l5 -7" fill="none" stroke="${c.arrow}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    css += `.b${i}{animation-delay:${d}s}.a${i}{animation-delay:${(0.3 + i * STEP + 0.35).toFixed(2)}s}.t${i}{animation-delay:${(0.3 + i * STEP + 0.45).toFixed(2)}s}`;
  });
  const anim = animated
    ? `.b,.a{opacity:0;animation:in .5s ease-out both}.tick{animation:draw .45s ease-out both}` +
      `@keyframes in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}` +
      css + `@media (prefers-reduced-motion:reduce){.b,.a,.tick{animation:none;opacity:1;stroke-dashoffset:0}}`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(altText())}"><style>${anim}</style>` +
    `<rect width="${W}" height="${H}" rx="14" fill="${c.bg}" stroke="${c.border}"/>${body}</svg>\n`;
}
function altText() {
  const clean = (t) => t.replace(/"/g, "'").replace(/\s*\.\.\.$/, '').replace(/[.]$/, '');
  return laid.map((b) => `${TYPES[b.type][0]}${TYPES[b.type].slice(1).toLowerCase()}: ${clean(b.text)}.`).join(' ');
}

fs.mkdirSync(outDir, { recursive: true });
const written = []; const warnings = [];
for (const theme of ['light', 'dark']) {
  const s = svg(theme, true); const bytes = Buffer.byteLength(s);
  if (bytes > MAX_SVG_BYTES) fail(`reel-${theme}.svg is ${bytes} bytes; the limit is ${MAX_SVG_BYTES}. Shorten the beat text.`);
  const f = path.join(outDir, `reel-${theme}.svg`); fs.writeFileSync(f, s); written.push({ file: f, bytes });
}
// Frozen final frame: PNG via Chromium when available, else a static SVG.
let finalFile = null;
const pw = tryLoadPlaywright();
if (pw) {
  let browser;
  try {
    browser = await launch(pw);
    const ctx = await browser.newContext({ viewport: { width: W, height: Math.ceil(H) }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.setContent(`<html><body style="margin:0;background:transparent">${svg('light', true)}</body></html>`);
    await page.waitForTimeout(300);
    finalFile = path.join(outDir, 'reel-final.png');
    await page.screenshot({ path: finalFile, omitBackground: true, clip: { x: 0, y: 0, width: W, height: H } });
    await ctx.close();
  } catch (e) { warnings.push('PNG not written: ' + String(e.message).split('\n')[0]); finalFile = null; }
  finally { if (browser) await browser.close(); }
} else warnings.push('Playwright not installed: no reel-final.png. Wrote a static reel-final.svg instead; install Playwright for the PNG fallback (see SKILL.md).');
if (!finalFile) { finalFile = path.join(outDir, 'reel-final.svg'); fs.writeFileSync(finalFile, svg('light', false)); }
written.push({ file: finalFile, bytes: fs.statSync(finalFile).size });
warnings.forEach((w) => console.error('reel: WARNING: ' + w));
console.log(JSON.stringify({ ok: true, duration, beats: laid.length, files: written, alt: altText(), warnings }, null, 2));
