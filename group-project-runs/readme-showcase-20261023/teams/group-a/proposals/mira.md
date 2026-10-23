# Mira (Skeptic) - Proposal: "readme-showcase = a README with receipts"

## The three most obvious ideas (and why I am not shipping any of them as-is)

1. **Template filler.** Scan for package.json / pyproject / Makefile, pour into Title - Badges - Features - Install - Usage - License. Fast, generic, and exactly the README Priya has torn down a thousand times. Features bullets get inferred from file names; that is where invention enters.
2. **Hero-banner-plus-GIF.** Generate a logo/banner, a terminal GIF, a feature grid. Looks like marketing, fails Keiko ("decoration that says nothing") and Tomas (the GIF shows a run nobody did).
3. **"Docs from code" summariser.** Read every file, write a faithful overview. Accurate and unreadable; it describes the repo instead of persuading a stranger.

My version is none of these because **the README is a build artefact with a ledger, and the skill refuses to finish until the ledger checks out.** Nobody else will make "every sentence has a receipt, and a script fails the build" the spine. (Caveat I will say before Tomas does: a README with all receipts can still be a dull README. I handle that below, deliberately, not by trusting my taste.)

## Concept (one sentence, any repo)

The skill reads a repo, writes the README as a list of atomic **claims** each bound to evidence (file:line, a command whose real output exists in the repo, or a captured artefact), renders prose from only those claims, and ends with a deterministic **verifier** that fails loudly on any command, path, flag, version, number or filename in the README that it cannot find in the repo, plus a plain-language "could not verify / left out" report for the maintainer.

## How it decides what to say

A fixed, short procedure (Systematist-friendly, but with two judgement gates):

1. **Inventory (script, `scan.sh`/`scan.mjs`):** list manifests, entrypoints, CLI subcommands (argparse/commander/cobra patterns), test commands, existing README, LICENSE, examples/, docs/, any generated output files that exist already. Output is a JSON fact sheet. Fails loudly if the path is not a repo or is empty.
2. **Four questions, answered each with a claim + receipt:** What goes in? What comes out? Who has the problem this solves (quote the repo's own words, not mine)? What is the fastest command that produces visible output? If any answer has no receipt, it is marked UNKNOWN and stays out of the page.
3. **Hook gate (the judgement call):** the first screen must contain: one-sentence what-it-does naming input and output, the one-command try-it, and the key visual. Order of the page is fixed: hook, visual, try it, how it works with your data, limits/privacy, credits. Reader-need before taxonomy: Hana will want a richer structure; I want the first screen to be non-negotiable.
4. **Cut rule:** anything not backed by a receipt is cut; anything backed but irrelevant to a first-time reader goes to a link, not the page. Hype-word list (seamless, powerful, AI-powered, blazing, robust...) is a lint failure.
5. **Self-contradiction check:** the repo's own README is treated as a claim source *to be audited*, not trusted. (The demo README says "Call Review Lab" while the repo is `sales-call-review`, and says `workspace/report.html` is git-ignored; both must be reconciled against code, not copied.)

## How it decides what to show

Rule: **a visual must be a capture of an artefact that really exists or a real output the repo produced. No illustration, no mock, no banner.** Decision table in `references/visuals.md`:
- Repo produces HTML/UI output already on disk: screenshot it (cropped, 2x, light and dark via `<picture>` with `prefers-color-scheme`).
- Repo is CLI with captured output in tests/fixtures/docs: render that real text as a code block (plain text beats a fake GIF).
- Library/no output: no visual. Say so in the report ("warrants none").
- Never record anything that requires running the repo's code unless the maintainer's environment permits it and the skill says so; in this round we may only use the Host's existing output.
Size cap script: fail if assets exceed 6 MB or image width < 800px.

## Demo README, section by section (sales-call-review)

1. **Title + one sentence**: "Turn sales-call transcripts into an account timeline, quote-checked coaching notes, and an HTML report." (Receipts: README, run.py `report`, verification.json.) Use the repo name; note the "Call Review Lab" name in the page as the project title, flagged in the report.
2. **Hero screenshot**: crop of `workspace/report.html` top (title, five count cards, the "Harbor Tools" call with verified quote tags), light and dark versions. Why: it shows the real product doing its job; the "Quote verified" tag is the project's differentiator and is visible in it. Caption: "Generated from the synthetic demo data."
3. **Input - output strip**: three-box figure made from real files: `discovery.md` turn excerpt - `analysis.json` quote - report row with "Quote verified". Static SVG or just a code block pair; each box labelled with its file path. Why: answers "what goes in, what comes out" in five seconds.
4. **Try it (2 min)**: `git clone`, `cd`, `python3 run.py demo`, `open workspace/report.html`; Python 3.10+, stdlib only. Verifier checks every subcommand exists in argparse and the Python version string appears in the repo.
5. **Use your own calls**: the `init` / `add` / `import-csv` / `review` / `report` flow, the transcript turn format, CSV columns. Compressed; the full text goes to docs.
6. **How the evidence check works**: the quote-in-one-turn rule, "unsupported quotes are flagged and hidden" - the honest hook.
7. **What it does not do** (promoted, not buried): no model calls, no CRM, no deal-outcome inference, talk share = word share not time, question marks are not question quality.
8. **Privacy**: transcripts stay local; `workspace/` is git-ignored but that is not access control.
9. **Optional transcription (whisper.cpp)**, **Credits/License**.
No badges (no CI file, no package registry in the repo: nothing to badge).

## Rubric self-score (honest)

- **skill (25):** ~8. Procedure, scripts with exit codes, declared deps (node or python3 only, pick one: I'd say Python stdlib so the skill needs nothing installed beyond what a dev machine has), explicit stop conditions ("stop when verifier exits 0 and the UNKNOWN list is empty or reported"). Risk: verifier heuristics that only fit this repo.
- **truth (20):** ~9-10. This is my home turf; the ledger file ships beside the README as `claims.md` (maintainer-facing).
- **story (20):** ~6-7. Honest weakness. Correct is not compelling. Mitigation: hook gate, "who feels this pain" quoted from the repo's own words, and I will defer to Hana/Raj on copy rhythm rather than cutting it.
- **visuals (20):** ~6-7. One real screenshot pair plus a real-file strip. Not flashy; legible and true. Keiko may want more.
- **pitch (15):** ~8. The pitch writes itself ("the only README generator that can fail its own build") and names its limit: verifier catches false facts, not dull prose.

## Riskiest part

The verifier. Extracting "claims" from prose by regex will either miss real errors (false comfort, worse than none) or flag correct README text on unfamiliar repos (a skill that cries wolf gets ignored; Marcus's "only worked once"). Mitigation: keep it narrow and mechanical (inline code, fenced commands, relative links/paths, version numbers, digits) and say plainly in SKILL.md that it checks *checkable tokens* and the agent must still do the claim-ledger review for sentences. Second risk: I over-index on correctness and ship a README no one wants to read.
