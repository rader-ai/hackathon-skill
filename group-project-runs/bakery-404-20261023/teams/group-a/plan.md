# Plan - Group A (Omid, Producer)

**Direction:** The Ticket Stub - the 404 is a paper queue ticket for a number the counter doesn't have ("You've drawn a number we don't have"), with the visitor's missing path printed as the number, hours on the stub, and Monday never called.

**Why it beats the alternatives (rubric):**
- Recovery (25): plain headline, three big tap targets above the fold, hours as real text. Matches Greta's demand.
- Place (20): a queue ticket is counter culture of a neighbourhood shop; nobody else will draw it.
- Concept (15): one sentence, ownable, surprising.
- Craft (25): flat CSS, one ticket, one slide-in; trivial to finish in 4 minutes.
- Pitch (15): reusable ticket motif for other states.

**Rejected / dissent:**
- Greta's Open Right Now: table stakes; kept as one live line on the ticket. She conceded.
- Luis's Tally Stick: obscure, over-built (7 notches at 375px). He conceded. Stole the absent Monday.
- My Daybook: costume nostalgia. I conceded. Stole the echoed URL.
- Dissent: Luis preferred the Daybook as base; Greta flagged the "Now serving" gag as a decode-before-exit risk, so it is cut to one small line.

**Build (Luis, 4 min), build/index.html + build/README.md only:**
1. Cream ticket on kraft background, flat CSS, serif display + monospace numerals (system/Google Fonts ok).
2. Headline "We can't find that page." (plain, top, above ticket details).
3. Ticket: "No. 404" numeral, line "You've drawn a number we don't have", missing path echoed (JS from location.pathname, textContent only, truncated, fallback "/this-page").
4. Perforated stub (dashed border/radial dots) holding hours: "Open 7am-2pm, closed Mondays" as static text, plus one JS live line (open now / opens 7am tomorrow / closed Mondays, back Tuesday). No-JS shows full hours.
5. Three big links, 44px+ min height: Home (/), Menu (/menu), Hours (/hours), above the fold at 375px. AA contrast.
6. One slide-in animation on the ticket, wrapped in prefers-reduced-motion: no-preference.
7. Quick check: open at 375px and desktop; confirm links above fold. README: 4 lines.

**Cut to fit:** brass "Now serving 403/405" board (Monday-gap gag only as hours text), misregistered ink, kraft texture, perforation SVG, layered paper shadows, loaf drawing, handwriting face, tally notches.
