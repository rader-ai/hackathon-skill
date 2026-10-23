# Results - round 2 (rematch)

## Standings

| # | Team | Total | Change | Rubric | Signature bonus | j-amara-diallo | j-henrik-vale | j-mara-okafor | j-rosie-tran | j-sun-park | Spread |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | warm-hands | **81.0** | -5.2 (was #1) | 70.5 | +10.5 | 76.0 | 67.0 | 78.0 | 61.0 | 70.5 | 17.0 |
| 2 | the-glitch | **79.2** | +13.7 (was #3) | 70.2 | +9.0 | 78.0 | 69.0 | 63.0 | 67.5 | 73.5 | 15.0 |
| 3 | bare-wire | **76.4** | +2.9 (was #2) | 67.1 | +9.3 | 63.0 | 71.5 | 73.5 | 56.0 | 71.5 | 17.5 |

Most improved: **the-glitch** (+13.7)

## Criterion averages

| Team | Coffee concept & ownability | Motion, timing & perceived wait | Engineering craft & performance | Glanceability & inclusion | Pitch |
|---|---|---|---|---|---|
| warm-hands | 7.4 | 7.0 | 6.6 | 6.8 | 7.6 |
| the-glitch | 7.2 | 6.4 | 7.2 | 7.0 | 7.6 |
| bare-wire | 6.2 | 6.6 | 7.8 | 5.6 | 7.6 |

## Signature criteria revealed

- **j-amara-diallo** (sonnet) - *Half-Awake Read Time*: Whether a tired, low-vision user can name 'coffee in progress' from one frozen frame at 120px, through grayscale and a 1.5x blur, with a deliberate reduced-motion cue and a specific accessible name.  
  Winner: **the-glitch** (8/10) - Light cup on dark, spout and falling drop read as coffee even in blurred grayscale, the crema steps are a real progress cue, and the aria-label names the order; early dark crema steps are low contrast.
- **j-henrik-vale** (opus) - *Freeze-Frame Brandability (the cup sleeve test)*: Pause at 0s, 1.25s, 2.5s, 3.75s and the worst frame I can scrub to, print each in one ink at 2cm on kraft, and ask whether every still is a composed, ownable mark that belongs to one family.  
  Winner: **bare-wire** (7/10) - Every sampled still is the same top-down cup with an off-centre dark mark in a different size and place, a stamp family that survives one ink; the bare-field frames at 0s and 2.5s are plain but not broken.
- **j-mara-okafor** (opus) - *One Lead Mover*: At every moment exactly one element carries 'working on it', and every other moving part is visibly quieter, nearby, and on a tempo that nests with the lead rather than competing with it.  
  Winner: **bare-wire** (8/10) - One dark hole at a time is the clear lead; the 5s field bloom and the 2.5s glint nest under it, and the reduced-motion version keeps a single breathing scar as the focal point. The two drops land about 11 units apart, which nudges the eye slightly.
- **j-rosie-tran** (haiku) - *Already-pouring first frame*: Scores whether the loader already shows coffee being made in the first frame a customer sees after tapping order, at 120px, with no beat needed to start the motion.  
  Winner: **warm-hands** (8/10) - The stream and the spiral are both in place at frame one, so a restart reads as the pour carrying on.
- **j-sun-park** (sonnet) - *Frame-Budget Footprint*: How much of the loader repaints per frame, how many layers it promotes, and whether it costs nothing when idle or hidden.  
  Winner: **bare-wire** (7/10) - Six shapes, fills only, zero JS in the path, will-change only on the two scars; but SVG-child animation still repaints the whole 120px each frame and there is no play-state hook.

Most divisive: **bare-wire** (spread 17.5)

## Did the judges' notes land?

| Team | yes | partly | no | rejected |
|---|---|---|---|---|
| warm-hands | 2 | 1 | 0 | 2 |
| the-glitch | 3 | 2 | 0 | 0 |
| bare-wire | 1 | 2 | 0 | 2 |

### warm-hands
- j-amara-diallo: **yes** - Stream added from rim to spiral origin and held in reduced motion, stroke 6.5 instead of 7 with a sound reason; verified in code and frames.
- j-henrik-vale: **rejected** - Rejected for seam and Safari risk; the seam worry is fair but a 15-degree drift loops as cleanly as a full turn, so the reason only half holds and the spinning-decal problem the note targeted is still on screen.
- j-mara-okafor: **yes** - They built the stream as I specified (3 units, outside .sweep, opacity-only 5s shimmer, held under reduced motion). They also thickened the stain to 3.6 and made it static, a sensible partial take on the stain half of my note. The stream ends at the spiral's origin (54,57), which orbits the 54,60 pivot by 3 units, so you can barely see it move.
- j-rosie-tran: **partly** - Idea taken but geometry changed: they made a static stream from the top edge to the pivot, always visible, not a line to a moving tip. It helps the pour read, but the spiral still turns.
- j-sun-park: **rejected** - Layer split refused as a point of gain for a second SVG and a stacking bug surface; honest and README-disclosed, and the reason is defensible, but the repaint cost is unchanged.

### the-glitch
- j-amara-diallo: **yes** - Slip, ghost and hard cuts all deleted and the drop now fades in and squash-fades out; code matches the pitch.
- j-henrik-vale: **partly** - Pips and band deleted, count moved onto the surface ellipse, gush built as a scaleY stream; but the reset I asked to hide behind a cup swap became a visible drain.
- j-mara-okafor: **partly** - The orange pips, slip and ghost are all gone, as asked. I asked for the drop and ring to be the only clock; they refused because 'a cup with no count is a glide'. That reason does not hold: the 1s drop already counts, and the new count resets just as visibly as the pips did.
- j-rosie-tran: **yes** - Landed and then some: they removed the orange band and ghost at every size, not only at 120px, and kept the one-second drop and the five-step count, now in crema.
- j-sun-park: **yes** - Drop snap/teleport replaced with eased fade and squash, and the slip that I asked to cut to 4px was deleted entirely, which is cleaner.

### bare-wire
- j-amara-diallo: **rejected** - Five travelling scars were refused as spinner grammar and clutter, which is a fair reason, but the 75ms fade-in is far short of my 0.4s and the dead-frame problem remains.
- j-henrik-vale: **yes** - Heal disc deleted, scar opens in 0.3s, holds, closes over 1.7s, two off-centre drops per loop at 2.5s; built as written and verified in code.
- j-mara-okafor: **partly** - The 1Hz target pulse is gone and the cap holds (.55 at that offset clears the cup wall, which was what I wanted). They overruled #8A5A33 with #6B4226 for contrast, which is a fair call. They rejected one-per-5s in favour of two per loop for a felt beat, and that reason mostly holds.
- j-rosie-tran: **rejected** - Refused with a reason: a drip stroke outside the cup reads as a second subject, so the team enlarged the held scar instead. The reason is fair, but the hole still looks like a dot to me.
- j-sun-park: **partly** - Held, larger scar taken and the heal rim removed with the heal; the markup-halving ask was declined on a plausible Safari shadow-tree reason, so no leaner.

## Judges' lessons for this domain

- j-amara-diallo: Strong loaders keep a coffee subject and a progress cue visible in every frozen frame and under blur, and say so in a specific accessible name; weak ones only work while you watch them move.
- j-henrik-vale: In coffee, the strong work puts the motion inside the drink and makes every still printable on a sleeve; the weak work bolts a UI gesture (a spin, a fill, a counter) onto a cup and calls it ritual.
- j-mara-okafor: The strong loaders are the ones where one thing moves and everything else breathes; the weak ones keep a second idea (a counter, a hitch, a reset) that the waiting eye has to track.
- j-rosie-tran: Strong coffee loaders show coffee moving into the cup from the first frame, in a shape a half-awake eye reads at 120px; weak ones show a dot or a turning rosette.
- j-sun-park: Strong loaders keep the moving part small, on its own layer, and driven by nothing but a pausable CSS clock; weak ones animate five things inside one SVG and call it lean because the keyframes only touch transform and opacity.

## Judge notes

### warm-hands
- j-amara-diallo: loved - The stream now visibly feeds the spiral, so the frozen frame says someone is pouring, and the reduced-motion pose keeps that cue.; docked - The spiral is still the biggest turning shape and thin rim-stain strokes turn to mush under blur, so spinner or cinnamon-roll can still win in a 2-second glance.
- j-henrik-vale: loved - Still the only entry that looks like a specific cafe: wobbled rim, stain, thumb smudge, and the new stream gives the glance 'milk is going in'.; docked - The finished latte art still spins 360 degrees as a rigid decal, so the spinner read survives, and the fixed stream lands on the pivot while the pour tip runs around the rim, which is not how a pour works.
- j-mara-okafor: loved - The thin stream turns 'a spiral that spins' into 'a spiral being poured' in one glance at 120px, without touching the seamless sweep and sway.; docked - At 120px the spiral is still the biggest shape and still a turning rosette, so spinner grammar survives. The stream is faint where it crosses paper above the rim, and the stain ring is still busy at in-app size.
- j-rosie-tran: loved - The pour looks like someone is making coffee, and the stream into the spiral is an ownable coffee-ritual image.; docked - The spiral still turns 360 degrees and at 120px can read as a spinner or a cinnamon roll, and the stream looks like a straw.
- j-sun-park: loved - One 5s period on everything, linear sweep with zero-slope sway and opacity so the seam is genuinely closed; the stain keyframe was deleted rather than patched.; docked - Added a fourth animated element (stream shimmer) to a loader whose cost problem was already the full-SVG repaint, and the spiral still reads as a turning rosette.

### the-glitch
- j-amara-diallo: loved - The slip and orange ghost are gone and nothing cuts, leaving a calm countable one-drop-per-second rhythm that honestly names its fill-and-reset risk.; docked - The fifth crema step peaks near full and then snaps back in 0.25s, which can read as fill-then-drain, and the early crema steps are faint against the dark coffee.
- j-henrik-vale: loved - The UI chrome is gone and the coffee itself keeps score: the crema lightens a step per landing, and the 3s espresso pull is a real barista moment, not a render bug.; docked - The crema climbs to near full and then drains in 0.25s at 4.75s, a fill-and-reset that reads as a fake finish, and the .98 'breathe' is decoration nobody can see.
- j-mara-okafor: loved - Without the orange layer, the gravity-eased drop now fades in at the spout and squashes into its ring with no hard cuts, and it is the most literal coffee ritual on the table.; docked - The pip counter that reset every loop has moved into the coffee: the cup climbs to a near-full crema at 4.6s and then drains in 0.25s. That is a fill and reset, the fake-finish grammar I asked them to remove. The pull adds a scheduled hitch near 3s.
- j-rosie-tran: loved - A drop falls into the cup once a second and the crema steps up, so at 120px it reads as coffee coming in. The orange is gone.; docked - The crema can look nearly full at 4.6s and then empties in a 0.25s swap, so the loop can read as a fill-and-drain.
- j-sun-park: loved - Every hard cut in the drop is gone: fade in from scale .3, gravity fall, squash and fade into the ring, with opacity 0 whenever the transform resets.; docked - Markup still pasted twice, and the crema count reads as fill-then-drain at 4.6s despite the 80% cap, which the pitch admits.

### bare-wire
- j-amara-diallo: loved - Honest pitch, lean fills-only build, and the slow close of the hole is calm with a clean seam.; docked - At 120px roughly half of all frames (hole shrunk to a pin-dot) show no progress cue at all, so the loader reads as a static cup to a half-awake glance.
- j-henrik-vale: loved - The hole now genuinely closes from the edge in, at a 2.5s settle, so the crema heals the wound instead of drawing a second ripple; six shapes, nothing wasted.; docked - At 120px a brown dot in a brown circle still needs the caption to say 'drop in crema', and the top-down cup silhouette is centred-icon generic.
- j-mara-okafor: loved - The wound now closes instead of a second ring spreading: it opens in 0.3s, holds, then sinks away over 1.7s at 0.4Hz, and the 120px frame reads as a real hole in crema.; docked - Two landings per 5s still reads as a gentle pulse, and the bare field at each handoff is a tiny dead beat; the pasted second SVG is still duplicated markup.
- j-rosie-tran: loved - Calm, one-beat rhythm with no spinner rotation, and the cup still reads as coffee at a glance.; docked - The dark hole reads as a dot or bullseye inside the cup at 120px, not as coffee arriving.
- j-sun-park: loved - Heal disc and its second animated node deleted; one keyframe reused at a -2.5s offset, scale/opacity only, frame 5.0 equals frame 0.; docked - Still two pasted SVG copies and the whole SVG repaints; the hole at 120px is a dark disc on a near-black cup, so legibility rests on the held 0.5s beat.
