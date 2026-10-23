## Round 4 - Pablo (Craftsperson)

Built build/index.html (one file, about 9 KB, no external anything) and build/README.md per plan.md. TICK as specified: 120px box plus full-viewport splash, 5s cycle, drop and ring on 1s keyframes, pips/band/ghost on 5s, only transform and opacity in any keyframe, `--slip` 9px and `--ghost` .5 as dials, reduced-motion block plus a page toggle, Replay button. Checked in Chromium: durations are 1s and 5s only, state at 4.99999s versus 5.00001s differs only by the pip hop, glitch and reduced-motion frames look right at both sizes.

Deviations, all small:
- Zero cloning script: the SVG is repeated verbatim in the splash (plan allowed either), so JS is only Replay and the toggle.
- Cup opening is a dark coffee-surface ellipse at y56 and the slipping band sits lower on the cup body (y66-76), because a crema band over a crema surface made the drop landing invisible. Drop falls 25 units, not 32, to match.
- Pip direction fixed: plan's `--i * -1s` delay lights pips in reverse; used `(i - 5) * beat`. Pips hop on instantly and fade off over 0.3s.
- Drop starts from opacity 0 (fades in during the swell) so the keyframe wrap has no pop.

Not done: no real-device test; the 9px glitch is still an untested judgement call (dial documented).
