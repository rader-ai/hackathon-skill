# Round 5 review - Ada (Skeptic)
Seen: 1280x800 capture + full code read. (375 capture overwrote same filename; judged 375 from CSS.)

## Top 3
1. **Hours hidden below the fold; "Hours" nav link is redundant.** Dana checks hours on a phone: the answer (7am-2pm, closed Mon) is a scroll away. Fix: put "Open 7am-2pm, closed Mondays" as one line under the h1/hand line; make the third nav button a tel/directions link or drop it.
2. **Home/Menu hrefs "/" and "/menu" are guesses and the path-strike is fragile.** Opened as file, path shows a huge filesystem string with strikethrough through two lines (ugly, off-brand). Fix: truncate/ellipsis (`white-space:nowrap;overflow:hidden;text-overflow:ellipsis`), fallback text "this page" if pathname ends .html.
3. **Concept is thin and the page reads as "notebook" more than bakery.** Ruled paper + Georgia is stationery; no bread, no smell, no neighbourhood. Fix: one small inline SVG loaf/tray, and one sentence of specific voice (sourdough, the few tables).

## Also
- Caveat from Google Fonts: fine, fallback exists. Hand text in #4a4a52 on paper OK contrast.
- Strikethrough "Mon / no bake" plus today highlight: good, but today row relies on border only; add "today" text for non-visual cues (Sam).
- Reduced motion handled. Only the stroke animates; stroke-dasharray:1 with pathLength fine.
- Table has no caption/th; add `<caption class="sr">` and th scope (Sam).
- 375px: padding-left 56px leaves ~300px content; OK, nav spans may wrap tight.
- Focus style relies on hover colour swap; fine.

## Hidden criteria guesses
- Theo: is the error copy human and does it say what to do? Mostly yes; "isn't baked" is nice. Survives.
- Sam: table semantics, today cue not colour-only. Partial.
- Priya: self-contained, no broken hrefs. Risky on file open.
- Ines: ownable idea. Moderate; a "bake sheet" is okay but not surprising.
- Dana: hours instantly. Fails above the fold.
