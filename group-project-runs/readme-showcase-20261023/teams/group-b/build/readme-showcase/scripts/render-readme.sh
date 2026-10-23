#!/usr/bin/env bash
# Show the README the way GitHub shows it: render with `gh api markdown` (GFM), wrap in GitHub-like CSS
# with the Reel as a real <img>/<picture>, and screenshot it at 1012 px in light and dark at given seconds.
# Usage: render-readme.sh <outdir> [seconds, default 1,5]   (needs gh authenticated + Playwright)
# Writes <outdir>/proof/readme-{light,dark}-<t>s.png. LOOK AT THEM. Exit 0 ok | 2 usage | 3 NOT CHECKED (dependency missing; say so in your report).
set -eu
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="${1:-}"; TIMES="${2:-1,5}"
[ -n "$OUT" ] && [ -f "$OUT/README.md" ] || { echo "usage: render-readme.sh <outdir containing README.md> [seconds]" >&2; exit 2; }
OUT="$(cd "$OUT" && pwd)"; P="$OUT/proof"; mkdir -p "$P"
command -v gh >/dev/null && gh auth status >/dev/null 2>&1 || { echo "render-readme: NOT CHECKED - gh missing or not authenticated. Say in your report that the GitHub render was not checked." >&2; exit 3; }
gh api markdown -f text="$(cat "$OUT/README.md")" -f mode=gfm > "$P/readme-body.html"
for theme in light dark; do
  if [ $theme = dark ]; then BG='#0d1117'; FG='#e6edf3'; BD='#30363d'; CODE='#161b22'; else BG='#fff'; FG='#1f2328'; BD='#d0d7de'; CODE='#f6f8fa'; fi
  cat > "$P/readme-$theme.html" <<H
<!doctype html><meta charset="utf-8"><base href="file://$OUT/"><style>
body{margin:0;background:$BG;color:$FG;font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif}
.markdown-body{max-width:900px;margin:0 auto;padding:32px 56px}h1,h2{border-bottom:1px solid $BD;padding-bottom:.3em}
pre{background:$CODE;padding:16px;border-radius:6px;overflow:auto}code{background:$CODE;padding:.2em .4em;border-radius:6px;font-size:85%}pre code{padding:0}
table{border-collapse:collapse}td,th{border:1px solid $BD;padding:6px 13px}img{max-width:100%}a{color:#58a6ff}</style>
<div class="markdown-body">$(cat "$P/readme-body.html")</div>
H
  node "$HERE/capture.mjs" "$P/readme-$theme.html" --out "$P/readme-$theme.png" --width 1012 --theme $theme --at "$TIMES" || exit $?
done
echo "render-readme: wrote $P/readme-{light,dark}-<t>s.png - open and read them (hero legible? sentence above it? raw markdown showing? white box on dark?)"
