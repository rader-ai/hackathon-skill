# Wes (Craftsperson) - Round 1 proposal

## The three most obvious ideas (and what I will not just do)
1. **Prompt-only skill**: "read the repo, write a README with a template: badges, tagline, features, install, usage, license." Fast, but nothing stops invention and nothing makes visuals.
2. **Template + screenshot-everything**: same, plus a script that screenshots any HTML it finds. This is my own temptation. It bloats and shows decoration.
3. **Fancy banner + animated hero**: generated SVG banner, gradient title, emoji feature list. Stock-looking; Keiko and Priya both hate it.

My version is none of these because the thing that sets it apart is **a mechanical truth gate plus a hard visual budget**, both enforced by scripts that exit non-zero, not by good intentions. Details below.

## Concept (one sentence, any repo)
`readme-showcase` inventories a repo with a script, writes the README from a short fact sheet where every sentence cites a file, captures only the visuals the repo already produces (never invents them), and then refuses to finish until a verifier script confirms that every command, path, flag, version, link and image in the README resolves against the repo and the asset budget holds.

## How the skill decides what to say
Pipeline, each step has an output file and a stop condition:

1. **`scripts/inventory.mjs <repo>`** (Node, no deps beyond node 18) -> `facts.json`: manifests found (package.json, pyproject, Cargo, go.mod, none), declared runtime version, entry points, CLI subcommands (parsed from argparse/commander/click/clap patterns by simple greps, flagged "heuristic"), existing README/docs, LICENSE id, tests command, committed images, any prebuilt output (html/png/svg in repo or workspace), env vars read. Fails loudly if the path isn't a repo or is empty.
2. **Fact sheet (`facts.md`, written by Claude)**: a table of claims, each one `claim | source file:line | kind (observed / copied-from-docs / inferred)`. README sentences may only come from rows marked observed or copied. Inferred rows must be hedged or dropped. This is the "deliberate way of keeping READMEs honest".
3. **Story rule (fixed order, skimmable)**: line 1 = what it is in plain nouns (input -> output). Then the visual that shows the output. Then the exact try-it command block that is the repo's own quickstart, verified. Then who it is for / not for. Then use-with-your-data, what it does not do (limits copied from the repo's own caveats), privacy, license. No badges unless the repo has a real CI workflow file or a published package it can verify, and then at most one or two. No adjectives in the allow-list of hype words (a small `references/banned-words.txt`, checked by script).
4. **Visual decision table (`references/visual-policy.md`)**: what the repo "produces" decides what we show.
   - Produces an HTML page / web UI that exists as output -> screenshot it (light + dark if the page supports both; else one, with a neutral frame that works on both themes).
   - Produces terminal output -> only if the output is already captured in the repo/docs or the command is declared safe to run; otherwise we do not fabricate it.
   - Library/no visible output -> no screenshot. A short real code-in/output-out block. "Nothing" is a valid and common answer, and the skill prints "no visuals warranted because X".
   - Hard cap: max 3 images, max 1.5 MB total by default, max 1200 px wide. Every image needs a one-line "job" in the fact sheet (what the reader learns). No job, no image.
5. **`scripts/capture.mjs`**: thin wrapper around the provided capture tool / Playwright-style screenshotting with fixed viewport (1000 px wide so it is legible at GitHub's ~830 px content width), `prefers-color-scheme` pair when supported, then `magick` for crop and optimize (pngquant-style quantize, strip metadata). Declares deps (node, ffmpeg optional, ImageMagick) and fails with an install hint if missing.
6. **`scripts/verify.mjs README.md <repo>`** (the gate):
   - every fenced command: first token exists as a file/script/subcommand in the repo (e.g. `python3 run.py demo` -> run.py exists and has a `demo` subcommand);
   - every relative link/image path exists; every image has alt text and sits under budget;
   - every backticked file path exists; every CLI flag appears in the source;
   - version requirements match the manifest or the repo's own docs;
   - no banned hype words; no badge URL unless backed by a workflow/package;
   - numbers in prose: any digit in the README must be found in the repo, a fact-sheet row or a captured output (otherwise the verifier lists it for me to justify);
   - exits non-zero with a list of offending lines. SKILL.md says: do not deliver until exit 0, and report any lines you suppressed.
7. **Final report** to the user: what was captured, what was deliberately omitted, which claims are heuristic.

## The README it produces for the demo repo (section by section)
Title: **Call Review Lab** (name from the repo's own README; the folder is `sales-call-review`, note both once if needed).

1. **One-line + two-line description**: "Turns sales-call transcripts into an account timeline, quote-checked coaching notes and an HTML report. Runs locally on Python's standard library." (every phrase traces to README/run.py).
2. **Hero visual: `assets/report.png`** - screenshot of the real `workspace/report.html` at 1000 px, top section: the five count cards (1 account, 2 calls, 1 transcript, 1 analyzed, 0 unverified quotes) plus the Harbor Tools call card. Why: Jess/Priya want real output before reading. Light theme page; it sits on a thin border so it is readable in dark mode too (the report has no dark variant and we won't fake one).
3. **Try it (3 commands)**: `git clone`, `python3 run.py demo`, `open workspace/report.html`, plus the Linux alt. Requires Python 3.10+. Verified against run.py.
4. **What goes in / what comes out**: a small table: transcript Markdown turns (`**Speaker** [mm:ss] text`) -> `meta.json`, `metrics.json`, `analysis.json`, `verification.json`, `report.html`. Real filenames from workspace/.
5. **Second visual: `assets/evidence-closeup.png`** - a 2x crop of the "What worked" card showing quotes tagged "Quote verified" and the unrecorded follow-up call kept in the timeline. Why: this is the differentiating idea (evidence-checked, gaps visible) and is too small to read in the hero. Crop of the same real capture, no new fiction.
6. **Use it with your own calls**: condensed 4 steps (init, add, report, import-csv columns exactly as in README), pointing to the analyst prompt and template.
7. **What it does and does not do**: from the repo's own words: measures word counts and question marks, not speaking time or question quality; does not infer outcomes, fetch CRM, or call a model; analysis is done by you with the prompt; synthetic demo data.
8. **Privacy**: 3 sentences, kept because the repo itself stresses it.
9. **Optional transcription** (whisper.cpp + ffmpeg, installed separately) - one block.
10. **Docs, license (MIT), credits** as the repo states.
No badges (no CI file, no package published). No invented stars/metrics. Total assets target about 400-700 KB.

## Rubric self-score (honest, pre-build)
- **skill (25)**: strong on explicit stages/outputs/stop conditions, scripts that fail loud, dependency list. Risk: heuristic inventory misses on exotic stacks; mitigated by a "facts.json is a draft, read the code" rule. ~8/10.
- **truth (20)**: the verifier is the story here. ~9/10, as long as the verifier doesn't give false comfort (it catches shape, not meaning; the fact sheet handles meaning).
- **story (20)**: output first, then command; plain copy. Likely a notch less memorable than a visionary version. ~7.5/10.
- **visuals (20)**: real captures only, two images, deliberate "nothing" policy. Weakness: no dark-mode variant for this repo's page. ~7/10.
- **pitch (15)**: honest, concrete, names the verifier and the 3-image cap. ~7.5/10.

## Riskiest part
`verify.mjs` being too clever: language-specific parsing of subcommands (argparse, click, clap, cobra) will be heuristic, and a false "all good" is worse than no gate. Plan: verifier outputs three tiers (verified, unverifiable-by-script, failed) and SKILL.md forces me to hand-check the middle tier. Second risk: the screenshot of a light-only page looking pasted-on in dark mode. Third, honestly, me: I keep wanting to add "just one more capture" (a GIF of scrolling, a terminal cast). The cap and the "job" line are my seatbelt.
