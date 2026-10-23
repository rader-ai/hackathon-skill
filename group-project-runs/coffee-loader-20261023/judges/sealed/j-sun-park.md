# Signature criterion: Compositor-Clean Loop

**Description:** Whether the animation runs entirely on cheap, compositor-friendly properties and closes its 5s loop with no detectable seam.

**How I score (0-10), checked by reading the CSS and watching two cycles:**
- Properties (0-4): 4 = only transform/opacity animate; deduct 1 per animated layout/paint property (width, height, top/left, box-shadow, filter, clip-path, SVG path d) and for heavy blur/filter use.
- Seam (0-4): 4 = every animated property has identical values at 0% and 100% and velocity matches across the wrap, with no snap, flash or restart pop; deduct for any visible jump.
- Lean (0-2): 2 = compact markup/CSS, few elements, no redundant keyframes; 0 = bloated.
Also noted: reduced-motion handled without breaking the layout.

**Why I care:** A loader runs exactly when the main thread is busiest, so it must not drop frames, and a seam at the loop point is what users see most often.
