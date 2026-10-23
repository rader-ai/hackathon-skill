# TICK - coffee loader

**Concept:** a flat cut-paper espresso cup where one crema-coloured drop falls every second while a lit pip hops along a five-position chaser, and once per loop the crema band mis-registers sideways and is snapped home by the next drop, so the loader counts the wait out loud and admits a hiccup instead of faking smoothness.

Open `index.html` by double-click. Left: the 120px in-app instance. Right: the full-viewport splash. Both are the same SVG markup under one stylesheet (the file repeats the ~20 SVG elements verbatim, no script clones them), so they are the same drawing at two sizes.

## Palette (custom properties on `:root`)
| Token | Hex | Use |
|---|---|---|
| `--roast` | `#1B100B` | field |
| `--cup` | `#F3E6D2` | cup, saucer, spout |
| `--crema` | `#C8873E` | the band that slips, the drop and its ring |
| `--shade` | `#5A3720` | cup shadow, coffee surface |
| `--orange` | `#FF5F1F` | the system acting: lit pip and registration ghost only |
| `--pip-off` | `#6B4430` | unlit pip |

Plus `--cycle: 5s`, `--beat: calc(var(--cycle) / 5)`, and the dials `--slip: 6px`, `--ghost: .35`.

## Beat sheet (5s cycle, t=0 equals t=5s)
Five 1s beats, k = 0..4, each starting at k s. Each beat runs the same drop:
- +0.00-0.15s swell: drop scales .3 to 1 at the spout.
- +0.15-0.55s fall: 25 units, gravity ease-in; hard cut at impact.
- +0.55-0.90s ring: flat ring on the coffee surface opens (scale .3 to 1) and fades.
- Pips: pip k is lit from k s to k+1 s, then trails off over the next second (a comet tail, not a countdown; the chaser never reads 5 of 5). Pip 5 hands to pip 1 at 5.0s.
- Glitch, beat 3 only:
  - 3.05-3.25s the crema band eases right `--slip`, sliding behind the cup edge (it is clipped to the cup silhouette); an orange registration ghost fades in at its home position.
  - 3.25-3.35s held displaced; drop and chaser keep moving.
  - 3.35-3.55s band eases home, landing with the 3s drop impact at 3.55s; ghost gone.

## Animated properties
Only `transform` and `opacity`.
- `.drop`: translateY, scale, opacity (1s)
- `.ring`: scale, opacity (1s)
- `.band`: translateX (5s, literal cycle `--cycle: 5s`)
- `.ghost`: opacity (5s)
- `.lit` (orange pip overlays, stacked on static dim pips so no colour animates): opacity (5s)

Transform and opacity only: no filter, blur, box-shadow, or layout properties. (The animated nodes are SVG children, so they repaint; we do not claim compositor-only.)

## How the loop closes
- Drop and ring run on 1s keyframes; 1s divides 5s, so five repeats land exactly on the cycle.
- Every 5s keyframe set has 100% equal to 0% (band, ghost). Drop and ring end hidden at their start state.
- The pips share one 5s clock via negative delays (`(i - 5) * beat`), so each is the same animation, shifted. The only change across the wrap is pip 1 hopping on, identical to the hop at 1s, 2s, 3s, 4s. We checked the computed styles at 4.99999s and 5.00001s: the only difference is that hop.

## The glitch and its dials
At 120px the band shifts 6px (5% of width) behind the cup edge and leaves a 6px orange sliver on the left. At splash size it is the same 6 viewBox units, scaled. The first 3s are clean, the drop never stops, only the band moves, it lasts 0.5s once, and the 3s drop visibly resolves it. If a glance test says people read it as broken, set `--slip: 4px`. Do not go below 4px: at 120px it disappears. We could not run that user test.

## Reduced motion
`@media (prefers-reduced-motion: reduce)` (duplicated 1:1 under `:root[data-motion="reduce"]` for the page toggle): no movement and no glitch. The drop is held under the spout as a drop about to fall, the ring is a still ring breathing between 25% and 70% opacity on a 5s ease-in-out loop, and the pips still chase but as a slow cross-fade (0.6s) so "working on it" is still readable. Nothing flashes.

## Controls and JS
Two small handlers only: Replay (clears and restores inline `animation` on every part so both instances restart together) and the "Preview reduced motion" checkbox (sets `data-motion="reduce"` on `<html>`).

## Browser caveats
- `transform-box: fill-box` needs Chrome 64+, Safari 11+, Firefox 55+.
- The preview toggle only forces reduced motion on. It cannot force full motion if the OS asks for reduced.
- Verified in headless Chromium via paused-animation frames only. No real low-end Android testing, no Safari or Firefox pass.
