# Group B build

- `readme-showcase/` - the skill: `SKILL.md`, `scripts/` (inventory, capture, reel, verify, render-readme, selftest, install-deps), `references/`, `fixtures/`.
- `demo/` - the skill run on demo-repo: `README.md` + `assets/` (what ships), `claims.json`, `beats.json`, `verify-output.txt`, and `proof/` (scratch: inventory, GitHub-render screenshots, cold-run notes, adversary read).

## Install and use
1. Copy the skill: `cp -R readme-showcase ~/.claude/skills/readme-showcase` (or keep it here and read `SKILL.md` by path).
2. Browser (optional, ~150 MB, needed for screenshots, the Reel PNG and the GitHub-render check): `bash readme-showcase/scripts/install-deps.sh`. Needs Node 18+; `gh` for the render check.
3. Check the tooling: `bash readme-showcase/scripts/selftest.sh`. `COMPLETE` is the goal; `INCOMPLETE` lists what was not tested and exits 3.
4. Invoke by asking the agent: "write a showcase README for <repo path>". It follows `SKILL.md`. Output lands in `./readme-showcase-out/`; the repo is never touched.
If Playwright lives elsewhere, set `READMESHOWCASE_PLAYWRIGHT_DIR`.
