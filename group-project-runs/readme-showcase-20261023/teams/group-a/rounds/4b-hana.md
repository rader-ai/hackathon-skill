## Round 4b - Hana (Visionary)

The cold run worked end to end: selftest 13/13, lint, first-screen, assets and cold-reader all exit 0 against the final `build/demo/README.md` (24 PINNED rows, one framed 234 KB capture). Nothing in the repo was run; the capture is the committed report.html, disclosed in Limits.

Top guesses (each a skill bug, full list in `build/demo/COLD-RUN.md`):
1. Lint demands `assets/` next to the draft even with `--link-base repo`; the skill never says how to stage drafts kept in `.readme-showcase/`. I symlinked it.
2. The audience cold-reader check fails with no waiver when the repo states no audience, yet cold-reader.md says to leave audience out. I derived one from the repo README and re-ran with a new subagent.
3. Where OUT lives for a read-only repo, and that the report HTML must be copied into `captures/`, is unstated.
4. Crop rule (1760x1400 cap) cannot hold both headline cards and quote evidence; no priority given.
5. Whether a gitignored-but-present report counts as a committed output when running code is forbidden.

Fixed `build/README.md` with a pointer to the demo ledger and COLD-RUN.md.
