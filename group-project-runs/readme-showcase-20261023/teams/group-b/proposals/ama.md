# Ama (Producer) - Round 1 proposal: "The Ten-Second Proof"

## The three most obvious ideas (and why I'm not shipping them)

1. **The template filler.** Detect language, grab package.json/pyproject, pour into Title / Badges / Install / Usage / License. Every judge has seen it; it's what the README of 90% of repos already is. It produces a *form*, not a front door.
2. **The pretty banner + screenshot.** Generate a gradient hero with the repo name, add a screenshot, call it "visual". Keiko hates exactly this: stock-looking, says nothing.
3. **The README linter / fact-checker.** Write the README, then grep that file paths exist. Necessary (Tomás), but it's a safety net, not a concept.

My version includes #3 as plumbing, and it refuses #1 and #2 outright. What makes it unmistakable: **the hero is a proof, not a banner.** The skill's whole job is to find the single moment in the repo where *real input becomes real output*, and put that on screen in the first scroll, captioned with the exact command that produced it.

## Concept (one sentence, any repo)

`readme-showcase` reads a repo, finds its one **proof moment** (a real input going through the project to a real output, taken from files or output the repo already has or can safely produce), builds the first screen around that proof plus the one command that reproduces it, and then writes every other sentence from a **claim ledger** in which each statement points at a file, line or output, with a script that fails loudly if any pointer is dead.

## How it decides what to say

Funnel logic, because I think in funnels: stranger -> "what is it" -> "is it for me" -> "can I try it" -> "can I trust it".

1. **Inventory (script, `scripts/inventory.py`, stdlib only).** Walks the repo, outputs JSON: manifests, entry points, CLI subcommands/argparse/bin, existing README claims, examples/, fixtures, generated outputs (HTML, images, logs), tests, license, languages. Fails with a clear message if the path isn't a repo or is empty.
2. **Facts before prose.** Build `claims.tsv` first: `id | sentence | kind (what/for-whom/command/requirement/output) | source file:line | verified-by`. Prose is only allowed to be assembled from rows. No row, no sentence. Numbers (counts, versions, sizes) may only come from rows whose source is a measurable output.
3. **Pick the proof moment.** Ranked search: (a) a committed or already-generated output artefact (report, image, CLI transcript), (b) a deterministic example you can show by quoting input file + output file, (c) nothing visual (library with no output): fall back to a real code snippet from tests/examples. If none exists, the skill says "no visual warranted" and ships a text-first README. Visuals are a decision, not a default.
4. **Audience guess with receipts.** Who it's for is stated only if the repo says it (README, docs, prompts, examples). Otherwise the skill writes the audience as a behaviour ("if you have call transcripts in Markdown...") from input format.
5. **Hype filter.** Banned-word list + "would this still be true if you deleted the product name?" test. Badges allowed only if the badge target exists (license file -> license badge; CI config -> CI badge; nothing else).
6. **Stop conditions.** Stops and asks (or writes `NEEDS-HUMAN.md`) when: no way to state what the project does from files; install steps can't be derived; proof moment requires running untrusted code or network access.

## How it decides what to show

Three visual tiers, each earning its place by answering one question:
- **Tier 1, the hero (what is it?):** an animated SVG "proof strip" - input snippet -> processing step -> output card, assembled from real excerpts. Delivered as a `<picture>` with light and dark variants (GitHub's theme toggle is not the OS preference, so I use two files, not an in-SVG media query).
- **Tier 2, the real thing (does it actually work?):** a cropped, legible screenshot of the project's real output at GitHub content width (~830px), light + dark if the artefact supports it.
- **Tier 3, the map (how does it fit together?):** only if the repo has >=3 stages worth drawing; static SVG, labelled strictly from the code's actual stages.
Budget rule baked in: total assets <= 1.5 MB target (6 MB hard fail in `scripts/check_assets.py`), every image has alt text that states what it shows, and every visual is listed in `claims.tsv` with its source.

## The README it produces for the demo repo (sales-call-review / "Call Review Lab")

1. **Hero (first screen, no scroll needed).** One-line H1 with the project name as the repo calls itself ("Call Review Lab"). Under it, one sentence: *"Turn sales-call transcripts into an account timeline, evidence-checked coaching notes and an HTML report - locally, no API calls."* (All three phrases trace to README intro + "Privacy" paragraph.) Immediately under: the **proof strip** (animated SVG): a transcript turn (`**Jordan** [..] The operations lead cannot spot delayed jobs until Monday.`) -> highlighted as it's matched to a single speaker turn -> a "Quote verified" tag landing on the report card. Real quote, real tag text from `workspace/report.html`/`verification.json`. Dark and light.
2. **Try it block, directly under the hero.** The exact four lines from the repo README (`git clone`, `cd`, `python3 run.py demo`, `open workspace/report.html`), with "Python 3.10+, standard library only" on the line above. No badge wall.
3. **What you get (real output).** Large screenshot of the actual generated report (the 5 stat cards: Accounts 1, Timeline calls 2, Transcripts 1, Analyzed 1, Unverified quotes 0, and the Harbor Tools card), captured by `capture.mjs`, cropped to be readable. Caption: "Generated by `python3 run.py demo` from synthetic data in `examples/`."
4. **Why it's different (3 bullets, each cites a mechanism):** unrecorded calls stay in the timeline (`followup-02` shows as "Transcript absent"); every quote is checked against a single speaker turn and unsupported ones are hidden and flagged; themes counted by distinct account, not calls. All from README/METHOD.md.
5. **Use it with your own calls.** Condensed from the repo's six steps: transcript format, `init`/`add`/`report`, CSV columns, `review`. Commands copied verbatim and flagged in the ledger as checked against `run.py` argparse.
6. **How it works (Tier 3 diagram).** Static SVG of the stages that exist in code: timeline -> metrics -> analysis.json -> quote verification -> report. Not the "private workflow" stages the README says are *not* implemented (CRM, model automation) - those get an honest "not included" line.
7. **Limits and privacy.** Straight from the repo: word share isn't speaking time; question marks aren't discovery quality; nothing is sent anywhere by the Python commands; synthetic data only; MIT.
8. **Footer: "How this README was verified"** - a collapsed `<details>` listing the claim ledger summary ("N claims, N sourced"), counts computed by the script, not typed by me.

## Rubric self-score (honest, pre-build)

- **skill (25): 8/10.** Explicit inputs/outputs/stop conditions, stdlib-only scripts that exit non-zero with messages, nothing demo-specific. Dock: asking a fresh session to pick a "proof moment" is judgement-heavy; I'll need a worked decision table.
- **truth (20): 9/10.** The claim ledger and `verify_claims.py` are the deliberate honesty mechanism. Dock: the animated hero is a *re-presentation* of real text; I must label it as an excerpt so it can't be read as a screenshot.
- **story (20): 8/10.** First screen answers what/for whom/how to try. Risk is me overloading the top.
- **visuals (20): 8/10.** Real output, hero with motion, big legible screenshot. Risk: SVG animation rendering quirks on GitHub, and a hero that's pretty but redundant with the screenshot.
- **pitch (15): 7/10.** Strong on "proof, not banner" and the ledger, but I need real evidence and honest limits.

## Riskiest part

Two things, and the second is my own blind spot. (1) **The animated proof-strip SVG**: GitHub serves SVGs via `<img>`, so no script, no external fonts, and SMIL/CSS support must be tested; if it renders as a static first frame the story still has to work frozen. (2) **I optimise the first ten seconds and forget the person who installs it.** The risk is a gorgeous hero over a "Try it" block that silently fails on someone's machine. Mitigation in the plan: every command in the README must come from a `claims.tsv` row verified against the repo's own CLI definitions, and the skill's final step is a "cold install read-through" where it walks the README as a stranger. I'd ask Felix to hold me to that.
