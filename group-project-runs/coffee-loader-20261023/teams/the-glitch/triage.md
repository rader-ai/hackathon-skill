# Rematch R1 - Triage (Omar, Producer)

## The call on the provocation
Four of five judges want the slip and the orange gone, and they are right on the evidence: the slip is the lowest-scoring thing we shipped (Mara 46.5, Henrik 50.5), and Rosie's 7 on glance-to-meaning came from the drop and count, not the glitch. But our reason to exist was never "a stripe that looks broken". It was "a loader that counts instead of glides". That survives. So: **change the provocation, do not drop it.** Old convention broken: "progress is smooth" (done with a UI-style glitch, orange). New: "progress is discrete and the coffee itself keeps the score" (done with coffee). Each landing visibly lightens the crema surface one step; once per loop the drip thickens into a 0.5s pull (Henrik's espresso-gush) at 3s, where the slip used to be. No orange, no sideways motion, no hard cuts. If a judge calls the gush "a hiccup", it is a real one a barista has seen. Risk, stated: five accumulating steps could read as a fill; mitigation is a small range and a slow settle back in beat 5 so nothing ever completes.

## Judge notes

| Judge | The fix | Verdict | Why |
|---|---|---|---|
| Amara | Delete band slip + orange ghost (or cap 2px/0.6s); drop fades 0.15s instead of hard cut; pip fade-in 0.3s | Accept (all) | Highest-confidence fix on the table; our calm score was the lowest-hanging fruit. Pips themselves go (see Henrik), so the 0.3s fade moves to the crema steps. |
| Henrik | Delete pips and cup band; crema steps on the surface ellipse inside the rim; optional real espresso-gush hiccup | Accept (all), gush as the new provocation | Only note that fixes concept (+3 expected); makes the swap test fail for a fintech logo, and keeps a provocation we can defend. |
| Mara | Remove whole orange layer (pips, slip, ghost); drop and ring are the only clock | Partial | Orange, slip, ghost, pip-reset: all gone. Not "only clock": the crema step state replaces the pips as the count, with a settle (not a reset) in beat 5 so it cannot read as a false finish. |
| Rosie | Still band and no ghost at 120px only | Accept, superseded | We are deleting both at every size, which beats a size-specific patch; one markup stays easier to verify. |
| Sun | Remove hard cuts in drop; squash-fade into ring; ease-in at spout; slip to 4px after the 3s landing | Accept, minus slip | Drop becomes scaleY .5 / scaleX 1.3 fade into the ring, fade-in from scale .3 over 0-8%. Slip removed, so no 4px. |

## Steal
**bare-wire (build/index.html):** the slow 5s breathe on the crema field (Henrik's "keep"). It fits because our surface ellipse now carries the count steps; a barely-there 5s opacity/scale breathe underneath means no frame ever looks stalled, and it keeps the loop on one shared 5s clock. Credit: bare-wire.

## Plan for build-v2/ (Pablo builds; Zara reviews fidelity; Omar checks vs this table)
1. Copy build/ to build-v2/. (Pablo)
2. Delete the orange layer: pips, pip/pip-soft keyframes, band, ghost, slip/ghost keyframes, `--slip`, `--ghost`, orange variable, the cup-body clipPaths. Stripe off the cup. (Pablo)
3. Rework drop: fade in from scale .3 over 0-8% at the spout, ease-in fall, squash (scaleY .5, scaleX 1.3) and fade 55-65% into the ring; ring opens from opacity 0 over 0.1s. No instant opacity changes anywhere. (Pablo)
4. Crema steps: a lighter crema ellipse inside the rim, opacity/scaleX in five steps (one per landing, 0.3s ease each), range small (~.35 to .75); beat 5 eases back to the start across its second half so frame 5.0 equals frame 0.0 in value and slope. (Pablo)
5. Espresso pull: at 3.0-3.5s one drop stretches (scaleY) into a short continuous stream, then returns to normal drops; ease in and out, on the same keyframes as the drop, no new properties. (Pablo)
6. Stolen breathe: 5s opacity breathe on the surface, +-.04. (Pablo)
7. Reduced motion: keep the slow cross-fade of the crema steps as the progress cue; no stream. (Pablo)
8. Verify: only transform/opacity in keyframes, every duration divides 5s, frames 0 and 5.0 identical, screenshot at 120px and splash for the 3.0-3.5s pull frames (we never captured the glitch frame in v1). Note any untested surface in README. (Pablo, then Lena)
9. Pitch rewrite around the new provocation and an honest risk paragraph (accumulating steps vs fill; pull vs hiccup). (Zara, Omar fact-check)

## Retro
- We shipped a 9px-then-6px glitch on judgement and never captured the glitch frame; a dial we refused to test is a guess, not a bet.
- We put the provocation in UI chrome (orange pips, misregistered stripe) instead of in coffee, so the judges who weigh ritual and calm both penalised it.
- The skeptic named "reads as a defect" in round 2 and again in round 5; we fixed the size and kept the idea. We should have asked whether the idea earned its place.
