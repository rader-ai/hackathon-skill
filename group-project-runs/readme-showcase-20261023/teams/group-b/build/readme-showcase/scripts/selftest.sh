#!/usr/bin/env bash
# Self-test for the readme-showcase scripts, using the bundled fixtures. Does not touch the network
# and never modifies the fixtures (works in a temp dir). Exit 0 = every assertion held; non-zero = a script is broken.
# Dependencies: bash, Node 18+. Optional: Playwright+Chromium, gh (their tests are SKIPPED; a skip makes the run
# INCOMPLETE: exit 3 with a banner listing what was NOT tested, unless --allow-skip is given).
# Usage: selftest.sh [--allow-skip]   Exit 0 = all ran and passed (or passed with --allow-skip) | 1 = a script is broken |
#        2 = Node missing | 3 = passed but INCOMPLETE (install deps: scripts/install-deps.sh).
set -u
ALLOW_SKIP=0; [ "${1:-}" = "--allow-skip" ] && ALLOW_SKIP=1
SKIPPED=()
skip() { SKIPPED+=("$1"); echo "SKIP  $1"; }
HERE="$(cd "$(dirname "$0")" && pwd)"; SK="$(dirname "$HERE")"
FIX="$SK/fixtures"; T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT
PASS=0; FAILN=0
ok()   { echo "PASS  $1"; PASS=$((PASS+1)); }
bad()  { echo "FAIL  $1"; FAILN=$((FAILN+1)); }
# expect <name> <expected-exit> <grep-pattern-or-empty> -- cmd...
expect() { local name="$1" want="$2" pat="$3"; shift 4; local o; o="$("$@" 2>&1)"; local rc=$?
  if [ "$rc" -ne "$want" ]; then bad "$name (exit $rc, wanted $want): $(echo "$o" | head -3)"; return; fi
  if [ -n "$pat" ] && ! echo "$o" | grep -q -- "$pat"; then bad "$name (output lacks '$pat'): $(echo "$o" | head -3)"; return; fi
  ok "$name"; }
command -v node >/dev/null || { echo "selftest: node not found (need Node 18+)"; exit 2; }
node -e 'process.exit(+process.versions.node.split(".")[0] >= 18 ? 0 : 1)' || { echo "selftest: Node 18+ required"; exit 2; }

# inventory
expect "inventory: fixture ok"        0 '"readme"'          -- node "$HERE/inventory.mjs" "$FIX/tiny-lib"
expect "inventory: missing path"      2 'does not exist'    -- node "$HERE/inventory.mjs" "$T/nope"
expect "inventory: file not dir"      2 'not a directory'   -- node "$HERE/inventory.mjs" "$FIX/tiny-lib/README.md"
mkdir "$T/empty"; expect "inventory: empty dir" 2 'no files found' -- node "$HERE/inventory.mjs" "$T/empty"

# reel
mkdir -p "$T/good"; cp "$FIX/tiny-lib-out/README.md" "$FIX/tiny-lib-out/claims.json" "$FIX/tiny-lib-out/beats.json" "$T/good/"
expect "reel: renders fixture"        0 '"ok": true'        -- node "$HERE/reel.mjs" "$T/good/beats.json" --out "$T/good/assets"
for f in reel-light.svg reel-dark.svg; do
  [ -f "$T/good/assets/$f" ] && [ "$(wc -c < "$T/good/assets/$f")" -lt 153600 ] && ok "reel: $f exists and < 150 KB" || bad "reel: $f missing or too big"; done
if [ -f "$T/good/assets/reel-final.png" ]; then ok "reel: reel-final.png written"; else
  [ -f "$T/good/assets/reel-final.svg" ] && sed -i.bak 's#assets/reel-final.png#assets/reel-final.svg#' "$T/good/README.md" && skip "reel-final.png (no Playwright/Chromium; static reel-final.svg fallback written)" || bad "reel: no final frame at all"; fi
expect "reel: no pair -> exit 3"      3 'no pair'           -- node "$HERE/reel.mjs" "$FIX/tiny-lib-out/beats-nopair.json" --out "$T/np"
[ ! -e "$T/np" ] && ok "reel: no pair writes nothing" || bad "reel: no pair wrote files"
node -e '
const b=require(process.argv[1]); const w=(f,o)=>require("fs").writeFileSync(process.argv[2]+"/"+f,JSON.stringify(o));
w("four.json",{beats:[b.beats[0],b.beats[0],b.beats[0],b.beats[1]]});
w("long.json",{duration:9,beats:b.beats});
w("nosrc.json",{beats:[{type:"in",text:"x",claim:"c"},b.beats[1]]});
w("wide.json",{beats:[{...b.beats[0],text:"word ".repeat(80)},b.beats[1]]});
' "$T/good/beats.json" "$T"
expect "reel: >3 beats rejected"      1 'maximum is 3'      -- node "$HERE/reel.mjs" "$T/four.json" --out "$T/x1"
expect "reel: >8 s rejected"          1 'duration'          -- node "$HERE/reel.mjs" "$T/long.json" --out "$T/x2"
expect "reel: missing source rejected" 1 '"source" is required' -- node "$HERE/reel.mjs" "$T/nosrc.json" --out "$T/x3"
expect "reel: overlong text rejected" 1 'lines'             -- node "$HERE/reel.mjs" "$T/wide.json" --out "$T/x4"

# verify: clean pass, then three planted errors
expect "verify: clean fixture passes" 0 '0 failed'          -- node "$HERE/verify.mjs" "$FIX/tiny-lib" "$T/good"
mutate() { rm -rf "$T/m"; cp -R "$T/good" "$T/m"; }
mutate; sed -i.bak 's#"source": "clampy.py:16"#"source": "clampy_missing.py:15"#' "$T/m/claims.json"
expect "verify: dead source fails"    1 'source file does not exist' -- node "$HERE/verify.mjs" "$FIX/tiny-lib" "$T/m"
mutate; sed -i.bak 's#is `10`#is `12`#' "$T/m/README.md"
expect "verify: altered number fails" 1 'not in the ledger'  -- node "$HERE/verify.mjs" "$FIX/tiny-lib" "$T/m"
mutate; sed -i.bak 's#Two small numeric helpers#Two powerful numeric helpers#' "$T/m/README.md"
expect "verify: hype word fails"      1 'banned word "powerful"' -- node "$HERE/verify.mjs" "$FIX/tiny-lib" "$T/m"
mutate; sed -i.bak 's#"quote": "Linear interpolation between start and end."#"quote": "Smooth interpolation between start and end."#' "$T/m/claims.json"
expect "verify: false quote fails"    1 'quote not found'    -- node "$HERE/verify.mjs" "$FIX/tiny-lib" "$T/m"
mutate; sed -i.bak 's|^## Limits|## Notes|' "$T/m/README.md"
expect "verify: missing Limits fails" 1 'no "Limits" heading' -- node "$HERE/verify.mjs" "$FIX/tiny-lib" "$T/m"
mutate; sed -i.bak 's#<img src="assets/reel-final\.[a-z]*"#<img src="assets/nope.png"#' "$T/m/README.md"
expect "verify: dead image fails"     1 'does not resolve'   -- node "$HERE/verify.mjs" "$FIX/tiny-lib" "$T/m"
mutate; sed -i.bak 's#Two small#![b](https://img.shields.io/badge/x-y-green) Two small#' "$T/m/README.md"
expect "verify: invented badge fails" 1 'badge'              -- node "$HERE/verify.mjs" "$FIX/tiny-lib" "$T/m"
mutate; sed -i.bak 's#>10</text>#>11</text>#; s#>clamp(15, 0, 10)</text>#>clamp(15, 0, 11)</text>#' "$T/m/assets/reel-light.svg"
expect "verify: edited Reel SVG fails" 1 'reel-text'         -- node "$HERE/verify.mjs" "$FIX/tiny-lib" "$T/m"
mutate; sed -i.bak 's|This command is unverified: it was not run while writing this README.|This command works.|' "$T/m/README.md"
expect "verify: unverified claim not labelled fails" 1 'unverified' -- node "$HERE/verify.mjs" "$FIX/tiny-lib" "$T/m"
expect "verify: usage error"          2 'usage'              -- node "$HERE/verify.mjs"

# capture (needs Playwright)
echo '<html><body style="background:#fff"><h1>hi</h1></body></html>' > "$T/p.html"
if node -e 'process.exit(0)' && node "$HERE/capture.mjs" "$T/p.html" --out "$T/p.png" >/dev/null 2>"$T/cap.err"; then
  [ -s "$T/p.png" ] && ok "capture: PNG written" || bad "capture: empty PNG"
elif grep -q 'Playwright is not installed' "$T/cap.err"; then skip "capture.mjs PNG + --frame + --list + --at (Playwright not installed)"
else bad "capture: $(head -2 "$T/cap.err")"; fi
expect "capture: missing file"        2 'no such file'       -- node "$HERE/capture.mjs" "$T/none.html" --out "$T/q.png"

# capture extras, new checks (need the browser only for the first two)
echo '<html><body><section style="height:200px;width:600px;background:#eee"><h2>Region</h2></section></body></html>' > "$T/r.html"
if [ -s "$T/p.png" ]; then
  expect "capture: --list finds regions" 0 'section' -- node "$HERE/capture.mjs" "$T/r.html" --list
  expect "capture: --frame writes PNG" 0 '"wrote"'  -- node "$HERE/capture.mjs" "$T/r.html" --out "$T/f.png" --selector section --frame
  [ -s "$T/f.png" ] && ok "capture: framed PNG non-empty" || bad "capture: framed PNG empty"
  expect "capture: --at writes frames" 0 'real-time' -- node "$HERE/capture.mjs" "$T/r.html" --out "$T/a.png" --at 0.2,0.4
fi
# Playwright lookup must fail LOUDLY, never silently, when the env var points nowhere
o="$(READMESHOWCASE_PLAYWRIGHT_DIR=/nonexistent node "$HERE/capture.mjs" "$T/p.html" --out "$T/z.png" 2>&1)"; rc=$?
if [ $rc -eq 0 ] || echo "$o" | grep -q 'npm install'; then ok "capture: bad READMESHOWCASE_PLAYWRIGHT_DIR falls back or fails with install hint"; else bad "capture: silent failure with bad env var: $o"; fi
# markdown in a beat is rejected; raw-transcript alt and artifact-without-evidence fail
node -e '
const b=require(process.argv[1]); const w=(f,o)=>require("fs").writeFileSync(process.argv[2]+"/"+f,JSON.stringify(o));
w("md.json",{beats:[{...b.beats[0],text:"**Bold** "+b.beats[0].text},b.beats[1]]});' "$T/good/beats.json" "$T"
expect "reel: markdown in beat rejected" 1 'markdown' -- node "$HERE/reel.mjs" "$T/md.json" --out "$T/x5"
mutate; sed -i.bak 's#alt="[^"]*"#alt="Input: **x** -> Output: \&quot;y\&quot;"#' "$T/m/README.md"
expect "verify: raw-transcript alt fails" 1 'raw transcript' -- node "$HERE/verify.mjs" "$FIX/tiny-lib" "$T/m"
mutate; node -e 'const f=process.argv[1],j=JSON.parse(require("fs").readFileSync(f));j.claims.find(c=>c.status==="unverified").status="artifact";require("fs").writeFileSync(f,JSON.stringify(j))' "$T/m/claims.json"
expect "verify: artifact without evidence fails" 1 'evidence' -- node "$HERE/verify.mjs" "$FIX/tiny-lib" "$T/m"

# gh render (needs gh + browser)
if command -v gh >/dev/null && gh auth status >/dev/null 2>&1 && [ -s "$T/p.png" ]; then
  cp -R "$T/good" "$T/rr"; expect "render-readme: renders light+dark frames" 0 'wrote' -- bash "$HERE/render-readme.sh" "$T/rr" 0.3
else skip "render-readme.sh (gh missing/unauthenticated or no browser)"; fi

echo "selftest: $PASS passed, $FAILN failed"
[ "$FAILN" -eq 0 ] || exit 1
if [ ${#SKIPPED[@]} -gt 0 ]; then
  echo "=============================================================="
  echo "INCOMPLETE: ${#SKIPPED[@]} area(s) were NOT tested:"
  for x in "${SKIPPED[@]}"; do echo "  - $x"; done
  echo "Run: bash $HERE/install-deps.sh   (about 150 MB; ask the user first), then re-run selftest."
  echo "Until then the screenshot, framing and GitHub-render paths are UNTESTED and rung 1 captures are unavailable."
  echo "=============================================================="
  [ "$ALLOW_SKIP" -eq 1 ] && { echo "--allow-skip given: exiting 0, but you must tell the user what was skipped."; exit 0; }
  exit 3
fi
echo "COMPLETE: every script path was exercised."
