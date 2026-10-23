## Round 6 - Wes (Craftsperson)

**Red team**
1. Header bug, tee, table-vs-lines, check.log, scratch: checker skips any header row; step 7 redirects and echoes `$?`; image table everywhere; Outputs lists check.log; scratch in `OUT/.scratch/`. COLD-RUN lines marked resolved. 4 new tests (33 pass).
2. Reader: story.md requires naming the reader from repo words (else LEFT-OUT); demo one-liner now "For people who review sales or customer calls" (README.md:3, :43).
3. Clone restored with `cd` and `xdg-open`; skill rule: budget counts run commands, keep get-the-code and OS variants.
4. Proof: composed pair removed. Input is now a fenced block of 3 exact lines, image is one 2x crop of the real report, caption names source and says happy path only; border added.
5. Hook reworded to the real strength; README states what the check ignores (speaker, length, context). story.md "Guarantee sentences".
6. Checker WARNs on guarantee words with no ledger claim, and on ledger lines sharing no word with the claim. SKILL.md says plainly it cannot catch invented prose and gives a manual sentence-by-sentence check.
7. Collapsed note: links resolve when file replaces repo README.
8. Collapsed "How this README was checked" added.
9. `whisper-cli` named (run.py:270, code wins rule); text sample added; 1.5 MB rationale given.

**Cold-run guesses 1-12:** all closed (see Resolved lines in COLD-RUN.md).

Results: tests 33 OK; checker `PASS - 0 fail, 0 unverified; 1 images, 41171 bytes; 25 ledger rows`.
