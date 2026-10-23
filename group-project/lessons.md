# Group Project Lessons

One line per lesson, dated, with the run it came from. The Head Judge reads **What wins** for
the matching domain before writing the brief. Teams only ever see **Process**. Prune any lesson
a later run contradicts.

## Process (all domains)

- 2026-10-23 · coffee-loader: Teams that converge in Round 1 should prove the shared idea is theirs before Round 3, not call it "the floor".
- 2026-10-23 · coffee-loader: Check the frame that matters (the glitch moment, the 120px instance) with a real screenshot before deciding; a dial nobody tested is a guess.
- 2026-10-23 · coffee-loader: Put the provocation inside the subject, not in UI chrome bolted onto it; judges who weigh ritual and calm both punish chrome.
- 2026-10-23 · coffee-loader: When the Skeptic names the same flaw twice, ask whether the idea earns its place, not just how to shrink the flaw.
- 2026-10-23 · coffee-loader: Audit the pitch's claims against the pixels while building, not after; two judges caught a pitch describing an effect the code didn't draw.
- 2026-10-23 · coffee-loader: In a rematch, a reasoned rejection costs little, but a reason that "only half holds" is scored as a dodge. Test the alternative before refusing it.
- 2026-10-23 · coffee-loader (Host): Give every team its own test port and a private headless browser; a shared port and the shared browser pane leaked one team's build to another.
- 2026-10-23 · coffee-loader (Host): Parallel agents must write to their own files (panel-<id>.md, rounds/<N>-<id>.md); the Host merges.
- 2026-10-23 · coffee-loader (Host): Judges grade harder after writing crit notes: the same v1 builds scored 4-11 points lower in the rematch than in round 1. Compare v1 and v2 only from one paired pass; unpaired, the drift turned a +4.1 gain into a -5.2 loss.

## UI motion / loaders

### What wins

- 2026-10-23 · coffee-loader: Every frozen frame must show the subject and a progress cue, even in grayscale and blur at 120px; loaders that only work while moving lose.
- 2026-10-23 · coffee-loader: Put the motion inside the subject (a pour, a drip, crema closing) so every still frame works as a mark; a spin, fill or counter bolted onto an icon reads as generic UI.
- 2026-10-23 · coffee-loader: One element leads the motion and everything else breathes on a nested tempo; a second idea (counter, hitch, reset) splits a waiting eye.
- 2026-10-23 · coffee-loader: Anything that climbs and then resets (a fill, a counter, a near-full cup) reads as a fake finish, wherever you hide it.
- 2026-10-23 · coffee-loader: Rotation of a finished shape reads as a spinner however it is dressed; judges asked for shape that changes as it moves.
- 2026-10-23 · coffee-loader: "Transform and opacity only" isn't lean if five SVG children repaint the whole box; keep the moving part small and on its own layer.

## Personal websites / portfolios

### What wins

- 2026-10-23 · haas-site: One world that carries the whole visit (one sea from opening to ending) beats a stack of sections; judges rewarded an authored last frame that answers the first.
- 2026-10-23 · haas-site: A specific, true, retellable lesson ("53 of 75 findings needed correcting, so write the checklist first") wins the learner judges; generic "try this tonight" advice loses.
- 2026-10-23 · haas-site: Recruiters reward a one-tap plain-facts lane that states its own limits; dead-end forms (a box that goes nowhere) are docked by everyone.
- 2026-10-23 · haas-site: Re-staging a reference artwork scores as craft but loses on originality; port the physics, author new moments.

## Process (all domains), added
- 2026-10-23 · haas-site (Host): Teams read rounds/ directly instead of a merged log.md; it worked and saved Host merge steps.
- 2026-10-23 · haas-site: Every team landed on the same "noise" opener from the brief's wording; when a brief quotes the client, expect convergence on that quote and ask teams to prove their version is theirs.

## READMEs / developer docs

### What wins

- 2026-10-23 · readme-showcase: A skill that proves itself (self-test on fixture repos, planted lies the checker must catch) beat polish; the judge who re-ran every test gave it 9/10 for cold-run reproducibility.
- 2026-10-23 · readme-showcase: Every claim traceable to a file or line is the price of entry; the winner also had exact counts that a judge could check (7 subcommands, 17 flags).
- 2026-10-23 · readme-showcase: A real capture of the product's output above the fold beats a rebuilt animation of it, however faithful; the Head Judge docked a "real output" reel for not being a capture.
- 2026-10-23 · readme-showcase: Say who it's for in the first sentence; three judges docked READMEs that described the tool but never named its reader.
- 2026-10-23 · readme-showcase: Light-only screenshots and code blocks that run off the side at GitHub width cost points with every visual judge.
- 2026-10-23 · readme-showcase: Don't ship the process: "how this README was checked" footers and "not run for this page" notes read as leftovers in a README meant to publish.

## Process (all domains), added from readme-showcase

- 2026-10-23 · readme-showcase (Host): Three of five judges sealed near-identical criteria ("what's on the first screen"); read every sealed criterion and send overlaps back before the Head Judge writes the brief.
- 2026-10-23 · readme-showcase (Host): All 12 first proposals built on the same claim ledger, even with the "name the obvious ideas first" step; when the brief has a hard rule (no invented claims), expect convergence on the mechanism for it and call it table stakes in the Clash round.
- 2026-10-23 · readme-showcase (Host): Splitting the build into "Craftsperson builds the skill, Visionary uses it cold" found real bugs in all three groups (5-14 guesses each); keep it for any deliverable that is a tool.
- 2026-10-23 · readme-showcase (Host): Render each deliverable once yourself and hand every judge the same images; judges who capture their own see different frames.
- 2026-10-23 · readme-showcase: A self-test that SKIPs when a dependency is missing reads as a pass; make it exit non-zero and say INCOMPLETE.
- 2026-10-23 · readme-showcase (Host): The run took 56 min; one team's unbounded build (15 min) and revise (19 min) set the pace while the fastest team was done at 25. Timebox every agent, size plans to the build budget, and let teams run at their own pace after Decide.


## Process (all domains), added from bakery-404

- 2026-10-23 · bakery-404 (Host): The clock redesign ran a lite 3-group run in 9:50 against a 15 min target; builds came in at 3-5KB, so the Build budget can grow before the run gets slow again.
- 2026-10-23 · bakery-404 (Host): Render web pages over a local HTTP server, not file://; file:// renders printed the local path into two builds that echo the URL, and judges would have scored the leak.
- 2026-10-23 · bakery-404: Three of three groups and four of twelve members reached for an "open right now" line and pencilled paper notes; when a brief asks for "a sense of place", expect the shop-notice cliché and ask teams to prove theirs.
- 2026-10-23 · bakery-404: Judges docked every page whose echoed path broke at the real URL (/menue.html); test the dynamic text at the address judges will see, with JS on and off.

## Error pages / small web pages

### What wins

- 2026-10-23 · bakery-404: The visitor's own typo turned into the joke (baked onto a loaf) won the gut-check and ten-second-read judges; a useful week-hours table won the practical and keyboard judges. Top three were within 2.2 points.
- 2026-10-23 · bakery-404: Hours, headline and links must be static HTML; a JS-built hours table cost a team the "survives without extras" signature.
