# Plan - Team Bare Wire (Theo, Producer)

## Decision (one sentence)
We ship **Ines's inverted-crema "scar" rings**: a tawny crema field in a dark cup, where every second a roast-dark drop punctures the crema and a dark ring opens and heals closed, with Kenji's slow 5s bloom-swell of the field as the second clock underneath. Landing stays at the centre.

## Beat sheet (5.0s cycle, one component, 5 identical rings)
Every ring has the same 5s keyframes; ring i has delay -i seconds. Ring life is the first 32% (1.6s), the rest is invisible, so at most two rings overlap and every ring is phase-locked to the 5s clock.

| t (per ring) | What happens |
|---|---|
| 0.00s | Drop lands: ring is a dark dot (scale 0.06, opacity 0 -> 1 by 0.12s) |
| 0.12-1.00s | Dark scar opens outward to ~92% of the field radius, ease-out (cubic-bezier(.2,.6,.3,1)), stroke stays constant |
| 1.00-1.60s | Crema heals it from the outside in: opacity 1 -> 0 while the scale finishes opening |
| 1.60-5.00s | Ring is idle (other rings are working) |

Field bloom (separate 5s clock): scale 1 -> 1.04 at 2.5s -> 1 at 5s, symmetric ease-in-out, so 0s equals 5s. Global beat: landings at 0,1,2,3,4s.

## Why it beats the alternatives, by rubric criterion
- **Concept (20):** Inverted physics (dark scar on light crema, healing) is the one idea a ripple on a dark pool lacks. Kenji's rotating landing and Ruth's teardrop add ownability via motion we cannot show at 120px. Scars plus bloom is of coffee, and costs no new element.
- **Motion (25):** One 1 Hz landing plus a 5s swell: steady, no fill, no fake finish, no hold longer than a beat. Kenji's 72-degree landings make the pentagon read as busy and look less steady. Ruth's 0.4s teardrop is a flicker.
- **Craft (20):** Seven shapes total (cup rim, field, 5 rings), transform + opacity only. Kenji's per-ring rotate/translate wrappers double the nodes. Ruth's non-uniform scale distorts strokes.
- **Clarity (20):** At 120px a big warm disc with a dark ring leaving the centre reads as "something is being poured into my coffee" in one second. Teardrop detail is a 7px speck; rosette is mush.
- **Pitch (15):** One sentence: "a drop breaks the crema and the crema heals it", plus honest risks.

## Rejected, and who dissented
- **Kenji's 72-degree rotating landing:** rejected for node count and 120px clutter (overlapping offset rings). Kenji dissents; he thinks the pentagon is our only unique motion. Fair point; if the build finishes early and looks clean at 120px with a 6-8px offset, he may try one variant, but the default ships centred.
- **Ruth's viscous teardrop and two-tone ring:** rejected as sub-pixel at 120px and needing non-uniform scale. Ruth dissents strongly and says I am rewarding the simplest thing. I keep her aria-label, hidden "Loading" text, designed reduced-motion state, and her warning about dark-on-dark visibility (it is why the field is light).
- **My bloom-swell hybrid:** folded in. Its core (bloom as second clock) survives; I am dropping my own "drop colour shift".
- **Ines's grain-in-ring-edge fallback:** cut. Ines dissents mildly; the inversion carries the claim.
- Honest open risk: a scar ring can still read as a ripple to Henrik. That is the pitch's job to own.

## Build spec
Owner: **Kenji** builds both files. **Ines** reviews concept fidelity (inversion, constant stroke, no extras). Ruth checks reduced motion and a11y. Theo checks the beat sheet against the file.

### build/index.html (single file)
- `:root` custom properties: `--roast:#2B1810; --cup:#1B120D; --crema:#C98B4E; --paper:#F4EBDD; --beat:1s; --cycle:5s;` Page bg `--paper`.
- Component: one inline SVG `<symbol id="loader">` or one shared markup block, `viewBox="0 0 100 100"`, instantiated twice via `<use>` or duplicated by a few lines of identical markup. Both instances same class, sized by CSS: `.inst{width:120px;height:120px}` and `.splash{width:100vw;height:100vh}` side by side (flex, splash `flex:1`, instance fixed). Splash scales the SVG with `preserveAspectRatio="xMidYMid meet"`.
- Shapes: `circle.cup` (r 48, fill --cup), `circle.field` (r 42, fill --crema, bloom animation, `transform-origin:50px 50px; transform-box:view-box`), five `circle.ring` (r 42, fill none, stroke --roast, stroke-width 3, `vector-effect:non-scaling-stroke`, `will-change:transform,opacity`, style `--i:0..4`).
- CSS: `.ring{animation:scar var(--cycle) infinite both;animation-delay:calc(var(--i) * -1s)}`; keyframes `scar`: 0% scale .06 op 0; 2.4% op 1; 20% scale .92 op 1 (ease-out); 32% scale 1 op 0; 100% scale 1 op 0. `.field{animation:bloom var(--cycle) cubic-bezier(.45,0,.55,1) infinite}`; keyframes bloom 0%/100% scale 1, 50% scale 1.04. `animation-duration: 5s` literal in both.
- Only `transform` and `opacity` animate. No filters, no blur, no box-shadow animation. Max two easing curves.
- Role/a11y: `role="img" aria-label="Loading"` on each instance plus `<span class="sr">Loading</span>` hidden visually.
- `@media (prefers-reduced-motion: reduce)`: rings static (ring 0 scale .45 opacity .55; ring 1 scale .8 opacity .3; rings 2-4 `display:none`), no scale animation, field and ring 0 do a slow 5s opacity breathe (field .88 <-> 1, symmetric, 0s = 5s). The still is a composed picture: warm field with two scars.
- Preview toggle: a button toggles `data-motion="reduce"` on `<html>` and the same rules apply via `:root[data-motion="reduce"]`; duplicate the reduced rules once with a shared selector list. JS limited to that toggle and a replay (remove/re-add class or `animation` reset).
- Acceptance checks: frame at 0.0s equals frame at 5.0s; at most two rings visible at once; ring stroke stays 3 CSS px-ish at both sizes; no layout property in `@keyframes`; opens by double-click with no network requests.

### build/README.md
Required sections: concept (one sentence), palette (four hex values and roles), timestamped beat sheet (the table above: 0.00 landing, 0.12-1.00 open, 1.00-1.60 heal, five landings at 0/1/2/3/4s, bloom peak at 2.5s), animated properties (transform, opacity only), loop closure (rings phase-locked by -i seconds so frame 5.0 = frame 0.0; bloom symmetric), reduced-motion behaviour, browser caveats (`vector-effect: non-scaling-stroke` under CSS transform; `transform-box: view-box`; test Safari).

Scope guard: nothing beyond this spec. If a detail is not listed, it is cut.
