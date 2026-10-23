## Round 4b - Leo (Visionary)

Cold run of readme-showcase on demo-repo went through end to end: selftest 27/0, inventory, rung 1 capture plus a 3-beat Reel, ledger, README, verify (87 checks, 0 failed after one fix), gh render ok, animation frames at 0.5/3/6 s correct in light and dark. Assets about 0.3 MB. Full log: build/demo/COLD-RUN.md.

Top guesses (skill bugs):
1. Multi-line `\` commands: verify wants one ledger row per line; ledger.md never says so (cost a failed verify).
2. Capture crop: no guidance on choosing a `--selector`; default crop showed only stat cards.
3. Beat text selection: verbatim lines like `"checked": 4,` and `**Jordan**` render as noise; no rule for readable beats or stripping markdown.
4. Hero plus Reel together vs "delete one if they show the same thing" is ambiguous.
5. Is a generated, gitignored file (workspace/report.html) valid evidence? Unstated.
6. Adversary step has no checklist or output file; step 8's README screenshot has no command.
