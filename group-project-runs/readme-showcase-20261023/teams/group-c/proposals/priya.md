# Priya (Skeptic) - Round 1 proposal: "the README that can be audited"

## The three most obvious ideas (and why I'm not picking them)

1. **Polished template filler.** Detect language, fill Title / Badges / Install / Usage / Contributing / License, add a hero banner. Every team will build it; it produces the badge wall and "AI-powered" copy the panel hates.
2. **Screenshot-everything pipeline.** Run the app, capture every page, stitch a GIF. Looks great on repos with a UI, fabricates or bloats on repos without one, and the brief forbids running the demo repo's code anyway.
3. **Two-pass "draft then fact-check" prompt.** Write the README, then ask the model to re-read it for accuracy. Obvious, and "the model checked itself" is not evidence.

My version is none of these because **the verification is mechanical and the artifact is a ledger, not a vibe**: the skill's central output is a *claims ledger* (every checkable statement in the README mapped to a file/line or captured output), and a bundled script that fails loudly if any command, path, flag, version or filename in the README does not exist in the repo. A reader or judge can open the ledger and audit the README in five minutes. That is what makes it impossible to mistake for a template filler.

## One-sentence concept (works on any repo)

`readme-showcase` reads a repo, answers four questions a stranger asks ("what goes in, what comes out, who is it for, what do I type first?") using only evidence it can cite, writes a short README around those answers, and then runs a bundled checker that rejects any command, path, flag, version, count or quote in the README that it cannot trace back to the repo or to a captured output.

## How the skill decides what to say

Fixed pipeline, explicit stop conditions:

1. **Inventory** (script `scan_repo.py`, stdlib only, fails loudly if path is not a directory): manifests, entrypoints, existing README/docs, CLI subcommands (argparse/click/package.json scripts/Makefile targets), license, tests, example/sample dirs, any pre-existing output artifacts (html, png, gif, logs).
2. **Four answers, each with a source.** Input, output, audience, first command. If an answer has no source, it is marked UNKNOWN and the skill must either drop it or ask the maintainer. Never guess.
3. **Pick the first-run command**: only a command that appears in the repo's own docs/Makefile/scripts, and prefer one that needs no credentials. If none exists, the README says so rather than inventing install steps (no `pip install` unless a packaging file exists; no package names unless in a manifest).
4. **Write for the skimmer**: one-line description (what it does, not what it is "powered by"), the real output visual, the first command, who it's for / not for, then detail. Banned-word list (seamless, blazing, AI-powered, leverage, robust...) is a script check, not advice.
5. **Ledger + check**: skill writes `claims.md` next to the README (kept out of the README; optionally committed under `docs/`). `check_readme.py` extracts fenced commands, relative links, image paths, backticked filenames/flags and numbers; verifies each against the repo; exits nonzero with a list. Stop condition: zero failures, or the maintainer explicitly waives a line.
6. **Preserve the maintainer's voice and facts**: if the repo already has a README, treat it as evidence not as prose to copy; keep caveats the maintainer wrote (e.g. privacy warnings) because dropping them is a truth failure.

## How the skill decides what to show

A visual must pass three tests: (a) it is **real output** of the project (existing artifact, or a capture of something the skill is permitted to run), (b) it answers "what do I get?" faster than a sentence, (c) it is legible at 880px wide. Decision table in `references/visuals.md`:

- Repo has a UI/report artifact -> one hero screenshot, cropped to the useful region, light and dark via `<picture>` only if the artifact actually supports both schemes (otherwise one image with a visible frame; do not fake a dark mode).
- CLI only -> real captured terminal output rendered to SVG/PNG, **only if the skill is allowed to run it**; otherwise paste actual output from docs/tests as a code block. No fake terminals.
- Library -> no image. A short real code sample from `examples/` or tests. "Nothing" is a valid answer and the skill must say why in its final report.
- Budget: hard cap in the script (total assets under 1.5 MB default, fail loud above it). This is where I overrule Wes's urge to capture everything.
- Every image gets alt text that states what it shows, which doubles as a claim in the ledger.

## README for the demo repo (sales-call-review), section by section

Note: repo is named `sales-call-review` but its own README titles it "Call Review Lab"; the clone URL uses `sales-call-review`. Use the title the project uses, and use the repo slug only in the clone command.

1. **Title + one-liner**: "Call Review Lab - turn sales-call transcripts into an account timeline, quote-checked coaching notes and an HTML report. Runs locally, standard-library Python, no model API calls." (Each clause is in the repo README/run.py.)
2. **Hero visual**: screenshot of `workspace/report.html` cropped to header + stat cards + the first call card with its "Quote verified" tags. Why: the verified-quote tag is the project's distinguishing feature and it is only visible in the output. Caption states it is built from the synthetic demo data (the repo says so).
3. **Who it's for / not for** (2-3 lines): sales coaches, enablement, founders reviewing their own calls; not a scoring tool; the repo itself says it is a review aid, not a performance verdict, and that human review is required.
4. **Try it in two minutes**: the repo's real commands: `git clone`, `cd`, `python3 run.py demo`, `open workspace/report.html` (macOS/Linux variants). Python 3.10+ requirement. Note that `workspace/` is git-ignored, so the report appears after you run it.
5. **What goes in / what comes out**: a compact table: transcript Markdown format (`**Speaker** [mm:ss] text`) and CSV columns in; `metrics.json`, `analysis.json`, `verification.json`, `report.html` out. A tiny real transcript snippet next to the matching report card is the second visual (text in the README, not an image).
6. **Use it with your own calls**: `init`, `add` flags, `import-csv`, `review`, `report` exactly as in the repo; the LLM analysis step is described honestly as manual (analyst prompt, no automation).
7. **How the quote check works + its limits**: quote must sit inside one speaker turn; unmatched quotes are flagged and hidden; word share is not speaking time; question marks are not question quality. These caveats are a trust asset and stay.
8. **Optional transcription**: `whisper.cpp` + `ffmpeg`, no speaker ID. One short paragraph.
9. **Privacy**: keep the repo's cloud-model warning. Short.
10. **Tests, license, credits**: `python3 -m unittest discover -s tests`; MIT; ACE/SPICED/BANT credit as the repo states.

No badges at all (the repo has no CI, package or release to back one; license badge is not worth the clutter).

## Rubric self-score (honest)

- **skill (25)**: aiming 8-9. Explicit inputs/outputs, three scripts that fail loudly, no demo-specific logic. Risk: the checker's extractors are heuristic and may false-positive on exotic READMEs; I will document the waiver mechanism.
- **truth (20)**: aiming 9. The ledger plus checker is the deliberate honesty mechanism; judge Tomas can open `claims.md` and tick it off. Risk: ledger shows we also *chose* what to leave out; I will name what was omitted.
- **story (20)**: aiming 7-8. Pragmatist copy will be clear; I worry it is beige (my own blind spot). Need Ines to push for one memorable framing: "quotes that are checked against the transcript" is the hook.
- **visuals (20)**: aiming 6-7. One honest hero screenshot is legible and real but the source report is plain, small and has no dark mode, so it will not wow Keiko. Mitigation: crop and scale to make it readable, no decoration.
- **pitch (15)**: aiming 8. "It tells you what it refused to say" is a concrete difference with demo evidence (ledger counts, what UNKNOWN items were dropped).

## Riskiest part

The checker. If it is too strict it blocks good prose; too loose and the "truth" claim in the pitch is hollow. Also the visuals gap: if the best honest visual is a small plain HTML report, we may lose to a group willing to build a prettier framing. I would rather lose points on polish than get caught on one false claim, but I recognise that is my blind spot talking: I should not shave the hero down to nothing.

Also: running the checker on the demo output must really happen, with real output pasted in the pitch, not described.
