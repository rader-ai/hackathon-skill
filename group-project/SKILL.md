---
name: group-project
description: Run a "group project" hackathon on an idea - 3 to 5 competing teams of Sonnet subagents (each with a visionary, a producer, a skeptic and a craftsperson who argue with each other) build their own variation of the idea plus a pitch, then a mixed Opus/Sonnet/Haiku judging panel with domain expertise scores them on a public rubric plus a secret signature criterion each. Use when the user says "group project", "hackathon", "have teams compete on", "I want variations of", "let a few teams take a crack at", or wants several divergent takes on a motion graphic, design language, video concept, brand, product idea, UI, or any creative or strategic experiment, judged and ranked.
---

# Group Project

Turn one idea into 3-5 genuinely different, finished variations. Each variation comes from a
team of subagents with clashing personalities who have to argue their way to a build and a pitch.
A panel of expert judges sets the goals up front, then scores every team - and each judge keeps
one criterion to themselves until the reveal.

You (the main session) are the **Host**. You never design anything yourself. You cast the
judges and teams, run the rounds, keep the files straight, enforce the rules, keep the clock,
and present the results.

## The clock

A `lite` run with 3 teams finishes in **about 15 minutes**; `standard` with 4 teams in about 25;
a rematch adds about 10. In one early run with no limits, a single team's build and revision
took 35 minutes while the other teams sat finished, and the whole run took 56. With these rules a
timed `lite` run of 3 teams finished in 9 min 50 s, every phase ahead of its deadline:

1. **Every agent has a budget** (the TIMEBOX block in [references/prompts.md](references/prompts.md)).
   It reads the clock when it starts, checks before each new task, and when the budget is spent it
   stops, ships what works, and says what's unfinished.
2. **Plans fit the budget.** The Producer's plan must be buildable in the build budget. A plan that
   needs more is cut, not stretched.
3. **No waiting between teams.** After Decide, each team runs its own pipeline: start a team's next
   step in the same message where its previous step's result arrives. Only judging waits for all teams.
4. **The clock wins.** Write each phase's deadline to `clock.md` at the start. If an agent is 50%
   over budget, look at its files; at 100% over, stop it (`TaskStop`) and carry on with what's on
   disk - judges score what exists.
5. **Stay off the critical path.** Agents read each other's `rounds/` files directly; the Host never
   merges logs. Keep status updates to one line.

| Phase | Who | `lite` | `standard` |
|---|---|---|---|
| Setup | Host writes brief + charters while one Opus panel designer seats the judges | 1.5 min | 2 |
| 1. Propose | every member, parallel | 1.5 | 1.5 |
| 2a. Clash | every member, parallel | 1.5 | 1.5 |
| 2b. Second clash | every member, parallel | - | 1.5 |
| 3. Decide | Producer | 1 | 1 |
| 4. Build | Craftsperson (+ Visionary in parallel if the plan splits work) | 5 | 8 |
| 5. Review | Skeptic red-teams; for a tool, the Visionary uses it cold in parallel | 1.5 | 2 |
| 6. Fix | Craftsperson fixes the top 3 issues | 1.5 | 3 |
| 7. Pitch | Visionary | 1 | 1 |
| Q&A | judges, then Producers | - | 2 |
| Judge | Host renders, then every judge in parallel | 2 | 2.5 |
| Tally + reveal | Host | 0.5 | 0.5 |
| **Total** | | **~17** (measured 10) | **~25** |

Budgets are ceilings, not targets: agents usually finish early, and teams don't wait for each
other, so the deadlines add up to more than the run takes. The extra build minute in `lite` is there
because timed builds came in at 3-5 KB and three minutes early; spend it on depth, not scope.

Tell the user the mode, team count and expected time before Setup.

## 0. Intake (one exchange, then go)

Read what the user gave you and fill these in. Ask only for what you cannot infer, in a
single `AskUserQuestion` call; otherwise state your defaults in one line and start.

| Setting | Default |
|---|---|
| **Idea / brief** | required |
| **Medium** - what each team must actually build (motion graphic, design language, video concept, product, copy, UI...) | infer from the idea |
| **Teams** | 3 in `lite`, 4 in `standard` (allowed 3-5) |
| **Team size** | 4 (allowed 3-5) |
| **Mode** | `lite` (~15 min). `standard` adds a second clash, judges' Q&A and a bigger build (~25 min) |
| **Rematch** - judges' notes go back to the teams, who build a v2 that is re-scored (section 6) | offer after the reveal |
| **Constraints** - brand, assets, tools, length, format | none |

Create the workspace in the current directory:

```
group-project-runs/<slug>-<YYYYMMDD>/
  brief.md                      # idea, medium, constraints, settings
  clock.md                      # phase deadlines (Host)
  judges/
    panel.md                    # PUBLIC - who the judges are
    judges-brief.md             # PUBLIC - goals + rubric (no signature criteria)
    rubric.json                 # PUBLIC - machine-readable rubric
    sealed/<judge-id>.md        # SECRET - signature criterion. Never shown to teams.
  teams/<team-id>/
    charter.md                  # team identity + members
    rounds/<N>-<member-id>.md   # each member's entry for a round - the debate transcript
    proposals/<member-id>.md    # Round 1 solo proposals
    plan.md                     # the Producer's decision
    build/                      # the actual deliverable
    review.md                   # Skeptic's ranked issues (+ cold-use notes for tools)
    pitch.md                    # the pitch
    qa.md                       # judge questions + team answers (standard)
  renders/                      # Host's renders of every build, shown to all judges
  qa/<judge-id>.json            # each judge's questions (standard; Host merges into qa.md)
  scores/<judge-id>.json        # one per judge
  results.md                    # final, written by tally + Host
  # rematch only (section 6)
  crit/<judge-id>.json          # each judge's fix-per-team notes, shown to all teams
  judges/sealed-v2/<judge-id>.md  # fresh signature criteria for the rematch
  teams/<team-id>/triage.md     # accept / reject / steal, per judge note
  teams/<team-id>/build-v2/     # the revised deliverable (build/ stays as v1)
  teams/<team-id>/pitch-v2.md
  scores-v2/<judge-id>.json     # v1 and v2 scored in one pass
  results-v2.md                 # tally with v1 -> v2 change
```

## 1. Setup: seat the panel and form the teams (in parallel)

Write `brief.md` and `clock.md`, then launch **one Opus panel designer** with the "Panel designer"
prompt in [references/prompts.md](references/prompts.md). It reads
[references/judges.md](references/judges.md), the brief, and the matching domain section of
[lessons.md](lessons.md) if there is one, and writes `panel.md`, all five sealed criteria,
`judges-brief.md` and `rubric.json` in one pass. One author keeps the five secret criteria
distinct by construction (when five judges chose in parallel, three picked the same thing).

While it works, read [references/team-roles.md](references/team-roles.md) and write each team's
`charter.md`: a team name, a team temperament (each team gets a *different* one so variations
diverge), and its members - one per role - each with a name, personality, taste anchors and a
blind spot. Never assign a team a creative direction; temperament and people should produce it.

Check `judges-brief.md` for any technique or motif teams could copy, then start Round 1.

## 2. Run the rounds

Every member is a separate `Agent` call with `model: "sonnet"`, using the role prompt from
[references/prompts.md](references/prompts.md), always with the TIMEBOX block. Rounds 1-2 launch
**all members of all teams in one message**. From Round 3 on, every team moves at its own pace.

| Round | Who | What |
|---|---|---|
| **1. Propose** | every member, solo | Read the brief + judges' brief. Name the three obvious ideas, then propose something that isn't one of them. ≤250 words. |
| **2a. Clash** | every member | Read teammates' proposals. Attack the weakest ideas, defend or concede your own, steal what's good. Skeptic finds the fatal flaw in every proposal. |
| **2b. Second clash** (standard) | every member | Respond to what was said about your position. Move or harden, with reasons. |
| **3. Decide** | Producer | One direction, a plan that fits the build budget, who owns what, honest dissent. |
| **4. Build** | Craftsperson (+ Visionary on a split) | Build the real deliverable into `build/` within the budget. |
| **5. Review** | Skeptic; for a tool, + Visionary in parallel | Skeptic ranks what would lose points. If the deliverable is a tool, skill or anything meant to be used, the Visionary uses it cold at the same time and logs every guess as a bug. |
| **6. Fix** | Craftsperson | Fix the top 3 issues (cold-use blockers count first); log the rest as known issues. |
| **7. Pitch** | Visionary | Write `pitch.md`, checking every claim against `build/`. |

Rules the Host enforces:
- **Isolation.** A team agent may read only its own team folder, `brief.md`, and the public
  `judges/` files - never `judges/sealed/`, `scores/`, or other teams' folders. Say so in every prompt.
- **Real friction.** If a team's Round 2a reads like agreement, tell its Skeptic and Visionary in
  the Decide prompt's note to the Producer that consensus was too easy, and name the convergence.
  When every proposal shares one mechanism because the brief demands it (e.g. "no invented
  claims"), call that mechanism table stakes so teams compete on something else.
- **Real builds.** A deliverable is files someone can open, not a description of files.
- **One way to look.** Anyone checking an animated build - Craftsperson, Skeptic or judge - uses
  `scripts/capture.mjs` (the LOOK block in prompts.md). It records in real time, so every judge
  sees the same frames, and nobody touches the shared browser pane or a local server.
- One-line status per team when a round lands (direction, biggest fight).

## 3. Judging

1. **Render once.** When the last team's pitch lands, render every build yourself into `renders/`
   (capture.mjs frames for anything animated; GitHub's markdown renderer plus a screenshot for a
   README; a screenshot for a page) so every judge looks at identical images. Serve web pages
   over a local HTTP server on a port of your own, at a plausible path (for a 404 page, a
   mistyped one like `/menue.html`), never `file://`: pages that echo their URL will print your
   local folder path, and judges score what the render shows. Take phone (375px) and desktop
   (1280px) widths.
2. **Q&A** (standard): each judge writes one question per team to `qa/<judge-id>.json`; build each
   team's `qa.md` from them; each Producer answers in parallel.
3. **Scoring**: every judge in parallel, on its own model, reads its sealed file, the renders, and
   each team's build and pitch, and writes `scores/<judge-id>.json` in the schema from
   [references/rubric.md](references/rubric.md). No judge sees another's scores.
4. **Tally**: `python3 <this-skill-dir>/scripts/tally.py group-project-runs/<slug>-<date>` - it
   validates every score file and writes `results.json` + `results.md`.

## 4. Reveal

Present to the user, in this order:
1. The standings table (from `results.md`) and how long the run took against the clock.
2. Each judge's **signature criterion revealed**, with who won it and the judge's one-line why.
3. Per team: the pitch hook, where the build lives (clickable path), what the judges loved and docked.
4. The biggest judge disagreement (highest spread) - often the most interesting variation.
5. One recommendation: which variation to take forward, and what to graft onto it from the others.

If the user wants a shareable page, build a scoreboard/gallery page from `results.json` and
the team builds, following the Artifact tool's own instructions.

Then offer the rematch (section 5) in one line, and write lessons (section 6) either way.

## 5. Crit & rematch (optional, ~10 min)

The judges' notes go back to the teams; each team builds a v2; the judges re-score it with v1
in view. What it measures is whether a team can take feedback without losing itself. All
prompts are in the "Rematch" part of [references/prompts.md](references/prompts.md), each with a TIMEBOX.

1. **Crit** (1.5 min) - every judge, parallel, own model. Writes `crit/<judge-id>.json`: for each
   team, the one change that would most raise their score. It also seals a **fresh** signature
   criterion in `judges/sealed-v2/` - the v1 ones are public now.
2. **Open the books.** Teams may now read `results.md`, `crit/`, `judges/sealed/` (the v1
   criteria, revealed) and other teams' `build/` + `pitch.md` (read-only - to steal from).
   Still never `sealed-v2/`, `scores*/`, or other teams' rounds and plans.
3. **Triage** (1 min) - Producer. Every judge note goes in one pile: **accept**, **reject with a
   reason**, or **steal** (at most one idea from one rival build, credited). Plus a 3-line retro.
4. **Challenge** (1 min) - Skeptic attacks the triage from both sides: notes accepted only to
   please a judge, and notes rejected out of pride.
5. **Build v2** (3 min) - Craftsperson into `build-v2/` (copy v1 first; never edit `build/`).
   Records each triage item as done, partly done or dropped in `build-v2/CHANGES.md`.
6. **Re-pitch** (1 min) - Visionary writes `pitch-v2.md`.
7. **Re-score, paired** (2 min) - every judge scores **v1 and v2 side by side in one pass**,
   against the rubric and `sealed-v2/`, without looking at their round-1 scores. Judges grade
   harder after writing notes, so comparing v2 with a round-1 score measures drift as much as the build.
8. **Tally**: `python3 <this-skill-dir>/scripts/tally.py <workspace> --round 2` - the v1 -> v2
   change from the same pass, the **drift**, **Most improved**, and how many notes landed.

Steps 3-6 run per team without waiting for the others. Reveal like section 4, leading with the
change column. Call out convergence: if the v2 builds look more alike than the v1 builds did,
the feedback flattened them - say so.

## 6. Lessons (every run)

Append to [lessons.md](lessons.md) under the domain's heading (create it if new):
- **What wins in this domain** - from the judges' scores and v2 `lesson` fields. Only the panel
  designer reads these; teams never do, or every run would copy the last winner.
- **Process lessons** - from team retros, the clock (which phase ran over, and why), and anything
  that broke for the Host. Teams may read these.

Keep each lesson one line, dated, with the run folder it came from. Prune contradicted lessons.

## Cost note

`lite` with 3 teams × 4 ≈ 45 subagent calls (panel 1, propose 12, clash 12, decide 3, build 3-6,
review 3-6, fix 3, pitch 3, judges 5). `standard` with 4 × 4 ≈ 80 (adds a second clash and Q&A).
A rematch adds about 5 + 4 per team + 5. Tell the user the mode, team count and expected time
before Setup.
