# Tove - Proposal

**Three obvious ideas (not mine):**
1. Sold-out board: "this page is sold out", chalkboard style.
2. Crumb trail / empty bread basket leading home.
3. Pun on "baked/404" with a burnt-croissant or missing-slice illustration.

**Mine: "Scored".** The visitor's own wrong URL becomes the hero. A big SVG sourdough loaf is hand-scored on the spot: the mistyped path (e.g. /menue) is cut into the crust as baker's slashes, each letter opening as the loaf "bakes" open. Convention broken: a 404 normally hides the bad URL; we put it on the loaf and treat it as the baker's mark. Plain headline still says: "404 - we couldn't find that page."

**Looks/feels:** warm flour-white and crust-brown, one big loaf, a few cream-coloured letter-slashes, three big buttons beneath (Home, Menu, Hours: 7am-2pm, closed Mondays) with today's open/closed state computed live.

**Rubric:**
- Recovery: 404 text plus three large buttons above the fold at 375px; live open/closed line. Strong.
- Place: sourdough scoring is bakery craft, not generic. Strong.
- Concept: "your typo, scored into a loaf" - one sentence, ownable.
- Craft: pure inline SVG + ~40 lines JS; slashes animate by stroke-dashoffset; reduced-motion shows the finished loaf instantly.
- Pitch: honest that long URLs need truncating.

**Riskiest part:** legibility of letters as slashes, and long or weird URLs overflowing the loaf (needs truncation plus fallback to plain "?").
