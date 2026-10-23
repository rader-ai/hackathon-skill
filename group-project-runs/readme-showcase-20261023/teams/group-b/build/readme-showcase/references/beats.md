# Reel beats (`beats.json`)

The Reel is rendered by `scripts/reel.mjs`. You never write SVG. You choose up to 3 beats from a fixed
vocabulary; the template does layout, colour, easing, light/dark and the reduced-motion final frame.

```json
{
  "duration": 6,
  "beats": [
    { "type": "in",   "text": "verbatim input line",  "source": "path:LINE", "claim": "c-in" },
    { "type": "step", "text": "verbatim check/label", "source": "path:LINE", "claim": "c-step" },
    { "type": "out",  "text": "verbatim output",      "source": "path:LINE", "claim": "c-out" }
  ]
}
```

| type | on-screen tag | use for | max text lines |
| --- | --- | --- | --- |
| `in` | INPUT | what the user feeds the project (a command, a file line, a function call) | 3 |
| `step` | CHECK | one real intermediate fact, such as a validation status the repo prints | 2 |
| `out` | OUTPUT | what comes out (printed result, a number from an output file, a returned value) | 3 |
| `gap` | GAP | something the project says is missing, kept visible rather than hidden | 2 |

## Rules

- At least one `in` and one `out`. Otherwise `reel.mjs` exits 3 with "no pair" and writes nothing. That means there is no honest transformation to animate: use ladder rung 3 or 4 (`references/ladder.md`).
- Max 3 beats and `duration` <= 8 seconds (default 6). Max 150 KB per SVG. The script refuses beyond these; cut beats, do not shrink the type.
- `text` is copied from the cited line (trailing `...` is the only allowed elision). One line, no newlines. ~79 characters per line at 16 px.
- **No markdown on screen.** Drop `**`, backticks and link syntax from beat text. Put the cleaned string in the ledger row's `text` and keep the raw line in its `quote` (`"text": "Jordan [00:40] The operations lead..."`, `"quote": "**Jordan** [00:40] The operations lead..."`). `reel.mjs` rejects markers and entities.
- **Make it one thread.** The three beats must visibly name the same item, so a newcomer reads INPUT -> CHECK -> OUTPUT as one story and the files back that story. Pick the INPUT phrase first, then find the CHECK line that names that exact phrase and the OUTPUT that shows it. `verify` warns when the beats share no 3-word phrase.
- **A CHECK a human can read.** Prefer the check result for that item (for a JSON file, use a line range that keeps the result and its subject together: `verification.json:14-16` -> `"ok": true, "quote": "The operations lead cannot spot delayed jobs until Monday."`). Never use a bare counter such as `"checked": 4,`; it counts something other than the input and invites a false causal reading. If only a count exists, say what it counts in a `derived` row, or drop the CHECK beat (two beats are legal).
- **OUTPUT is what the reader sees**, ideally the same phrase as the input now carrying the repo's own badge or result (`Quote verified "The operations lead..."`), not a lone label.
- **Hero and Reel together:** allowed only when they show different things (for example a captured report card as the hero, no Reel; or a Reel for a CLI that has no report). If both show the same input becoming the same output, delete one.
- Every beat has `source` identical to its ledger row's `source`, and `claim` = that row's `id`. `verify.mjs` checks both, and checks that the text inside the rendered SVGs is exactly the beats' text.
- The file path shown on a card is taken from `source`. Nothing else is on screen.
- Pick the beats that show a *transformation*, not the three most flattering strings. The first beat should be something the reader could type or supply; the last, something they would see.
- Output files: `reel-light.svg`, `reel-dark.svg`, `reel-final.png` (or `reel-final.svg` plus a warning when Chromium is missing). Reference whichever final frame exists.

## Embed (README)

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/reel-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/reel-light.svg">
  <img src="assets/reel-final.png" alt="A three-step animation: ... goes in, ... is checked, ... comes out." width="880">
</picture>
```

The alt text is the suggested `alt` the script prints, edited into one or two sentences (no `**`, no `&quot;`, no arrows; `verify` fails on those). GitHub's own theme toggle is not
the OS setting, so one SVG with an in-file `prefers-color-scheme` rule is wrong; the pair above is the fix.
