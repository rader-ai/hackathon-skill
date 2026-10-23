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
judges and teams, run the rounds, keep the files straight, enforce the rules, and present the
results.

## 0. Intake (one exchange, then go)

Read what the user gave you and fill these in. Ask only for what you cannot infer, in a
single `AskUserQuestion` call; otherwise state your defaults in one line and start.

| Setting | Default |
|---|---|
| **Idea / brief** | required |
| **Medium** - what each team must actually build (motion graphic, design language, video concept, product, copy, UI...) | infer from the idea |
| **Teams** | 4 (allowed 3-5) |
| **Team size** | 4 (allowed 3-5) |
| **Mode** | `standard` (all rounds). `lite` skips Round 2b and Q&A - use when the user wants it fast/cheap |
| **Q&A round** (judges question each team after pitches) | on in `standard` |
| **Rematch** - judges' notes go back to the teams, who build a v2 that is re-scored (section 6) | offer after the reveal |
| **Constraints** - brand, assets, tools, length, format | none |

Create the workspace in the current directory:

```
group-project-runs/<slug>-<YYYYMMDD>/
  brief.md                      # idea, medium, constraints, settings
  judges/
    panel.md                    # PUBLIC - who the judges are (Host concatenates panel-<judge-id>.md)
    judges-brief.md             # PUBLIC - goals + rubric (no signature criteria)
    rubric.json                 # PUBLIC - machine-readable rubric
    sealed/<judge-id>.md        # SECRET - signature criterion. Never shown to teams.
  teams/<team-id>/
    charter.md                  # team identity + members
    log.md                      # debate transcript; Host appends rounds/*.md after each round
    rounds/<N>-<member-id>.md   # each member's entry for a round
    proposals/<member-id>.md    # Round 1 solo proposals
    build/                      # the actual deliverable
    pitch.md                    # the pitch
    qa.md                       # judge questions + team answers
  scores/<judge-id>.json        # one per judge
  results.md                    # final, written by tally + Host
  # rematch only (section 6)
  crit/<judge-id>.json          # each judge's fix-per-team notes, shown to all teams
  judges/sealed-v2/<judge-id>.md  # fresh signature criteria for the rematch
  teams/<team-id>/triage.md     # accept / reject / steal, per judge note
  teams/<team-id>/build-v2/     # the revised deliverable (build/ stays as v1)
  teams/<team-id>/pitch-v2.md
  scores-v2/<judge-id>.json     # v2 scores, with v1 in view
  results-v2.md                 # tally with v1 -> v2 change
```

## 1. Seat the judges

Read [references/judges.md](references/judges.md). Cast the panel for *this* domain: default
5 judges = 2 Opus, 2 Sonnet, 1 Haiku. Launch one `Agent` per judge **in parallel**
(`model` per the panel) using the "Judge: introduce yourself" prompt in
[references/prompts.md](references/prompts.md). Each writes its public bio section and its
sealed signature criterion.

Then launch one Opus "Head Judge" agent that reads all the public judge material - plus the
matching domain section of [lessons.md](lessons.md), if one exists - and writes
`judges-brief.md` + `rubric.json` (template in [references/rubric.md](references/rubric.md)).
The brief states the goal, the rubric, the deliverable requirements, and announces that every
judge holds one undisclosed signature criterion.

## 2. Form the teams

Read [references/team-roles.md](references/team-roles.md). Write each team's `charter.md`:
a team name, a team temperament (each team gets a *different* one so variations diverge), and
its members - one per role - each with a name, personality, taste anchors and a blind spot.
Never assign a team a creative direction; temperament and people should produce it.

## 3. Run the rounds

Every member is a separate `Agent` call with `model: "sonnet"`, using the role prompt from
[references/prompts.md](references/prompts.md). Within a round, launch **all members of all
teams in parallel** (one message, many Agent calls) whenever they don't depend on each other.
Each agent reads its team folder + the public judge files, writes its output to its team folder,
and appends a dated, signed entry to `log.md`.

| Round | Who | What |
|---|---|---|
| **1. Diverge** | every member, solo, parallel | Read the brief + judges' brief. Write a proposal to `proposals/<me>.md`. No peeking at teammates. |
| **2a. Clash** | every member, parallel | Read all teammates' proposals. Attack the weakest ideas, defend or concede your own, steal what's good. Skeptic must find the fatal flaw in every proposal. |
| **2b. Second clash** (standard only) | every member, parallel | Respond to what was said about your position in 2a. Positions must move or harden with reasons. |
| **3. Decide** | Producer | Read the log, make the call: one direction, a build plan, who owns what. Record dissent honestly. |
| **4. Build** | Craftsperson leads; Visionary contributes in parallel if the plan splits work | Build the real deliverable into `build/` (see medium guide in [references/prompts.md](references/prompts.md)). |
| **5. Red team** | Skeptic | Review the build against the judges' brief. List what would lose points. |
| **6. Revise** | Craftsperson (+ Visionary) | Fix what the Skeptic found, or log why not. |
| **7. Pitch** | Visionary drafts, Producer tightens | Write `pitch.md`: the hook, the idea, why it wins on each rubric criterion, the risk, the ask. |

Rules the Host enforces:
- **Isolation.** A team agent may read only its own team folder, `brief.md`, and the public
  `judges/` files - never `judges/sealed/`, `scores/`, or other teams' folders. Say so in every prompt.
- **Real friction.** If a team's log reads like agreement, the next round's prompt tells the
  Skeptic and Visionary to escalate. Consensus must be earned.
- **Real builds.** A deliverable is files someone can open, not a description of files.
- Between rounds, post the user a one-line status per team (direction, biggest fight).

## 4. Judging

1. **Q&A** (if on): each judge, in parallel, reads every team's `build/` and `pitch.md` and writes
   one sharp question per team into that team's `qa.md`. Then the team's Producer (Sonnet)
   answers, in parallel across teams.
2. **Scoring**: each judge, in parallel, using its own model, reads its sealed file, every team's
   build, pitch and Q&A, and writes `scores/<judge-id>.json` in the schema from
   [references/rubric.md](references/rubric.md). Judges score independently - no judge sees another's scores.
3. **Tally**: run
   ```bash
   python3 <this-skill-dir>/scripts/tally.py group-project-runs/<slug>-<date>
   ```
   It validates every score file, computes totals, signature awards and judge spread, and writes
   `results.json` + `results.md`.

## 5. Reveal

Present to the user, in this order:
1. The standings table (from `results.md`).
2. Each judge's **signature criterion revealed**, with who won it and the judge's one-line why.
3. Per team: the pitch hook, where the build lives (clickable path), what the judges loved and docked.
4. The biggest judge disagreement (highest spread) - often the most interesting variation.
5. One recommendation: which variation to take forward, and what to graft onto it from the others.

If the user wants a shareable page, build a scoreboard/gallery page from `results.json` and
the team builds, following the Artifact tool's own instructions.

Then offer the rematch (section 6) in one line, and write lessons (section 7) either way.

## 6. Crit & rematch (optional)

The judges' notes go back to the teams; each team builds a v2; the judges re-score it with v1
in view. What it measures is whether a team can take feedback without losing itself. All
prompts are in the "Rematch" part of [references/prompts.md](references/prompts.md).

1. **Crit** - every judge, parallel, own model. Writes `crit/<judge-id>.json`: for each team,
   the one change that would most raise their score (criterion, expected gain, confidence). It
   also seals a **fresh** signature criterion in `judges/sealed-v2/` - the v1 ones are public now.
2. **Open the books.** Teams may now read `results.md`, `crit/`, `judges/sealed/` (the v1
   criteria, revealed) and other teams' `build/` + `pitch.md` (read-only - to steal from).
   Still never `sealed-v2/`, `scores*/`, or other teams' logs and plans.
3. **Triage** - Producer, parallel across teams. Every judge note goes in one pile:
   **accept**, **reject with a reason**, or **steal** (at most one idea from one rival build,
   credited). Also writes the team's process retro (what went wrong in v1).
4. **Challenge** - Skeptic, parallel. Attacks the triage from both sides: notes accepted only
   to please a judge, and notes rejected out of pride. Producer's call stands unless the
   Skeptic shows it breaks the brief.
5. **Build v2** - Craftsperson into `build-v2/` (copy v1 first; never edit `build/`). Records
   each triage item as done, partly done or dropped in `build-v2/CHANGES.md`.
6. **Re-pitch** - Visionary writes `pitch-v2.md`: what changed, what they refused and why.
7. **Re-score, paired** - every judge, parallel. Scores **v1 and v2 side by side in one pass**,
   both against the rubric and `sealed-v2/`, without looking at their round-1 scores. Marks whether
   their note landed (`yes|partly|no|rejected`) and adds one domain lesson. Writes
   `scores-v2/<judge-id>.json`. Pairing matters: judges grade harder after writing their notes, so
   a v2 score compared with a round-1 score measures drift as much as the build.
8. **Tally**: `python3 <this-skill-dir>/scripts/tally.py <workspace> --round 2` - computes the
   v1 -> v2 change from the same pass, the **drift** (how far today's v1 score sits from its
   round-1 score), **Most improved**, and how many notes landed.

Reveal like section 5, leading with the change column. Call out convergence: if the v2 builds
look more alike than the v1 builds did, the feedback flattened them - say so.

## 7. Lessons (every run)

Append to [lessons.md](lessons.md) under the domain's heading (create it if new):
- **What wins in this domain** - from the judges' scores and v2 `lesson` fields. Only the Head
  Judge reads these; teams never do, or every run would copy the last winner.
- **Process lessons** - from team retros and anything that broke for the Host (collisions,
  leaks, convergence). These go in the shared section every team prompt may include.

Keep each lesson one line, dated, with the run folder it came from. Prune contradicted lessons.

## Cost note

`standard` with 4 teams × 4 members ≈ 60-70 subagent calls; `lite` with 3 teams ≈ 50 (a real
lite run of 3×4 took 51). A rematch adds about 5 + 4 per team + 5 (≈ 22 for 3 teams). Tell the
user the mode and team count before Round 1 so a bigger run is never a surprise.
