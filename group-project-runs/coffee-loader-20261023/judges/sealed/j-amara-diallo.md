# Signature criterion - Amara Diallo

**Name:** Calm Wait Safety

**Description:** Does the loader make a wait feel calm and steady for all users, including those who need reduced motion? Observable checks: (a) no flashing or strobing, and no element changes luminance or position abruptly more than 3 times in any second; (b) the 5s loop seam is imperceptible (start and end frames match, no pop or jump); (c) motion is eased and gently paced rather than frantic; (d) the `prefers-reduced-motion` branch exists and still conveys "in progress" via a static or very low-motion state (not just a blank freeze); (e) it stays legible and calm at 120x120.

**Scoring 0-10:**
- 0-2: flashing/strobing, hard loop jump, or no reduced-motion handling.
- 3-4: reduced-motion handled minimally (just stops), or visible seam, or busy/jittery motion.
- 5-6: no safety violations, seam mostly smooth, reduced-motion present but generic.
- 7-8: smooth seam, eased pacing, thoughtful reduced-motion state that still reads as progress.
- 9-10: all of the above plus the motion actively soothes (steady rhythm, clear sense of progress), verified by toggling reduced motion and watching a full loop twice.

**Why I care:** Perceived wait time is shaped by calm, predictable progress, and a loader that induces anxiety or excludes reduced-motion users fails the very people waiting on their morning coffee.
