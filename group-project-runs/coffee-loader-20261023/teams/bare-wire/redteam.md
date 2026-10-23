# Red Team - Ruth (Skeptic), Round 5

Method: read index.html and README line by line. Rendered it in a Chromium-based pane (file://). Scrubbed the animation clock to 0, 50, 300, 1000, 1600, 2500, 4999 and 5000ms. Clicked the preview toggle. Diffed the @media reduce block against the data-motion block. I could not emulate OS prefers-reduced-motion (the Playwright tool blocks file://), and I did not test Safari or Firefox.

## Verified OK (do not touch)
- All 12 animations are 5000ms. Loop wrap is clean: 4999ms and 5000ms differ only by 1ms of drift, and the ring that wraps is at opacity 0. Never more than two rings visible, never zero. No fake finish.
- The preview toggle works. It sets the reduced state, turns it off again, and aria-pressed flips.
- The @media block and the toggle block are character-identical, so the toggle is a faithful proxy for the OS setting.
- 120px instance renders at 120x120 and reads as a top-down cup of espresso.

## Issues that cost points, ranked

1. **The concept is a ripple, and the stump problem (concept 20, Henrik, Mara).** Concentric expanding rings on a brown disc. In the still frame it looks like a tree-stump cross-section or a vinyl record, not coffee. The "scar that heals" idea lives in the README, not on screen. Nothing in the frame is ownable by a café-ordering brand; swap the colours and it is a sonar or Wi-Fi pulse. Fix (no new elements): make the healing visible. Fill the ring's inside with the crema colour so the dark ring reads as a gap in crema that closes from the inside, or keep a fixed offset so the landing is not dead-centre (Kenji's pentagon, rejected, was the only thing unique). Add a lighter crema highlight arc to the field so the disc reads as liquid, not wood. At minimum, put the idea in one sentence on the page.
2. **"Compositor-only" is probably false (craft 20, Sun).** `vector-effect: non-scaling-stroke` on an element with an animated CSS transform makes the browser recompute the stroke every frame, which in Chromium and WebKit means repaint, not a pure compositor animation. The README implies the opposite. Fix: drop the stroke. Draw each ring as two filled discs, a dark one scaling up and a crema one inside it scaling slightly behind, and animate only transform and opacity on fills. This also removes the --sw bookkeeping. Otherwise soften the claim and add a trace showing the animation stays on the compositor.
3. **Reduced-motion fallback is a still bullseye (clarity 20, Amara).** Two static concentric rings with an opacity swing of .55 to .8 and .88 to 1. It is deliberate, but the swing is so shallow it is hard to see at 120px, and a static target says "radar", not "working on it". Amara will accept it but not praise it. Fix: widen the ring breathe to roughly .25 to 1 over 5s, and replace the stack with a single ring crossfading between the two radii (opacity only), so it still implies the outward direction. Keep it under 3 changes per second; it already is.
4. **Browser claims are untested (craft).** README admits Chromium only. `transform-box: view-box` plus `non-scaling-stroke` under a CSS transform is a known weak spot in WebKit, so a Safari judge could see fat or hairline strokes. Fix 2 removes the risk; otherwise test Safari and Firefox before submitting and say so.
5. **Not truly "the same component" (craft).** Markup is pasted twice. Stroke width is computed separately per instance (3.6px versus a vw/vh formula), and that formula uses the viewport, not the container. In the narrow layout (<640px) the splash is 70vh, so the stroke is wrong there. Also under 640px it is no longer full-viewport. Fix: with filled discs (issue 2) there is no per-instance stroke, so the markup can be identical and sized only by the container. Add a comment explaining why it is duplicated.
6. **Metronomic rhythm (motion 25, Mara, Rosie).** A hard 1s tick at one radius, forever. It is steady, which is good, but there is no easing variety and the landing is a dot that appears from opacity 0 in 0.12s, which is a soft pop at 120px. Fix: lengthen the landing fade to about 0.3s, and let the bloom (1 to 1.04) be visible, since at 1.04 nobody will see it. Either commit to it (1.08) or delete it and save a node.
7. **Fragile and bloated CSS (craft).** The reduced rules select with `[style*="--i:0"]`, which silently breaks if someone writes `--i: 0`. The rules are duplicated for @media and the toggle. Fix: give the rings classes (.r0, .r1) and drop the inline-style matching. Keep the duplicate block (CSS has no clean way around it) but comment it.
8. **Accessibility nits (clarity).** Two `role="status"` regions on one page, each with static "Loading" text, produce no live announcement and could double-announce. Use `role="img"` with `aria-label`, or put role="status" on only one. The fixed control buttons overlap the splash. The caption at .7 opacity is fine.
9. **Pitch and README must not oversell.** README says "Verified in-browser" for Chromium only. State this plainly in pitch.md (400 words max; I did not check it).

## Guessed signature criteria (3 points each) and survival

| Judge | Likely hidden criterion | Survives? |
|---|---|---|
| Mara | The loader earns its first second: motion starts immediately, no empty frame at t=0 | Mostly. At t=0 the rings are already mid-flight, so it is clean. |
| Henrik | Could be recognised with the colours removed, i.e. a silhouette that is coffee | No. In greyscale it is a stump or a target. This is the biggest bonus loss. |
| Sun | Passes a no-main-thread-paint trace on a throttled CPU, or has no `will-change` bloat | Doubtful, because of non-scaling-stroke (issue 2). Ten will-change layers is acceptable. |
| Amara | The reduced-motion version differs from the normal one in kind, not just speed, and still shows direction or progress | Weak. It differs in kind, but it shows no direction (issue 3). |
| Rosie | Reads as "coffee" with the sound off, at arm's length, in one second | Partly. Brown disc says coffee-from-above, but the rings say "ripple/target", not "coming to me". |

## Overall
Clean, correct and calm. It will not lose points for bugs, and it will lose points for being safe. Highest value fixes in order: 1 (make crema healing visible), 2 (remove the stroke), 3 (stronger reduced-motion cue).
