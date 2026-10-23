# Agnes - Proposal: "One Pour"

**Concept (one sentence):** A top-down pour-over where a single thread of water spirals onto a bed of grounds that swells and settles under it - one gesture, no mascot, no cup, no steam, nothing that waves at you.

## Why this and not the cute thing
Everyone else will draw a face, a cup with a smile, or beans with eyes. The panel has seen those. The most honest picture of "coffee is on its way" is the moment a barista starts the pour: water arrives, the bed blooms, it takes the water in. Warmth comes from the pace of a human wrist, not from a wobble and a wink.

## Anatomy (3 SVG shapes, nothing else)
1. **The bed**: a dark espresso disc, flat, no gradient fuss.
2. **The pour**: one crema-coloured spiral stroke (about 1.75 turns, round caps, thicker at the tail like a real pour thinning) that rotates continuously, one full turn per 5s, linear. Linear on purpose: constant speed is the only motion that reads as steady progress rather than a mood.
3. **The bloom**: the bed scales 1.00 to 1.06 and back, once per cycle, on a sine-ish ease. A very faint second ring (opacity only) breathes with it. Hand-drawn imperfection allowed in exactly one place: the spiral is slightly off-round, as if poured, not plotted.

## Moment by moment (5s)
- **0.0-0.8s**: Already moving at frame one. The spiral is mid-turn; no entrance, no intro. The bed is at rest size.
- **0.8-2.5s**: The bed swells gently under the pour (the bloom). Spiral keeps its pace.
- **2.5-3.5s**: Bloom peaks, a soft crema ring fades up on the bed edge (opacity only).
- **3.5-5.0s**: The bed settles and the ring fades; spiral completes its 360 degrees. Frame 5.0 is identical to frame 0.0 because rotation is exactly one turn and the scale curve is a closed cycle. No finish, no refill, no check mark.

## Palette
- Espresso `#2B1A12`, crema `#E9C9A0`, milk paper `#F6EFE6` (background), burnt sienna `#B5532B` for one accent: the tail of the pour. Dark mode: swap paper for roasted `#1B120E`, keep crema.

## Rubric
- **Concept (20):** Pour-over bloom is the ritual itself, and a spiral pour is a mark a café could own on cups, sleeves and its splash. Risk: abstract enough that Henrik wants more "coffee".
- **Motion (25):** One constant-speed element plus one slow breath. Nothing stalls, nothing snaps. Wrap is mathematically closed.
- **Craft (20):** Only `transform` and `opacity`. Three elements, under 2KB of markup, vector so it is crisp at 120px and fullscreen. Rotating one group is a single compositor layer.
- **Clarity (20):** At 120px: dark disc, bright spiral turning. "Something is pouring, it is working." Reduced motion: spiral frozen at its nicest angle, bed does a slow 5s opacity breathe of the crema ring. Deliberate, not a frozen frame.
- **Pitch (15):** Short, deadpan, honest that it is quiet and that quiet is the point.

## Riskiest part
It might be too restrained. A dark circle with a spiral can read as "generic spinner" to Rosie unless the bloom swell and the espresso/crema colours say coffee in one second. Mitigation: make the bed unmistakably a bed of grounds (tiny speckle via 6-8 static dots, not animated), and the pour tail sienna so it reads as liquid. If it still reads as a spinner, I would rather lose on concept than cheat with a smile.
