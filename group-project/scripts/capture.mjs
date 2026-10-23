#!/usr/bin/env node
// Capture frames (and optionally a looping GIF) from an animated HTML build.
//
// Usage:
//   node capture.mjs <build.html> --out <dir> [--times 0,1.25,2.5,3.75] [--size 720x420]
//                    [--loop 5] [--gif] [--reduced-motion] [--grayscale-blur]
//
// It records the page in real time and pulls frames out of the video, so every animation is
// caught - including ones inside <use> shadow trees, which pausing via getAnimations() misses.
// --times are seconds after the page finished loading. --gif writes one loop (--loop seconds)
// starting 2s in. Prints a JSON summary of the files written.
//
// Needs Node 18+, ffmpeg on PATH, and the playwright package. If playwright isn't installed:
//   npm install --prefix ~/.cache/group-project playwright
// Uses an installed Google Chrome when present, otherwise Playwright's own Chromium.

import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

function fail(msg) {
  console.error(`capture: ${msg}`);
  process.exit(1);
}

function parseArgs(argv) {
  const a = { times: [0, 1.25, 2.5, 3.75], size: [720, 420], loop: 5, gif: false, reduced: false, blur: false };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--out') a.out = argv[++i];
    else if (k === '--times') a.times = argv[++i].split(',').map(Number);
    else if (k === '--size') a.size = argv[++i].split('x').map(Number);
    else if (k === '--loop') a.loop = Number(argv[++i]);
    else if (k === '--gif') a.gif = true;
    else if (k === '--reduced-motion') a.reduced = true;
    else if (k === '--grayscale-blur') a.blur = true;
    else rest.push(k);
  }
  if (rest.length !== 1 || !a.out) fail('usage: node capture.mjs <build.html> --out <dir> [--times ...] [--size WxH] [--loop s] [--gif] [--reduced-motion] [--grayscale-blur]');
  if (a.times.some(Number.isNaN) || a.size.length !== 2 || a.size.some(Number.isNaN) || Number.isNaN(a.loop)) fail('bad --times, --size or --loop value');
  a.file = path.resolve(rest[0]);
  if (!fs.existsSync(a.file)) fail(`no such file: ${a.file}`);
  return a;
}

function loadPlaywright() {
  const places = [process.cwd(), path.join(os.homedir(), '.cache', 'group-project')];
  for (const dir of places) {
    try {
      return createRequire(path.join(dir, 'noop.js'))('playwright');
    } catch { /* try the next place */ }
  }
  fail('playwright is not installed. Run: npm install --prefix ~/.cache/group-project playwright');
}

function ffmpeg(args) {
  try {
    execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: ['ignore', 'ignore', 'pipe'] });
  } catch (e) {
    fail(`ffmpeg failed: ${e.stderr ? e.stderr.toString().trim() : e.message}`);
  }
}

const args = parseArgs(process.argv.slice(2));
try { execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' }); } catch { fail('ffmpeg is not on PATH'); }
const { chromium } = loadPlaywright();

const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch(fs.existsSync(chrome) ? { executablePath: chrome } : {});
const [width, height] = args.size;
const videoDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gp-capture-'));
const contextOptions = {
  viewport: { width, height },
  reducedMotion: args.reduced ? 'reduce' : 'no-preference',
  recordVideo: { dir: videoDir, size: { width, height } },
};

// The first recorded context in a fresh browser can come out mis-sized, so burn one first.
const warm = await browser.newContext({ ...contextOptions, recordVideo: { dir: path.join(videoDir, 'warmup'), size: { width, height } } });
await (await warm.newPage()).goto('about:blank');
await warm.close();

const context = await browser.newContext(contextOptions);
const startedAt = Date.now();
const page = await context.newPage();
await page.goto('file://' + args.file, { waitUntil: 'load' });
if (args.blur) await page.addStyleTag({ content: 'html{filter:grayscale(1) blur(1.5px)}' });
// Paint the whole frame in the page's own background so short pages don't leave grey bands.
await page.evaluate(() => { document.documentElement.style.background = getComputedStyle(document.body).backgroundColor; });
const loadedAt = (Date.now() - startedAt) / 1000;
const needed = Math.max(...args.times, args.gif ? 2 + args.loop : 0) + 0.5;
await page.waitForTimeout(needed * 1000);
const video = await page.video().path();
await context.close();
await browser.close();

fs.mkdirSync(args.out, { recursive: true });
// Name files after the team and build folders (e.g. warm-hands-build-v2) so teams never collide.
const buildDir = path.dirname(args.file);
const tag = `${path.basename(path.dirname(buildDir))}-${path.basename(buildDir)}` + (args.reduced ? '-reduced' : '') + (args.blur ? '-blur' : '');
const written = { frames: [], gif: null, loadedAt };
for (const t of args.times) {
  const png = path.join(args.out, `${tag}-${t.toFixed(2)}s.png`);
  ffmpeg(['-ss', String(loadedAt + t), '-i', video, '-frames:v', '1', png]);
  written.frames.push(png);
}
if (args.gif) {
  const gif = path.join(args.out, `${tag}.gif`);
  ffmpeg(['-ss', String(loadedAt + 2), '-t', String(args.loop), '-i', video, '-vf',
    'fps=20,split[a][b];[a]palettegen=stats_mode=diff:max_colors=96[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle',
    '-loop', '0', gif]);
  written.gif = gif;
}
fs.rmSync(videoDir, { recursive: true, force: true });
console.log(JSON.stringify(written, null, 2));
