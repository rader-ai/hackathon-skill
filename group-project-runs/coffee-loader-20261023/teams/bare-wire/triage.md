# Rematch R1 - Triage (Theo, Producer)

Placed 2nd of 3 (73.5). Weakest rubric lines: Glanceability 5.4, Motion 5.8. Strongest: Craft 7.6 and Sun's signature (9). Four of five judges independently said the same thing about our v1: at 1 Hz it reads as a ripple / sonar pulse, and the heal is too faint at 120px. The pitch said "inverse of a ripple"; the code (scar .05 to .8, heal .03 to .8 a beat later) drew a ripple. That is our fault, not theirs.

## Judge notes

| Judge | The fix (short) | Call | Why |
|---|---|---|---|
| j-henrik-vale | Delete the growing .heal disc. Scar opens fast (.05 to .55 in 0.25s), then shrinks to 0 over 2.25s so crema visibly closes the hole. Beat 1s to 2.5s, two off-centre drops per loop. | **Accept** | It is our concept done honestly: the crema heals the scar by closing it, not by drawing a second ring. It also deletes a node. 2.5 divides 5, so the seam survives. |
| j-mara-okafor | One scar per loop (5s), softer mid-roast #8A5A33, cap scale .45, heal lead 0.3s. | **Partial** | Take the softer scar colour and the cap (nothing touches the cup wall). Reject one per 5s: Henrik's two per loop gives a pulse you can feel, and Mara's own seam criterion is met by both. No heal disc left to lead. |
| j-amara-diallo | Five scar/heal pairs on delays of i seconds, stepped 72 degrees clockwise, fade-in 0.4s. | **Reject** | Five scars is more pulses and double the nodes, the opposite of calm, and it is Kenji's pentagon that I cut in v1 for clutter. Clockwise travel is a spinner's grammar. Accept only her point that fade-in must not pop: opening on 0.25s ease-out from opacity 0 is no pop. |
| j-rosie-tran | Add a crema drip stroke above the cup falling in once per beat. | **Reject** | A 7-10px stroke sitting on the paper outside the cup is a second subject, and Ines already refused the falling drop. The fix for "reads as a static cup" is a bigger, slower, held scar (Henrik + Sun), not another element. Her keep (top-down cup, no rotation) stands. |
| j-sun-park | Scar to .95 and held opaque 20-85%, heal delayed to 35%, rim ring on heal; replace pasted second SVG with symbol+use. | **Partial** | Take: scar bigger and held visible so a dark hole is legible at 120px (we use .55 hold then close; .95 would hit the cup edge, and Mara says cap it). Reject: heal disc and rim (Henrik deletes the heal), and `<use>` (warm-hands' Safari shadow-tree risk, flagged by two judges). Take the intent: halve the markup with one SVG instance. |

Net: Henrik's physics, Mara's colour and cap, Sun's legibility and lean-ness. Amara and Rosie rejected with reasons.

## Steal

None. The only candidate was the-glitch's gravity-eased falling drop (Henrik praised it), but our concept starts at the surface; a drop in flight is Rosie's fix by another name, which I rejected. warm-hands' held, composed reduced-motion pose is nice, but ours is already one scar breathing; I will not average toward the winner.

## Plan (build-v2/, in order)

1. Kenji: copy build/ to build-v2/. Keep palette, cup, handle, crema field, glint, bloom, reduced-motion toggle, replay, a11y labels.
2. Kenji: delete `.heal` circles (CSS + both SVGs). Final shape count: cup, handle, field, scarA, scarB, glint (6, still fills only for animated parts).
3. Kenji: one `@keyframes scar` on a 5s cycle. Scar A active 0-50%: 0% scale .05 op 0; 2% op 1; 10% scale .55 op 1 (cubic-bezier(.2,.6,.3,1), ease-out); 50% scale 0 op 1 then op 0 at 50.1% (closing is ease-in-out, ease-swell curve). Scar B = same class, `animation-delay:-2.5s`, different offset. Both scale 0 / opacity 0 at 0% and 100%, so frame 5.0 = frame 0.0.
4. Kenji: offsets: A `translate(5 4)`, B `translate(-6 -3)`. Scar fill `#8A5A33` (mid-roast, replaces --roast for scars only). Cap scale .55 so the hole never reaches the cup wall.
5. Kenji: markup. One SVG instance. 120px and splash views share it: a CSS-only size toggle (checkbox + `:has`, no `<use>`, no new JS beyond replay and the reduced-motion toggle). If that proves fragile, keep two pasted copies and say so in the README.
6. Kenji: reduced motion unchanged in spirit: field breathes .88 to 1, one half-closed scar breathes .25 to 1 over 5s. Update selectors to the new class names, in both the media query and the data-motion block.
7. Ruth: check at 120px that the closing hole reads as "settling", the reduced state still says "working", and no element changes abruptly more than 3 times a second.
8. Kenji + Ines: rewrite README and pitch: drop "inverse of a ripple"; say "a wound that closes". Add honest notes: still not profiled, Safari and Firefox untested, 2.5s beat is a judgement call between two judges' advice.
9. Theo: check build-v2 against this list. Anything not here is cut.

## Retro

1. We agreed too fast: all four of us drew the same ripple in round 1, and I called it "the floor" instead of testing whether 1 Hz was calm. Nobody watched a loop at 120px before we locked the beat.
2. The pitch claimed an inversion the code did not draw (heal grew outward like a second ripple), and I reviewed the beat sheet, not the pixels.
3. Round 6 fixed the red-team's list but never asked what the judges would call it; Kenji polished easing while the concept stayed one gesture deep, and I cut the strange detail (the offset landing) a second time.
