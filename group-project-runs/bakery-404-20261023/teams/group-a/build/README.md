# Crumb & Co. 404 - The Ticket Stub
Open build/index.html in any browser (works offline except Google Fonts).
- index.html: the whole page (inline CSS/JS), a queue-ticket 404 with echoed path, hours stub, and Home/Menu/Hours links.
- README.md: this file.

## Known issues
- /menu and /hours-style links assume those routes exist; Hours now jumps to the on-page hours.
- Open/closed status uses the visitor's timezone, not the bakery's.
- Path chip shows the full file:// path when opened locally.
- Google Fonts are external; fallbacks shift layout slightly.
- Loaf is a simple SVG; no richer illustration yet.
- 1280px view leaves empty kraft around the ticket.
