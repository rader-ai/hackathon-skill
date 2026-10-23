# Raj (Producer) - Round 1 proposal: "Ship Checklist" / claim-ledger README

## The three most obvious ideas (and why I am not picking them as-is)

1. **Template filler.** Detect the language, drop in Title / Badges / Install / Usage / License, polish the prose. Every judge has seen this README 10,000 times. Hates: badge walls.
2. **Hero-screenshot-or-GIF skill.** Run the app, capture something pretty, put it at the top. Needs running the repo's code, which the brief forbids for the demo, and it hand-waves what to do when the repo has nothing to show.
3. **Write first, fact-check after.** Draft the README, then a verifier pass hunts for lies. This is where most "honest README" entries will land.

I am taking a hard variant of #3, and I need to say why it is not #3. **The order is reversed and the artifact is kept.** The skill never writes prose first. It builds a *Claim Ledger* (one row per factual statement, each pointing at file:line or a captured output), and the README is composed only from ledger rows. A bundled script lints the finished README against the ledger and fails loudly if any sentence-level claim, command, path or number has no row. The ledger ships next to the README (`build/demo/claims.md`), so a judge can click from any sentence to its evidence. Draft-then-audit catches lies after they are written; ledger-first makes an unsourced sentence structurally impossible to write, and the ledger is the proof, not a log.

## Concept (one sentence, any repo)
Inventory the repo into a source-cited claim ledger, then assemble a README from only those claims in a fixed skim order (what it is, input and output, try it, use it, limits), choosing visuals by a written "warrant test" - including none - and refuse to finish until a linter confirms every command, path and claim traces to the ledger.

## How the skill decides what to say
Procedure (checklist, each step has a done-condition and a stop condition):
0. **Preflight** (`scripts/preflight.sh`): dependencies declared (node, ffmpeg optional, python3 for lint). Missing tool = exit 1 with the install line. Never executes target-repo code unless the user passes `--allow-run`; default is read and capture existing outputs only.
1. **Inventory** (`scripts/inventory.py`): deterministic dump of manifests, entrypoints, argparse/CLI subcommands, tests, existing docs, license, sample/example dirs, and any pre-existing generated outputs (html, png, json). Prints what it found and what it could not find. Nothing interpreted yet.
2. **Ledger**: Claude writes rows `id | claim | kind | source | status`. Kinds: IDENTITY, INPUT, OUTPUT, COMMAND, REQUIREMENT, LIMIT, PRIVACY, CREDIT. Status = VERIFIED (read in code/docs) or OBSERVED (seen in real output) or UNKNOWN. UNKNOWN rows cannot be used; they go to a "Questions for maintainer" list. Rule: if the repo's own README states something the code contradicts, the code wins and the discrepancy is listed.
3. **Audience call**: three fixed questions answered from ledger rows only: who is it for (rows), what goes in / comes out (rows), what is the shortest working command (COMMAND row with a verified requirement row).
4. **Visual warrant test** (below).
5. **Assemble** in fixed order with a *first-screen budget*: by line 12 of the page the reader has what it is, input, output, and the try-it command. Hype-word blocklist and a banned-badge rule (a badge must map to a real service/file; default is zero badges).
6. **Lint** (`scripts/lint_readme.py`): extracts every code fence, every relative path, every number, every `--flag`, and every claim tag; each must match a ledger row or the file system; relative images must exist; image bytes summed against the 6 MB budget; hype words flagged. Non-zero exit on any failure, message names the line.
7. **Render check**: `gh api markdown` render, and screenshot at 880px GitHub width in light and dark; a visual must stay legible in both.
8. **Stop conditions**: stop and ask if the repo has no discernible entrypoint, if >0 UNKNOWN rows are load-bearing for the try-it command, or if the lint fails twice for the same reason.

## How the skill decides what to show (the warrant test)
A visual is allowed only if it passes all three: (a) it comes from the real project (captured output, or a diagram whose every node is a ledger row), (b) it answers a question the text cannot answer faster (what does the output look like), (c) it is legible at 880px in both themes. Decision table by repo type:
- Has a rendered output artifact (HTML report, image, CLI transcript in tests/docs): capture it. This is the hero.
- Pipeline with 3+ named stages in code: one small SVG flow, nodes taken from ledger.
- Library / pure API: no image; a short real code sample plus its real output.
- Nothing to show: write "no visuals" in the plan and ship none. Reported in the final summary as a decision, not an omission.
Never: banners, logos, stock, invented terminal sessions.

## README for the demo repo, section by section
1. **Title + one-line** - "Call Review Lab: turn sales-call transcripts into an account timeline, quote-checked observations and an HTML coaching report." (IDENTITY rows, from the repo's README/run.py docstring.)
2. **Hero visual** - a capture of `workspace/report.html` at 880px wide, cropped to the Harbor Tools card: measured talk share 53%, "Quote verified" tags, the unrecorded follow-up shown as "Transcript absent". Why: it is the real output and proves the two differentiators (gaps stay visible, quotes are checked) without a word. Provide light-theme frame with a 1px border so it holds on dark GitHub; `<picture>` with a dark-bordered variant. Small crop 2 (the "Quote verified" evidence strip) for detail if budget allows. Roughly 300-600 KB each as optimized PNG/WebP-free (PNG only; GitHub-safe).
3. **What goes in / what comes out** - a 2-column table: Markdown transcript turns + calls.csv + analysis.json in; timeline, metrics.json, verification.json, report.html out. Each cell is a ledger row. No image; a table skims faster.
4. **Try it (2 minutes)** - the exact four commands from the repo (clone, `python3 run.py demo`, open report), requirement Python 3.10+, standard library only. Notes it writes `workspace/report.html`.
5. **How a call flows** - small SVG pipeline (transcript -> metrics -> analysis -> quote check -> report), only the stages the code has, labelled with real filenames. Passes warrant test (b) because the staging is the idea; kept to one screen and dropped if the budget or legibility check fails.
6. **Use it with your own calls** - the transcript line format `**Speaker** [mm:ss] text`, `add` and `import-csv` with the real flags and CSV columns, `review`, `report`.
7. **Honest limits** - talk share counts words not time; question marks are not question quality; the tool does not call a model or fetch CRM data; analysis is done with the analyst prompt by you. Quoted from the repo's own caveats.
8. **Privacy** - runs locally, no model API calls; pasting transcripts into a cloud agent is your policy decision. 
9. **Optional transcription, tests, license** - whisper.cpp optional and separate; `python3 -m unittest discover -s tests`; MIT.
Also shipped: `build/demo/claims.md` ledger (each README sentence -> source line) so a reviewer verifies in minutes.

## Rubric self-score (honest)
- **skill (25): 8.** Strong: explicit steps, stop conditions, dependency preflight, lint script that fails loudly, ledger template; nothing demo-specific. Weak: one more moving part (ledger) than a lighter skill; cold sessions might write ledger rows lazily. Mitigation: the lint cross-checks coverage mechanically.
- **truth (20): 9.** The deliberate honesty mechanism is the whole design and it leaves an auditable file. Risk: lint catches strings and numbers, not subtle semantic overclaims; need a human-style "adjective audit" step.
- **story (20): 6.5.** Checklists give a reliable skim order, but my blind spot is here: a ledger-built README can be correct and flat. I need Hana/Mira-style taste pushing: one sentence of *why care* must be allowed as a ledger-backed claim (e.g. "calls you did not record stay visible as gaps", which the repo says).
- **visuals (20): 7.** One real hero capture plus one honest flow SVG; light and dark checked. Not flashy. A GIF is optional if frames from the real report earn it (it is a static page, so probably not).
- **pitch (15): 7.5.** Easy to be concrete: "every sentence has a row". Needs the demo's numbers (N claims, 0 unsourced, bytes of assets) which the lint prints.

## Riskiest part
The **ledger becoming a bureaucratic wall that makes the README correct but dull**. If the claim extraction is too conservative, the story section reads like a spec sheet and Priya and Jess (who decide in seconds) bounce. Second risk: the linter's false positives annoying a cold session into skipping it. Mitigation I'd fight for: a "why it matters" slot in the ledger kind list, taste rules in a short `references/voice.md` (concrete nouns, input/output first, no abstractions), and lint output that is a summary plus line-numbered failures only.
