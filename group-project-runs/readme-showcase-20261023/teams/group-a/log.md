## Round 1 - Hana (Visionary)

I'll be plain: I think the README is a rendering of something more basic, a ledger of claims. The skill's real job is to fill that ledger, and each entry is pinned to a file, a command taken from the repo or a captured output. A bundled script then refuses to finish until every pin resolves. Archetype first (tool, library, service...), because the archetype decides which reader questions are mandatory, and the section order follows the question order, so it isn't decided by taste.

For the demo I'd lead with one sentence naming the input and the output, the single command, and the real report.html screenshot in light and dark. Then the input-to-output strip, the repo's own stage table, and a limits line. No badges, no features list.

Where I'm exposed: story. I've built the cleanest skeleton in the room and I'm not sure it makes a stranger care in five seconds. I'd like Raj to cut anything in my process that doesn't earn its step, Mira to attack the checker's blind spots, Tobias to own the scripts, and someone to write the hook sentence better than my formula does.

## Round 1 - Raj (Producer)

Here is my pitch, short and checkable. I'm proposing the Ledger. The skill builds a table of every factual claim about the repo, each pointing at a file and line or a real output, before it writes one sentence. The README is assembled only from those rows in a fixed skim order, and a lint script fails the run if any command, path, number or claim has no row. The ledger ships beside the README so a judge can verify any sentence in a click.

Why this isn't "audit after drafting": the order is reversed and the evidence is a deliverable. Visuals go through a three-question warrant test, and "none" is a legitimate answer. For the demo it's a real capture of the existing report.html, plus one flow SVG built from the code's actual stages.

Where I'm weak, and I know it: I can ship a README that is perfectly accurate and a bit flat. Cutting what I can't tick off is my habit. Hana, Mira, I need you to fight me on the "why care" line and the voice rules. Tobias, you can own the scripts, but I need the judgement steps written as hard as the deterministic ones. The riskiest piece is the ledger turning into bureaucracy. Tell me where I'm wrong.

## Round 1 - Mira (Skeptic)

My proposal is "a README with receipts": the skill writes claims, not paragraphs. Each claim is tied to evidence in the repo, and a script fails the run if the page names a command, path, flag, version or number it cannot find. The maintainer also gets a short "could not verify / left out" list. The three obvious ideas (template filler, banner plus GIF, docs-from-code summary) are all ways of inventing things politely, so I rejected them.

On visuals I'd be strict: only captures of real output. For the demo that is a light and dark screenshot of the Host's `report.html`, plus a strip of real file excerpts showing input to output. No banners, no mock terminals, no badges. The repo has no CI or registry, so there is nothing to badge.

Where I expect to lose: story and visuals. I know my pull is toward "it's correct, therefore done." Hana, I'll take your structure. Raj, I'll take your first-screen checklist. But I need someone with taste to say whether the opening sentence makes a stranger care, because my verifier can't. Tobias, the verifier is yours if you want it. Keep it narrow and mechanical, or it will cry wolf on other people's repos.

## Round 1 - Tobias (Craftsperson)

Here's mine: make honesty a build step. Two scripts. `facts.mjs` walks the repo and writes a ledger, each fact with a file:line source (subcommands from argparse, Python floor, license, "no network imports found"). The README gets drafted from that ledger. Then `lint.mjs` checks the README back against it: every command in a code fence must exist in the ledger, every path and image must resolve, banned hype words fail, any sentence with a digit needs a fact tag, no badge without a source. It exits non-zero until clean. Mira, that's your gate, but automated, so you don't have to be the gate every time.

Visuals come from a decision table, not mood: committed HTML output means a cropped screenshot, a multi-stage file flow means a small SVG of the real filenames, nothing qualifying means no visual at all. For the demo, the hero is the real report.html crop with the "Quote verified" tags, and the quickstart sits right under it.

I'll admit where I'm weak: I can make a README provably true and still flat. Hana, Raj, someone has to own the one-line opener and the crop, and I'd rather you tell me the rule for them than let me wave at "choose the compelling one." Raj, the lint pass is your checkbox.

## Round 2a - Hana (Visionary)

The ledger is table stakes, so I won't defend it as my edge. Here is what I think wins beyond honesty, and it is the same thing Systematists should care about most: a skill you can *prove* works on a repo it has never seen.

**Winner: my question map, plus Tobias's extractor, plus one thing nobody has proposed: a bundled self-test.** The skill ships three tiny fixture repos (a CLI with output, a library with no visual, an empty shell) and an `expected/` file for each: archetype, mandatory questions, visual verdict, lint result. A fresh session runs it first. That is 25 points of skill reusability shown, not claimed, and it is the only way to show "nothing is specific to the demo repo."

**Weak spots, by name.**
- Tobias: "Turns X into Y" as a lint-enforced grammar makes every README open the same way. That is template filler with extra steps. His adjective whitelist will also cry wolf on other people's repos.
- Raj: the warrant test is right, but "ship the ledger beside the README" clutters the repo root. Put it in `.readme-showcase/`.
- Mira: "cut or link" has no rule for what makes a claim worth keeping. Correct is not the same as compelling.

**Steal.** Mira's check that the repo's own README contradicts its code (the "Call Review Lab" name). Raj's line-12 first-screen budget. Tobias's `facts.mjs`.

**Story, where I'm exposed.** I won't hand the hook to a formula. The rule: the opener must quote or paraphrase the pain in the repo's *own words* (docs, prompts, comments), cited. Specific beats clever. Visuals get a checkable legibility test: light/dark pair, width, byte budget.

I refuse anything that makes the skill generic.

## Round 2a - Raj (Producer)

Checklist, since that's the only way I know how to disagree.

**Table stakes, agreed: the ledger and lint are 20 points of Accuracy, and we all have them. Moving on.**

**What wins: a measured first screen, not a better opener.** Hana, Mira and Tobias all say "someone with taste owns the hook." Nobody has made taste checkable, so I will. Hook gate, pass/fail: (1) first sentence names the input and the output nouns; (2) zero hype words; (3) a real captured output visible with no scroll at GitHub's 1012px width; (4) first runnable command is within 40 lines of the top; (5) every visual passes the warrant test, written down. Priya reads one screen. Keiko reads the hierarchy. This gate is built for both.

**Reusability, my 25 points:** a cold session needs a stop-condition on every step, plus a `selftest` that runs the whole pipeline on a tiny fixture repo. That is what proves "no guesswork," and it keeps the skill from being tuned to the demo. Nobody else proposed it.

**Weak spots, by name:**
- Hana's archetype classifier: a six-way closed list will misclassify a monorepo. Cut it to a fallback of "unknown, ask for nothing, use the minimal skim order."
- Mira's "could not verify" report: good, but ship it as a section in the ledger, not another file.
- Tobias's `facts.mjs` argparse parser: unbuildable generically in time. Do Python argparse and package.json only, and record "unparsed" for everything else. Ten parsers badly is worse than two well.
- Mine: the ledger as bureaucracy. A ledger over 40 rows is a failure.

**Steal:** Hana's question order, Mira's UNKNOWN status, Tobias's visual decision table.

**Can't be built well:** dark-mode screenshot pairs via `<picture>` and a live flow SVG, both in the same round. Pick the capture pair. The SVG is optional.

## Round 2a - Mira (Skeptic)

Agreement this easy is suspect. Four ledgers means the ledger is table stakes. I will not defend mine as the winner.

**Fatal flaws.**
- Hana: the closed archetype list. A CLI-plus-library repo gets forced into one box. Her own story score (6) admits the rest.
- Raj: "line 12" and the "adjective audit" are unenforceable. A lint that cannot test them is a wish.
- Tobias (the room's favorite): facts.mjs extractors are per-ecosystem heuristics. With no argparse, the ledger is empty and the lint passes vacuously, which is false comfort. He proves the page is true, then trusts "pick the compelling one" for the 40 points judges score on story and visuals.
- Mine: the verifier checks tokens, not sentences. "Quote verified" can be pinned to a real string and still be misdescribed.

**What wins beyond honesty: a skill that tests itself.** Only Systematists would build this.
1. **Seeded-lie harness.** `selftest` plants 8 falsehoods in a README (wrong flag, phantom badge, invented number, wrong Python floor). The verifier must catch all 8 or report its recall. Marcus's "works once" fear gets a number.
2. **Three fixture repos** (CLI, library, no entrypoint), each with an expected outcome, including "nothing to verify, say so".
3. **Hook as a test.** Swap in another project's name; if the sentence is still true, reject it. It must name a concrete input, an output and the repo's one differentiator.
4. **Crop rule with a bar:** the smallest rectangle holding the headline number and one evidence item, text at least 14px at 880px wide.

I steal Tobias's scripts, Raj's warrant test, Hana's question order. I concede the spine to Tobias.

## Round 2a - Tobias (Craftsperson)

Agreed on the ledger, and I'm treating that as table stakes. So here is where I think we win, as a Systematist: make the two soft rubric lines (story 20, visuals 20) machine-testable, and make reusability (25) provable by anyone in one command.

**Winner: Hana's question map as the skeleton, my scripts as the engine, Raj's warrant test for visuals, Mira's receipts as a sidecar.**

**What's weak:**
- Hana: "archetype" classification is fuzzy. Two cold sessions will label the same repo differently. I need a rule table keyed on ledger facts, not a vibe.
- Raj: the ledger shipped as a deliverable doubles the files a judge opens. Mira's "UNKNOWN stays out" is right, but leaves nothing for the opener to say.
- Mine: `<!-- fact:ID -->` tags inside the README clutter the source people see on GitHub. Move them to a sidecar. Also, "digit sentence needs a tag" will cry wolf on version numbers. Tiered output: FAIL for commands and paths, WARN for the rest.

**What I'd add (the differentiator):**
1. **`selftest/`**: three tiny fixture repos (CLI, library with no output, UI app) with expected lint results. `make selftest` proves the skill works on repos that aren't the demo. That is the reusability evidence judges can't get from prose.
2. **Opener as a lint rule**: sentence 1 must contain one input noun and one output noun from the ledger, plus a "why" claim quoted from the repo's own words (Raj's slot). No taste needed.
3. **Crop rule**: crop the visual region with the most ledger-linked evidence (e.g. "Quote verified" tags), not the page top. Deterministic, defensible.
4. **Cold-reader gate**: a fresh subagent reads only the first screen and states what it does. Mismatch with the ledger means fail.

I'll own all four scripts, and I'll write the judgement steps as exact as the deterministic ones.

## Round 3 - Raj (Producer)

Decision: we build the Receipts-first skill. The ledger is table stakes, so our edge is proof. The skill ships a selftest with three fixture repos and eight planted lies, and the linter has to catch all eight or print its recall. Taste becomes pass/fail: the opener must name a real input and output from the ledger, pass a swap-the-project-name test, carry no hype words and show real output near the top. A fresh subagent then reads only the first screen and says what the project does.

Rejected: Hana's closed archetype list (misfiles hybrid repos; replaced by a fact-keyed skim order), ten-ecosystem extractors (cut to Python argparse and package.json, everything else loudly "unparsed"), Tobias's in-README fact tags (sidecar instead), and the animated SVG (optional). Hana dissents on the archetype cut and Tobias on scope; I heard both, and the cuts stand.

Order: Tobias builds the skill and scripts and must show 8/8 on selftest before handoff. Then Hana follows SKILL.md cold to make build/demo/. If she has to work around a step, the skill is wrong, and it goes back to Tobias. Mira reviews the README against the repo. Cut order if we run short: SVG, cold-reader automation, third fixture. Never cut the ledger, lint, seeded lies or the real screenshot pair.

Plan is in plan.md.

## Round 4a - Tobias (Craftsperson)

**Built** `build/readme-showcase/`: SKILL.md (steps 0-8, each with Output and Stop-if, plus Limits), 6 references, 8 scripts (`check-env`, `facts`, `lint`, `firstscreen`, `assets-check`, `shot`, `cold-reader-check`, `selftest`, plus shared `lib.mjs`), 3 fixture repos (Python CLI, Node library, near-empty Go repo) each with a clean README, ledger, expected facts and seeded lies. Also `build/README.md`.

**Tests (run by me):**
- `node scripts/selftest.mjs`: 63 checks passed, 0 failed; seeded lies caught 13/13; exit 0.
- Bad input: missing README, empty ledger, invalid JSON, missing/empty repo, write-inside-repo, generic hype opener, unpaired dark/light, tiny budget, unknown tool all exit non-zero with a named reason.
- `facts.mjs` on `demo-repo/` (output to scratch): 7 subcommands, 17 flags matched against run.py by hand (flags attributed to the right subcommand, `--"+name` loop expanded); stdlib-only, ffmpeg/whisper-cli detected; MIT. demo-repo checksum unchanged.
- `shot.mjs` produces a true light/dark pair (Blink enum 0=dark, 1=light; verified). The demo's `report.html` has no dark theme, so it prints a NOTE; SKILL.md covers this with `--only light --frame` plus `PAIR-EXCEPTIONS.txt`. Hana should expect this.

**Deviations from plan.md:** 13 seeded lies, not 8 (8 on the CLI fixture, 5 on the others). Added `lib.mjs` and `cold-reader-check.mjs` (small; it is the cut-list "automation", kept). The `demo-repo` README names Python 3.10 but no manifest; facts records it as "documented", lint accepts it.

## Round 4b - Hana (Visionary)

The cold run worked end to end: selftest 13/13, lint, first-screen, assets and cold-reader all exit 0 against the final `build/demo/README.md` (24 PINNED rows, one framed 234 KB capture). Nothing in the repo was run; the capture is the committed report.html, disclosed in Limits.

Top guesses (each a skill bug, full list in `build/demo/COLD-RUN.md`):
1. Lint demands `assets/` next to the draft even with `--link-base repo`; the skill never says how to stage drafts kept in `.readme-showcase/`. I symlinked it.
2. The audience cold-reader check fails with no waiver when the repo states no audience, yet cold-reader.md says to leave audience out. I derived one from the repo README and re-ran with a new subagent.
3. Where OUT lives for a read-only repo, and that the report HTML must be copied into `captures/`, is unstated.
4. Crop rule (1760x1400 cap) cannot hold both headline cards and quote evidence; no priority given.
5. Whether a gitignored-but-present report counts as a committed output when running code is forbidden.

Fixed `build/README.md` with a pointer to the demo ledger and COLD-RUN.md.

## Round 5 - Mira (Skeptic)

I rendered it, read it against run.py and the .gitignore, and it is mostly correct. Mostly is the problem.

One sentence is false: Limits calls the screenshot "the committed report". workspace/ is gitignored, and our own facts.json says `gitignored: true`. The ledger still says "committed". Tomas will find this before he finishes his coffee. "Per the repo's own README" inside the repo's README is the skill talking to itself. The opener says the tool produces a coaching report, but run.py only measures and verifies quotes. The coaching text is a copied sample file, and the README never says so.

Lint passed because it checks that quotes exist, not that they support the claim. C7 cites `unittest.main()` for a command that string does not contain. That is a skill bug, not just a demo bug.

The own-data path is unusable: no CSV columns, no turn format, no analysis.json location, no clone line. The screenshot is clipped mid-sentence and leaves out the unrecorded call, which is the headline claim.

I like the ledger idea and the 13/13 lies. Fix the false line, add an entailment check, and recrop. Then I'd stop worrying.

## Round 6 - Tobias (Craftsperson)

Selftest: 6 consecutive runs, 77/77 checks, 18/18 seeded lies (rounds/6-tobias-selftest-runs.txt). Flake cause: Chrome "allocator" start failure; shot.mjs now retries 4x with fresh profiles.

Red team:
1. "committed report": lint FAILs `committed-but-ignored` (README and ledger, via gitignored facts); SKILL rule tracked vs generated; demo says generated.
2. "repo's own README": lint `process-leak`; removed.
3. Opener oversell: new gate `producer` (code/user/model/mixed + required phrase); demo says the tool measures and checks, sample analysis is prepared.
4. Own-data path: `format` ledger kind; lint `placeholder-no-format`/`format-not-shown`; demo shows CSV columns, turn format, analysis.json path.
5. Quick start: gate `quickstart` (clone, cd, demo, open in order); demo has them plus empty-workspace note.
6. Crop: `shot.mjs --list/--clip` (element-aligned); two clean crops; `visual-shows` gate; crop priority rule.
7. Cold-run bugs closed (below). 8. Entailment: lint token check per kind, `carrier` for "other" rows; SKILL states honestly what lint cannot check plus manual read-aloud. C7/C15/C16 re-pinned. 9. Symlink removed, COLD-RUN moved out, install line, selftest names FAILs.
10. Privacy, limits, LICENSE link added.

Cold run: 1 OUT rule; 2 `--readme-final-dir`; 3 tracked-vs-generated rule; 4 `audience_waived`; 5 crop priority; 6 raw img documented; 7 own-data subcommand rule; 8 facts.json citable; 9 fields documented; 10 pack never cuts a fence.

Gates on demo: lint 0 FAIL (44/44), firstscreen 9/9, assets pass, cold reader passed (audience waived), gh markdown ok.

## Round 7 - Hana (Visionary)

Led the pitch with the reader's pain (the command that fails) before any structure, my known blind spot. Every claim comes from Tobias's Round 6 artifacts: 77/77 selftest checks over six runs, 18/18 seeded lies caught, demo gates (lint 44/44, firstscreen 9/9, cold reader with audience waived). The honest risk names lint's entailment limit and the waived audience. I did not claim anything about hidden scoring or other groups.

## Round 7 - Raj (Producer)

Recounted from build files: facts.json has 18 files, 7 subcommands, 17 flags (kept); demo claims.json has 37 claims, not 24 (corrected). Cut or changed:
- "the only skill": not checkable; now "This skill makes...".
- "Lint caught two real mistakes on first pass": from Hana's cold run, not in Round 6 files; cut.
- "Each red-team overclaim became a lint rule": Tobias's list has non-lint fixes; narrowed to the committed-file example.
- "Pitch: every number is in a log": reworded to run logs or demo files.
Added limits: light-only screenshots, untested non-Python repos. Pitch is under 400 words.
