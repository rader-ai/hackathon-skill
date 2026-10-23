# Prompt Templates

Fill the `<...>` slots. Every prompt is self-contained: the agent knows nothing but what you
send. Always pass absolute paths. `<WS>` = the workspace folder, `<TEAM>` = `<WS>/teams/<team-id>`,
`<MIN>` = the phase's budget from the clock table in SKILL.md.

## Shared blocks

**TIMEBOX** (paste into every prompt, with the phase's budget):
> You have <MIN> minutes. Run `date +%s` first and again before each new task. When the time is
> spent, stop: ship what works, and write one line on what's unfinished. A finished small thing
> beats an unfinished big one. Don't polish, don't re-check what already passed.

**ISOLATION** (paste into every team-member prompt):
> You may read only: `<WS>/brief.md`, `<WS>/judges/panel.md`, `<WS>/judges/judges-brief.md`,
> `<WS>/judges/rubric.json`, and anything under `<TEAM>/`. Do not open `<WS>/judges/sealed/`,
> `<WS>/scores/`, or any other team's folder. Never write outside `<TEAM>/`.

**PERSONA** (paste into every team-member prompt):
> You are <Name>, the <Role> on Team <TeamName> (temperament: <temperament>). Read your entry in
> `<TEAM>/charter.md` and stay in character: your personality, taste and blind spot should show
> in how you argue. Your teammates are real colleagues with different views; you are
> competing against other teams for the judges' votes.

**ROUND ENTRY** (paste into every team-member prompt):
> The team's discussion so far is the files in `<TEAM>/rounds/`, read in name order. When done,
> write `<TEAM>/rounds/<N>-<member-id>.md` starting with `## Round <N> - <Name> (<Role>)`,
> followed by what you said, in your own voice, max 150 words. Reply with a 1-line summary.

(Teammates run in parallel, so each writes its own round file and nobody edits a shared log.)

**LOOK** (paste into every prompt that builds, reviews, judges or crits something that moves):
> To see an animated build, use the shared capture script - never the shared in-app Browser pane
> (every agent in the session sees the same tabs) and never a local server:
> `node <SKILL>/scripts/capture.mjs <path/to/index.html> --out <your scratch dir> --times 0,1.25,2.5,3.75`
> It records the page in real time and saves a PNG per time (seconds after load), so it catches
> every animation. Add `--gif` for one loop as a GIF, `--reduced-motion` to see the reduced-motion
> state, `--grayscale-blur` for a glance test, `--size 400x400` to change the viewport. Then read
> the PNGs. Say in your notes which frames you looked at.

(Host: replace `<SKILL>` with this skill's directory. The script needs ffmpeg and the playwright
package; if it reports playwright missing, run the install command it prints once, during Setup.)

## Setup

**Panel designer** (opus, TIMEBOX 1.5)
> You design the judging panel for a creative competition. Read `<WS>/brief.md`,
> `<SKILL>/references/judges.md`, `<SKILL>/references/rubric.md`, and the "What wins" section of
> `<SKILL>/lessons.md` for this domain (<domain heading, or "none">). Write:
> 1. `<WS>/judges/panel.md` - five judges cast for this domain per judges.md (seats: Head Judge
>    opus, Senior opus, two Practitioners sonnet, Audience Proxy haiku). For each: a kebab-case
>    id (`j-firstname-lastname`), name, title, 2-line bio, temperament, "Loves:" and "Hates:".
> 2. `<WS>/judges/sealed/<judge-id>.md` for each judge - one signature criterion each (name,
>    description, how it's scored 0-10, why this judge cares). The five must test five different
>    things; none may duplicate a rubric criterion or another judge's criterion.
> 3. `<WS>/judges/rubric.json` and `<WS>/judges/judges-brief.md` from the rubric.md templates.
>    The brief says each judge holds one undisclosed criterion. Be concrete about the deliverable
>    so teams build comparable things. Describe outcomes, not solutions: never name example
>    executions, motifs or techniques - every team will copy them.
> Never put a signature criterion, or a hint of one, in `panel.md` or `judges-brief.md`.
> Reply with the judge ids and seats, one line each.

## Team rounds (all sonnet; all include TIMEBOX + PERSONA + ISOLATION + ROUND ENTRY)

**Round 1 - Propose** (each member, TIMEBOX 1.5)
> Read the brief and judges' brief. Alone, without reading teammates' work, write
> `<TEAM>/proposals/<member-id>.md`, max 250 words: first the three most obvious ideas for this
> brief, then yours - a one-sentence concept, what it looks/feels/sounds like, how it scores on
> each rubric criterion, and the riskiest part. Don't pick an obvious idea unless you can say what
> makes your version impossible to mistake for it.

**Round 2a - Clash** (each member, TIMEBOX 1.5)
> Read every file in `<TEAM>/proposals/`. Take a position: which idea wins, what's weak in each
> proposal (name names, be specific), what you'd steal. Defend your own or concede with a reason.
> <Skeptic only: Name the fatal flaw in every proposal, including the one the room likes most.>
> <Visionary only: Refuse anything that would make the work generic.>
> <Producer only: Say which ideas can't be built well in <BUILD-MIN> minutes, and why.>
> <Host note, when the proposals converged: name what they share and call it table stakes.>

**Round 2b - Second clash** (each member, standard, TIMEBOX 1.5)
> Read `<TEAM>/rounds/`. Respond to what was said about your position. Move or harden - with
> reasons. Propose the strongest hybrid you'd actually fight for.

**Round 3 - Decide** (Producer, TIMEBOX 1)
> Read `<TEAM>/proposals/` and `<TEAM>/rounds/`. Make the call. Write `<TEAM>/plan.md`: the
> direction in one sentence, why it beats the alternatives on the rubric, what was rejected and
> who dissented, the exact files to build and who owns each.
> **The build budget is <BUILD-MIN> minutes for one Craftsperson.** Size the plan to it: the
> smallest version that shows the idea working, at most <FILE-CAP> files of real work, one quick
> check that it works - no test suites or extra fixtures unless they *are* the idea. List what
> you cut to fit, so the pitch can be honest about it.
> <Host note on easy consensus, if any.>

**Round 4 - Build** (Craftsperson; Visionary in parallel if plan.md splits ownership; TIMEBOX <BUILD-MIN>)
> Read `<TEAM>/plan.md`. Build your part into `<TEAM>/build/`. <MEDIUM GUIDE>.
> Finished, openable files - not descriptions of files. Include `build/README.md`: what's
> here, how to open/run it, one line per file. Run the plan's one check, with LOOK for anything
> visual, fix what it shows once, and stop. If you truly need a server, use port <PORT> (unique to
> your team), never kill a process you didn't start, and stop yours when done.

(Host: give each team its own <PORT>, e.g. 8701, 8702, ... Teams build in parallel, and a
shared port lets one team's checker load another team's build.)

**Round 5a - Review** (Skeptic, TIMEBOX 1.5)
> Open and inspect `<TEAM>/build/`, with LOOK for anything visual. Read the judges' brief and
> rubric. Write `<TEAM>/review.md`: the issues that would cost points, **ranked**, each with a
> concrete fix of a few minutes or less. Put the top 3 first. Guess which hidden criteria these
> judges might hold and whether the build survives them.

**Round 5b - Cold use** (Visionary, in parallel with 5a; only when the deliverable is a tool, skill or anything meant to be used; TIMEBOX 1.5)
> Pretend you've never seen this team's plan or rounds. Read only `<TEAM>/build/` and use it as a
> first-time user would, on <the brief's test input>. Append to `<TEAM>/review.md` under
> `## Cold use`: what you ran, what happened, and every point where you had to guess - each guess
> is a bug. Don't fix anything.

**Round 6 - Fix** (Craftsperson, TIMEBOX 1.5)
> Read `<TEAM>/review.md`. Fix the top 3 issues in `build/` (any cold-use blocker counts first).
> Add a `Known issues` list to `build/README.md` for what you didn't fix. Re-run the plan's check once.

**Round 7 - Pitch** (Visionary, TIMEBOX 1)
> Read `<TEAM>/plan.md`, `<TEAM>/review.md` and `<TEAM>/build/`. Write `<TEAM>/pitch.md`, max 300
> words: a hook line, the idea in 3 sentences, what the build does, why it wins on each rubric
> criterion, the honest risk (including what was cut and the known issues), and a closing line.
> Before saving, check every claim against `build/` and cut any it doesn't back up.

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
- **Tool or skill**: the tool itself plus a demo of it used on the brief's test input, as
  separate folders in `build/`.
- **Anything else**: the most finished, openable artifact the medium allows, plus a README.

## Judges

**Judge: Q&A question** (model per seat, standard, TIMEBOX 1)
> You are <judge>, as described in `<WS>/judges/panel.md`. Read `<WS>/judges/judges-brief.md`,
> your sealed file, `<WS>/renders/`, and for each team `<WS>/teams/*/build/` and `pitch.md`. Write
> `<WS>/qa/<judge-id>.json` as `{"judge": "<judge name>", "questions": {"<team-id>": "<question>", ...}}`
> - one sharp question per team, asking what would most change your score. Don't reveal your
> signature. Don't write into any team folder.

(Host: once every judge has written, build each `<TEAM>/qa.md` with one `**<judge name>:** <question>`
line per judge, in panel order.)

**Team: answer Q&A** (sonnet, Producer persona + ISOLATION, TIMEBOX 1)
> Answer every question in `<TEAM>/qa.md` directly beneath it, as `**<Team> (<Name>):** ...`,
> max 80 words each. Be honest; judges reward candour over spin.

**Judge: score** (model per seat, TIMEBOX 2)
> You are <judge>, as described in `<WS>/judges/panel.md` - stay in that character. Read your
> sealed file `<WS>/judges/sealed/<judge-id>.md`, `<WS>/judges/rubric.json`,
> `<WS>/judges/judges-brief.md`, the Host's renders in `<WS>/renders/` (every judge sees these same
> images), and for every team: `build/`, `pitch.md`, `qa.md` if present. Do NOT read `<WS>/scores/`.
> Score independently. Use the full 1-10 range; don't cluster at 7.
> Write `<WS>/scores/<judge-id>.json` exactly in this schema: <paste schema from rubric.md>.
> Team ids: <list>. Criterion ids: <list>.

## Rematch (section 5 of SKILL.md)

**ISOLATION-REMATCH** (replaces ISOLATION for team prompts in the rematch):
> You may read: `<WS>/brief.md`, `<WS>/results.md`, everything in `<WS>/judges/` EXCEPT
> `<WS>/judges/sealed-v2/`, everything in `<WS>/crit/`, anything under `<TEAM>/`, and - read-only,
> for stealing - other teams' `build/` folders and `pitch.md` files. Never open `sealed-v2/`,
> `scores/`, `scores-v2/`, or other teams' rounds, plans or proposals. Never write outside
> `<TEAM>/`. To check rendering, use LOOK.

**Judge: crit** (model per seat, TIMEBOX 1.5)
> You are <judge>, as described in `<WS>/judges/panel.md`. Re-read your sealed v1 criterion, the
> rubric, and your own `<WS>/scores/<judge-id>.json`. Look at `<WS>/renders/` and every team's
> `build/` and `pitch.md`.
> 1. Write `<WS>/crit/<judge-id>.json`:
> `{"judge":"<id>","teams":{"<team-id>":{"fix":"the one change that would most raise my score, concrete enough to build in 3 minutes","criterion":"<criterion id or 'signature'>","expected_gain":<points out of 10 on that criterion>,"confidence":"high|medium|low","keep":"the one thing they must not lose"}}}`
> Give the fix, not the verdict.
> 2. Seal a fresh signature criterion in `<WS>/judges/sealed-v2/<judge-id>.md` - your v1 one is
> now public. Same rules as before, and it must differ from your v1 criterion.

**Round R1 - Triage** (Producer + ISOLATION-REMATCH, TIMEBOX 1)
> Read `<WS>/results.md`, every file in `<WS>/crit/`, `<WS>/judges/sealed/` (the v1 secret
> criteria, now revealed), your team's plan and review. Write `<TEAM>/triage.md`:
> - A table with one row per judge note: judge, the fix, **accept / reject / partial**, and why
>   in one line. Reject with a real reason - your temperament and concept are worth defending.
>   Accepting everything means you've become every judge's average.
> - **Steal**: at most one idea from one rival team's build, credited, and why it fits *your* concept. Or "none".
> - **Plan**: the exact changes for `build-v2/`, in order, sized to a 3-minute build.
> - **Retro**: three lines on what your v1 process got wrong.

**Round R2 - Challenge** (Skeptic + ISOLATION-REMATCH, TIMEBOX 1)
> Read `<TEAM>/triage.md`, `<WS>/crit/` and the v1 build. Attack the triage both ways: notes
> accepted just to please a judge, and notes rejected out of pride. Check the steal fits. Write
> `<TEAM>/rounds/R2-<member-id>.md`. The Producer's call stands unless you show it breaks the brief.

**Round R3 - Build v2** (Craftsperson + ISOLATION-REMATCH, TIMEBOX 3)
> Copy `<TEAM>/build/` to `<TEAM>/build-v2/` and work only there - never edit `build/`. Apply
> the triage plan, weighing the Skeptic's challenge. Write `build-v2/CHANGES.md`: every triage
> item marked done / partly / dropped, with one line each. Keep all brief requirements.

**Round R4 - Re-pitch** (Visionary + ISOLATION-REMATCH, TIMEBOX 1)
> Write `<TEAM>/pitch-v2.md`, max 300 words: the hook, what changed and why, what you refused
> and why, and the honest remaining risk. Check every claim against `build-v2/`.

**Judge: re-score** (model per seat, TIMEBOX 2) - **paired: v1 and v2 in one pass**
> You are <judge>, as described in `<WS>/judges/panel.md`. Read your fresh
> `<WS>/judges/sealed-v2/<judge-id>.md`, the rubric, your own `<WS>/crit/<judge-id>.json`, the
> Host's v1 and v2 renders in `<WS>/renders/`, and for every team: `build/` (v1), `build-v2/`,
> `build-v2/CHANGES.md`, `triage.md` and `pitch-v2.md`.
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
