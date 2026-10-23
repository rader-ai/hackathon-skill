# TICK v2 - coffee loader

**Concept:** a flat cut-paper espresso cup where one crema-coloured drop falls every second and each landing lifts the crema layer one visible step, so the coffee itself counts the wait, and once per loop a barista-style pull (a short stream) breaks the rhythm, then a fast hand-off back to the start means the cup never completes.

Open `index.html`. Left: the 120px in-app instance. Right: the full-viewport splash. Same SVG markup, same stylesheet (the ~12 SVG elements are repeated verbatim; no script clones them).

## Palette (custom properties on `:root`)
| Token | Hex | Use |
|---|---|---|
| `--roast` | `#1B100B` | field |
| `--cup` | `#F3E6D2` | cup, saucer, spout |
| `--crema` | `#C8873E` | drop, ring, pull |
| `--crema-lt` | `#EDC080` | the crema layer that steps |
| `--coffee` | `#3A2112` | coffee surface under the crema |
| `--shade` | `#5A3720` | cup shadow, outline |

Plus `--cycle: 5s` and `--beat: calc(var(--cycle) / 5)`. The v1 orange, pips, band and ghost are gone.

## Beat sheet (5s cycle, t=0 equals t=5s)
Five 1s beats, k = 0..4, each starting at k s. Each beat:
- +0.00-0.08s drop fades in from scale .3 at the spout.
- +0.08-0.55s ease-in fall, 25 units.
- +0.55-0.65s drop squashes (scale 1.3 x .5) and fades as the ring opens from opacity 0; ring fades out by +0.90s.
- +0.55-0.67s **step**: crema layer eases (0.12s) up one level, opacity +.14 and scaleX +.07.
- Beat 4 only, 3.00-3.50s: **pull**. A 27-unit stream (2.7x a drop) grows from the spout in 0.2s, holds 0.2s, thins out by 3.5s. The 3s drop still lands at 3.55s.
- 4.75-5.00s: **swap**. Crema eases from its top level (opacity .80) back to the start (.10). Frame 5.0 equals frame 0.0.

## Animated properties
Only `transform` and `opacity`, no filter, blur, box-shadow or layout.
- `.drop`, `.ring`: translateY, scale, opacity (1s)
- `.crema`: opacity, scaleX (5s)
- `.stream`: scaleY, opacity (5s)
- `.surface`: opacity +-.02 breathe (5s), from bare-wire. It is on the surface under the count, not on the count; at +-.02 it is not visible, it is a heartbeat for the file, not for the eye.

Animated nodes are SVG children, so they repaint; we do not claim compositor-only.

## How the loop closes
Drop and ring run 1s (divides 5s). Crema, stream, breathe run 5s with 100% equal to 0%. The drop and ring are hidden at their reset points, so nothing jumps. Checked at 4.99s and 0s in screenshots: identical.

## Reduced motion
`@media (prefers-reduced-motion: reduce)` (duplicated under `:root[data-motion="reduce"]` for the toggle): no movement. A drop is held under the spout, the ring breathes between 25% and 70% opacity, and the crema layer still rises step by step as a 0.5s cross-fade each second and fades back at the end of the loop, so the cup still says "working on it". No stream, no breathe.

## Known limits
- A fast rise then a swap can read as a fill-and-empty if someone watches closely; the swap takes 0.25s and tops out at 80%.
- Steps are about 9% of channel value each; legible at 120px in our screenshots but we tested no real device or low-vision user.
- `transform-box: fill-box` needs Chrome 64+, Safari 11+, Firefox 55+.
- The toggle only forces reduced motion on. Verified in headless Chrome with paused animation frames only; no Safari, Firefox or Android pass.
