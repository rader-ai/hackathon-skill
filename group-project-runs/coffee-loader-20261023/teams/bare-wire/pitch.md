# Crema Scar Loader - Team Bare Wire

**Hook:** Water ripples. Coffee heals.

## The idea
Most loaders are a ripple or a spinner. Ours is a drop that breaks the crema, opens a dark scar, and watches the crema close it from the inside. It is a top-down espresso cup with a handle, so it reads as coffee. One component, one 5s loop, the same markup at 120px and full screen.

## Walk-through of the 5s
- **Every 1s beat (five per loop):** a drop lands off-centre and fades in over 0.2s as a dark dot. The dark disc opens toward 80% of the field.
- **Just behind it (from ~0.12s):** a crema-coloured disc follows and closes the gap from the inside, so the scar thins to a ring and disappears.
- **Under all five beats:** the crema field swells 1 to 1.08 and back over the full 5s. Because 1s divides 5s, the loop is seamless.
- **Still frame:** cup, handle, a glint arc so the field reads as liquid.

## Why it wins
- **Concept:** the scar is a coffee-only event. Dark opening in light is the inverse of a ripple, and the off-centre landing keeps it from being a target.
- **Motion:** two easing curves, one ordered beat, a slow second clock.
- **Craft:** six shapes. Only transform and opacity animate, on filled circles; the two strokes (handle, glint) are static. Both instances share identical markup, sized by their container. Reduced motion is designed, not removed: one scar breathing .25 to 1 over 5s.
- **Clarity:** `role="img"` and `aria-label="Loading"` cover screen readers, and the caption needs one sentence: "a drop breaks the crema; the crema heals it."
- **Pitch:** the README states what we did not verify.

## Honest risk
Tested in Chromium via file:// only. No Safari or Firefox, and no performance trace, so "compositor-friendly" is a design choice, not a measured claim. The healing is subtle at 120px: a judge may see only a pulse. The reduced-motion state is a simpler breathe, not a two-radius crossfade.

## Closing
Purists remove everything that is not the idea. What is left is a drop, a scar and a healing.
