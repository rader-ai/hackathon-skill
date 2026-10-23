## Round 1 - Ines (Visionary)

One drop. One ring. That's the loader.

Top-down cup, a dark disc. Once a second a drop lands in the centre and a crema ring walks out to the rim, fading as it goes. Five beats, five seconds, five identical rings. Because 1s divides 5s, the loop has no seam: frame 5.0 is frame 0.0. I did not hide the seam, I removed it.

I want a metronome, not a story. No fill level, no steam, no finish. Rosie sees something arriving, steadily, in one second. Sun gets transform and opacity only, about twenty lines of CSS.

My fear is the one Henrik will raise: ripples can be water. Three colours (roast, crema, paper) and the dark cup carry the claim. Theo, I know you'll want to cut anything extra. Good. Kenji, spend your time on the ring's easing curve and stroke weight at 120px, and nowhere else. Ruth, break the reduced-motion version if you can.

If someone proposes steam, I will leave the room.

Cold is not a flaw. Cold is clear.

## Round 1 - Theo (Producer)

Here is my pitch to you: Five Drops. Three shapes (disc, drop, ring), one second per beat, five beats per cycle. I counted what we can ship and I want it written on the wall: scope is the feature.

Why I like it: the loop closes by construction, because every beat is identical. No fake finish, because nothing fills. Transform and opacity only, about a dozen lines of CSS, and reduced motion is two static rings with one slow breathing opacity. Sun and Amara will have nothing to mark down.

Where I am nervous, and I would like you to push on it: ripples are not unique. Ines, you will want to strip it further; I think we are at the floor. Ruth, check my 600ms fades for anything that reads as pulsing. Kenji, please do not hand me nine easing curves; two is the budget. Ines, Kenji, if either of you has a strange detail that makes this ours rather than a meditation app's, put it on the table. I will probably argue to cut it, and I am telling you in advance that I might be wrong.

Open item: does the drop need its own colour shift, or is that scope creep? I say list it as "maybe," not "yes."

## Round 1 - Ruth (Skeptic)

I wrote "Metronome Drip": one drop, one cup, five identical one-second beats. Nothing fills, nothing resolves, so nothing can lie to the user. That is my whole argument. A loader that shows a full cup at 4.8s and then empties it has told the user a falsehood five times per cycle, and Mara will find it.

Rules I will defend in round 2: transform and opacity only, 1 Hz cadence (nowhere near flash thresholds), no dead frames longer than a beat, and a reduced-motion state that is designed, not frozen: static drop, single ring pulsing in opacity. I will also insist on aria-label plus hidden "Loading" text, since nobody else will.

Honest weakness, since someone must say it: I may be rewarding "inoffensive". A lone drip could read as a generic water ripple. If Ines or Kenji have a coffee-specific detail that fixes that without adding motion, I will listen. If it adds motion, I will push back.

Theo, I expect you to agree with the cuts. Kenji, please do not spend a day on the ripple easing curve.

## Round 1 - Kenji (Craftsperson)

I read the judges' brief and the thing that jumped out is Sun and Mara both say "find the seam." So I built the idea backwards from the seam. Pour-over, top-down, one stream spiralling out and back. Twelve drops, one keyframe pair, twelve negative delays. The spiral is never drawn, it just falls out of the stagger. Rotation is exactly 720 degrees in 5s so frame zero IS frame five. No seam to find because there is nowhere for one to live.

Ines, I know you'll love how few elements this is. Theo, it's a tiny scope: sixteen nodes. Ruth, no flashing, no fake finish, reduced-motion is a composed still spiral plus a slow breathe, not a frozen frame.

But I'll say it first before you do: the concept is one gesture. At 120px a trail of dots going in circles is awfully close to a spinner. If the bed and the rim don't carry "coffee", we lose Henrik. I'd like us to argue about whether the bloom (the bed swelling) is enough, or whether it needs one strange, specific coffee detail. I'll tune the easing either way. That part I'm sure about.

## Round 2a - Ines (Visionary)

Three of us drew the same ripple. Agreement that cheap is a warning. Rival teams drew it too, and a ripple on a dark disc is water. Henrik will say so in one sentence.

So I change the physics, not the element count. Water ripples spread outward on a dark pool. Coffee does the opposite. Espresso is the dark thing, and crema is the light skin it lands on. A drop punctures the crema, a dark ring opens, and the crema slowly heals closed over it. So: tawny crema field, roast-dark drop, and each ring is a dark scar that widens and then fills in from the outside. Same one ring, inverted. No other loader on this panel's desk will have light-on-dark inverted this way, and it is true to the cup.

Where I'm stealing:
- Kenji's bloom, one slow 5s swell of the field (scale 1 to 1.03, symmetric ease). It is a second clock under the 1s beat, which answers Ruth's "ticky on a 30s wait". Nothing else of his; the spiral is a spinner, and he said so himself.
- Ruth's aria-label and hidden "Loading" text. She is right, nobody else will remember.

Where I'm refusing:
- Ruth's spout and ellipse. A tilted portafilter is mush at 120px and it is clip art.
- Theo's falling drop and his colour-shift trick. At 120px the drop is a 6% speck; the ring carries the beat. The drop is a dot at birth, nothing more.

Theo: this is the one strange detail. Do not cut it.

Cold was my flaw. Warm field, dark ring. That is the fix.

## Round 2a - Theo (Producer)

I'm withdrawing "Five Drops" as written. Three of us wrote the same ripple, and my own proposal said the real mistake was refusing to add one strange thing. The host is right. A bare ripple is a meditation app.

**Weak spots, by name.**
- Ines: two or three rings alive at once reads as sonar. Her "faint grain in the ring edge" fallback is exactly the detail I'd have cut, and I now think it's needed.
- Ruth: the spout, falling drop and clipped pool is the most to build. The drop is about 7px at 120px and falls for 0.4s, so it's a flicker. A ring on a tilted ellipse needs non-uniform scale, which distorts the stroke. "Clipped by pool edge" means a mask, so it isn't free. Her aria-label point is correct and we're stealing it.
- Kenji: it's the only idea that isn't a ripple, but twelve dots circling is a spinner at 120px, and he says so himself. The radius-near-zero frame is the seam frame, and it clumps.

**Can't be built well here:** Ruth's falling drop with clip, and any liquid-fill or steam idea.

**What wins:** Ines's metronome, with Kenji's bloom stolen. A ripple means liquid, which is water. A bloom means wet grounds rising, which is coffee. Each beat, the drop lands on a grounds bed (disc `scale` 1 to 1.04 to 1, one second) and a crema ring leaves it. Same 1s, five repeats, no seam. It adds one transform and no new elements.

I'd drop the spiral and the spout. Ruth's reduced-motion and aria work stay. I'll hold the line at four shapes. Kenji gets the bloom curve and nothing else.

## Round 2a - Ruth (Skeptic)

Three of us found the same ripple. That is not consensus, it is a coincidence, and the panel will see it on four other teams' screens.

Fatal flaws, no mercy:

- **Ines:** "Cold is clear" is the flaw. Two to three overlapping rings is sonar, and sonar is on every fintech and weather app. Her fallback, "a faint grain in the ring edge," is a retreat, not an idea.
- **Theo:** He refuses a strange detail on principle, so he has no ownership at all. His drop darkens crossing the disc edge, which is a trick to hide that dark-on-dark is invisible. Three shapes is a boast about scope, not a reason to look at it.
- **Kenji:** It is a spinner. Twelve dots circling at 120px is a spinner, and Rosie says "stuck" in a second. Henrik will smell the wrapper. The 1.04 bloom is invisible. The clumped seam frame is his own admission.
- **Mine:** My drop is #3A2316 landing in a #1B120D pool, so it vanishes the moment it matters. A 1 Hz tick may feel like a clock, not a pour. The aria-label is the only thing I got right and no judge scores it loudly.

Fight for this: keep the metronome, but make the drop the character. Espresso is viscous. The drop stretches into a slow teardrop (scaleY, transform only), hangs a beat, then lets go, and lands as a two-tone ring, crema outside and dark inside, tiger-striping. One static colour detail plus a slow fall, zero new elements. No other team's drop moves like honey.

Steal from Kenji: the warm palette and the reduced-motion still that reads as a composed picture. Kill the spiral.

I concede Ines owns the ring maths. I do not concede "inoffensive."

## Round 2a - Kenji (Craftsperson)

First, I concede my own spiral. Twelve 5px dots on a 120px box is a comet on a circle. Comet on a circle is a spinner, and Rosie would call it stuck. The stagger trick was clever, but the concept stayed one gesture deep, as I warned.

Ines, Theo and Ruth: you all drew the same centre-drop ripple. I agree it's the right unit at 120px, one fat ring with no fine detail. It is also the thing every rival team drew. Three craft faults first:

- **Theo and Ruth: the drop.** A 6% dot falling 0.4s is a 7px speck at 120px. It's invisible, and it's the only coffee clue you have. Ruth's spout is the same problem, sub-pixel detail.
- **Ines: stroke.** `scale()` on a stroked circle fattens the line 5x as it grows. That's not a ripple, it's a blob. Use `vector-effect: non-scaling-stroke`.
- **Everyone:** a centred ring is a bullseye. It's symmetric and says nothing.

**Steal:** Ines's 1s beat and five phase-locked delays. Ruth's aria label. Theo's two-easing budget.

**My one strange detail, zero new elements:** the drop doesn't land in the centre. Beat n lands at angle n x 72deg, on a small radius. Five landings is exactly one circular pour, so my spiral idea survives as a *ring of ripples*, not a dot trail. A wrapper `rotate(calc(var(--i) * 72deg))` plus a `translateY` offset. Same keyframe, same five delays, and it's still seamless: 5 x 72 = 360. The pentagon of overlapping rings is a barista's circular pour, and nobody else has it.

Reduced motion: the five rings freeze at staggered radii, a composed rosette, with a slow opacity breathe.

## Round 3 - Theo (Producer)

Decision: we build Ines's scar rings, with Kenji's 5s bloom underneath. Crema field, dark cup, a roast-dark drop breaks the crema every second, a dark ring opens, and the crema heals it closed. Centre landing, five phase-locked rings on one 5s keyframe, seven shapes in total, transform and opacity only.

Why this one: it is the only candidate where the physics is coffee, not water, and it still reads at 120px. Kenji's rotating landing is clever, but offset overlapping rings get busy at 120px and double the nodes. Ruth's teardrop is a 7px speck for 0.4s; I took her aria-label, her designed reduced-motion state and her dark-on-dark warning (that is why the field is light). Ines, the inversion is the strange detail, so I did not cut it.

Kenji dissents on the pentagon; Ruth dissents on "inoffensive". Both are noted in plan.md. Kenji, you build index.html and README.md exactly to spec. If it is clean at 120px, you may test a 6-8px landing offset, but the default ships centred. Ines reviews concept fidelity. Ruth checks reduced motion. Anything not in the spec is cut.

Full spec: TEAM/plan.md.

## Round 4 - Kenji (Craftsperson)

Built `build/index.html` and `build/README.md` to plan.md: seven shapes (cup, crema field, five scar rings), centred landing, five phase-locked rings on one 5s keyframe (delay -i s), 5s symmetric bloom, transform and opacity only, two easing curves. The 120px instance and the full-viewport splash are the same markup and classes, scaled by viewBox. Checked in headless Chromium: all 12 animations are 5000ms, ring state at t=10s equals t=15s, at most two rings visible, only transform/opacity in keyframes, ring clearly legible at 120px.

Deviations, all small:
- Stroke width is `var(--sw)` in screen px (3.6px at 120, 3% of the short viewport side on the splash) instead of a fixed 3, because non-scaling-stroke would otherwise leave a hairline on the splash.
- Markup is duplicated, not `<use>`, to avoid Safari shadow-tree animation quirks.
- Each instance is `role="status"` wrapping an aria-hidden SVG plus hidden "Loading" text, to avoid a double announcement.
- Reduced-motion rules appear twice (media query and `data-motion` toggle) since @media cannot share a selector list with an attribute selector.
- Landing offset variant: not attempted; centred ships. I still think the pentagon was our only unique motion.

## Round 5 - Ruth (Skeptic)

I found no bugs, and that is the problem. The loop is seamless (4999ms and 5000ms match). The toggle works. The media block is identical to the toggle block. No fake finish.

But safe is not good. The still frame looks like a tree stump or a target, and in greyscale Henrik will not see coffee. The scar-healing idea is in the README, not on the screen.

Two claims are shaky. `non-scaling-stroke` under an animated transform probably forces repaint, so "compositor-only" is overstated. Chromium is the only browser tested. The OS reduced-motion path I could only check by diffing the CSS, since the browser tool blocked file://.

The reduced-motion state is a static bullseye with a barely visible pulse. It is deliberate, but it says radar, not "working".

Fix in order: make the crema healing visible, replace strokes with filled discs, strengthen the reduced-motion cue. The rest is in redteam.md. Honest verdict: a 7 that could be a 9 if we dared one strange detail.

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

## Round 7 - Ines (Visionary)

I am selling one event: a drop breaks the crema and the crema heals it. That is not water physics, so it cannot be a swapped-colour ripple. I wrote the pitch only from what Kenji's Round 6 build does: six fill-only shapes, an off-centre landing, a 1s beat five times in a 5s loop, a 5s bloom, and a designed reduced-motion state. I named the risks plainly: Chromium only, no trace, and the healing is subtle at 120px. Honesty is the purist's edge.

## Round 7 - Theo (Producer)

Checked every claim against index.html and README. Cuts and fixes:
- "Every loader on earth" -> "Most loaders" (unprovable).
- "even in greyscale" cut: never tested.
- "fills only" -> transform/opacity on filled circles; handle and glint are static strokes.
- "never dark on dark", "no fake finish", "steady, calm" cut: unverifiable or filler.
- "reads at 120px and says working" cut: contradicts our own subtle-at-120px risk.
- "Reduced motion... healed scar" kept, trimmed.
Hook, structure and honest-risk section kept. Now under 400 words.

## Rematch R1 - Theo (Producer)

Four judges told us the same thing, so I am not arguing with it: at one beat a second, our crema scar reads as sonar. We said "inverse of a ripple" and drew two rings. My fault; I called that the floor in v1.

So I accept Henrik's fix whole. Delete the heal disc, open the scar fast, then let it shrink closed slowly. That is the crema healing, finally on screen, and it removes a node. Beat becomes 2.5s, two drops a loop, still dividing 5. Mara's softer scar colour and wall cap go in too.

I reject Amara's five clockwise scars (busier, spinner grammar, and I cut that pentagon for a reason) and Rosie's drip above the cup (a second subject outside the cup). Sun gets her legibility and her leaner markup, but no `<use>`; Safari risk.

No steal. I will not average toward the winner. Kenji builds; scope is the list in triage.md.

## Rematch R2 - Ruth (Skeptic)

**Brief check:** 5s loop and seam pass (A and B both scale 0 / opacity 0 at 0% and 100%; B's -2.5s puts it closed at t=0). Two holes: (1) reduced motion never says what happens to scar B. Shorthand `animation:` resets its delay, so both scars would breathe in sync. Add `.scarB{display:none}` in the media query and the data-motion block. (2) Step 5, the checkbox/`:has` size toggle, is fragility for a judge note we should not have taken. The 120px and splash views must be visible side by side. Keep two pasted copies.

**Overrule 1, Mara's colour.** #8A5A33 on crema #C98B4E is about 2:1, under the 3:1 non-text minimum, and it undoes Sun's and Rosie's "faint at 120px". Use #6B4226 (about 3:1). It is still softer than roast.

**Overrule 2, Rosie.** The plan does not answer "nothing reads as arriving". It halves the events (2 per 5s) and the scar only shrinks, which reads as a dot vanishing. No new element needed: (a) make the open 6% (0.3s), as Henrik said, not 10% (0.5s), and (b) hold at .55 for about 0.5s before the close, so the fast open and slow close read as impact then settling. (c) Pulse the existing glint .7 to 1 at 0% and 50%, so each landing has a cue.

**Steal: refuse the pride.** "Won't average toward the winner" is not a reason. Take warm-hands' reduced pose idea only if it needs no new node. Otherwise drop it.

**Accepted to please:** the 2.5s beat splits Henrik against Mara on a coin-flip. Say so in the README, and verify at 120px that the two-scar overlap (A's close ends exactly as B opens) leaves no dead frame.

Step 7 to run: no abrupt change more than 3 times per second.

## Rematch R3 - Kenji (Craftsperson)

Built build-v2/ from Theo's triage with Ruth's overrules. Deleted the heal discs: six shapes, one `scar` keyframe, scar B is the same class at -2.5s. Scar colour is #6B4226 (3:1). Open is 0.3s, hold 0.5s, close 1.7s, so something visibly lands and then settles. The glint pulses on each landing. Reduced motion hides scar B in both blocks (shorthand resets delay), keeps one breathing scar.

Dropped the checkbox size toggle; two pasted copies stay. I screenshotted headless Chromium at 13 moments of the loop at 120px: the hole reads clearly through hold and close, and the handoff at 2.5s has about 0.1s of bare field, not a dead frame. I changed nothing after looking. Safari and Firefox are untested and nothing is profiled.

## Rematch R4 - Ines (Visionary)

I deleted the claim before the judges could. v1 said "inverse of a ripple" and drew a ripple. v2 says only what the file does: a hole opens fast, holds, shrinks away. I wanted the whole idea in one verb, "closes", and checked each sentence against build-v2. I gave Ruth the colour; her 3:1 beats my taste for Mara's softness.
