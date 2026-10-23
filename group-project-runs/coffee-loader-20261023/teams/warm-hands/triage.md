# Rematch Triage - Dev (Producer)

We placed 1st (86.2). Our own signature wins were Calm Wait Safety 9, Seam 8, Ritual 6. Four of five judges named the same weakness: the spiral reads as a spinner or cinnamon roll at 120px. Fix that, protect the seam, change nothing else.

## Judge notes (warm-hands)

| Judge | The fix | Call | Why |
|---|---|---|---|
| amara-diallo | Thicken pour to ~7, add static cream stream from rim to tip, hold the stream in the reduced-motion pose | Partial | Stream: accept. Stroke to ~6.5 (7 crowds the 120px spiral). Stream in reduced-motion: accept, it costs nothing. |
| henrik-vale | Replace the 360deg sweep with a travelling pour tip (offset-path), art static, spiral drifts 15deg and swells 4% | Reject | The sweep is our proven seam (Mara 8, Amara 9). offset-path is untested in Safari, adds a new animated property and a new loop-closure risk. Hand-poured world stays; the stream gives "being poured" without rebuilding the engine. |
| mara-okafor (stream) | Static ~3-unit stream from top of viewBox to spiral centre (54,57), outside .sweep, slow 5s opacity shimmer | Accept | This is the version we build. It lands on the pivot so it never fights the rotation, and it adds no new animated property type (opacity only). |
| mara-okafor (stain) | Thicken rim-stain strokes to 4 units or cut at small size | Partial | Thicken to 3.6 and drop opacity variation so it reads as one ring, not mush. Not cutting: the stain is our "a person was here" proof. |
| rosie-tran | 4-unit cream stream from rim (54,12) to the moving pour tip | Partial | Idea accepted, geometry rejected: a line to a moving tip needs animated length or rotation, which is bloat and a seam risk. Mara's fixed stream to the pivot gets us the same glance read. |
| sun-park | Split into stacked layers so the sweep is composited and the cup never repaints | Reject | Real gain is +1 on one criterion; cost is a second SVG, shared-symbol break, and a stacking bug surface. We already state the repaint honestly in the README and pitch. Honesty over a rebuild. |

## Steal
None. The-glitch's falling drop is the only honestly observed gesture on rival builds, but our stream already does that job in our own idiom, and borrowing a drop would drag in a clock.

## Plan (build-v2/, in order; owner Callum; Dev signs off on the cut list)
1. Copy build/ to build-v2/; change nothing in the sweep, sway, bloom or stain keyframes or the 5s clock.
2. Add one static stream: `<path>` ~3 units wide, round cap, crema colour, from the top of the viewBox (y~2) to (54,57), drawn after the spiral group and outside `.sweep`. Animate only opacity, 5s, ease-in-out, out of phase with bloom (e.g. .7 to 1), identical values at 0% and 100%.
3. Thicken the spiral stroke from ~5 to ~6.5; keep the sienna tip.
4. Thicken the stain stroke to ~3.6.
5. Reduced motion: hold the stream at full opacity beside the held spiral pose; mirror under `html.rm`.
6. README + pitch: add the stream, update the spinner-risk line to say what now mitigates it, keep every honest caveat (repaint, Safari unverified). Re-verify frame 0 equals frame 5 with the stream in.
Cut list: no offset-path, no second SVG, no drops, no splash, no new colours, no dark mode. Element budget goes from ~10 to 11.

## Retro
1. We shipped without a pitch.md until Agnes caught it in round 5; a 15-point deliverable should have been on the plan as a line item in round 1.
2. We validated the spinner risk in our own pitch but never tested it at 120px with fresh eyes; four judges found it in a glance. Test the weakness we named.
3. Claims outran the build twice (12 o'clock, 13%); I only audited the pitch at the last round. Audit the claim list alongside the build, not after.
