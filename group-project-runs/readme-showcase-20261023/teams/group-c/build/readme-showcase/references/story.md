# Story: what the README says and in what order

## The hook (step 2)
Goal: one sentence about what this repo does that a stranger would not guess from its name.
1. List 3 candidate behaviours from the repo's docs and code: things it refuses to do, checks, hides, enforces, or guarantees, or an unusual input/output pairing.
2. For each, find the line of code or output that proves it. A candidate without a line is dead.
3. Pick the one a developer would repeat to a colleague. Prefer a concrete guarantee ("every row is matched to one source record or dropped") over a category ("analyzes data").
4. If every candidate is ordinary (a typical library), use the plainest input-to-output sentence and move on. Do not manufacture a hook.
Write the hook and its proof line in the ledger as row 1.

## First-screen contract
Everything a reader sees before scrolling, in this order, and nothing else:
1. `# Title` (the project's real name).
2. One sentence: what goes in, what comes out, and **for whom**. Name the reader using the repo's own words (cite the line in the ledger). If the repo names no reader, write the sentence without one and record that in LEFT-OUT.md; do not guess an audience.
3. The proof: one image (visuals.md) or, if no visual, one real code-in/output-out block.
4. `Try it`: commands copied from the repo's docs, with the requirement (language version) in one line above. The budget of 2 to 4 counts commands that run the project. The get-the-code step (`git clone`, `cd`) is never cut if the repo's README has it: a visitor has no checkout. Where the docs give OS variants (macOS `open`, Linux `xdg-open`), keep both as the repo does. Test and lint commands may move below the first screen.
No badges, banner, table of contents, or "Features" list above the commands.

Five-second test, answer from the top of the page alone: What does it do? Who is it for? What do I type? If any answer needs scrolling, rewrite.

## Section order after the first screen
1. What goes in / what comes out: real file names, formats, folders.
2. Use it with your own data: condensed from the repo's docs; keep real commands only.
3. Limits: copied from the repo ("does not do X", "needs Y"). If the repo states none, write none; do not invent modesty.
4. Privacy / data handling: only if the repo says something (for example, nothing leaves the machine).
5. Tests / contributing: only if there is a real command.
6. License: the real identifier from the LICENSE file.
7. Optional `<details>` "How this README was checked" with the checker output.

## Guarantee sentences ("only if", "never", "every", "always")
These are the sentences readers and reviewers test against the code. For each one, read the function and write in the ledger what it checks and what it does not (case folding, substring vs exact, minimum length, who is speaking). Word the README to the real strength, e.g. "if its words appear inside one speaker turn", not "guaranteed accurate".

## Voice
- Specific nouns and verbs. Short sentences. Second person is fine ("you get a report").
- Say what the code does, not how good it is. No superlatives, no "powerful", "seamless", "robust", "AI-powered" unless it literally uses a model and you can cite the call. The full banned list is `banned-words.txt`; the checker fails on it in prose.
- Numbers only if they are in the repo or in output you captured. Counts you did yourself (for example "6 files") go in the ledger with the source.
- No testimonials, no "trusted by", no roadmap promises.

## Dependencies named in the Limits
When docs and code differ in detail (e.g. the docs say "whisper.cpp", the code calls a binary named `whisper-cli`), the code wins: name the real binary and cite the code line.

## Badges
Default: none. Allowed only if the repo has the real thing (a CI workflow file, a published package) and the maintainer would plausibly want it; then pass `--allow-badges` to the checker and explain in LEFT-OUT.md. A badge for something that does not exist is an invented claim.

## Headings and length
Plain headings a skimmer can jump by. Aim for under 120 lines. If a section would only repeat the docs, link to the doc instead (links to files in the repo are checked).
