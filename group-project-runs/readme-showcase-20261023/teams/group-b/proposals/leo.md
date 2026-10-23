# Leo - Round 1 proposal: "The Reel"

## The three most obvious ideas (and why I'm not shipping them)

1. **Template filler.** Detect language, fill Title / Badges / Install / Usage / License. Safe, forgettable, every judge has read 1,000 of these. Priya's README clinic exists because of this idea.
2. **Screenshot-and-banner.** Take a screenshot of whatever runs, drop a generated banner on top. Banners are exactly the "stock-looking decoration" Keiko hates, and a screenshot alone doesn't explain input -> output.
3. **Fact-checker bolted onto a generator.** Write a README, then lint it against the code. Honest, but it's a rail, not a front door; the page itself still looks like idea 1.

**What makes mine impossible to mistake for those:** the README's hero is not a banner and not a still. It is a *Reel*: a short, looping, CSS-animated SVG that replays the project's own **real input -> real output transformation**, built only from text and numbers lifted out of the repo's files. The motion is the explanation. Nothing in it is decorative, because every frame has a source file.

## Concept (one sentence, any repo)

`readme-showcase` hunts the repo for its **money shot** (the smallest real input and the real output it produces), renders that transformation as a looping, light/dark-aware SVG reel plus a few honest supporting visuals, and writes a skimmable README around it, with a claim ledger that traces every sentence and every on-screen string back to a file.

## How the skill decides what to say and what to show

**Say** (a fixed skim order, because readers decide in 5 seconds):
1. One line: what it does, for whom, input and output named in it.
2. The Reel (hero).
3. Exact try-it command, copied from the repo's own docs and cross-checked against the entry point (argparse subcommands, package.json scripts, Makefile targets).
4. How it works / what you get, then real usage, then limits and privacy, then license.

Skill steps: **Recon** (script: inventory files, entry points, deps, existing README, committed output artifacts) -> **Claim ledger** (every fact gets `claim | source file:line | kind`, kind in {observed, inferred, omitted}; only observed ships) -> **Money-shot hunt** -> **Visual budget decision** -> **Draft** -> **Verify** (script fails loudly: any command not found in the ledger, any asset string not found in a source file, any size over budget, any README claim with no ledger row, exit nonzero).

**Show** is decided by a ladder, top rung that is *true* wins:
- Repo emits a viewable artifact (HTML/image/PDF) -> real capture of it, cropped to the part that proves the claim.
- Repo is a CLI/pipeline with sample data -> Reel built from real input lines and real output lines (never invented, string-matched against files).
- Repo is a library -> two-panel "call in / value out" built from tests or examples that already exist.
- Repo has nothing visual and nothing runnable -> **no visuals**; a tight typographic README. Naming this rung is part of the skill. A maximalist who knows when to stop is scarier than one who doesn't.
Hard rules: every asset ships a light and a dark treatment (prefers-color-scheme inside the SVG, tested both ways), a text alt that restates the content, total budget enforced by script (6 MB cap, my target ~1.2 MB), motion only where it explains a sequence (reduced-motion shows the final frame, which must stand alone).

## The README for sales-call-review ("Call Review Lab"), section by section

1. **Title + one-liner:** "Call Review Lab turns sales-call transcripts into an account timeline, quote-checked observations, and a local HTML coaching report. Python standard library only; nothing leaves your machine." (from README, run.py docstring "Python standard library only", privacy section.)
2. **Hero: The Reel** (animated SVG, ~900x420, loops ~14s, final frame holds). Four beats, all strings lifted from the repo:
   - Beat 1, *Transcript in:* the real turn from `discovery-01/transcript.md` with the rep's line "What would make this conversation useful for you?".
   - Beat 2, *Quote check:* the analyst's claim ("The operations lead cannot spot delayed jobs until Monday.") slides toward the transcript turn and locks on; a counter ticks to `checked 4, failed 0` (verification.json).
   - Beat 3, *Gap stays visible:* a two-node timeline Jan 12 (recorded) -> Jan 19 (unrecorded, hollow node labelled "no recording, stays in timeline") from calls.csv.
   - Beat 4, *Report out:* the five stat cards resolve (Accounts 1, Timeline calls 2, Transcripts 1, Analyzed 1, Unverified quotes 0), exactly as in report.html.
   Why: this is the project's actual differentiator (evidence-checked, gaps honest) shown as a sequence, not claimed in prose.
3. **Try it in two minutes:** three real commands (`git clone`, `python3 run.py demo`, `open workspace/report.html`) + "Requires Python 3.10+". Straight from the README; `demo` subcommand confirmed in run.py.
4. **Real report screenshot:** capture of `workspace/report.html` (the Host's own output), cropped to cards + the Harbor Tools article. Static, dark and light variants via `<picture>`. Caption says "synthetic data".
5. **What you get:** a compact table input -> output (transcript.md -> metrics.json, analysis.json -> verification.json, etc.), and one small static SVG of the pipeline stages (Timeline, Transcript review, Measures, Analysis, Quote verification, Synthesis, Owner review, Recheck) with the three that *the code actually does* filled and the human/model stages outlined. That fill/outline distinction is the honest bit: it prevents implying automation the README says doesn't exist.
6. **Use it with your own calls:** the init/add/report commands, the CSV column list, the transcript turn format.
7. **Optional local transcription:** whisper.cpp + ffmpeg as separate installs, transcribe command, "no speaker identification".
8. **Limits and privacy:** no model API calls in the Python; talk share is words not time; question marks are not a quality measure; reports contain call content.
9. **Credits, license:** MIT, ACE/SPICED/BANT acknowledgements as the repo states, nothing more. No badges (no CI, no package registry exists).

## Rubric self-score (honest)

- **skill (25):** target 8. Recon + verify scripts, explicit ladder, explicit stop conditions (nothing visual -> none; no entry point found -> ask/stop; ledger row missing -> fail). Dependencies declared (node/capture.mjs or headless Chrome for the screenshot, python3/Node for scripts). Risk: ladder prose that two sessions interpret differently.
- **truth (20):** target 8-9. Ledger + string-match of asset text to source files is a genuinely deliberate mechanism. Risk: the Reel's *compression* (shortening a quote, merging two files into one frame) can drift; rule is verbatim or visibly truncated with an ellipsis.
- **story (20):** target 8. One-line, reel, command, real output in the first screen. Risk: me wanting a second hero.
- **visuals (20):** target 8-9 (my home turf). Real data, motion with a job, light/dark, reduced-motion. Risk: below.
- **pitch (15):** target 7-8. "Every pixel has a source file" is a clean line; the evidence is the ledger and the string-match check.

## The riskiest part

The animated SVG itself: GitHub serves it through `<img>`, so no scripts and no external fonts or images; CSS keyframes must work in that sandbox, text must not reflow (system fonts, fixed widths), and it has to survive both themes. If the animation renders wrong, the hero is the broken thing on the page. Mitigation: verify the render in a real GitHub-style `gh api markdown` pass and capture frames of both themes before shipping, with a static fallback frame as the `<img>` alt-text-equivalent. Second risk, honestly mine: I will want to animate things that don't need it. The ladder says motion only for sequences, and Felix can hold me to it.
