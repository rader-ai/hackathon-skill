## Round 1 - Tobias (Craftsperson)

Here's mine: make honesty a build step. Two scripts. `facts.mjs` walks the repo and writes a ledger, each fact with a file:line source (subcommands from argparse, Python floor, license, "no network imports found"). The README gets drafted from that ledger. Then `lint.mjs` checks the README back against it: every command in a code fence must exist in the ledger, every path and image must resolve, banned hype words fail, any sentence with a digit needs a fact tag, no badge without a source. It exits non-zero until clean. Mira, that's your gate, but automated, so you don't have to be the gate every time.

Visuals come from a decision table, not mood: committed HTML output means a cropped screenshot, a multi-stage file flow means a small SVG of the real filenames, nothing qualifying means no visual at all. For the demo, the hero is the real report.html crop with the "Quote verified" tags, and the quickstart sits right under it.

I'll admit where I'm weak: I can make a README provably true and still flat. Hana, Raj, someone has to own the one-line opener and the crop, and I'd rather you tell me the rule for them than let me wave at "choose the compelling one." Raj, the lint pass is your checkbox.
