# Cold run of readme-showcase on demo-repo (Hana, round 4b)

Variables: SKILL=build/readme-showcase, REPO=WS/demo-repo (read-only, so OUT=build/demo/.readme-showcase), README_PATH=build/demo/README.md, ASSETS=build/demo/assets. Repo code was NOT run (my brief forbids it).

## Steps and results
| step | command | result |
|---|---|---|
| 0 | `node $SKILL/scripts/check-env.mjs` | pass, exit 0 (node v22, magick, chrome, gh, ffmpeg present) |
| 0 | `node $SKILL/scripts/selftest.mjs --quiet` | PASSED, 63 checks, lies caught 13/13 |
| 1 | `node $SKILL/scripts/facts.mjs $REPO --out $OUT/facts.json` | pass; 18 files, 7 commands, 17 flags, unparsed 0 |
| 2 | read facts, README, METHOD.md, run.py, tests, examples, prompt | pass |
| 3 | wrote `claims.json` (24 PINNED, 2 UNKNOWN) | pass |
| 4 | verdict `capture` (committed report.html) | pass |
| 5 | `shot.mjs $OUT/captures/report.html --out assets --name report --width 880 --height 2400 --scale 2` | pass, 1760x4800, NOTE light and dark identical |
| 5 | re-run with `--only light --frame --crop 1760x1400+0+1700`, wrote PAIR-EXCEPTIONS.txt | pass, 1794x1434, 234 KB |
| 5 | `assets-check.mjs assets` | PASSED, 0.23 MB |
| 6 | wrote README.draft.md | pass |
| 7.1 | `lint.mjs ... --repo $REPO --link-base repo` | round 1: 2 FAIL (UNKNOWN value "Windows" leaked; image not found). Round 2: 0 FAIL, 28/28 evidence verified |
| 7.2 | `firstscreen.mjs` | PASSED 6/6 |
| 7.3 | `assets-check.mjs` | PASSED |
| 7.4 | cold reader, haiku subagent | round 1: FAIL audience (does, command pass). Added audience sentence pinned to repo README (C26); round 2 with NEW subagent: PASSED |
| 7.5 | `gh api markdown` | exit 0 |
| final | copied draft to README.md; re-ran lint, firstscreen, assets-check | all exit 0 |

Capture is the committed `workspace/report.html` (copied to `captures/`), not a fresh demo run; the README says so.

## Guesses (each is a skill bug)
1. **OUT location when REPO is read-only**: Outputs says `<dirname README_PATH>/.readme-showcase/` only "if REPO is read-only or user prefers"; nothing says to copy `captures/report.html` there. I chose it and copied the committed HTML in.
2. **Draft staging vs images**: the draft lives in `$OUT`, but lint requires `assets/` next to the README even with `--link-base repo`. Skill never says how to stage. I symlinked `$OUT/assets -> ../assets`. Fix: lint should resolve images against the final README location, or SKILL should say to symlink/copy.
3. **No-run repos**: when running code is forbidden and output is only a gitignored HTML, the skill does not say whether a gitignored but present `workspace/report.html` counts as a "committed output" for capture. I treated it as allowed and disclosed it in Limits.
4. **Audience gate vs "leave it out"**: cold-reader.md says to leave audience out if the repo does not state it, but `check` then exits 1 with no waiver. Repo never states an audience explicitly; I derived one from "sales or customer calls" and "account owner". Needs a waiver path or a rule.
5. **Crop choice**: "evidence region" guidance conflicts with the 1760x1400 cap; the report's headline cards and the quote evidence cannot both fit. I picked the quote card and clipped its bottom edge. No rule for what to sacrifice.
6. **Dark/light**: no `<picture>` needed for single image but visuals.md only shows `![]()` for single; I used `<img width=880>`. Fine but unstated that raw `<img>` is lint-safe.
7. **Reader question Q6 (own data)**: how many of the repo's flags to list is unspecified; I listed only four subcommands to stay pinned.
8. **Pinning "stdlib only"**: facts `imports.stdlib_only` was available but ledger kinds have no way to cite facts.json as evidence; I used the docstring.
9. `ledger.first_screen` fields `first_runnable_claim`, `why_none_reason` are listed in the schema but never explained; I set them null.
10. The cold-reader pack cuts at 40 lines mid-section, which can slice a code fence; harmless here.
