# Omar (Producer) - Proposal: "ALREADY FULL"

## One sentence
A top-down espresso cup that is *already full*: a slow metronome of drips lands in the crema, each one sending a ring outward while the tiger-stripe swirl turns a third of a revolution, so the loader shows coffee that is in motion, not a bar racing to a finish line.

## The convention we break (on purpose)
Every loader says "progress = something filling up". We delete the fill. No level rises, nothing completes, nothing resets. Progress is rhythm, not quantity. That is the bet. The backup plan (if the panel hates "full cup = done"): the crema is visibly *in motion* (swirl + drips), so it reads as live extraction, and I keep the saucer rim tinted "pouring" amber rather than "served" cream.

## Look and feel, second by second (5s loop, 4 beats of 1.25s)
- Palette: crema `#C8873E`, roast `#2A140B`, ristretto `#4A2614`, cream ring `#F3E2C4`, saucer `#F7EFE3` on a dark roast background. Warm, high contrast, 3 colours really.
- Always on: a round dark cup mouth seen from above, a crema disc with a 3-armed swirl (3-fold symmetry, so rotating 120deg in 5s closes the loop with zero seam).
- 0.00s: drop 1 arrives as a small cream dot that scales 1.6 -> 1 and fades in at the centre-left of the crema (the "falling toward you" cue).
- 0.30s: impact. Ring 1 (a thin cream circle) scales 0.2 -> 1.0 while opacity goes 0.7 -> 0, ease-out, over 0.95s.
- 1.25s / 2.50s / 3.75s: drops 2, 3, 4, same recipe, each landing at a different spot (translate offsets: left, right, top, bottom) so the surface feels alive, not stamped.
- Throughout: the swirl turns linearly, 120deg over 5s. At 120deg the 3-armed shape is identical to 0deg, so 5.00s == 0.00s with no jump.
- 3.75-5.00s: ring 4 is still fading while the next loop's drop 1 is fading in at 0s. There is never a frame with nothing happening (max gap between visual events: 0.3s).
- Reduced motion: swirl static, one ring slowly breathing (opacity 0.25 <-> 0.6, 5s ease-in-out). Reads as "something is settling in your cup".

## Rubric self-scoring
- Concept (20): extraction, the drip and the crema surface. Not steam, not a mug side-view. Honest score 7-8. Top-down is unusual but the "full cup = already served" reading is a risk. Ownable: the ripple could drive button presses, toasts, pull-to-refresh across the app.
- Motion (25): strict 1.25s metronome = steady, predictable progress, the thing Amara loves. Linear swirl + ease-out rings. No fake finish, no seam by symmetry. Honest score 8.
- Craft (20): about 12 SVG elements. Animates only `transform` and `opacity`. Four rings share one keyframe set, staggered with `animation-delay`. Colours as custom properties. Scales as vector. Score 8-9.
- Clarity (20): at 120px a dark disc, a rotating swirl and rings: reads "coffee" in one second IF the cup read lands. The saucer + handle nub carry the identity. Score 7. Reduced-motion has a deliberate breathing ring. Nothing flashes.
- Pitch (15): lead with the bet ("we deleted the fill"), admit the risk in the first paragraph. Score 8.

## Riskiest part
Rosie sees a full cup and thinks "my coffee is done" or "it's just a round brown thing". Top-down also loses the instant cup silhouette that a side view gives. If the swirl + handle + saucer do not make the glance work at 120px, the whole bet fails. I want Lena to test that at thumbnail size before we commit.
