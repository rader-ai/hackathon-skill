# Felix (Skeptic) - Round 1 proposal: "Show Your Weight"

## The three most obvious ideas (and why I'm not shipping them)
1. **Hero banner + badge row + one screenshot + feature bullets.** Every README generator on earth. Priya and Jess both name badge walls and stock banners as hate items.
2. **The animated terminal GIF** (typed command, scrolling output) as the hero. Obvious Maximalist move. It's also the move my group will reach for first. It shows a terminal, not the product's job, costs 1-3 MB, and cannot be paused or read by a screen reader.
3. **Template filler**: detect language, fill Install/Usage/Contributing/License headings from a fixed skeleton. Safe, scored as "generic", and the #1 source of invented install steps.

My version is none of these. Mine is a skill that makes every README **pay for what it contains**: every sentence has a source, every pixel has a byte price, and both are checked by scripts before the file is allowed out.

## Concept (one sentence, any repo)
`readme-showcase` reads the repo, writes a claim ledger (each README sentence -> file:line or captured output that proves it) and a visual budget (each image -> the one reader question it answers and its KB cost), then a verifier script refuses to finish until every claim resolves and every asset fits.

## How it decides what to say
- Phase 1, Inventory (script): entry points, manifest/CLI definitions, existing README, tests, examples, sample outputs, license. Output: `facts.json` with file:line refs. Dependencies declared up front (node, python3 stdlib only for the scripts).
- Phase 2, Answer four reader questions in this order, each in one or two sentences: What goes in? What comes out? Who is it for? What is the shortest command that produces output? If the inventory can't answer one, the skill writes "unknown" in the ledger and asks or omits. Never fills.
- Phase 3, Draft from the ledger only. Each sentence carries a hidden `<!-- c12 -->` reference; commands must be copied from a file or executed in the allowed manner, never composed.
- Phase 4, Verify (`verify.mjs`): every claim id resolves; every code fence string exists in the repo or is marked "captured"; banned-word list (seamless, AI-powered, blazing, powerful...); every image has alt text; total bytes under budget. Fails loudly with the claim id and the reason. Comments are then stripped.
- Stop conditions: verifier green, or the skill stops and lists unresolved claims. It does not ship with a "probably".

## How it decides what to show
A **visual decision table** in `references/visuals.md`, keyed on what the repo has:
- Produces a rendered artifact (HTML report, image, UI)? Capture that real artifact, crop to the one region that explains the output. Priority 1.
- Has an input -> output transformation but no UI (CLI, library)? One static SVG "flow card" built from real file names and real values read from the example run. Priority 2.
- Has only text output? A fenced code block of real output beats any image. Priority 3.
- Has nothing visual? No visual. The skill must be able to say "this repo warrants zero images" and mean it.
- Motion: allowed only when the thing being explained is a sequence (A then B then C) and a still can't show it. Hard cap: one animation, SVG-with-CSS (plays as an image on GitHub), under 150 KB, with the final frame legible as the still (reduced-motion and frozen-frame safe). Everything else static.
- Theming: every SVG uses `prefers-color-scheme` or ships light/dark `<picture>` pairs; contrast checked against WCAG AA by the script.
- Budget: default 1 MB for assets, hard 6 MB. Each image logged with its KB and its question.

## The README it would produce for the demo repo (Call Review Lab)
1. **Title + one line**: "Turn sales-call transcripts into an account timeline, quote-checked coaching notes and a local HTML report." (README line 3 + `run.py` docstring.) No badges. Only the MIT license, which is real, goes at the bottom.
2. **Hero visual**: cropped real screenshot of `workspace/report.html` (the top: the five stat cards plus the Harbor Tools discovery card with "Quote verified" tags). Rendered at the card's native width, light and dark variants if the report supports it; if not, one light PNG with a border so it survives dark mode. ~120-200 KB. This is the product doing its job.
3. **Try it in 3 lines**: `git clone`, `python3 run.py demo`, `open workspace/report.html`, with "Python 3.10+, standard library only" (from README). Stated: the demo uses synthetic data.
4. **What goes in, what comes out**: a single static SVG flow card: `calls.csv` + `discovery.md` -> `metrics.json` / `analysis.json` / `verification.json` -> `report.html`, using the real file names and the real "checked 4, failed 0" value from `verification.json`. One picture, legible at 700px.
5. **The one idea that's different**: quotes are verified inside a single speaker turn; unsupported ones are hidden and flagged. This is the repo's real selling point. Show it as a before/after code block: a real quote that passes, plus the repo's own flagging behaviour (only if I can source a failing example from tests/test_core.py; if not, I describe it in words, not invent it). This is the only place I'd allow a 2-frame static toggle, not an animation.
6. **Bring your own calls**: condensed from README steps 1-6; CSV columns exact; the `add` command exact.
7. **What it does not do**: from README ("does not infer deal outcomes, fetch CRM data, or automate model analysis"). Honest limits build trust and Tomás checks them.
8. **Privacy note, License.**
Assets: 2 images, ~300 KB total. No GIF.

## Rubric self-score (honest)
- **skill (25): 8.** Strong on explicit stops, dependencies and loud failures, because the verifier is the point. Weak spot: a script can check that a claim has a source, not that the source supports the claim. Needs a second "adversary read" pass.
- **truth (20): 9.** The ledger is the deliberate honesty mechanism, and the strongest part.
- **story (20): 7.** Order is disciplined, but my copy may be dry. A Maximalist group should fix the voice, not me.
- **visuals (20): 6.** Real and legible, but I will underdeliver on wow. The group needs to buy a bolder hero crop and one tasteful moment of motion.
- **pitch (15): 8.** "Every sentence has a receipt" is easy to pitch and to demo.

## Riskiest part
The claim ledger can become theatre: sentences that cite a line which doesn't truly support them (a citation is not a proof), and a skill that is too heavy to follow cold. Mitigation: keep ledger entries as short quote-the-source pairs, and have the verifier do string-level checks on commands, filenames and numbers (the checkable kinds), and leave prose to a mandatory re-read. Second risk: my distrust of motion makes the README look timid next to two Maximalist rivals.
