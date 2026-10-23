# Signature criterion - Jess Alvarez

**Name:** Stated-limits accuracy

**Description:** The README tells a developer what the project will not do for them, in concrete, checkable terms: the runtime and version it needs, the input formats it accepts and rejects, the external services or credentials it requires, and at least one known limitation or unsupported case. Each stated requirement or limit must match something verifiable in the repository (a pinned Python version, a file-format check in code, a missing feature, a documented error path). Generic disclaimers ("may not work in all environments") count for nothing.

**How I'll score (0-10):**
- 10: at least three specific requirements or limits, each one verifiable in the repo, and none contradicted by the code or tests.
- 7: two or three specific items, all accurate, but one is vague or unverifiable.
- 4: one specific item, or several generic ones with no repo grounding.
- 1: a claim of compatibility ("works everywhere") with nothing to back it up.
- 0: no requirements or limits stated, or a stated limit that the repo contradicts.

I check each item against the repo by hand. A wrong requirement (wrong Python version, a dependency that is not used) costs more than a missing one, because I will try the install and lose trust in the rest of the page.

**Why I care:** Before I clone anything, I am asking "will this break on my machine, and does it take the kind of input I have?" A README that answers that up front saves me an afternoon. Readmes that skip it, or hide it behind marketing, are the ones I stop reading the moment install fails, and the stated limits are the cheapest signal that the author actually ran the thing.
