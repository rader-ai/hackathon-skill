## Rematch R2 - Ruth (Skeptic)

**Brief check:** 5s loop and seam pass (A and B both scale 0 / opacity 0 at 0% and 100%; B's -2.5s puts it closed at t=0). Two holes: (1) reduced motion never says what happens to scar B. Shorthand `animation:` resets its delay, so both scars would breathe in sync. Add `.scarB{display:none}` in the media query and the data-motion block. (2) Step 5, the checkbox/`:has` size toggle, is fragility for a judge note we should not have taken. The 120px and splash views must be visible side by side. Keep two pasted copies.

**Overrule 1, Mara's colour.** #8A5A33 on crema #C98B4E is about 2:1, under the 3:1 non-text minimum, and it undoes Sun's and Rosie's "faint at 120px". Use #6B4226 (about 3:1). It is still softer than roast.

**Overrule 2, Rosie.** The plan does not answer "nothing reads as arriving". It halves the events (2 per 5s) and the scar only shrinks, which reads as a dot vanishing. No new element needed: (a) make the open 6% (0.3s), as Henrik said, not 10% (0.5s), and (b) hold at .55 for about 0.5s before the close, so the fast open and slow close read as impact then settling. (c) Pulse the existing glint .7 to 1 at 0% and 50%, so each landing has a cue.

**Steal: refuse the pride.** "Won't average toward the winner" is not a reason. Take warm-hands' reduced pose idea only if it needs no new node. Otherwise drop it.

**Accepted to please:** the 2.5s beat splits Henrik against Mara on a coin-flip. Say so in the README, and verify at 120px that the two-scar overlap (A's close ends exactly as B opens) leaves no dead frame.

Step 7 to run: no abrupt change more than 3 times per second.
