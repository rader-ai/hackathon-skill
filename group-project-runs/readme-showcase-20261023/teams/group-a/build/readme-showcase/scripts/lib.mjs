// lib.mjs - shared helpers for readme-showcase scripts. Node >= 18, no dependencies.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export class UsageError extends Error {}

export const HERE = path.dirname(fileURLToPath(import.meta.url));

export function readText(p, what) {
  if (!p) throw new UsageError(`missing ${what} path`);
  if (!fs.existsSync(p)) throw new UsageError(`${what} not found: ${path.resolve(p)}`);
  if (!fs.statSync(p).isFile()) throw new UsageError(`${what} is not a file: ${path.resolve(p)}`);
  return fs.readFileSync(p, 'utf8');
}
export function readJson(p, what) {
  const t = readText(p, what);
  try { return JSON.parse(t); } catch (e) { throw new UsageError(`${what} is not valid JSON (${path.resolve(p)}): ${e.message}`); }
}

export function loadBanned(file = path.join(HERE, '..', 'references', 'banned-words.txt')) {
  const t = readText(file, 'banned-words list');
  const words = t.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
  return words.map((w) => ({ word: w, re: new RegExp(`(^|[^\\w])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/[- ]/g, '[- ]')}(?![\\w])`, 'i') }));
}

export const norm = (s) => String(s).toLowerCase().replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim();

// ---- ledger -------------------------------------------------------------------------------
export const KINDS = new Set(['command', 'path', 'generated_path', 'requirement', 'number', 'badge', 'output', 'why', 'url', 'term', 'flag', 'license', 'format', 'other']);
export const STATUSES = new Set(['PINNED', 'UNKNOWN', 'UNPARSED']);

export function validateLedgerShape(L) {
  const errs = [];
  if (!L || typeof L !== 'object' || Array.isArray(L)) return ['ledger must be a JSON object'];
  if (!Array.isArray(L.claims)) errs.push('ledger.claims must be an array');
  else {
    const ids = new Set();
    L.claims.forEach((c, i) => {
      const w = `claims[${i}]${c && c.id ? ` (${c.id})` : ''}`;
      if (!c || typeof c !== 'object') { errs.push(`${w}: not an object`); return; }
      if (!c.id) errs.push(`${w}: missing id`); else if (ids.has(c.id)) errs.push(`${w}: duplicate id`); else ids.add(c.id);
      if (!STATUSES.has(c.status)) errs.push(`${w}: status must be one of PINNED, UNKNOWN, UNPARSED (got ${JSON.stringify(c.status)})`);
      if (!KINDS.has(c.kind)) errs.push(`${w}: kind must be one of ${[...KINDS].join(', ')} (got ${JSON.stringify(c.kind)})`);
      if (!c.text) errs.push(`${w}: missing text`);
      if (c.status === 'PINNED' && (!Array.isArray(c.evidence) || !c.evidence.length)) errs.push(`${w}: PINNED claim needs evidence[] with {file, quote}`);
      for (const [j, ev] of (c.evidence || []).entries()) if (!ev || !ev.file) errs.push(`${w}: evidence[${j}] needs file`);
    });
  }
  return errs;
}

// Resolve an evidence file: relative to the repo, else to the ledger's own directory.
export function resolveEvidence(file, repo, ledgerDir) {
  const cands = [];
  if (repo) cands.push(path.resolve(repo, file));
  if (ledgerDir) cands.push(path.resolve(ledgerDir, file));
  cands.push(path.resolve(file));
  return cands.find((c) => fs.existsSync(c) && fs.statSync(c).isFile()) || null;
}

// ---- markdown (line based; good enough for READMEs, honest about what it skips) ------------
export function parseMarkdown(text) {
  const lines = text.split('\n');
  const fences = []; const proseLines = [];
  let cur = null;
  lines.forEach((ln, i) => {
    const f = /^(\s*)(```+|~~~+)\s*([\w+-]*)/.exec(ln);
    if (cur) {
      if (f && f[2][0] === cur.mark[0] && f[2].length >= cur.mark.length && ln.trim() === f[2]) { cur.end = i + 1; fences.push(cur); cur = null; }
      else cur.lines.push({ n: i + 1, text: ln });
      return;
    }
    if (f) { cur = { lang: (f[3] || '').toLowerCase(), mark: f[2], start: i + 1, lines: [] }; return; }
    proseLines.push({ n: i + 1, text: ln });
  });
  if (cur) { cur.unclosed = true; fences.push(cur); }
  return { lines, fences, proseLines };
}

export function extractImages(proseLines) {
  const out = [];
  for (const { n, text } of proseLines) {
    for (const m of text.matchAll(/!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g)) out.push({ line: n, alt: m[1], src: m[2], via: 'md' });
    for (const m of text.matchAll(/<img\b[^>]*>/gi)) {
      const src = /src\s*=\s*["']([^"']+)["']/i.exec(m[0]); const alt = /alt\s*=\s*["']([^"']*)["']/i.exec(m[0]);
      if (src) out.push({ line: n, alt: alt ? alt[1] : null, src: src[1], via: 'img' });
    }
    for (const m of text.matchAll(/<source\b[^>]*srcset\s*=\s*["']([^"' ]+)[^"']*["'][^>]*>/gi)) out.push({ line: n, alt: '(picture source)', src: m[1], via: 'source', isSource: true });
  }
  return out;
}
export function extractLinks(proseLines) {
  const out = [];
  for (const { n, text } of proseLines) {
    const t = text.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
    for (const m of t.matchAll(/\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g)) out.push({ line: n, text: m[1], href: m[2] });
    for (const m of t.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["']/gi)) out.push({ line: n, text: '', href: m[1] });
  }
  return out;
}
export function extractInlineCode(proseLines) {
  const out = [];
  for (const { n, text } of proseLines) for (const m of text.matchAll(/`([^`\n]+)`/g)) out.push({ line: n, code: m[1] });
  return out;
}
export const isRemote = (s) => /^(https?:)?\/\//i.test(s) || /^(mailto:|data:)/i.test(s);
export const isBadgeUrl = (s) => /shields\.io|badge\.fury\.io|badgen\.net|travis-ci\.|circleci\.com|codecov\.io|coveralls\.io|badge\.svg|\/badge\b|badges\./i.test(s);

// joined shell commands from a fence: handles "\" continuation, "$ " prompts, comments
export function fenceCommands(fence) {
  const cmds = []; let buf = null; let startN = 0;
  for (const { n, text } of fence.lines) {
    let t = text.trim();
    if (!buf) { if (!t || t.startsWith('#')) continue; startN = n; buf = ''; }
    t = t.replace(/^[$>]\s+/, (m) => (buf === '' ? '' : m));
    const cont = /\\$/.test(t);
    buf += (buf ? ' ' : '') + t.replace(/\\$/, '').trim();
    if (!cont) { cmds.push({ line: startN, cmd: buf.replace(/\s+#\s.*$/, '').replace(/\s+/g, ' ').trim() }); buf = null; }
  }
  if (buf) cmds.push({ line: startN, cmd: buf.trim() });
  return cmds;
}
export const SHELL_LANGS = new Set(['bash', 'sh', 'shell', 'console', 'zsh', 'terminal', 'cmd', 'powershell', 'ps1']);
export const looksLikeShell = (fence) => SHELL_LANGS.has(fence.lang) || (fence.lang === '' && fence.lines.some((l) => /^\s*\$\s+\S/.test(l.text)));

export function tokens(s) { return norm(s).split(/[^a-z0-9']+/).filter(Boolean); }
export const STOP = new Set('a an the and or of to in on for with by from is are was be as at it its this that these those your you we our can will into over under via per not no but if so than then also any all each more most one two'.split(' '));
export const GENERIC = new Set('tool project application app library framework solution platform simple easy modern lightweight small tiny fast new better great useful system software package program utility helper kit toolkit suite engine service thing stuff'.split(' '));
