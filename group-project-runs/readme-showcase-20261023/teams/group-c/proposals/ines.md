# Ines - Round 1 proposal

## The three most obvious ideas (and why I'm not shipping them as-is)

1. **The template filler.** Detect language, pour the repo into Title / Badges / Features / Install / Usage / License. Fast, and it reads like every other README. Judges have seen ten thousand.
2. **The capture maximalist.** Screenshots, GIFs, an animated SVG banner, a diagram of everything. Looks busy, and half of it earns nothing.
3. **The fact-checker bolted on at the end.** Write a glossy README, then lint it. Honest, but the story is written first and the truth is patched in after.

My version differs from all three in one move: **the README is assembled from a claim ledger, not drafted and then checked.** No sentence exists before it has a source.

## Concept (one sentence, any repo)

`readme-showcase` first answers five reader questions (what goes in, what comes out, who is it for, how do I get a first result, what will it not do) from evidence in the repo, records each answer in a ledger with its source file, and only then writes a README whose first screen is the real input-to-output proof for the one job the project does.

## How it decides what to say

A fixed sequence, so a cold session never guesses:

1. **Inventory** (script): list files, entry points, manifests, existing README, docs, examples, tests, license, any generated artifacts. Prints a plain JSON. Fails loudly if the path isn't a repo or is empty.
2. **Five questions -> ledger.** Each answer is one line in `claims.md`: `claim | source (file:line or command output) | status (verified-by-reading / verified-by-running / not-checkable)`. Commands are only included if they appear in the repo's own docs or entry-point help. If the skill can't run them (as here), they are marked "copied from repo docs", never "tested".
3. **Pick the one job.** The README leads with one sentence of the form "Takes X, gives you Y." Everything else is ranked by how often a first-time user needs it: run it, use your own data, what it does not do, privacy/limits.
4. **Cut list.** Anything in the repo README that is hype, unverifiable, or about the author's journey goes to a "left out and why" note for the maintainer, not into the README.
5. **Name check.** Use the name the repo itself uses in its own title; if the folder, repo and title differ, say so in the hand-off note (this demo has that: `sales-call-review` vs "Call Review Lab").
6. **Verify script** (`verify_readme.py`, stdlib only): checks every relative link and image path exists, every fenced command's first token/script/flag appears in the repo, every number in the README appears in the ledger, no banned hype words, asset bytes under budget, alt text present. Exits non-zero with a specific line number.

## How it decides what to show

A ladder, take the first rung the repo actually has:

1. A generated artifact (HTML report, image, chart, rendered output) -> screenshot of it, cropped to the part that proves the job, at a width that reads on GitHub.
2. Real terminal output the repo documents -> a text code block (not an image).
3. A genuinely non-obvious flow in the data model -> a small SVG, only if prose needs more than 3 sentences.
4. None of the above -> **no visual**, and the hand-off says so. A library with no output gets a code snippet, not a banner.

Rule of thumb: max 2 images unless a third answers a question the first two cannot. Every image gets alt text that states what you are looking at. Opaque backgrounds so it survives dark mode.

## The demo README, section by section

1. **Title + one line.** "Call Review Lab - turns sales-call transcripts into an account timeline and a coaching report where every quoted line is checked against the transcript." (Source: README intro, `run.py` report/verification.)
2. **The proof (hero image).** Screenshot of `workspace/report.html` top: the five counters, "Patterns to investigate", Harbor Tools card with the "Quote verified" tags. Caption says: synthetic data, produced by `python3 run.py demo`. Why: it is the real output and the whole value is visible in it.
3. **What goes in / what comes out.** Three bullets each. In: Markdown transcripts with `**Speaker** [mm:ss] text`, a CSV timeline (columns listed), optionally an analysis JSON. Out: `metrics.json`, `verification.json`, `report.html`. Note that calls with no recording stay in the timeline (visible in the report as "Transcript absent").
4. **Try it in two minutes.** The exact clone / `python3 run.py demo` / open commands from the repo README, Python 3.10+, stdlib only. Note the report is local and git-ignored.
5. **Use your own calls.** `init`, `add`, `report`, and `import-csv`, with flags exactly as in `run.py`. Link to `examples/`.
6. **How the evidence check works.** Short, plain: each quote must sit inside a single speaker turn; failures are flagged and hidden. Second crop image (the "Quote verified" rows) only if it adds legibility over the hero; otherwise skip.
7. **What it doesn't do.** Copied from the repo's own honesty: no model API calls, no CRM fetch, no speaker identification in transcription, word/question-mark counts are proxies, not speaking time or quality. This is a selling point for this audience, not a footnote.
8. **Privacy note, optional transcription, tests (`python3 -m unittest discover -s tests`), docs links, license (MIT).**

No badges. No benchmark. No "AI-powered".

## Rubric self-score (honest)

- **skill (25):** 8. Fixed five-step procedure, explicit inputs/outputs/stop conditions, one stdlib script pair (inventory + verify) that fail loudly. Risk: a long SKILL.md that a cold agent half-follows. Keep it under ~150 lines, put the ladder and banned words in `references/`.
- **truth (20):** 9. The ledger is the deliberate honesty mechanism and the verify script enforces part of it. Limit: it can check that paths and commands exist, not that prose is faithful.
- **story (20):** 8. Input-to-output first screen, plain voice. I'd rather be clear than memorable (my known weakness), so it may read a touch dry.
- **visuals (20):** 7. One real screenshot, well cropped, plus maybe one more. Won't wow, but it's the actual product. Wes will want more; I will say no.
- **pitch (15):** 7. "Every sentence has a source" is easy to say and demonstrate; the pitch can show a three-row ledger excerpt from the demo.

## Riskiest part

The ledger could become paperwork: if a cold session fills it in lazily, it protects nothing, and a reader of the final README never sees it. Mitigation: the verify script refuses to pass if any number, command or file name in the README lacks a ledger row, and the ledger ships beside the demo README so judges can audit it. Second risk: a plain README with one screenshot may look beige next to a groupmate's flashier proposal.
