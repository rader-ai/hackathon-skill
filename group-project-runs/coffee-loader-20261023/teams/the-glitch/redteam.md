# Red team - TICK (Lena, Round 5)

Method: read build/index.html and build/README.md line by line; rendered the file via file:// in a Chromium pane, paused all 18 animations and scrubbed `currentTime` (3.3s shows the glitch at 120px and splash). I did not run real time, real devices, Safari or Firefox. Nothing in TEAM/ other than this file and my round note was written.

## Straight answer on my own dissent: does the 3s slip read as "the app crashed"?
No. I was wrong about "crash". The drop keeps swelling and falling, the pips keep hopping, only a crema stripe moves, and it lasts 0.5s. Nobody thinks the app froze. I was right about something nearby: it reads as a **rendering defect** ("is my phone glitching?"), and the build makes that worse in three ways the plan did not price in:
1. At 9 units the stripe leaves the cup. The band is x28-92 and the cup body ends at x92, so at +9 it sticks out 9 units to the right and runs over the handle (visible in the 3.3s frame). Cut-paper mis-registration is a designed look; a stripe floating off the cup outline is a bug look.
2. The out-move is 0.1s (3.05-3.15s) for 9 units, the fastest thing in the whole piece and a sudden onset, in a loader whose only job is to be calm.
3. It repeats. A 30s wait shows it six times. Once is a wink; six times is a tic. And a user waiting 1-3s never sees it, so the concept's signature is invisible in exactly the short-wait case that matters most.
No flashing: events are 1 Hz, the ghost is a small area at 50% opacity, nothing approaches the 3-flashes-per-second line. Ring and drop cuts are single-frame pops, small and slow-repeating, acceptable.

## Issues that would cost points, ranked

### 1. The glitch overshoots the cup and onsets abruptly (motion, clarity; Amara and Rosie signature risk) - est. -2 to -4 rubric points per judge, up to -2 signature
Evidence: `--slip: 9px`, band `x=28 w=64`, cup right edge `x=92`; `slip` keyframes 61%->63% = 0.1s.
Fix (about 6 lines, keeps the concept):
- Clip the band to the cup silhouette with a static `<clipPath>` (or a static `<g clip-path>` wrapper) so the stripe slides *behind the cup edge* instead of out of it. The ghost sliver then shows on the left only, which looks printed, not broken.
- Set `--slip: 6px` (the plan's own floor was 4; 6 is still readable at 120px, about 6px of 120) and `--ghost: .35`.
- Soften the out-move: 61%->65% (0.2s), ease-in-out; return 67%->71% (0.2s) landing on the drop impact as now.
- Do not go to 4px: at 4px the signature is invisible and Pablo's point (decoration) stands.

### 2. pitch.md does not exist yet (pitch 15, plus hard deliverable)
`ls TEAM/` shows no pitch.md. The brief lists it as one of three required files; no file = zero on a 15-point criterion and a "breaking the constraints" strike. It must be at most 400 words and spend a paragraph on the glitch as an honest risk with the 6px/4px dial. Put the hook line ("the loader that admits a hiccup") after the user benefit, not before.

### 3. The orange drop is not coffee (concept; Henrik) - est. -2 to -3 concept points from Henrik, partial from Mara
The one moving object is `#FF5F1F`, a hazard-orange ball. Henrik hates anything "just as at home on a fintech or food-delivery app"; a hot-orange dot is the delivery-app colour. Espresso drips are brown-gold. The cream cup with a spout above it is also close to the generic clip-art cup he dislikes; ownability rests entirely on the glitch.
Fix: drop and ring in `--crema` (#C8873E; contrast against #1B100B is about 6:1, fine at 120px). Keep orange as the single accent for the lit pip and the ghost so the signature colour means "the system is acting". Add a tiny highlight? No: it is a second shape and 120px does not need it.

### 4. The pip chaser is a countdown that resets (motion, clarity; Mara and Amara)
Five dots lit 1-2-3-4-5, then back to 1 at the far end of the row. This is the nearest thing in the build to a fake finish: "5 of 5" then restart. It also reads as a timer, and timers imply a fixed duration the app does not know. Also `--pip-off #4A2E1E` on `#1B100B` is about 1.5:1, so the unlit pips are nearly invisible on a dim phone and the "five countable ticks" idea is carried by one orange dot hopping sideways.
Fix, pick one: (a) delete the pips (-10 elements, -a whole class of criticism; the drop already is the 1s beat); or (b) keep them but never light more than one at a time with a wider soft tail and raise `--pip-off` to `#6B4430`. I recommend (a) if the team still has nerve, (b) if not. This is a call for Omar and Zara; I will not pretend the fix is free in concept terms.

### 5. "Compositor-only" is over-claimed (craft; Sun Park) - est. -1 to -2 craft points, signature risk
Animated nodes are SVG children. Chromium does not promote inner SVG elements to compositor layers; `will-change` on them does not change that. Each frame repaints the SVG, which is cheap for about 20 shapes and two instances, but the README and any pitch line saying compositor-friendly will be tested by a judge who profiles. Also: SVG markup duplicated verbatim for the splash, reduced-motion CSS duplicated for the toggle, and two instances means about 36 animated nodes on screen.
Fix: say "transform and opacity only, no layout properties" (true) and drop the compositor claim and the three `will-change` lines (they allocate for no gain). Optionally define the art once as `<symbol>` and `<use>` it twice; only do this if tested in Safari, where animation inside `<use>` shadow trees is unreliable. If untested, leave the duplication and own it.

### 6. Literal 5s duration is not literally present (craft; mechanical-check risk)
The brief says one cycle set with `animation-duration: 5s`. Here the 5s lives in `--cycle` and the shorthand; drop and ring run on `calc(var(--cycle) / 5)` (allowed: child timings that divide 5s evenly). A grep-style grader sees no `5s` on those two. Fix: add a comment above the loader block, "cycle 5s; beats 1s x5", and ensure `.band` literally uses `5s` in the README table. Cheap insurance, 0 risk.

### 7. Untested surfaces (honest-risk paragraph)
Only paused-frame Chromium. Not checked: Safari/Firefox `transform-box: fill-box` on `rect` with `translateX`, Safari `calc((var(--i) - 5) * var(--beat))` in `animation-delay`, real-time smoothness at the 1ms drop cut (55% -> 55.1% is 1ms of a 1s beat; at 60 fps this is a single-frame pop, intended, but verify the ring's 56% onset is not a visible gap), and low-end Android. Say so in README (it does) and the pitch.

### 8. Reduced motion: passes, with one nit
The `@media` block and the toggle both work as written: no movement, the drop parked under the spout, the ring breathing 25-70% opacity over 5s, pips cross-fading. It is deliberate and still says "working on it". Nit: the parked drop at translateY 12 is a ball hanging mid-air under the spout; fine as a still, but name it in the README as "a drop about to fall" so it reads intended. Nit 2: the toggle block duplicates the media block; CSS nesting or one comment is enough, but a maintainer who edits one will forget the other.

## Hidden signature criteria, guessed from public bios (does TICK survive?)

| Judge | My guess at the hidden criterion | Survives? |
|---|---|---|
| Mara Okafor | "Works at 1s and at 30s": the loader says "working" in the first second and does not need the full 5s to make sense; or "no resolve beat". | Mostly. The drop is visible from t=0 and the loop is clean. Weak spot: the snap-home on the drop impact at 3.55s is a tiny "fixed it" resolution once per loop; if she is strict, issue 1's softer return helps. |
| Henrik Vale | "Could it appear on the bag, the menu board, the cup sleeve?" i.e. a silhouette plus one gesture that is only this brand. | Partial. Crema stripe is a good coffee word, but the stripe is the *glitch*, not a ritual gesture; the drop is orange, the cup is stock. Fix issue 3 and give him the stripe as the hero. |
| Sun Park | "Survives 6x CPU throttle; file under about 10 KB; no layout, no filter; single source of truth." | Mostly. 9 KB, transform/opacity only, no filter. Dings: SVG-child transforms repaint, duplicated markup and CSS, will-change on SVG nodes (issue 5). |
| Amara Diallo | "No sudden onsets or lateral jerks; no implied timer; reduced motion still shows progress." | Reduced motion passes. The 0.1s lateral jerk and the 5-dot counter fail the first and third tests (issues 1 and 4). Her fear is a loader that makes people watch it. |
| Rosie Tran | "Does it look broken or stuck?" The one-second glance at 120px. | Cup and falling dot read "coffee is being made" instantly. The risk is the stripe jump after 3s ("did it glitch?"). One viewing at 120px: probably reads as a hiccup in a loader she already trusts; six viewings: a flaw. |

## Fix order if there is only time for three
1. Clip the band to the cup, slip 6px, softer 0.2s moves (issue 1).
2. Write pitch.md, with the glitch as the honest risk and the dial as the answer (issue 2).
3. Change the drop and ring to crema; decide the fate of the pips (issues 3 and 4).
Everything else is README wording.
