# Crema Scar Loader - Team Bare Wire

**Concept:** a drop breaks the crema every second, a dark ring opens in it, and the crema heals it closed from the inside - the opposite of a ripple on water.

## Shapes (6, all static except three)
Handle and cup (silhouette reads as a cup in greyscale), crema field (bloom 1 -> 1.08 -> 1 over 5s), one dark `scar` disc, one crema `heal` disc that follows it and closes the gap, a static glint arc so the field reads as liquid. The landing is off-centre (5,4 units), so it is not a target.

## Palette
`--roast #2B1810` scar, `--cup #1B120D` cup and handle, `--crema #C98B4E` field, `--glint #E8C08F`, `--paper #F4EBDD` page.

## Timing
5s cycle = five 1s beats (scar and heal run 1s, bloom 5s; 1s divides 5s so the loop is seamless). Scar opacity is 0 at 0% and 100%; heal is crema on crema, so its wrap is invisible. Landing fades in over 0.2s. Two easing curves total.

## Animated properties
`transform` and `opacity` on filled circles only. There is no animated stroke and no `vector-effect`, so nothing forces stroke recomputation. Whether that makes it fully compositor-only is untested; no trace was taken. The only strokes (handle, glint) are static.

## Reduced motion
`prefers-reduced-motion` (and the preview button, `data-motion="reduce"`): no travel. One healed scar sits off-centre at fixed size, opacity breathing .25 to 1 over 5s; field breathes .88 to 1. A single ring replaces the old bullseye. I did not build a two-radius crossfade (needs a second pair of nodes).

## Structure and a11y
Both instances are identical markup, sized only by their container (`container-type:size` on the splash). Each is `role="img"` with `aria-label="Loading"`, SVG `aria-hidden`. JS only drives Replay and the reduced-motion preview.

## Verified / not verified
Checked in Chromium via file:// only. Safari and Firefox not tested; no performance trace taken.
