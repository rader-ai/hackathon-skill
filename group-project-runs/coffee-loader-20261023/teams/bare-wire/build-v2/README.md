# Crema Scar Loader v2 - Team Bare Wire

**Concept:** a drop breaks the crema, a dark hole opens fast, and the crema slowly closes it - a wound that heals, twice per loop.

## Shapes (6)
Handle, cup, crema field, scar A, scar B, glint arc. Animated parts are fills only; handle and glint are static strokes. The old `heal` discs are gone.

## Palette
`--roast #2B1810` text, `--scar #6B4226` (about 3:1 on crema, softer than roast), `--cup #1B120D`, `--crema #C98B4E`, `--glint #E8C08F`, `--paper #F4EBDD`.

## Beat sheet (5s)
Two beats of 2.5s. Scar B is scar A with `animation-delay:-2.5s`, at a different offset. Per beat: 0-0.3s open (.05 to .55, ease-out, fades in over the first 75ms); 0.3-0.8s hold at .55; 0.8-2.5s close to 0 (ease-in-out). The glint pulses .7 to 1 at each landing (0s and 2.5s). Field bloom 1 to 1.08 to 1 over 5s.

## Animated properties
`transform` and `opacity` only, on filled circles. No stroke animation, no filters. Not profiled.

## Loop closure
Both scars are scale 0 / opacity 0 at 0% and 100%; the glint and 2.5s beat divide 5s. Checked by screenshot: at t=4.9 only a pin-dot remains, at t=0 the scar is just starting; the bare moment lasts roughly 0.1s.

## Reduced motion
`prefers-reduced-motion` and the preview button: scar B hidden, glint still, one half-closed scar breathes opacity .35 to 1 over 5s, field breathes .88 to 1. Needs no new node.

## Structure
Two pasted identical SVG copies (120px and splash). A CSS-only size toggle was dropped as fragile. JS only for Replay and the reduced-motion preview.

## Honest notes
Chromium headless only (screenshots at 13 moments of the loop at 120px); Safari and Firefox untested; no perf trace. The 2.5s beat is a judgement call between two judges' conflicting advice.
