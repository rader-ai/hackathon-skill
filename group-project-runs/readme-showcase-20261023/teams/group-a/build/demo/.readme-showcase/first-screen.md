# Call Review Lab

Call Review Lab turns speaker labeled call transcripts into an account timeline, measured talk statistics and a report in which each coaching point is tagged Quote verified or Needs evidence review. Calls without recordings stay in the timeline so gaps remain visible.

```bash
git clone https://github.com/rader-ai/sales-call-review.git
cd sales-call-review
python3 run.py demo
open workspace/report.html           # macOS
```

The demo imports a synthetic discovery call, a later unrecorded meeting, and a sample analysis, then generates `workspace/report.html` (use `xdg-open` on Linux). The summary and quotes in that report come from a prepared sample, `examples/sample-analysis.json`. The tool measures and checks; it does not run a model. The Python commands run locally and make no model API calls.

<img alt="Report header for Harbor Tools, a synthetic account: Accounts 1, Timeline calls 2, Transcripts 1, Analyzed 1, Unverified quotes 0" src="assets/report-1-light.png" width="880">

The header of the report `python3 run.py demo` generates: two calls on the timeline but one transcript. The unrecorded follow-up appears further down the page as Transcript absent. Harbor Tools is demo data. The repo ignores `workspace/` in git, so you get this file by running the demo.

<img alt="The same report further down: internal talk share 53%, question marks 4 / 0, longest internal run 21 words, two points each tagged Quote verified with the quoted words" src="assets/report-2-light.png" width="880">

Measured numbers, then the sample analysis. A quote is shown only when it matches a single speaker turn; otherwise the point is tagged Needs evidence review.

## Requirements

Python 3.10 or newer. The core workflow uses only the standard library. `demo` stops with an error if `workspace/` already holds calls.

## With your own calls

```bash
python3 run.py init
python3 run.py import-csv /path/to/calls.csv
python3 run.py report
```

The CSV columns are `account,id,date,title,internal,external,transcript,recorded,source`. Transcript paths are relative to the CSV; omit one to keep an unrecorded call in the timeline. Each transcript is Markdown turns: `**Speaker Name** [mm:ss] Spoken text`.

The report shows coaching points only if you supply an analysis. The repo provides an analyst prompt, [prompts/analyze_call.md](prompts/analyze_call.md); you run it with a model yourself and save the JSON as `workspace/accounts/<account>/calls/<id>/analysis.json` before `python3 run.py report`. The method is in [docs/METHOD.md](docs/METHOD.md).

## Limits

- Numbers count words and question marks, not speaking time or question quality. A question mark count is not a measure of good discovery.
