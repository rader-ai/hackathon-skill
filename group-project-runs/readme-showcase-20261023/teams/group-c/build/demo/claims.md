| # | Claim | Source | Kind |
|---|-------|--------|------|
| 1 | Hook: a quote is tagged verified only if its normalized words appear as a substring inside one speaker turn; normalize lowercases and keeps word characters only; nothing checks speaker, length or order | run.py:140-161 | observed |
| 2 | Report tags "Quote verified" or "Needs evidence review" for each point; the quote text is shown only when valid | run.py:250-252 | observed |
| 3 | Every quote in an analysis is checked against single speaker turns; failed quote labelled Needs evidence review, text left out | run.py:144-161; run.py:250-252 | observed |
| 4 | The real report shows three points tagged Quote verified | workspace/report.html:1 | observed |
| 5 | Requires Python 3.10 or newer; core uses only the standard library | README.md:9 | copied |
| 6 | git clone https://github.com/rader-ai/sales-call-review.git | README.md:14 | copied |
| 7 | cd sales-call-review | README.md:15 | copied |
| 8 | python3 run.py demo | README.md:16 | copied |
| 9 | open workspace/report.html (macOS) | README.md:17 | copied |
| 10 | xdg-open workspace/report.html (Linux) | README.md:18 | copied |
| 11 | Demo imports a synthetic discovery call, a later unrecorded meeting and a sample analysis; writes workspace/report.html, ignored by git | README.md:21; run.py:287-295; .gitignore:2 | observed |
| 12 | python3 -m unittest discover -s tests | README.md:21 | copied |
| 13 | Transcript turn format `**Speaker Name** [mm:ss] Spoken text` | README.md:26 | copied |
| 14 | Calls without recordings stay in the timeline so gaps stay visible | README.md:3 | copied |
| 15 | Per-call outputs metrics.json and verification.json | run.py:172; run.py:176 | observed |
| 16 | init, add, report commands as in the docs | README.md:30-36 | copied |
| 17 | import-csv and review commands | README.md:39; README.md:41 | copied |
| 18 | Unknown speakers excluded from talk share; question mark count is not a measure of good discovery | README.md:41 | copied |
| 19 | Does not silently infer deal outcomes, fetch CRM data or automate model analysis | README.md:70 | copied |
| 20 | transcribe needs ffmpeg and the whisper-cli binary on PATH (code wins over docs saying whisper.cpp); does not identify speakers | run.py:270; README.md:55 | observed |
| 21 | Python commands run locally and make no model API calls; reports contain call content | README.md:74 | copied |
| 22 | License MIT | LICENSE:1 | observed |
| 23 | Counts words and question marks from the labeled transcript | run.py:102-139 | observed |
| 24 | Reader: README opens with "sales or customer calls" and says to review the report with the account owner before coaching | README.md:3; README.md:43 | copied |
| 25 | Three quoted lines are lines 3, 9 and 15 of examples/discovery.md; file is labelled Synthetic call for demonstration only | examples/discovery.md:1; examples/discovery.md:3; examples/discovery.md:9; examples/discovery.md:15 | observed |

| Image | Job |
|---|---|
| proof.png | crop of workspace/report.html at 2x showing the three quotes from examples/discovery.md lines 3, 9 and 15, each tagged verified |
