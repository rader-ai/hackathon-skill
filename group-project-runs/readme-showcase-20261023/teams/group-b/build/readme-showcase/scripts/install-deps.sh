#!/usr/bin/env bash
# Install the optional browser dependency (Playwright + Chromium, ~150 MB) into ~/.cache/readme-showcase.
# Ask the user before running this if they have not agreed to a download. Exit 0 = capture.mjs can run.
set -eu
D="${READMESHOWCASE_PLAYWRIGHT_DIR:-$HOME/.cache/readme-showcase}"
mkdir -p "$D"
npm install --prefix "$D" playwright
npx --prefix "$D" playwright install chromium
echo "install-deps: Playwright installed in $D. Re-run selftest.sh; it should now print 'COMPLETE'."
