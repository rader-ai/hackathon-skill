# Hana's proposal - the Reader-Question Map

## The three most obvious ideas (and why I am not shipping any of them as-is)

1. **Template filler.** Detect the language, fill a fixed skeleton (badges, Features, Installation, Usage, License). Fast, repeatable, and every README it makes looks identical. Judges have read ten thousand of these.
2. **Hero screenshot + GIF.** Find the thing that runs, record it, put it on top. Good instinct, but it answers only "what does it look like", and it fails on repos with nothing to see (libraries, CLIs with text output).
3. **Write first, fact-check after.** Draft freely, then a verifier pass strips whatever it cannot trace. Honest, but the page is built around what survived, not around what the reader needs.

My version keeps pieces of all three, but it is not any of them. Template filler fixes the sections before it knows the repo; mine derives them from the reader's questions. Screenshots are one possible answer to a question, not the default. And verification happens at the moment of writing, not as a cleanup.

## Concept (one sentence, any repo)

The skill treats a README as a fixed set of **reader questions** (What is it? What goes in and out? Is it for me? How do I run it? What should I trust or watch out for? Where next?), answers each only with **claims it has pinned to a file, command or captured output** in a sidecar ledger (`claims.json`), and a bundled script refuses to finish while any claim is unpinned or any pinned thing fails to resolve.

What makes it impossible to mistake for the usual: the README is the *rendering* of a claim ledger. The ledger is the artifact the skill works on; the prose is generated from it. Provenance is structural, not a hope.

## How the skill decides what to say

A procedure, in order, each step with an explicit output and stop condition:

1. **Inventory (script).** `scripts/inventory.sh`/`.mjs` lists files, entry points, manifests, existing README, license, test dir, example dirs, any pre-generated outputs (html, png, json). Fails loudly if the path is not a repo or is empty. No code from the repo is executed.
2. **Archetype.** Classify the repo from a closed list: *CLI/tool, library, service/app, data/model, content/docs, framework/template*. The archetype selects which questions are mandatory and which are skipped (a library has no "Try it" with output unless a real example exists).
3. **Fill the question table.** For each mandatory question, write the answer as 1-3 atomic claims. Every claim gets a `source` (file:line, a command found in the repo, or an artifact) and a `kind`: observed (read from code/output), derived (computed from observed), or quoted (the repo's own words). Anything the repo does not support goes in an `unknown` list and is *omitted* from the README, not softened.
4. **Pick the hook.** The first screen is built from the three claims with the highest *reader payoff*: what goes in, what comes out, the one command. The hook sentence must name an input and an output. (Banned: a fixed list of hype words; the check script greps for them.)
5. **Decide visuals by the question they answer.** A visual is admitted only if it answers an open question better than a sentence could and a real artifact exists to back it. Decision table in `references/visual-decisions.md`: output exists and is visual -> capture it (screenshot, light and dark); pipeline with named stages in the repo -> diagram built from those stage names; nothing visual -> none, and the skill says so in its run report.
6. **Render.** Order is fixed by the question order, not by taste. Commands copied verbatim from the repo; the skill never rewrites a command.
7. **Verify (script).** `scripts/check.mjs` resolves every claim: does the file exist, does the command appear in the repo's docs/argparse/package scripts, does the quoted string appear verbatim, is every image path present, are assets under budget, any banned words, any badge without a real service behind it. Non-zero exit with a list of failures. The skill does not finish until exit 0 or the failing claim is removed.
8. **Run report.** Output includes what was omitted and why, so a maintainer can see the gaps instead of discovering them.

Dependencies declared up front in SKILL.md: Node 18+, a headless browser path (the host's `capture.mjs` or Playwright; a documented fallback to "no screenshots, say so"), `magick` optional.

## What the README for sales-call-review looks like, section by section

Note the repo's own name is `sales-call-review`; its README titles it "Call Review Lab". The skill uses the name the repo uses on its front page and mentions the repo name once.

1. **Title + hook (first screen).** "Call Review Lab turns call transcripts into an account timeline and a coaching report where every quoted line is checked against what the speaker actually said." Input: speaker-labelled Markdown transcripts. Output: `workspace/report.html`. Then the one command block: `python3 run.py demo`. Source: README/run.py `demo()`, `report()`.
2. **Hero visual: the real report.** A screenshot of `workspace/report.html` captured at GitHub content width (about 880px), light and dark variants via `<picture>`. It shows the stat cards, the "Patterns to investigate" block and the Harbor Tools call with "Quote verified" tags. Why: it is the real output, and the verified-quote tag is the product's whole point. Cropped, not shrunk, so text stays legible.
3. **Input -> output strip.** One more image: left, three lines of the actual transcript (`discovery-01/transcript.md`); right, the report card their quote ended up in. Why: answers "what goes in, what comes out" in one glance, built from real files. Skipped if I cannot make it legible; the table below covers it.
4. **Who it is for / when not to.** Three bullets drawn from the repo's own scope statements: sales leaders and enablement reviewing calls; works with any transcript source; does not infer deal outcomes, fetch CRM data or run model analysis (from README "What the method does").
5. **Try it.** Python 3.10+, standard library only, the clone + `python3 run.py demo` + open commands copied verbatim, and `python3 -m unittest discover -s tests`.
6. **Use your own calls.** The `add` command and `import-csv` with the nine CSV columns, exactly as in the repo, plus the transcript turn format `**Speaker Name** [mm:ss] Spoken text`.
7. **How it keeps itself honest.** A compact stage table (Timeline, Deterministic measures, Evidence-based analysis, Quote verification, ...) taken from the repo's own method table, with the files each stage writes (`metrics.json`, `analysis.json`, `verification.json`). Followed by an honest-limits line: word share is not speaking time; question marks are not question quality.
8. **Privacy.** Local commands make no model API calls; pasting transcripts into a cloud agent is the user's call. Directly from the repo.
9. **Optional transcription, Docs, Credits, License.** Short; links to `docs/METHOD.md` and `prompts/analyze_call.md`; MIT.

No badges (the repo has no CI, package registry or release to point to). No "features" list. No numbers beyond what the report shows.

## Rubric self-score (honest)

- **skill (25): 8.** The procedure, closed archetype list, scripts with exit codes and declared dependencies are strong. Risk: archetype list too coarse for odd repos; a cold session may argue with step 2.
- **truth (20): 9.** The claim ledger plus `check.mjs` is the best answer to "a deliberate way of keeping READMEs honest". Residual risk: the checker verifies that things exist, not that the sentence interprets them correctly.
- **story (20): 6.** This is where I am weakest, and I know it. The structure is right; whether the opening gives a stranger a *reason to care* depends on the hook step, which is currently a formula. I want the group to pressure-test this.
- **visuals (20): 7.** Real screenshot, light/dark, decision table that allows "none". Not a showstopper aesthetically; the input-to-output strip is the stretch.
- **pitch (15): 7.** "README rendered from a verified claim ledger" is a crisp, defensible line. Needs the demo's evidence (claims resolved, items omitted) to land.

## The riskiest part

The ledger can make the README *correct and dull*. If every sentence must be pinned, the skill may sand off the voice and the reason to care, and the first screen reads like a spec. The hook step (4) has to be a real writing step with its own examples, not a formula. Second risk: the checker's command resolution is heuristic (finding `python3 run.py demo` in prose vs argparse); a false negative would block a true claim, a false positive lets a wrong one through. I would rather it be strict and let the skill drop the claim.
