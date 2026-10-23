# Sol's proposal - "Show the transform"

## The three most obvious ideas (and why I'm not shipping them as-is)
1. **Template-filler**: scan manifest and entry points, fill Title / Install / Usage / License slots, add a badge row. Every competitor will do this; it is the baseline.
2. **Screenshot + terminal GIF**: run the thing, capture the output, drop both in under a banner. Right instinct, but the screenshot is a static picture of the *result*; the reader still has to guess what went in.
3. **Claim-audit pass**: generate prose, then grep each claim against the code. Necessary for `truth`, but a QA step, not an identity.

My version is none of these: the README's hero is a **data-bound, self-animating SVG that replays the project's real input becoming its real output** (a "transform strip"), and every word and pixel is generated from files the skill has read, with a ledger proving it. Closest sibling is idea 2, so here is the difference: a screenshot shows the end; the strip shows the *change*, built from actual bytes of the repo, and it degrades to a still frame and to alt text.

## One-sentence concept (any repo)
`readme-showcase` finds the repo's one real input-to-output transformation (a CLI call, an API response, a render, a build), extracts the genuine before and after from files and captured output, and builds the README around a short animated SVG of that transformation, with every sentence, command and on-screen string logged in a `claims` ledger that a script re-checks against the repo before it will write the file.

## How the skill decides what to say
1. **Inventory** (script `scripts/inventory.mjs`, Node, declared dependency): lists manifests, entry points, CLI help text, examples/fixtures, tests, license, existing README claims, and any already-produced outputs. Prints a JSON fact sheet; exits non-zero with a clear message if the path is not a repo or is empty.
2. **Pick the hero transform**: look for a pair (an input fixture, an output artifact) in this priority: an example input plus its generated output; a CLI command plus captured stdout; a UI plus a screenshot-able HTML artifact; a library plus its smallest test as before/after. If no pair exists, **stop and say so**: the skill falls back to a text-only README (no hero), and records "no visual warranted" with a reason.
3. **Write the claims ledger first** (`claims.json`): each claim = text, kind (what/for-whom/command/requirement/output), and a `source` (file:line or captured-output id). Prose is composed only from ledger rows. Anything with no source gets cut or put under "Not included / limits".
4. **Run the commands the README will tell the reader to run**, only where the target repo is explicitly allowed to run (a SKILL.md gate: ask, or use pre-existing output). If it can't run, the command is marked "unverified" in the ledger and the final README says nothing stronger than the repo's own docs.
5. **Verify script** (`scripts/verify.mjs`): re-reads every ledger source, checks quoted strings exist, checks every relative link and image path resolves, checks asset budget, and fails loudly (named claim, named file) if anything is off.

## How it decides what to show
- **Hero strip** only when step 2 found a real pair. Frames are built from the actual strings: e.g. an input line fades to a highlighted span, a value is counted, an output card slides in. Each frame's text is a ledger item.
- **Decision table in the skill** (project type -> visual): CLI -> strip of command + real stdout; report/HTML generator -> strip ending in a real captured screenshot; library -> before/after code strip; data/ML -> one real chart from real output; infra/config -> none, a plain diagram only if the repo already documents a flow.
- **Constraints baked in**: one SVG pair (light and dark via `<picture>` and prefers-color-scheme inside the SVG), CSS animation only, 1-3 loops then settle on the final frame, `prefers-reduced-motion` shows the final frame, <150 KB each, text as real `<text>` with a system font stack, minimum 14 px at 880 px width. A static PNG fallback of the final frame is exported so GitHub contexts that block SVG animation (email, some mobile apps) still show the answer.
- Budget guard: total assets are summed; over 6 MB is a hard error.

## The demo README (sales-call-review, repo calls itself "Call Review Lab"), section by section
1. **Title + one-line what/who**: "Call Review Lab turns sales-call transcripts into an account timeline and an HTML coaching report where every quote is checked against what the speaker actually said." Source: README intro + `verify()` in `run.py`. No badges (no CI, no package, no registry exists).
2. **Hero strip (animated SVG, light/dark)**: three beats from the real demo data. (a) a transcript turn from `examples/` (the "What would make this conversation useful for you?" line); (b) the `metrics.json` numbers appear (turns, talk share, question marks, longest internal run); (c) the quote stamps **Quote verified** while a deliberately unsupported quote (if the demo data contains one; otherwise only the real verified ones) is shown struck through and hidden, exactly as `report()` behaves. Settles on the final frame. I will only animate what the code does: verified vs "Needs evidence review" is a real state in the report.
3. **What goes in / what comes out**: a 3-row table: Input (Markdown turns `**Speaker** [mm:ss] text`, or CSV), Output (`workspace/report.html`, `metrics.json`, `verification.json`), What it will not do (no model calls, no CRM, no speaker ID).
4. **Real screenshot of `workspace/report.html`** captured at GitHub width, light and dark, cropped to the account card with the unrecorded meeting gap visible. Alt text transcribes the numbers.
5. **Try it in two minutes**: the exact clone / `python3 run.py demo` / open commands, Python 3.10+, stdlib only, `python3 -m unittest discover -s tests`. Each line is a ledger item.
6. **Use your own calls**: the numbered add / import-csv / review / report path, compressed, with the CSV column list copied verbatim.
7. **How the evidence check works**: short, with a diagram-free explanation (one speaker turn, normalised text match). This is the project's real selling point and the skill is built to find that kind of "the one thing it does that others don't" rather than the generic pitch.
8. **Privacy and limits**: lifted from the repo (local, no API calls, reports contain call content, word share is not speaking time). Honest limits section ("What it is not") is built by the skill on every run.
9. **Credits / License**: MIT, ACE/SPICED/BANT credit as the repo states.

Assets: `hero-light.svg`, `hero-dark.svg`, `hero-final.png`, `report-light.png`, `report-dark.png`. Estimated well under 1.5 MB.

## Rubric self-score (predicted)
- **skill (25)**: ~8/10. Explicit inventory script, verify script, stop conditions (no pair -> text-only; not a repo -> abort), declared deps (Node 18+, Chromium via the provided capture script, optionally ImageMagick). Risk: my SKILL.md is long.
- **truth (20)**: ~8.5/10. Ledger plus verify script is the deliberate honesty mechanism; no badges; "unverified" state for commands not run. Risk: the strip text must be exact quotes from the repo.
- **story (20)**: ~7.5/10. Strong first screen (what + who + animation + in/out table), but I tend to under-invest in prose. Section 6 and 8 are where I'll get lazy; flagging it now.
- **visuals (20)**: ~9/10. Real data, animated, light/dark, reduced-motion, readable text. This is my home turf.
- **pitch (15)**: ~7/10. Easy to say "animated"; harder to make it about honesty. Pitch must lead with the ledger, not the motion.

## Riskiest part
**The animated SVG being a showpiece that outruns the substance** (my known blind spot). Concretely: (1) GitHub renders SVG via `<img>` only, so no scripts, no external fonts, no SMIL quirks across browsers - I must test the actual GitHub render via `gh api markdown`; (2) a generic skill that "builds a transform strip for any repo" can fail to find a clean pair and quietly produce a decorative animation - the stop condition (no pair -> no hero) must be real and enforced by the inventory script, not wishful; (3) time: I will want to spend hours on easing and none on the install section. I'd ask Felix to hold me to a 150 KB cap and Ama to own sections 5-8.
