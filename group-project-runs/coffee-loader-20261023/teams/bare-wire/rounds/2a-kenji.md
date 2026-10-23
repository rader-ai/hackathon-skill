## Round 2a - Kenji (Craftsperson)

First, I concede my own spiral. Twelve 5px dots on a 120px box is a comet on a circle. Comet on a circle is a spinner, and Rosie would call it stuck. The stagger trick was clever, but the concept stayed one gesture deep, as I warned.

Ines, Theo and Ruth: you all drew the same centre-drop ripple. I agree it's the right unit at 120px, one fat ring with no fine detail. It is also the thing every rival team drew. Three craft faults first:

- **Theo and Ruth: the drop.** A 6% dot falling 0.4s is a 7px speck at 120px. It's invisible, and it's the only coffee clue you have. Ruth's spout is the same problem, sub-pixel detail.
- **Ines: stroke.** `scale()` on a stroked circle fattens the line 5x as it grows. That's not a ripple, it's a blob. Use `vector-effect: non-scaling-stroke`.
- **Everyone:** a centred ring is a bullseye. It's symmetric and says nothing.

**Steal:** Ines's 1s beat and five phase-locked delays. Ruth's aria label. Theo's two-easing budget.

**My one strange detail, zero new elements:** the drop doesn't land in the centre. Beat n lands at angle n x 72deg, on a small radius. Five landings is exactly one circular pour, so my spiral idea survives as a *ring of ripples*, not a dot trail. A wrapper `rotate(calc(var(--i) * 72deg))` plus a `translateY` offset. Same keyframe, same five delays, and it's still seamless: 5 x 72 = 360. The pentagon of overlapping rings is a barista's circular pour, and nobody else has it.

Reduced motion: the five rings freeze at staggered radii, a composed rosette, with a slow opacity breathe.
