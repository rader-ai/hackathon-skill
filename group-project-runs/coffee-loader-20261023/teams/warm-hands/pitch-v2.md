# One Pour, by Hand (v2)

**Hook: A pour already in progress, now with the coffee visibly falling in.**

## What changed, and whose notes we took
- **Mara Okafor, Amara Diallo:** one static cream stream (3 units, round cap) falls from the top of the viewBox to the spiral's origin, outside `.sweep`. Its only motion is a 5s opacity shimmer (.7 to 1). Under reduced motion it holds at full opacity beside the held spiral.
- **Amara:** spiral stroke thickened from 5 to 6.5.
- **Mara:** stain ring thickened to 3.6. **Agnes** caught our contradiction, so the stain is now static at .85 and its keyframe is deleted.
- The sweep, sway, bloom and 5s clock are untouched. Frame 0 matches frame 5.0 when scrubbed.

## What we refused
- **Henrik Vale:** the travelling pour tip (offset-path). Your sweep note is fair, but the 360deg sweep is the seam two judges rewarded, and offset-path is unproven in Safari. His drift-and-swell is held in reserve, not built.
- **Rosie Tran:** a line to the moving tip. The idea is right, but it needs animated length, so the fixed stream replaces it.
- **Sun Park:** split-layer compositing. Respectfully, it's a second SVG for roughly one point. We state the repaint in the README instead.
- **Amara:** 7 stroke. 6.5 keeps the 120px spiral from crowding.
- **Agnes:** the pool dot (the spiral's origin already sits under the stream) and the scaleX swell (an extra transform).

## Honest remaining risk
At 120px the spiral is still the biggest shape and still turns. In our own headless screenshot the stream makes it read as a pour landing, but nobody fresh has looked, so "spinner" may survive. Still unverified in Safari and Firefox. SVG child groups repaint each frame. No dark-scheme override.
