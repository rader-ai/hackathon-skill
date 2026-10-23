# Results

## Standings

| # | Team | Total | Rubric | Signature bonus | j-amara-diallo | j-henrik-vale | j-mara-okafor | j-rosie-tran | j-sun-park | Spread |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | warm-hands | **86.2** | 74.8 | +11.4 | 80.0 | 69.5 | 74.0 | 70.0 | 80.5 | 11.0 |
| =2 | bare-wire | **73.5** | 64.2 | +9.3 | 69.0 | 59.5 | 65.5 | 55.5 | 71.5 | 16.0 |
| =2 | the-glitch | **65.5** | 58.6 | +6.9 | 64.5 | 50.5 | 46.5 | 65.0 | 66.5 | 20.0 |

**How clear is each lead?** A lead counts only if it is at least twice its standard error across judges; otherwise the teams share a place.

- warm-hands over bare-wire: **clear lead**, 12.7 points (5 of 5 judges had warm-hands ahead).
- bare-wire vs the-glitch: **too close to call**, 8.0 points with a standard error of 6.5 (4 of 5 judges had bare-wire ahead).

## Criterion averages

| Team | Coffee concept & ownability | Motion, timing & perceived wait | Engineering craft & performance | Glanceability & inclusion | Pitch |
|---|---|---|---|---|---|
| warm-hands | 7.4 | 8.0 | 7.2 | 6.8 | 8.0 |
| bare-wire | 6.6 | 5.8 | 7.6 | 5.4 | 7.0 |
| the-glitch | 5.8 | 4.4 | 6.6 | 6.0 | 7.2 |

## Signature criteria revealed

- **j-amara-diallo** (sonnet) - *Calm Wait Safety*: Does the loader feel calm and steady for everyone, with no strobing, an invisible 5s seam, eased pacing, and a reduced-motion state that still says in progress?  
  Winner: **warm-hands** (9/10) - One slow linear sweep with eased sway and out-of-phase opacity breaths, frame 5.0 verified equal to frame 0.0, no abrupt changes, and a reduced-motion held pour that still breathes so it reads as working on it.
- **j-henrik-vale** (opus) - *Coffee-Ritual Specificity (the swap test)*: Does the motion depict a real, specific moment of making coffee with material-true physics, so that swapping the coffee art for a generic shape would break the idea?  
  Winner: **warm-hands** (6/10) - A pour, a hand-wobbled rim and a mug-ring stain taste of a real cafe, but the cream spiral rotates as a rigid decal - poured milk never spins as a finished shape, so the motion is a spinner wearing latte art.
- **j-mara-okafor** (opus) - *Seam & Wait Honesty*: Whether the loop's 5s-to-0s wrap is invisible in position, opacity and velocity, never fakes completion, and leaves every random frame a dignified place to cut away when the network decides the wait is over.  
  Winner: **warm-hands** (8/10) - Linear 360deg sweep plus a zero-slope sway at the wrap means no position or velocity seam (verified in code and frames), no finish beat ever, and any frame is a clean pose of a pour in progress; reduced motion holds a composed pose that breathes.
- **j-rosie-tran** (haiku) - *Glance-to-meaning at 120px*: How quickly a half-awake customer, seeing the 120px loader for the first time, understands it means the coffee is being made, judged by a one-second glance test.  
  Winner: **the-glitch** (7/10) - A cup under a falling drop with a counting row of dots says something is being made in one glance.
- **j-sun-park** (sonnet) - *Compositor-Clean Loop*: Whether the animation runs only on transform/opacity and closes its 5s loop with no detectable seam, in lean markup.  
  Winner: **bare-wire** (9/10) - Only transform/opacity on filled circles, 1s beats divide 5s, scar opacity 0 at wrap and heal is crema-on-crema so the reset is invisible; six shapes, lean.

Most divisive: **the-glitch** (spread 20.0)

## Judge notes

### warm-hands
- j-amara-diallo: loved - Steady unhurried rotation plus a deliberately composed reduced-motion pose; the loop is seamless in position and velocity.; docked - A turning spiral can still read as a generic spinner at 120px, the stain is fine detail, and SVG child transforms are not compositor-promoted (named honestly).
- j-henrik-vale: loved - The most ownable brand world on the table: imperfect rim, thumb smudge, ring stain, sienna pour tip, and a calm one-turn-per-5s wrist sway that loops with no seam.; docked - Rigid rotation is the physics of a progress spinner, not liquid; to their credit the pitch names the cinnamon-roll/spinner risk and the per-frame SVG repaint honestly.
- j-mara-okafor: loved - One slow net turn per 5s with a wrist's speed variation: steady, never reverses, never resolves; the wait honestly reads as 'someone is pouring' whether it lasts 2s or 30s.; docked - Still a rotating spiral, so it risks reading as a spinner or cinnamon roll; the rim stain strokes go to mush at 120px, and animating inside a <use> shadow tree is untested in Safari.
- j-rosie-tran: loved - A pour already in progress that never finishes makes the wait feel like someone is working on it.; docked - The stain and fine rings turn to mush at 120px, and the spiral could read as a spinner or a cinnamon roll.
- j-sun-park: loved - Genuinely seamless, steady rotation with a single shared symbol, and the velocity claim (~13% variation) checks out against the keyframes.; docked - Animates SVG child groups (repaints, as they admit) and a turning spiral risks reading as a spinner.

### bare-wire
- j-amara-diallo: loved - Honest README and pitch that admit the healing may read as just a pulse; six shapes, fills only, no flashing.; docked - Five identical 1Hz pulses with no directional sense of progress, and the subtle crema-heal idea may be lost at 120px.
- j-henrik-vale: loved - Real restraint: six shapes, fills only, one container-sized component, and a crema field that breathes on a slow 5s second clock.; docked - Pitch sells it as 'the inverse of a ripple' while the code (scar .05->.8, heal .03->.8 a beat later) draws exactly a ripple, at a busy 1Hz that reads as a pulse at 120px.
- j-mara-okafor: loved - Six shapes, two easing curves, fills only, one container-sized component; the leanest and most disciplined build on the table, with a README that says what it did not verify.; docked - The 'inverse of a ripple' is in practice an expanding dark concentric ring every second, so at 120px it reads as a ripple/target pulse at an insistent 1Hz rather than a calm heal.
- j-rosie-tran: loved - The top-down cup with its handle reads as coffee, and the splash is calm and simple.; docked - The drop and heal are too subtle at 120px, so it reads as a static cup rather than a wait.
- j-sun-park: loved - Six shapes, no strokes animated, and a README that admits no trace was taken.; docked - The scar-and-heal is subtle at 120px and reads as a pulse; markup is pasted twice.

### the-glitch
- j-amara-diallo: loved - Reduced-motion branch is well thought out (slow pip cross-fades keep a progress cue), and the pitch is candid about the tic risk.; docked - Designing in an intentional hiccup invites anxiety and looks broken to a tired user; hard-cut pips and drop make the pacing busy rather than soothing.
- j-henrik-vale: loved - The falling drop itself - swell at the spout, ease-in fall, flat ring on the surface - is the one honestly observed coffee gesture here.; docked - A deliberate 'hiccup' and hopping safety-orange pips are UI conceits with no coffee in them; a stripe on the outside of the cup is not crema, and the glitch spends the brand's one waiting moment looking broken.
- j-mara-okafor: loved - The 1s drop with gravity easing and a ring on impact is genuinely of the drip ritual, and the code is tidy, dial-driven and honest that SVG children repaint.; docked - Designing a hitch into a loader puts a seam on purpose; hot orange pips and the ghost demand attention, and at 120px the side-view cup under a spout is close to generic coffee clip art.
- j-rosie-tran: loved - The one-second drop and five-dot counter make the wait feel steady and countable, the easiest read at 120px.; docked - The band slip every loop looks like a rendering bug, which could make a tired customer wonder if the app is broken.
- j-sun-park: loved - Clear drip read at 120px and a pitch that names the glitch risk and the 4px floor.; docked - A purposeful hitch plus hard-cut drops every second makes the loop twitchier than a loader should be.
