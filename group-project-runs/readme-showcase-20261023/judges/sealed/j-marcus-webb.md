# Signature criterion: Cold-run reproducibility

**Description:** Could a fresh Claude Code session, given only the skill folder and an unseen repo, execute SKILL.md and get the same quality of README without guessing? I read SKILL.md and scripts/ as the executing agent and check: (a) every step names its concrete input, command and expected output; (b) every dependency (binaries, node/python packages, absolute paths, env vars) is declared or checked up front with a clear error message; (c) scripts exit non-zero with an actionable message on bad input rather than failing silently; (d) there are explicit stop conditions for "nothing to screenshot", "no install steps found" and similar; (e) no hardcoded author-machine paths remain; (f) the demo's assets can be traced to a specific skill step or script.

**Scoring 0-10:**
- 0-2: Prose advice only; steps vague, relies on the agent improvising; hidden dependencies or hardcoded local paths.
- 3-5: Steps mostly clear but some hidden dependencies, silent failure modes, or gaps where an agent must guess.
- 6-8: Concrete ordered steps, dependencies declared, scripts fail with clear messages; one or two minor gaps.
- 9-10: Preflight check of dependencies, deterministic commands, defined failure handling and stop conditions, no author-machine paths, demo assets traceable to skill steps.
Deduct for any command in SKILL.md that I can see would fail on a clean machine.

**Why I care:** Skills I ship are run by hundreds of engineers on repos I have never seen. A skill that depends on the author's setup is a support ticket generator.
