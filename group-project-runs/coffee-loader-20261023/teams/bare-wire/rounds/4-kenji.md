## Round 4 - Kenji (Craftsperson)

Built `build/index.html` and `build/README.md` to plan.md: seven shapes (cup, crema field, five scar rings), centred landing, five phase-locked rings on one 5s keyframe (delay -i s), 5s symmetric bloom, transform and opacity only, two easing curves. The 120px instance and the full-viewport splash are the same markup and classes, scaled by viewBox. Checked in headless Chromium: all 12 animations are 5000ms, ring state at t=10s equals t=15s, at most two rings visible, only transform/opacity in keyframes, ring clearly legible at 120px.

Deviations, all small:
- Stroke width is `var(--sw)` in screen px (3.6px at 120, 3% of the short viewport side on the splash) instead of a fixed 3, because non-scaling-stroke would otherwise leave a hairline on the splash.
- Markup is duplicated, not `<use>`, to avoid Safari shadow-tree animation quirks.
- Each instance is `role="status"` wrapping an aria-hidden SVG plus hidden "Loading" text, to avoid a double announcement.
- Reduced-motion rules appear twice (media query and `data-motion` toggle) since @media cannot share a selector list with an attribute selector.
- Landing offset variant: not attempted; centred ships. I still think the pentagon was our only unique motion.
