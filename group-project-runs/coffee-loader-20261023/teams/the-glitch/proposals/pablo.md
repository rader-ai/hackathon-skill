# Pablo's proposal: "One Drop, Falling" (working title: GRAVITY ONLY)

## Concept (one sentence)
A loader that breaks the oldest rule of the genre, that a loader goes round or across, by only ever going DOWN: a single bead of espresso swells at a drip spout, lets go, accelerates (ease-in, a real fall) into a dark cup, and its landing ripple becomes the next drop's cue, so the wait is measured in drips instead of in a circle.

## The convention I'm breaking, on purpose
Loaders traverse (spin, sweep, fill left to right) and use gentle ease-in-out. Mine has NO traversal and NO progress. It is one vertical axis, one object, gravity easing (cubic-bezier(.55,0,1,.45) fall), and a hard-won promise: the cup never fills. The rhythm of drips is the progress. Nothing resolves, so there is no fake finish.

## Moment by moment (5s cycle = five 1s drips, every child timing divides 5s)
Each 1s drip: 
- 0.00-0.45s SWELL: the bead grows on the spout (scaleY/scale from 0.2 to 1, ease-out), slightly teardrop-stretching at the end. Something is always visibly happening.
- 0.45-0.78s FALL: it detaches and drops with ease-in (accelerating, the one honest physical thing), stretching slightly with speed.
- 0.78-1.00s LAND: bead vanishes into the surface; an elliptical ripple ring (scale + opacity only) expands across the crema while the next bead is already swelling under the spout. Overlap = no dead air.
Across the full 5s, a slow layer rides on top: the crema ring's glow breathes once (opacity 0.55 to 1 to 0.55, sine), and the warm tint of the cup surface drifts, so the 5s loop is felt as one long breath with five heartbeats in it. Drip 5 flows into drip 1 identically, so there is no seam: the first and last frames are the same pose by construction.

## Palette (declared as CSS custom properties)
Roast black #1A110C (bg), crema #D9A066, espresso #4A2A17, ceramic cream #F3E7D3, copper accent #C8743A. Dark, warm, one hot highlight. Flat shapes, no gradients that need filters.

## Rubric
- Concept (20): ritual-of-coffee idea (the drip itself, pour-over/extraction timing), not steam. Ownable: "a drop, a ripple, a beat" is a motion language (button press = a drop, success = ripple) that fits only a coffee app. Self-score 8.
- Motion (25): purposeful easing (the fall is ease-in because falling is), rhythm of one per second feels unhurried but unmistakably alive; overlapping swell and ripple remove stillness; no finish. Risk: a 1Hz metronome can read as dripping tap/leak rather than warm. Self-score 7.5.
- Craft (20): ~5 SVG elements, transform and opacity only, no filters; the 120px box and the splash are the same component scaled with a CSS size variable; 1s and 5s durations divide evenly. Self-score 9.
- Clarity (20): at 120px: dark cup, a bright bead dropping into it, a ripple. "Coffee is being made, right now" in under a second. Reduced-motion: the bead holds swollen at the spout and the ripple ring does a slow 5s opacity pulse, no travel: still reads as "dripping, in progress". Self-score 8.
- Pitch (15): short, and honest that it does not show a percentage, which is the point. Self-score 8.

## Riskiest part
Two things. (1) The 1Hz drop can read as "leaky tap" or, worse, as a cheap bounce, so the bead's tint, the cup, and the crema ripple must say espresso and not water; the colour contrast at 120px is my main craft job. (2) The ripple ellipse is a thin ring at 120px; if its stroke is under ~2px-equivalent it turns to mush, so I will draw it thick and let it be coarse. Also, Lena will say that a loop with no progress cue tells the user nothing about how long; my answer is that the judges' brief rewards steady and ongoing over a fake bar.
