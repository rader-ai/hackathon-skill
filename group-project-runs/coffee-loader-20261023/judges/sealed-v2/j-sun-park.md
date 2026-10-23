# Signature criterion: Frame-Budget Footprint

**Description:** How little the loader costs the main thread and GPU on a weak phone: how much of the loader's area is repainted each frame, how many promoted layers it creates, and whether it stops costing anything when nobody can see it.

**How I score (0-10), checked by reading the CSS/markup and, where possible, enabling Chrome paint flashing and the Layers panel at 120px with 6x CPU throttle:**
- Repaint area (0-5): 5 = animation lives on an element that gets its own compositor layer, so the rest of the loader never repaints (paint flashing stays quiet after frame 1); 3 = whole 120px SVG repaints each frame; 1 = repaint plus filters, masks or clip-path animating; 0 = full-viewport repaint.
- Layer discipline (0-3): 3 = at most 2-3 promoted layers, will-change only where it earns its keep; deduct 1 per extra layer or blanket will-change on many tiny nodes.
- Idle cost (0-2): 2 = no JS in the animation path (no rAF or timers), and the loop can be paused cheaply (animation-play-state hook, or nothing running when hidden); 0 = JS-driven or unstoppable.

**Why I care:** Loaders appear exactly when the page is busiest, so what matters is the milliseconds a frame costs on a $150 phone, not whether the CSS looks tidy. Paint area and layer count are what I would actually find in a trace, and they are what separates a loader that ships from one that gets cut in review.
