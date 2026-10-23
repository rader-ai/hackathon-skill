# README structure

## First screen (before the first scroll, about 25 lines)
1. `# Name` (the repo's own name, or the name in its README/manifest; never invent a brand).
2. One sentence directly under the H1: what it is and who it is for, from ledger rows (name the reader the repo names, such as "sales and customer teams" or "coaching"). Nothing sits between the H1 and this sentence. `verify` warns if a visual comes first.
3. The visual from the ladder (rung 1 or 2), when earned. One hero, not two.
4. Try-it: requirement (language version, OS) then the exact commands, copied verbatim from the repo's docs INCLUDING its comment lines (`# macOS` / `# xdg-open ... # Linux`). A command whose output you hold as a capture is `artifact`: no disclaimer.
Leave "unverified" for one footnote line at the end of the README (or only in your report to the user), never mid-page.

## Section order
What it does (2-4 sentences that do not repeat the opening sentence; if the explanation of the hero image belongs here, say what the numbers or labels in it mean, for example "Question marks 4 / 0 is internal / external") -> Who it fits / when not to use it (two lines from the repo's own text) -> Use it with your own data (steps from the repo's docs, commands whole, including optional ones) -> How it works (table or short list; one row per real stage) -> Privacy and data handling (only what the repo states) -> **Limits** (required heading containing "Limits") -> License and credits.
If the first screen already holds the try-it block, do not add a second "Try it" section.

Skip any section the repo gives you nothing true to put in. Do not pad with "Contributing" or "Roadmap" boilerplate you cannot source.

## Writing rules
- Plain, specific, active. Say what happens ("writes `report.html`"), not how impressive it is.
- Every sentence is a ledger row. If a sentence has no source, delete it.
- Banned words (the script fails on these in prose and alt text): revolutionary, seamless(ly), blazing(ly), cutting-edge, powerful, robust, game-changing, effortless(ly), next-generation, next-gen, world-class, best-in-class, supercharge(d), unleash, magical, lightning-fast, turnkey, state-of-the-art, enterprise-grade, battle-tested, groundbreaking, innovative, ultimate, unparalleled, delightful, beautifully.
- No badge unless the thing exists and a `badge` ledger row proves it. No "trusted by", stars, downloads, benchmarks or testimonials that the repo does not contain.
- Limits section: copy the repo's own caveats and the non-obvious ones it implies (data is sample/synthetic, local only, measure X is a proxy, platform/version requirement, missing features it admits). A README with no limits is an unfinished README.
- Install/run: requirements, then commands, then what you should see. Never include a command you could not trace to the repo.
- Keep the file under ~150 lines; link to the repo's docs instead of copying them.

## Install and limits checklist (do before verify)
- [ ] Every prerequisite the repo names (runtime and version, system tools, optional extras) is listed, or "none beyond X" is stated with a source.
- [ ] Commands are in the repo's own order and copied exactly; paths are relative to the repo root.
- [ ] A reader on a clean machine could follow it: nothing assumes a prior step that is not written.
- [ ] Every command is marked verified or "unverified".
- [ ] Limits names at least: what data it needs, what it does not do, and one thing a reader might wrongly assume.
- [ ] License line matches the license file (or says none was found).
