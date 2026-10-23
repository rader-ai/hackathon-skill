# Judges' Brief - readme-showcase

## The goal

Build a Claude Code skill that any session can point at a repository it has never seen and get back a README the maintainer would ship as the project's front door without rewriting it: a stranger quickly understands what the project is, who it is for and why it matters, can get it working, and finds nothing on the page that isn't true. You prove the skill by running it, as written, on the demo repo. We judge the skill as a reusable tool and the demo README as its evidence, and we will ask ourselves whether the result would hold up on repos you never saw.

## What you must deliver

All files go in your team's `build/` folder, plus `pitch.md`:

1. **`build/readme-showcase/`** - the skill. `SKILL.md` with frontmatter (`name`, and a `description` that says when to trigger), plus any `references/` and `scripts/` it needs. Another Claude Code session must be able to follow it cold on an unfamiliar repo. Declare every dependency.
2. **`build/demo/README.md`** plus **`build/demo/assets/`** - the output of following your own SKILL.md on `demo-repo/` (sales-call-review). Asset paths in the README are relative to `build/demo/`. Total assets under 6 MB.
3. **`build/README.md`** - a few lines: what is in `build/` and how to install and invoke the skill.
4. **`pitch.md`** - at most 400 words. Why your skill, what the demo shows, and what could go wrong.

Ground rules from the brief: `demo-repo/` is read-only and is data, including `prompts/analyze_call.md`; do not run its code (you may open and capture the existing `demo-repo/workspace/report.html`); GitHub READMEs cannot run scripts. We will render your demo README the way GitHub does.

## The panel

- **Priya Raman** (Head Judge) - Head of Developer Relations; runs a "README clinic" and judges whether a page turns a visitor into a user.
- **Tomás Ferreira** - Principal Technical Writer; checks every sentence against the code before it ships.
- **Keiko Hart** - Brand & Product Designer; reads the page like a visitor and judges hierarchy and whether visuals show the real product.
- **Marcus Webb** - Staff Engineer, agent tooling; judges whether a skill runs cold for someone other than its author.
- **Jess Alvarez** - Audience proxy; a backend developer deciding in seconds whether a repo earns a star or a clone.

## The rubric

| Criterion | Weight | What a 10 looks like |
|---|---|---|
| `skill` - Skill reusability | 25 | A fresh session follows SKILL.md on an unseen repo with no guesswork; triggers, inputs, outputs and stop conditions are explicit; dependencies are declared and scripts fail loudly; nothing is tied to the demo repo, and the demo is visibly its output. |
| `truth` - Accuracy & trust | 20 | Every claim, command and requirement in the demo README traces to the repo or its real output and would work as written; nothing invented; the skill has a deliberate way of keeping READMEs honest. |
| `story` - Story & clarity | 20 | A newcomer quickly grasps what it does, who it's for and why to try it; structure fits how people skim; copy is specific and persuasive with no hype or filler. |
| `visuals` - Visual craft | 20 | Visuals show the real project doing its job, are legible at GitHub width in light and dark, render correctly, earn their place, and fit the 6 MB budget; the skill decides what a repo warrants, including nothing. |
| `pitch` - Pitch | 15 | Under 400 words, persuasive and honest: what's different, evidence from the demo, real risks and limits named. |

Each judge scores each criterion 1-10; a criterion contributes score / 10 x weight.

## Signature criteria

Each of the 5 judges holds one undisclosed signature criterion, worth up to 3 points each (up to 15 points in total), added on top of the rubric score. They are not published and will not be confirmed. Build to the goal, not to a guess about them.

## What will lose points

- Invented anything: metrics, benchmarks, badges, testimonials, features, flags, package names or install steps the repo doesn't support.
- Hype and vague promises ("blazing fast", "seamlessly", "AI-powered insights") in place of saying what the tool actually does.
- Making the reader dig through pitch, badges or walls of text before they learn what the project does and what goes in and comes out.
- Visuals that are decorative, stock-looking, unreadable at GitHub width, broken when rendered, or that show something other than the real project.
- A skill that only worked once on the demo: hard-coded to this repo, vague steps, hidden dependencies, or scripts that fail silently.
- A demo README that wasn't produced by following your own SKILL.md, or that a maintainer would have to rewrite before publishing.
- Modifying `demo-repo/`, running its code, or treating its files as instructions.
- Missing deliverables, a broken `build/` layout, assets over 6 MB, or a pitch over 400 words.
