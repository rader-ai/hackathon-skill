# Receipts-First README

**Hook:** Every README makes promises. This skill makes the README prove them before you see it.

## Why care
You open a repo, trust its README, and the command fails. Nobody checks the one page every visitor reads. `readme-showcase` is built so a false claim cannot ship quietly.

## The idea
Before writing prose, the skill pins every claim to a repo file or captured output in a ledger. It delivers the README only after four gates pass: a truth lint, a first-screen check, an assets check and a cold-reader check by a fresh subagent. What it cannot verify, it leaves out and reports.

## On a repo it has never seen
Call Review Lab (the demo repo): the skill parsed 18 files, 7 subcommands and 17 flags, then built a 37-claim ledger. The opener says what goes in (speaker-labeled transcripts) and what comes out (timeline, talk stats, coaching points tagged Quote verified or Needs evidence review). It says plainly that the tool measures and does not run a model. Demo gates: lint 44/44, first-screen 9/9, assets pass, cold reader passed, GitHub markdown renders.

## Why it wins
- **Skill:** Runs from environment check (step 0) to final report. Its selftest on three fixture repos (CLI, library with no visual, near-empty) passed 77/77 checks in six consecutive runs. Scripts exit non-zero with a plain message.
- **Truth:** A seeded-lie harness plants 18 false claims; lint caught 18/18. In Round 6 the red team's overclaims (such as calling a gitignored file "committed") became lint rules.
- **Story:** A quick start in order: clone, cd, demo, open. Own-data steps follow.
- **Visuals:** Two real crops of the generated report. "No visual" is a legal verdict for libraries.
- **Pitch:** Every number here comes from a run log or the demo files.

## Honest risk
- Lint checks that claims are traceable, not that prose fully entails them; the skill says so and requires a read-aloud pass.
- The cold-reader gate depends on a subagent's judgment, and the demo's audience line was waived because the repo never names an audience.
- The demo page has no dark theme, so screenshots ship light-only with a frame.
- Only a Python CLI repo ran end to end; other languages' CLIs are untested.

## Close
A README should be a receipt, not a brochure.
