#!/usr/bin/env node
// Verify a README against its claims ledger. Proves EXISTENCE and EXACTNESS, not meaning:
// a fresh adversary read (see SKILL.md) must still check that each source supports its claim.
// Usage: node verify.mjs <repo-path> <outdir>
//   <outdir> holds README.md, claims.json, assets/ and (if a Reel is used) beats.json.
// Dependencies: Node 18+ only. Never runs repo code.
// Exit codes: 0 all checks pass | 1 one or more failures (each printed as "FAIL [check] ...") |
//             2 usage error or required input missing/unparseable.
// Checks: (1) ledger sources resolve and each quote is literally present; (2) every fenced-code line,
// inline code span and number in README prose maps to the ledger or an existing path; (3) beats and
// Reel SVG text are ledger text; (4) relative links/images resolve; (5) hype words; (6) badges need a
// ledger row; (7) asset budget (6 MB hard, 1.5 MB warn, 150 KB per SVG); (8) a Limits heading exists;
// (9) unverified commands are labelled "unverified" in the README; (10) beats carry no markdown and
// share a visible phrase (WARN); alt text is a sentence, not a transcript; (11) command rows keep the
// repo's trailing/sibling comment lines (WARN); (12) the sentence under the H1 precedes the visual (WARN).
// Ledger status: verified | artifact (a captured output of that command exists; needs "evidence") | unverified.
import fs from 'node:fs';
import path from 'node:path';

const HYPE = ['revolutionary', 'seamless', 'seamlessly', 'blazing', 'blazingly', 'cutting-edge', 'cutting edge', 'powerful', 'robust', 'game-changing', 'game changing',
  'effortless', 'effortlessly', 'next-generation', 'next-gen', 'world-class', 'best-in-class', 'supercharge', 'supercharged', 'unleash', 'magical', 'lightning-fast', 'turnkey',
  'state-of-the-art', 'enterprise-grade', 'battle-tested', 'groundbreaking', 'innovative', 'cutting edge', 'ultimate', 'unparalleled', 'delightful', 'beautifully'];
const BADGE_RE = /(img\.shields\.io|badge\.fury\.io|badgen\.net|codecov\.io|travis-ci\.(org|com)|github\.com\/[^\s)"']+\/(actions\/workflows|badge)|api\.codeclimate|snyk\.io\/test)/i;

const usage = () => { console.error('usage: node verify.mjs <repo-path> <outdir>'); process.exit(2); };
if (process.argv.length !== 4) usage();
const repo = path.resolve(process.argv[2]), out = path.resolve(process.argv[3]);
const need = (p, what) => { if (!fs.existsSync(p)) { console.error(`verify: ${what} not found: ${p}`); process.exit(2); } };
need(repo, 'repo'); need(out, 'outdir'); need(path.join(out, 'README.md'), 'README.md'); need(path.join(out, 'claims.json'), 'claims.json (the ledger; see references/ledger.md)');
const readme = fs.readFileSync(path.join(out, 'README.md'), 'utf8');
let ledger;
try { ledger = JSON.parse(fs.readFileSync(path.join(out, 'claims.json'), 'utf8')); } catch (e) { console.error('verify: claims.json is not valid JSON: ' + e.message); process.exit(2); }
if (!Array.isArray(ledger.claims) || ledger.claims.length === 0) { console.error('verify: claims.json needs a non-empty "claims" array'); process.exit(2); }

let checks = 0; const fails = []; const warns = [];
const fail = (check, msg, claim) => fails.push(`FAIL [${check}]${claim ? ` claim ${claim}` : ''}: ${msg}`);
const ok = () => { checks++; };
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const stripHtml = (s) => s.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const insideRepo = (p) => { const r = path.relative(repo, p); return !r.startsWith('..') && !path.isAbsolute(r); };

// ---- 1. ledger
const KINDS = new Set(['fact', 'command', 'number', 'quote', 'limit', 'derived', 'badge', 'license']);
const byId = new Map(); const commentSiblings = [];
for (const c of ledger.claims) {
  const id = c.id;
  if (!id || typeof id !== 'string') { fail('ledger', `a claim has no string id: ${JSON.stringify(c).slice(0, 80)}`); continue; }
  if (byId.has(id)) { fail('ledger', 'duplicate id', id); continue; }
  byId.set(id, c);
  for (const f of ['text', 'kind', 'source', 'status']) if (typeof c[f] !== 'string' || !c[f]) fail('ledger', `missing field "${f}"`, id);
  if (!KINDS.has(c.kind)) fail('ledger', `kind "${c.kind}" is not one of ${[...KINDS].join(', ')}`, id);
  if (!['verified', 'unverified', 'artifact'].includes(c.status)) fail('ledger', `status must be verified, artifact or unverified, got "${c.status}"`, id);
  if (c.status === 'artifact') {
    const ev = (ledger.captures || {})[c.evidence];
    if (!c.evidence || !ev) fail('ledger', 'status "artifact" needs "evidence": the id of a declared capture that is the output of this command (see references/ledger.md)', id);
    else { const ep = ev.startsWith('out:') ? path.join(out, ev.slice(4)) : path.join(repo, ev); if (!fs.existsSync(ep)) fail('ledger', `evidence capture "${c.evidence}" does not exist: ${ev}`, id); }
  }
  if (typeof c.quote !== 'string' || !c.quote.trim()) { fail('ledger', 'missing "quote" (the literal text in the source that supports the claim)', id); continue; }
  if (typeof c.source !== 'string') continue;
  const cap = c.source.match(/^capture:(.+)$/);
  let file, lo, hi;
  if (cap) {
    const rel = (ledger.captures || {})[cap[1]];
    if (!rel) { fail('source', `capture "${cap[1]}" is not declared under "captures" in claims.json`, id); continue; }
    file = rel.startsWith('out:') ? path.join(out, rel.slice(4)) : path.join(repo, rel);
  } else {
    const m = c.source.match(/^(.+?):(\d+)(?:-(\d+))?$/);
    if (!m) { fail('source', `source "${c.source}" must be path:LINE, path:LINE-LINE or capture:<id>`, id); continue; }
    file = path.join(repo, m[1]); lo = +m[2]; hi = m[3] ? +m[3] : lo;
    if (!insideRepo(file)) { fail('source', `source path escapes the repo: ${m[1]}`, id); continue; }
  }
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { fail('source', `source file does not exist: ${c.source}`, id); continue; }
  let text = fs.readFileSync(file, 'utf8'); let scope = text;
  if (lo) {
    const lines = text.split('\n');
    if (lo > lines.length || hi > lines.length || hi < lo) { fail('source', `line ${lo}-${hi} is outside ${path.basename(file)} (${lines.length} lines)`, id); continue; }
    scope = lines.slice(lo - 1, hi).join('\n');
  }
  if (/\.html?$/i.test(file)) scope = stripHtml(scope);
  if (!norm(scope).includes(norm(c.quote))) { fail('quote', `quote not found in ${c.source}: "${c.quote.slice(0, 70)}"`, id); continue; }
  ok();
  if (c.kind === 'command' && lo && lo === hi) {
    const srcLines = text.split('\n'); const line = srcLines[lo - 1];
    const after = norm(line).split(norm(c.text))[1];
    if (after !== undefined && /^\s*#/.test(after)) warns.push(`claim ${id}: the repo's command line carries a comment "${after.trim().slice(0, 40)}" that the row drops. Keep it (a Linux/macOS variant lives in comments).`);
    const nxt = (srcLines[lo] || '').trim();
    if (/^#\s*\S+/.test(nxt) && !srcLines[lo - 1].trim().startsWith('#')) commentSiblings.push({ id, nxt });
  }
}
const corpus = norm(ledger.claims.map((c) => `${c.text || ''} ${c.quote || ''}`).join(' \n '));
const inLedger = (s) => corpus.includes(norm(s));
for (const { id, nxt } of commentSiblings) if (!inLedger(nxt)) warns.push(`claim ${id}: the repo's block has a following comment line "${nxt.slice(0, 50)}" (usually the other OS's command) that no row carries. Add a row for it and keep it in the README block.`);

// ---- 2. README text -> ledger
const lines = readme.split('\n'); const prose = [];
let fence = null, fenceLang = '';
lines.forEach((ln, i) => {
  const f = ln.match(/^\s*(```+|~~~+)\s*(\S*)/);
  if (f) { if (!fence) { fence = f[1][0]; fenceLang = f[2]; } else if (f[1][0] === fence) fence = null; return; }
  if (fence) {
    if (!ln.trim()) return;
    if (inLedger(ln)) ok(); else fail('readme-code', `README line ${i + 1}: code line is not in any ledger row: "${ln.trim().slice(0, 80)}"${/\\\s*$/.test(ln) ? ' (a line ending in a backslash continuation needs its own row: one row per physical line, see ledger.md)' : ''}`);
  } else prose.push({ n: i + 1, t: ln });
});
let inComment = false;
for (const { n, t } of prose) {
  let s = t;
  if (/<!--/.test(s)) inComment = true; if (inComment) { if (/-->/.test(s)) inComment = false; continue; }
  for (const m of s.matchAll(/`([^`]+)`/g)) {
    const code = m[1];
    const pathy = /^[\w./-]+$/.test(code) && (fs.existsSync(path.join(repo, code)) || fs.existsSync(path.join(out, code)));
    if (pathy || inLedger(code)) ok(); else fail('readme-code', `README line ${n}: inline code \`${code.slice(0, 60)}\` is not in the ledger and is not an existing path`);
  }
  s = s.replace(/`[^`]*`/g, ' ').replace(/\]\([^)]*\)/g, '] ').replace(/<(?:[^>"']|"[^"]*"|'[^']*')*>/g, ' ').replace(/^\s*\d+[.)]\s/, '').replace(/https?:\/\/\S+/g, ' ');
  for (const m of s.matchAll(/(?<![\w.])\d[\d,]*(?:\.\d+)?(?![\w])/g)) {
    const re = new RegExp(`(?<![\\d.])${m[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\d])`);
    if (re.test(corpus)) ok(); else fail('readme-number', `README line ${n}: number "${m[0]}" is not in any ledger row`);
  }
  // hype words: prose and html text
  const lower = ` ${s.toLowerCase()} `;
  for (const w of HYPE) if (new RegExp(`(?<![a-z])${w.replace(/-/g, '[- ]')}(?![a-z])`).test(lower)) fail('hype', `README line ${n}: banned word "${w}"`);
}
// alt text and html attributes carry prose too
for (const m of readme.matchAll(/\balt="([^"]*)"|!\[([^\]]*)\]/g)) {
  const alt = m[1] ?? m[2] ?? '';
  for (const w of HYPE) if (new RegExp(`(?<![a-z])${w.replace(/-/g, '[- ]')}(?![a-z])`, 'i').test(alt)) fail('hype', `alt text contains banned word "${w}"`);
  if (/\*\*|&quot;|&amp;|&#|\s->\s/.test(alt)) fail('alt', `alt text looks like a raw transcript (markdown asterisks, HTML entities or "->"): write one or two plain sentences saying what the image shows: "${alt.slice(0, 60)}"`);
  if (alt.trim().length < 15) fail('alt', 'alt text is missing or too short to describe the image');
}
// first screen: the what/who sentence should come before the first visual
{ const vis = lines.findIndex((l) => /<picture|<img|!\[/.test(l));
  const h1 = lines.findIndex((l) => /^#\s/.test(l));
  let firstProse = -1, fenceX = false;
  lines.forEach((l, i) => { if (firstProse >= 0 || i <= h1) return; if (/^\s*```/.test(l)) fenceX = !fenceX; if (!fenceX && l.trim() && !/^\s*[<#!|>`-]/.test(l)) firstProse = i; });
  if (vis >= 0 && firstProse > vis) warns.push('first screen: the one-sentence what/who comes AFTER the visual. Put it directly under the H1 (references/readme-structure.md).'); }

// ---- 3. beats and the Reel
const beatsPath = path.join(out, 'beats.json'); const assetsDir = path.join(out, 'assets');
const svgs = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir).filter((f) => /^reel-(light|dark)\.svg$/.test(f)) : [];
if (fs.existsSync(beatsPath)) {
  let b; try { b = JSON.parse(fs.readFileSync(beatsPath, 'utf8')); } catch (e) { fail('beats', 'beats.json is not valid JSON: ' + e.message); b = null; }
  if (b) {
    const allowed = [];
    for (const [i, beat] of (b.beats || []).entries()) {
      const c = byId.get(beat.claim);
      if (!c) { fail('beats', `beat ${i + 1} cites claim "${beat.claim}" which is not in the ledger`); continue; }
      const t = norm(beat.text.replace(/(\.\.\.|…)$/, ''));
      if (!norm(`${c.quote} ${c.text}`).includes(t) && !norm(c.quote).includes(t)) fail('beats', `beat ${i + 1} text is not verbatim from claim ${beat.claim}: "${beat.text.slice(0, 60)}"`);
      else if (beat.source !== c.source) fail('beats', `beat ${i + 1} source "${beat.source}" differs from claim ${beat.claim} source "${c.source}"`);
      else ok();
      allowed.push(norm(beat.text));
      if (/\*\*|__[^_]+__|\]\(|&quot;|&amp;|`/.test(beat.text)) fail('beats', `beat ${i + 1} text contains markdown or entities ("${beat.text.slice(0, 40)}"); put the cleaned text in the ledger row's "text" and keep the raw line in "quote"`);
    }
    { const w = (t) => t.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
      const bs = (b.beats || []).map((x) => w(x.text)); const grams = (a) => { const g = new Set(); for (let i = 0; i + 3 <= a.length; i++) g.add(a.slice(i, i + 3).join(' ')); return g; };
      const gs = bs.map(grams); const shared = (x, y) => [...x].some((g) => y.has(g));
      if (gs.length >= 2 && bs.every((a) => a.length >= 3)) { const chain = gs.slice(0, -1).every((g, i) => shared(g, gs[i + 1])) || shared(gs[0], gs[gs.length - 1]);
        if (!chain) warns.push('beats: the beats share no 3-word phrase, so the Reel may imply a cause-and-effect the files do not show. Choose a CHECK and OUTPUT that visibly name the same item as the INPUT (references/beats.md).'); } }
    for (const f of svgs) {
      const svg = fs.readFileSync(path.join(assetsDir, f), 'utf8');
      const texts = [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
      const fixed = new Set(['INPUT', 'CHECK', 'OUTPUT', 'GAP']);
      const files = new Set((b.beats || []).map((x) => x.source.replace(/:[\d-]+$/, '')));
      const rest = norm(texts.filter((t) => !fixed.has(t) && !files.has(t)).join(' '));
      if (rest === norm(allowed.join(' '))) ok(); else fail('reel-text', `${f} contains text that is not exactly the beats' text (hand-edited or stale?). Re-run scripts/reel.mjs.`);
    }
  }
} else if (svgs.length) fail('beats', 'assets/reel-*.svg exist but beats.json is missing from the output directory, so on-screen text cannot be checked');

// ---- 4. links and images
const refs = [];
for (const m of readme.matchAll(/!?\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) refs.push(m[1]);
for (const m of readme.matchAll(/\b(?:src|href|srcset)="([^"]+)"/g)) refs.push(...m[1].split(',').map((x) => x.trim().split(/\s+/)[0]));
for (const r of refs) {
  if (/^(https?:|mailto:|#|data:)/i.test(r)) continue;
  const clean = decodeURIComponent(r.split('#')[0].split('?')[0]); if (!clean) continue;
  const a = path.join(out, clean), b2 = path.join(repo, clean);
  if (fs.existsSync(a) || fs.existsSync(b2)) ok(); else fail('link', `relative link/image does not resolve (outdir or repo): ${r}`);
}

// ---- 5. badges
for (const r of refs.filter((x) => BADGE_RE.test(x))) {
  if (ledger.claims.some((c) => c.kind === 'badge' && c.text.includes(r))) ok();
  else fail('badge', `badge ${r.slice(0, 70)} has no ledger row with kind "badge" whose text is that URL (and a source proving the thing exists)`);
}

// ---- 6. asset budget
if (fs.existsSync(assetsDir)) {
  let total = 0; const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else { const sz = fs.statSync(p).size; total += sz; if (/\.svg$/i.test(e.name) && sz > 150 * 1024) fail('budget', `${path.relative(out, p)} is ${sz} bytes (> 150 KB)`); if (!refs.some((r) => r.endsWith(e.name)) && !/^reel-final/.test(e.name)) warns.push(`asset not referenced by README: ${path.relative(out, p)}`); } } };
  walk(assetsDir);
  if (total > 6 * 1024 * 1024) fail('budget', `assets total ${total} bytes (> 6 MB hard limit)`); else ok();
  if (total > 1.5 * 1024 * 1024) warns.push(`assets total ${(total / 1048576).toFixed(2)} MB (> 1.5 MB target)`);
}

// ---- 7. structure
if (lines.some((l) => /^#{2,3}\s.*limit/i.test(l))) ok(); else fail('structure', 'README has no "Limits" heading (## Limits ...); every README states what the project does not do');
if (ledger.claims.some((c) => c.status === 'unverified') && !/unverified|not run|not been run/i.test(readme)) fail('unverified', 'ledger has unverified claims but the README never says "unverified" (one footnote line is enough)');
{ const n = (readme.match(/unverified/gi) || []).length; if (n > 2) warns.push(`README says "unverified" ${n} times; use one footnote line, and mark commands with an existing output as status "artifact" instead.`); }

for (const w of warns) console.log('WARN: ' + w);
for (const f of fails) console.log(f);
console.log(`verify: ${checks} checks passed, ${fails.length} failed, ${warns.length} warnings`);
process.exit(fails.length ? 1 : 0);
