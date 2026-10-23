# Ruth's proposal: "Metronome Drip"

## Concept (one sentence)
One espresso drip falls from a spout into a dark cup every second, and the ripple it makes is the only thing that moves: five identical, unhurried beats that never fill the cup, never finish, and therefore can never fake a finish.

## What you see, moment by moment (5s = 5 identical 1s beats)
Elements: a short spout/portafilter lip (static, 1 shape), a cup seen from slightly above as one dark ellipse with a crema-coloured rim (static), one drop, and two ripple rings. That is the whole drawing.

Each 1s beat (repeated at 0, 1, 2, 3, 4s):
- 0.00-0.12s: a drop swells at the spout tip (scale 0.6 to 1, transform only).
- 0.12-0.50s: the drop falls with an ease-in (gravity) along translateY into the cup centre, and is clipped by the pool edge.
- 0.50-1.00s: on impact, ring one scales out from the centre with ease-out while fading from 0.7 to 0 opacity; ring two follows 0.15s behind at lower opacity. The last 0.2s of the beat is already the swell of the next drop, so there is never a dead frame.

There is no "build-up" and no "reveal". 0s looks like 1s looks like 4.99s. The loop has no seam because the cycle is literally five repeats of a 1s beat; the 5s duration is the declared period, the 1s beat divides it evenly. Steady progress is communicated by cadence, not by a filling bar.

## Rubric
- Concept (20): Drip is the ritual (extraction), not steam. Honest weakness: a lone drip could be mistaken for a water-drop/weather icon unless the crema ring and the spout read as espresso. Palette: near-black brown #1B120D pool, crema #C8864B rim, drop #3A2316 on cream #F4EBDD ground, so the dark drop reads on light. Expect 6-7.
- Motion (25): metronomic, so the wait reads as steady; ease-in fall and ease-out ripple are physically honest. 1s cadence is calm (1 Hz, well under the 3 Hz flash threshold). No fake finish possible. Risk of monotony; I accept that, since a loader is not entertainment. Expect 7-8.
- Craft (20): about 6 SVG nodes. Only transform and opacity animate, two keyframes sets (drop, ring), ring two uses animation-delay negative offsets so the cycle is phase-correct from frame 0. One component scaled via a viewBox, so 120px and splash are the same drawing. Expect 9.
- Clarity (20): At 120px the drop and the ring are each a single bold shape with big contrast; nothing is fine detail. Reduced motion: drop is removed from the animation; the spout shows a static drop, and one ring does a slow 5s opacity pulse (0.25 to 0.6) with no movement. Still says "something is happening" without any translation or scale. Also add an aria role="img" with a label and a visually hidden "Loading" text, which no one else will remember. Expect 8.
- Pitch (15): short, with a 'what this will not do' section: no finish, no steam, no splash.

## Riskiest part
That it is inoffensive rather than good. Five identical beats at 1 Hz could look like a generic ripple/water-drop loader, which is the fintech-spinner failure Henrik hates. Mitigation: the espresso-specific cues (crema rim, spout shape, drop colour and viscosity, i.e. a slightly slower, rounder fall than water) have to carry ownership. Secondary risk: the 1s cadence might feel a touch ticky on a 30s wait; I would rather argue about that than add a flourish.
