# readme-showcase: the README that can't lie

**Hook:** A README should show your project doing its job on the first screen, and every word of it should trace to a line of your code.

## The idea
`readme-showcase` reads a repo it has never seen, finds the one behaviour a stranger would not guess, and writes a short README around it. The first screen is fixed: a sentence naming the reader, a real proof image, copied commands. Every statement sits in a claim ledger with a `file:line`, and a stdlib Python checker exits nonzero on anything untraced.

## What it does on a new repo
Eight numbered steps (0 to 7), each with a stop condition, from preflight to a final checker run.

On the demo repo (sales-call-review) the hook was: a quote is tagged "Quote verified" only if its words appear inside one speaker turn. The README shows three exact transcript lines as a code block, then one 2x crop of the real `report.html`. The caption says it shows only the passing case. The limits say the check ignores speaker, length and context.

## Why it wins
- **Skill:** Declared dependencies, exit codes 0/1/2, stdlib-only checker. The test file passes (33 tests, run this round). A cold run on the demo found 12 snags; all were fixed afterwards, but we did not re-run cold. Demo names remain as examples in two reference files.
- **Truth:** 25 ledger rows. `check.log`: `PASS - 0 fail, 0 unverified (hand-check); 1 images, 41171 bytes`. Where code and docs differ, code wins (`whisper-cli`).
- **Story:** "Verified" is described as the code does it, limits included.
- **Visuals:** One real crop, no faked windows or dark mode. A "no visual warranted" path exists.

## The honest risk
The checker catches missing paths, commands, flags, versions, numbers, hype words and unbacked guarantee words. It cannot catch an invented feature in ordinary words, so the skill requires a manual sentence-by-sentence check. The demo has no failing-quote output, so that state is read from code. The image is light-only, with a border. Screenshots need Chrome and ImageMagick; without them there is no image. We have run the skill on one repo.

## Close
Don't trust the README. The ledger shows where each claim came from, and the checker says whether it held.
