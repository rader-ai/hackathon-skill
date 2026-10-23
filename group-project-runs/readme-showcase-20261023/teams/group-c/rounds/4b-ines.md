## Round 4b - Ines (Visionary)

Cold run worked end to end: preflight, capture (3 exits 0), checker PASS (0 fail, 0 WARN, 1 image, 17 KB, 19 ledger rows), test suite OK. The skill is mostly followable by someone who has never seen it; the README and proof image came out clean.

Top guesses (full list of 12 in build/demo/COLD-RUN.md):
1. SKILL.md step 3 ledger header `Source (file:line)` makes the checker FAIL on the header row; ledger.md uses `Source`. A real bug that hits everyone on the first run.
2. `| tee check.log` in step 7 hides the checker exit code, so the "exit 0 / exit 1" rule cannot be read.
3. Proof-pair recipe leaves crop box, column widths and shrink tradeoff to guesswork (my 830 px layout scaled the output about 77%).
4. Citing whole-file or single-line artifacts (report.html:1, LICENSE:1) and absences (no version check) is not covered.
5. Image-job format differs between SKILL.md step 4 and ledger.md.
6. Outputs list omits check.log; scratch location is unspecified.
