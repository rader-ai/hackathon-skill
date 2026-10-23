# Signature criterion - Tomás Ferreira (j-tomas-ferreira)

**Name:** Claim traceability

**Description:** Every factual claim in the demo README (features, commands, flags, file paths, file formats, outputs, requirements, numbers) can be verified against something that actually exists in `demo-repo/`: a file, a function, a CLI argument, a test, or the generated `workspace/report.html`. A second check covers the skill itself: does SKILL.md make the writer verify claims against the source, rather than just telling it to "be accurate"?

**How I'll score it (0-10):**
I take a sample of 15 or more concrete claims from `build/demo/README.md` and check each one against the repo. Every install or usage command must match `run.py` exactly: same subcommands, same arguments, same file paths. Every screenshot or GIF must come from the real report or a real run, not a mock-up presented as real.
- 10: every sampled claim checks out; commands copy-paste correctly against `run.py`; any number or limit cited comes from the repo; SKILL.md has an explicit verification step (for example a claim-to-source checklist or a script).
- 7-9: one minor inaccuracy or vague overstatement, with no wrong commands and no invented numbers.
- 4-6: two or three claims fail to check out, or one command or path is wrong, or SKILL.md has no verification step.
- 1-3: several unsupported claims, an invented metric or badge, or a feature the code doesn't have.
- 0: the README describes a different tool than the code implements.

**Why I care:** A README is the first contract a project makes with its users. For 18 years I've seen polished copy bring in readers and then lose them at the first command that fails. A skill that writes beautiful but unverified READMEs automates the most expensive kind of documentation bug.
