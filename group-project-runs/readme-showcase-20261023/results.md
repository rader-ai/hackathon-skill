# Results

## Standings

| # | Team | Total | Rubric | Signature bonus | j-jess-alvarez | j-keiko-hart | j-marcus-webb | j-priya-raman | j-tomas-ferreira | Spread |
|---|---|---|---|---|---|---|---|---|---|---|
| =1 | group-a | **89.5** | 78.4 | +11.1 | 70.0 | 78.5 | 82.5 | 80.5 | 80.5 | 12.5 |
| =1 | group-c | **85.9** | 75.7 | +10.2 | 72.0 | 75.5 | 75.5 | 80.0 | 75.5 | 8.0 |
| =1 | group-b | **85.2** | 75.6 | +9.6 | 80.0 | 80.0 | 76.0 | 68.0 | 74.0 | 12.0 |

**How clear is each lead?** A lead counts only if it is at least twice its standard error across judges; otherwise the teams share a place.

- group-a vs group-c: **too close to call**, 3.6 points with a standard error of 2.6 (4 of 5 judges had group-a ahead).
- group-c vs group-b: **too close to call**, 0.7 points with a standard error of 3.6 (2 of 5 judges had group-c ahead).
- Every team shares first place: pick on what each does best, not on the total.

## Criterion averages

| Team | Skill reusability | Accuracy & trust | Story & clarity | Visual craft | Pitch |
|---|---|---|---|---|---|
| group-a | 8.6 | 8.6 | 7.0 | 7.0 | 7.8 |
| group-c | 7.2 | 9.0 | 7.8 | 6.2 | 7.8 |
| group-b | 7.4 | 7.4 | 7.4 | 8.2 | 7.4 |

## Signature criteria revealed

- **j-jess-alvarez** (haiku) - *Stated-limits accuracy*: The README tells a developer what the project will not do for them, in concrete, checkable terms that match the repository.  
  Winner: **group-c** (9/10) - Names the whisper-cli binary, the case-and-punctuation substring match, the missing speaker and context checks, and no CRM access; each matches run.py lines 144-161 and 270.
- **j-keiko-hart** (sonnet) - *Every Image Earns Its Place and Reads at Size*: Each image is a real capture, legible at ~880px, captioned, and shows a distinct part of the product.  
  Winner: **group-a** (2/10) - Two real, captioned, readable crops showing different parts of the report; first is mostly a large title block and both are light-only.
- **j-marcus-webb** (sonnet) - *Cold-run reproducibility*: Could a fresh session given only the skill folder and an unseen repo execute SKILL.md deterministically, with declared dependencies, loud failures, explicit stop conditions and no author-machine paths.  
  Winner: **group-a** (9/10) - Step 0 preflight (check-env + selftest 77/77, 18/18 seeded lies) gates everything; every step has Output and Stop-if; scripts exit 2/1 with messages; no author paths; demo lint/firstscreen/assets all re-run green.
- **j-priya-raman** (opus) - *First-Screen Conversion*: Before the first scroll, does the page say what it does and for whom, show real output, show the path to a first result, and does that path actually work, by design of the SKILL.md rather than luck?  
  Winner: **group-a** (8/10) - Plain what-sentence, the exact clone/demo/open block and a real report capture all fit on the first screen, and a scripted first-screen gate makes it repeatable; but the opener drops 'sales' and never says who it is for.
- **j-tomas-ferreira** (opus) - *Claim traceability*: Every factual claim in the demo README traces to a file, function, CLI argument, test or the generated report in demo-repo, and SKILL.md forces a claim-to-source verification step rather than just asking for accuracy.  
  Winner: **group-a** (10/10) - All ~20 sampled claims check out against run.py and report.html (subcommands, CSV columns, analysis.json path, empty-workspace precondition, tag names); pitch counts (7 subcommands, 17 flags, 18 files) are exact; ledger lint re-ran 44/44 and selftest 77/77 with 18/18 seeded lies caught.

Most divisive: **group-a** (spread 12.5)

## Judge notes

### group-a
- j-jess-alvarez: loved - The first screen shows the real report header and the README states plainly that the tool measures and checks but does not run a model.; docked - The opener is a dense paragraph before the clone command, so the first ten seconds are text-heavy.
- j-keiko-hart: loved - Real report crops at full width with alt text and captions that say what you are looking at.; docked - Header crop spends a lot of space on a headline and empty stat tiles; no dark-theme handling and the first screen is text plus code before any image.
- j-marcus-webb: loved - Preflight plus decision rule for selftest failures, and a ledger-backed lint that I re-ran against the demo and it passed.; docked - Heavy 8-step, 4-gate process with a 700-line script set is a lot for an agent to follow; first demo image shows only stat tiles, and the demo is light-only.
- j-priya-raman: loved - Receipts all the way down: selftest passes 77/77 with 18/18 seeded lies caught on my machine, and the README says outright that the report's quotes come from a prepared sample and the tool runs no model.; docked - The hero crop is the report's generic header and stat cards, the least telling part of the output, and a newcomer has to infer the sales-coaching audience.
- j-tomas-ferreira: loved - It states who produces what: 'The tool measures and checks; it does not run a model', and the sample analysis is named as a prepared file, not output.; docked - Copy is correct but dry, with no reason to care beyond the opener; the second crop has a ragged right edge, and both images are light-only.

### group-c
- j-jess-alvarez: loved - The hook is concrete: three real transcript lines and a crop of the passing Quote verified result, with the limits stated right after.; docked - The How this README was checked block exposes check.log and claims.md, which is process leakage on a page meant for readers.
- j-keiko-hart: loved - The proof crop is big, sharp and captioned honestly (passing case only), paired with the exact transcript lines.; docked - Only one image for the whole page, the transcript code block clips at width, and there is no dark-theme handling or view of the rest of the report.
- j-marcus-webb: loved - Smallest dependency surface, checker passes on demo, and LEFT-OUT.md records every guess as a skill defect.; docked - Only the checker is tested, not capture.sh or inspect_repo; the rendered demo shows raw ** in the code block and a clipped line on the first screen.
- j-priya-raman: loved - It explains the non-obvious hook exactly as the code does it (case- and punctuation-insensitive substring within one turn), and it caught whisper-cli from run.py where the repo's own docs only say whisper.cpp.; docked - Two of the three transcript lines are cut off in a horizontally scrolling code block right above the hero, and a 'How this README was checked' footer is process residue a maintainer would delete.
- j-tomas-ferreira: loved - Saying 'The demo has no failing quote, so this shows only the passing case' under the screenshot.; docked - The transcript code block overflows at GitHub width, the inferred audience line is thin, a 'How this README was checked' details block leaks process into a shippable README, and the cold run was not repeated after fixes.

### group-b
- j-jess-alvarez: loved - The animated input-check-output reel shows a real quote going through the check, and the what-and-who sentence sits right under the title.; docked - The closing line saying the other commands were not run for the page undercuts the trust the rest of the page builds.
- j-keiko-hart: loved - Input-check-output reel at the very top shows the product's one trick in five seconds, with dark/light variants and a static fallback.; docked - The reel is a constructed graphic, not a raw capture, and its quote is repeated in the report card; reel frames leave a lot of empty panel space while animating.
- j-marcus-webb: loved - selftest.sh refusing to call tooling passing when browser paths were skipped; verify.mjs re-ran 101/101.; docked - Demo README ends with a process-leak line about unverified commands, and the Reel quotes raw JSON, which is the weakest proof; hidden Playwright dependency needs an install step.
- j-priya-raman: loved - The input -> check -> output Reel uses real data, ties a transcript line to its verification and the 'Quote verified' result, and ships light and dark SVGs at about 4.5 KB each.; docked - The body is mostly the repo's own README reshuffled, 'Who it fits' never names a reader, it ends on a process-leak line ('were not run for this page (unverified)'), and the demo breaks the skill's own ladder rule to put the real captured output first.
- j-tomas-ferreira: loved - The reel is data-bound: every string in the input, check and output cards exists in the repo, with its file path shown.; docked - The pitch claims a 'what-and-who sentence' the README doesn't have, the adversary read was a self-read, and selftest is INCOMPLETE without Playwright.
