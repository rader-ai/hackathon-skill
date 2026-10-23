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
