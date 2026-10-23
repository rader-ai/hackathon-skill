# Cold run of readme-showcase on demo-repo (Leo)

Env: `READMESHOWCASE_PLAYWRIGHT_DIR=$HOME/.cache/group-project` (set because the skill's default install path ~/.cache/readme-showcase does not exist here). S = build/readme-showcase/scripts.

## Steps run
1. `bash $S/selftest.sh` -> `selftest: 27 passed, 0 failed` (PASS). Env var was exported before I ran it; I did not test whether it works without.
2. `node $S/inventory.mjs <repo> > demo/inventory.json` -> exit 0. Read README, run.py headers, examples/, workspace/ outputs myself.
3. Ladder: rung 1 (workspace/report.html is a real artifact) plus a rung-2 Reel (real in/out pair: examples/discovery.md line -> verification.json -> report). Reason logged: report is the real product; Reel shows input becoming verified output.
4. Captures: `node $S/capture.mjs <repo>/workspace/report.html --out demo/assets/report-{light,dark}.png --width 880 --theme X --max-height 900` -> both exit 0, 153268 bytes, byte-identical (cmp), so I kept one. Top-of-page crop was uninformative (stat cards only), so I recaptured with `--selector "section:nth-of-type(3) article"` -> 199307 bytes, looked at it, good.
5. Ledger: wrote demo/claims.json (57 rows) before README. Beats: demo/beats.json (in/step/out).
6. `node $S/reel.mjs demo/beats.json --out demo/assets` -> exit 0, reel-light.svg/reel-dark.svg 4163 B each (differ), reel-final.png 86354 B, no warnings.
7. README written to demo/README.md from ledger rows.
8. `node $S/verify.mjs <repo> demo` first run: `78 checks passed, 5 failed` (multi-line `python3 run.py add \` command). Split into one row per line; second run: `87 checks passed, 0 failed, 0 warnings` (PASS). Saved to verify-output.txt.
9. Render check: `gh api markdown -f text="$(cat README.md)" -f mode=gfm` -> exit 0; `<picture>` (wrapped in themed-picture), table, code blocks present.
10. Animation check: demo/check/{light,dark}.html with the SVG as `<img>`, `capture.mjs --times 0.5,3,6` -> PNGs in demo/check/{light,dark}/. At 0.5 s only INPUT card visible; at 3 s INPUT+CHECK; at 6 s all three, nothing clipped in dark/light (capture viewport is 720 wide so right edge crops; reel-final.png at full width checked, fine).
11. Adversary read (step 9): did it myself as a hostile re-read (no subagent spawned). Found my own overreach: the `c-ex` row ("example output from the demo") quote only proves the heading exists, not that the demo produced it; I left it, but it is exactly the gap verify cannot see. Cold-install read (step 10): README says `open` is macOS only? It does not, the repo's `# xdg-open` Linux line is dropped by me because it is a comment; a Linux reader gets no hint. Left as-is, flagged below.
12. Budget: assets = 3 files + report.png, about 0.3 MB total (target 1.5 MB). OK.

## Every point where I had to guess (each is a skill bug)
1. Playwright path: SKILL.md says install to ~/.cache/readme-showcase; did not say selftest/scripts also honor the env var in all scripts (worked, but untested without it).
2. "Existing artifacts" vs gitignored: report.html lives in gitignored `workspace/`. Skill does not say whether a generated-but-ignored file counts as repo evidence. I assumed yes (it said "use them").
3. Rung choice: ladder says "rung 1 (+2 if clean pair)" but also "if two visuals show the same thing, delete one". Not stated whether hero + Reel together is allowed. I used both because the task wanted animation; the card and the Reel overlap in story.
4. Capture crop: no guidance on picking a selector; the default full-page crop at max-height 900 was useless. I had to read the HTML to find a selector.
5. Identical light/dark: skill says ship one, but the README snippet/alt/ledger for a single image is not shown.
6. Multi-line commands: ledger rules say commands are verbatim rows, but not how to represent a `\`-continued block. verify demanded one row per line; ledger.md never says so. Cost me a failed run.
7. `kind` choice for table rows, headings-as-claims, and the "this is an example output" sentence is unspecified; I used `fact`/`derived` and a weak quote ("What happened in the conversations?").
8. Beat text for the "step" and "out" beats: unclear what counts as a meaningful CHECK. `"checked": 4,` is verbatim but reads as noise to a newcomer; markdown asterisks `**Jordan**` show raw in the INPUT card. No rule on stripping markdown or choosing readable lines.
9. Beat `source` for HTML (`workspace/report.html:1`): single-line file, line number meaningless; not documented that tags are stripped for beats too (it worked).
10. Where the "try it" `open ...` comment line goes: structure says copy verbatim, but the ledger/verify ignore trailing `# xdg-open` comment lines; unclear whether to keep Linux alternative.
11. Step 9 "spawn a fresh subagent": I was a subagent without that option wanted; skill allows a re-read, but gives no checklist, so my adversary read is weak and unrecorded in any file. Also no output file for adversary findings in the "Output directory contents" list.
12. Optional deliverables: SKILL.md lists beats.json and verify-output.txt but my output dir also has inventory.json, check/ and COLD-RUN.md; skill does not say where to put inventory.json or the animation check files.
13. Step 8 "screenshot README as GitHub would show it" has no script/command; skipped.
14. How to render `transcribe` multi-flag command when the ledger row is unverified and optional: I collapsed it to a stub plus "see the repo README"; skill does not say a stub is acceptable.

## My judgement of the README
Strong first screen, honest limits, all commands labelled unverified. Weakness: the Reel content (raw JSON line, markdown asterisks) is the least convincing part; the captured report card is the real hero and probably should sit above the Reel.
