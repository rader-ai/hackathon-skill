# Plan - TICK (Round 3, Omar, Producer)

## Direction (one sentence)
TICK: a flat cut-paper espresso cup where one burnt-orange drop falls every second while a lit pip hops along a five-position chaser, and once per loop the crema band mis-registers sideways by 9 units (7.5% of the width) and is snapped back by the 3s drop, so the loader counts the wait out loud and admits a hiccup instead of faking smoothness.

## Convention broken
"A loader is smooth, continuous and flawless." TICK is discrete (five countable ticks, a chaser that wraps, never a bar) and shows one deliberate, bounded, self-healing glitch. Nothing fills, nothing finishes, so no fake-finish beat exists to be penalised.

## Beat sheet (5s cycle, t=0 equals t=5s by construction)
Each 1s beat k (start at k s, k=0..4) runs the same drop recipe; times below are relative to the beat.
- +0.00-0.15s SWELL: drop scales 0.3 to 1 at the spout (transform), opacity 1.
- +0.15-0.55s FALL: translateY 0 to 32 units, ease-in (gravity). A hard cut to opacity 0 at +0.55 (impact).
- +0.55-0.90s RING: flat ellipse on the coffee surface scales 0.3 to 1, opacity 0.9 to 0, ease-out.
- +0.90-1.00s: nothing new needed; the next swell begins at +1.00. Max gap between visual events is under 0.1s (pips and band are always on screen).
- Pip chaser: pip k is lit (orange, opacity 1) from k s to k+1 s; all others sit at opacity 0.3. Pip 5 hands to pip 1 at 5.0s with no empty frame.
Glitch (once per cycle, beat 3):
- 3.05-3.15s: crema band translateX 0 to +9 units (ease-out); orange registration ghost fades 0 to 0.5 at the band's home position.
- 3.15-3.45s: held displaced. Meanwhile the 3s drop swells, falls and the pip 4 chaser keeps hopping, so motion never stops.
- 3.45-3.55s: band snaps back to 0 (ease-in), landing exactly on the 3s drop impact at 3.55s; ghost fades to 0 by 3.55s.
- 3.55-5.00s: plain rhythm. Total visible glitch: 0.5s. No colour flash, no luminance step over 10%, horizontal only.

## Glitch decision (the live fight)
DECISION: keep the glitch, ship it at a size that can be read, and gate it with a single dial.
- Amplitude at 120px: 9px band shift (7.5% of component width), plus the 50% orange ghost left at home position. The ghost is 9px wide too, so the signal is a 9px orange sliver, readable at thumbnail size.
- Amplitude at splash size: the same 9 viewBox units, so 7.5% of the component side. At an 800px splash that is 60px; at 1440x900 it is 67.5px. It is NOT a separate drawing: `--slip: 9px` is a CSS transform length inside the scaled SVG, so it scales with it.
- Dial: `--slip` (default 9px) and `--ghost` (default 0.5). Fallback rule: if a one-second glance test shows a majority reading it as broken, drop to 4px / 0.35, not to 2px and not to nothing. Below 4px at 120px it is invisible and we have shipped decoration.
- Why this size: Zara's 6% (7px) is borderline at 120px and Pablo's 7px is "visible, not noisy" only on a thick band; I wanted 10% (12px) but at 12px the band's edge approaches the cup silhouette and the picture turns into a different shape. 9 is the largest shift that still reads as the same band moved.
- Why it does not read as a crash (answering Lena): (1) the first 3s are clean, so "dripping" is established before the hiccup; (2) the drop and pips keep moving through the slip, so nothing stalls; (3) only the band moves, the cup, spout, saucer and pips never do; (4) it lasts 0.5s once, away from the seam; (5) the drop landing visibly fixes it, so it resolves as a gesture, not a fault; (6) the registration ghost makes it look designed.
- Reduced motion: no glitch at all.

## Why it beats the alternatives, by criterion
- Concept (20): the drip landing in the cup is a ritual image and the 1s tick is the motion language (buttons settle on the beat, one signature hiccup). Pull, Already Full and One Drop are all variants of one top-down or drip picture the other teams will also have. TICK is the only one with a rule a rival cannot copy in a minute.
- Motion (25): a metronome is steady, countable progress, five chapters instead of a smear, with overlapping events (no dead air) and gravity easing on the fall. The seam is absent because beat 5 is beat 0. Honest risk: the glitch could read as stutter, bounded as above.
- Craft (20): about 20 SVG elements, transform and opacity only, drop and ring on 1s keyframes (divides 5s), pips/glitch/rm pulse on 5s, one SVG scaled for both sizes, colours as properties. The alternatives either need filters (VHS tear) or stretch physics that turn to mush.
- Clarity (20): at 120px: dark field, orange dot falling into a cream cup, a row of nine-pixel pips. Reduced motion has deliberate pulses. Weakness: pip row reads as sequencer, so the pips sit on the saucer line under the cup and are big.
- Pitch (15): "the loader that tells the truth" is a one-line hook and the glitch is the honest-risk paragraph.

## Rejected, and who dissented
- Pull (Lena): inward rings read as a drain or a radar; she conceded it herself. Not dissent now.
- Already Full (mine): a full cup reads as done, and the idea is a copy of Pull. I conceded.
- One Drop (Pablo): a leaky tap. He conceded; his fall easing and 1s-divides-5s rule are stolen.
- No glitch / 2px whisper (Zara and Pablo favoured the whisper as fallback; Lena wants it capped small): rejected as a default. Dissent stands: Lena thinks 9px risks "crash", Zara would rather it were bigger. I could not run a user test, so 9px is a judgement call, held by the 4px dial.
- Real VHS tear, squash-and-stretch, pips under 2px: rejected as un-buildable at 120px without filters.

## Build spec (owner: Pablo; reviewer: Zara for concept fidelity)

### build/index.html (single file, no external anything)
Palette on `:root`: `--roast:#1B100B` (field), `--cup:#F3E6D2`, `--crema:#C8873E` (band, ring), `--shade:#5A3720` (cup shadow stripe), `--orange:#FF5F1F` (drop, lit pip, ghost), `--pip-off:#4A2E1E`, `--cycle:5s`, `--slip:9px`, `--ghost:.5`.
- One art, two instances: write the SVG once as `<svg class="tick" viewBox="0 0 120 120">` in the 120px box, and clone it into the splash with a 3-line `cloneNode` script (the only script besides replay/toggle). If Pablo prefers zero JS, duplicate the ~20 elements verbatim and say so in the README. Both instances share one stylesheet and the same classes; never two different drawings.
- Layout: body is a flex row, 100vh. Left column 200px wide, centred, holds a fixed `width:120px;height:120px` box. Right panel `flex:1`, holds the splash: `.tick` sized `height:min(100%,100vh);aspect-ratio:1`. Labels "120px in-app" and "splash" in small text. A button "Replay" (JS removes and re-adds the animation class) and a "Preview reduced motion" toggle (sets `data-motion="reduce"` on `<html>`).
- Geometry (viewBox units): ground rect fill roast; saucer ellipse cx60 cy98 rx40 ry5 in cup; cup body path x28-92, y56-96 with a rounded bottom, fill cup; shade stripe on the right 8 units wide, fill shade; handle ring at x92-104, y64-82 stroke cup 5, fill none; spout rect x57 y10 w6 h14 fill cup with a pointed nub at y24; coffee surface ellipse cx60 cy62 rx30 ry5 fill crema; crema band rect x28 y54 w64 h10 rx3 fill crema (class `band`, the slipping layer) and `.ghost` copy at the same place, fill orange, opacity 0; drop circle cx60 cy30 r5 fill orange (class `drop`); ring ellipse cx60 cy62 rx22 ry4 fill none stroke orange 2.5 (class `ring`, transform-origin 60px 62px, opacity 0); five pips circle r4.5 at cx 32,46,60,74,88, cy 112, fill pip-off, each with class `pip` and `--i:0..4`.
- All animation is applied with `animation: name var(--cycle) cubic-bezier(...) infinite both` or `calc(var(--cycle)/5)`; no `animation-duration` below 1s. `transform-box: fill-box; transform-origin: center` on every animated element. `will-change: transform, opacity` only on `.drop`, `.ring`, `.band`.
- Keyframes (percentages of their own duration):
  - `drop` (1s): 0% scale .3 opacity 1 translateY 0; 15% scale 1; 15% to 54.9% translateY 0 to 32 with `animation-timing-function: cubic-bezier(.55,0,1,.45)` per keyframe; 55% opacity 0 (and every keyframe after); 100% opacity 1 scale .3 translateY 0 hidden at 99.9% to avoid a visible reset (opacity 0 until the 100% frame, which is invisible because swell starts at scale .3 at the spout).
  - `ring` (1s): 0-55% opacity 0 scale .3; 55% opacity .9; 90% opacity 0 scale 1; 100% opacity 0 scale .3. ease-out.
  - `pip` (5s, negative delay `calc(var(--i) * -1s)`): lit between 0 and 20% (opacity 1, fill via a second stacked orange circle's opacity so we never animate `fill`); 20.01-100% opacity .3. Use stacked circles: static pip-off circle plus an orange circle whose opacity animates; no animated colour.
  - `slip` on `.band` (5s): 0-61% translateX 0; 63% translateX var(--slip); 69% same; 71% 0; 100% 0.
  - `ghostfade` on `.ghost` (5s): 0-61% opacity 0; 63% opacity var(--ghost); 69% same; 71% 0; 100% 0.
  - Loop check: all properties at 100% equal the 0% frame; t=0 shows pip 1 lit, drop mid-swell.
- Reduced motion: a `@media (prefers-reduced-motion: reduce)` block, duplicated 1:1 under `:root[data-motion="reduce"]` for the toggle. Rules: all drop, ring, slip, ghost animations `none` (band at rest, ghost 0); drop is static at scale 1, translateY 12, opacity 1 (held mid-fall, not on the spout); ring static at scale .8, opacity .5 and then a 5s ease-in-out infinite `calm` animation on opacity .25 to .7; pips run the same chaser but as a slow opacity cross-fade (600ms fade within each 1s step, 5s total). No movement anywhere, nothing flashes. Document in README.
- Hard rules to verify before handing over: only `transform` and `opacity` appear in any keyframe; no `filter`, `box-shadow`, `blur`; no `animation-duration` other than 5s or calc(var(--cycle)/5); JS limited to replay + toggle (+ optional clone); file opens by double-click; look at both instances at 1s per frame offsets 0, 1.5, 3.0, 3.1, 3.3, 3.5, 4.9s.

### build/README.md
Sections: Concept (one sentence, as above); Palette (the 7 tokens with hex); Beat sheet with timestamps (copy the beat sheet above verbatim, including the glitch window 3.05-3.55s); Animated properties (transform, opacity only; list per class); How the loop closes (beat 5 equals beat 0; every keyframe 100% equals 0%; drop timing divides 5s; negative-delay pips); Glitch (amplitude 9px/7.5%, dial, fallback 4px/0.35, rationale); Reduced motion (what it does and the toggle); Browser caveats (`transform-box: fill-box` needs Safari 11+/Chrome 64+; CSS animations on SVG children are fine in all evergreen browsers; reduced-motion toggle JS is the only script; no testing on real low-end Android was done, say so).
