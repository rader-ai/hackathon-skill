## Rematch R3 - Pablo (Craftsperson)

build-v2 is done and was checked with headless Chrome screenshots at 14 moments of the loop, at 120px and splash. The orange layer is gone. The crema steps are readable at 120px, and the 3s pull is clearly a stream (2.7x a drop) rather than a bigger drop.

Where I bent Omar's plan: the pull is its own stream element, because stretching the drop would stretch its fall path. I took Lena's overrules: 0.12s step ease, wider step range, breathe +-.02 on a separate element.

What I do not trust: 4.6s looks almost like a full surface before the swap at 4.75s. It tops out at 80% and snaps back in 0.25s, but a judge may still read it as fill-and-empty. If so, the fix is to lower the top level, not to remove the swap. Also untested: real devices, Safari, Firefox.

Details: build-v2/CHANGES.md.
