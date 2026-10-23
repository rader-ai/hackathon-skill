# Feedback: Dev Okafor, design director, 25-person brand and digital agency

## 1. Who I am and what I'd use this for
I pitch weekly and need several genuinely different routes fast, presentable to a client. Three real briefs:
1. **Identity routes** for a regional credit union rebrand: three to five marks, palettes, type pairings and a one-line rationale each.
2. **Campaign concepts** for a beverage launch: big idea, tagline, hero visual, three channel executions per route.
3. **Pitch microsite**: a teaser page for a prospective fintech client with a motion hero, in two or three tonal directions.

## 2. First impression
Thirty seconds in: "clever, and the GIFs are charming." The temperaments (Purists, Provocateurs) map onto how my own studio argues, and the judges-then-rematch loop is a nice touch. What I couldn't tell:
- Whether it does identity or campaign work at all. Every example is a small web or CSS thing (a loader, a 404). Nothing shows a logo, a type system or a deck. I'd assume it's a dev toy until proven otherwise.
- Whether the output is something I can put in front of a client. The bakery render (`group-b-375.png`) is a sweet idea, but it's a 375px screenshot of a page with a loaf that two judges said reads as a frown. I wouldn't show that raw.

## 3. Friction
- **Brand constraints are one row in a table.** SKILL.md Intake lists "Constraints - brand, assets, tools, length, format" with default "none". There's no way to say "client palette is locked, logo is this SVG, tone is never ironic, competitors are X, Y". Every route I pitch lives inside a brand brief or a category.
- **Feeding in assets is undefined.** No mention of attaching a logo, a Figma export, a moodboard, a brand PDF or reference images. The brief is text only. `brief.md` has nowhere for them, and the team prompts only read `brief.md`, their own folder and the public judges files.
- **Output format is code-shaped.** `build/index.html` is the universal deliverable. Identity work wants SVG marks, a type specimen and a palette board. The Craftsperson is assumed to build one HTML file within 5 minutes (SKILL.md, clock table), which caps ambition. In the example, builds came in at 3-5 KB.
- **Presenting to a client is not a use case.** SKILL.md section 4 reveals to *the user* with scores and "biggest disagreement". There is no client-facing view. The scoreboard page is optional and appears only if I ask. I'd have to strip out judge names, scores and the invented personas myself.
- **Convergence worry.** Same underlying model for every team; the diversity is persona flavour. In the coffee loader, all three teams landed on top-down cup or cup-with-drop. Judges scored Bare Wire and Glitch as pulse-like. SKILL.md itself says convergence has to be policed ("table stakes" reframing). For identity work I'd expect three teams to give me three variations of a geometric monogram.
- **Rematch converges ideas.** Notes go back to every team, and v2s steal from rivals. The Glitch had its provocation sanded off to win points. That's a design-by-committee machine, and my best route is often the one a committee would kill.

## 4. What would make me adopt it
1. **A "pitch pack" output.** For each route: a one-page board (name, hook, hero visual, palette, type, rationale, risks) in a client-presentable template with my agency's logo slot and no scores or judge chatter. Export to PDF or Figma-importable SVG.
2. **A real brand-brief intake.** Upload client logo, palette, fonts, tone words, do-nots and competitors. These become hard constraints that every agent and judge reads, with a constraint-checker role in the Skeptic's review. Plus a "divergence gate": before building, the Host compares proposals and rejects routes that share a mechanism or visual idea.

## 5. Ideas backlog
- **Brand lock file** · constraints are one line, so routes ignore the client's palette and tone · `brand.md` plus asset folder (SVG logo, palette JSON, font names, do-nots) read by every role, judges score "brand fit" as a hard gate · high · M
- **Client-ready pitch board** · I can't show a score table to a client · per-team one-page board, no scores, my agency's template, PDF export · high · M
- **Divergence gate** · routes look like variations on one idea · after Round 1, an Opus agent clusters proposals by mechanism, visual device and palette, and forces a redo for any two that overlap · high · S
- **Medium packs** · every build is an HTML file · deliverable templates for identity (SVG mark, lockups, palette, type specimen), campaign (key visual, three executions) and deck (slides), with matching judges · high · L
- **Asset ingestion** · I have logos, moodboards and a competitive audit in Figma and PDFs · accept images and PDFs in intake, teams get a reference summary and may cite them · med · M
- **Client-persona judge** · invented design critics don't predict my client · add a judge built from the client's brief, website and past work (the CFO, the CMO) with veto weight · med · M

## 6. Deal-breakers
- Anything that ships to a client with scores, judge personas or AI-sounding rationale showing.
- Routes that ignore a locked brand palette or logo.
- Three routes that look like one idea in three colours. Pitching that costs me the room.
- No way to export something I can drop into Figma or a deck. Raw HTML in `group-project-runs/` isn't a deliverable.
- A real-world trademark lookalike with no warning.
