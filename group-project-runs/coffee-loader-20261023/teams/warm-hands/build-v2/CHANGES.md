# CHANGES (build-v2)

## Triage items
1. Copy build/ to build-v2/, sweep/sway/bloom keyframes and 5s clock untouched: done
2. One static cream stream, 3 units, round cap, y2 to (54,57), outside .sweep, opacity-only 5s shimmer .7-1: done (path `M54 2V57`, quarter-cycle delay so 0% equals 100%)
3. Spiral stroke 5 to 6.5, sienna tip kept: done
4. Stain stroke to 3.6: done
5. Reduced motion: stream held at full opacity, mirrored under html.rm: done
6. README updated (stream, spinner-risk mitigation, caveats kept): done. pitch.md is Dev's file, not touched: dropped (not mine)
7. Cut list respected (no offset-path, second SVG, drops, new colours, dark mode): done. Elements 10 to 11.
8. Frame 0 equals frame 5.0: done (animations scrubbed at 0 and 4999.999ms; identical, rotation differs by about 1e-6 float noise)

## Agnes
1. Pool dot r4 at the stream end: dropped. The spiral's thick origin sits exactly under the stream end, so the stream already feeds something; a dot would be an invisible nub and one more element.
1b. 120px gate with the stream in: done (see below). Henrik's drift-and-swell: not added, gate did not demand it.
2. Steal the swell via scaleX on the stream: dropped. Dev's call stands; it adds a transform and an element's worth of risk for no seen gain.
3. Stain keyframe contradiction: done. Stain is static at .85, its keyframe, delay and reduced-motion hook are deleted (net less code).
4. Retro line "test at 120px first": noted for Dev's retro, not mine to edit.
5. Sun reject, 6.5 stroke: accepted as is.

## Screenshot (headless Chromium, file://, 1x, frames 0/1.25/2.5/3.75s)
At 120px the stream reads as coffee falling into the cup centre and the spiral as the pour's trail. It is a clear improvement over the bare spiral, but the spiral is still the biggest shape and a turning rosette; I could not test with fresh eyes, only my own. I did not add Henrik's drift.
