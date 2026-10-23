# Rubric and Scoring

## How a team's score is built

- **Rubric score (0-100)**: each judge scores each criterion 1-10. A judge's rubric score for a
  team = Σ (score / 10 × weight). The team's rubric score is the mean across judges.
- **Signature bonus (0-15 with 5 judges)**: each judge scores their secret criterion 0-10 for
  every team; it's worth up to `signature_points` (default 3) per judge:
  score / 10 × signature_points. Bonuses add up across judges.
- **Total** = rubric score + signature bonus. Ties break on the Head Judge's rubric score, then
  on the lowest judge spread.

## Default criteria (Head Judge adapts these to the domain)

Keep 4-6 criteria; weights sum to 100. Always keep **Pitch** as its own criterion.

| id | Criterion | Weight | What a 10 looks like |
|---|---|---|---|
| `concept` | Concept strength | 25 | A clear, ownable idea you can say in one sentence, and it's surprising |
| `craft` | Craft & execution | 25 | The build is finished, detailed, and works in its medium |
| `fit` | Fit to brief | 20 | Solves the stated goal and respects every constraint |
| `distinct` | Distinctiveness | 15 | Couldn't be mistaken for a template or for another team's work |
| `pitch` | Pitch | 15 | Short, persuasive, honest about risk, makes you want to say yes |

Domain swaps: motion → add `motion` (timing, rhythm, easing); design language → `extensibility`;
video → `story`; product → `viability`. Rebalance weights to 100.

## rubric.json

```json
{
  "goal": "One sentence: what winning means for this brief",
  "head_judge": "j-...",
  "signature_points": 3,
  "criteria": [
    {"id": "concept", "name": "Concept strength", "weight": 25, "description": "..."},
    {"id": "craft", "name": "Craft & execution", "weight": 25, "description": "..."}
  ]
}
```

## judges-brief.md (public, read by every team)

```markdown
# Judges' Brief - <project>
## The goal
## What you must deliver        (files in build/, plus pitch.md)
## The panel                    (names, titles, one line each - from panel.md)
## The rubric                   (table: criterion, weight, what a 10 looks like)
## Signature criteria           Each judge holds one undisclosed criterion worth up to N points.
## What will lose points        (the panel's shared pet hates)
```

## scores/<judge-id>.json

```json
{
  "judge": "j-mara-okafor",
  "model": "opus",
  "signature": {"name": "Sound-off first second", "description": "..."},
  "teams": {
    "bare-wire": {
      "criteria": {"concept": 8, "craft": 7, "fit": 9, "distinct": 6, "pitch": 7},
      "signature_score": 9,
      "signature_why": "one line",
      "loved": "one line",
      "docked": "one line"
    }
  }
}
```

Every team must appear; every rubric criterion must be scored 1-10; `signature_score` 0-10.
`scripts/tally.py` rejects files that don't match.

## Rematch schemas

`crit/<judge-id>.json` and `scores-v2/<judge-id>.json` are defined in the Rematch part of
`prompts.md`. `scores-v2` is the v1 schema plus `fix_landed` (`yes|partly|no|rejected`) and
`fix_note` per team, a `v1` block per team (`criteria` + `signature_score`, v1 scored in the same
pass), and a top-level `lesson`. Both versions' signature scores use the judge's **fresh**
criterion from `judges/sealed-v2/`. `tally.py --round 2` reads `scores-v2/`, takes the change from
the paired v1 scores, reports drift against `results.json`, and names the most improved team. Files
without `v1` blocks fall back to comparing with `results.json`, flagged as unpaired.
