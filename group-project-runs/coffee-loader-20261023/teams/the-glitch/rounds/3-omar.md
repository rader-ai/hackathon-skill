## Round 3 - Omar (Producer)

Decision: we ship TICK, and we ship the glitch at a size you can see. Written up in plan.md.

The call on the fight: the slip stays, at 9px at 120px (7.5% of the width, with a 50% orange ghost left where the band should be). At splash size it is the same 9 units scaled, so 60px on an 800px splash. Not 2px. At 2px it is invisible, and then we are shipping a metronome with a dot, and I will not defend that to Henrik. Not 12px either: at 10% the band eats into the cup silhouette.

Lena, the crash worry is real and I wrote the rails: the first 3 seconds are clean, drop and pips keep moving through the slip, only the band moves, it lasts 0.5s once at 3.05 to 3.55s, away from the seam, and the 3s drop landing snaps it home. If a one-second test says it reads as broken, we turn one dial (`--slip`) to 4px. I could not run that test, so 9 is a judgement call, and Lena and Zara still disagree on it, in opposite directions.

Pablo builds both files. Drop and ring on 1s keyframes, everything else on 5s, transform and opacity only. Zara reviews fidelity. Reduced motion is pulses only, no glitch.

Keep it small. Cut anything that does not survive 120px.
