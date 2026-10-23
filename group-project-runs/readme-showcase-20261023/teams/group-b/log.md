## Round 1 - Leo (Visionary)

Okay, moodboard time. Picture the first screen of the Vercel launch page, except the thing moving is *your own data*. That's the pitch: the README hero is a looping SVG "Reel" that replays the project's real input -> real output. For Call Review Lab: the actual transcript line, the analyst's quote locking onto it, "checked 4, failed 0", the January 19 call as a hollow node because it was never recorded, then the five stat cards landing. That is the repo's whole personality (evidence-checked, gaps stay visible) as a four-beat story instead of an adjective.

Honesty is the engine, not the brake: every sentence and every on-screen string goes in a claim ledger with a source file, and a script fails loudly when a string isn't found in the repo. Ama, that is also our proof line for the pitch.

Ladder for what to show: real captured artifact, then reel from real I/O, then library call/value, then, yes, *nothing at all* when the repo earns nothing. Felix, you get reduced-motion final frames, a byte budget enforced by script, and my promise to justify every moving part.

Riskiest bit: SVG-in-img animation rendering in both themes. Sol, I want you on that early. Tell me where I'm going to overreach.

## Round 1 - Ama (Producer)

Okay team, here is the thing: a README is a funnel and ours leaks at the top. I'm calling mine **The Ten-Second Proof**. Not a banner. Banners are what everyone else ships. The skill hunts for the one moment in the repo where real input becomes real output and puts that on screen before the first scroll, with the command that reproduces it right underneath.

For the demo that's a transcript line getting its "Quote verified" tag, then the actual report below it. Real quote, real tag, straight from the repo's own output. I want a hero that stops the scroll and a "Try it" block that is literally copy-paste.

Underneath, the part Tomás will like: a claim ledger. Every sentence in the README maps to a file, a line or an output, and a script fails loudly if any pointer is dead. No row, no sentence. It's how we keep maximalist visuals and still pass a teardown.

I'll be honest about my weak spot: I obsess over the first ten seconds and forget the person who actually installs it. So Felix, Sol, I need you to attack the install path and the SVG weight. Leo, bring the motion ideas; Sol, tell me what GitHub will really render.

Three visuals, tiered, 1.5 MB target. Let's go big, but sourced.

## Round 1 - Felix (Skeptic)

Right, here's my pitch, and I'll tell you now: it's the unsexy one.

Our three obvious ideas are banner-plus-badges, the animated terminal GIF, and template filler. We will all drift toward the GIF because we're Maximalists. Resist it. A typed-command GIF is 2 MB of "trust me" and it shows a shell, not the product.

My idea: the skill makes every sentence pay a receipt and every image pay a byte price. Claim ledger: each README line maps to a file:line or captured output. Visual budget: each image answers one reader question and has a KB cost. A verifier script fails loudly if a claim doesn't resolve, a banned hype word slips in, or the assets bust the budget. For the demo, the hero is a real cropped screenshot of report.html, with the "Quote verified" tags, plus one flow SVG with real filenames. Two assets, about 300 KB.

I'll concede this: I'll underdeliver on wow. So Leo, Sol, please design the one bold hero and the one motion moment that explains a sequence, and I'll hold it to a frozen-frame, light/dark, under-150KB standard. Motion that explains is welcome. Motion that decorates, I will personally delete.

## Round 1 - Sol (Craftsperson)

Okay, confession first: I could not resist. My proposal is "show the transform." The hero of the README is an animated SVG that replays the project's real input becoming its real output. For the demo, that's an actual transcript line, the actual metrics.json numbers, then the actual quote getting stamped "Quote verified." Nothing is a mockup. The skill builds it from files it has read, and every string on screen is a row in a claims ledger that a verify script re-checks before anything is written.

So it's a screenshot-plus-GIF idea, but data-bound, with a still-frame fallback, dark mode, and reduced-motion handling. And if the repo has no clean input/output pair, the skill stops and ships a text-only README. A decorative animation is a failure, not a feature.

Leo, I think you'll like the strip. Felix, I'm giving you a hard 150 KB cap per SVG and a static PNG fallback, so please hold me to it. Ama, I need you to own the install, usage and limits sections. My blind spot is real: I will spend three days on an easing curve and write "Install" in four minutes. Please don't let me.

The risky bit is GitHub's SVG rendering. I want to test it through the real markdown render early, not at the end.

## Round 2a - Leo (Visionary)

Settled: we are the Maximalists. The ledger is table stakes, so it can't be our pitch. The launch is. Felix's two-asset, 300 KB README is a good README, and the other groups will ship it. I won't sign off on it as our hero.

**Winner: Sol's data-bound strip, generalized into my Reel, inside Ama's ten-second frame.** Here is what the 25 reusability points need. The Reel must not be a transcript-to-quote animation. It is a renderer (`scripts/reel.mjs`) that reads `beats.json`. Each beat has a type (input, step, output, gap, tally) and a source pointer, and the renderer lays them out. Call Review Lab gets a transcript line, a quote lock, "checked 4, failed 0", a hollow Jan 19 node, and the stat cards. A CLI gets a command, its flags and its output. A library gets a call and a value. No source pointer means no beat.

**Steal:**
- Felix's decision table and byte budget. I'm cutting my 6 MB cap to 1.5 MB, with 150 KB per SVG.
- Felix's frozen-final-frame rule.
- Ama's try-it block and stop conditions.
- Sol's early test through GitHub's real markdown render.

**Weak spots:**
- Ama: three tiers, but nothing moves, and "1.5 MB" has no enforcer.
- Felix: "zero images" reads as virtue. Ours must say "no visual earned" and then pay with typography instead.
- Sol: "stop and ship text-only" gives up too early. Rung four should be a typographic launch, not a retreat.
- Me: the Reel could become the footnote I animate. Rule: one Reel, and the other visuals must be real captures.

**Refused:** banners, badge walls, a generic gradient.

The showpiece is the Reel plus a real crop of `report.html`, with the budget script enforcing the whole thing.

## Round 2a - Ama (Producer)

Settled: we are the Maximalists. The ledger is table stakes, so it can't be our edge. The edge is that our README is a launch and the launch is proven. Felix, a 300 KB two-asset page is the leanest entry in a room where everyone has your verifier. I'm not building it.

**Winner: Leo's Reel on Sol's rails, with my first screen.** A short looping hero (real input, quote check, real output), then the exact command, in the first scroll. Felix owns the guardrails: 150 KB cap, a frozen final frame that stands alone, and light and dark variants.

**Weak spots, by name:**
- Leo: the four beats (Jan 19 hollow node, five stat cards) are hand-composed for this repo. A judge running our skill on a different repo gets nothing. A 14-second loop is also too long.
- Sol: beat (c), the struck-through unsupported quote, may not exist in the demo data. His own plan says to only animate what the repo has. That needs checking first.
- Felix: his ledger concession is correct. A script proves a source exists, not that it supports the claim. We need a re-read pass.
- Mine: I forget the installer. Sol and Felix, check my install and limits sections.

**Can't be built well:** a "transform strip for any repo" that searches freely. It will produce decorative animation. We can build three fixed templates (artifact capture, CLI stdout to output, library call to value) and a ladder that ends in "no visual".

**Reusability proof:** the generator takes ledger rows plus a template and nothing from the demo. Before the deadline we run it on a second, tiny fixture repo, and the result goes in the pitch. That is how we win the 25 points.

**Steal:** Felix's receipts and byte price, Sol's `<picture>` pair and PNG fallback.

## Round 2a - Felix (Skeptic)

Settled: we are the Maximalists. My lean README is a timid README, and the rubric pays 20 points for visuals. I concede my hero crop and my "no GIF" stance. A real, data-bound strip earns its place when it explains a sequence.

**Winner: Sol's strip on Leo's ladder, with Ama's try-it block under it.**

Fatal flaws, everyone's:
- **Leo's Reel:** four hand-choreographed beats (the hollow Jan 19 node, the sliding quote) are bespoke to this repo. On a library or a Makefile project, a fresh session improvises, and that fails the skill criterion.
- **Ama's Ten-Second Proof:** it ships a strip and a screenshot of the same thing. Two heroes, one idea. Her `<details>` "N claims sourced" footer is ledger theatre.
- **Sol's strip (the room's favourite):** "a deliberately unsupported quote, if the demo data has one" is a hedge that can turn into invention. And a strip needs a real pair; without one the skill is a decorator.
- **My own:** a citation is not proof. A script checks that a source exists, not that it supports the sentence. The ledger is table stakes now, so it can't be our edge.

**Reusability, which is the 25 points:** the strip must be rendered by a bundled script from a pair file (before text, after text, source refs), not hand-drawn. The ladder then degrades: real capture, strip, code block, nothing. I'd add two things: a fresh-subagent adversary read that tries to disprove each claim against its source, and a cold run on a tiny second fixture repo (a library, no UI). If that run produces a sane text-only README, we've shown the skill isn't about this repo.

**I keep:** the 150 KB cap, the frozen-final-frame rule, light/dark, loud failure.
**I steal:** Leo's ladder, Ama's try-it, Sol's stop condition.

## Round 2a - Sol (Craftsperson)

We are the Maximalists. Felix's proposal is the most honest, and it is the one I would not ship as our README. His own score says visuals 6. Keep his discipline, lose his timidity.

The ledger is table stakes, so the edge is a hero that explains and still passes an audit. My vote is Leo's Reel, with my frozen-frame and 150 KB rules, Felix's budget and ladder, and Ama's cold-install read-through. Mine is Leo's idea with less drift, so I fold it into his.

What I'm stealing, and what I'm fixing:
- **Felix:** the visual ladder, including "zero images" as a legal answer, and string-level checks on commands, filenames and numbers. I'm not copying "one static SVG only".
- **Ama:** the cold-install walkthrough. I also concede one fact: GitHub's theme toggle is not the OS setting, so my in-SVG prefers-color-scheme is wrong. It ships as a light/dark `<picture>` pair.
- **Leo:** a 14-second, four-beat reel hand-drawn per repo is not reusable. Another agent running this cold would draw a different one every time, or botch the easing.

The reusable part is a generator: `build_reel.mjs` takes `beats.json` and renders it. Beats come from a fixed vocabulary of in, step, out and gap, and each carries a ledger id. Cap it at 3 beats and 8 seconds. Easing and layout live in the template, so the model never hand-writes SVG. Add a fixture repo, so a stranger can test the scripts before the real run.

Weakest claims: Ama's `claims.tsv` is Python and the rest of the tooling is Node, so pick Node. Leo's "verbatim or ellipsis" needs the verifier to enforce it.

I'll own the template, the verifier's string matching, and the install and limits sections. I will not let my easing curve eat them.

## Round 3 - Ama (Producer)

Decision: we ship Leo's Reel on Sol's rails, with my first screen. The skill finds the repo's one real input-to-output moment and renders it with a bundled script (`reel.mjs`, three beats, 8 seconds, 150 KB, light/dark pair plus a frozen-frame PNG) above a copy-paste try-it block. Nothing gets written unless it is a verified ledger row.

The ledger is table stakes, so here is what is ours. The Reel is rendered from `beats.json`, never hand-drawn, so it holds up on repos we never saw. The visual ladder ends in a typographic launch when nothing earns an image. And honesty has two layers: a script checks sources and strings, then a fresh adversary subagent tries to disprove each claim. We also run the skill cold on a tiny library fixture and put that result in the pitch.

Rejected: Felix's two-asset lean README (honest, but timid on story and visuals), Leo's bespoke four-beat choreography (fails on unseen repos), Sol's free-form SVG per repo. Felix still thinks motion decorates; he agreed on the caps. Sol builds and tests the skill first, then Leo produces the demo by following SKILL.md cold. Full spec is in plan.md.

## Round 4a - Sol (Craftsperson)

**Built** `build/readme-showcase/`: `SKILL.md` (99 lines: inputs/outputs, declared deps, 11-step workflow, STOP conditions, exit-code table, limits); `references/` (ladder, ledger, beats, readme-structure incl. install/limits checklist); `scripts/` (inventory, reel, capture, verify, selftest.sh, lib/pw.mjs); `fixtures/tiny-lib` (4-file library) plus `fixtures/tiny-lib-out` (README, ledger, beats, no-pair beats).

**Tests** (`rounds/4a-sol-selftest.txt`): `bash scripts/selftest.sh` = 27 passed, 0 failed with Playwright (set `READMESHOWCASE_PLAYWRIGHT_DIR=~/.cache/group-project`); 25 passed plus 2 loud SKIPs without it. Covered: inventory exit 2 (missing, file, empty); reel renders both SVGs (2.5 KB), exits 3 on no pair and writes nothing, rejects >3 beats, >8 s, missing source, overlong text; verify exits 0 on the clean fixture and 1 on dead source, altered number, hype word, false quote, missing Limits, dead image, invented badge, edited SVG text, unlabelled unverified command. Also ran inventory and capture on the demo repo (read-only). Reel looked at in both themes (animation frames and PNG). `gh api markdown` keeps the `<picture>` block.

**Not verified:** SVG animation inside `<img>` on real github.com (API render only). No demo-specific text in SKILL.md or scripts (grepped).

**Deviations from plan.md:** verify also fails on a missing Limits heading and edited Reel SVG text; the `<picture>` uses a light `<source>` plus PNG `<img>`; the Playwright search path is `~/.cache/readme-showcase`, or the env var above.

## Round 4b - Leo (Visionary)

Cold run of readme-showcase on demo-repo went through end to end: selftest 27/0, inventory, rung 1 capture plus a 3-beat Reel, ledger, README, verify (87 checks, 0 failed after one fix), gh render ok, animation frames at 0.5/3/6 s correct in light and dark. Assets about 0.3 MB. Full log: build/demo/COLD-RUN.md.

Top guesses (skill bugs):
1. Multi-line `\` commands: verify wants one ledger row per line; ledger.md never says so (cost a failed verify).
2. Capture crop: no guidance on choosing a `--selector`; default crop showed only stat cards.
3. Beat text selection: verbatim lines like `"checked": 4,` and `**Jordan**` render as noise; no rule for readable beats or stripping markdown.
4. Hero plus Reel together vs "delete one if they show the same thing" is ambiguous.
5. Is a generated, gitignored file (workspace/report.html) valid evidence? Unstated.
6. Adversary step has no checklist or output file; step 8's README screenshot has no command.

## Round 5 - Felix (Skeptic)

I counted. The assets are 290 KB, SVGs are 4 KB each, no scripts, and the reel respects reduced motion. I'll give the Maximalists that: it is the lightest heavy README I have audited.

Now the bill. The hero is the weakest proof we have. It opens with literal `**Jordan**` asterisks, then a card that says `"checked": 4,`, then an output that is just a badge. Tomas will trace that chain and find that no single transcript line produced a "4". The real evidence, the report card, is below the fold, and the one-sentence what-it-is sits under 380 px of animation. Jess scrolls; Priya docks us.

The README also hedges with "unverified" three times when the Host did run the demo, and `open` fails on Linux because the comment line got dropped. Meanwhile pitch.md does not exist. Fifteen points, zero words.

On the skill: selftest goes green with a SKIP on capture, build/README.md gives no install path, and COLD-RUN lists 14 guesses, several still unfixed. Marcus will find them in ten minutes.

Verdict: the machinery (ledger plus verify) is real and honest; the front door is not yet. Fix pitch, the hero beat text, and the sentence order. Full list in redteam.md.

## Round 6 - Sol (Craftsperson)

Red team: (1) pitch deferred. (2) Reel: markdown now rejected by reel.mjs/verify; beats are one thread (input quote -> `"ok": true` for that quote -> `Quote verified` + same quote); alt is a sentence (verify fails raw alts). (3) Sentence now under H1 (verify warns otherwise). (4) New ledger status `artifact`; one footnote, no body disclaimers. (5) Structure rewritten; demo follows it, adds Who it fits. (6) Linux `xdg-open` restored; verify warns on dropped comment lines. (7) capture `--frame` bakes border/matte; 4 / 0 explained. (8) selftest prints INCOMPLETE and exits 3 on any skip (`--allow-skip`); install-deps.sh. (9) ledger/ladder/beats rules, `capture --list`, render-readme.sh, adversary.md. (10) scratch moved to demo/proof/. (11) build/README install steps. (12) full transcribe command kept.

Cold-run guesses 1-14: 1 lookup order documented, selftest tests bad env var; 2 gitignored artifacts count; 3 hero+Reel rule; 4 `--list`; 5 single-image snippet; 6 backslash rows; 7 kind cheat sheet; 8 CHECK rules; 9 single-line HTML = :1; 10 comment rows; 11 adversary.md; 12 proof/; 13 render-readme.sh; 14 no stubs.

Results: selftest 36 passed, COMPLETE (with Playwright); without it INCOMPLETE, exit 3. verify: 101 passed, 0 failed, 0 warnings. GitHub frames (light/dark, 1s/5s) read. Not done: fresh-subagent adversary read.

## Round 7 - Leo (Visionary)

Wrote pitch.md (under 400 words) from the Round 6 build: 36/36 selftest COMPLETE, verify 101 passed 0 failed, assets about 328 KB, hero sentence under the H1, one-thread Reel. I cut every motion boast the build does not back; the Reel is a small part of the pitch, honesty leads. Risk named plainly: verify proves existence not support, the fresh-subagent adversary read was not done, Playwright is a 150 MB dependency, and only two fixtures have been run.

## Round 7 - Ama (Producer)
Checked against build/ (verify-output, selftest-output, demo README, assets, SKILL.md, verify.mjs, adversary.md). Kept Leo's hook and voice.
Cut or softened:
- "Framed screenshot": unconfirmed for this asset, now "a screenshot".
- "Catches a dead source" and "false quote, altered number": not what verify.mjs names; reworded to the checks it actually has (number not in ledger, hype word, unbacked badge, hand-edited Reel).
- "Ledger has 101 checks": verify's 101 are checks, not ledger rows; reworded.
- "Proves": now "checks" for quotes.
- Adversary read clarified as a self-read.
Added: a two-line "Adopt it" close for the pitch criterion.

