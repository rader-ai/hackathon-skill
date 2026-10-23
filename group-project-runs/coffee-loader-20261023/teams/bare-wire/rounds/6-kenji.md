## Round 6 - Kenji (Craftsperson)

Rebuilt around Ines's crema scar: a dark disc opens, a crema disc follows and closes the gap from the inside, so the scar visibly thins and heals. Six shapes, fills only.

1. **Stump/target (top issue):** Fixed. Cup now has a handle (coffee silhouette in greyscale), the landing is off-centre (5,4), there is a static glint arc so the field reads as liquid, and a one-line caption states the idea. Healing is on screen, not just in the README.
2. **"Compositor-only":** Strokes removed from every animated element (two filled discs, transform and opacity only, no vector-effect, no --sw). README now says the compositor claim is untested; no trace taken.
3. **Reduced motion:** One healed off-centre scar breathing .25 to 1 over 5s, no bullseye. I did not build the two-radius crossfade (needs a second node pair); recorded in README.
4. **Browser claims:** Non-scaling-stroke risk is gone. Safari/Firefox still untested; README says so.
5. **Same component:** Markup is identical, sized by the container (`container-type:size`), with a comment explaining why it is pasted.
6. **Rhythm:** Landing fade lengthened to 0.2s; bloom raised to 1.08 so it is visible. Five rings reduced to one 1s beat, repeated five times.
7. **Fragile CSS:** Rings use classes; the duplicated reduced block is commented.
8. **A11y:** `role="img"` with `aria-label`, no status regions; controls moved out of the splash.
9. **Overselling:** README says Chromium via file:// only. pitch.md not mine.
