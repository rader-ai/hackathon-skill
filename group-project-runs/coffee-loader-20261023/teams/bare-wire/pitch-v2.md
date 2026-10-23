# Bare Wire v2 - Crema Scar Loader

**Hook: a drop breaks the crema, and the crema closes the hole.**

Round 1: we called this "the inverse of a ripple" and drew a ripple. Henrik, Mara, Sun and Rosie caught it. This pitch claims only what build-v2 does.

## What it does
Six shapes: handle, cup, crema field, two scars, one glint. Every 2.5s a dark disc opens in 0.3s, holds 0.5s, then shrinks away over 1.7s. The second disc is the first, half a loop later, offset. Both are closed at the 5s seam. The hole shrinks rather than being filled; it reads as settling.

## What we took
- **Henrik Vale:** deleted the growing heal disc. The wound closes; no second ring spreads.
- **Mara Okafor:** scar capped at .55, so it never touches the cup wall.
- **Sun Park:** a larger, held scar, legible at 120px.
- **Amara Diallo, one point:** a 75ms fade-in, so nothing pops.
- **Ruth, our skeptic, overruled Mara's colour:** #6B4226 gives about 3:1 on crema; Mara's #8A5A33 gave about 2:1.

## What we refused
- **Amara's five clockwise scars:** more pulses and nodes, and clockwise travel is a spinner's grammar. We want calm.
- **Rosie Tran's falling stroke:** a second subject outside the cup. We enlarged the one we have.
- **Sun's heal rim and `<use>`:** the heal is gone, and `<use>` risks Safari shadow-tree bugs.
- **Mara's one scar per 5s:** two drops give a beat you can feel.

## Honest risk
- Chromium headless only. Safari and Firefox untested; no performance profile.
- Two landings per 5s may still read as a gentle pulse, not a state change.
- The 2.5s beat splits Henrik and Mara; we judged it.
- A bare field shows for about 0.1s at each handoff.
