// Shared Playwright loader. Optional dependency: only reel.mjs (PNG) and capture.mjs need it.
// Search order: $READMESHOWCASE_PLAYWRIGHT_DIR, the current directory, this skill's directory,
// then ~/.cache/readme-showcase. Install with:  npm install --prefix ~/.cache/readme-showcase playwright
//                                              npx --prefix ~/.cache/readme-showcase playwright install chromium
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const INSTALL_HINT =
  'Playwright is not installed. Run:\n' +
  '  npm install --prefix ~/.cache/readme-showcase playwright\n' +
  '  npx --prefix ~/.cache/readme-showcase playwright install chromium\n' +
  '(or set READMESHOWCASE_PLAYWRIGHT_DIR to a directory whose node_modules contains playwright)';

export function tryLoadPlaywright() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const dirs = [process.env.READMESHOWCASE_PLAYWRIGHT_DIR, process.cwd(), path.join(here, '..', '..'),
    path.join(os.homedir(), '.cache', 'readme-showcase')].filter(Boolean);
  for (const d of dirs) {
    try { return createRequire(path.join(path.resolve(d), 'noop.js'))('playwright'); } catch { /* next */ }
  }
  return null;
}

// Launch Chromium. Prefers an installed Google Chrome, else Playwright's Chromium.
// Throws an Error with a plain-language message if no browser can start.
export async function launch(pw) {
  const chromes = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
  const exe = chromes.find((p) => fs.existsSync(p));
  try {
    return await pw.chromium.launch(exe ? { executablePath: exe } : {});
  } catch (e) {
    throw new Error('could not start a browser (' + String(e.message).split('\n')[0] +
      '). Run: npx --prefix ~/.cache/readme-showcase playwright install chromium');
  }
}
