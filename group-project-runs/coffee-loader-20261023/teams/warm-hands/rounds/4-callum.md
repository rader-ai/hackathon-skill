## Round 4 - Callum (Craftsperson)

Built `build/index.html` (about 6KB, one `<symbol>` used twice via `<use>` for the 120px box and the full-viewport splash) and `build/README.md`, following plan.md's layers: linear 360deg sweep, 5s ease sway of +/-8deg, bloom opacity breath, stain opacity breath out of phase, thumb smudge, wobbled rim, handle stub. Only transform and opacity animate (verified via Web Animations keyframe properties). Loop checked by scrubbing to 0 and 4999.999ms: identical. Reduced motion (media query plus on-page toggle) gives a held -20deg pour with calm pulsing bloom and stain. Replay and toggle are the only JS.

Deviations from plan:
- Bloom disc is filled `--roast`, not `--crema`: a crema disc would swallow the crema spiral at 120px. Opacity range as planned.
- Handle is a ring (outer roast stroke over inner glaze stroke) so it reads as a handle without a fill shape; kept it, did not cut to a notch.
- Dark-scheme override skipped (marked optional; bloat).
- `--caramel` declared but unused.
- Reduced-motion rules are duplicated under `html.rm` for the preview toggle, as the plan allowed.
Said no to bubbles, saucer, steam, speckles, riso, tally, rings.
