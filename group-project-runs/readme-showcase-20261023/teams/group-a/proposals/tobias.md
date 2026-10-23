# Tobias - Round 1 proposal: the README is a build artifact with a ledger

## The three most obvious ideas (and why I'm not shipping them)

1. **"Template filler."** SKILL.md has a fixed section skeleton (banner, badges, features, install, usage, license); Claude reads the repo and pours content in. Every README it makes looks the same, invents a banner, and badge-walls. Judges hate exactly this.
2. **"Screenshot-and-GIF maximalist."** Always run the project, record a GIF, add a hero image. Falls over on libraries/CLIs with no UI, and here we are forbidden to run the code anyway.
3. **"Read it, write it, double-check it."** One prose pass plus a "please verify your claims" paragraph. Verification by good intentions. Mira would shred it, and so would Tomas.

**What makes mine impossible to mistake for these:** the skill is a *pipeline with a machine-checked gate*. A script extracts a **fact ledger** from the repo (deterministic, no model), the README is written *from the ledger*, and a second script **lints the README against the ledger and the filesystem** and refuses to pass until it is clean. The honesty mechanism is code that exits non-zero, not a promise. The template is chosen by repo shape, not fixed.

## Concept (any repo, one sentence)

`readme-showcase` extracts a cited fact ledger from the repo with `scripts/facts.mjs`, picks sections and visuals from a decision table keyed on what the repo provably contains, drafts the README using only ledger facts (each paragraph carries a hidden `<!-- fact:ID -->` source tag), and ships only after `scripts/lint.mjs` exits 0.

## How it decides what to say

Fixed procedure, six steps, each with an output and a stop condition:

0. **Preflight** (`scripts/preflight.mjs`): checks node >= 18, git/ffmpeg/magick presence, repo path readable, an existing README noted (never overwrite without writing to a new path). Fails loudly with the missing thing named.
1. **Extract** (`facts.mjs <repo>` -> `facts.json`). Every fact = `{id, kind, value, source: "path:line"}`. Kinds: project name (dir, package manifest, first H1; conflicts are recorded, not resolved), license (LICENSE file text -> SPDX guess), runtime requirement (shebang, `python_requires`, `engines`, `go.mod`, syntax floor), entry points and subcommands (argparse `add_parser`, `bin` in package.json, Makefile targets, `[project.scripts]`, cobra commands), install steps present in existing docs, test command, dependency list (imports outside stdlib; for the demo: none, "standard library only" is stated in run.py's docstring), sample inputs (`examples/`), sample outputs (committed or captured artifacts), docs files, privacy-relevant statements (network calls found by grepping for http/requests/socket; absence is also a fact: "no network imports found").
2. **Classify the repo shape** from the ledger: `cli`, `library`, `service`, `ui-app`, `data-pipeline`, `config/content`. Shape selects the section order (table below).
3. **Pick the lead** by the *First-Screen Rule*: line 1 = name; line 2 = one sentence in the form "Turns `<input from ledger>` into `<output from ledger>`" (the sentence must be generated from an input fact and an output fact, or it fails lint); then the quickstart command block *before* any pitch paragraph, then the visual.
4. **Draft** with a fixed grammar: present tense, no adjectives not in a whitelist, numbers only if a fact carries them.
5. **Lint** (`lint.mjs README.md facts.json`), exits non-zero on: a fenced command whose first token/subcommand isn't a ledger fact; an inline path that doesn't exist; a relative image/link that 404s; a banned-word hit (list in `references/banned.txt`: seamless, blazing, powerful, AI-powered, effortless, revolutionary...); any badge URL not backed by a ledger fact; any digit-bearing sentence with no fact tag; asset total over budget; image over 1600px wide; missing alt text; first-screen rule violations (no H1, quickstart not within first 40 rendered lines).
6. **Render check**: `gh api markdown` to GitHub-flavour HTML, confirm every `<img>` resolves, produce a `build/demo/PROVENANCE.md` side report (not in the README) mapping each sentence to a fact id. Stop conditions: lint exit 0 and provenance report complete. If a required fact is missing (e.g. no way to run the project), the skill writes `TODO(maintainer):` into a separate `OPEN_QUESTIONS.md` and does NOT guess. Maximum 3 fix loops, then stop and report.

Section-by-shape table (rules, not vibes):

| Shape | Order |
|---|---|
| cli / data-pipeline | one-liner, visual of real output, quickstart, "use it with your own data", how it works, privacy/limits, license |
| library | one-liner, 10-line usage snippet from tests/examples, install, API map, license |
| service | one-liner, run it, config table from env reads, endpoints, license |

## How it decides what to show (visuals)

A **Visual Decision Table** keyed on ledger evidence, not taste:

- Repo has a committed or already-generated HTML/UI artifact -> screenshot it (capture.mjs), crop to the region that carries the information, 2x, max 1600px wide.
- Repo is CLI with captured output on disk -> render that output as a terminal SVG (text from the file, never retyped).
- Repo has a multi-stage on-disk data flow (files named per stage) -> a small flow SVG whose boxes are the real file names, theme-aware via `prefers-color-scheme`.
- None of the above -> **no visual**. Skill must say so in the provenance report. Zero is a valid, scored outcome.
- Never: banners, logos, mascots, stock, badges without a fact.

Every visual gets a one-line "earns its place because" in provenance; if it can't be filled, the visual is dropped.

## The README it produces for the demo repo (sales-call-review)

Facts I'd extract (all verified in this repo): title in README is "Call Review Lab" while the repo/folder is sales-call-review (name conflict recorded; use "Call Review Lab" as display name and the repo slug in the clone URL); Python >= 3.10, stdlib only; subcommands init, demo, add, import-csv, review, report, transcribe; `examples/` is invented data; report.html is generated at `workspace/report.html`; tests via `python3 -m unittest discover -s tests`; MIT; quote verification against a single speaker turn; local only, no model API calls; whisper.cpp optional.

Sections:

1. **`# Call Review Lab`** + one sentence: "Turns sales-call transcripts into an account timeline, evidence-checked coaching observations and a local HTML report." Second line, plain: "Standard-library Python 3.10+. Runs locally; no model API calls."
2. **Hero visual**: screenshot of `workspace/report.html` from the real demo run, cropped to the stat cards + the "Harbor Tools" call card with "Quote verified" tags. Why: it is the actual output, it shows the product's main promise (quotes checked) on screen one. Opaque light background on the PNG so it reads in dark theme as a framed card (add a 1px border in the image). Alt text transcribes the visible numbers.
3. **Try it** (quickstart): the exact four lines from the repo README (clone, cd, `python3 run.py demo`, open). One sentence stating what appears: "an account with two calls, one with a transcript, one flagged as absent". Facts tagged.
4. **What goes in, what comes out**: small table. In: Markdown transcript turns `**Speaker** [mm:ss] text`, optional CSV. Out: `metrics.json`, `analysis.json`, `verification.json`, `workspace/report.html`. Optional flow SVG using these exact filenames (this is the one visual I'd defend hardest as "earned": the filenames exist in `workspace/accounts/harbor-tools/calls/discovery-01/`).
5. **Why the quotes can be trusted**: 3 sentences on single-turn quote verification and that unsupported quotes are flagged and hidden; second crop of the report if a failure exists (it doesn't - 0 unverified - so no fake failure image). Honest statement that the demo shows 0 failures.
6. **Use it with your own calls**: numbered steps condensed from the repo README, every flag copied via ledger (`--account --id --date --title --internal --external --transcript`; CSV columns list).
7. **Limits**: talk share is word share not speaking time; question marks are not question quality; the analysis step uses the analyst prompt with a model *you* run - the tool does not call one.
8. **Optional: local transcription** (whisper.cpp; separate install).
9. **Privacy**, **Tests** (one command), **License: MIT**.
No badges. No "features" bullet list. No roadmap. No hype.

## Rubric self-score (honest)

| Criterion | Expected | Why |
|---|---|---|
| skill (25) | 8-9 | Two scripts that fail loudly with explicit exit codes, declared deps (node 18+, optional gh/ffmpeg/magick), repo-agnostic fact kinds, stop conditions. Weak spot: facts.mjs extractors are heuristics per ecosystem; I will test on 2-3 other repo shapes in `build/` fixtures (tiny synthetic repos) to prove it isn't demo-bound. |
| truth (20) | 9 | Ledger + lint + provenance gives a deliberate, inspectable honesty mechanism; commands in the README are lint-matched to the repo. |
| story (20) | 7 | Rule-bound structure is right for skimming, but I'm the one who worries the prose is the weakest link: the grammar can make copy flat. Needs Hana/Raj not to let me strangle it, and someone to own the one-liner's quality. |
| visuals (20) | 7-8 | Real report crop is strong and honest; the decision table is explicit, including "none". Limited by the report being light-only and having no failure case to show. |
| pitch (15) | 8 | "The README that can't pass CI if it lies" is concrete, with demo evidence (lint output, provenance counts). |

## Riskiest part

**The judgement calls I'm tempted to leave to rules.** Rules can verify a sentence is true, not that it is the *right* sentence. The one-liner, which fact leads, what to cut, and the crop of the hero image still need real craft; if SKILL.md says "pick the most compelling" the result is vague (my blind spot). Mitigation: write those as worked decision procedures with counter-examples (lead-sentence formula, crop rule: "smallest rectangle containing the headline number and one full evidence item"), and have a teammate review the demo README for tone before lint is called done. Second risk: the lint is only as strong as the extractors; a repo with commands living only in prose would produce few facts, in which case the skill must degrade by *shortening* the README rather than guessing.
