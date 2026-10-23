## Round 4a - Sol (Craftsperson)

**Built** `build/readme-showcase/`: `SKILL.md` (99 lines: inputs/outputs, declared deps, 11-step workflow, STOP conditions, exit-code table, limits); `references/` (ladder, ledger, beats, readme-structure incl. install/limits checklist); `scripts/` (inventory, reel, capture, verify, selftest.sh, lib/pw.mjs); `fixtures/tiny-lib` (4-file library) plus `fixtures/tiny-lib-out` (README, ledger, beats, no-pair beats).

**Tests** (`rounds/4a-sol-selftest.txt`): `bash scripts/selftest.sh` = 27 passed, 0 failed with Playwright (set `READMESHOWCASE_PLAYWRIGHT_DIR=~/.cache/group-project`); 25 passed plus 2 loud SKIPs without it. Covered: inventory exit 2 (missing, file, empty); reel renders both SVGs (2.5 KB), exits 3 on no pair and writes nothing, rejects >3 beats, >8 s, missing source, overlong text; verify exits 0 on the clean fixture and 1 on dead source, altered number, hype word, false quote, missing Limits, dead image, invented badge, edited SVG text, unlabelled unverified command. Also ran inventory and capture on the demo repo (read-only). Reel looked at in both themes (animation frames and PNG). `gh api markdown` keeps the `<picture>` block.

**Not verified:** SVG animation inside `<img>` on real github.com (API render only). No demo-specific text in SKILL.md or scripts (grepped).

**Deviations from plan.md:** verify also fails on a missing Limits heading and edited Reel SVG text; the `<picture>` uses a light `<source>` plus PNG `<img>`; the Playwright search path is `~/.cache/readme-showcase`, or the env var above.
