# Lena - Proposal: "Pull" (the inward ripple)

## Concept (one sentence)
Every loader on earth radiates outward or spins around; ours breaks that on purpose, because the ripples on a top-down cup of espresso travel *inward* toward the centre, one landing per second, like a drip that keeps arriving.

## The convention I'm breaking, and why it's defensible
Loaders orbit or radiate. Chris Harrison's progress-bar studies (CMU, 2010) found that motion running *against* the direction of travel, with an accelerating feel, made the same wait read as roughly 10% shorter. It is one study on bars, not rings, and I am not pretending otherwise (see risk). But it is the only measured lever on perceived duration anyone has handed us. Inward and accelerating is the whole idea. No spinner, no bar, no steam.

## The picture
Top-down view: a saucer, a dark espresso cup with one visible handle (the handle is what makes a circle a *cup* at 120px), and on the surface four thick crema-gold rings. Nothing else. No beans, no steam, no text.

## Moment by moment (5s loop)
Five rings, each running a 5s cycle, staggered by exactly 1s (negative delays), so the frame at t=0 and t=5s are identical by construction. Each ring: fades in at the rim, then scales inward with ease-in, so it *accelerates* toward the centre, and dissolves as it arrives.
- 0.0-1.0s: a new ring appears at the rim (opacity 0 to 1 over ~0.4s) while the rings ahead of it are mid-travel. The surface already looks busy at frame zero; nothing starts from empty, so nothing looks "not started yet".
- 1.0-4.0s: rings continue inward, each speeding up. At any instant you see about four rings at four distances: a steady conveyor, not a pulse.
- Every 1.0s: the centre "landing". A small crema dot does a 6% scale/opacity bump as a ring reaches it. A metronome, never a flash (no luminance change over 10%, nothing faster than 1Hz).
- 4.0-5.0s: identical to 0.0-1.0s. There is no seam because there is no start, middle or end. There is no cup-fills-up beat and no fake finish.

## Rubric (my honest self-scores, not hype)
- **Concept (20):** ~13/20. Ripples on crema is from the ritual (the drip landing on a pull), and "inward" is ownable as a brand motion rule ("everything arrives toward you": buttons settle in, cards ripple to rest). But it is the weakest on pure coffee-ness. I'd rather lose points here than ship clip art.
- **Motion (25):** ~19/25. Constant 1Hz rhythm, ease-in per ring, no hold, closes by construction. Honest ceiling: ease-in rings read as faster-and-faster, which Harrison supports, but too much acceleration turns into "draining".
- **Craft (20):** ~17/20. `transform: scale` and `opacity` only, `vector-effect: non-scaling-stroke` so the strokes stay crisp, about 12 SVG elements, one keyframe, one custom property for the stagger. Single component, scaled by CSS for 120px and splash.
- **Clarity (20):** ~14/20. Test I would run: 1s exposure at 120px, "what is it and what is happening?". I expect "coffee, something is happening" from the handle and the dark disc. Expect fewer to say "ordering". Reduced motion: the same five rings stay static, and only their *opacity* breathes in a staggered inward sequence over 5s (about 0.35 to 1.0, no movement). The direction survives even without any motion.
- **Pitch (15):** ~12/15. Short, one citation with its limits stated, an explicit test plan, one named risk.

## Riskiest part
Inward motion can read as a drain, a sinkhole or a radar/target, i.e. "something is leaving" rather than "something is arriving". That is the exact thing I'd have to measure and can't from here. Mitigations: crema gold on dark espresso (warm, not cold), a visible handle so it is unmistakably a cup, and a small landing bump that reads as arrival. If it fails the one-second test, my fallback is to slow the ease-in to near-linear. Secondary risk: I can't prove the 10% effect transfers from bars to ripples, so I will state it as a hypothesis, not a benefit.
