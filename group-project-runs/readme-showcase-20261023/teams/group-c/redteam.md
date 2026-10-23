# Red team - Priya (Skeptic), round 5

Method: read SKILL.md and references, ran `test_checker.py` (29 tests, OK), ran `check_readme.py` against three deliberately bad READMEs, ran `inspect_repo.py` on demo-repo (read-only), rendered the demo README via `gh api markdown` and captured it (`redteam-shots/build-demo-1.00s.png`), and checked each demo claim against demo-repo.

Overall: honest and cold-runnable. The demo's factual claims all trace (19 ledger rows check out; Python 3.10, commands, file names, MIT, "no model API calls", the verify logic at run.py:144-161 and the tag logic at 211-250 all match). What costs points is not lies. It is a first screen that does not say who this is for, a start step a stranger cannot run, a proof image that is small and light-only, and defects Ines already found that are still in the skill.

## Ranked issues

### 1. Known skill bugs still live (skill, `skill` 25 pts; Marcus)
COLD-RUN.md lists 12 guesses; nothing in SKILL.md changed. I reproduced #1: copying the header from SKILL.md step 3 (`| # | Claim | Source (file:line) | Kind |`) makes the checker FAIL with `ledger-kind ... got "Kind"` and exit 1. A cold agent hits this on its first run. Marcus will read COLD-RUN.md as an admission.
Fix (skill, 10 min): make the checker skip any table header row (the row whose first cell is `#` or whose Kind cell is `Kind`), and make SKILL.md step 3 use the same header as ledger.md. Also fix #2 (`| tee` hides the exit code: use `set -o pipefail` or `; echo exit=$?` before tee), #7 (SKILL.md step 4 says "image N: job" lines, ledger.md says a table; pick the table), #11 (list `check.log` in Outputs), #12 (say scratch files go in `OUT/.scratch/` and get deleted). Then put "Resolved in round 5" next to each line of COLD-RUN.md, or the file becomes a liability.

### 2. First screen never says who it is for or that it is a sales tool (demo, `story` 20; Priya, Jess)
The one-liner is "Turns call transcripts into an account timeline and a coaching report, and shows a quote as verified only if it appears in a single speaker turn." The words "sales" and "rep" appear nowhere above the fold; the repo is `sales-call-review`. The second half of the sentence is jargon-dense ("single speaker turn") before the reader knows what a call review is. The "who is it for?" question, which the skill's own five-second test requires, is not answered.
Fix (demo + skill): lead with "For sales managers and enablement teams who review recorded calls:" or similar, only if the repo says so (METHOD.md and the analyst prompt are about sales coaching; cite them). Then the hook. Add to story.md: "the one-liner must name the reader, from the repo's own words; if the repo names none, say so in LEFT-OUT.md".

### 3. Try it cannot be run by a stranger (demo and skill, `truth` 20, `story`; Jess)
Try it starts with `python3 run.py demo`. The original README had `git clone https://github.com/rader-ai/sales-call-review.git` and `cd`; the demo dropped it "to stay at 3 commands" (LEFT-OUT.md). A visitor landing on the page has no checkout. Jess: "died on the first install step." The rubric says "get it working", and the clone URL is verifiable (original README.md).
Fix (demo): put the clone and cd back (two lines, copied). Fix (skill): in step 6 and story.md, the command budget counts the commands to run the project, never the commands to get the code; add an explicit rule "include the get-the-code step if the repo's README has one; where the README gives OS variants, keep both (macOS `open`, Linux `xdg-open`) as the repo does" (closes COLD-RUN #9). Dropping `xdg-open` and unittest from first screen is fine; dropping clone is not.

### 4. Proof image: small, light-only, and the left half is a composed box (demo + skill, `visuals` 20; Keiko, Tomás)
Looking at the render: the image is 830 px displayed at about 830 of 922 content px, so it renders 1:1, but the "Quote verified" pill is about 9 px type and the output pane is mostly white space with two bullets. It has no transparent or dark-aware treatment; on GitHub dark it is a white slab with a thin border (the skill's own answer, visuals.md line 14, is only a border). The left panel is a fabricated window: real text from examples/discovery.md, but it shows the raw `**Maya**` markdown in a monospace box that the project never renders; visuals.md rule 2 itself says "never draw a fake window" and then the proof-pair recipe does exactly that. Tomás will ask "which file displays this?" The honest answer is nobody. It also shows only the happy path: no rejected quote, so the hook ("only if") is not demonstrated, only asserted.
Fix (skill): in visuals.md, either (a) forbid composed pairs and prefer a single crop of the real report, with the transcript lines as a fenced code block in the README (this renders in both themes and is honest by construction), or (b) keep the pair but require a caption naming both sources ("left: examples/discovery.md lines 3, 15; right: workspace/report.html") in the README, not only the ledger. Fix (demo): crop at `--scale 2` the real report card larger (bigger pill and quote), and put the two transcript lines in a code block above it. Add a line to the README: "Synthetic data from examples/." Option: show the one failing-quote case by quoting METHOD.md only if the repo has output for it; the demo output has none (LEFT-OUT admits it), so say so rather than imply.

### 5. Hook wording over-promises relative to the code (demo, `truth`; Tomás)
`verify()` normalizes case and punctuation and checks `quote in turn` as a substring (run.py:130-148). It does not check the speaker attribution, minimum length, or order. A one-word quote ("the") would pass. "Shows a quote as verified only if it appears in a single speaker turn" is literally true, but a reader hears "quotes are guaranteed accurate". Tomás checks sentence against code and may mark "verified" as marketing.
Fix (demo): "A quote is tagged 'Quote verified' only if its words (ignoring case and punctuation) appear inside one speaker turn of the transcript." Add to ledger.md a row type for "guarantee strength": every "only if / never / always" sentence must state what the code does not check.

### 6. The checker has a hole where invented prose lives (skill, `truth`, `skill`; Marcus, Tomás)
I fed it "It validates every transcript and encrypts reports with AES-256." Only the number `256` produced a WARN. "validates", "encrypts" and "every" went through. The checker catches hype words, badges, commands, flags, versions and numbers, but not behavioral verbs. SKILL.md admits behaviour claims are by-reading only, which is honest, but the pitch of a "mechanical checker" will be tested on exactly this.
Fix (skill, 20 min): add a WARN for sentences in prose (outside code and the first-line ledger rows) containing absolute or capability verbs (`validates, verifies, encrypts, guarantees, every, never, always, automatically, detects, secures`) that are not substring-matched by a ledger Claim cell. Also: the ledger Source check only tests that the line number is in range (the error text shows this); it does not test that the cited line contains any word from the claim. Add a cheap overlap check (one shared token of 4+ letters between the claim text and the cited lines, else WARN). Tell the truth in the pitch about the remaining limit.

### 7. Demo links look broken when rendered from build/demo (demo, `truth`; Tomás)
`run.py`, `LICENSE`, `docs/METHOD.md`, `prompts/analyze_call.md`, `examples/*` are links relative to the repo root, so they 404 from `build/demo/`. They are correct for the intended placement and the checker verified them against the repo, but a judge clicking in the render sees dead links.
Fix (build README, one line): "README links resolve when this file replaces the repo's README.md at the root; the checker verified them against demo-repo." Do not copy repo files into demo.

### 8. Build folder clutter and an unfinished-looking demo folder (demo; Marcus, Priya)
`demo/` ships README, assets, claims.md, LEFT-OUT.md, check.log and COLD-RUN.md. Good for traceability, but the brief says README + assets. Fine to keep, but COLD-RUN.md reads like open bugs (see 1). Also `check.log` is one line; the README does not link to it. Fix: after fixing item 1, add an optional collapsed "How this README was checked" `<details>` (the skill already allows it) so the evidence is visible in the render. Keep it collapsed so the first screen stays clean.

### 9. Smaller things
- The "Use it with your own calls" block shows `add` with 7 flags before the reader knows if they have transcripts in the right format; the turn format is in the In/Out section above, good, but there is no sample of the 2-line transcript format in text. Fix: one fenced block with the two real lines from examples/discovery.md (also solves item 4).
- Limits copy "Transcription needs ffmpeg and whisper.cpp" but run.py requires a `whisper-cli` binary on PATH (run.py transcribe). README.md (original) says whisper.cpp, so it traces to docs, but a stranger's whisper.cpp install may not name the binary `whisper-cli`. Fix: "(the `whisper-cli` binary from whisper.cpp must be on PATH, run.py:transcribe)". Add a ledger rule: when docs and code differ in detail, the code wins.
- SKILL.md says an image budget of 1.5 MB (stricter than the 6 MB brief) - fine, but cite why (page weight), otherwise it reads arbitrary.
- No one-line trigger negatives test: the description says "Do not use for API reference docs, changelogs"; fine.

## Hidden signature guesses (from public bios) and whether the work survives

- Priya Raman (DevRel, README clinic): "value obvious in one screen, real output shown not described." Partial. Real output is shown, but audience is missing (2) and the get-started step is missing (3). Likely loses it unless 2, 3 fixed.
- Tomas Ferreira (tech writer, checks every sentence): likely "every sentence traceable to a file:line." The ledger (19 rows with file:line) is the strongest asset in the whole build and survives, but the over-strong hook wording (5), the whisper-cli mismatch (9), and the checker's range-only source test (6) are the places he will poke. Survives with a bruise.
- Keiko Hart (designer): "product-in-action, legible, hierarchy." The crop is real product output, which she values, but the composed left box and small type will be criticized (4), and the light-only PNG on dark theme. Partial.
- Marcus Webb (agent tooling): "fails loudly, a cold run has no guesses." Scripts do fail loudly with exit codes 0/1/2 and the 29 tests pass, a real plus. But 12 documented guesses with the first one still reproducible (1) is the direct opposite of his signature. This is the cheapest points on the table.
- Jess Alvarez (skimming dev): "exact command to try with real output." Command present, but no clone, and the output is a picture of a report crop rather than the console output of `python3 run.py demo`. If the repo documents that output (it does not; the Host run output is only the report), keep as is. Survives if clone is restored.

Possible other signatures worth a thought: "the skill says when NOT to produce an image" (survives: rung 3 and the no-visual path), "the README says what it does not do" (survives: Limits copied from repo), "no AI-sounding prose" (survives: banned-words enforced mechanically).

## Fix order if there is time for four things
1. Items 1 + 6 header bug and pipefail (skill, 15 min, protects `skill` 25).
2. Item 3 restore clone and fix rule (demo + skill).
3. Item 2 name the reader in the one-liner (demo + story.md).
4. Item 4 and 5: bigger crop at scale 2 or code block plus caption; precise wording of "verified".
