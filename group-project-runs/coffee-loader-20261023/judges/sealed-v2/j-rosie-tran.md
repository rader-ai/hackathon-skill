# Signature criterion v2 - Rosie Tran

**Name:** Already-pouring first frame

**Description:** Whether the loader already shows coffee being made in the first frame a customer sees after tapping order, at 120px. Measured by restarting the loop from its first frame (Replay), capturing frames at 0ms, 100ms and 250ms, and asking what a customer would see in that first quarter-second, before any beat has had time to play.

**How I'll score (0-10):**
- 0: The first frame is an empty cup, a blank field or a plain dot. Nothing coffee-related shows until the first beat (1s) plays.
- 3: Something moves within 250ms, but it is not recognisable as coffee until the 1s beat.
- 6: Coffee is visible in the first frame or by 250ms (a cup with crema, or a drop already in motion), though the start looks like a reset rather than a point in the loop.
- 8: The first frame already shows the cup mid-task (a drop mid-fall, a pour mid-stroke), and the state at 0ms matches the state at 5s, so a restart looks like a continuation and not a reset.
- 10: As 8, and the same first frame reads identically at 120px and on the splash.
- Deduction: -2 if the first frame looks like a reset (a blank cup, or a flash to empty) that a half-awake customer could take for an error.

**Why I care:** I tap and look up in the same breath. If the first thing I see is an empty cup, I think the app froze or failed, and I am back to my phone. A loader that is already working when it appears is the difference between waiting and wondering.
