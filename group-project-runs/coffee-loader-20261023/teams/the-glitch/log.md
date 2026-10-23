## Round 1 - Zara (Visionary)

Okay, the pitch: TICK. Every loader in history is a smooth little liar. It slides along like nothing could ever go wrong. We're not doing that. Ours counts. One drop a second, five beats, a pip hopping along under the cup like a step sequencer. It's the only loader where you can feel the seconds go by, and honestly that's what makes waiting shorter: five small events instead of one long smear.

And yes, there's one glitch. Once a loop the crema band tape-slips sideways and the 3s drop lands and fixes it. Gloriously unnecessary. Also, it's what makes the loop memorable.

Lena, I can feel you getting your clipboard. Yes, I know the slip could look like a bug. That's the bet. I wrote the safety rails into the proposal (horizontal only, under half a second, no flashing, away from the seam) and I'll happily argue it down to a whisper if testing says so. Omar, I want a backup plan from you for exactly that. Pablo, I need all of this on transform and opacity and you know you can do it. Hit me with your best "no" so I can ignore it politely.

Nothing fills. Nothing finishes. Just tick, tick, tick.

## Round 1 - Omar (Producer)

Okay team, here's the bet: "Already Full". Top-down espresso cup, crema already there, drips landing every 1.25s with rings spreading out, swirl turning 120 degrees across the loop. We kill the one thing every loader does, which is fill up. No level, no finish, no reset. Progress is a heartbeat, not a bar.

Why I like it: it's a screenshot-able demo. One idea, four beats, perfect loop by symmetry, ten-ish SVG elements, transform and opacity only. Pablo gets to be clever with the 3-fold swirl, Zara gets her weird camera angle.

Why I'm nervous, and yes I know day 300 is my blind spot: a full cup can read as "done". Lena, I need you to hammer that. My backup is the side-view cup with a constant level and a continuous stream, same ring logic, if the top-down glance test fails at 120px.

Ship it small, test it at thumbnail size first, then decide. I'll cut anything that doesn't survive that test.

## Round 1 - Lena (Skeptic)

Okay. My proposal is "Pull": top-down espresso cup, crema rings travelling inward, one landing per second, five rings staggered by exactly 1s so the loop has no seam to find.

I know it's the quiet one. Zara, I'm not going to out-weird you; I'm going to out-measure everyone. Everything else on the table will be judged on taste. This one has a testable claim: motion against the direction of travel with ease-in feels shorter (Harrison, CMU). One study, bars not rings, so I will say "hypothesis" in the pitch, not "proof". The judges will punish an overclaim faster than a plain loader.

What I want from you: Pablo, make it twelve elements, transform and opacity only, crisp at 120. Omar, don't let us add a "done" beat. A full cup that resets is a lie, and Mara will find it in one loop. Zara, if you want the glitch, give it to the reduced-motion fallback or the landing bump, not the rhythm. A loader must not stutter.

My own weakness: I know "coffee-ness" is thin, and I will not defend it. If someone has a stronger ritual image that keeps the inward rule, I'll trade the cup for it. If we can't run a one-second test, I'm outvoted on everything I can't measure and I'll say so.

## Round 1 - Pablo (Craftsperson)

Okay, team, here's the bet. Every loader in the world goes round or across. Mine goes DOWN. One bead of espresso swells at a spout, lets go, falls with real gravity (ease-in, not the usual soft sine), and its ripple hands off to the next drip. Five drips per 5 seconds, so the loop is five identical 1s beats and there is literally no seam to find. The cup never fills, so no fake finish, and no percentage to lie about.

Zara, I think this is edgy enough for you: the broken convention is "progress". Omar, it's about five SVG shapes, transform and opacity only, so the backup plan is cheap. Lena, I know, no progress bar. My defence is the rhythm itself: a drip a second is a clock people already trust, and I'll keep a slow 5s breath underneath so it never looks stalled.

What worries me is that I fell in love with the physics. If the bead reads as a leaky tap at 120px, I've failed, and I'd like someone to hit me with that before I build it. Tell me if the ripple is the star or the drop.

## Round 2a - Zara (Visionary)

Let's say the quiet part loud: Pablo, Omar and Lena all drew a dark disc with rings on it. Three proposals, one picture. A judge flipping through teams sees that cup forty times. If we ship it, we're the forty-first. I refuse. Generic is the only way to lose.

What's weak, by name:
- **Pablo's drop:** it's a gravity demo, and he admits it might read as a leaky tap. The convention he "breaks" is progress, which no judge checks for. A drip is the default coffee loader.
- **Omar's Already Full:** he fears "full cup = done", and he's right. Also, "we deleted the fill" is a deletion, not a provocation. Nobody sees an absence.
- **Lena's Pull:** inward ripples are the one real break among them (direction). But her own risk is "drain", and at 120px inward rings are a target. Her concept score is 13/20 and she says so.

My own: TICK's glitch is the risk, and I'll shrink it to a whisper if Lena's test says bug. I won't delete it. The tick is the convention-break: discrete, countable, not smooth.

What I steal:
- Lena's inward rule for the drop's ring, so the landing converges and the ring reads as arrival.
- Pablo's gravity ease-in and his rule that every duration divides 5s.
- Omar's backup plan: if the glitch reads broken, it goes down to a 2px whisper.

Verdict: TICK wins, with Lena's guardrails. Commit to a provocation or a drip must explain why it's one. Pablo, you can't.

## Round 2a - Omar (Producer)

I'm folding. Host is right: my "Already Full" is a top-down cup with rings, which is Lena's "Pull" with a different haircut. We both deleted the fill, and that is a bet every rival can make in a minute. A drip is only provocative if it breaks something, and Zara's TICK is the only one that does. So I back TICK as the team entry, and I want it built, not softened.

What's weak, by name:
- **Zara:** the glitch is 6% sideways. At 120px that's about 7px, and the 35% ghost copy is about 3px. That is a no-op in-app and only works on the splash. Make it 10% with a hard orange ghost, or it's decoration. The five-pip row is also ~6px dots at 120px, so cut it to a chaser on the saucer rim, bigger.
- **Pablo:** the bead stretch and the elliptical ripple turn to mush at 120px. The 1Hz drop with no counting device is a leaky tap. I'm stealing his fall easing and the "five 1s beats divide 5s" rule.
- **Lena:** inward rings read as a drain (she says so herself), and the Harrison claim is a study on bars. I'm stealing her handle, her reduced-motion opacity sequence, and her ban on a fake finish.
- **Mine:** concede. Same ring idea as Lena's, and a full cup reads as done.

Can't be built well in pure CSS at 120px: real VHS tearing (needs filters or displacement), squash-and-stretch physics, and a thin ring under about 2px.

Backup plan: one custom property for glitch amplitude, so we can test it at 10% and drop to a 2px whisper if it smells like a bug.

## Round 2a - Lena (Skeptic)

Host note first, because it's right: three of four of us drew a top-down cup with rings. Mine included. "Pull" is the quiet one, and quiet loses against rivals who found the same cup. Provocateurs means one real broken rule, so here is my position: Zara's TICK should win, with my inward rule stolen into it.

Fatal flaws, no mercy:
- **Zara, TICK:** the slip is the only thing here that can read as a crash, and the judges are primed to punish "looks stuck". Also the pip row is sequencer, not cafe. Fix: keep it, cap it at a whisper, and test it at 120px before we love it.
- **Omar, Already Full:** a full cup that never fills is "served". His "delete the fill" is the same idea as Pablo's, with a worse failure mode. Fatal: reads as done.
- **Pablo, One Drop:** a 1Hz drop is a leaky tap. His physics love is the problem. Fatal: no cup context at 120px.
- **Mine, Pull:** inward rings read as a drain or radar, and my Harrison citation is one study on bars. Fatal: unmeasurable here, and thin on coffee. I concede the cup. I will not concede the evidence rule.

Steal list: Pablo's ease-in fall and overlap (no dead air), Omar's 3-fold symmetry trick for seams, my own 1s stagger by negative delay.

Why a drip can be provocative: only if it counts, which is TICK. Counting beats smoothness for perceived wait (hypothesis, not proof). So: TICK, glitch as a 2px-to-6% dial we turn down on evidence.

## Round 2a - Pablo (Craftsperson)

Host is right, and I'll say it first: my drip is not the provocation. "Goes down" is a camera angle. Drop plus ripple is the same picture Omar and Lena drew, and a judge flipping through three teams will see four versions of one cup. So I concede the headline to Zara's TICK, and I want to build it.

What it looks like built at 120px:

- **Omar's Already Full:** cream ring at 0.7 opacity over crema (#C8873E) is about 20% contrast. At 120px that is mush. The swirl rotating 120deg in 5s is roughly 1.5px of edge movement per second; nobody sees it. It's a brown disc.
- **Lena's Pull:** five rings plus a handle bump at 120px is fine, but inward ease-in rings read as a drain or a radar. She says so herself. Fine as a rule, weak as a picture.
- **My drip:** a 1Hz bead is a leaky tap unless the contrast is brutal. My ripple needs a thick stroke, 6px at 120px.
- **Zara's TICK:** five pips plus a flat drop is the only thing here that survives a thumbnail, because hard edges and flat colour is what 120px likes. The risk is the 6% slip. At 120px that is 7px on a thick band: visible, not noisy. Good.

Commit: TICK is the base. The pip chaser is the broken convention (discrete, not continuous). Steal my gravity-eased fall for the drop, and Lena's rule that nothing flashes. Steal Omar's cut: if the slip smells like a bug in test, shrink it, don't drop it.

If we don't go TICK, my drip is the cleaner build, but I wouldn't bet a vote on it.

## Round 3 - Omar (Producer)

Decision: we ship TICK, and we ship the glitch at a size you can see. Written up in plan.md.

The call on the fight: the slip stays, at 9px at 120px (7.5% of the width, with a 50% orange ghost left where the band should be). At splash size it is the same 9 units scaled, so 60px on an 800px splash. Not 2px. At 2px it is invisible, and then we are shipping a metronome with a dot, and I will not defend that to Henrik. Not 12px either: at 10% the band eats into the cup silhouette.

Lena, the crash worry is real and I wrote the rails: the first 3 seconds are clean, drop and pips keep moving through the slip, only the band moves, it lasts 0.5s once at 3.05 to 3.55s, away from the seam, and the 3s drop landing snaps it home. If a one-second test says it reads as broken, we turn one dial (`--slip`) to 4px. I could not run that test, so 9 is a judgement call, and Lena and Zara still disagree on it, in opposite directions.

Pablo builds both files. Drop and ring on 1s keyframes, everything else on 5s, transform and opacity only. Zara reviews fidelity. Reduced motion is pulses only, no glitch.

Keep it small. Cut anything that does not survive 120px.

## Round 4 - Pablo (Craftsperson)

Built build/index.html (one file, about 9 KB, no external anything) and build/README.md per plan.md. TICK as specified: 120px box plus full-viewport splash, 5s cycle, drop and ring on 1s keyframes, pips/band/ghost on 5s, only transform and opacity in any keyframe, `--slip` 9px and `--ghost` .5 as dials, reduced-motion block plus a page toggle, Replay button. Checked in Chromium: durations are 1s and 5s only, state at 4.99999s versus 5.00001s differs only by the pip hop, glitch and reduced-motion frames look right at both sizes.

Deviations, all small:
- Zero cloning script: the SVG is repeated verbatim in the splash (plan allowed either), so JS is only Replay and the toggle.
- Cup opening is a dark coffee-surface ellipse at y56 and the slipping band sits lower on the cup body (y66-76), because a crema band over a crema surface made the drop landing invisible. Drop falls 25 units, not 32, to match.
- Pip direction fixed: plan's `--i * -1s` delay lights pips in reverse; used `(i - 5) * beat`. Pips hop on instantly and fade off over 0.3s.
- Drop starts from opacity 0 (fades in during the swell) so the keyframe wrap has no pop.

Not done: no real-device test; the 9px glitch is still an untested judgement call (dial documented).

## Round 5 - Lena (Skeptic)

I came in expecting "crash". I will say it plainly: it does not read as a crash. Drop and pips never stop, only a stripe moves, and it is over in half a second. I was wrong about the word and right about the worry. It reads as a defect, and the build earns that in three ways. The stripe at +9 leaves the cup and runs over the handle. The out-move takes 0.1s, the fastest motion in a loader that is meant to be calm. And in a 30s wait it repeats six times, which is a tic, not a wink. Nothing flashes: events are 1 Hz and small.

Ranked, my four: (1) clip the band to the cup, 6px not 9, 0.2s moves; (2) pitch.md does not exist, and that is 15 points plus a constraint strike; (3) the orange drop is a delivery-app dot, not coffee, so use crema; (4) the five-pip chaser is a countdown that resets, close to a fake finish, and its off state is 1.5:1 contrast. Also the "compositor" claim is false for SVG children. Reduced motion passes.

Verdict: shippable with fixes 1 to 3. Without them, Amara and Henrik will mark us down, and I cannot measure that, which annoys me.

## Round 6 - Pablo (Craftsperson)

Fixed in build/index.html and README.md. Checked only with a headless Chrome screenshot on file://; the glitch frame itself was not captured, so timing is by reading the keyframes.

1. Glitch overshoot: fixed. Band and ghost sit in a static `<clipPath>` shaped like the cup body (unique ids per SVG), so the stripe slides behind the cup edge. `--slip` 6px, `--ghost` .35, out 3.05-3.25s, back 3.35-3.55s, ease-in-out. Still lands on the 3s drop. Glitch kept, tamed.
2. pitch.md: ignored as instructed.
3. Orange drop: drop and ring now `--crema`. Orange is only the lit pip and the ghost ("system acting").
4. Pip countdown: kept the pips (Zara's chaser is the concept), but the lit pip now trails off over a second (comet, not a counter) and `--pip-off` is #6B4430 (was 1.5:1, now about 2.4:1). Won't delete them: the chaser is the countable half of TICK.
5. Compositor claim: removed all three `will-change` lines; README says transform and opacity only, SVG children repaint. Duplicated SVG kept (Safari `<use>` untested).
6. Literal 5s: comment "cycle 5s; beats 1s x5" above `:root`; README lists band as 5s.
7. Untested surfaces: still stated in README.
8. Reduced motion: README calls the parked drop "a drop about to fall"; duplicate block already commented as sync-required.

## Round 7 - Zara (Visionary)

I am selling the counted drip: one drop per second, five ticks to the loop, and one bounded slip of the crema band that the next drop fixes. The hook leads with "you can count it" and the user benefit, then "it stumbles" as the provocation. I only claim what the build does: 6px slip clipped behind the cup, orange kept for the lit pip and ghost, a calm reduced-motion state. The risk gets its own paragraph, the slip reading as a defect and repeating six times in a 30s wait. I would rather the slip were bolder, but I wrote the pitch to the build, not to my taste.

## Round 7 - Omar (Producer)

Checked every claim against index.html and README.md; pitch is now about 380 words.

Cut or changed:
- "Cut from 9 to 6 units": process history, nothing in the build shows it.
- "No dead air", "Drops and pips never stop": the drop is invisible for 45% of each beat; reworded to "keep their beat".
- "Gold dot" became "amber dot" (crema is #C8873E).
- "Vanishes below 4px" softened to "we expect", since it was never tested.
- Added the timing rationale (1s divides 5s; slip off the seam) and the real-wait-time behaviour, which the pitch criterion asks for.

Hook and voice untouched; all claims verified true otherwise.

## Rematch R1 - Omar (Producer)

Four judges told us to kill the glitch and the orange. They're right about the glitch. A stripe that looks like a render bug is a fault, not a provocation, and it cost us calm, concept and seam honesty in one move. It goes, with the orange and the pips.

But I won't drop the provocation. Our real convention-break was never the slip; it was "progress is counted, not smoothed." So the coffee keeps score now: each landing lightens the crema one step, and at 3 seconds the drip stretches into a half-second pull, the way a shot gushes. Henrik handed me that one. Nothing hard-cuts, nothing sideways, no false finish: the steps settle back in beat five.

I'm stealing bare-wire's slow crema breathe so no frame looks stalled. My risk: five steps could read as a fill. Pablo, keep the range small, and capture the pull frame this time.

## Rematch R2 - Lena (Skeptic)

**Was I right?** Yes, about the symptom: Amara, Mara, Rosie and Sun all flagged the slip as a fault, not a choice. But Omar's retro is correct: the idea didn't earn its place.

**Is "the coffee keeps the count" a real break?** Only half. Discrete five-step progress is the oldest loader convention there is (the pips were it). Moving the steps from orange dots into crema is a relocation, which is a good one (Henrik's swap test) but not a break. The real break, a loader that never completes because beat 5 settles back, is buried in step 4. Say that in the pitch.

**My measurement objection (this is my blind spot, and it bites here):** a ~5px-tall surface ellipse, opacity .35 to .75, is about .08 per step. At 120px on dark roast that is likely below noticeable difference. If nobody can see the count, the provocation is invisible and we are the judges' average. Overrule: require each step to be at least ~10% luminance delta, and screenshot the step frames at 120px.

**Overrules:**
1. Step ease 0.3s over a 1s beat reads as a ramp, i.e. smooth, the convention we claim to break. Use 0.12s ease: still no cut, but visibly a step.
2. Breathe at +-.04 is half a step and muddies the count. Use +-.02, or put it on a different element than the count ellipse.
3. Beat-5 settle must read as the cup being swapped, not a drain. Keep it, but fast, not a 2.5s glide.
4. The pull at 3.0s is the only remaining hitch; make it visibly different from a normal drop (stretch >= 2x).

**Steal:** bare-wire's breathe fits the shared 5s clock; accepted with the amplitude change.

**Rejected out of pride?** Nothing material. Accepting Amara's calm notes was right.

Nothing here breaks the brief; Omar's call stands with these amendments.

## Rematch R3 - Pablo (Craftsperson)

build-v2 is done and was checked with headless Chrome screenshots at 14 moments of the loop, at 120px and splash. The orange layer is gone. The crema steps are readable at 120px, and the 3s pull is clearly a stream (2.7x a drop) rather than a bigger drop.

Where I bent Omar's plan: the pull is its own stream element, because stretching the drop would stretch its fall path. I took Lena's overrules: 0.12s step ease, wider step range, breathe +-.02 on a separate element.

What I do not trust: 4.6s looks almost like a full surface before the swap at 4.75s. It tops out at 80% and snaps back in 0.25s, but a judge may still read it as fill-and-empty. If so, the fix is to lower the top level, not to remove the swap. Also untested: real devices, Safari, Firefox.

Details: build-v2/CHANGES.md.

## Rematch R4 - Zara (Visionary)

I lost the glitch, and it stings, because it was the only thing in the build that could be a mistake. But four judges read it as a mistake, and Lena was right that I'd hidden behind a smaller size. The cup that counts and never finishes is a better lie to break. Pablo's 4.6s frame still worries me.

