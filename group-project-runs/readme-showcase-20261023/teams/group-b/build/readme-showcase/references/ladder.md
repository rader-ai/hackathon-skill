# The visual ladder

Pick the highest rung the repo has genuinely earned. Record the rung and the reason in your final summary.
"No image" is a legal outcome; a decorative image never is. Never use stock art, gradients, generic banners,
logos you invented, or mock-ups of UI the repo does not have.

| Rung | Earned when | Do this | Tool |
| --- | --- | --- | --- |
| 1. Real captured artifact | The repo ships, or its documented run produces, an HTML page, image, chart or terminal log that shows the product | Capture it at 880 px wide in light and dark if it themes, crop to the part that answers "what do I get?", under ~400 KB each | `scripts/capture.mjs` |
| 2. Reel from a real input/output pair | A readable input and a readable output both exist in repo files or captures, and the transformation is the point | Write 2-3 beats, render | `scripts/reel.mjs` |
| 3. Real code or CLI block | A library or CLI with a documented call and documented result | Show the exact call from the repo's docs/tests and its result as a fenced code block. No image | none |
| 4. Typographic launch | None of the above is true | A strong first line, a short "what it is for" paragraph, and the exact run command. Record: "no visual earned: <reason>" | none |

## Decision table by project type

| Project type | Usual rung | Notes |
| --- | --- | --- |
| Generates a report / page / chart / image | 1 (+2 if a clean pair exists) | Prefer the real artifact; the Reel only if it shows the input becoming output |
| Data tool or CLI with sample input and output files | 2 | Beats: input line -> check -> result |
| Library with doctests or tests that show a call and value | 2 or 3 | Two beats (call, value) is enough; do not pad |
| Web app you cannot run safely | 3 or 4, unless the repo ships screenshots | Never fabricate a UI image |
| Config, template, infra or docs-only repo | 3 or 4 | Show the file's most telling real excerpt |
| Pre-existing screenshots/GIFs in the repo | 1 | Reuse them (cite the file); do not recreate |

Rules for all rungs: if the light and dark captures are byte-identical (`cmp`; the page does not theme itself), ship ONE image captured with `--frame` (border plus matte) and embed it as a plain `<img src="assets/x.png" alt="..." width="880">`; if they differ, ship both in a `<picture>`; alt text that says
what the image shows in words (and transcribes any numbers); total assets under 1.5 MB target, 6 MB hard cap;
if two visuals show the same thing, delete one (a rung 1 capture and a rung 2 Reel of the same input and output are the same thing). Put the visual that proves the most (usually the real captured output) first; a decoration must not push the proof below the fold.
Choose the crop with `capture.mjs --list`, then look at the PNG; a page header or a row of stat tiles is rarely the answer to "what do I get?".
