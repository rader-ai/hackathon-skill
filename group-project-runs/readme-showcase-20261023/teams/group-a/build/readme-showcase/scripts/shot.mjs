#!/usr/bin/env node
// shot.mjs - screenshot a local HTML file in light AND dark scheme with headless Chrome/Chromium, optional crop.
// Usage: node shot.mjs <file.html> --out <dir> --name <base> [--width 880] [--height 1400] [--scale 2] [--crop WxH+X+Y]
//   Writes <dir>/<base>-light.png and <dir>/<base>-dark.png (same size). Dimensions are CSS px * scale.
//   --only light|dark  write just that one (use when the page has no dark theme; then add --frame)
//   --frame  add a 1px border and 16px transparent margin so a light capture reads as a card on GitHub dark
//   --list   print the page's candidate elements (selector, top, height in CSS px, text) and exit; pick selectors from it
//   --clip 'SEL_A;SEL_B'  crop to the union of the first element matching each CSS selector (12 CSS px padding, full width), so the
//            crop edges always fall on element boundaries. Use instead of --crop. Needs ImageMagick.
//   --crop is in OUTPUT pixels (after scale) and needs ImageMagick (`magick`). Look at the uncropped PNG first,
//   then choose the rectangle that holds the evidence (see references/visuals.md).
// Needs: Chrome or Chromium (CHROME_BIN overrides discovery), Node >= 18. Exit 2 on missing input/tool, 1 on capture failure.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { findChrome } from './check-env.mjs';

const die = (code, msg) => { console.error(`shot: ${msg}`); process.exit(code); };
const a = process.argv.slice(2);
const opt = (k, d) => { const i = a.indexOf(k); return i > -1 ? a[i + 1] : d; };
const file = a.find((x, i) => !x.startsWith('--') && !['--out', '--name', '--width', '--height', '--scale', '--crop', '--only', '--clip'].includes(a[i - 1]));
if (!file) die(2, 'need <file.html>\nUsage: node shot.mjs <file.html> --out <dir> --name <base> [--width 880] [--height 1400] [--scale 2] [--crop WxH+X+Y]');
if (!fs.existsSync(file)) die(2, `file not found: ${path.resolve(file)}`);
const out = opt('--out'); const name = opt('--name');
const list = a.includes('--list');
if (!list && (!out || !name)) die(2, '--out <dir> and --name <base> are required');
const width = Number(opt('--width', 880)), height = Number(opt('--height', 1400)), scale = Number(opt('--scale', 2));
for (const [k, v] of Object.entries({ width, height, scale })) if (!Number.isFinite(v) || v <= 0) die(2, `--${k} must be a positive number`);
let crop = opt('--crop'); const clip = opt('--clip');
if (crop && clip) die(2, 'use --crop or --clip, not both'); const only = opt('--only'); const frame = a.includes('--frame');
if (only && !['light', 'dark'].includes(only)) die(2, '--only must be light or dark');
if (crop && !/^\d+x\d+\+\d+\+\d+$/.test(crop)) die(2, `--crop must look like 1760x900+0+120 (got ${crop})`);
const chrome = findChrome();
if (!chrome) die(2, 'no Chrome/Chromium found. Install Google Chrome or set CHROME_BIN. (node scripts/check-env.mjs --need chrome)');
let magick = null;
if (crop || frame || clip) { for (const n of ['magick', 'convert']) { try { magick = execFileSync('which', [n], { encoding: 'utf8' }).trim(); break; } catch {} } if (!magick) die(2, '--crop/--frame need ImageMagick (`brew install imagemagick`)'); }

// ---- measure: inject a script into a sibling copy of the page, dump the DOM, read element rectangles ----------------
function measure(selectors) {
  const html = fs.readFileSync(file, 'utf8');
  const script = `<script>window.addEventListener('load',function(){var S=${JSON.stringify(selectors)};var out={docH:document.documentElement.scrollHeight,sel:{},list:[]};
function r(e){var b=e.getBoundingClientRect();return {y:Math.round(b.top+scrollY),h:Math.round(b.height),x:Math.round(b.left),w:Math.round(b.width)}}
S.forEach(function(s){var e=null;try{e=document.querySelector(s)}catch(x){} out.sel[s]=e?r(e):null});
document.querySelectorAll('body *').forEach(function(e){var t=e.tagName.toLowerCase();if(/^(script|style|br|span|b|i|em|strong|td|tr|th|li|a|code)$/.test(t))return;var b=r(e);if(b.h<20||b.w<100)return;var c=(e.className&&typeof e.className==='string')?'.'+e.className.trim().split(/\\s+/).join('.'):'';var txt=(e.textContent||'').replace(/\\s+/g,' ').trim().slice(0,50);out.list.push({s:t+(e.id?'#'+e.id:'')+c,y:b.y,h:b.h,t:txt})});
var p=document.createElement('pre');p.id='__rects';p.textContent=JSON.stringify(out);document.body.appendChild(p)})</script>`;
  const tmpName = path.join(path.dirname(path.resolve(file)), `.shot-measure-${process.pid}.html`);
  fs.writeFileSync(tmpName, /<\/body>/i.test(html) ? html.replace(/<\/body>/i, script + '</body>') : html + script);
  const prof = fs.mkdtempSync(path.join(fs.realpathSync(process.env.TMPDIR || '/tmp'), 'shot-measure-'));
  try {
    for (let attempt = 1; attempt <= 4; attempt++) {
      let dom = '';
      try { dom = execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-sandbox', `--user-data-dir=${path.join(prof, 'a' + attempt)}`, `--window-size=${width},2000`, '--virtual-time-budget=3000', '--dump-dom', pathToFileURL(tmpName).href], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 60000 }); } catch {}
      const m = /<pre id="__rects">([\s\S]*?)<\/pre>/.exec(dom);
      if (m) return JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
    }
    die(1, 'could not measure the page (4 attempts); use --crop with numbers read from the uncropped PNG instead');
  } finally { fs.rmSync(tmpName, { force: true }); fs.rmSync(prof, { recursive: true, force: true }); }
}
let shotHeight = height;
if (list) {
  const m = measure([]);
  console.log(`shot: page is ${width} CSS px wide, ${m.docH} CSS px tall. Candidate elements (selector, top, height, text):`);
  for (const e of m.list.slice(0, 80)) console.log(`  ${e.s}  y=${e.y} h=${e.h}  "${e.t}"`);
  process.exit(0);
}
if (clip) {
  const sels = clip.split(';').map((s) => s.trim()).filter(Boolean);
  if (!sels.length) die(2, '--clip needs at least one selector, separated by ;');
  const m = measure(sels);
  const boxes = sels.map((s) => m.sel[s]);
  const missing = sels.filter((s, i) => !boxes[i]);
  if (missing.length) die(2, `--clip selector(s) matched nothing: ${missing.join(' | ')} (run with --list to see candidates)`);
  const top = Math.max(0, Math.min(...boxes.map((b) => b.y)) - 12), bottom = Math.min(m.docH, Math.max(...boxes.map((b) => b.y + b.h)) + 12);
  crop = `${Math.round(width * scale)}x${Math.round((bottom - top) * scale)}+0+${Math.round(top * scale)}`;
  shotHeight = Math.max(height, Math.ceil(bottom) + 2);
  console.log(`shot: clip ${sels.join(' + ')} -> ${bottom - top} CSS px tall, crop ${crop}`);
}
fs.mkdirSync(out, { recursive: true });
const url = pathToFileURL(path.resolve(file)).href;
const profile = fs.mkdtempSync(path.join(fs.realpathSync(process.env.TMPDIR || '/tmp'), 'shot-profile-'));
const written = [];
try {
  for (const scheme of only ? [only] : ['light', 'dark']) {
    const dest = path.resolve(out, `${name}-${scheme}.png`);
    const args = ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', `--user-data-dir=${profile}`, `--window-size=${width},${shotHeight}`,
      `--force-device-scale-factor=${scale}`, '--virtual-time-budget=3000', // Blink's enum is 0=dark, 1=light (verified on Chrome with the OS in dark mode); both are set explicitly so the OS theme never leaks in.
      ...(scheme === 'dark' ? ['--blink-settings=preferredColorScheme=0', '--force-dark-mode'] : ['--blink-settings=preferredColorScheme=1']), `--screenshot=${dest}`, url];
    // Chrome intermittently dies on start ("Trying to load the allocator multiple times"). Retry up to 4 times,
    // each with a fresh profile dir, before reporting failure. Deterministic failures (bad HTML path) fail 4 times too.
    let lastErr = '';
    for (let attempt = 1; attempt <= 4; attempt++) {
      const prof = path.join(profile, `a${attempt}`);
      const argsN = args.map((x) => (x.startsWith('--user-data-dir=') ? `--user-data-dir=${prof}` : x));
      try { fs.rmSync(dest, { force: true }); execFileSync(chrome, argsN, { stdio: ['ignore', 'ignore', 'pipe'], timeout: 60000 }); } catch (e) { lastErr = String(e.stderr || e.message).slice(0, 300); }
      if (fs.existsSync(dest) && fs.statSync(dest).size >= 200) { lastErr = ''; break; }
      if (!lastErr) lastErr = 'no image written';
    }
    if (lastErr) die(1, `Chrome failed for ${scheme} after 4 attempts: ${lastErr}`);
    if (crop) execFileSync(magick, [dest, '-crop', crop, '+repage', dest]);
    if (frame) execFileSync(magick, [dest, '-bordercolor', '#8c959f', '-border', '1', '-bordercolor', 'none', '-border', '16', dest]);
    written.push(dest);
  }
} finally { fs.rmSync(profile, { recursive: true, force: true }); }
for (const w of written) { const b = fs.readFileSync(w); console.log(`shot: ${w} ${b.readUInt32BE(16)}x${b.readUInt32BE(20)} ${(b.length / 1024).toFixed(0)} KB`); }
if (written.length === 2 && fs.readFileSync(written[0]).equals(fs.readFileSync(written[1]))) console.error('shot: NOTE light and dark are byte-identical: the page does not respond to prefers-color-scheme. Ship a single image and list it in PAIR-EXCEPTIONS.txt, or add a dark theme to the capture.');
