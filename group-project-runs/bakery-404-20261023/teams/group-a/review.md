# Review - Greta (Skeptic), Group A, Round 5

Evidence: read build/index.html (3.1KB); captured 375x812 and 1280x800 in .review and .review2. Note: the 375 shot showed the ticket sitting left of centre (about 12-268px of 375). Likely a capture or animation-timing artifact, but nobody has proven it. Check it.

## Top 3 (cost the most points)
1. **Hours live in a tiny stub and also as a link to /hours (recover, 25).** Hours are 14px mono at the bottom, below three equal black buttons. "Hours" button goes to a page that may not exist, so the 404 can lead to another 404. Dana checks hours on her phone, so they should be the first thing she sees. Fix (2 min): put "Open 7am-2pm, closed Mondays" and the live status directly under the headline in bold, and make "Hours" an anchor to the stub (#hours) instead of /hours.
2. **Concept is a single line (concept, 15).** "You've drawn a number we don't have" is the whole idea. The ticket-number metaphor is carried by "No." and the scalloped stub, but there is no bread, crumb or loaf anywhere, so this reads as a deli-counter ticket. Fix (3 min): add one inline SVG loaf or a bite taken out of the 0 in 404, plus a sourdough-flavoured line ("Sold out of that page, like our 9am country loaf").
3. **Heading hierarchy and clarity (recover/craft).** h1 is "We can't find that page." but sits outside the ticket, and "404" is a bare p. Fix (1 min): h1 inside the ticket and "404" as a span within it; or just visually link them.

## Other issues
4. Google Fonts are an external dependency. Fallback is fine (Georgia/mono), but Space Mono fallback shifts layout. Add `font-display:swap` is already set via URL, so low risk.
5. Contrast: crust #7a3f17 on cream is about 7:1, fine. Cream on kraft (brand line, ink on kraft) is about 6:1, fine. Buttons are 48px, good.
6. Path chip shows the full file:// path when opened locally. In production it shows the real path. Fine, but say so in the README so judges are not confused.
7. The live status is computed in the visitor's timezone, not the bakery's. Someone viewing from elsewhere may see "Open right now" wrongly. State that risk in the pitch, or label it "(local time)".
8. Edge-case copy: `day===0` branch is unreachable for Sunday evening ("Opens 7am tomorrow" says tomorrow is Monday, which is closed). Bug. Fix (1 min): after 2pm on Sunday show "Closed Mondays: opens Tuesday 7am."
9. 1280x800: ticket is capped at 420px so it floats in a big kraft field. Fine but empty. Scale the 404 or add the loaf illustration.
10. Reduced motion is handled (animation only under no-preference). Passes.

## Guessing the hidden signature criteria
- Ines (brand): "Would I put this on the shop door?" Partial. Palette good, no bakery imagery.
- Theo (content): "Does the copy sound like a person, not a system?" Mostly yes. The headline says "can't find", good. Sunday bug could hurt.
- Priya (front-end): "Self-contained, graceful without JS or fonts?" Mostly yes. Nav works without JS. Links to /menu and /hours are assumptions.
- Sam (accessibility): "Keyboard focus, contrast, motion, no reliance on colour." Focus ring is visible; contrast fine. Live status is not announced (no aria-live), which is a nice-to-have.
- Dana (customer): "Can I see if they're open in two seconds?" Borderline. Hours are present but small and last. See fix 1.

Survives: reduced motion, 375 width (once centring is confirmed), self-contained. Weak: concept, sense of place, hours prominence.
