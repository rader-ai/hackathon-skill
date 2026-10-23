# Judges' Brief - Coffee App Loading Indicator

## The goal

Find the 5-second looping loader a real coffee app (ordering from local cafés) could ship tomorrow: one that is unmistakably *of coffee*, tells a half-awake customer "your coffee is already moving" in a one-second glance at 120px, makes the wait feel shorter and calmer, and works for everyone, including people who need reduced motion. Beauty counts only when it serves the person waiting. A quieter, better-timed loader will beat a louder one.

## What you must deliver

All three teams deliver the same three files so we can compare like with like.

1. **`build/index.html`**: one self-contained file that opens directly in a browser by double-click.
   - No build step, no external JS, no external images, fonts or CDNs. Inline SVG and inline `<style>` are fine.
   - Animation is **CSS only**. A few lines of JS are allowed **only** for a replay/restart control.
   - **One full cycle = exactly 5s**, set with `animation-duration: 5s` (or child timings that divide 5s evenly), on `animation-iteration-count: infinite`. It must loop seamlessly, because in the app it may run for 1s or for 30s.
   - The page must show the loader **twice, side by side**: once in a fixed **120×120px** box (the in-app size) and once as a **full-viewport splash** at the same timing. Both must be the same component, scaled, not two separate drawings.
   - Include a `@media (prefers-reduced-motion: reduce)` block that swaps in a calm, still-communicative alternative (for example a slow opacity pulse or a static state with a gentle cue). Freezing on a random frame does not count.
   - Propose your own palette (the brand is open). Declare colours as CSS custom properties at the top.
   - Optional: a small toggle to preview the reduced-motion version without changing OS settings.
2. **`build/README.md`**: brief notes covering the concept in one sentence, the palette, how the 5s cycle is broken down (a beat sheet with timestamps), which properties animate, how the loop closes, what the reduced-motion version does, and any browser caveats.
3. **`pitch.md`**: maximum **400 words**. Sell the idea to the panel: what it is, why it is coffee and why it is this brand, why it makes the wait feel shorter, and what the risks or trade-offs are.

## The panel

- **Mara Okafor**, Head of Product Motion (Head Judge). Led motion for a top-10 food-delivery app, and judges every frame by whether it helps a waiting user or just makes them wait prettier.
- **Henrik Vale**, Executive Creative Director, hospitality brands. Has built identities for roasters and café chains, and wants ideas that taste of coffee and could only belong to one brand.
- **Sun Park**, Staff Front-End Engineer, performance & animation. Has profiled endless janky spinners and wants compositor-only, lean and crisp motion that survives a low-end Android.
- **Amara Diallo**, UX Research Lead, perceived performance & inclusion. Studies how waiting feels, and wants calm, steady progress plus a reduced-motion fallback that still says "working on it".
- **Rosie Tran**, Audience Proxy (everyday coffee-app user). A nurse ordering one-handed before a shift who decides in a second whether a loader says "coffee is coming" or "stuck".

## The rubric

Each judge scores each criterion 1-10. Your rubric score is the weighted sum (0-100), averaged across judges.

| Criterion | Weight | What a 10 looks like |
|---|---|---|
| **Coffee concept & ownability** (`concept`) | 20 | One clear idea from the ritual of coffee itself (grind, bloom, pour, crema, tamp, drip), not steam over a cup. It could only belong to this café-ordering brand and could anchor its whole motion language. |
| **Motion, timing & perceived wait** (`motion`) | 25 | Every movement has a purpose, and the easing and rhythm feel warm and unhurried. The 5s loop has no findable seam, progress reads as steady and ongoing, and the wait feels shorter than it is. |
| **Engineering craft & performance** (`craft`) | 20 | Lean markup that animates only `transform`/`opacity` (no animated layout properties, heavy filters or blur), scales crisply from 120px to full splash, and meets every technical constraint. Code the next engineer could maintain. |
| **Glanceability & inclusion** (`clarity`) | 20 | At 120px, a tired customer gets "my coffee is on its way" in one second with no explanation. Nothing flashes or nags, and the reduced-motion version is deliberate and still communicates "working on it". |
| **Pitch** (`pitch`) | 15 | At most 400 words. Short, persuasive and honest about risks, it explains the idea and the timing choices and makes the panel want to ship it. |

## Signature criteria

Each of the 5 judges also holds **one undisclosed signature criterion**, scored 0-10 and worth **up to 3 points** each (up to 15 bonus points in total). They are not published. The best preparation is to take the brief, the panel's loves and hates, and real-world use seriously.

## What will lose points

- **Fake finishes**: a "done!" beat (a full cup, a checkmark, a big resolve-and-pause) in a loader whose order has not actually finished, which then resets.
- **Visible seams**: a snap, jump, pop or hitch when the 5s cycle wraps back to 0s.
- **Jank and bloat**: animating `width`, `height`, `top`, `left`, `margin` and similar properties, heavy `filter`/`blur`/`box-shadow` animation, or bloated markup.
- **Falling apart at 120px**: detail that turns to mush or becomes unreadable at the in-app size, or spectacle that only works full-screen.
- **Ignoring `prefers-reduced-motion`**, or a fallback that is just a frozen, awkward frame.
- **Anxiety-inducing motion**: flashing, strobing, frantic speed, or anything that demands attention instead of reassuring.
- **Looking stuck**: long still holds or ambiguous motion that makes a user wonder whether anything is happening.
- **Generic coffee clip art**: steam curling over a mug, or a spinner that would look just as at home in a fintech or food-delivery app.
- **Decoration that slows the wait**: drama that makes 5 seconds feel like 20.
- **Breaking the constraints**: external assets, JS-driven animation, a cycle that is not 5s, or a `pitch.md` over 400 words.
