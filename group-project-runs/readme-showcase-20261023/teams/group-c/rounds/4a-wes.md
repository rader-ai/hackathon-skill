## Round 4a - Wes (Craftsperson)

READY. Built `build/readme-showcase/`: `SKILL.md` (62 lines, generic, steps 0-8 each with a stop condition), `references/{story,ledger,visuals}.md` + `banned-words.txt`, `scripts/{inspect_repo.py,check_readme.py,capture.sh,test_checker.py}`. Python stdlib + bash only; no Node.

**Tests** (`python3 -I scripts/test_checker.py` from the skill folder): `Ran 29 tests ... OK`. One test per FAIL rule (fake script, `./` path, missing image/link, no alt, hype word, backticked path, badge, byte budget, 3 images, missing ledger image job, bad/inferred/out-of-range ledger rows, exit 2), plus inspect (good, bad path, empty) and capture (missing input, missing tools hint, real capture and crop). Hand run: a README with a hype word, empty alt, missing image, `python3 fake.py go` and a 2 MB asset exits 1 with 6 FAILs; the clean fixture exits 0. `inspect_repo.py demo-repo` returned sensible JSON; `/nonexist` exits 2. `capture.sh` shot `report.html` (1000x1847, 69 KB) and fails with its install hint when Chrome is absent.

**Deviations:** (1) A missing path is a WARN, not FAIL, when a ledger-cited file mentions it (generated outputs like `out/report.html`). (2) Path-like arguments after flags only WARN; script operands FAIL. (3) Added an `image-job` FAIL (every image needs a ledger job line) and `--allow-badges`. (4) Bare names like `whisper.cpp` are not treated as paths.

Note for Ines: dynamic argparse flags will show as WARN; confirm by reading code, add ledger rows.
