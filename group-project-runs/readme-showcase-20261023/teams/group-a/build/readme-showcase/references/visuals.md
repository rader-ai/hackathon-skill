# Visuals

A visual earns its place only if it shows the real project doing its real job. "No visual" is a valid, often correct, verdict.

## Warrant test (three questions, all must be yes)

1. Does the repo produce something visual (an existing or generated HTML page, image, chart) or document a command that does, which you are allowed to run safely?
2. Would a reader learn something from seeing it that a text block of the same size could not say?
3. Can the evidence region be shown at 880 px wide with text of at least 14 px?

## Decision table

| facts / repo | verdict | action |
|---|---|---|
| an existing or reproducible HTML page, UI, chart or report | `capture` | `scripts/shot.mjs`, crop to the evidence region, light and dark pair. Check `facts.outputs[].gitignored`: if true the file is generated, never "committed" |
| terminal output only | `text` | a code block, pinned as an `output` row; no screenshot of a terminal |
| several stages with 3+ real file or stage names and no visual output | `flow` (optional) | hand-written SVG using only names from facts; under 8 KB; text >= 14 px at 880 px wide; has `<title>`; no animation required |
| library, no UI, no committed images | `none` | `assets-check.mjs --allow-empty`; the captured text output carries the proof |

Record the verdict and one reason sentence in `ledger.visual`. List each asset with its source (`capture of <file>` or `hand-drawn from facts`).

## Capture

```
node $SKILL/scripts/shot.mjs <page.html> --out <ASSETS> --name <base> --width 880 --height 2400 --scale 2
```

1. Run `node $SKILL/scripts/shot.mjs <page.html> --list --width 880`. It prints candidate elements with their top and height in CSS px. Read the page text too.
2. Choose what to show by this priority, and sacrifice from the bottom: (a) the evidence for the opener's first promise (the row behind `output_noun` and the most specific claim, such as a gap or a check result); (b) the headline numbers; (c) one piece of evidence tied to a ledger row (a verified quote, a count matching captured output); (d) everything else. If (a) to (c) do not fit in 1760x1400 at scale 2, make two images (`<base>-1`, `<base>-2`, each at least 1760x600, total under 1.5 MB) instead of dropping (a).
3. Crop with selectors, never by eye: `--clip 'SEL_A;SEL_B'` takes the union of the first element matching each selector plus 12 CSS px, full width, so every edge is an element boundary. Use `--only light --frame` for pages without a dark theme. `--crop WxH+X+Y` stays for pages where no selector fits; then the edge must sit in a gap between blocks.
4. Data inside the capture must be the project's real output. If the output is synthetic demo data (as in a repo's own demo command), say so in the caption.
5. If the page has no dark theme, `shot.mjs` prints a NOTE that light and dark are identical. Then do not ship a fake pair: re-run with `--only light --frame` (adds a hairline border and margin so the light card reads on GitHub dark), ship one file named `<base>-light.png`, and list `<base>` in `<ASSETS>/PAIR-EXCEPTIONS.txt` with a `#` comment line saying why.
6. Legibility: open the final PNG and read the smallest text. If you cannot read it at 880 px wide, crop tighter or capture at a narrower `--width` so the page lays out larger.

## Markup (works on GitHub in light and dark)

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/NAME-dark.png">
  <img alt="Describe what the picture shows, with the key numbers" src="assets/NAME-light.png" width="880">
</picture>
```

Single image: `![alt text](assets/NAME-light.png)`, or a raw `<img alt="..." src="assets/NAME-light.png" width="880">` (lint reads both). Two images: two blocks, each with its own sentence saying what it shows. Alt text states what is shown, not "screenshot". Paths are relative to the README.

## Constraints and budget

- GitHub README images: PNG/JPG/GIF/SVG. No scripts. SVG with CSS animation plays when shown as an image; only use it if the motion carries information.
- Total assets: under 6 MB (hard), aim under 1.5 MB. `assets-check.mjs` enforces the hard cap and warns over the target.
- Width at least 880 px (1760 at 2x preferred). Light and dark of one image have identical pixel dimensions.
- If a PNG is large, `magick in.png -colors 64 PNG8:out.png` often shrinks flat UI captures by 80%+; re-read the result for banding.
- Run `node $SKILL/scripts/assets-check.mjs <ASSETS>` after every change to assets.
