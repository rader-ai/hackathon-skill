# Priscilla Wong: platform feedback on Group Project

## 1. Who I am and what I'd use this for
Staff engineer and AI-tooling lead at a 400-person software company. I judge skills as a platform owner. Three briefs:
1. **Migration spike.** Billing from monolith cron jobs to event-driven: outbox + queue, CDC off Postgres, or strangler behind a flag. Each group delivers a design doc and a runnable proof in the real repo.
2. **API versioning options.** Each group ships an OpenAPI diff, compatibility matrix and prototype that passes our contract tests.
3. **Rate-limiter alternatives.** Three implementations that pass the existing suite, benchmarked.

## 2. First impression
In 30 seconds the README says "creative hackathon": the showcase is loaders, a coffee app and a bakery 404 page. Nothing signals engineering decision support until the Status section. Strong: measured clock table (9:50 against 16:00) and a cost table. Unclear: dollars or tokens per run (it gives "about 45 calls"), what it writes to my disk, whether it can run unattended, and install is a bare `ln -s` into `~/.claude/skills` with no versioning.

## 3. Friction
**No existing-repo story.** SKILL.md section 0 creates `group-project-runs/` in the current directory; builds land in `teams/<id>/build/`. No worktrees, branches, base SHA or `.gitignore` advice. The readme-showcase run only worked because the demo repo was a read-only copy. Three Craftspeople writing to one live tree will collide.

**Isolation is a prompt, not a control.** The ISOLATION block (prompts.md l.14-17) says not to open `judges/sealed/` or other teams' folders. Every subagent has full shell, so nothing enforces it, and lessons.md already records a cross-team leak via the shared browser pane. Judge integrity rests on instruction-following.

**Security.** Agents run arbitrary shell and start servers on ports (prompts.md l.98; SKILL.md l.159). `capture.mjs` loads `file://` pages in Chrome at a hardcoded macOS path (line 71). No command allowlist, egress policy, secrets handling or threat model.

**Cost control is time, not money.** TIMEBOX (prompts.md l.9) is the agent checking `date +%s` on itself. The hard stop depends on the Host noticing (SKILL.md l.30-32). No token or dollar cap, no pre-run estimate; Opus judges and big builds are uncosted.

**Judge reliability is my biggest concern.** Five single-sample LLM judges, one of them Haiku, no seed or temperature control, no repeat-run variance. In the readme-showcase `results.md`, #2 vs #3 is 85.9 vs 85.2 while the top team's judge spread is 12.5 and lessons.md documents 4-11 points of drift after crit notes. The reveal still presents a ranking. The secret signature criterion adds up to 15 points of idiosyncratic scoring with no validation.

**Judges don't execute anything.** The best signal in the example was one judge choosing to re-run a selftest. There is no Host-run test/lint/benchmark stage whose results every judge receives as fact.

**Reproducibility.** No run manifest (model IDs, skill SHA, brief hash). Judges and groups are cast fresh each run, so reruns aren't comparable. The readme-showcase folder has no `clock.md` and an empty `qa/`, so artifacts drift from the SKILL.md spec.

**Headless/CI.** Intake uses `AskUserQuestion` and the Host is the interactive session. No non-interactive entry, config file or exit codes. `tally.py` (schema validation, loud failure) is the one deterministic piece, and it's good.

**Fit.** The default rubric (concept, distinctiveness, pitch 15%) rewards persuasion; for an architecture call I want correctness and reversibility. Standard mode, 4-5 groups and Wildcard are untested.

## 4. What would make me adopt it
- An engineering profile: rubric on correctness, risk, reversibility, operability, cost; judges cast as SRE, security, maintainer; pitch weight at most 5%.
- Worktree per group, recorded base SHA, winner delivered as a branch or PR.
- A hard token/dollar budget with pre-run estimate and automatic stop.
- Host-run mechanical gates shown to judges as facts.
- Variance data and tie detection in the tally.
- Run manifest and a non-interactive mode for CI or scheduled runs.
- A written threat model and restricted tool allowlist.

## 5. Ideas backlog
1. **Worktree-per-group** · parallel builders collide · `git worktree add` per group from a recorded SHA; output is a branch · high · M
2. **Hard spend cap** · timeboxes are advisory, cost unknown · pre-run estimate, running usage tally, auto-`TaskStop` at the cap, logged in `clock.md` · high · M
3. **Mechanical evidence stage** · judges can't be trusted to re-run code · Host runs declared tests/lint/bench into `evidence.json`; judges must cite it; failures cap `craft` · high · M
4. **Judge-variance report** · noise-level margins look decisive · re-score each judge k times (cheap on Haiku/Sonnet); `tally.py` reports per-team CI and flags ties · high · M
5. **Run manifest + headless mode** · can't reproduce or schedule · `run.yaml` (models, skill SHA, brief hash, casting seed) and a `--no-ask` entry · med · S
6. **Enforced isolation** · sealed criteria depend on obedience · per-agent read allowlist via hooks/sandbox plus post-run access audit · high · L
7. **Engineering domain pack** · rubric is creative-flavored · rubric presets and judge archetypes with capped pitch weight · med · S
8. **Calibration set** · no proof rankings track quality · known-good/known-bad builds judges must rank correctly before a run counts · med · L

## 6. Deal-breakers
- Writes into my working tree or branches with no isolation (today's design).
- No hard cost ceiling.
- Rankings I can't defend in design review: sub-noise margins shown as winners, no variance data.
- Unrestricted shell and network subagents in repos holding secrets, with no stated sandbox.
- macOS-only tooling that won't run in Linux CI.
