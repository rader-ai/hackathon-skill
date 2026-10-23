## Round 6 - Sol (Craftsperson)

Red team: (1) pitch deferred. (2) Reel: markdown now rejected by reel.mjs/verify; beats are one thread (input quote -> `"ok": true` for that quote -> `Quote verified` + same quote); alt is a sentence (verify fails raw alts). (3) Sentence now under H1 (verify warns otherwise). (4) New ledger status `artifact`; one footnote, no body disclaimers. (5) Structure rewritten; demo follows it, adds Who it fits. (6) Linux `xdg-open` restored; verify warns on dropped comment lines. (7) capture `--frame` bakes border/matte; 4 / 0 explained. (8) selftest prints INCOMPLETE and exits 3 on any skip (`--allow-skip`); install-deps.sh. (9) ledger/ladder/beats rules, `capture --list`, render-readme.sh, adversary.md. (10) scratch moved to demo/proof/. (11) build/README install steps. (12) full transcribe command kept.

Cold-run guesses 1-14: 1 lookup order documented, selftest tests bad env var; 2 gitignored artifacts count; 3 hero+Reel rule; 4 `--list`; 5 single-image snippet; 6 backslash rows; 7 kind cheat sheet; 8 CHECK rules; 9 single-line HTML = :1; 10 comment rows; 11 adversary.md; 12 proof/; 13 render-readme.sh; 14 no stubs.

Results: selftest 36 passed, COMPLETE (with Playwright); without it INCOMPLETE, exit 3. verify: 101 passed, 0 failed, 0 warnings. GitHub frames (light/dark, 1s/5s) read. Not done: fresh-subagent adversary read.
