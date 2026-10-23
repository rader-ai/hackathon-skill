# Group Project backlog

Drawn from five simulated users who read the README, the skill and the example runs cold
(2026-10-23). Their full write-ups are in [`feedback/`](feedback/). Each item lists who asked,
what it solves, a rough effort (S/M/L), and a note where I checked their claim against the repo.

## The personas

| Persona | Model | Would use it for | Top ask | Deal-breaker |
|---|---|---|---|---|
| [Maya](feedback/maya-founder.md), solo SaaS founder | Sonnet | Landing, pricing and onboarding variants | Cost preview and cap; judging against her buyer | Hidden cost; rankings she can't explain |
| [Dev](feedback/dev-agency.md), agency design director | Sonnet | Identity routes, campaign concepts, pitch microsites | Locked brand brief; client-ready pitch board | Three routes that are one idea; scores shown to a client |
| [Priscilla](feedback/priscilla-platform.md), staff engineer / AI-tooling lead | Sonnet | Architecture spikes in real repos | Worktree per group; hard spend cap; test evidence for judges | No isolation in her repo; sub-noise rankings |
| [Jordan](feedback/jordan-marketing.md), marketing manager, non-technical | Haiku | Taglines, email sequences, landing copy | Paste-ready copy in a doc; brand voice set once | Code or images when they asked for words; jargon |
| [Sam](feedback/sam-student.md), student and game-jammer | Haiku | Jam concepts, class toys, picking side projects | Spend preview; live debate view; a fast jam mode | Unknown spend on a Pro plan; a run that can't stop cleanly |

**What all five agree on:** they won't start a run without knowing what it costs, and they don't
trust a ranking where first and last are 2 points apart.

## Now: cheap, and every persona benefits

| # | Item | Asked by | Effort | What it is |
|---|---|---|---|---|
| 1 | **Cost preview and hard cap** ✅ | Maya, Sam, Priscilla | M | Before Setup, show agent count by model and an estimated token use per mode, from measured runs (lite: 45 agents, ~19M input mostly cached, ~0.1M output). Accept a cap on agent calls; the Host stops cleanly at it. Report actuals in the reveal. *Note: about 95k tokens of each agent's input is fixed start-up context, so agent count drives cost.* |
| 2 | **Tie and confidence flag** ✅ | Maya, Priscilla, Sam | S | `tally.py` marks teams as tied when the gap between them is smaller than judge spread, and the reveal says "tie: pick B for X, C for Y" instead of a winner. |
| 3 | **One-page digest** | Maya, Jordan, Dev, Sam | M | A single `summary.html` (or `.md`) with every build side by side, a plain "pick this if…" line each, what to graft from the others, and no jargon. The detailed scores move below it. |
| 4 | **Docs cleanup** ✅ | Sam, Jordan, Priscilla | S | README says 4 groups by default but every example and time estimate uses 3; "groups" vs "teams" in different files; add a short glossary (spread, signature, lite/standard); say what lands on disk and that nothing touches your working tree. |
| 5 | **Tiny / jam mode** | Maya, Sam | S | 2 groups, 3 judges (no Opus), no rematch, ~5 min, ~25 agents. A try-before-you-trust mode. |
| 6 | **Divergence gate** ✅ | Dev (and every run's lessons) | S | After Round 1, one agent clusters all proposals by core mechanism and sends back any group whose direction duplicates another's. Every run so far has converged (cup-with-drop, claim ledger, "open now"); today the skill only warns about it. |

## Next: opens new kinds of users

| # | Item | Asked by | Effort | What it is |
|---|---|---|---|---|
| 7 | **Brand / voice lock** | Dev, Jordan | M | A `brand.md` plus asset folder (logo SVG, palette, fonts, tone words, banned words, competitors) that every agent reads and the Skeptic checks against. Reusable across runs. |
| 8 | **Audience judges** | Maya, Dev | M | Intake asks who the work is for; one or two judges are built from that buyer or client and say "would I choose this", alongside the expert panel. |
| 9 | **Words-first output (copy pack)** | Jordan, Maya | M | A medium for copy work: deliverable is text (taglines, emails, landing copy) exported as a doc you can paste, with each option's rationale. |
| 10 | **Fact provenance check** | Jordan, Maya | M | Flag every factual claim in a build that isn't in the brief, so the user can accept or delete it. *Note: Jordan said the bakery hours were invented; they were in the brief, which shows the need is really for visible sourcing.* |
| 11 | **Evidence stage** | Priscilla | M | For tools and code, the Host runs declared tests, lint or benchmarks and hands judges the results as facts. Generalises the "use it cold" review that found real bugs in the README run. |
| 12 | **Worktree per group** | Priscilla, Maya | M | In a real repo, each group builds in its own `git worktree` from a recorded base commit; the winner comes back as a branch. |
| 13 | **Client-ready pitch board** | Dev, Jordan | M | Per-route one-page board (name, hook, hero, rationale, risk) with no scores or judge personas, exportable to PDF. |
| 14 | **Live progress view** | Sam, Jordan | M | A page (or one plain status line per phase) that shows rounds as they land, so a 10-minute wait isn't a black box. Doubles as the "watch them argue" feature. |
| 15 | **Domain packs** | Priscilla, Dev, Maya, Sam | M each | Rubric presets and judge casts for engineering (correctness, reversibility, pitch ≤5%), identity/campaign, B2B pages, game jams. Start with engineering and copy. |

## Later

| # | Item | Asked by | Effort | What it is |
|---|---|---|---|---|
| 16 | Graft step | Maya | M | After the reveal, one agent merges the winner with named features from the runners-up. |
| 17 | Judge variance | Priscilla | M | Re-score each judge a few times (cheap on Sonnet/Haiku) and report a confidence interval. Pairs with item 2. |
| 18 | Run manifest and headless mode | Priscilla | S–M | `run.yaml` with models, skill commit and brief hash; a no-questions entry for CI or scheduled runs. |
| 19 | Clean stop and resume | Sam, Priscilla | S–M | Document and support what a stopped run leaves on disk, and resume from the last finished phase. |
| 20 | Pick your cast | Sam | S | Editable temperaments and a Wildcard toggle without touching the skill files. |
| 21 | Build in the user's stack | Maya | L | Constraint to build as components in the user's framework and tokens. |
| 22 | Enforced isolation | Priscilla | L | Hooks or sandboxing so agents physically can't read sealed files or other groups' folders, plus an access audit. |
| 23 | Calibration set | Priscilla | L | Known-good and known-bad builds the panel must rank correctly before a run counts. |
| 24 | Replay page | Sam | S | Shareable page that plays the debate next to each build. |

## Parked

- **Hosted / no-terminal version** (Jordan). Out of scope for a Claude Code skill; revisit if it ships elsewhere.
- **"macOS-only tooling"** (Priscilla). `capture.mjs` tries the macOS Chrome path first but falls back to Playwright's own Chromium, so it should run on Linux; worth one CI check rather than a rewrite.

## First release: done

Items 1, 2, 4 and 6 are built (marked ✅):
- **Cost preview and cap**: SKILL.md shows calls by model, time and measured tokens before Setup; a cap (estimate + 25%) with a fixed cut order; actuals in the reveal; a clean-stop rule.
- **Tie flag**: `tally.py` compares each judge's own totals for neighbouring teams and calls a lead clear only at twice its standard error; otherwise teams share a place. Re-run on the three example runs: both lite runs are three-way ties, and the coffee loader's winner keeps a clear lead.
- **Docs cleanup**: default group count, a glossary, real cost numbers, and what a run writes where.
- **Divergence check**: a Host-side agent alongside Round 2a hands each crowded idea to one team.

Not yet proven in a live run: the divergence check and the cap. The next run should test both.

## Suggested first release (original note)

Items 1, 2, 4 and 6: cost preview and cap, tie flag, docs cleanup, divergence gate. All small or
medium, they answer the one deal-breaker every persona shared, and the divergence gate fixes the
weakness every run so far has shown.
