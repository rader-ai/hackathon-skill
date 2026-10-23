# Theo - Proposal: "Five Drops"

## Concept (one sentence)
Seen from above, one drop of espresso falls into a dark cup every second, and each lands as a single ring of crema that widens and fades: five drops, five rings, a timetable you can read at a glance.

## Inventory (the whole thing, no more)
1. One dark disc (the cup surface, seen from above).
2. One small drop (a circle).
3. One ring (a stroke circle), reused for each landing.
That is three shapes. Nothing else ships.

## Moment by moment (5s, 1s cadence)
Every second is the same departure. The cycle is five identical beats, so the loop has no seam by construction: the frame at 5.0s is the frame at 0.0s.
- 0.00-0.40s: the drop falls from just above the disc to its centre. translateY, ease-in (gravity). It is visible the moment the page appears.
- 0.40s: contact. The drop is gone (opacity to 0 in about 80ms) and the ring is born at the drop's size.
- 0.40-1.00s: the ring scales out to about the disc's edge while opacity fades 0.9 to 0, ease-out. The previous ring is still finishing under the next drop, so the surface is never empty.
- 1.00s: next drop. Repeat x5.
No fill level, no cup completing, no checkmark. Nothing ever finishes, so nothing resets. Progress is the metronome itself: steady, ongoing, always a drop in the air or a ring on the water.

At 120px: one disc, one dot, one ring. Rosie reads "something is dripping into coffee" in under a second. Full splash is the same SVG, scaled.

Palette (custom properties): crema ring #C8915A, espresso disc #2B1A12, drop #4A2E1F on a cream ground #F4EBDD (the drop must read against the disc, so it enters over cream and darkens as it crosses the disc edge: just a colour, no second element).

## Rubric
- **Concept & ownability (20):** Drip/crema ritual, top-down, not steam over a mug. Ownable as a motion language: "one drop, one ring" = one tap, one confirmation, one list item arriving. Honest weakness: ripples are a known water motif; the espresso palette and top-down cup carry the coffee. Expect a 7.
- **Motion & perceived wait (25):** A 1s metronome gives the wait a countable rhythm. Gravity ease-in on the fall, ease-out on the ring. No holds longer than 0.0s because overlap keeps something moving at all times. Seamless by construction. Target 9.
- **Craft & performance (20):** transform and opacity only, one SVG, about 12 lines of CSS. One 1s keyframe set per element (1s divides 5s evenly), plus a wrapper declared at 5s so the cycle is literally 5s as the brief asks. Compositor-only, no filters, no blur. Target 9-10.
- **Glanceability & inclusion (20):** Large single shapes, no detail to turn to mush. No flashing: opacity changes are slow-ish (600ms fades, one event per second, low contrast steps). Reduced motion: drop and ring removed; two static concentric rings on the disc whose outer ring breathes opacity 0.5 to 1 over 5s. Says "working", not "frozen". Target 9.
- **Pitch (15):** Under 300 words, with a numbered list of what is in and what was cut. Honest about the ripple cliche and the "it is minimal, is it memorable" risk. Target 8.

## Riskiest part
Memorability. Three shapes is clean and engineerable but sits one step from "generic water ripple that could be a meditation app." If the judges (Henrik especially) want the coffee to taste stronger, our only levers are palette, the top-down cup, and the drop's colour, because I refuse to add elements. I know my blind spot: I will want to cut whatever strange detail makes it ours. I am deliberately not proposing one, which may be the real mistake.

Secondary risk: the 1s metronome at 120px could read as a "pulse/sonar" rather than a "drip" if the drop is too small. Test the drop at 6% of the box minimum.
