# Ines - "One Drop"

## Concept (one sentence)
A cup seen from directly above, one dark disc; a single drop of coffee lands in the centre once a second, and its crema-coloured ring widens and fades. Nothing else exists.

## Palette (three values, no more)
- Roast `#1B1210` (background / cup)
- Crema `#C8956A` (rings)
- Paper `#F3EBDD` (the cup rim, a single hairline)

## Moment by moment (5s, five identical 1s beats, phase-locked)
Every beat is the same: the drop lands at t=0 (a tiny crema dot, scale 0.2 -> 0.35, opacity 1), a ring leaves it, expands to the rim over ~1.6s while fading, and the NEXT ring is already born at 1.0s. At any instant two to three rings are alive at different radii, so the picture is never empty and never the same. Easing: ease-out on radius (fast then settling, like a real ripple), linear-ish on opacity. 
- 0.0s drop lands, ring 1 born
- 1.0s ring 2 born, ring 1 at ~60% radius
- 2.0s ring 3, ring 1 almost at rim
- 3.0s ring 4; 4.0s ring 5; 5.0s ring 6 is ring 1 again, identical frame to 0.0s.
The rim hairline never moves. Nothing fills, nothing finishes. It reads as a metronome: coffee is arriving, again, again.

## Rubric
- Concept (20): The drip is the ritual of brewing: one drop, one ring is the brand's mark and its motion unit (a button press could emit a single ring; a confirmed order could hold one still crema ring). Honest risk: ripples-in-a-circle can read as water or sonar; the crema/roast palette and the dark-cup framing carry the "coffee" claim. 
- Motion (25): Steady 1s cadence = fixed rhythm the eye can trust, so progress reads as ongoing, not stalled. Seam is impossible by construction: 1s divides 5s evenly, so the frame at 5.0s IS the frame at 0.0s. No ease-in/out at the wrap because there is no wrap.
- Craft (20): Three circles in one SVG (or divs), one keyframe, five-ish animation delays of -0s/-1s/-2s/-3s/-4s. transform: scale + opacity only. No filter, no blur, ~20 lines of CSS. Vector so it is crisp at 120px and full-bleed. The 120px and splash instances are the same element sized by CSS.
- Clarity (20): One shape, high contrast, one-second read: "something is dropping into a cup and it keeps going". Ring stroke is thick enough to survive 120px (about 4% of width). No flashing: max opacity change per second is gentle. Reduced motion: no scaling; the same three rings are shown static at fixed radii, and the outer two breathe in opacity on a 5s ease (0.5 <-> 1), so it still says "working" without movement.
- Pitch (15): Short, declarative, honest. "Subtract until it breaks, then add one thing back."

## Riskiest part
Reading as "a ripple" instead of "coffee". It is cold on purpose; it may be too clinical for a warm café brand, and Henrik will notice. My mitigation is the dark-roast field and crema ring colour, plus the first drop having a tiny, slightly thicker dot. If that is not enough I will concede a single addition (a faint crema-on-roast grain in the ring edge), not more.
