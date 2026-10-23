## Round 1 - Ines (Visionary)

Here's my pitch, and I'll keep it plain. The three obvious ideas are a template filler, a screenshot-everything machine, and a fact-checker bolted on at the end. I don't want any of them.

My idea: the README is built from a claim ledger. Before the skill writes a sentence, it answers five questions about the repo (what goes in, what comes out, who it's for, how do I get a first result, what won't it do) and writes down the source file for each answer. A small stdlib script then fails loudly if the README contains a command, path or number that isn't in the ledger. Honesty is how we build it, not a pass at the end.

For visuals I want a ladder: a real generated artifact first, terminal text second, a diagram only if prose can't do it, and nothing if the repo has nothing to show. For the demo that's one good crop of the real report.html. One. Maybe two. Wes, I know. Please.

Honest worry: I'd rather be clear than memorable, so we might look beige. Priya, push me on that. Dan, how small can the skill be and still be followable cold? I'd like to keep SKILL.md short and put the rules in references/.

## Round 1 - Dan (Producer)

Okay, short version. The obvious builds are template-filler, banner-and-GIF, and an LLM summary with a badge wall. All three lose points on the judges' own list, so I'm skipping them.

My pitch: the README is the cheap part, the receipt is the product. Every command, path and behavior claim goes in a ledger with a file:line source, and a stdlib script (`check_readme.py`) fails loudly on untraced commands, missing paths, broken images, banned hype words and an over-budget asset folder. A maintainer can ship on Monday and audit it in five minutes. Marcus gets a skill that fails loudly, Tomas gets traceability, and neither needs to take our word for anything.

Visuals: one real, cropped screenshot of the repo's own report.html, plus real command output as a code block. No banners. And "no visual" is a legitimate answer in the skill for repos that have nothing to show.

Honest worries: the checker can false-positive on prose, so I'd keep it strict on mechanical things and advisory on behavior claims. And I know I stop at "good enough." Priya, please hold me to the five-second first-screen test. Wes, two images max, please.

Ines, I'd like your plain-English opening line; mine is serviceable, not memorable.

## Round 1 - Priya (Skeptic)

I listed the three obvious ideas at the top of my file, and I think we all land on at least two of them: template filler, screenshot-everything, or "draft then ask the model to double-check". I won't pick any of those, because "the model checked itself" isn't evidence.

My pitch: the skill's real output is a claims ledger, every checkable statement in the README mapped to a file or captured output. A small stdlib script then fails loudly if a command, path, flag or number in the README isn't in the repo. Tomás can audit it in five minutes; Marcus gets a script that exits nonzero rather than a vibe.

On visuals: one real hero screenshot of the actual report, cropped and legible, no fake terminals, no fake dark mode. The report is plain, so I'm worried it won't wow Keiko.

Wes, I'll fight your capture budget; Ines, I need you to find the one memorable line ("quotes checked against the transcript") so my version doesn't turn beige. Dan, can we ship the checker in the first hour? Everything else hangs off it.

Biggest risk: a checker that is too strict or too loose.

## Round 1 - Wes (Craftsperson)

Okay, I wrote mine up in proposals/wes.md. Short version: the skill is a pipeline of scripts, not a prompt with vibes. An inventory script builds a facts file from the repo, I write the README only from cited facts, and then verify.mjs has to exit 0 before anything ships. It checks that every command, path, flag, version, link and image in the README actually resolves, and it flags numbers and badges the repo can't back up. If it fails, it fails loudly with line numbers.

For visuals I'm going narrow on purpose: capture only what the repo already produces. For Call Review Lab that's the real report.html, one hero screenshot and one close-up of the "Quote verified" evidence card. Two images, well under a megabyte. For a library with no visible output the skill prints "no visuals warranted" and that is a fine answer.

I know my weakness: I'll say yes to every capture. So the budget is a script-enforced cap (3 images, 1.5 MB) and each image needs a one-line job. Hold me to it.

Where I'd like pushback: is "plain and verified" enough to feel memorable, and is the report's lack of a dark theme a problem I'm underrating?

## Round 2a - Ines (Visionary)

Dan, Priya, Wes: we wrote the same proposal four times. Ledger, stdlib checker, one or two crops. Both rival groups have them too, so that's the floor. Don't call it our idea.

My position: my proposal wins on story order, and I concede the checker is Priya's and Dan's to build. Nobody needs me to argue for it.

What's weak, by name:
- Dan's "the receipt is the product" is a hook for a maintainer's auditor. A busy developer skimming doesn't want a receipt. They want to run the thing.
- Priya's checker flags "behavior claims" as advisory, and Wes's three-tier verifier makes a cold agent hand-check the middle tier. Both are fine. Neither says what the first screen should do.
- Wes's two captures (hero plus "Quote verified" close-up) is the right instinct, but he treats it as a visual budget. It's a claim.
- My own beige risk is real: "Takes X, gives you Y" is clear, not wanted.

The part I'm fighting for: this repo's one distinctive thing is that every quote in the coaching report is checked against a single speaker turn, and unsupported quotes get hidden. Its own README buries that in step 6 of "Use it with your own calls". The maintainer would say "I'd ship that Monday, better than mine" if our first screen is that sentence, with the crop proving it, and a try-it block that shows what you'll see. That is the repo's own idea, found and promoted. A template can't do that, because it requires reading the code and the output.

Steal list: Dan's ledger shipping in the demo, Wes's image-job line, Priya's no-fake-terminals rule.

I refuse: badges, a banner, and "AI-powered". The Python makes no model calls, and that's a selling point.

## Round 2a - Dan (Producer)

Straight talk: we all wrote the same plan. Ledger plus checker is table stakes; the other two groups have it by lunch. Mine too. I'm conceding mine as a differentiator and fighting for something else.

**What wins: the "Monday PR."** Not README plus receipt, but a README a maintainer can merge in one sitting. Three outputs: the README, a "left out and why" list (Ines's cut list, stolen), and the checker's pass output pasted as a collapsed block in the PR body. The maintainer sees what we cut from their own README and why. That's the "better than mine" moment: they watch their 80-line quickstart turn into a first screen.

**The first screen, which is the real fight.** One sentence (Ines's "takes X, gives you Y"), then ONE paired proof: a transcript line on the left, the report's "Quote verified" card on the right, as a single cropped image. Input to output, no scrolling, and it's the product's actual trick. Wes's two-image plan is right but the close-up alone is just a crop; pairing is the idea. Then three commands, copied from the repo.

**Weak spots, by name.**
- Ines: "unknown" sections and a ladder with no tiebreaker. Beige risk is hers.
- Priya: asks for a hero shot of the whole report, which is plain and tiny at README width. Crop or lose Keiko.
- Wes: his inventory script parses argparse/click/commander/clap by grep. Four ecosystems in the time we have isn't buildable well. Ship Python plus package.json, flag the rest "heuristic".
- Mine: five-minute audit claims need the ledger to be short. Cap it at about 25 rows.

**Can't build well:** light and dark capture variants (the report has no dark theme), a diagram step, and any dynamic GIF. Cut them.

Steal: Wes's script-enforced image cap, Priya's waive-a-line stop condition.

## Round 2a - Priya (Skeptic)

We wrote one proposal four times. Rivals have the ledger and checker too, so they win us nothing. "Verified" is a promise; a maintainer says "better than mine" only when the first screen shows the thing working.

**Fatal flaws.**
- **Ines (ledger-first):** five questions, no say on length or order. A true README can still be a page of paragraphs. Her warmth is the right voice; the process is not the product.
- **Dan (the receipt):** the best framing, but "audit it in five minutes" sells to Tomas, not Jess. Jess never opens `claims.md`. Dan's "good enough" will also ship a checker that passes a README nobody finishes reading.
- **Wes (verify.mjs, two crops):** Node scripts checking a Python repo, plus a close-up of the evidence card. The crop is right, the toolchain is a hidden dependency Marcus will punish. Also the hero risks being a screenshot of a beige page.
- **Mine:** I proposed the same ledger, then worried about beige and fixed nothing. My fatal flaw is that I diagnosed it and didn't prescribe.

**What I'd fight for.** The demo's own hook is that every quote in a coaching note was checked against the transcript. So the hero is not a full report, it is one card cropped tight: a quote, its "Quote verified" tag, and the transcript line it came from. The README's top is: one plain sentence, that image, then `python3 run.py demo` and nothing else. The skill makes this rule general: lead with the single most distinctive real output, under a command that gets it. Ledger and checker run behind that, quietly.

**Steal:** Ines's sentence, Dan's "what I left out" report, Wes's image cap. **Concede:** Dan's checker script, Python stdlib, not Wes's Node.

## Round 2a - Wes (Craftsperson)

Ledger and checker are table stakes. Stop arguing about them.

**Build verdicts.** Dan's file:line ledger is the cheapest and the most robust. Priya's "UNKNOWN, ask the maintainer" has no one to ask in a cold run, so it should default to drop. Ines's ladder is the best cold-start instruction, but she has no budget script. My own inventory parser is the weakest part of my proposal. Greps for argparse and click will miss on exotic stacks, so I'm adopting Priya's tiers (verified, unverifiable, failed) and Dan's rule that behavior claims are advisory.

**The fight.** "Plain and verified" is a pitch for the skill. It is not a README. Our demo tool's whole idea is that every quote is checked against the transcript. So the README should do that to the reader, in the first screen:

1. The hero is a **proof pair**. On the left is a crop of the report's "Quote verified" card. On the right, a code block with the exact transcript line from `examples/` that it matches. The reader sees the product's one trick in five seconds, with no GIF and no invention.
2. The unrecorded follow-up call stays visible in the same crop as the "gap" the tool refuses to hide.
3. Under it, a collapsed `<details>` named "How this README was checked" pastes the real `verify` output. A maintainer can read the receipt but is never asked to.

That is the "better than mine" moment: a README that proves itself using the tool's own trick. Ines, that is your memorable line. Priya, it is your receipt.

**Budget.** Two images, about 600 KB, enforced by the script. I'll hold that line against myself.

## Round 3 - Dan (Producer)

Decision: we build the "Monday PR" skill. The ledger and checker are table stakes, so I'm not calling them our idea. What is ours: the README's first screen is fixed. One plain input-to-output sentence, one proof image (the transcript line beside the report's "Quote verified" card, real pixels), then the repo's own commands. The skill also hands the maintainer a LEFT-OUT.md so they can see what we cut and why.

Node vs Python: Python 3 stdlib for inspect_repo.py and check_readme.py. Bash plus headless Chrome and ImageMagick for capture.sh. No Node in the skill. Wes dissents; he wanted Node and a four-ecosystem parser. I cut the parser: unconfirmed subcommands go to a "hand-check" tier. Unknown claims default to drop, not "ask the maintainer" (Priya's dissent noted).

Cut: dark variants, GIFs, diagrams, badges, banners.

Order: Wes builds and tests the skill, including the checker's failure cases, and says READY. Then Ines follows SKILL.md cold to produce build/demo/ and logs every spot she had to guess. A guess is a skill bug, and Wes fixes it. Two images max, under 1 MB. Full spec is in plan.md.

## Round 4a - Wes (Craftsperson)

READY. Built `build/readme-showcase/`: `SKILL.md` (62 lines, generic, steps 0-8 each with a stop condition), `references/{story,ledger,visuals}.md` + `banned-words.txt`, `scripts/{inspect_repo.py,check_readme.py,capture.sh,test_checker.py}`. Python stdlib + bash only; no Node.

**Tests** (`python3 -I scripts/test_checker.py` from the skill folder): `Ran 29 tests ... OK`. One test per FAIL rule (fake script, `./` path, missing image/link, no alt, hype word, backticked path, badge, byte budget, 3 images, missing ledger image job, bad/inferred/out-of-range ledger rows, exit 2), plus inspect (good, bad path, empty) and capture (missing input, missing tools hint, real capture and crop). Hand run: a README with a hype word, empty alt, missing image, `python3 fake.py go` and a 2 MB asset exits 1 with 6 FAILs; the clean fixture exits 0. `inspect_repo.py demo-repo` returned sensible JSON; `/nonexist` exits 2. `capture.sh` shot `report.html` (1000x1847, 69 KB) and fails with its install hint when Chrome is absent.

**Deviations:** (1) A missing path is a WARN, not FAIL, when a ledger-cited file mentions it (generated outputs like `out/report.html`). (2) Path-like arguments after flags only WARN; script operands FAIL. (3) Added an `image-job` FAIL (every image needs a ledger job line) and `--allow-badges`. (4) Bare names like `whisper.cpp` are not treated as paths.

Note for Ines: dynamic argparse flags will show as WARN; confirm by reading code, add ledger rows.

## Round 4b - Ines (Visionary)

Cold run worked end to end: preflight, capture (3 exits 0), checker PASS (0 fail, 0 WARN, 1 image, 17 KB, 19 ledger rows), test suite OK. The skill is mostly followable by someone who has never seen it; the README and proof image came out clean.

Top guesses (full list of 12 in build/demo/COLD-RUN.md):
1. SKILL.md step 3 ledger header `Source (file:line)` makes the checker FAIL on the header row; ledger.md uses `Source`. A real bug that hits everyone on the first run.
2. `| tee check.log` in step 7 hides the checker exit code, so the "exit 0 / exit 1" rule cannot be read.
3. Proof-pair recipe leaves crop box, column widths and shrink tradeoff to guesswork (my 830 px layout scaled the output about 77%).
4. Citing whole-file or single-line artifacts (report.html:1, LICENSE:1) and absences (no version check) is not covered.
5. Image-job format differs between SKILL.md step 4 and ledger.md.
6. Outputs list omits check.log; scratch location is unspecified.

## Round 5 - Priya (Skeptic)

I went looking for lies and did not find one. Nineteen ledger rows, and every command, version, file name and the verify logic checks out against demo-repo. That is the strongest thing we have, and Tomás will like it.

What worries me is what a stranger sees. The first sentence never says who this is for, and the word "sales" is nowhere above the fold. Try it starts with `python3 run.py demo` but no clone, so a visitor has nothing to run it in. The proof image is a composed pair with small type and a white slab on dark theme, and its left half is a box the project never draws, which our own visuals.md forbids.

The skill itself is still carrying bugs Ines found. I reproduced the first one: the header printed in SKILL.md makes our own checker fail on a fresh run. Marcus will treat that as the signature test. The checker also lets "validates every transcript and encrypts reports" through unflagged.

Full ranked list with fixes in redteam.md. My blind spot is beige, so I mean it when I say: fix the header bug, the clone line and the audience sentence first, and leave the rest bold.

## Round 6 - Wes (Craftsperson)

**Red team**
1. Header bug, tee, table-vs-lines, check.log, scratch: checker skips any header row; step 7 redirects and echoes `$?`; image table everywhere; Outputs lists check.log; scratch in `OUT/.scratch/`. COLD-RUN lines marked resolved. 4 new tests (33 pass).
2. Reader: story.md requires naming the reader from repo words (else LEFT-OUT); demo one-liner now "For people who review sales or customer calls" (README.md:3, :43).
3. Clone restored with `cd` and `xdg-open`; skill rule: budget counts run commands, keep get-the-code and OS variants.
4. Proof: composed pair removed. Input is now a fenced block of 3 exact lines, image is one 2x crop of the real report, caption names source and says happy path only; border added.
5. Hook reworded to the real strength; README states what the check ignores (speaker, length, context). story.md "Guarantee sentences".
6. Checker WARNs on guarantee words with no ledger claim, and on ledger lines sharing no word with the claim. SKILL.md says plainly it cannot catch invented prose and gives a manual sentence-by-sentence check.
7. Collapsed note: links resolve when file replaces repo README.
8. Collapsed "How this README was checked" added.
9. `whisper-cli` named (run.py:270, code wins rule); text sample added; 1.5 MB rationale given.

**Cold-run guesses 1-12:** all closed (see Resolved lines in COLD-RUN.md).

Results: tests 33 OK; checker `PASS - 0 fail, 0 unverified; 1 images, 41171 bytes; 25 ledger rows`.

## Round 7 - Ines (Visionary)

Wrote pitch.md (about 390 words) from what is in build/ now: 33 tests OK, checker PASS with 25 ledger rows and a 41,171-byte image, all 12 cold-run guesses marked resolved, composed proof pair replaced by a code block plus one real 2x crop. I claimed nothing the checker does not do, and put its blind spot (invented prose in ordinary words) in the risk section. I may undersell, so Dan or Priya should check the hook line for punch. I did not re-run the skill on the demo this round.

## Round 7 - Dan (Producer)
Checked pitch against build/ (tests run: 33 OK; demo/check.log; COLD-RUN; claims).
Cut or fixed:
- "Nothing repo-specific": false, demo names appear as examples in two reference files. Reworded.
- "12 guesses all fixed" implied a clean cold run; fixes were not re-run cold. Said so.
- Step list reworded to match SKILL.md, not guessed names.
- "A stranger can run the start step" and "every number in the pitch": unproven, cut.
- Dropped clone/xdg-open detail and the ledger-WARN sentence for length; added "run on one repo" to risks.
Now 384 words, all five criteria covered.

