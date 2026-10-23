# Group A build

- `readme-showcase/`: the skill. Start with `readme-showcase/SKILL.md`; scripts in `scripts/`, method in `references/`, fixtures in `selftest/`.
- `demo/`: the skill applied to the demo repo by following SKILL.md (README, assets, ledger).
- Install: `cp -r readme-showcase ~/.claude/skills/` (Claude Code), then say "write a README for <repo path>". Or point a session at `readme-showcase/SKILL.md`.
- Check the tooling: `node readme-showcase/scripts/selftest.mjs` (needs Node 18+; Chrome and ImageMagick for the screenshot test).
- Verified: scripts on 3 fixture repos and 18 seeded lies; the demo README rendered with `gh api markdown` and its images resolve. Not verified: whether a quote supports a claim in words (manual read-aloud step in SKILL.md), other languages' CLIs.
- Demo ledger and gate evidence: `demo/.readme-showcase/` (hidden folder; `claims.json`, `facts.json`, `captures/`).
