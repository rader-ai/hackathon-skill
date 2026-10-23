# Dan (Producer) - Round 1 proposal

## The three most obvious ideas (and why I'm not picking them as-is)

1. **Template filler.** Detect language, drop in Title / Badges / Install / Usage / License. Fast, and exactly what every judge has seen. It fails `truth` because it invents install steps from file names.
2. **Hero-banner-and-GIF maker.** Auto-generate a logo banner and record a GIF of "the app". Pretty, but the banner is the stock-looking decoration Keiko hates, and most repos have nothing to GIF.
3. **LLM summarizer with a badge wall.** Read the repo, write a pitch, bolt on shields.io badges. Hype plus invented badges; the two things the judges list as point losers.

My version is none of these because **the README is the cheap part; the product is the receipt.** Every factual sentence, command and path in the README is registered in a claims ledger with its source (file:line or a captured output), and a bundled script checks the finished README against the repo and fails loudly. A maintainer ships the README on Monday and can audit it in five minutes because the ledger is next to it. No other group's "be honest" will be a mechanism a judge can run.

## Concept (one sentence, any repo)

`readme-showcase` reads a repo, writes down what it can prove (the ledger), writes a README only from ledger entries, shows the one visual the repo's real output earns (or none), and runs `check_readme.py` to fail on anything untraced, unrunnable or oversized.

## How it decides what to say

Fixed, boring pipeline so a cold session can't improvise:

1. **Inventory** (script `scripts/inventory.py`, stdlib only): manifest files, entry points, CLI subcommands (argparse / click / package.json scripts / Makefile targets), license, tests, existing README, existing generated artifacts. Prints JSON. Fails loudly if the path isn't a repo or is empty.
2. **Answer four questions from the repo, each with a source:** What goes in? What comes out? Who is it for? What is the shortest path to a real output? If a question has no source, the skill says "unknown" and either asks the user or omits the section. Never fills the gap.
3. **Ledger** (`readme-claims.json`): one row per claim: `{id, text, kind: command|path|requirement|behavior|limit, source: file:line | output:<file>}`. Behavior claims must cite code or real output, not a docstring alone.
4. **Write** README sections in a fixed skim order: what it is (one sentence, input -> output), the visual, try-it commands, who it's for / when not to use it, usage, limits, license. Hype-word list in `references/banned-words.md`, enforced by the checker.
5. **Check** with `scripts/check_readme.py`: every fenced command's first token resolves to something in the repo or is a declared external tool; every relative path/link/image exists; every ledger id appears in the README and every number in the README is in the ledger; asset budget; banned words; headings order. Exit code non-zero with a line per failure.

## How it decides what to show

A decision table in `references/visuals.md`, ranked by honesty:

- **Repo already produces a visual artifact** (HTML report, image, PDF, chart): capture that, real data, cropped to the part a visitor needs, one or two images. This is the demo case.
- **CLI with short text output:** a fenced code block of the real captured output. Text, not a picture; it's greppable, light/dark safe, and weighs nothing.
- **Library / API:** code snippet plus its real printed result. No screenshot.
- **Nothing visible** (config, infra, a pure lib): no image. The skill must say "no visual warranted" in its report. Zero is a valid answer and scores on `visuals`.
- Hard rules: no banners, no logos made up, no mock screenshots, total under 4 MB (budget below the 6 MB cap), each image has alt text that says what it shows.

Capture itself: use `scripts/capture.mjs` if present (declared dependency: node + Playwright via the brief's tool) with a clear error if absent. The skill never runs the target's code unless the user says so; it uses artifacts already on disk. That is the same rule the brief gives us, turned into a general policy.

## The README for the demo repo, section by section

(Title: **Call Review Lab**, because that is what the repo's own README and report call it; repo slug stays `sales-call-review`.)

1. **One-liner + subtitle.** "Turn call transcripts into an account timeline, quote-checked observations and an HTML coaching report." Source: README.md intro and `report()` in run.py.
2. **The visual (first screen).** A cropped screenshot of the real `workspace/report.html`: the header, the five count cards and the Harbor Tools timeline card showing "Transcript reviewed" next to the "Transcript absent" follow-up. It proves the headline feature (unrecorded calls stay visible) and the evidence tag ("Quote verified"). Alt text describes it. One image, around 150-300 KB. Possibly a second, narrower crop of the Patterns section only if it adds something; otherwise skip.
3. **What goes in / what comes out**: a small 3-row table: input (Markdown transcripts with `**Speaker** [mm:ss] text`, plus optional CSV), process (word/question counts, quote check), output (`report.html`, `metrics.json`, `verification.json`). Every cell cites run.py.
4. **Try it** (the repo's own commands only): `git clone`, `cd`, `python3 run.py demo`, open the report. Requires Python 3.10+, stdlib only. Notes the report is generated and git-ignored (README says so).
5. **Use it with your own calls**: the short path (`init`, `add`, `report`) plus `import-csv` with the nine columns. Link to the full README rather than copying it.
6. **How it keeps itself honest**: the quote check (a quote must sit inside a single speaker turn; failed quotes are hidden and counted). Real differentiator, directly from `verify()`.
7. **Limits** (the repo states these, so we repeat them): talk share is word share not speaking time; question marks are not question quality; model analysis is not automated, you run `prompts/analyze_call.md` yourself and save `analysis.json`; transcription via whisper.cpp is optional and external; privacy note about pasting transcripts to a cloud model.
8. **Docs, license, credits**: `docs/METHOD.md`, MIT, Chris Rader.

Everything in the sample data is invented, so the README says so near the screenshot. No badges at all (no CI, no package registry exists).

Trap I will not fall into: calling it "AI-powered". The Python makes no model calls. That is the repo's own claim, and it is a selling point for privacy-minded buyers.

## Scoring myself against the rubric

- **skill (25):** 8 to 9. Fixed pipeline, two stdlib scripts that exit non-zero with plain messages, declared deps (python3.10+, node/Playwright optional), explicit stop conditions ("stop and ask if inventory finds no entry point or no way to run"). Risk: the checker's heuristics on arbitrary repos.
- **truth (20):** 9. This is the point. Ledger ships with the demo (`build/demo/readme-claims.json`) so a judge can trace any sentence in under a minute.
- **story (20):** 7 to 8. Pragmatic, specific, input -> output in the first screen. I'll admit it's plainer than a visionary's version.
- **visuals (20):** 7. One real screenshot, honest and legible, but not dazzling. Light-only report image gets a thin border so it reads in dark mode; I may add a dark-mode variant via `<picture>` only if capture is cheap.
- **pitch (15):** 8. "The receipt" is a clear hook, and the risks are real and short.

## Riskiest part

The checker's "every number and behavior must be in the ledger" rule. Done too strictly it will false-positive on normal prose and a cold agent will fight it; too loose and it's decorative. My answer: strict on commands, paths, links, images, budget and banned words (mechanical, reliable); advisory-only (warn, not fail) on behavior claims, where the agent must still cite a source in the ledger. If I run out of time the cut line is: ship the mechanical checks and the ledger, drop the advisory checks.

Second risk: I tend to call it done at "good enough." I'll want Priya to hold me to the first-screen test and Wes to hold the image count to two.
