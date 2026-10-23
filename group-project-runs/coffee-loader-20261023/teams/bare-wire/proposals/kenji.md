# Kenji - "The Pour" (spiral pour-over, top-down)

## Concept (one sentence)
A top-down view of a pour-over: a single gooseneck stream spirals out from the centre of a bed of grounds and back in again, leaving a fading trail of crema-coloured drops, while the bed itself slowly blooms underneath.

## Palette (CSS custom properties)
--grounds #2B1A12 (bed, near-black roast), --crema #D9A066 (trail head), --foam #F3E3C8 (the lightest drop), --ring #8A5A3B (dripper rim), --paper #FBF6EE (background). Warm, low-contrast against the bed; no blue, no neon.

## Construction (deliberately tiny)
- 1 SVG, ~16 elements: rim ring, grounds disc, 12 drops, nothing else.
- All 12 drops share ONE keyframe pair and differ only by `animation-delay` (negative, in 0.25s steps). The spiral is not drawn, it emerges from the stagger. That is the whole trick, and it is why it loops without a seam.
- Two nested transforms per drop: parent `rotate` (linear, 720deg over 5s = exactly two turns, so frame 0 = frame 5s), child `translateX` (the radius, eased 0 -> 1 -> 0 on a symmetric cubic-bezier). Opacity and scale taper along the tail.
- Bloom: the grounds disc `scale` 1 -> 1.04 -> 1 on a slow ease, 5s, once per cycle.
- Animates only `transform` and `opacity`. Zero filters, zero layout properties.

## Moment by moment (5s)
- 0.0s: Stream is at the centre, tail wound tightly behind it. Bed is at rest size. Already moving, no "start".
- 0.0-1.25s: Stream peels outward in an unhurried spiral (ease-out, slight slow-down as it nears the rim, like a barista widening the circle). Tail follows in a visible comet curve. Bed begins to swell, the bloom.
- 1.25-2.5s: Reaches the outer edge of the bed at 2.5s with velocity at its lowest; this is the widest circle, the "pause" is only radial, rotation never stops, so it never reads as stalled.
- 2.5-3.75s: Spirals back inward, easing in then out. Bed peaks (~2.5s) and begins to settle.
- 3.75-5.0s: Gathers to the centre, tail tightens, back to frame 0 exactly. Rotation has done two full turns at constant angular speed, which is the steady heartbeat the eye reads as "ongoing".
- Never fills, never flashes, never resolves. There is no finish to fake.

## Rubric
- concept (20): Pour-over is the ritual, and the spiral pour is the one gesture every barista does and every customer recognises. Honest weakness: a drop-trail spiral can read as a generic spinner if the bed and rim are not doing their job; this is the one criterion I'm not certain I win. Self-score 7/10.
- motion (25): Constant angular speed + eased radius = rhythm with two clocks that never fight. Seam-free by construction (720deg, symmetric radius curve, negative delays). Radius easing is cubic-bezier(.45,.05,.55,.95) in-out, tuned so peak radial velocity is under half what a linear curve would give: calm. Self-score 9/10.
- craft (20): ~16 SVG nodes, 3 keyframe blocks, transform/opacity only, `will-change` omitted deliberately (tiny layers promote themselves). Scales as vector from 120px to splash. CSS variables for palette, drop count and period. Self-score 9/10.
- clarity (20): At 120px: a dark disc, a ring, a warm tail circling. Brown + circular pour = coffee in a glance; the moving head gives direction ("something is being poured into it"). Slowest radial point still has full-speed rotation, so no looking stuck. Reduced motion: drops freeze in the spiral formation (a legible, deliberate drawing of the pour) and the bed does a slow 5s opacity breathe; the still image is a composed picture, not a random frame. Self-score 8/10.
- pitch (15): Short, honest, leads with "one keyframe, twelve delays". Self-score 8/10.

## Riskiest part
The spiral trail at 120px. 12 drops with 0.25s stagger have to separate into a readable tail at that size without smearing into a blob at the centre when radius is near zero (frames 0 and 5s). If the tail clumps, the loop's seam frame is its ugliest frame, which is precisely where a judge's eye lands. Mitigation: keep a minimum radius (about 8% of the bed, never exactly zero) and fade drop opacity near the centre so the clump is dim. Second risk, and I know it is mine: I will happily spend a day on that easing curve while the concept stays one gesture deep.
