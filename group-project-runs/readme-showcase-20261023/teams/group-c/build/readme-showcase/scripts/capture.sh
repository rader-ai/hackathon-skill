#!/usr/bin/env bash
# capture.sh - screenshot a LOCAL html file with headless Chrome, then crop and shrink it.
#
# Usage: capture.sh INPUT.html OUTPUT.png [WIDTH=1000] [full|WxH] [--crop WxH+X+Y] [--scale N] [--no-quantize]
#   WIDTH    viewport width in px (default 1000; GitHub shows ~830px, so crop to <= 830 wide)
#   full     (default) capture tall, then trim empty page background below the content
#   WxH      fixed viewport, e.g. 1000x700
#   --crop   ImageMagick geometry applied after the screenshot, e.g. 830x420+40+120
#   --scale  device scale factor (default 1; use 2 only if the crop is small)
# Needs:   Google Chrome / Chromium (set CHROME=/path to override) and ImageMagick (`magick` or `convert`).
# Exit:    0 ok | 1 capture produced no/empty output | 2 bad input or missing tool (install hint printed)
# Only opens file:// pages. It never starts a server and never follows network URLs.
set -u

die() { echo "capture.sh: ERROR: $*" >&2; exit "${2:-2}"; }

POS=(); CROP=""; SCALE=1; QUANT=1
while [ $# -gt 0 ]; do
  case "$1" in
    --crop) [ $# -ge 2 ] || die "--crop needs WxH+X+Y"; CROP="$2"; shift 2;;
    --scale) [ $# -ge 2 ] || die "--scale needs a number"; SCALE="$2"; shift 2;;
    --no-quantize) QUANT=0; shift;;
    -h|--help) sed -n '2,13p' "$0"; exit 0;;
    -*) die "unknown option: $1";;
    *) POS+=("$1"); shift;;
  esac
done
[ "${#POS[@]}" -ge 2 ] || die "usage: capture.sh INPUT.html OUTPUT.png [WIDTH] [full|WxH] [--crop WxH+X+Y]"
IN="${POS[0]}"; OUT="${POS[1]}"; WIDTH="${POS[2]:-1000}"; MODE="${POS[3]:-full}"

[ -f "$IN" ] || die "input file not found: $IN"
case "$IN" in *.html|*.htm) ;; *) die "input must be a local .html file: $IN";; esac
[[ "$WIDTH" =~ ^[0-9]+$ ]] || die "WIDTH must be an integer, got: $WIDTH"
[[ "$SCALE" =~ ^[0-9]+$ ]] || die "--scale must be an integer, got: $SCALE"
if [ -n "$CROP" ] && ! [[ "$CROP" =~ ^[0-9]+x[0-9]+\+[0-9]+\+[0-9]+$ ]]; then die "--crop must look like 830x420+40+120, got: $CROP"; fi

# --- find tools -------------------------------------------------------------
CHROME_BIN="${CHROME:-}"
if [ -z "$CHROME_BIN" ]; then
  for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
           "/Applications/Chromium.app/Contents/MacOS/Chromium" \
           google-chrome google-chrome-stable chromium chromium-browser chrome; do
    if [ -x "$c" ] || command -v "$c" >/dev/null 2>&1; then CHROME_BIN="$c"; break; fi
  done
fi
if [ -z "$CHROME_BIN" ] || { [ ! -x "$CHROME_BIN" ] && ! command -v "$CHROME_BIN" >/dev/null 2>&1; }; then
  die "headless Chrome/Chromium not found. Install it (macOS: brew install --cask google-chrome; Debian/Ubuntu: apt install chromium) or set CHROME=/path/to/chrome. If you cannot, ship the README without an image and say so in LEFT-OUT.md."
fi
if command -v magick >/dev/null 2>&1; then IM=(magick)
elif command -v convert >/dev/null 2>&1; then IM=(convert)
else die "ImageMagick not found. Install it (macOS: brew install imagemagick; Debian/Ubuntu: apt install imagemagick)."; fi

# --- screenshot -------------------------------------------------------------
ABS="$(cd "$(dirname "$IN")" && pwd)/$(basename "$IN")"
OUTDIR="$(dirname "$OUT")"; mkdir -p "$OUTDIR" || die "cannot create $OUTDIR"
TMPD="$(mktemp -d)"; PROFILE="$TMPD/profile"; RAW="$TMPD/raw.png"
trap 'rm -rf "$TMPD"' EXIT

if [ "$MODE" = "full" ]; then SIZE="${WIDTH},6000"
elif [[ "$MODE" =~ ^([0-9]+)x([0-9]+)$ ]]; then SIZE="${BASH_REMATCH[1]},${BASH_REMATCH[2]}"
else die "4th argument must be 'full' or WxH, got: $MODE"; fi

"$CHROME_BIN" --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
  --user-data-dir="$PROFILE" --force-device-scale-factor="$SCALE" \
  --window-size="$SIZE" --virtual-time-budget=3000 --screenshot="$RAW" "file://$ABS" \
  >"$TMPD/chrome.log" 2>&1 &
CPID=$!
for _ in $(seq 1 90); do kill -0 "$CPID" 2>/dev/null || break; sleep 1; done
if kill -0 "$CPID" 2>/dev/null; then kill -9 "$CPID" 2>/dev/null; die "Chrome did not finish in 90s" 1; fi
[ -s "$RAW" ] || { tail -5 "$TMPD/chrome.log" >&2; die "Chrome produced no screenshot" 1; }

# --- trim, crop, shrink -------------------------------------------------------
if [ "$MODE" = "full" ]; then
  # bounding box of non-background pixels; keep everything above its bottom edge + padding
  BB="$("${IM[@]}" "$RAW" -fuzz 2% -format '%@' info: 2>/dev/null || true)"
  if [[ "$BB" =~ ^([0-9]+)x([0-9]+)\+([0-9]+)\+([0-9]+)$ ]]; then
    H=$(( BASH_REMATCH[2] + BASH_REMATCH[4] + 24 * SCALE ))
    W="$("${IM[@]}" "$RAW" -format '%w' info:)"
    "${IM[@]}" "$RAW" -crop "${W}x${H}+0+0" +repage "$RAW" || die "trim failed" 1
  fi
fi
[ -z "$CROP" ] || "${IM[@]}" "$RAW" -crop "$CROP" +repage "$RAW" || die "crop failed" 1
if [ "$QUANT" = 1 ]; then
  "${IM[@]}" "$RAW" -strip -colors 256 -define png:compression-level=9 "$OUT" || die "optimize failed" 1
else
  "${IM[@]}" "$RAW" -strip -define png:compression-level=9 "$OUT" || die "optimize failed" 1
fi
[ -s "$OUT" ] || die "output is empty: $OUT" 1
echo "capture.sh: wrote $OUT  $("${IM[@]}" "$OUT" -format '%wx%h' info:)  $(wc -c <"$OUT" | tr -d ' ') bytes"
