# One Pour, by Hand - Team Warm Hands

**Hook:** Every other loader makes you wait. This one is already pouring.

## The idea
A top-down cup with a hand-wobbled rim and handle. One cream spiral is poured by a wrist, never a motor: one net turn every 5 seconds, a little faster, a little slower. A faint coffee-ring stain on the rim says a person was here. It starts mid-pour and never finishes.

## The 5 seconds
- **0.0s:** Already mid-pour. Sienna pour tip on the spiral's end, no entrance.
- **0-2.5s:** The wrist speeds up out of the turn, fastest near 1.25s; the dark bloom under the spiral brightens and crests at 2.5s.
- **2.5-5.0s:** The wrist eases, slowest near 3.75s; the bloom ebbs and the ring stain brightens.
- **5.0s:** Same position and velocity as 0.0s.

## Why it wins
- **Concept:** A pour, a hand, a mug ring: the ritual and its trace, not steam clip art. The stain is the ownable gesture.
- **Motion:** One steady linear 360-degree sweep carries progress; a +/-8 degree sway and two opacity breaths, all on the same 5s period, give it a pulse. Scrubbed at 0 and 4999.999ms: identical.
- **Craft:** One 6KB file. One shared SVG symbol, so the 120px loader and the splash are the same drawing. Only transform and opacity animate: no filters, no external assets.
- **Clarity:** Cup, handle, and a cream spiral on dark coffee. Nothing flashes. Reduced motion is designed: the pour holds in a composed pose while bloom and stain pulse on opacity only, under 1Hz. The 120px copy is labelled "Loading: your coffee is being made".

## Across real wait times
It claims no percentage and promises no end, so a 2-second wait and a 30-second wait look the same: someone is still pouring.

## Honest risk
- A turning spiral can still read as a spinner or a cinnamon roll. The cup, handle, pour tip and stain must carry "coffee"; the stain is fine detail at 120px.
- Not compositor-promoted: transform and opacity on SVG child groups repaint the small SVG each frame (twice on the demo page). Cheap, not free.
- We have only rendered it in Chrome. Safari and Firefox are unverified.
- No dark-mode override.

**Closing:** Your coffee isn't loading. Someone is already pouring it.
