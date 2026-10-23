#!/usr/bin/env node
// check-env.mjs - verify the tools readme-showcase needs. No dependencies.
// Usage: node check-env.mjs [--need magick,chrome,gh,ffmpeg]
// Exit 0: required tools present. Exit 2: something required is missing (install hint printed).
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const CHROME_PATHS = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean);

export function findChrome() {
  for (const p of CHROME_PATHS) if (fs.existsSync(p)) return p;
  for (const n of ['google-chrome', 'chromium', 'chromium-browser']) {
    try { return execFileSync('which', [n], { encoding: 'utf8' }).trim(); } catch {}
  }
  return null;
}
function which(n) { try { return execFileSync('which', [n], { encoding: 'utf8' }).trim() || null; } catch { return null; } }

const HINTS = {
  magick: 'ImageMagick: `brew install imagemagick` or `apt install imagemagick`. Needed only to crop screenshots.',
  chrome: 'Google Chrome or Chromium (set CHROME_BIN to its binary). Needed only for scripts/shot.mjs.',
  gh: 'GitHub CLI: https://cli.github.com . Needed only to preview GitHub rendering (`gh api markdown`).',
  ffmpeg: '`brew install ffmpeg`. Needed only for GIFs, which this skill rarely wants.',
};

export function check(need) {
  const rows = [];
  const major = Number(process.versions.node.split('.')[0]);
  rows.push({ tool: 'node', required: true, ok: major >= 18, detail: `v${process.versions.node}`, hint: 'Install Node.js 18 or newer: https://nodejs.org' });
  const finders = { magick: () => which('magick') || which('convert'), chrome: findChrome, gh: () => which('gh'), ffmpeg: () => which('ffmpeg') };
  for (const [tool, find] of Object.entries(finders)) {
    const p = find();
    rows.push({ tool, required: need.includes(tool), ok: !!p, detail: p || 'not found', hint: HINTS[tool] });
  }
  return rows;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('check-env.mjs')) {
  const i = process.argv.indexOf('--need');
  const need = i > -1 ? (process.argv[i + 1] || '').split(',').filter(Boolean) : [];
  const known = ['magick', 'chrome', 'gh', 'ffmpeg'];
  const bad = need.filter((n) => !known.includes(n));
  if (bad.length) { console.error(`check-env: unknown tool(s) in --need: ${bad.join(', ')}. Known: ${known.join(', ')}`); process.exit(2); }
  const rows = check(need);
  let missing = 0;
  for (const r of rows) {
    const tag = r.ok ? 'ok     ' : r.required ? 'MISSING' : 'absent ';
    console.log(`${tag} ${r.tool.padEnd(7)} ${r.detail}${r.required ? '' : '  (optional)'}`);
    if (!r.ok && r.required) { missing++; console.error(`  -> ${r.hint}`); }
  }
  if (missing) { console.error(`check-env: ${missing} required tool(s) missing. Fix the above, then re-run.`); process.exit(2); }
  console.log('check-env: ok');
}
