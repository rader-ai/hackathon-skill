# The Ticket Stub - Group A

**Hook:** You've drawn a number we don't have.

**The idea.** Every neighbourhood counter hands you a paper ticket. Our 404 is that ticket: "No. 404", the 0 drawn as a loaf with a bite out. The page is "sold out, like our 9am country loaf", and the missing path is printed on it like your order.

**What the build does.** One self-contained index.html, with inline CSS and JS. The headline is "We can't find that page." Under it, in bold, are "Open 7am-2pm, closed Mondays" and a live status line. Three 48px buttons follow: Home, Menu, Hours (Hours jumps to the on-page hours). The ticket slides in only under prefers-reduced-motion: no-preference. The echoed path uses textContent and is truncated at 40 characters.

**Why it wins.**
- Recovery (25): plain headline, bold hours before any decoration, three large links, Sunday-evening status bug fixed.
- Place (20): numbered ticket, kraft paper, loaf. Counter culture, not a template.
- Concept (15): one sentence, ownable, reusable for other error states.
- Craft (25): one file, flat CSS, focus rings, reduced motion respected, status in an aria-live region.
- Pitch (15): the risks are below.

**Honest risk.**
- Menu is a link to a route we assume exists.
- Live status uses the visitor's timezone, not the bakery's.
- Google Fonts are external; fallbacks shift layout slightly.
- The loaf is a simple SVG.
- At 1280px the ticket floats in empty kraft.
- Cut: "Now serving" board, misregistered ink, kraft texture, tally notches.
- An early 375px capture showed the ticket left of centre. We never resolved it.

**Close.** Put it on the door: a lost customer gets a ticket, the hours, and a way back to the counter.
