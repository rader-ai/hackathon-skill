# Group Project

A Claude Code skill that runs a hackathon on one idea. Three to five teams of subagents with clashing personalities each build their own variation and pitch it. A panel of expert judges on different models scores them on a public rubric, plus one criterion each that they keep sealed until the reveal. An optional rematch sends the judges' notes back to the teams, who build a v2 that is re-scored side by side with v1.

Use it when you want genuinely different takes on something (a motion graphic, a design language, a video concept, a product idea), not A/B tweaks of one.

## How a run works

1. **Judges first.** Five judges cast for the domain: 2 Opus, 2 Sonnet, 1 Haiku (the Haiku seat is the everyday-user gut check). Each seals a secret criterion. The Head Judge writes the public brief and rubric.
2. **Teams.** Each team gets a temperament (Purists, Humanists, Provocateurs...) and four Sonnet members: a **Visionary**, a **Producer** who makes the call, a **Skeptic** who finds the fatal flaw, and a **Craftsperson** who builds. Nobody is handed a creative direction.
3. **Rounds.** Solo proposals, a clash (and a second clash in `standard` mode), a decision, a real build, a red team, a revision, and a pitch.
4. **Judging.** Optional Q&A, then independent scoring. `scripts/tally.py` validates every score file and computes totals, the sealed-criterion awards and judge disagreement.
5. **Reveal.** Standings, each sealed criterion opened, and a recommendation on what to take forward.
6. **Crit & rematch (optional).** Each judge writes the one fix that would most raise their score. Teams accept, reject with a reason, or steal one idea from a rival, then build v2. Judges score v1 and v2 **in the same pass**, so their drift between rounds cancels out of the change.
7. **Lessons.** Every run appends to `lessons.md`. The Head Judge reads what wins in the domain; teams only see process lessons.

## Install

```bash
git clone https://github.com/rader-ai/hackathon-skill.git
ln -s "$PWD/hackathon-skill/group-project" ~/.claude/skills/group-project
```

Then ask Claude Code for a "group project" or "hackathon" on an idea, or run `/group-project <your idea>`.

## Cost

Subagent calls, not tokens:

| Run | Calls |
|---|---|
| `lite`, 3 teams × 4 | about 50 (the example run used 51) |
| `standard`, 4 teams × 4 | about 60-70 |
| Rematch, 3 teams | about 22 more |

The skill states the mode and team count before Round 1.

## Layout

```
group-project/                 the skill
  SKILL.md                     the Host's playbook
  lessons.md                   what earlier runs learned
  references/                  roles, judges, rubric, every prompt
  scripts/tally.py             scoring (round 1 and rematches)
group-project-runs/
  coffee-loader-20261023/      worked example (see below)
```

## Example run: a coffee-app loader

Brief: a 5-second looping loading indicator for a coffee-ordering app, in plain HTML/CSS. Lite mode, three teams, then a rematch.

| Team | Round 1 | Rematch (v1 today → v2) |
|---|---|---|
| Warm Hands (Humanists) | 1st · 86.2 | 76.6 → 80.7 (+4.1) |
| The Glitch (Provocateurs) | 3rd · 65.5 | 61.2 → 77.0 (+15.8, most improved) |
| Bare Wire (Purists) | 2nd · 73.5 | 62.5 → 75.1 (+12.6) |

Everything is in [`group-project-runs/coffee-loader-20261023/`](group-project-runs/coffee-loader-20261023/): each team's debate log, plans, v1 and v2 builds (open any `index.html` in a browser), judges' sealed criteria, crit notes, score files and results. `scoreboard/index.html` is the gallery page built from them.

What the run taught the skill is in [`group-project/lessons.md`](group-project/lessons.md). Two findings shaped the rematch design: judges graded the same v1 builds 4-11 points harder after writing their notes, and an unpaired comparison turned a real gain into an apparent loss.

## Status

Tested: `lite` mode, 3 teams of 4, one domain (UI motion), the rematch, and the scoring script.

Not yet tested: `standard` mode and the Q&A round, 4-5 teams, team sizes 3 and 5, the Wildcard role, and any domain other than UI motion.
