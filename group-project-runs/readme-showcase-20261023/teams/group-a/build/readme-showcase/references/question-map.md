# Reader question map

A skimming developer asks these questions in this order. The README answers them in this order. Each answer is a ledger row first. Section templates below are questions, not text: never paste prose from this file.

## The questions

1. **What is it?** (input -> output, one sentence) Mandatory always.
2. **Why would I care?** The pain, in the repo's own words (docs, comments, prompts, a "why" paragraph). Mandatory if any such text exists; otherwise record `why_none_reason` in the ledger.
3. **Show me.** A captured output or a screenshot of the real thing (see `visuals.md`). Mandatory if the repo has any committed output or a documented, safely runnable command; otherwise a verdict of `none` with a reason.
4. **How do I try it in under two minutes?** The shortest documented path, with every line the repo's own README shows from nothing to first output (clone, cd, install, run, open) in order, plus what you should see and any precondition the code enforces. Mandatory if facts or docs give any command. These lines go into `first_screen.quickstart_lines`.
5. **What do I need?** Language floor, tools, platforms, services, only as the repo states them (manifest, docs, code that calls the tool). Mandatory if any exist.
6. **How do I use it on my own data?** The next step after the demo. Mandatory when the CLI has more than the demo command or the docs describe a workflow. List only the subcommands those steps use; each placeholder gets its format; each file the tool later reads gets its exact path.
7. **How does it work?** Stages, files, a method. Only if the repo documents a method; keep it to a table or short list of real file and stage names.
8. **What are the limits?** What it does not do, what it needs a human for, what is unverified. Mandatory if the repo's own docs state limits, and always include items from `could_not_verify` that a reader would otherwise assume.
9. **How do I check it works / contribute?** Test command (pinned), contribution notes only if the repo has them.
10. **License.** One line from the license file.

## Which sections are mandatory (by fact shape, not by "project type")

| facts show | include |
|---|---|
| CLI entrypoint or `package.json` scripts or bin | Q4, Q6 |
| existing HTML/PNG/SVG output (tracked or generated; say which), or a documented demo that writes one | Q3 as a capture |
| terminal output only | Q3 as a pinned output block |
| tests directory with a recognisable runner | Q9 test command (pinned) |
| license file | Q10 |
| `external_tools` or `third_party` imports | Q5 names them; a "no network" or "stdlib only" claim only if `imports` proves it |
| none of the above (library, no CLI) | Q1, Q2, usage snippet from tests or docs (pinned), Q5, Q10 |

## Fallback skim order (when you do not know what the repo is)

Do not classify the repo into a fixed type. Skim in this order and stop reading when the ledger has an answer to Q1 to Q5:

1. `facts.json` (commands, flags, outputs, requirements, unparsed)
2. the repo's own README and `docs/` headings
3. any directory named `examples`, `samples`, `prompts`, `fixtures`
4. the entrypoint file's docstring and argument help strings
5. tests (they show intended usage)
6. existing output files (check whether they are gitignored)

Hybrid repos (a library with a CLI, a CLI with a report) get the union of the rows their facts trigger. A thin repo (fewer than 3 PINNED rows) gets Q1, Q2 if available, Q10, an honest one-line status, and nothing invented.

## Section templates (as questions the heading answers)

- Opener: input noun, output noun, the repo's reason.
- Quick start: what is the single command, and what does the reader see after it?
- What you get: which real output is this and where does it live?
- Requirements: which versions and tools, exactly as sourced?
- With your own data: what are the steps, with every flag taken from facts?
- How it works: which stages exist, with which real names?
- Limits: what should a careful reader not assume?
- Tests and license.

Headings are plain nouns or short questions. Skip a section whose ledger rows are empty; do not fill it.

## Skeptic pass (manual, before the gates)

For every sentence in the draft that describes behaviour, write its ledger id in the margin of your scratch copy. A sentence with no id is deleted or gets a row. Then read the code path once for the two most important claims and confirm the sentence says what the code does (lint checks tokens, not meaning). Then, for each output noun the draft promises, find who produces it in the code (the tool, the user, a model) and make sure the first screen says so; "turns X into Y" is false if the user or a model must supply Y's content. Finally, compare the repo's own README with its code: report any contradiction (a name, a flag, a requirement that differs) in the final report instead of silently choosing one.
