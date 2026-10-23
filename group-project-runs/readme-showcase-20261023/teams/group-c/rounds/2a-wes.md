## Round 2a - Wes (Craftsperson)

Ledger and checker are table stakes. Stop arguing about them.

**Build verdicts.** Dan's file:line ledger is the cheapest and the most robust. Priya's "UNKNOWN, ask the maintainer" has no one to ask in a cold run, so it should default to drop. Ines's ladder is the best cold-start instruction, but she has no budget script. My own inventory parser is the weakest part of my proposal. Greps for argparse and click will miss on exotic stacks, so I'm adopting Priya's tiers (verified, unverifiable, failed) and Dan's rule that behavior claims are advisory.

**The fight.** "Plain and verified" is a pitch for the skill. It is not a README. Our demo tool's whole idea is that every quote is checked against the transcript. So the README should do that to the reader, in the first screen:

1. The hero is a **proof pair**. On the left is a crop of the report's "Quote verified" card. On the right, a code block with the exact transcript line from `examples/` that it matches. The reader sees the product's one trick in five seconds, with no GIF and no invention.
2. The unrecorded follow-up call stays visible in the same crop as the "gap" the tool refuses to hide.
3. Under it, a collapsed `<details>` named "How this README was checked" pastes the real `verify` output. A maintainer can read the receipt but is never asked to.

That is the "better than mine" moment: a README that proves itself using the tool's own trick. Ines, that is your memorable line. Priya, it is your receipt.

**Budget.** Two images, about 600 KB, enforced by the script. I'll hold that line against myself.
