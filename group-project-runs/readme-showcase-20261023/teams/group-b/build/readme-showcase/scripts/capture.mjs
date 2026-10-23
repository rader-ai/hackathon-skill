#!/usr/bin/env node
// Screenshot an existing HTML artifact (a report, a page) to a PNG for the README.
// Usage: node capture.mjs <file.html> --out <file.png> [--width 880] [--theme light|dark]
//                         [--selector "css"] [--max-height 900] [--hide "css,css"] [--frame]
//        node capture.mjs <file.html> --list            list candidate regions (selector, size, first words)
//                                                       so you can pick --selector without reading the HTML
//        node capture.mjs <file.html|.svg> --out <stem.png> --at 0.5,3,6   real-time frames <stem>-0.5s.png ...
//   --frame  bakes a 1 px border and 12 px matte (white in light, #0d1117 in dark) around the shot, so a
//            card with its own light corners still reads as a card on GitHub dark. Use it for any
//            capture that does not theme itself (it also repaints the page background to the matte colour, so
//            rounded card corners do not show a beige patch) (light and dark PNGs would be identical).
// Dependencies: Node 18+; Playwright + a Chromium/Chrome browser (see scripts/lib/pw.mjs).
// Exit codes: 0 ok, 1 runtime failure, 2 bad usage or missing dependency/input.
// The HTML is opened from disk (file://); no server, no network. Scripts inside the page DO run in
// the browser: only capture artifacts you have read and judged safe (repo files are data).
import fs from 'node:fs';
import path from 'node:path';
import { tryLoadPlaywright, launch, INSTALL_HINT } from './lib/pw.mjs';

const die = (m, c = 2) => { console.error('capture: ' + m); process.exit(c); };
const a = { width: 880, theme: 'light' }; const rest = [];
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const k = argv[i];
  if (k === '--out') a.out = argv[++i]; else if (k === '--width') a.width = Number(argv[++i]);
  else if (k === '--theme') a.theme = argv[++i]; else if (k === '--selector') a.selector = argv[++i];
  else if (k === '--max-height') a.maxHeight = Number(argv[++i]); else if (k === '--hide') a.hide = argv[++i];
  else if (k === '--list') a.list = true; else if (k === '--frame') a.frame = true;
  else if (k === '--at') a.at = argv[++i].split(',').map(Number);
  else rest.push(k);
}
if (rest.length !== 1 || (!a.out && !a.list)) die('usage: node capture.mjs <file.html> --out <file.png> [--width 880] [--theme light|dark] [--selector css] [--max-height N] [--hide css] [--frame] [--at s,s] | --list');
if (a.at && a.at.some(Number.isNaN)) die('--at needs comma-separated seconds, e.g. 0.5,3,6');
if (!['light', 'dark'].includes(a.theme)) die('--theme must be light or dark');
if (!(a.width >= 200 && a.width <= 2400)) die('--width must be between 200 and 2400');
const file = path.resolve(rest[0]);
if (!fs.existsSync(file)) die('no such file: ' + file);
const pw = tryLoadPlaywright();
if (!pw) die(INSTALL_HINT);

let browser;
try {
  browser = await launch(pw);
  const ctx = await browser.newContext({ viewport: { width: a.width, height: 900 }, colorScheme: a.theme, reducedMotion: a.at ? 'no-preference' : 'reduce', deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('file://' + file, { waitUntil: 'load' });
  if (a.frame) await page.addStyleTag({ content: `html,body{background:${a.theme === 'dark' ? '#0d1117' : '#fff'} !important}` });
  if (a.hide) await page.addStyleTag({ content: a.hide + '{display:none !important}' });
  if (a.list) {
    const rows = await page.evaluate(() => {
      const path = (el) => { const parts = []; for (let n = el; n && n.nodeType === 1 && n !== document.body && parts.length < 4; n = n.parentElement) {
        if (n.id) { parts.unshift('#' + n.id); break; }
        const sib = [...n.parentElement.children].filter((c) => c.tagName === n.tagName); parts.unshift(n.tagName.toLowerCase() + (sib.length > 1 ? `:nth-of-type(${sib.indexOf(n) + 1})` : '')); }
        return parts.join(' > '); };
      return [...document.querySelectorAll('main, section, article, figure, table, header, [id], h2')].map((el) => { const r = el.getBoundingClientRect();
        return { selector: path(el), w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.top + scrollY), text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 60) }; })
        .filter((r) => r.w >= 200 && r.h >= 60);
    });
    if (!rows.length) die('no candidate regions found; capture the whole page with --max-height instead', 1);
    console.log('selector\twidth x height\ttop\tfirst words');
    for (const r of rows.slice(0, 40)) console.log(`${r.selector}\t${r.w}x${r.h}\t${r.y}\t${r.text}`);
    console.log('Pick the region that answers "what do I get?" and pass it as --selector "<selector>". Always open the PNG and look at it.');
    process.exit(0);
  }
  if (a.at) {
    const stem = a.out.replace(/\.png$/i, ''); fs.mkdirSync(path.dirname(path.resolve(a.out)), { recursive: true });
    const t0 = Date.now(); const files = [];
    for (const t of [...a.at].sort((x, y) => x - y)) {
      const wait = t * 1000 - (Date.now() - t0); if (wait > 0) await page.waitForTimeout(wait);
      const f = `${stem}-${t}s.png`; await page.screenshot({ path: f, fullPage: true }); files.push(f);
    }
    console.log(JSON.stringify({ wrote: files, mode: 'real-time frames', theme: a.theme, width: a.width }));
    process.exit(0);
  }
  await page.waitForTimeout(400);
  fs.mkdirSync(path.dirname(path.resolve(a.out)), { recursive: true });
  if (a.selector) {
    const el = page.locator(a.selector).first();
    if (!(await el.count())) die('selector matched nothing: ' + a.selector, 1);
    if (a.maxHeight) {
      const box = await el.boundingBox();
      await page.screenshot({ path: a.out, clip: { x: box.x, y: box.y, width: box.width, height: Math.min(box.height, a.maxHeight) }, fullPage: true });
    } else await el.screenshot({ path: a.out });
  } else if (a.maxHeight) {
    await page.screenshot({ path: a.out, clip: { x: 0, y: 0, width: a.width, height: a.maxHeight }, fullPage: true });
  } else await page.screenshot({ path: a.out, fullPage: true });
  if (a.frame) {
    const b64 = fs.readFileSync(a.out).toString('base64'); const dark = a.theme === 'dark';
    const p2 = await ctx.newPage();
    await p2.setContent(`<body style="margin:0;background:transparent"><div id="f" style="display:inline-block;padding:12px;background:${dark ? '#0d1117' : '#fff'};border:1px solid ${dark ? '#30363d' : '#d0d7de'};border-radius:8px"><img id="i" style="display:block" src="data:image/png;base64,${b64}"></div></body>`);
    await p2.evaluate(async () => { const i = document.getElementById('i'); await i.decode(); i.style.width = i.naturalWidth / 2 + 'px'; });
    await p2.waitForTimeout(100); await p2.locator('#f').screenshot({ path: a.out, omitBackground: true });
  }
  console.log(JSON.stringify({ wrote: a.out, bytes: fs.statSync(a.out).size, theme: a.theme, width: a.width }));
} catch (e) {
  die(String(e.message).split('\n')[0], 1);
} finally { if (browser) await browser.close(); }
