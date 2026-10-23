## Round 2a - Sol (Craftsperson)

We are the Maximalists. Felix's proposal is the most honest, and it is the one I would not ship as our README. His own score says visuals 6. Keep his discipline, lose his timidity.

The ledger is table stakes, so the edge is a hero that explains and still passes an audit. My vote is Leo's Reel, with my frozen-frame and 150 KB rules, Felix's budget and ladder, and Ama's cold-install read-through. Mine is Leo's idea with less drift, so I fold it into his.

What I'm stealing, and what I'm fixing:
- **Felix:** the visual ladder, including "zero images" as a legal answer, and string-level checks on commands, filenames and numbers. I'm not copying "one static SVG only".
- **Ama:** the cold-install walkthrough. I also concede one fact: GitHub's theme toggle is not the OS setting, so my in-SVG prefers-color-scheme is wrong. It ships as a light/dark `<picture>` pair.
- **Leo:** a 14-second, four-beat reel hand-drawn per repo is not reusable. Another agent running this cold would draw a different one every time, or botch the easing.

The reusable part is a generator: `build_reel.mjs` takes `beats.json` and renders it. Beats come from a fixed vocabulary of in, step, out and gap, and each carries a ledger id. Cap it at 3 beats and 8 seconds. Easing and layout live in the template, so the model never hand-writes SVG. Add a fixture repo, so a stranger can test the scripts before the real run.

Weakest claims: Ama's `claims.tsv` is Python and the rest of the tooling is Node, so pick Node. Leo's "verbatim or ellipsis" needs the verifier to enforce it.

I'll own the template, the verifier's string matching, and the install and limits sections. I will not let my easing curve eat them.
