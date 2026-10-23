## Round 6 - Pablo (Craftsperson)

Fixed in build/index.html and README.md. Checked only with a headless Chrome screenshot on file://; the glitch frame itself was not captured, so timing is by reading the keyframes.

1. Glitch overshoot: fixed. Band and ghost sit in a static `<clipPath>` shaped like the cup body (unique ids per SVG), so the stripe slides behind the cup edge. `--slip` 6px, `--ghost` .35, out 3.05-3.25s, back 3.35-3.55s, ease-in-out. Still lands on the 3s drop. Glitch kept, tamed.
2. pitch.md: ignored as instructed.
3. Orange drop: drop and ring now `--crema`. Orange is only the lit pip and the ghost ("system acting").
4. Pip countdown: kept the pips (Zara's chaser is the concept), but the lit pip now trails off over a second (comet, not a counter) and `--pip-off` is #6B4430 (was 1.5:1, now about 2.4:1). Won't delete them: the chaser is the countable half of TICK.
5. Compositor claim: removed all three `will-change` lines; README says transform and opacity only, SVG children repaint. Duplicated SVG kept (Safari `<use>` untested).
6. Literal 5s: comment "cycle 5s; beats 1s x5" above `:root`; README lists band as 5s.
7. Untested surfaces: still stated in README.
8. Reduced motion: README calls the parked drop "a drop about to fall"; duplicate block already commented as sync-required.
