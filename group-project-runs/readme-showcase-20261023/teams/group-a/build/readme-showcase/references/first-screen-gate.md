# First-screen gate

"First screen" is the first 40 lines of the README source (about what a reader sees on a laptop before scrolling). `scripts/firstscreen.mjs <readme> <claims.json>` runs nine pass/fail checks. Exit 0 means all nine pass.

| id | pass when | why |
|---|---|---|
| `opener-nouns` | the first sentence under the H1 contains `first_screen.input_noun` and `output_noun`, and both appear in PINNED rows | the reader learns what goes in and what comes out in one sentence |
| `swap-name` | remove the project name from that sentence: at least 4 specific words remain and at least 2 occur in ledger evidence | "X is a powerful tool for Y" survives a name swap; real sentences do not |
| `no-hype` | no word from `references/banned-words.txt` in the first 40 lines | hype tells a skimming reader nothing |
| `real-output` | an image listed in `ledger.visual.assets`, or a code block whose text matches a PINNED `output` row, is within 40 lines. A `none` verdict with a reason of 20+ characters passes with a NOTE | proof beats adjectives |
| `first-command` | a PINNED `command` appears in a code block within 40 lines (or `first_runnable_claim` for non-shell usage; or `no_command_reason` when the repo documents none) | the reader can try it |
| `why-phrase` | the `why` row's value appears in the first 40 lines | the reason to care is the repo's own, cited |
| `visual-shows` | if a ledger image is on the first screen, `visual.shows` lists PINNED ids | the picture proves something specific |
| `producer` | `output_producer` is set; if it is not `code`, `producer_phrase` is in the first 40 lines | a reader must not think the tool writes what the user or a model must supply |
| `quickstart` | every `quickstart_lines` entry is a command in a shell fence in the first 40 lines, in order | the reader can go from nothing to output without guessing a clone, cd or open step |

## Choosing the nouns

- Input noun: the thing the user hands the project (`web access log`, `title`, `invoice folder`). Take it from the code or docs, not from your summary.
- Output noun: the thing they get back (`ranked list`, `URL slug`, `HTML report`). It must be something the project actually produces (an output file that exists in the repo, or a documented file; say "generated" if the repo gitignores it).
- If the project does several things, pick the one the repo's own docs lead with. The rest belongs lower on the page.

## Writing the opener (judgement, with a test)

Shape: one sentence, input to output, then the reason in the repo's own words. Two sentences maximum before the first command.

Good (generic examples):
1. "Tally turns a web access log into a ranked list of the paths that get the most hits, so you can see where traffic goes without a dashboard." (input, output, a why lifted from the docs)
2. "slugify-lite turns a title into a URL slug: lower case, words joined by hyphens." (small and exact)
3. "Ledgerlint reads a folder of invoices and flags the totals that do not add up." (concrete input noun, concrete output)

Bad:
1. "Acme is a powerful, flexible tool for managing your data." (fails no-hype, swap-name, opener-nouns)
2. "A simple and elegant solution to a common problem." (no nouns at all)
3. "Tally: log analysis, reimagined." (slogan; nothing a reader could verify)

If the check fails, do not argue with it by adding adjectives. Re-read the repo's docs and find the sentence its author wrote when explaining the point of the thing, quote it into the ledger, and build the opener from it.

## What the gate does not guarantee

It guarantees the opener is specific, grounded and unhyped. It does not guarantee it is good. After it passes, read the first screen as a stranger and ask: would I know who this is for and why I would try it? If not, the "who" is missing; add it in the second sentence only if the repo states the audience somewhere you can quote.
