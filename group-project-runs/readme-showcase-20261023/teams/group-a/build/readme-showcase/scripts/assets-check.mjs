#!/usr/bin/env node
// assets-check.mjs - size, dimensions and light/dark pairing of README assets.
// Usage: node assets-check.mjs <assets-dir> [--budget-bytes 6291456] [--target-bytes 1572864] [--allow-empty] [--min-width 880]
// Rules: total <= budget (FAIL; default 6 MB), > target is a WARN; every NAME-light.EXT needs NAME-dark.EXT with
// identical dimensions (and vice versa) unless NAME is listed in <assets-dir>/PAIR-EXCEPTIONS.txt (one name per line);
// PNG/GIF/JPEG raster width >= min-width (so text is >= 14px when shown at 880px); SVG must declare a viewBox or width.
// Exit 0 pass, 1 fail, 2 bad input. Node >= 18, no deps.
import fs from 'node:fs';
import path from 'node:path';
import { UsageError } from './lib.mjs';

function dims(file) {
  const b = fs.readFileSync(file); const ext = path.extname(file).toLowerCase();
  if (ext === '.png') { if (b.length < 24 || b.toString('ascii', 1, 4) !== 'PNG') throw new Error('not a valid PNG'); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }; }
  if (ext === '.gif') { if (b.toString('ascii', 0, 3) !== 'GIF') throw new Error('not a valid GIF'); return { w: b.readUInt16LE(6), h: b.readUInt16LE(8) }; }
  if (ext === '.jpg' || ext === '.jpeg') { let i = 2; while (i < b.length) { if (b[i] !== 0xff) { i++; continue; } const m = b[i + 1]; if (m >= 0xc0 && m <= 0xc3) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) }; i += 2 + b.readUInt16BE(i + 2); } throw new Error('no JPEG size marker'); }
  if (ext === '.svg') {
    const t = b.toString('utf8'); const vb = /viewBox\s*=\s*["']\s*[-\d.]+[ ,]+[-\d.]+[ ,]+([\d.]+)[ ,]+([\d.]+)/.exec(t);
    if (vb) return { w: Math.round(+vb[1]), h: Math.round(+vb[2]), vector: true };
    const w = /<svg[^>]*\swidth\s*=\s*["']([\d.]+)/.exec(t), h = /<svg[^>]*\sheight\s*=\s*["']([\d.]+)/.exec(t);
    if (w && h) return { w: Math.round(+w[1]), h: Math.round(+h[1]), vector: true };
    throw new Error('SVG has neither viewBox nor width/height');
  }
  return null;
}

export function assetsCheck(dir, o = {}) {
  const budget = o.budget ?? 6 * 1024 * 1024, target = o.target ?? 1.5 * 1024 * 1024, minW = o.minWidth ?? 880;
  if (!dir) throw new UsageError('need <assets-dir>');
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) throw new UsageError(`assets dir not found: ${path.resolve(dir)}`);
  const R = []; const add = (level, msg) => R.push({ level, msg });
  const files = fs.readdirSync(dir, { recursive: true }).map(String).filter((f) => fs.statSync(path.join(dir, f)).isFile()).sort();
  const exc = new Set(fs.existsSync(path.join(dir, 'PAIR-EXCEPTIONS.txt')) ? fs.readFileSync(path.join(dir, 'PAIR-EXCEPTIONS.txt'), 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')) : []);
  const imgs = files.filter((f) => /\.(png|gif|jpe?g|svg|webp)$/i.test(f));
  if (!imgs.length) { if (o.allowEmpty) add('NOTE', 'no images (allowed: the visual verdict was "none")'); else add('FAIL', 'no images in the assets dir. If the visual verdict is "none", pass --allow-empty and say why in the ledger.'); }
  let total = 0; const D = {};
  for (const f of files) {
    const sz = fs.statSync(path.join(dir, f)).size; total += sz;
    if (!imgs.includes(f)) continue;
    let d = null;
    try { d = dims(path.join(dir, f)); } catch (e) { add('FAIL', `${f}: unreadable image (${e.message})`); continue; }
    D[f] = d;
    add('NOTE', `${f}: ${d ? `${d.w}x${d.h}${d.vector ? ' (vector)' : ''}` : 'dimensions unknown (webp)'}, ${(sz / 1024).toFixed(0)} KB`);
    if (d && !d.vector && d.w < minW) add('FAIL', `${f}: ${d.w}px wide < ${minW}; text will be smaller than 14px at the 880px display width. Re-capture at a wider viewport or 2x scale.`);
    if (sz > 2 * 1024 * 1024) add('WARN', `${f}: ${(sz / 1048576).toFixed(1)} MB for one image`);
  }
  for (const f of imgs) {
    const m = /^(.*)-(light|dark)(\.[a-z0-9]+)$/i.exec(f); if (!m) continue;
    const other = `${m[1]}-${m[2].toLowerCase() === 'light' ? 'dark' : 'light'}${m[3]}`;
    if (exc.has(m[1])) continue;
    if (!imgs.includes(other)) add('FAIL', `${f}: missing its ${m[2].toLowerCase() === 'light' ? 'dark' : 'light'} pair (${other}). Add it or list "${m[1]}" in PAIR-EXCEPTIONS.txt with a reason comment.`);
    else if (D[f] && D[other] && (D[f].w !== D[other].w || D[f].h !== D[other].h)) add('FAIL', `${f} and ${other} differ in size (${D[f].w}x${D[f].h} vs ${D[other].w}x${D[other].h}); the page would jump when the theme changes`);
  }
  if (total > budget) add('FAIL', `total ${(total / 1048576).toFixed(2)} MB exceeds the ${(budget / 1048576).toFixed(1)} MB budget`);
  else if (total > target) add('WARN', `total ${(total / 1048576).toFixed(2)} MB is over the ${(target / 1048576).toFixed(1)} MB target`);
  return { results: R, total, files };
}

if (process.argv[1] && process.argv[1].endsWith('assets-check.mjs')) {
  const a = process.argv.slice(2);
  const opt = (k) => { const i = a.indexOf(k); return i > -1 ? a[i + 1] : undefined; };
  const num = (k) => { const v = opt(k); if (v === undefined) return undefined; const n = Number(v); if (!Number.isFinite(n) || n <= 0) throw new UsageError(`${k} needs a positive number`); return n; };
  const dir = a.find((x, i) => !x.startsWith('--') && !['--budget-bytes', '--target-bytes', '--min-width'].includes(a[i - 1]));
  try {
    const { results, total, files } = assetsCheck(dir, { budget: num('--budget-bytes'), target: num('--target-bytes'), minWidth: num('--min-width'), allowEmpty: a.includes('--allow-empty') });
    for (const r of results) console.log(`${r.level.padEnd(4)} ${r.msg}`);
    const fail = results.filter((r) => r.level === 'FAIL').length;
    console.log(`assets-check: ${files.length} files, ${(total / 1048576).toFixed(2)} MB total, ${fail} FAIL`);
    console.log(fail ? 'assets-check: FAILED' : 'assets-check: PASSED');
    process.exit(fail ? 1 : 0);
  } catch (e) {
    if (e instanceof UsageError) { console.error(`assets-check: ${e.message}\nUsage: node assets-check.mjs <assets-dir> [--budget-bytes N] [--target-bytes N] [--min-width N] [--allow-empty]`); process.exit(2); }
    throw e;
  }
}
