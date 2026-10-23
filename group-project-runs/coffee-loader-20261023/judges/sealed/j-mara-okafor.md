# Signature Criterion - Mara Okafor

**Name:** Seam & Wait Honesty

**Description:** Does the loop hold up across real, unpredictable wait times? Two observable things: (1) the 5s -> 0s seam is invisible - no jump in position, scale, opacity, color or easing velocity at the wrap; and (2) the cycle never fakes completion - no beat that reads as "done" (a full cup, a checkmark, a big resolve-and-pause) that then resets, which makes a user who has waited 12s feel the app lied twice. It should also be safe to cut away at any frame: if the order loads at 2.3s, the frozen/removed state should not look broken mid-gesture.

**How I'll score (0-10):**
- Watch at least 3 consecutive loops at 120x120 and at splash size, eyes on the wrap point; scrub/pause at ~5 random frames.
- 0-2: visible snap or hitch at the seam, or the piece has an obvious "complete" climax that resets.
- 3-4: seam is mostly clean but one property pops (e.g. opacity or a rotation offset), or a soft false-finish beat.
- 5-6: seamless, but velocity changes abruptly at the wrap (easing dead-stop), or several random frames look awkward to exit on.
- 7-8: seamless including velocity; no false completion; most random frames are clean exit points.
- 9-10: I cannot find the seam after repeated viewing, progress reads as ongoing and honest, and every sampled frame is a dignified place to stop. Reduced-motion fallback is also stable, not a frozen awkward frame.

**Why I care:** On a delivery app, the loader is shown for 1s or 20s and nobody knows which in advance. The loops that shipped badly for us were the ones with a satisfying "finish" every cycle - users read it as progress, then watched it reset and lost trust. A loop's real craft is at the seam and in how it behaves when the network, not the designer, decides when it ends.
