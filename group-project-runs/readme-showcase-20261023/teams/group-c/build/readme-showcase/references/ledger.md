# The claim ledger (`claims.md`)

A table of every statement in the README that a reader could check. It exists so you cannot write a claim you did not read.

## Format
```
| # | Claim | Source | Kind |
|---|-------|--------|------|
| 1 | Hook: records with no source are skipped, never guessed | src/report.py:88-95 | observed |
| 2 | Run it with `python3 main.py demo` | docs/usage.md:12 | copied |
| 3 | Requires Python 3.10+ | pyproject.toml:6 | copied |

| Image | Job |
|---|---|
| proof.png | shows the input beside the output it produced, so the hook is visible at a glance |
```
- Source is `path/relative/to/repo:LINE` or `:START-END`; several sources separated by `;`.
- Kind: `observed` = you read it in code or in a real output file. `copied` = quoted from the repo's own docs (and you checked it is still true in code). `inferred` = you guessed; the checker rejects these rows, so use it only as a reminder to delete the claim.
- Every image gets a row naming the file and its job in at least 3 words. The checker fails on an image with no job line.
- Cap near 25 rows. If you need more, the README is trying to say too much.

## What counts as evidence
| Claim type | Evidence |
|---|---|
| Command | The line in the repo's docs or the entry-point code that defines it. |
| Path / file name | The file exists; the checker also tests this. |
| Version / requirement | A manifest, CI file, or doc line. |
| What it outputs | A real output file in the repo, or code that writes it (cite both if you can). |
| Behaviour ("checks X", "never sends Y") | Read the code that does it and cite the lines. This is the part scripts cannot verify, so quote the lines in your report. If you cannot find them, drop the claim. |
| Number | Where it appears in the repo or output. A number you computed gets the files you counted in the claim text. |

## Awkward sources
- One-line or minified file (a built HTML report): `file:1`.
- License: `LICENSE:1`, kind `observed`.
- A screenshot or crop: cite the artifact it was cropped from (`workspace/report.html:1`) and name the file in the claim.
- Absence ("has no version check"): cite the function or file range where the check would live and write "no X in" in the claim; kind `observed`.
- A claim resting only on the repo's own README prose: cite the README line (`copied`) and also the code line if one exists. Prefer both.
- Several sources: separate with `;`.

## What the checker does and does not do with the ledger
It checks: file exists, line in range, kind valid, and (WARN `ledger-overlap`) that the cited lines share a 4+ letter word with the claim. It cannot check that the lines mean what you say. That is your job: reread each cited line against its claim before step 7. It also WARNs (`unverified-behaviour`) when README prose has a guarantee word no ledger claim contains.

## How to verify a behaviour claim by reading code
1. Search the repo for the function or message the behaviour would need (grep a keyword from the claim).
2. Read that function and the code that calls it. Confirm it runs on the default path, not only behind a flag.
3. Cite the lines. If it depends on a flag or a manual step, say so in the README.
4. Look for a test that exercises it; cite that too.

## Worked mini-example (generic)
Repo: a CLI `csvfix` that rewrites dates in CSV files.
- README candidate: "Fixes dates in any CSV." Check the code: it only handles `YYYY/MM/DD` and `DD-MM-YYYY` (parser.py:30-41). Ledger row: "Converts YYYY/MM/DD and DD-MM-YYYY to ISO 8601 | parser.py:30-41 | observed". The README says exactly that.
- Candidate: "Fast." No source: dropped, listed in LEFT-OUT.md.
- Candidate command `csvfix --in a.csv`: found in docs/usage.md:5 as `csvfix fix a.csv`. Use the docs form; the `--in` form is dropped.
