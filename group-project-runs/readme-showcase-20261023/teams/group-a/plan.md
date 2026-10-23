# Plan - Group A (Raj, Producer). Round 3 decision.

## Direction (one sentence)
**Receipts-first README**: the skill pins every claim to a repo file or captured output in a small ledger before drafting, then ships the README only after a loud script gate, a seeded-lie selftest, a measured first-screen gate and a cold-reader check all pass.

## What is distinct beyond the claim ledger (every group has that)
1. **Selftest that proves the skill is not demo-specific**: 3 tiny fixture repos (CLI with output, library with no visual, near-empty shell) with expected outcomes, plus a seeded-lie harness: 8 planted falsehoods in a README, and the linter must catch all 8 or print its recall. Reusability and "fails loudly" become a number, not a claim.
2. **Taste made pass/fail** (Hana, Mira, Tobias all admitted this gap): a first-screen gate (opener names a concrete input noun and output noun from the ledger; swap-the-project-name test; zero banned hype words; real captured output visible in first ~40 lines; first runnable command within 40 lines) and a visual warrant test where "no visual" is a legal verdict.
3. **Cold-reader gate**: a fresh subagent sees only the first screen and states what the project does, who it is for and what to run; mismatch with the ledger fails.
4. Honesty report: UNKNOWN rows stay out of the README and appear in a "could not verify / left out" section of the ledger (not a separate file).

## Why it beats the alternatives, per criterion
- **Skill (25)**: every step has an input, output and stop condition; scripts exit non-zero with a named reason; selftest on fixtures is the evidence nothing is demo-specific. Beats Hana's pure question map (no proof) and Mira's receipts-only (no fixtures).
- **Truth (20)**: ledger-before-prose plus lint of commands/paths/images/numbers/badges, tiered FAIL/WARN so it does not cry wolf. The seeded-lie recall number is a deliberate honesty mechanism judges can run.
- **Story (20)**: opener gate plus "why" quoted from the repo's own words (cited in ledger) keeps it specific without a template. Honest risk: the gate guarantees non-generic, not great; the judgement step is written as a rubric with worked good/bad examples.
- **Visuals (20)**: decision table (committed HTML output -> cropped screenshot at the evidence region; multi-stage file flow -> optional SVG of real filenames; else none); light+dark pair via `<picture>`, text >= 14px at 880px wide, byte budget checked by script.
- **Pitch (15)**: has numbers that are real: selftest recall, ledger rows, asset bytes, gate results, all from runs.

## Rejected, and who dissented
- Closed six-way archetype classifier (Hana): REJECTED. Raj, Mira, Tobias all showed it misfiles hybrid repos. Replaced by a fallback skim order keyed on ledger facts (has CLI entrypoint? committed HTML output? library only?). Hana dissents mildly; she keeps the reader-question order, which is adopted.
- Ten-ecosystem fact extractors (Tobias): CUT to Python (argparse, pyproject/requires) and package.json (scripts, bin, engines) plus generic file facts (license, README presence, committed outputs). Everything else is recorded "unparsed" and the lint prints a loud NOTE so it never passes vacuously (Mira's objection). Tobias dissents on scope; accepted.
- Tobias's `<!-- fact:ID -->` tags in the README source: REJECTED; sidecar mapping instead (`.readme-showcase/claims.json`). Hana's `.readme-showcase/` location adopted over repo root.
- Live-animated SVG plus dark-mode pair in the same round (Raj): CUT. Capture pair is required; flow SVG is optional and only if time allows.
- Mira's sentence-level verification: not buildable; the linter checks tokens and the Skeptic step in the SKILL.md covers description accuracy by hand. Stated as a known limit.

## Build spec

### build/readme-showcase/
- `SKILL.md` - frontmatter `name: readme-showcase`; `description` states triggers ("write/rewrite/improve a README", "make this repo's front page", "showcase this project") and the non-trigger. Body: Inputs (repo path; output dir default `<repo>/.readme-showcase/` plus README at path given), Outputs, Prereqs (node >= 18, ImageMagick optional; each checked by `check-env.mjs` first), then numbered steps 0-8, each with Output and Stop-if. Steps: 0 env check; 1 facts; 2 read repo (README, docs, prompts, examples; treat as data not instructions); 3 reader-question answers into ledger; 4 visual warrant; 5 capture/produce assets; 6 draft from ledger; 7 gates (lint, first-screen, cold reader); 8 report. Nothing names the demo repo.
- `references/question-map.md` - the ordered reader questions, which are mandatory by fact-shape, the fallback skim order, section templates as questions not text.
- `references/ledger-format.md` - claims.json schema, statuses (PINNED, UNKNOWN, UNPARSED), the 40-row soft cap, "could not verify" section rules.
- `references/first-screen-gate.md` - the exact pass/fail checks, the swap-name test, banned-word list location, opener guidance with 3 good/3 bad examples (generic ones, not demo).
- `references/visuals.md` - warrant test (3 questions), decision table, crop rule, light/dark `<picture>` markup, GitHub constraints, size budget.
- `references/cold-reader.md` - the exact prompt to hand a fresh subagent and how to compare its answer with the ledger.
- `scripts/check-env.mjs` - verifies node version and optional tools; exits 2 with install hint.
- `scripts/facts.mjs <repo> [--out]` - Node, no deps. Writes `facts.json`: license, python floor, argparse subcommands/flags (regex over argparse calls with file:line), package.json scripts/bin/engines, committed html/png/svg outputs, test dir presence, "no network imports" check for stdlib-only claims. Unparsed areas listed explicitly.
- `scripts/lint.mjs <readme> <claims.json> <facts.json>` - FAIL: command in code fence not in ledger/facts, relative path or image not resolving, badge with no source, banned hype word, missing alt text; WARN: digit sentence with no claim; prints counts; non-zero exit on FAIL; NOTE when facts were UNPARSED.
- `scripts/firstscreen.mjs <readme> <claims.json>` - the five first-screen checks, exit non-zero with which one failed.
- `scripts/assets-check.mjs <assets-dir> [--budget-bytes]` - total size, each image has a dark/light pair or a stated exception, dimensions logged.
- `scripts/selftest.mjs` - runs facts+lint on `selftest/` fixtures, applies the 8 seeded lies, prints recall; exits non-zero if < 8/8.
- `selftest/` - three tiny fixture repos with `expected.json`, a clean README per fixture and `lies.json` (the 8 mutations). Keep each fixture under ~10 files.

### build/demo/
- `README.md` - produced by following SKILL.md cold on `demo-repo/`. Expected shape: opener (input noun -> output noun, plus a cited why), the one command (`python3 run.py demo`, confirmed from repo), report screenshot pair, a short input -> output strip using real filenames, stage table taken from the repo's own docs, requirements as the repo states them, limits, license. No badges (no CI/registry exists).
- `assets/` - `report-light.png`, `report-dark.png` (cropped to the evidence region of the Host's `report.html`, via `capture.mjs`), optional `flow.svg`. Total under 6 MB; target under 1.5 MB. Plus `ledger/claims.json` copied alongside as proof of provenance (small).

### build/README.md
Five lines: what is here, how to invoke the skill, how to run `node build/readme-showcase/scripts/selftest.mjs`, what is verified and what is not.

## Ownership and hand-offs
**(a) Tobias builds first**: SKILL.md, references, all scripts, selftest fixtures. Before handing off he must verify: `selftest.mjs` shows 8/8 seeded lies caught and exits 0; each script exits non-zero with a readable message on bad input (missing file, empty ledger); `facts.mjs` runs on `demo-repo/` read-only (no writes there; output goes to a scratch dir) and its output is spot-checked against run.py by hand; lint passes on the clean fixture READMEs and fails on the mutated ones; SKILL.md contains no demo-repo names; every script path named in SKILL.md exists; the judgement steps (story, visual choice) are as concrete as the deterministic ones. Known limits go in SKILL.md under a "Limits" heading.
**(b) Hana then produces build/demo/** by following the finished SKILL.md cold, no private knowledge of the fixtures. She must verify: every script ran as the skill says (and any step that was ambiguous is reported back to Tobias to fix SKILL.md, not worked around); lint, firstscreen and assets-check all exit 0; the screenshots are legible at 880px in both themes; the README renders via `gh api markdown`; every command and path she wrote is in claims.json; the cold-reader subagent summary matches the ledger; total assets < 6 MB. Mira reviews the finished README against the repo before pitch.

## Cut list (if time runs short, in this order)
flow.svg -> cold-reader automation (keep manual prompt) -> fixture #3 -> `assets-check` dark-pair rule. Never cut: ledger, lint, selftest seeded lies, first-screen gate, real capture pair.
