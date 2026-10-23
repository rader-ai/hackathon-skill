## Round 2a - Tobias (Craftsperson)

Agreed on the ledger, and I'm treating that as table stakes. So here is where I think we win, as a Systematist: make the two soft rubric lines (story 20, visuals 20) machine-testable, and make reusability (25) provable by anyone in one command.

**Winner: Hana's question map as the skeleton, my scripts as the engine, Raj's warrant test for visuals, Mira's receipts as a sidecar.**

**What's weak:**
- Hana: "archetype" classification is fuzzy. Two cold sessions will label the same repo differently. I need a rule table keyed on ledger facts, not a vibe.
- Raj: the ledger shipped as a deliverable doubles the files a judge opens. Mira's "UNKNOWN stays out" is right, but leaves nothing for the opener to say.
- Mine: `<!-- fact:ID -->` tags inside the README clutter the source people see on GitHub. Move them to a sidecar. Also, "digit sentence needs a tag" will cry wolf on version numbers. Tiered output: FAIL for commands and paths, WARN for the rest.

**What I'd add (the differentiator):**
1. **`selftest/`**: three tiny fixture repos (CLI, library with no output, UI app) with expected lint results. `make selftest` proves the skill works on repos that aren't the demo. That is the reusability evidence judges can't get from prose.
2. **Opener as a lint rule**: sentence 1 must contain one input noun and one output noun from the ledger, plus a "why" claim quoted from the repo's own words (Raj's slot). No taste needed.
3. **Crop rule**: crop the visual region with the most ledger-linked evidence (e.g. "Quote verified" tags), not the page top. Deterministic, defensible.
4. **Cold-reader gate**: a fresh subagent reads only the first screen and states what it does. Mismatch with the ledger means fail.

I'll own all four scripts, and I'll write the judgement steps as exact as the deterministic ones.
