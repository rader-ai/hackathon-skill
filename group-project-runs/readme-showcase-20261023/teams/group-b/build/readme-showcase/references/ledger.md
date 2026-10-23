# The claims ledger (`claims.json`)

Rule: **no row, no sentence.** Every factual sentence, command, number and on-screen string in the README
(and in `beats.json`) must be backed by a row. Write the ledger BEFORE the README, then compose the
README from the rows' `text`.

## Schema

```json
{
  "captures": { "report": "path/in/repo/report.html", "run-output": "out:captures/run.txt" },
  "claims": [
    {
      "id": "c-what",
      "text": "The sentence or command exactly as it will appear in the README",
      "kind": "fact",
      "source": "README.md:3",
      "quote": "The literal characters in the source that support the text",
      "status": "verified"
    }
  ]
}
```

| Field | Rule |
| --- | --- |
| `id` | unique string; beats cite it |
| `text` | what the README will say. Commands and numbers are copied verbatim, never reformatted |
| `kind` | `fact`, `command`, `number`, `quote`, `limit`, `derived`, `badge`, `license` |
| `source` | `path:LINE`, `path:LINE-LINE` (relative to the repo root), or `capture:<id>` (declared under `captures`; a plain path is relative to the repo, `out:` is relative to the output directory) |
| `quote` | a literal, contiguous substring of the cited lines (whitespace is normalised; for `.html` captures, tags are stripped). `verify.mjs` fails if it is not there |
| `status` | `verified` = you saw the source (for prose: the source says it; for a command: you ran it and saw it work). `artifact` = you did not run it, but an output it produced exists (add `"evidence": "<capture id>"`, a declared capture such as the generated report); the README needs no disclaimer. `unverified` = documented but no run and no output; the README says "unverified" ONCE, in a footnote line, not beside every command |

## `kind` and `source` cheat sheet

| What you are writing | kind | source | quote |
| --- | --- | --- | --- |
| A sentence copied or narrowly summarised from the repo's docs | `fact` | the doc line | the exact words that support it |
| A shell/code line | `command` (one row per physical line) | the line in the repo's doc | the full line |
| A table row | `fact`, one row per README table row | the row's line | the row text |
| A heading you invented ("Who it fits") | none needed: headings are not claims. The sentence under it is |  |  |
| "This is an example output" | `derived`, from the capture row | `capture:<id>` | a string that proves the capture is what you say (the page title is weak; a result the page prints is better) |
| A computed count | `derived` | primary source | the numbers it comes from |
| An HTML or JSON line used in a Reel beat | `fact` or `quote` | `path:LINE` (a single-line HTML file is always `:1`; tags are stripped before matching) | the raw text, markdown and all |

## Rules

0. **Commands.** (a) One row per physical line. A command that continues with a trailing backslash is several rows (`python3 run.py add \`, then `--account ... \`, then the last line); `verify` fails a README code line that is not in a row and says so. (b) Copy trailing comments too: `open workspace/report.html   # macOS`. (c) Copy comment lines that give the other OS's command (`# xdg-open ...  # Linux`) as their own rows and keep them in the README block; `verify` warns when the repo's block has one you dropped. (d) Do not replace a multi-flag command with "see the repo README"; include it whole, or omit the topic.

1. **Copy, never paraphrase, for anything checkable**: commands, flags, file names, versions, numbers, dates, quoted output. Prose that summarises (`kind: fact`) must still be a fair, narrow reading of its `quote`.
2. **One claim, one idea.** "Fast and private" is two rows, and "fast" needs a measurement in the repo or it does not ship.
3. **`derived`** is for a statement you computed from other rows (for example a count): put the arithmetic in `text` and cite the primary source; list the parent ids in an extra `from` array.
4. **Absence claims** ("no network calls", "no database") are the riskiest. Cite the repo's own statement of it (README, docs). If the repo never says it, do not say it.
5. **Numbers:** every digit run in README prose must appear in some row's `text` or `quote` (the script enforces this). No percentages, speed-ups, user counts, star counts or "trusted by" unless a row proves them.
6. **Badges** exist only for things that exist: a `badge` row whose `text` is the badge URL and whose source proves the thing (a workflow file, a published package manifest, a license file). Otherwise none.
7. **Commands you could not run** are `artifact` if an output of that command exists in a capture (for example `python3 run.py demo` and the `workspace/report.html` it writes), else `unverified`. Put one footnote line near the end ("Commands marked with a dagger were not run for this page") or say it only in your report to the user; do not scatter disclaimers through the body. Never imply a command works because it looks standard.
8. **Existing artifacts count as evidence.** A report or log the repo ships or generated earlier may be cited with `capture:<id>`; say in the README that it is an example output, and whether the data is synthetic if the repo says so.

## What the script cannot check

`verify.mjs` proves the quote exists at the cited place and that README text is covered by the ledger.
It cannot prove the quote *means* what the sentence says. That is the adversary read in SKILL.md step 9.
