# Signature criterion v2 - Amara Diallo

**Name:** Half-Awake Read Time

**Description:** How quickly and how robustly does a tired, distracted, low-vision user understand "your order is in progress" without any help from motion detail? Observable checks, run on a screenshot-sized view of the loader at 120x120 and a 2-second glance: (a) in a single frozen mid-loop frame, the coffee subject and a progress cue are identifiable; (b) it survives a grayscale filter and a 1.5x blur (simulating low vision and glare) with silhouette and hierarchy intact; (c) the key shapes keep at least 3:1 contrast against the background and are at least about 4px at 120px; (d) the reduced-motion frame, viewed frozen, still shows a deliberate "in progress" cue rather than a bare object; (e) there is an accessible name that says what is happening (role plus label naming the coffee order, not just "Loading").

**Scoring 0-10:**
- 0-2: frozen frame is unreadable or ambiguous, fails the grayscale or blur test, or no accessible name.
- 3-4: subject recognizable but progress cue is missing or fine detail vanishes under blur or at 120px; generic aria-label only.
- 5-6: subject and one cue survive two of the three tests (frozen, grayscale, blur); contrast borderline; reduced-motion frame is just the subject.
- 7-8: passes all three tests; contrast at least 3:1; the reduced-motion frame includes a clear progress cue; accessible name is specific.
- 9-10: all of the above, and a stranger shown the blurred grayscale frozen frame for 2 seconds names it as coffee on its way.

**Why I care:** Real waits happen at 7am on a cracked phone in sunlight, so a loader that only works when watched in motion by a sharp-eyed user fails the people who need reassurance most.
