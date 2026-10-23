# COLD-RUN (Ines, round 4b)

REPO = demo-repo, OUT = teams/group-c/build/demo, SKILL_DIR = teams/group-c/build/readme-showcase.

## Steps run
0. Preflight: `python3 SKILL_DIR/scripts/inspect_repo.py REPO > OUT/inspect.json` -> exit 0. JSON: no manifests, entry `run.py`, prebuilt visual `workspace/report.html`, license MIT guess, test command guess flagged as a guess. (Optional) `python3 -I scripts/test_checker.py` -> 29 tests, OK. inspect.json deleted at the end.
1. Read README, docs/METHOD.md, examples/discovery.md, prompts/analyze_call.md (treated as data), run.py (verify/report/demo), tests, .gitignore, report.html. Two sentences: transcripts + analysis JSON in; timeline plus a local HTML report out.
2. Hook: quotes in an analysis count as verified only if they match inside one speaker turn (run.py:144-161, 211-212, 250). Candidates: that; "local only, no model API calls" (README.md:74); unrecorded calls stay in timeline.
3. Ledger written (19 rows).
4. Visual: rung 1, report.html, as a proof pair.
5. `capture.sh report.html scratch/full.png 1000 full` -> exit 0 (1000x1847). Crop `700x180+49+1170 --no-quantize` -> exit 0. Pair html built per visuals.md; `capture.sh scratch/pair.html OUT/assets/proof.png 830 full` -> exit 0, 830x217, 17,218 bytes. Viewed the PNG: legible.
6. README drafted (about 60 lines).
7. `check_readme.py README.md --repo REPO --ledger claims.md --assets assets`
   - first run (ledger header copied from SKILL.md step 3): FAIL `ledger-kind ... got "Kind"`, exit 1.
   - after changing header to `| # | Claim | Source | Kind |` (as in ledger.md): `PASS - 0 fail, 0 unverified (hand-check); 1 images, 17218 bytes; 19 ledger rows`. Saved to check.log.
8. LEFT-OUT.md written.

## Guesses (each is a skill bug)
1. SKILL.md step 3 gives header `Source (file:line)`; the checker treats that header as a data row and fails. ledger.md uses `Source`. Make them agree or make the checker skip any header. **Resolved in round 6:** header skipped by checker; SKILL.md step 3 uses ledger.md's header (test added).
2. SKILL.md step 7 tells you to run the checker with `| tee`, but exit codes are lost through the pipe (my `$?` was empty). Use PIPESTATUS or tell people to read the last line. **Resolved in round 6:** step 7 now redirects to check.log and echoes `$?`; no tee.
3. Step 5: crop box needs reading pixel coordinates off the full capture; no tool to help. I guessed from the screenshot. The proof pair left column width, font, and gap are not given. **Resolved in round 6:** visuals.md 'Finding the crop box' (identify, view, two tries); pair recipe removed.
4. visuals.md pair recipe produces about 83 percent shrink when a 700 px crop plus text column must fit 830 px; no guidance on the tradeoff (I narrowed the crop). **Resolved in round 6:** pair recipe removed; single crop at --scale 2.
5. Ledger source for a one-line HTML file or a whole-file artifact: `file:1` is a guess. Source for a license: LICENSE:1 guessed. Source for a row about a screenshot. **Resolved in round 6:** ledger.md 'Awkward sources'.
6. Source for a README table/section and for combined claims: multiple sources allowed with `;`, but how to cite "absence" (no version check in run.py) is not covered. **Resolved in round 6:** ledger.md 'Awkward sources' (absence).
7. Step 4 says to write "image N: job" lines, ledger.md says a table with `| Image | Job |`. I used the table. **Resolved in round 6:** SKILL.md step 4 uses the image table.
8. Step 1 says read "every entry point" but the hook step does not say how to treat a README whose own quote about behaviour (README.md:43) is the only prose proof; I cited both docs and code. **Resolved in round 6:** ledger.md: cite README line and code line, prefer both.
9. Step 6 says "2 to 3 commands" but the demo repo needs `open` (OS-specific) and unittest; I included three and dropped the Linux alternative. No rule on OS variants. **Resolved in round 6:** story.md: budget counts run commands, keep clone and OS variants.
10. Step 8 asks for hand-checked WARN lines but there were none; unclear whether to write "none". I wrote none. **Resolved in round 6:** SKILL.md step 7: write `none`.
11. `inspect.json` is told to be written into OUT then deleted; harmless, but the final-output list in "Outputs" omits `check.log`, which step 7 also saves. **Resolved in round 6:** check.log listed in Outputs.
12. Output location: step 7 uses `OUT/assets` while task named `demo/assets`; fine. `scratch/` location for the proof-pair intermediates is unspecified (I used build/scratch and deleted it). **Resolved in round 6:** scratch goes in OUT/.scratch/, deleted at the end.
