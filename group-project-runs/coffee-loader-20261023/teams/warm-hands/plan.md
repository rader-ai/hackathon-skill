# Plan - Team Warm Hands (Round 3, Dev / Producer)

## Decision (one sentence)
Ship **"One Pour, by Hand"**: a top-down cup (hand-wobbled rim plus handle stub) where one crema spiral pours at a wrist-paced speed (net exactly one turn per 5s, never constant, never stalling) and leaves a thin broken coffee-ring stain on the cup that breathes with the cycle; no tally, no rings, no finish.

## Beat sheet (5s, one loop, nothing resolves)
Three always-running layers, all periodic over exactly 5s:
- **Spiral pour**: outer group rotates linear 0 to 360deg over 5s (the steady progress signal). Inner group sways -8deg to +8deg and back, ease-in-out, over 5s (the wrist: about +/-14% speed variation, continuous at the wrap).
- **Crema bloom**: a lighter disc under the spiral breathes opacity .55 to .95 to .55, sine-ish ease, once per cycle.
- **Coffee-ring stain**: one static broken ring on the cup lip plus a copper thumb-smudge; the ring's opacity breathes .55 to 1 to .55, offset so it peaks as the bloom ebbs.

| t | What the eye gets |
|---|---|
| 0.0s | Already mid-pour. Spiral at 12 o'clock, wrist about to speed up. Bloom mid-breath. No entrance. |
| 0.0-1.25s | Wrist accelerates out of the turn; bloom rises. |
| 1.25-2.5s | Fastest sweep (about 14% over mean); bloom crests at 2.5s. |
| 2.5-3.75s | Wrist eases off; bloom ebbs; stain brightens. |
| 3.75-5.0s | Slowest sweep, then speeds back to mean; spiral returns to 12 o'clock exactly as sway returns to 0. Frame 5.0 equals frame 0.0, velocity matches. |

## Why it beats the alternatives, by criterion
- **Concept (20):** pour-over bloom plus a cup rim and handle says "coffee" in one glance (Callum's point; Henrik hates "near" coffee). The wrist-paced pour and the stain are rituals and traces of a barista, not a face. Tally is a counting idea and Rosie would read "counting", not "coffee".
- **Motion (25):** one constant sweep for steady progress plus one slow breath, with a wrist sway that makes it feel hand-poured. Tally has a fifth-slash then fade-together, which is a mini finish and a one-second metronome Amara could hear as a countdown. Bloom's 6% scale and riso offset are invisible at 120px.
- **Craft (20):** about 10 elements, only transform and opacity, nested rotate groups, one viewBox SVG scaled by CSS. No filters, no blend modes (multiply muddies the browns).
- **Clarity (20):** cup + turning cream spiral on dark coffee reads in a second at 120px. Reduced motion has a designed state (below), not a frozen frame.
- **Pitch (15):** a single story: "a person's wrist and a wet mug ring", with honest risk (spiral could read as a spinner, mitigated by the cup).

## Rejected, and who dissented (honestly)
- **Dev's Tally sleeve (mine):** rejected by me. I wanted a hand in it and still do, but the fifth-slash plus fade is a finish beat, the tick is a clock, and it needs the reader to decode "counting" before "coffee". Callum and Agnes were against it; Marisol was lukewarm. I kept its soul as the stain (evidence of a person).
- **Callum's five rings:** cut to zero. Agnes and Marisol both called it a bullseye / sonar ping, and Callum himself agreed. Kept: his wobbled rim, handle stub, closed ease.
- **Marisol's Bloom and riso misregistration:** the static 2-3% offset is 3px at 120px and reads as a bug; Marisol dissents, still believes it is the best idea on the table. Compromise: copper only as a smudge beside the stain, not an offset duplicate. Her stain won.
- **Agnes's pure One Pour:** the disc plus spiral is a spinner; Agnes herself conceded it. Her constant speed, three-shape discipline, and wrist-paced variation are the engine of the winner. She dissents mildly on the handle (she thinks it is cute); overruled for Rosie's sake. If the handle looks like clip art at 120px, Callum may cut it to a 2-stroke notch.
- **Dev's Drop:** dead on arrival as a side view and a clock.

## Build spec (owner: Callum; Marisol reviews concept fidelity)

### build/index.html
Single file, no external anything. ONLY change animation by CSS; JS permitted solely for the replay and reduced-motion preview toggle.
1. `:root` custom properties first: `--paper:#F6EBDD; --glaze:#FBF5EC; --espresso:#2B1A12; --crema:#E9C9A0; --caramel:#E0A96D; --sienna:#B5532B (spiral tail and smudge); --roast:#7A4527 (stain); --cycle:5s; --ease:cubic-bezier(.45,.05,.35,.95)`. Dark scheme override optional under `prefers-color-scheme`.
2. **One reusable markup:** an `<svg viewBox="0 0 120 120" class="loader" role="img" aria-label="Your coffee is being made">` cloned twice by the page: inside `.box` (fixed 120x120px) and inside `.splash` (100vw x 100vh, svg `width:min(70vmin,100%)`). Same CSS classes; side by side (flex, splash fills the remaining width at 100vh via two panes sharing the viewport; or use `<use>` of a hidden `<symbol>` to guarantee identical drawing). Both must use the same `<symbol id="pour">` so they are literally the same component.
3. Elements (budget about 10): cup rim (hand-wobbled path, glaze fill), handle stub (path), coffee surface (espresso ellipse circle), crema bloom (circle), spiral group (outer `<g class="sweep">` containing inner `<g class="sway">` containing one spiral path about 1.75 turns, round caps, stroke-width about 5 units, tail in sienna via gradient-free second path or stroke-dasharray), coffee-ring stain (broken path, roast colour), thumb smudge (one small ellipse, sienna, low opacity). No speckles, no steam, no bubbles.
4. Animation, all `animation-duration:5s; animation-iteration-count:infinite;`:
   - `.sweep { animation: sweep 5s linear infinite; transform-origin:60px 60px; } @keyframes sweep { to { transform: rotate(360deg) } }`
   - `.sway { animation: sway 5s var(--ease) infinite; transform-origin:60px 60px; } @keyframes sway { 0%,100% { transform: rotate(-8deg) } 50% { transform: rotate(8deg) } }`
   - `.bloom { animation: bloom 5s ease-in-out infinite; } @keyframes bloom { 0%,100% { opacity:.55 } 50% { opacity:.95 } }`
   - `.stain { animation: stain 5s ease-in-out infinite; animation-delay:-2.5s } @keyframes stain { 0%,100% { opacity:.55 } 50% { opacity:1 } }`
   - Use `transform-box: view-box` where needed; add `will-change: transform` on `.sweep` only and `will-change: opacity` on `.bloom` only.
   - Only `transform` and `opacity` animate. Banned: filter, mix-blend-mode, box-shadow animation, stroke-dashoffset, any layout property.
5. `@media (prefers-reduced-motion: reduce)`: kill sweep and sway (`animation:none`), set spiral rotation to a composed pose (about -20deg); bloom and stain do a slow opacity pulse (5s, .6 to 1, ease-in-out, stain out of phase). Result: a held pour with a visibly breathing surface. Not a frozen random frame.
6. A small toggle (`<button>` or checkbox, a few lines of JS that adds a `.rm` class on `<html>`) to preview reduced motion; every reduced rule must be duplicated under `.rm` (or written once via a shared custom-property switch), and a replay button that restarts animations (remove and re-add a class). Nothing else in JS.
7. Contrast and layout: labels for both panes ("120 x 120" and "splash"); page works at phone width; no scrollbars; background uses `--paper`.
8. Verify before handoff: view at 120px with eyes half-closed. If the cup reads as a plate or the handle as clip art, simplify, don't add. Check frame 0s vs 5s are identical (pause at -0.001s offsets), and that no layout property appears in any @keyframes.

### build/README.md
Sections: concept (one sentence), palette table (hex + role), **beat sheet with timestamps** (the table above, 0.0 / 1.25 / 2.5 / 3.75 / 5.0s), animated properties (transform: rotate x2; opacity x2), how the loop closes (rotation is 360deg in 5s; sway and opacity keyframes start and end at the same value and share the 5s period; velocities match at the wrap), reduced-motion behaviour (as above), browser caveats (transform-box / transform-origin in SVG on older Safari; mention the fallback `transform-origin:60px 60px`), replay toggle note.

### Not in scope (cut list, Callum: say no)
No bubbles, saucer, steam, grounds speckle, riso offset, tally, rings, face, sound.
