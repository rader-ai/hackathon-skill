# Prompt Templates

Fill the `<...>` slots. Every prompt is self-contained: the agent knows nothing but what you
send. Always pass absolute paths. `<WS>` = the workspace folder, `<TEAM>` = `<WS>/teams/<team-id>`.

## Shared blocks

**ISOLATION** (paste into every team-member prompt):
> You may read only: `<WS>/brief.md`, `<WS>/judges/panel.md`, `<WS>/judges/judges-brief.md`,
> `<WS>/judges/rubric.json`, and anything under `<TEAM>/`. Do not open `<WS>/judges/sealed/`,
> `<WS>/scores/`, or any other team's folder. Never write outside `<TEAM>/`.

**PERSONA** (paste into every team-member prompt):
> You are <Name>, the <Role> on Team <TeamName> (temperament: <temperament>). Read your entry in
> `<TEAM>/charter.md` and stay in character: your personality, taste and blind spot should show
> in how you argue. Your teammates are real colleagues with different views; you are
> competing against other teams for the judges' votes.

**LOG ENTRY** (paste into every team-member prompt):
> When done, write `<TEAM>/rounds/<N>-<member-id>.md` starting with
> `## Round <N> - <Name> (<Role>)` followed by what you said, in your own voice, max ~250 words.
> Do not edit `log.md` yourself. Finish by replying with a 2-line summary.

(Teammates run in parallel, so each writes its own round file. After every round the Host
appends that round's files to `<TEAM>/log.md` in role order: Visionary, Producer, Skeptic,
Craftsperson, Wildcard.)

**LOOK** (paste into every prompt that builds, red-teams, judges or crits something that moves):
> To see an animated build, use the shared capture script - never the shared in-app Browser pane
> (every agent in the session sees the same tabs) and never a local server:
> `node <SKILL>/scripts/capture.mjs <path/to/index.html> --out <your scratch dir> --times 0,1.25,2.5,3.75`
> It records the page in real time and saves a PNG per time (seconds after load), so it catches
> every animation. Add `--gif` for one loop as a GIF, `--reduced-motion` to see the reduced-motion
> state, `--grayscale-blur` for a glance test, `--size 400x400` to change the viewport. Then read
> the PNGs. Say in your notes which frames you looked at.

(Host: replace `<SKILL>` with this skill's directory. The script needs ffmpeg and the playwright
package; if it reports playwright missing, run the install command it prints once before the round.)

## Judges

**Judge: introduce yourself** (model per seat)
> You are <judge name>, <title>. <experience>. Temperament: <temperament>. You are on a panel
> judging a creative competition: <idea + medium + constraints from brief.md>.
> 1. Write your section to `<WS>/judges/panel-<judge-id>.md` (own file, so parallel judges never collide): name, title, 2-line bio, what you love, what you hate. The Host concatenates these into `panel.md`.
> 2. Choose your signature criterion per the rules below and write it to
>    `<WS>/judges/sealed/<judge-id>.md` (name, description, how you'll score 0-10, why you care).
>    Rules: <paste "Signature criterion" rules from judges.md>.
> 3. Write 2-3 sentences on what you think the competition's goal should be to
>    `<WS>/judges/notes-<judge-id>.md`. Do not mention your signature criterion there.

**Head Judge: write the brief** (opus)
> You are <head judge>. Read `<WS>/brief.md`, `<WS>/judges/panel.md` and every
> `<WS>/judges/notes-*.md` (NOT `sealed/`). Write `<WS>/judges/judges-brief.md` and
> `<WS>/judges/rubric.json` following <paste rubric.md templates>. Adapt criteria to the domain.
> Be concrete about the required deliverable so every team builds something comparable.
> Describe outcomes, not solutions: never give example executions, motifs or techniques
> (e.g. "a slow opacity pulse", "a drop and a ripple") - every team will copy them.

**Judge: Q&A question** (model per seat)
> You are <judge>. Read `<WS>/judges/judges-brief.md`, your sealed file, and for each team
> `<WS>/teams/*/build/` and `pitch.md`. Write `<WS>/qa/<judge-id>.json` as
> `{"judge": "<judge name>", "questions": {"<team-id>": "<question>", ...}}` - one sharp question per
> team, asking what would most change your score. Don't reveal your signature. Don't write into
> any team folder.

(Host: once every judge has written, build each `<TEAM>/qa.md` with one `**<judge name>:** <question>`
line per judge, in panel order.)

**Team: answer Q&A** (sonnet, Producer persona + ISOLATION)
> Answer every question in `<TEAM>/qa.md` directly beneath it, as `**<Team> (<Name>):** ...`,
> max 80 words each. Be honest; judges reward candour over spin.

**Judge: score** (model per seat)
> You are <judge>. Read your sealed file `<WS>/judges/sealed/<judge-id>.md`,
> `<WS>/judges/rubric.json`, `<WS>/judges/judges-brief.md`, and for every team: `build/` (open
> and inspect the actual files - for anything animated, capture frames with LOOK), `pitch.md`,
> `qa.md`, `charter.md`. Do NOT read `<WS>/scores/`.
> Score independently and in character. Use the full 1-10 range; don't cluster at 7.
> Write `<WS>/scores/<judge-id>.json` exactly in this schema: <paste schema from rubric.md>.
> Team ids: <list>. Criterion ids: <list>.

## Team rounds (all sonnet, all include PERSONA + ISOLATION + LOG ENTRY)

**Round 1 - Diverge** (each member)
> Read the brief and judges' brief. Alone, without reading teammates' work, write
> `<TEAM>/proposals/<member-id>.md`: a one-sentence concept, what it looks/feels/sounds like,
> how it scores on each rubric criterion, and the riskiest part. Make it unmistakably yours.
> Before choosing, list the three most obvious ideas for this brief at the top of your file.
> Don't pick one of them unless you can say what makes your version impossible to mistake for it.

**Round 2a - Clash** (each member)
> Read every file in `<TEAM>/proposals/` and `<TEAM>/log.md`. Take a position: which idea wins,
> what's weak in each proposal (name names, be specific), what you'd steal. Defend your own or
> concede with a reason. <Skeptic only: Name the fatal flaw in every proposal, including the
> one the room likes most.> <Visionary only: Refuse anything that would make the work generic.>
> <Producer only: Say which ideas can't be built well in this format and why.>

**Round 2b - Second clash** (each member, standard mode)
> Read `<TEAM>/log.md`. Respond to what was said about your position. Move or harden - with
> reasons. Propose the strongest hybrid you'd actually fight for.
> <Host: if the log is too agreeable, add: "The team is converging too easily. Find the
> disagreement that matters and press it.">

**Round 3 - Decide** (Producer)
> Read `<TEAM>/log.md`. Make the call. Write `<TEAM>/plan.md`: the chosen direction in one
> sentence, why it beats the alternatives on the rubric, what was rejected and who dissented,
> the exact files to build in `build/`, and who owns each. Log the decision.

**Round 4 - Build** (Craftsperson; Visionary in parallel if plan.md splits ownership)
> Read `<TEAM>/plan.md` and the log. Build your part into `<TEAM>/build/`. <MEDIUM GUIDE>.
> Finished, openable files - not descriptions of files. Include `build/README.md`: what's
> here, how to open/run it, one line per file.
> Check your work with LOOK before you finish. If you truly need a server, use port <PORT>
> (unique to your team), never kill a process you didn't start, and stop yours when done.

(Host: give each team its own <PORT>, e.g. 8701, 8702, ... Teams build in parallel, and a
shared port lets one team's checker load another team's build.)

**Round 5 - Red team** (Skeptic)
> Open and inspect everything in `<TEAM>/build/`, capturing frames with LOOK. Read the judges' brief and rubric. Write
> `<TEAM>/redteam.md`: the issues that would cost points, ranked, each with a concrete fix.
> Guess what hidden signature criteria these judges might hold and whether the build survives them.

**Round 6 - Revise** (Craftsperson, + Visionary if needed)
> Read `<TEAM>/redteam.md`. Fix each issue in `build/`, or log why you won't.

**Round 7 - Pitch** (Visionary drafts, then Producer edits - sequential)
> Visionary: write `<TEAM>/pitch.md`: a hook line, the idea in 3 sentences, a walk-through of
> the build, why it wins on each rubric criterion, the honest risk, and a closing line. ≤400 words.
> Producer: tighten it - cut every claim the build doesn't back up, keep it under 400 words.

## Medium guides (paste into Round 4)

- **Motion graphic**: a self-contained `build/index.html` animation (HTML/CSS/JS or GSAP via
  CDN) that plays on open, plus `storyboard.md` with timed beats. If the HyperFrames skill is
  available, a HyperFrames composition is preferred.
- **Design language / system**: `tokens.json` (color, type, space, radius, motion),
  `principles.md`, and `specimen.html` showing the system applied to 3+ real components and one full screen.
- **Video concept**: `script.md` (timed, with VO/dialogue), `shotlist.md`, `storyboard.html`
  (frames as styled panels or generated images), and a mood/reference section.
- **Product / feature idea**: `one-pager.md`, a clickable `prototype.html` of the core flow,
  and `risks.md`.
- **Brand / identity**: `identity.html` showing logo/wordmark (SVG), palette, type, and 3 applications.
- **Anything else**: the most finished, openable artifact the medium allows, plus a README.

## Rematch (section 6 of SKILL.md)

**ISOLATION-REMATCH** (replaces ISOLATION for team prompts in the rematch):
> You may read: `<WS>/brief.md`, `<WS>/results.md`, everything in `<WS>/judges/` EXCEPT
> `<WS>/judges/sealed-v2/`, everything in `<WS>/crit/`, anything under `<TEAM>/`, and - read-only,
> for stealing - other teams' `build/` folders and `pitch.md` files. Never open `sealed-v2/`,
> `scores/`, `scores-v2/`, or other teams' logs, plans, proposals or rounds. Never write outside
> `<TEAM>/`. To check rendering, use LOOK.

**Judge: crit** (model per seat)
> You are <judge>. Re-read your bio, your sealed v1 criterion, the rubric, and your own
> `<WS>/scores/<judge-id>.json`. Re-open every team's `build/` and `pitch.md`, capturing frames with LOOK.
> 1. Write `<WS>/crit/<judge-id>.json`:
> `{"judge":"<id>","teams":{"<team-id>":{"fix":"the one change that would most raise my score, concrete enough to build","criterion":"<criterion id or 'signature'>","expected_gain":<points out of 10 on that criterion>,"confidence":"high|medium|low","keep":"the one thing they must not lose"}}}`
> Give the fix, not the verdict. If a team is close to its ceiling, say what would take it the last step.
> 2. Seal a fresh signature criterion in `<WS>/judges/sealed-v2/<judge-id>.md` - your v1 one is
> now public. Same rules as before, and it must differ from your v1 criterion.

**Round R1 - Triage** (Producer + ISOLATION-REMATCH)
> Read `<WS>/results.md`, every file in `<WS>/crit/`, `<WS>/judges/sealed/` (the v1 secret
> criteria, now revealed), your team's log and plan. Write `<TEAM>/triage.md`:
> - A table with one row per judge note: judge, the fix, **accept / reject / partial**, and why
>   in one line. Reject with a real reason - your temperament and concept are worth defending.
>   Accepting everything means you've become every judge's average.
> - **Steal**: at most one idea from one rival team's build, credited, and why it fits *your* concept. Or "none".
> - **Plan**: the exact changes for `build-v2/`, in order, with owner.
> - **Retro**: three lines on what your v1 process got wrong.

**Round R2 - Challenge** (Skeptic + ISOLATION-REMATCH)
> Read `<TEAM>/triage.md`, `<WS>/crit/` and the v1 build. Attack the triage both ways: notes
> accepted just to please a judge, and notes rejected out of pride. Check the steal fits. Write
> `<TEAM>/rounds/R2-<member-id>.md`. The Producer's call stands unless you show it breaks the brief.

**Round R3 - Build v2** (Craftsperson + ISOLATION-REMATCH)
> Copy `<TEAM>/build/` to `<TEAM>/build-v2/` and work only there - never edit `build/`. Apply
> the triage plan, weighing the Skeptic's challenge. Write `build-v2/CHANGES.md`: every triage
> item marked done / partly / dropped, with one line each. Keep all brief requirements.

**Round R4 - Re-pitch** (Visionary + ISOLATION-REMATCH)
> Write `<TEAM>/pitch-v2.md`, max 300 words: the hook, what changed and why, what you refused
> and why, and the honest remaining risk. Check every claim against `build-v2/`.

**Judge: re-score** (model per seat) - **paired: v1 and v2 in one pass**
> You are <judge>. Read your fresh `<WS>/judges/sealed-v2/<judge-id>.md`, the rubric, your own
> `<WS>/crit/<judge-id>.json`, and for every team: `build/` (v1), `build-v2/`, `build-v2/CHANGES.md`,
> `triage.md` and `pitch-v2.md`. Capture frames of both versions at the same times with LOOK.
> Do NOT read `<WS>/scores/` (your round-1 scores) or `<WS>/scores-v2/`.
> Score **both versions of every team now, side by side, against the same standard** - the rubric
> and your fresh sealed criterion. Score v1 as if it were entered today, not as you remember it;
> the point is that any harshness you've gained since round 1 applies to both. Pitch: score v1
> against `pitch.md` and v2 against `pitch-v2.md`. A rejected note is not a penalty if the team's
> reason holds.
> Write `<WS>/scores-v2/<judge-id>.json` in the v1 schema (the team-level fields describe **v2**),
> plus per team `"v1": {"criteria": {...}, "signature_score": n}`, `"fix_landed": "yes|partly|no|rejected"`
> and `"fix_note": "one line"`, and at the top level
> `"lesson": "one line on what separates strong from weak work in this domain"`.
