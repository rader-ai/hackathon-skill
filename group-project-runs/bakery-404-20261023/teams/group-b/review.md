# Review - Sam (Skeptic), Round 5

Checked: code read; 1280x800 capture (loaf shows INDEX.HTML as file, expected). Path is set via textContent only, never HTML: safe. decodeURIComponent is try/caught. A 200-char path wraps (word-break:break-all on code) and the loaf word is cut to 12 chars plus an ellipsis. /menue would read MENUE on the loaf, fine. Tove's CSS fix holds: code wraps, no overflow at 1280. (375 capture not separately confirmed in time; code-wise no fixed widths.)

## Ranked issues (top 3 first)
1. **Hours are duplicated and below the fold on a phone.** The "Open 7am-2pm, closed Mondays" line appears twice at the bottom, while the status sits under a big loaf. Dana checks hours on her phone. Fix: move the live status line above the nav (under the lead); delete the duplicate `.hours` p (or keep it only inside the Hours button).
2. **"Hours" button links to /hours, and /menu links to /menu.** If those are 404 on the real site, the recovery page 404s itself. Fix: point Hours to `#hours` (an anchor on the status block) or `/#hours`; note the menu path assumption in the README.
3. **Voice and place are thin.** "We couldn't find that page." is a template line, and the loaf is a flat ellipse (reads as a smiley). Fix: one bakery line, e.g. "That page has sold out" or "Nothing in the oven at this address", and two more score marks to read as a loaf. Theo and Ines will mark this down.
4. SVG aria-label is static ("scored with the page you asked for"). Fix: set it from JS to include the word, or mark the svg aria-hidden (the path is already in text).
5. Google Fonts is external; the fallback is Georgia, so it is OK, but add `font-display` via `&display=swap` to the URL.
6. 404 stamp is announced as "404 Page not found" in the h1: fine. Small text at 14px: bump to 16px.

## Hidden criteria guess
- Accessibility (Sam O.): passes on contrast, focus rings, 56px targets, reduced motion. Static aria-label is a minor miss.
- Content design (Theo): the lead is generic, so it likely fails the voice test.
- Engineering (Priya): the XSS check passes; a file:// fallback is handled; /hours link is the hole.
- Customer (Dana): hours below the fold, risk. Live open/closed status is a real plus.
- Brand (Ines): the loaf is a good idea but looks flat.
Survives: robust, safe. Weakest on place and concept punch.
