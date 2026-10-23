# Visuals: decide, capture, check

Default is fewer. A README with no image and a real output block beats a decorative image.

## Decision ladder (stop at the first rung that applies)
1. **Real prebuilt artifact** the repo already produced (an HTML report, screenshot, SVG, chart in `docs/`): capture it. Candidates are in `inspect.json` under `prebuilt_visual_outputs`.
2. **Real command output** you can copy from the repo's docs or a stored output file: a fenced code block. Never invent output, never type a fake terminal session, never draw a fake window.
3. **Nothing.** Write `no visual warranted: <reason>` in the ledger (for example, "library with no visible output"). That is a valid answer; the checker only warns.
Do not run the repo to create an artifact (Ground rule 2) unless its docs call it safe and the user agreed.

## Limits (the checker enforces them)
- At most 2 images, 1.5 MB total. Default is 1. A second image needs a different job than the first, stated in the ledger.
- Every image has alt text that says what it shows, in a full sentence.
- No GIFs, banners, logos you drew, or dark/light variants unless the repo itself ships them. If the artifact has only a light theme, frame it with a thin neutral border (see below) so it reads on a dark GitHub theme; do not fake a dark version. Add the border after capture: `magick IMG.png -bordercolor '#d0d7de' -border 2 IMG.png`. Say in your report that the image is light-only.

## Legibility
GitHub shows README images about 830 px wide. Capture at 1000 px width, crop to 830 px wide or less, and use `--scale 2` so type stays sharp when shown at 830 px. Open the PNG and read the smallest text; if you cannot, crop tighter. Prefer a tight crop of the one part that carries the hook over a whole-page screenshot.

## Capture (`scripts/capture.sh`)
```
bash SKILL_DIR/scripts/capture.sh INPUT.html OUT/assets/NAME.png 1000 full --crop 830x420+40+120 --scale 2
```
Find the crop box as described under "Finding the crop box". Do the full capture in `OUT/.scratch`, outside `OUT/assets`, so it does not count against the budget.

## Proof with input text (when the hook is "this input becomes that output")
Do not compose a fake window or side-by-side picture: nothing in the repo renders it. The input goes in the README as a fenced code block of exact repo text (it renders in light and dark themes and can be copied); the image is one crop of the real artifact.
1. Copy the matching input text exactly (a log line, a config snippet, a row). Do not edit or shorten the words.
2. Put it in a fenced block directly above the image with one lead-in line ("Two lines from `examples/discovery.md`:").
3. Crop the image from the real artifact at `--scale 2`, so the smallest text is at least as large as body text when shown at 830 px.
4. Under the image, a one-line caption naming sources: "Crop of `workspace/report.html` (synthetic data from `examples/`)." The ledger job line says the same.
5. If the artifact only shows the happy path, say so in the caption or LEFT-OUT.md rather than imply the failure case was captured.

## Finding the crop box
1. Capture the full page once to `OUT/.scratch/full.png` (no `--crop`), then `magick identify OUT/.scratch/full.png` for its size.
2. View it with the Read tool and note the pixel box of the part that carries the hook. Crop with a few pixels of padding and capture again; view the result. Expect two tries; if the third is still wrong, widen the box and accept it.
3. Delete `OUT/.scratch/` at the end.

## Alt text and placement
`![The report section that quotes the call, each quote tagged verified.](assets/proof.png)` describes content, not "screenshot". The first image sits under the one-line description (and the input block, if any), above the commands.

## If capture fails
Exit 2 (tool missing) or 1 (no output): do not retry in loops and do not substitute a hand-drawn image. Use rung 2 or 3, and write the reason in LEFT-OUT.md.
