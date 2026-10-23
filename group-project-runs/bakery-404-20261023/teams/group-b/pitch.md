# Scored - Crumb & Co. 404

**Hook:** Every other 404 hides your typo. Ours bakes it into a loaf.

## The idea
A baker scores bread before it goes in the oven. Our 404 scores the visitor's mistyped URL onto a sourdough loaf, so the error becomes the artwork. A plain "Page not found" headline, live hours and three big links keep them found.

## What the build does
One self-contained index.html. It reads location.pathname, decodes it in try/catch and sets it with textContent only. The last segment (uppercase, 12 characters max) rides an arc on an SVG loaf with five score marks; the full path appears below as wrapping plain text. The lead reads "That page has sold out. Nothing in the oven at this address." A status line uses the visitor's clock. Home, Menu and Hours are 56px-tall buttons, placed above the loaf. The fade-in stops under prefers-reduced-motion.

## Why it wins
- **Recovery (25):** headline, status and links come first, before the art.
- **Place (20):** scoring is real bread craft; palette and voice are Crumb & Co.
- **Concept (15):** one sentence, and no other bakery can paste it.
- **Craft (25):** one file, no fixed widths, focus rings, Georgia fallback.
- **Pitch (15):** we name the weak spots below.

## Honest risk
- The loaf is still a flat ellipse with no crust texture.
- Menu assumes /menu exists on the live site.
- Status uses the visitor's timezone, not the bakery's.
- Fonts load from Google; Georgia is the fallback.
- The lead line is fixed, not varied by path.
- The review captured 1280px only; 375px was not captured.
- Cut: animated scoring, steam, a week table.

**Close:** Give us the typo. We'll give them bread, hours and a way home.
