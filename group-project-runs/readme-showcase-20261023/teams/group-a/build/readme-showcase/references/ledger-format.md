# Claim ledger format

The ledger is `claims.json`, kept in `<repo>/.readme-showcase/` (or wherever `$OUT` points). It is the only source the README may be drafted from. `scripts/lint.mjs` opens every evidence file and checks every quote, so a receipt that does not exist fails.

## Schema

```json
{
  "repo": "name-or-path",
  "claims": [
    {
      "id": "C1",
      "kind": "command",
      "status": "PINNED",
      "text": "What this claim says, in your words",
      "value": "the exact token or phrase the README will contain",
      "evidence": [{"file": "docs/USAGE.md", "line": 12, "quote": "exact text copied from that file"}]
    }
  ],
  "could_not_verify": [{"text": "Handles gzip logs", "why": "code opens plain UTF-8 only"}],
  "first_screen": {"input_noun": "access log", "output_noun": "ranked list", "why_claim": "C1",
                   "output_producer": "code", "producer_phrase": null,
                   "quickstart_lines": [], "audience_waived": null,
                   "first_runnable_claim": null, "no_command_reason": null, "why_none_reason": null},
  "visual": {"verdict": "capture", "reason": "one sentence", "shows": ["C3"], "assets": [{"path": "assets/x-light.png", "source": "capture of out/report.html"}]}
}
```

## `first_screen` fields (all checked by `firstscreen.mjs` or `cold-reader-check.mjs`)

| field | meaning | required |
|---|---|---|
| `input_noun`, `output_noun` | words in the opener's first sentence; both occur in PINNED rows | always |
| `why_claim` | id of the `why` row whose value is in the first 40 lines | else set `why_none_reason` (15+ chars: why the repo gives no reason) |
| `output_producer` | `code`, `user`, `model` or `mixed`: who makes the output noun | always |
| `producer_phrase` | a phrase that must appear in the first 40 lines when the producer is not `code` | when not `code` |
| `quickstart_lines` | the repo's own lines from nothing to first output, in order (`git clone ...`, `cd ...`, `python3 run.py demo`, `open ...`); each is checked in order in shell fences in the first 40 lines | always; `[]` only if the repo shows none |
| `first_runnable_claim` | id of a `command` row for non-shell usage (library call) | only for non-shell first usage; otherwise `null` |
| `no_command_reason` | why the repo documents no command (15+ chars) | only when no `command` row exists |
| `audience_waived` | 15+ chars: why the README names no audience; makes the cold-reader audience check pass and is printed for the report | when you cannot pin an audience quote; else `null` |

`visual.shows`: ids of PINNED rows the image makes visible. Required when an image is on the first screen. Include the row behind the output noun and the row behind the opener's most specific promise.

## Statuses

- `PINNED`: you saw it. `evidence[]` is required; each item has `file` and (strongly) a verbatim `quote`. Evidence files resolve relative to the repo, then relative to the ledger's folder (so `captures/run1.txt` next to the ledger works for captured output).
- `UNKNOWN`: you wanted to write it and could not prove it. Give `value` as the phrase you were tempted to write. Lint FAILS if that phrase appears in the README. Also list it in `could_not_verify` with the reason.
- `UNPARSED`: lives in an area `facts.mjs` listed under `unparsed` and you did not verify it by hand. Treated like UNKNOWN for leakage.

## Kinds (what lint does with each)

| kind | `value` is | lint use |
|---|---|---|
| `command` | a full shell command, or a code line for library usage | allow-list for shell fences and inline code; first-screen runnable check |
| `flag` | `--flag` | allows a flag that facts did not parse |
| `path` | a repo path the README mentions | allow-list |
| `generated_path` | a path that exists only after running something (evidence: the code that writes it) | allow-list |
| `requirement` | `Python 3.10`, `Node 18`, `ffmpeg` | pins a version when no manifest does |
| `number` | every figure written in prose (`41 27 9`) | numbers not pinned are FAIL (measurements) or WARN |
| `badge` | a substring of the badge URL | a badge needs one; CI/registry/coverage badges also need matching facts |
| `url` | an external URL | allow-list for links and `git clone` |
| `output` | a line of captured program output | first-screen "real output visible" check |
| `why` | the phrase the opener quotes or tightly paraphrases | must share >= 60% of its content words with its quote; must appear in the first 40 lines |
| `term` | a proper noun that would trip the hype or path checks (an external project's name) | exempts that token |
| `license` | `MIT` | allow-list when no license file exists; the value must be inside the quote (quote the license heading or SPDX line) |
| `format` | the shape of an input file or line as the repo documents it (CSV column list, turn syntax, JSON path) with `"applies_to": ".csv"` (or the placeholder token) | a command with `/path/to/x.csv` needs a `format` row for `.csv`, and its value must be written in the README |
| `other` | free text | context only |

## Receipts must entail the value (lint checks tokens, you check meaning)

- `command` (shell-style): every token after the interpreter and script name must occur in the row's quotes. `python3 -m unittest discover -s tests` cannot be pinned to `unittest.main()`; quote the line that says `discover -s tests`. A definition line such as `sub.add_parser("demo")` is a valid receipt for `python3 run.py demo` because `demo` is in it.
- `flag`, `url`, `output`, `license`: the value occurs in a quote. `number`, `requirement`: every number in the value occurs in a quote. `path`, `generated_path`: the evidence file is that path, or a quote names its file name.
- `other`: add `"carrier"`, the exact words in the quote that carry the claim. Lint checks they are in the quote and share words with the claim; you check the meaning by the read-aloud step in SKILL.md.
- Evidence may cite `facts.json` (it sits next to the ledger): `{"file": "facts.json", "quote": "\"stdlib_only\": true"}`.

## Rules

1. Every command, flag, path, version, number, link, badge, license and file name you will write has a PINNED row first. If you cannot pin it, it does not go in the README.
2. A `quote` is copied, not recalled: open the file, copy the characters. Whitespace and case are ignored; words are not.
3. Soft cap: 40 PINNED rows. Over that, merge rows (one `number` row can hold several figures) or drop what the reader would not miss. Lint WARNs.
4. `could_not_verify` is the honesty section. It is not decoration: list what a reader would plausibly expect and the repo does not prove (install from a registry, platforms, performance, "production use"). The final report repeats it.
5. Never pin a claim from the repo's own README without checking the code or a real output for the same fact. README-only evidence is allowed for requirements and intent, and the row's text should say so ("per the repo README").
6. `first_screen.input_noun` and `output_noun` must be words that appear in PINNED rows. See `first-screen-gate.md`.
