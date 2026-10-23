## Round 4a - Tobias (Craftsperson)

**Built** `build/readme-showcase/`: SKILL.md (steps 0-8, each with Output and Stop-if, plus Limits), 6 references, 8 scripts (`check-env`, `facts`, `lint`, `firstscreen`, `assets-check`, `shot`, `cold-reader-check`, `selftest`, plus shared `lib.mjs`), 3 fixture repos (Python CLI, Node library, near-empty Go repo) each with a clean README, ledger, expected facts and seeded lies. Also `build/README.md`.

**Tests (run by me):**
- `node scripts/selftest.mjs`: 63 checks passed, 0 failed; seeded lies caught 13/13; exit 0.
- Bad input: missing README, empty ledger, invalid JSON, missing/empty repo, write-inside-repo, generic hype opener, unpaired dark/light, tiny budget, unknown tool all exit non-zero with a named reason.
- `facts.mjs` on `demo-repo/` (output to scratch): 7 subcommands, 17 flags matched against run.py by hand (flags attributed to the right subcommand, `--"+name` loop expanded); stdlib-only, ffmpeg/whisper-cli detected; MIT. demo-repo checksum unchanged.
- `shot.mjs` produces a true light/dark pair (Blink enum 0=dark, 1=light; verified). The demo's `report.html` has no dark theme, so it prints a NOTE; SKILL.md covers this with `--only light --frame` plus `PAIR-EXCEPTIONS.txt`. Hana should expect this.

**Deviations from plan.md:** 13 seeded lies, not 8 (8 on the CLI fixture, 5 on the others). Added `lib.mjs` and `cold-reader-check.mjs` (small; it is the cut-list "automation", kept). The `demo-repo` README names Python 3.10 but no manifest; facts records it as "documented", lint accepts it.
