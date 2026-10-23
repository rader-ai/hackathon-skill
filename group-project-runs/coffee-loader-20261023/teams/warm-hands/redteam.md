# Red Team - One Pour, by Hand (Agnes, Round 5)

Inspected: build/index.html (6.2KB), build/README.md, rendered headless Chrome at file:// (both instances, mid-cycle). Safari/Firefox not available to me; those findings are by reading, flagged as unverified.

## Ranked issues (most expensive first)

### 1. pitch.md does not exist (pitch: up to 15 pts, plus Mara's "honest about risk")
The judges' brief lists three required deliverables. TEAM/ has build/ but no pitch.md. A missing file scores near zero on the 15-point criterion and may read as breaking constraints.
Fix: write TEAM/pitch.md, 400 words max, covering: what it is, why coffee (pour-over bloom, hand-poured, the coffee ring left by a person), why shorter wait (steady 72deg/s sweep, no finish beat, starts mid-pour), and the risks listed here (spinner-in-costume, Safari unverified, SVG transforms are main-thread). Count the words.

### 2. The idea can read as "hypnosis spiral in a mug" or a cinnamon roll (concept 20, clarity 20; Henrik and Rosie)
A spiral rigidly rotating about its own centre is not a pour; nothing is arriving. A pour has a source and adds liquid. At 120px the render (checked) shows a brown disc with a cream swirl, which a tired customer may call "stirring", "cinnamon roll" or just "spinner with a cup around it". The cup rim, handle and stain are what carry "coffee", and the stain is hairline at 120.
Fix (cheap, no new animated property): make the leading end the focus. Give the outer tip of the spiral (18,60) a fat round head, e.g. a `circle r=4.5` in `--sienna` inside the `.sway` group at the path end, so the eye tracks a "stream tip drawing" the spiral rather than a rotating decal. Then say in the pitch that the sweep is the pour tip travelling, and name the hypnosis risk yourself.

### 3. "Compositor-only" is overclaimed (craft 20; Sun Park will test this)
The README and plan imply compositor motion. `transform` and `opacity` on SVG child elements (`.sweep`, `.sway`, `.bloom`, `.stain`) generally repaint the SVG on the main thread in Chrome and are not promoted to their own layers; `will-change` on SVG children is largely a no-op. The properties are the allowed ones, so it passes the letter of the rubric, but a profiler-minded judge will see paint per frame, twice (two instances).
Fix: either (a) soften the claim in README ("only transform and opacity; SVG children, so repaints a ~120px area") or (b) the real fix: put the spiral in its own `<svg>` stacked absolutely over the cup svg inside a `div.loader`, and animate that svg element's `transform` and the bloom/stain as opacity on their own stacked svgs. (b) costs roughly 15 lines and makes the claim true. If time is short, do (a).

### 4. Cross-browser fragility: `<use>` shadow tree plus transform-box (craft; Callum's own flag)
`transform-box: view-box; transform-origin: 54px 60px` on elements inside a `<symbol>` instanced twice. Chromium resolves the view-box against the symbol viewport; Safari and Firefox have historically differed on which viewport applies inside `<use>` shadow trees, and animations on `<use>` clones have bitten WebKit before. Failure mode: the spiral orbits a wrong point, which is a loud, visible bug. Nobody has seen it in Safari.
Fix (removes the dependency entirely): drop `transform-box`, set `transform-origin: 0 0`, and move the origin into the markup:
`<g transform="translate(54 60)"><g class="sweep"><g class="sway"><g transform="translate(-54 -60)"> ...both pour paths... </g></g></g></g>`.
The attribute transforms stay on the outer and innermost groups; CSS animates only the two middle groups. SVG default origin is already 0 0, so every engine agrees. Re-scrub to 0 and 4999.999ms after the change.

### 5. Splash is not truly full-viewport (clarity/craft, rubric constraint)
Brief: "a full-viewport splash". Build: the splash is a flex pane next to the small one, a 70vmin loader inside `min-height:100vh`. On narrow windows the panes wrap and the page scrolls; the fixed `.ctl` panel overlaps the splash label. A literal judge may mark "side by side" as satisfied and "full-viewport" as half.
Fix: make `.big` fill the viewport region beside the 120px box (`flex:1 1 0; height:100vh`, loader `width:min(80vh,100%)`), and at `max-width:560px` stack with the 120 box pinned top-left over the splash. Keep `.ctl` bottom-right but give the label `margin-bottom:56px`.

### 6. Fine detail dies at 120px (clarity; Mara "falls apart at 120px")
Verified in render: the stain arcs (1.8 units, opacity .55) and the smudge read as noise or dirt, and the handle ring's inner 4-unit glaze stroke leaves ~1.5px outlines. Not fatal, but it is exactly the "detail that turns to mush" line.
Fix: `.stain` stroke-width 2.6, base opacity .7 (calm keyframe .7 to 1), `.handle` outer 8 and inner 4.5. Or cut the smudge ellipse. One-glance read is cup plus turning cream; the stain is a bonus, not a load-bearer.

### 7. Accessibility semantics are thin (clarity/inclusion; Amara)
Two identical `role="img"` labels announce the same thing twice; there is no `role="status"`, nothing says "loading". Reduced motion is genuinely designed (held pose plus slow opacity pulse, nice), but README should state the pulse is opacity only and under 1Hz, and that no flashing exists.
Fix: label the 120px instance `aria-label="Loading: your coffee is being made"` with `role="img"`; add `aria-hidden="true"` to the splash instance; add `aria-busy` note in README for integrators.

### 8. Minor
- `--caramel` unused: remove or use it for the bloom highlight (a maintainer reads dead tokens as sloppiness; Sun).
- No dark-scheme override: harmless for a self-contained demo, but a coffee app has dark mode; at least note it in README caveats.
- Reduced-motion rules are duplicated under `html.rm`; acceptable, but add a comment that the two blocks must stay in sync.
- README says sweep is "about 13% over mean" while plan said 14; harmless, pick one.
- Handle: I still say it is the one cute thing. It earns its place (reads as a cup, not a plate), so keep it, grudgingly.

## Callum's deviations, checked
- Bloom filled `--roast`: fine and correct; a crema bloom would vanish into the spiral (seen in render). Approved.
- Handle as ring: reads OK at 120 but borderline thin; see 6.
- No dark scheme: low cost.
- Unused `--caramel`: nit.
- Safari `transform-box`: unverified, real risk; see 4.

## Loop and constraint audit
Checked by reading: `.sweep` 360deg linear 5s, `.sway` and both opacity loops start/end equal with eased ends, all 5s. No seam found. Only transform/opacity animate. No external assets. JS is toggle and replay only. Reduced-motion block and preview toggle present and equivalent. 5s cycle declared via `--cycle:5s`.

## Guessing the hidden signature criteria (and does the build survive)

| Judge | Likely signature | Survives? |
|---|---|---|
| Mara Okafor | "Frame zero test": does the loader look like it is already mid-task, with no entrance, no resolve, no seam? Or "the longest still moment must be under half a second". | Yes. Starts mid-pour, no holds, linear sweep never stops. Strongest area. |
| Henrik Vale | "Sticker test": would it work as a one-colour sticker on a bag or a barista's cup sleeve, and could it only be this café's? Or "is there a gesture of a human hand, not a machine". | Partly. Wobbled rim and thumb-ring say hand-made. A spiral in a top-down cup is also what half the café world already does; ownability depends on the pitch naming the one idea (the stain) and issue 2. |
| Sun Park | "Frames per second on throttled CPU with a paint-flashing overlay", or "total bytes under 10KB, no layout, no filters". | Bytes: yes (6KB). Paint flashing: SVG children repaint; see 3. Fix 3(a) at minimum so the README does not lie. |
| Amara Diallo | "Does reduced motion still show progress, not a frozen frame", or "no cadence faster than 3Hz / no abrupt contrast change". | Yes. Held pour plus slow pulse. 72deg/s is calm. Add the semantics in 7 and she is happy. |
| Rosie Tran | "Does it say coffee before I count to one", or "Does it look like it is going to take forever?" | Coffee: yes if she sees the cup, but the spiral is ambiguous (issue 2). Speed: one turn per 5s is slow for a loader; risk of "feels stuck" on first glance since the cup stays still. The sway helps; do not slow it further. |

## Verdict in one line
The loop and craft are clean; the three things that will actually cost points are a missing pitch.md, a spiral that reads as a spinner with a cup, and a compositor claim plus Safari origin risk nobody verified.
