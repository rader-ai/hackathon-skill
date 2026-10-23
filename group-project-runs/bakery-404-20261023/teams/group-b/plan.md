# Plan - Group B (Provocateurs)

**Direction:** "Scored" - the visitor's mistyped URL is scored into a sourdough loaf like a baker's mark, with live open/closed status and three big links as the way back.

**Convention broken:** a 404 hides or apologises for the bad URL. Here the bad URL becomes the artwork.

**Why it beats the alternatives (rubric):**
- Concept (15) and Place (20): the only idea that cannot be pasted onto another bakery's 404; scoring is real bread craft. The other three ("hours lead, error is a footnote") were one idea in three costumes.
- Recovery (25): plain h1 "Page not found" and three big links above the fold at 375px, plus a live status line stolen from the rejected proposals.
- Craft (25): static SVG plus tiny JS; animation optional.
- Pitch (15): honest about the risk (legibility, long URLs) and answered it.

**Rejected / dissent:** Rina's Order Ticket, Kit's Hours Come First, Sam's Probably Not Here For The Error. Kit, Rina and Sam conceded in round 2a. Tove never needed to concede. Sam's dissent stays attached: keep the plain h1 and a plain-text copy of the path; he distrusts the wit and will check the page is not only clever.

**Open questions settled:**
- Escaping: the path is read from location.pathname, set only via textContent / SVG text node, never innerHTML. Decode with try/catch around decodeURIComponent.
- Long paths: last segment only, uppercase, cap 12 chars, add an ellipsis in the loaf; empty or unreadable gives "?". The full path (CSS-wrapped, overflow-wrap:anywhere) is shown as plain mono text under the loaf.
- Animation vs static: static by default. One CSS fade-in of the slashes, skipped under prefers-reduced-motion. No per-letter stroke animation.

**Build (Tove, 4 min, build/index.html + build/README.md only):**
1. Palette: flour-white #faf5ec, crust-brown #5a3a22, cut cream, rust-red #b3401f accent. Serif headline, mono for the path. Google Fonts allowed, system fallback.
2. Header "Crumb & Co." small. h1 "Page not found" (404 in rust stamp). One plain sentence: "We couldn't find that page."
3. One inline SVG loaf (oval, dark crust, 2-3 decorative slash curves). The typed word goes on the loaf as cream uppercase text on a gentle arc, font-size scaled by length. Below it: "You asked for: <code>/path</code>" in plain text.
4. Live status line from visitor's clock (Open until 2pm / Opens 7am / Closed Mondays, back Tuesday 7am). Words, not colour alone. Static hours text always present as fallback: "Open 7am-2pm, closed Mondays."
5. Three big links (min 48px high): Home "/", Menu "/menu", Hours "/hours" with "7am-2pm, closed Mondays".
6. Responsive: single column, 16px gutters, no horizontal scroll at 375px; loaf scales via viewBox width 100%.
7. Reduced motion: media query disables the fade.
8. README: 3-5 lines on idea, escaping, reduced-motion.
9. Check: open once at 375px and desktop; test /menue and a 200-char path.

**Cut to fit:** per-letter stroke-dashoffset slashes, steam wisp, receipt "No charge" line, stamp thump, flour grain texture, bake-open animation, week hours table (single line only), timezone selector.
