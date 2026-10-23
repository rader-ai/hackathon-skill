# CHANGES - build to build-v2 (Pablo)

## Triage plan (Omar)
1. Copy build/ to build-v2/: done.
2. Delete orange layer (pips, band, ghost, slip/ghost/pip keyframes, --slip, --ghost, orange, clipPaths): done. Pip-off var removed too.
3. Rework drop (fade in .3 over 0-8%, ease-in fall, squash and fade 55-65%, ring from opacity 0): done. No instant opacity change remains.
4. Crema steps in five landings, 0.3s ease: partly. Five steps yes, ease is 0.12s (Lena), range wider than ~.35-.75 (opacity .10-.80 plus scaleX), settle fast not a second-half glide (Lena).
5. Espresso pull 3.0-3.5s: partly. Done as a separate stream element (scaleY/opacity), not by stretching the drop itself: scaling the drop would stretch its fall position. Same properties, no new ones.
6. Stolen breathe +-.04: partly. Used +-.02 on the surface ellipse (Lena), so it is below visibility.
7. Reduced motion keeps crema cross-fade, no stream: done.
8. Verify: done (see screenshots). Only transform/opacity in keyframes; durations 1s and 5s; frame 4.99 equals 0.
9. Pitch rewrite: not mine (Zara).

## Lena's overrules
- Step luminance >= ~10% and screenshot step frames at 120px: partly. About 9% per channel step (opacity .14 of a #3A2112 to #EDC080 span) plus a width step; screenshots show clear steps.
- Step ease 0.12s: done.
- Breathe +-.02 or other element: done, both (surface element, +-.02).
- Beat-5 settle fast, reads as a swap: partly. 0.25s (4.75-5.0s); it can still read as an empty-out.
- Pull stretch >= 2x: done, 2.7x and 0.5s.
- Cup never completes: done, tops out at 80%, swaps back.

## What the screenshots showed (headless Chrome, 120px and splash, t=0 to 4.99)
- Steps at t=0, 1.6, 2.6, 4.0, 4.6 are clearly different at 120px (dark, mid, lighter, bright crema). The count reads.
- The pull at t=3.3 is plainly a stream, unlike a drop. At 3.45 the retracting stream leaves a faint dark sliver at the spout.
- t=4.99 and t=0 look identical. 4.6 is nearly a full-looking surface: the fill risk is real.
- Reduced motion frames show a still drop with the crema stepping up. Nothing blinks.
