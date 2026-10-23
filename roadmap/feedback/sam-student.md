# Sam Rivera: user-research feedback on Group Project

## 1. Who I am and what I'd use this for

CS student, weekend game-jam hobbyist, on Claude Pro with a tight budget. I want to experiment, not run a company.

Three briefs I'd actually give it:
1. "A 48-hour game-jam concept on the theme *signal*, one HTML canvas game, playable in a browser." I want three genuinely different directions and a judge's honest read on fun and originality.
2. "A small interactive web toy for my data structures class, a sorting visualizer." I want variations on the UI and a verdict on which one a classmate would actually click.
3. "Which of my four side-project ideas is worth a weekend?" I want the teams to argue it out and the judges to rank the pitches.

## 2. First impression

**Excited:** The coffee-loader example is the best demo I've seen for this kind of tool. The Warm Hands judge notes ("a turning spiral can still read as a generic spinner") are the kind of feedback I wish I got from classmates. The Haiku judge playing "a half-awake customer" is a clever idea. The round-1 to rematch numbers, with paired re-scoring, make the judging feel fair. The clash logs are funny: "Agnes, you can put the knife down" is the kind of banter I'd read for fun.

**Confused:**
- The README says the default is **4 groups**, but SKILL.md says **3 teams in lite**. The README also says "groups" while the skill says "teams". I had to work out that they're the same thing.
- "Signature criterion" is secret until the reveal. That's neat, but I couldn't tell whether a judge's secret criterion is the thing that decides my winner.
- Where do I watch the debate? The run is a pile of files (`rounds/`, `log.md`, `plan.md`). There's no live view, so "watch them argue" means opening folders after the fact.

## 3. Friction

- **Cost (the big one).** A `lite` run is about 45 subagent calls, `standard` about 80, and a rematch adds about 22 more. It uses Opus for the panel designer and two judges. The docs give call counts but no token or usage estimate. On Pro, I can't tell whether one run is 5% of my allowance or 60%, and that's the question I'd ask before anything else. (I haven't measured this; it's a gap in the docs.)
- **Limits mid-run.** If I hit my limit during the rematch, the docs don't say what state I'm left in or whether I can resume.
- **Setup.** Claude Code, a `git clone`, a symlink into `~/.claude/skills`, and for animated briefs also ffmpeg and Playwright. That's fine for me, but it's a barrier for a friend who wants to try it.
- **Time.** About 10 to 15 minutes per run is fine for a weekend, as long as I know that up front.

## 4. What would make me use it every weekend

A preview that says "this run will be about N calls and ~X% of your plan, go?" and a cheaper mode that uses Sonnet judges and fewer teams. Also a live view of the rounds as they land. Those three things would take it from "impressive demo I'd try once" to "tool I'd open every Saturday".

## 5. Ideas backlog

1. **Spend preview and cap** · I can't tell what a run costs on Pro · Before Setup, show calls by model and a rough usage share, and let me set a call ceiling that stops the run cleanly · **High**
2. **Live debate view** · Watching the teams argue means opening folders after the fact · A page that tails `rounds/` and shows each message as it lands, with the Skeptic's objections highlighted · **High**
3. **Fast jam mode** · A full run is too long for a quick jam sprint · Two teams, three judges, no rematch, no renders, about 5 minutes · **High**
4. **Pick your cast** · Team temperaments and people are buried in `references/` · A menu of temperaments and a one-line "add a Wildcard" toggle, with charters editable without touching the skill · **Med**
5. **Jam brief templates** · I have to write every brief from scratch · Templates for game jams (theme, time limit, "single HTML file under 13 KB") and class projects, so the constraints are already in the brief · **Med**
6. **Replay page** · The scoreboard shows results but not the argument · A shareable page that plays the clash as a short transcript next to each team's build, with the best quote per round · **Low**

## 6. Deal-breakers

- **No idea what a run costs on my plan.** If I can't see the spend before I start, I won't start, and I'd stop trusting the tool after one surprise.
- **A run I can't stop cleanly.** If I cancel halfway, I need to know what's left on disk and that nothing else keeps running.
- **Judges I can't trust.** If the secret criteria and the scores are opaque and I can't see why a team lost, I'll treat it as a black box.
