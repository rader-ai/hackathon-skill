# Zara's Proposal: "TICK"

## One sentence
An espresso machine as a step sequencer: one hard-edged drop falls every second into a flat cut-paper cup (five ticks per loop, a lit pip hopping across five positions), and once per cycle the crema band tape-slips sideways and snaps back on the beat, so the loader admits a glitch and is calmer for it.

## The convention I'm breaking
Every loader on earth is smooth, continuous, and pretends nothing ever goes wrong. TICK is discrete. It counts. It moves in clicks like a Teenage Engineering sequencer, and it shows the "glitch" on purpose so the user's brain files it as texture, not as a crash. The tick is also the anti-stuck device: every second something visibly happens, on a rhythm you can feel.

## Moment by moment (5s loop, 1s per beat)
Look: Saul Bass cut-paper. Flat shapes on an espresso-dark field, a crema-coloured cup in side view, a burnt-orange drop, a row of five pips under the saucer.

- **Every second (beats at 0, 1, 2, 3, 4s):** the drop swells at the spout (scale, 0-15%), falls with an ease-in (15-55%), hits the surface, and a flat ellipse ring expands and fades (55-90%). A pip lights on the downbeat. The pip row is a chaser (one lit at a time), not a bar. Position 5 hops to position 1 with no gap, so there is no "full" and no "done".
- **0-3s:** plain and legible. Drop, ring, pip. Tick, tick, tick. A half-awake person reads "coffee is dripping, and it's counting".
- **3.0-3.4s (the glitch):** the crema band at the cup's lip slips 6% sideways in two steps (like a VHS tracking error), with a ghost offset copy in the orange accent (a second layer at 35% opacity, translateX). The 3s drop lands exactly as it re-registers: the drop is what "fixes" it. 0.4s total, only horizontal translation, no flashing, no brightness change.
- **3.4-5s:** back to plain rhythm. Pip 5 hops to pip 1 on the 5.0s downbeat, which is identical to the 0.0s frame. Seam is invisible because beat 5 and beat 0 are the same beat.

The cup level never rises. No fill, no finish.

## Rubric
- **Concept & ownability (20):** Target 8. It comes from the ritual (the drip of a shot, the pulse of the pump), and the "tick" plus step-sequencer pip row can be a whole motion language: every app transition on a 1s grid, with the slip as the brand's signature hiccup. Weakness: the pip row is more sequencer than café.
- **Motion & perceived wait (25):** Target 6-7, the real fight. A 1Hz metronome with ease-in on a gravity-ish drop is steady and countable, and the slip gives the loop one memorable event so time feels punctuated (five little chapters instead of one long wait). Risk: stepped ticks can read as stutter, and the glitch could read as "broken".
- **Craft & performance (20):** Target 8-9. Handful of SVG shapes, `transform` and `opacity` only, one `animation-duration: 5s` shared by every layer using keyframe percentages (drop repeats 5x inside the keyframes, so no sub-cycle timing drift). Same SVG at 120px and fullscreen. About 80 lines of CSS.
- **Glanceability & inclusion (20):** Target 6-7. At 120px: dark field, orange dot falling into a cup, five pips. "Coffee dripping" lands in a second. The glitch is subtle at 120px by design (it's a 6% shift on a thick band), so small-size legibility doesn't rely on it. Reduced motion: no slip, no fall; the five pips breathe in sequence by slow opacity (1s each, 600ms fades), with the drop held mid-fall at a sensible static position so it still reads as "dripping, in progress".
- **Pitch (15):** Target 7-8. I pitch it as the honest loader: it ticks, it slips, it recovers, which is what a real order does. Include a risks section. Lena will make me cut at least one claim.

## Riskiest part
The glitch. It is the whole reason this team exists and also the only thing the judges are primed to punish: "looking stuck", "visible seam", "anxiety-inducing". If it reads as the loader breaking rather than a designed hiccup, Mara and Amara score it down hard. The cuts that keep it safe: horizontal only, under half a second, once per loop, never at the seam, 6% max, no colour flash, and the drop landing visibly resolves it. If the team tests it and it still smells like a bug, we keep the tick and the sequencer and ship the glitch as a 2px whisper, or drop it entirely.
