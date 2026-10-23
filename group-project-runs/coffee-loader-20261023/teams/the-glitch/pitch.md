# TICK - the loader that admits a hiccup

**Hook:** Your coffee is dripping. You can count it. Once, it stumbles, and the next drop fixes it.

## The idea
An espresso cup under a spout. One crema-coloured drop falls every second while a lit pip hops along a row of five, so the wait is counted in steady ticks, not smeared into a spinner. Once per loop the cup's crema band slips sideways like a misprinted paper layer, and the next drop snaps it home.

## The 5 seconds
- **Each second:** the drop swells at the spout, falls with gravity easing, lands, and a flat ring opens and fades.
- **Pips:** each lights for its second, then trails off. Pip 5 hands to pip 1 at 5.0s with the same hop as every other second.
- **3.05-3.55s:** the band eases 6 units right behind the cup edge, an orange ghost shows at its home, then it returns as the 3s drop lands.
- **Reduced motion:** nothing moves. A drop hangs under the spout, a ring breathes between 25% and 70% opacity, pips cross-fade.

## Why it holds up
- **Concept:** a drip landing in a cup is the ritual; the slip is the signature.
- **Motion:** the one-second beat divides the cycle exactly, so the wait is countable and steady. The slip sits mid-loop, away from the seam, and the next drop resolves it.
- **Craft:** about 20 SVG shapes, animating only transform and opacity, no filters, about 9 KB, one file, JS only for replay and the reduced-motion preview.
- **Clarity:** at 120px the read is a cream cup and a falling amber dot.

## Honest risk
The slip could read as a rendering defect. We clipped it behind the cup. In a 30s wait it repeats six times, which risks a tic; a wait of 3s or less never sees it. The `--slip` dial can drop to 4px; below that we expect it to vanish. We ran no glance test, only Chromium frames; no Safari, Firefox or low-end Android. Animated nodes are SVG children, so they repaint; we do not claim compositor-only.

## Close
Most loaders pretend nothing can go wrong. TICK counts the seconds out loud, owns one small slip, and fixes it with the next drop.
