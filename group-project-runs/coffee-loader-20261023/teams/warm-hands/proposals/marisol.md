# Marisol's Proposal: "The Bloom"

## One sentence
Seen from above, a barista's hand pours water in one slow, unbroken spiral over a bed of fresh grounds, and the grounds answer by breathing up into a dome (the bloom) again and again, so the loader is the first thirty seconds of a pour-over that is already being made *for you*.

## Why this, and why it is mine
Not a cup. Not steam. The loader is the *moment the barista cares most about*: the bloom, when hot water first meets the grounds and they exhale. Every cafe-goer has seen it and nobody has animated it. It is a ritual, it is slow by nature (which is exactly the calm we want), and it is top-down, so it is a circle, and circles survive 120px. It is a printed thing, too: a risograph pull in two inks, with the second ink deliberately a hair out of register. That wobble is the barista's thumbprint. It is how you know a person made this.

## The picture (all one inline SVG, ~10 shapes)
- Paper-filter ring: a thin espresso-brown circle, slightly hand-wobbled path, static.
- Bed of grounds: a warm dark disc inside it. This is the hero. It does the breathing.
- Bloom dome: a lighter, slightly warm copper disc on top, offset 2% in a second ink (misregistration), multiplied over the grounds.
- Pour: a single cream-white drop riding a wrapper that rotates at a constant rate, one revolution per 5s, tracing the spiral. A faint trailing wet-stain arc fades behind it.
- Three wet rings (ripples), staggered by 5/3s, that swell and fade out from the center like coffee soaking outward.
No handles, no saucer, no steam.

## Moment by moment (5s loop, one continuous breath)
- 0.0s: The grounds sit at rest-size, the pour-drop at twelve o'clock, a first wet ring just being born at center. Nothing is "starting"; the loop is already mid-motion, since the pour never stops.
- 0.0-1.7s: The drop sweeps clockwise at a constant pace. The grounds begin to rise (scale 1.00 to 1.07) with an ease-in-out like an inhale. First wet ring swells outward and thins.
- 1.7-2.5s: The bloom crests. The copper dome sits slightly high and wobbles off-register, the hand-printed glow. The drop is now at the bottom of the circle. Second ring is mid-bloom.
- 2.5-4.2s: The exhale: the dome settles back down. The drop climbs the left side. Third ring is born.
- 4.2-5.0s: The grounds return to rest-size exactly as the drop returns to twelve o'clock and the first ring starts again. Rotation is linear, scale and ripples are sine-ish and periodic over exactly 5s (or 5/3s for ripples), so the wrap cannot be found.

The steady constant sweep is the "progress is ongoing" signal. The breathing is the warmth. There is no finished cup and no pause. Anyone who walks into the room at any second sees the same state of mind: the pour is happening now.

## Rubric
- **Concept and ownability (20):** Strongest card in my hand. Bloom + riso misregistration + hand-wobbled filter ring is a motion language: it extends to the splash, to a button press (a dome-rise), to empty states (a still, rested bed), to order-ready (a first drip below). Nobody else will make the bloom.
- **Motion and perceived wait (25):** Linear sweep as the steady metronome, sine breath as the heart. One ring per 5/3s gives a rhythm under the rhythm. Slow enough to be calm, never still enough to feel stuck. No fake finish.
- **Craft (20):** Only transform and opacity animate: rotate on the pour wrapper, scale on the grounds and dome, scale+opacity on the rings. One SVG, ~10 elements, CSS custom properties for ink colours, `will-change` sparingly. Component sized by `width:100%` so 120px and splash are one thing, scaled.
- **Clarity (20):** At 120px: a dark disc breathing under a turning cream drop reads as "coffee being poured" if the palette does the work. Espresso on cream is the most recognizable colour story in the category. Reduced motion: no rotation, no scale; the dome holds its resting state and the three wet rings fade in and out in sequence on a slow 5s opacity cycle. That still says "water is moving through the grounds".
- **Pitch (15):** The line is "Your coffee is in the bloom." Honest about the risk below. Short.

## Palette (declared as :root custom properties)
- Crema paper `#F4E6D0` (ground)
- Espresso `#2A1810` (grounds, filter ring)
- Riso copper `#D9622B` (bloom dome, misregistered)
- Warm cream `#FFF6E6` (pour drop and wet rings)
- Faint roast shadow `#6B4026` (wet stain)

## Riskiest part
Me. I will want to add the chaff flecks, the paper-filter crease, the grain of the riso print, the curl of the pour stream, a gooseneck kettle in the corner. At 120px that is all mush and every fleck is a kilobyte. The real risk is that the 120px read collapses into "brown circle, orange circle" and Rosie doesn't get *pour-over*, just *blob*. The mitigation has to come from teammates: keep it to the ten shapes above, make the pour-drop big and bright enough to read as water, and test at 120px before adding a single detail.

Second risk: the misregistration. If it is too subtle it is invisible, and if too strong it looks like a rendering bug. It needs a fixed 2-3% offset, never animated, so it reads as print not glitch.
