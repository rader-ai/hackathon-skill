# Dev (Producer) - "One Drop a Second"

## Concept (one sentence)
A pour-over dripper lets one warm drop fall into a cup every second, and each drop's ripple spreads across the crema, so a half-awake customer sees their coffee being made, by hand, at a steady pace, with the cup never filling and never "finishing".

## Why this, in user stories
I ran barista interviews. Three things came up every time:
1. "People stare at the drip. It's the one moment they relax." The drip is the wait in a real café, so we borrow it.
2. "Nobody trusts a cup that's suddenly full." So no fill-up and no checkmark. The level never changes.
3. "Slow and even beats pretty." A steady 1-second cadence, 5 drops per cycle, is a metronome the eye can lean on.

As Rosie (nurse, one-handed, half-awake) I want to see "somebody is making my coffee" in one second, so I can stop thinking about the app.

## Moment by moment (5s loop, 1s beat repeated 5x)
Every beat is the same shape, so the loop has no seam. The 5s cycle is five identical 1s beats, plus one slow 5s layer on top.
- 0.00-0.50s  A bead swells at the dripper spout (scale up, slightly squashed, like surface tension).
- 0.50-0.68s  The drop lets go and falls (translateY, ease-in, a little stretch).
- 0.68s       It lands. A small dark-roast ring opens on the crema and drifts out as an ellipse (scale + opacity), still fading as the next bead swells.
- 0.68-1.00s+ Ripples overlap on a 1s cadence, so there is always a ripple on screen. No dead air, nothing looks stuck.
- Across all 5s  A slow crema highlight on the surface breathes once (opacity only, 5s sine-ish). This is the "bloom" that says the cup is warm and alive. It starts and ends at the same value.
- The imperfection (barista-made): the bead swell is slightly irregular between beats 2 and 4 through a second 5s-long wobble on the dripper, a tiny rock of about 1.5 degrees. A human hand held it. It is still periodic over exactly 5s.

## Palette
Oat cream background #F6EBDC, filter-paper #FFF8EE, espresso #3B2314, crema #C98B4E, caramel highlight #E3B676, a single warm terracotta accent #B5532F for the drop. All CSS custom properties at the top.

## Rubric self-score
- **Concept and ownability (20):** Pour-over dripping is a real ritual step, not steam. It could anchor a motion language (the "drop beat": a 1s pulse for buttons, toasts, pull-to-refresh). Honest weak spot: a drip into a cup is a known image, and I'm betting the cadence makes it ownable. Self-score 7/10.
- **Motion and perceived wait (25):** A fixed 1s beat gives the brain something to count, which makes the wait feel shorter. Easing is ease-in for the fall and ease-out for the ripple, so it has weight. Nothing finishes. Seamless because 5 equal beats tile exactly. Self-score 8/10.
- **Craft and performance (20):** Roughly 8 SVG elements. Animated: transform (translate, scale) and opacity only. No filters, no blur, no animated shadows. One component, sized by the container, with the viewBox doing the scaling. Self-score 8/10.
- **Glanceability and inclusion (20):** One drop, one ring, high contrast espresso on cream. Silhouette-first, so it reads at 120px. Reduced motion: no travel at all. The drop rests at the spout, and the crema ring pulses slowly in opacity (about 0.5 to 1, 5s), with the dripper unmoving. It still says "pouring, working on it". Self-score 8/10.
- **Pitch (15):** I'll lead with the barista quotes, name the risks honestly, and keep it well under 400 words. Self-score 8/10.

## Riskiest part
**Detail at 120px, and the ticking.** An elliptical ripple 3px wide can turn to mush on a small screen, so the ripple stroke must be thick (about 5-6% of the box) and high-contrast, and the drop must be at least 8px. The second risk is that a strict 1s beat reads as a clock tick and makes people anxious instead of calm. The fix is soft easing on both ends and overlapping ripples so the beat is felt more than seen. If Agnes says it's cute, she may be right, and I may be over-trusting what the baristas told me over what looks good. I'd like Marisol to fix the taste and Callum to keep it to roughly 8 elements.
