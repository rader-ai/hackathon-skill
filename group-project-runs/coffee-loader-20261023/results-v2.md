# Results - round 2 (rematch)

Paired re-score: every judge scored v1 and v2 in the same pass. **Change** is v2 minus today's v1; **Drift** is today's v1 minus its round-1 score.

## Standings

| # | Team | Total | v1 today | Change | Drift | Rubric | Signature bonus | j-amara-diallo | j-henrik-vale | j-mara-okafor | j-rosie-tran | j-sun-park | Spread |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | warm-hands | **80.7** | 76.6 | +4.1 | -9.6 | 69.3 | +11.4 | 72.0 | 69.5 | 74.5 | 61.0 | 69.5 | 13.5 |
| =2 | the-glitch | **77.0** | 61.2 | +15.8 | -4.3 | 68.0 | +9.0 | 70.0 | 67.5 | 69.5 | 66.0 | 67.0 | 4.0 |
| =2 | bare-wire | **75.1** | 62.5 | +12.6 | -11.0 | 66.1 | +9.0 | 65.5 | 65.5 | 68.0 | 60.0 | 71.5 | 11.5 |

**How clear is each lead?** A lead counts only if it is at least twice its standard error across judges; otherwise the teams share a place.

- warm-hands over the-glitch: **clear lead**, 3.7 points (4 of 5 judges had warm-hands ahead).
- the-glitch vs bare-wire: **too close to call**, 1.9 points with a standard error of 2.2 (3 of 5 judges had the-glitch ahead).

Most improved: **the-glitch** (+15.8)

v1 ranking today: warm-hands, bare-wire, the-glitch · round 1: warm-hands, bare-wire, the-glitch

## Criterion averages

| Team | Coffee concept & ownability | Motion, timing & perceived wait | Engineering craft & performance | Glanceability & inclusion | Pitch |
|---|---|---|---|---|---|
| warm-hands | 7.2 | 6.8 | 7.0 | 6.4 | 7.4 |
| the-glitch | 6.6 | 6.2 | 7.4 | 7.0 | 7.0 |
| bare-wire | 6.2 | 6.6 | 7.6 | 5.6 | 7.2 |

## Signature criteria revealed

- **j-amara-diallo** (sonnet) - *Half-Awake Read Time*: Whether a tired, glare-blinded user gets 'coffee, in progress' from one frozen, grayscale, blurred 120px frame, with 3:1 contrast, 4px+ shapes, a progress cue in the reduced-motion pose, and a specific accessible name.  
  Winner: **the-glitch** (7/10) - Spout, falling drop and cup read as coffee on its way even grayscale and blurred; reduced pose keeps a hanging drop and stepping crema; name is specific; the crema step cue itself fades under blur.
- **j-henrik-vale** (opus) - *Freeze-Frame Brandability (the cup sleeve test)*: Pause the loader at 0s, 1.25s, 2.5s, 3.75s and at its worst frame, and ask whether each still, full colour and reduced to one ink at 2cm, is a composed mark a cafe could print on a sleeve, bag stamp or menu board.  
  Winner: **warm-hands** (8/10) - Every frame is the same hand-made latte-art cup at a new angle, wobbled rim, stain and sienna tip intact; the new stream makes each still a pour stamp, though the stain goes to fuzz at 2cm in one ink.
- **j-mara-okafor** (opus) - *One Lead Mover*: At any moment exactly one primary mover carries 'working on it' and every other moving element is visibly quieter, on a nested tempo, close to the lead, at both 120px and splash size.  
  Winner: **warm-hands** (8/10) - The turning spiral is clearly the lead; the stream is static and lands on its pivot, the bloom breathes on the same 5s clock, and making the rim stain static removed the one far-off secondary.
- **j-rosie-tran** (haiku) - *Already-pouring first frame*: Whether the loader already shows coffee being made in the first frame a customer sees after tapping order, at 120px, judged from a restart at 0, 100 and 250ms.  
  Winner: **warm-hands** (8/10) - The pour is already mid-stroke at 0ms with the pour tip in place, and the 0ms frame matches the 5s frame, so a restart looks like a continuation.
- **j-sun-park** (sonnet) - *Frame-Budget Footprint*: How much of the loader repaints each frame, how many layers it promotes, and whether it costs nothing when paused or hidden.  
  Winner: **bare-wire** (7/10) - Five animated SVG children repaint the whole small SVG each frame, but only 2 will-change nodes, no JS, pausable; v2 drops a node.

Most divisive: **warm-hands** (spread 13.5)

## Did the judges' notes land?

| Team | yes | partly | no | rejected |
|---|---|---|---|---|
| warm-hands | 1 | 2 | 0 | 2 |
| the-glitch | 4 | 1 | 0 | 0 |
| bare-wire | 1 | 2 | 0 | 2 |

### warm-hands
- j-amara-diallo: **partly** - Stream added, stroke thickened to 6.5 and stream held in the reduced pose, but it is 3 units and low contrast, so the spinner read is reduced, not removed.
- j-henrik-vale: **rejected** - Refused offset-path on seam and Safari risk; the seam worry is real for an open spiral path, and the stream covers the 'being poured' read, but the rotating-decal problem I named is untouched.
- j-mara-okafor: **yes** - The stream was built exactly as specified, outside .sweep, opacity-only; the stain went to 3.6 not 4 but is now static and reads as one ring.
- j-rosie-tran: **partly** - The stream landed as a fixed line down to the pivot, not from the rim to the moving tip, so it reads as a pour but not a travelling one.
- j-sun-park: **rejected** - Layer split declined as a second SVG for about one point; the repaint is disclosed honestly, so the reason mostly holds but the cost stays.

### the-glitch
- j-amara-diallo: **yes** - Slip, ghost and hard cut deleted outright; drop now fades and squashes into the ring; the pip fade-in is moot because the pips were removed.
- j-henrik-vale: **yes** - Pips and striped band deleted, crema steps live on the surface ellipse, the hiccup became a scaleY stream at 3.0-3.5s; built as a separate element rather than a stretched drop, which is a fair call.
- j-mara-okafor: **partly** - The pips, slip and ghost are gone, but they put a new count in their place that resets every loop, the very thing the note asked them to remove; the 'provocation' reason does not hold for a waiting user.
- j-rosie-tran: **yes** - The orange layer was removed at every size, not just at 120px; the slip and ghost are gone and the drop and count are kept.
- j-sun-park: **yes** - Opacity snap and teleport replaced by eased squash and fade, and the slip was deleted outright.

### bare-wire
- j-amara-diallo: **rejected** - Five clockwise scars refused as a spinner grammar and clutter, which holds against calm; the fade-in point was taken and the scar is now legible at 120px.
- j-henrik-vale: **yes** - Heal disc deleted, scar opens fast and shrinks over ~1.7s, two off-centre drops per 5s; they added a 0.5s hold, which helps the 120px read.
- j-mara-okafor: **partly** - They took the cap (.55, not .45) and a softer scar colour with a sound contrast reason, but kept two drops per loop; at 2.5s that is calm enough, so I accept the call.
- j-rosie-tran: **rejected** - The drip stroke was refused as a second subject outside the cup; the team enlarged and held the scar instead.
- j-sun-park: **partly** - Scar is larger and held so it reads at 120px and the heal disc is gone, but the heal rim and single-instance markup were not taken.

## Judges' lessons for this domain

- j-amara-diallo: Strong loaders put the 'in progress' meaning in a big, high-contrast silhouette that survives a frozen blurred frame; weak ones hide it in fine detail, faint opacity or motion you have to watch.
- j-henrik-vale: Strong coffee loaders put the idea inside the cup and make every still a printable mark; weak ones bolt UI chrome or a generic pulse onto a cup and only look like coffee while moving.
- j-mara-okafor: Strong loaders pick one mover on one clock and make everything else breathe under it; weak ones add a second rhythm, a counter or an accumulating fill that the waiting eye has to track or that reads as a reset.
- j-rosie-tran: Strong coffee loaders show the pour already happening in the first frame and keep the motion steady and countable; weak ones open on an empty cup, a spinner, or a glitch that reads as a fault.
- j-sun-park: The loaders that ship are the ones with few animated nodes, one clock and no cuts or clips; every extra animated element or hard cut is cost a weak phone pays on every frame.

## Judge notes

### warm-hands
- j-amara-diallo: loved - Big high-contrast spiral on espresso stays legible blurred, with a one-clock linear sweep that never looks stalled.; docked - Spiral still turns like a rosette and the new stream is thin and pale against the paper, so the pour cue is fragile in glare.
- j-henrik-vale: loved - Still the only entry that looks like a specific cafe, and the static stream finally tells a glance that milk is going in.; docked - The finished rosetta still spins as a rigid decal, so the motion keeps spinner grammar; the stream sits on top of it rather than driving it.
- j-mara-okafor: loved - The stream turns 'a spiral that spins' into 'a spiral being poured' at no cost to the seamless linear sweep.; docked - The spiral is still the biggest shape and still rotates, so a spinner read survives at 120px, and animated SVG groups behind <use> still repaint.
- j-rosie-tran: loved - It looks like someone is pouring, not loading: the cup, handle, pour tip and stain say coffee, and nothing flashes.; docked - The rotating spiral still reads as a spinner or cinnamon roll at 120px, and the thin stream is too faint to carry the pour alone.
- j-sun-park: loved - Single 5s period for every animated property, linear sweep with matching velocity at the wrap, and one shared symbol for both sizes.; docked - The sweep still repaints the entire cup every frame, and v2 adds another animated node (the stream) while declining the layer split.

### the-glitch
- j-amara-diallo: loved - Orange layer, slip and hard cuts are gone, leaving one steady drip per second that divides the 5s loop and a calm, designed reduced-motion pose.; docked - The crema count tops out near 80% then swaps back in 0.25s, so it can read as fill-and-empty, which undercuts 'never finishes'.
- j-henrik-vale: loved - The coffee now keeps the score: crema lightens per landing and the 3s pull is a real espresso event, not a render bug.; docked - The stepped crema peaks near 4.7s then drains in 0.25s, which flirts with a fill-and-reset, and the side-profile cup is generic clip art territory.
- j-mara-okafor: loved - Removing the orange layer and the hard cuts leaves the most literal and calm coffee read on the table: a drop falls, squashes and rings into the cup.; docked - The accumulating crema climbs to near-full at 4.7s and then empties: a fill-and-reset that the team's own screenshots confirm, and the 1Hz beat is still brisk.
- j-rosie-tran: loved - One drop a second, falling into a cup that counts up in crema, is a steady, countable wait that reads as coffee on the way.; docked - The crema step at beat 5 can look like a drain, and the 3s pull is a little dramatic for a half-awake glance.
- j-sun-park: loved - The hard cuts and the clip-masked orange slip are gone, and the drop now fades and squashes into the ring on one 1s beat that divides 5s.; docked - The pointless 0.98 surface breathe still repaints every frame, and the 0.25s crema swap at the wrap can read as a drain.

### bare-wire
- j-amara-diallo: loved - The closing hole is calm, seam-clean (frame 5.0 equals 0.0), and the pitch owns its ripple mistake.; docked - Top-down cup plus dark dot says 'coffee' only weakly and 'progress' barely; accessible name never mentions the order.
- j-henrik-vale: loved - The wound now closes instead of spreading: fast open, a held dark hole, a slow settle, which is crema physics told honestly in six shapes.; docked - Still a dot in a disc; nothing in the still says this cafe rather than any brown circle, and the bare-field frames at each handoff are an empty cup icon.
- j-mara-okafor: loved - Open fast, hold, close slowly over 1.7s: the hole settles instead of rippling, and it all stays in six fills-only shapes.; docked - At 120px a dark disc in a top-down cup still says 'something in a cup' more than 'coffee on its way', and the 0.3s opening is a little abrupt.
- j-rosie-tran: loved - The top-down cup with its handle reads as coffee at a glance, and the calm one-beat rhythm has no spinner rotation.; docked - The dark hole reads as a pothole or a stall more than coffee arriving, so a half-awake glance does not say 'coming'.
- j-sun-park: loved - Six fill-only shapes, zero-state at 0%/100%, no JS in the animation path, and the hole now closes slowly instead of rippling outward.; docked - Animation still lives on SVG children so the full SVG repaints, will-change on SVG nodes buys little, and the duplicate pasted SVG remains.
