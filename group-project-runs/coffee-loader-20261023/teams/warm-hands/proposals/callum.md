# Callum's Proposal - "The Pour"

**Concept (one sentence):** A top-down view into a ceramic cup where a single hand-drawn pour spiral keeps winding in, and crema rings bloom outward from the centre one per second, so the wait literally looks like a barista's concentric pour-over circles filling your cup.

## Why top-down
No mug side-profile, no steam. Everyone has seen a cup from above; at 120px a cup rim (circle) plus rings is the most legible shape there is. It also dodges "steam over a cup" completely and is a shape that could anchor a whole motion language (rings = "something is being made for you").

## Look and feel, moment by moment (5s loop)
Palette in CSS vars: cream paper `#F6EBDD`, cup glaze `#FBF5EC`, espresso `#3B2418`, crema `#C98B4E`, caramel `#E0A96D`, roast `#7A4527`. Slightly wobbly hand-drawn rim (I trace the path by hand, ~6% off-round on purpose, barista-made).

The system is two always-running layers, so there is no beginning or end to the cycle:

1. **The pour spiral** (one SVG path, hand-wobbled, round-capped, caramel on espresso). The whole group rotates 360deg across 5s with a very gentle ease-in-out inside the turn that cancels out at the wrap (net velocity identical at 0s and 5s). A rotating spiral reads as liquid streaming inward, a tidy hack: pure `transform: rotate`, no dashoffset.
2. **Crema rings**: five thin rings (circles, `transform: scale` 0.15 to 1, plus `opacity`), each on the same 5s duration but offset by -1s. Every second a new ring is born at the centre, swells outward, and dissolves at the rim. Because the offsets divide 5s evenly, the frame at 0s equals the frame at 5s exactly. Steady metronome, one beat per second, no pause anywhere.

- 0.0-1.0s: ring A is small and bright near the centre, ring E is fading at the rim; spiral turning.
- 1.0-2.5s: rings hand off to each other; the cup surface slowly goes from espresso toward crema in a very subtle opacity cross-fade (a second tinted disc breathing 0.85 to 1, once per 5s, eased).
- 2.5-4.0s: a tiny three-dot "bloom" of bubbles (3 circles, transform+opacity) rises and pops at the spiral's tail, once per cycle, as the bloom of fresh grounds.
- 4.0-5.0s: nothing special on purpose. Spiral completes its turn, a new ring is born exactly as the first did. No done-moment, no checkmark, no reset.

## Reduced motion
`prefers-reduced-motion: reduce`: spiral and bubbles freeze in a deliberate composed pose (spiral at its prettiest angle, three rings static at staggered radii), and the three rings do a slow 5s opacity-only breathe, staggered. Reads as "being made", not "frozen". Plus a visible toggle on the page to preview it.

## Rubric self-score
- **Concept (20):** Strong, 8/10. Pour-over concentric circles is the ritual itself and works as a language (rings for loading, refresh, confirmation, empty states). Risk: top-down cups read as "target" to some people.
- **Motion (25):** 8/10. Metronomic 1s ring births give steady, non-stalling progress; offsets close the loop exactly. Easing is gentle (cubic-bezier .45,.05,.35,.95) not bouncy.
- **Craft (20):** 9/10 if I stay disciplined. ~12 SVG elements, only `transform` and `opacity`, `will-change` on the two groups only, SVG with viewBox so the same component scales from a 120px box to 100vw; CSS vars for palette. The file stays small if I say no to things.
- **Clarity (20):** 7/10. Rings plus spiral on a brown disc: coffee-coloured and "something is flowing", but a half-awake user must recognise a cup. I add a handle stub on the rim and a saucer ring so it reads as a cup, not a target.
- **Pitch (15):** Honest about the target-ring trade-off; I lean on "barista's actual pour pattern".

## Riskiest part
Two risks, and I know my own blind spot is the second one. (1) The top-down cup could read as a bullseye or a generic ripple loader (fintech-looking) unless the handle, saucer and warm palette carry "coffee". (2) I will want to add latte art, a swirling bean, a little spoon... Every one of those bloats the file and mushes at 120px. My discipline: spiral, rings, handle, bloom bubbles, done. If a feature cannot be seen at 120px, it is out.
