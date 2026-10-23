# Crumb & Co. 404 - "Scored"
Open index.html in a browser. The mistyped URL is scored onto a sourdough loaf.
- index.html: the whole page (inline CSS, JS, SVG).
- Path is read from location.pathname and set only with textContent (no innerHTML); last segment, uppercase, 12 chars max.
- Reduced motion: the one fade-in is disabled under prefers-reduced-motion.

## Known issues
- Menu link assumes /menu exists on the real site; Hours now points to #status on this page.
- Loaf is still a simple ellipse (five score marks added, no crust texture).
- Google Fonts loads externally; Georgia is the fallback.
- Live status uses the visitor's local clock, not the bakery's time zone.
- Lead line is one fixed phrase, not varied by path.
