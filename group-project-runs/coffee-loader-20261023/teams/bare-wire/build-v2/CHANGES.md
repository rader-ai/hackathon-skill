# CHANGES - build-v2

## Triage plan (Theo)
1. Copy build to build-v2, keep palette/cup/handle/field/glint/bloom/toggle/replay/a11y - done
2. Delete `.heal` (CSS + both SVGs); six shapes - done
3. One `@keyframes scar`, 5s, scar B at -2.5s, zero at 0%/100% - done (timings per Ruth: open 6%, hold, close to 50%)
4. Offsets A (5,4) / B (-6,-3), cap .55 - done (offsets via cx/cy; was translate on a group)
5. One SVG instance with checkbox/:has size toggle - dropped (Ruth: two pasted copies stay)
6. Reduced motion, new class names in media query and data-motion block - done
7. Ruth's 120px check, no abrupt change >3x/s - done by Kenji: hole opens once, hold, slow close; two landings/5s plus two glint pulses
8. README rewrite, honest notes - done (pitch is Ines's)
9. Theo's check - pending

## Ruth overrules
- Scar colour #6B4226 (3:1) - done
- Open at 6% (0.3s), hold ~0.5s before close - done
- Glint pulse at each landing - done (2.5s loop, .7 to 1)
- Scar B explicitly hidden in reduced motion, both blocks - done
- Drop size toggle, keep two copies - done
- Take warm-hands' reduced pose only if no new node - dropped (not needed)
- Verify no dead frame at A/B handoff, README note on 2.5s - done

## Screenshots (headless Chromium, 120px, 13 moments, 3x)
Hole reads at every moment from 0.15s to 4.0s; the 0.3-0.8s hold shows a clear dark disc inside the cup rim; closing reads as settling. Landing at t=2.5s shows a bare field for about 0.1s (tiny pin-dot at 2.3 and 4.9), no real dead frame. Glint is brighter at 0.3 and 2.8. Reduced state: one dim scar, still reads as a cup of coffee in progress. No fixes needed after viewing.
