# LEFT-OUT

## Cut from the old README and why
- "Turn a pile of sales or customer calls..." intro paragraph and the "fresh implementation of a private workflow" paragraph: replaced by one sentence naming the reader, input and output.
- The 8-row "What the method does" table, Credits (ACE, SPICED, BANT) and the private-workflow history: METHOD.md is linked instead.
- Steps 1-3 and 5 of "Use it with your own calls" (permissions, CSV column list, analyst-prompt workflow): condensed; CSV columns not repeated (see examples/calls.csv).
- "Created by Chris Rader": not included.
- Restored this round: `git clone` / `cd` and the Linux `xdg-open` line, as the repo's README has them.

## Dropped as unverifiable
- Nothing planned was dropped for lack of a source. The demo output has no failing quote, so the "Needs evidence review" state was read from run.py:250-252, not observed in output; the README caption says so.
- Image is light-only (the report ships one theme); framed with a thin border, not faked in dark.

## Hand-checked (the remaining WARN lines)
- none. Behaviour sentences were hand-checked by reading run.py:140-161 (normalize and verify: lowercase, word characters, substring in one turn, non-empty quote; no speaker, length or order check) and run.py:250-252 (tag and quote text shown only when valid). Python 3.10 is copied from README.md:9; run.py has no version check. The whisper-cli name comes from run.py:270; the repo's docs say only "whisper.cpp".
- Reader ("people who review sales or customer calls") comes from README.md:3 and :43; the repo names no narrower audience.

## Steps where I had to guess (skill defects)
None in the round 6 run; the round 4b guesses are in COLD-RUN.md with their fixes.
