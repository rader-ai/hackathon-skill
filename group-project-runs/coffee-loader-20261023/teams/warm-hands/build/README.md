# One Pour, by Hand

**Concept:** a top-down cup where one crema spiral is poured at a wrist's pace, one net turn every 5s, leaving a thin coffee-ring stain behind; the wait is a pour already in progress, and nothing ever finishes.

## Palette
| Token | Hex | Role |
|---|---|---|
| `--paper` | #F6EBDD | page background |
| `--glaze` | #FBF5EC | cup rim and handle fill |
| `--espresso` | #2B1A12 | coffee surface |
| `--crema` | #E9C9A0 | the poured spiral |
| `--sienna` | #B5532B | pour tip, spiral tail, thumb smudge |
| `--roast` | #7A4527 | rim line, stain, bloom disc |

## Beat sheet (one 5s cycle, nothing resolves)
| t | What the eye gets |
|---|---|
| 0.0s | Already mid-pour, spiral at 12 o'clock, no entrance |
| 0.0-1.25s | Wrist accelerates out of the turn; bloom rises |
| 1.25-2.5s | Fastest sweep (about 13% over mean); bloom crests at 2.5s |
| 2.5-3.75s | Wrist eases off; bloom ebbs; stain brightens |
| 3.75-5.0s | Slowest sweep, then back to mean speed; frame 5.0 equals frame 0.0 |

## Animated properties
Only `transform` (rotate, twice: `.sweep` 0 to 360deg linear, `.sway` -8 to +8deg and back, eased) and `opacity` (twice: `.bloom` .55-.95, `.stain` .55-1, half a cycle out of phase). No filters, blend modes, layout properties or dash offsets.

## How the loop closes
`.sweep` is exactly 360deg in 5s, so frame 5.0 is frame 0.0. `.sway` and both opacity keyframes start and end on the same value with eased (zero-slope) ends, so velocity matches at the wrap. All four share one 5s period, so nothing drifts. Checked by scrubbing the animations to 0 and 4999.999ms: transforms and opacities match.

## Reduced motion
Under `prefers-reduced-motion: reduce` (or the on-page toggle) the spiral stops in a composed pose (-20deg) and the coffee surface and stain breathe on a slow opacity pulse (.6 to 1, 5s, out of phase). A held pour with a living surface, not a frozen random frame.

## Notes
- One `<symbol id="pour">`, used twice via `<use>`: the 120px box and the splash are literally the same drawing.
- Page JS is only the reduced-motion preview checkbox and Replay button.
- The pour tip: a fat sienna dot at the outer end of the spiral, so the eye follows a stream tip drawing the spiral rather than a rotating decal. Risk we name: a turning spiral can still read as a spinner; the cup, handle and stain carry "coffee".
- Performance, honestly: only `transform` and `opacity` animate, but they are applied to SVG child groups, so Chrome repaints the ~120px SVG each frame (twice, two instances). Not compositor-promoted; cheap, not free.
- Origin: no `transform-box`. The pivot is moved into markup with translate groups, so every engine rotates about the same point. Not yet viewed in Safari/Firefox.
- Accessibility: the 120px instance is `role="img"` "Loading: your coffee is being made"; the splash copy is `aria-hidden`. Integrators should set `aria-busy="true"` on the region being loaded. Reduced motion is opacity only, under 1Hz, no flashing.
- Caveats: no dark-scheme override (a coffee app would want one). The `.rm` block and the media query must stay in sync.
