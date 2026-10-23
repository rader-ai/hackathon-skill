# Feedback: Maya, solo founder (two-person B2B SaaS)

## 1. Who I am and what I'd use this for

I code with Claude Code daily, I'm not a designer, and I pay for my own API usage. I want three or four different takes before I commit, not one polished guess. Briefs I'd actually run:

1. **Landing page hero + positioning** for our invoice-reconciliation tool. Three real, openable pages with different angles ("for controllers", "for founders who hate month-end", "audit trail").
2. **Pricing page** with a different packaging logic per group (usage-based, seat tiers, one flat price), each with a live toggle.
3. **First-run onboarding flow** (empty state to first reconciled invoice), as clickable HTML, so I can see where I'd lose a trial user.

## 2. First impression

Within 30 seconds: "ranked ideas from competing agent teams, finished not described." The bakery table and screenshots (README top) sold me. "9 min 50 s" is a strong hook for a time-poor person.

Unclear: what this costs in dollars. "About 45 subagent calls" (README, Time and cost) tells me nothing about spend. The hero examples are a loader, a 404 page and a README, all small and visual. I can't tell if it works for my B2B brief, where the answer is words and structure, not pixels. The "Not yet tested" list at the bottom is honest, but it's the part I needed first.

## 3. Friction

- **Cost is invisible.** There is no dollar estimate in README.md or SKILL.md ("Cost note" only counts calls). Five judges, three of them Opus-class, plus 12 Sonnet agents, could be a few dollars or a lot of dollars. I won't press go without a number and a hard cap.
- **Install is a symlink plus an optional Playwright/ffmpeg install** (README, Install). I'd do it, but I don't know whether I need it for a web page. SKILL.md says judges look at screenshots, so I guess yes.
- **Trust in the judging.** The bakery run separates first from last by 2.2 points (84.8 / 83.2 / 82.6, results.md), and judge totals for the winner range 65.5 to 81.5. That is noise. The judges are invented personas, and the "secret criteria" read like theatre. Meanwhile the winner's own pitch admits the loaf "is still a flat ellipse" and was never checked at 375px (teams/group-b/pitch.md). Judge Ines said it reads as a frown. I would have picked group C on usefulness (the week table), and the ranking doesn't tell me why I should believe B.
- **The ranking isn't my ranking.** Judges score generic craft. I care about "would my buyer convert", and nobody on the panel can know that.
- **Output usefulness is unclear.** The winner's render (renders/group-b-375.png) shows "Open now, until 2pm" as fact from the visitor's clock. It's cute, but I couldn't ship it as is. I'd need the winner plus grafts from the others, and the reveal's "one recommendation" is the only help with that.
- **Lots of ceremony.** Charters, proposals, 2a clash, rounds, sealed criteria, plan.md, review.md per team. I want to open the three builds. The folder structure (teams/group-b/{rounds,proposals,...}) is a lot to wade through, and I'd never read it.
- **Time.** 10 minutes of waiting is fine. 25 minutes standard, unattended, with no cost cap, is not.

## 4. What would make me adopt it

1. **A cost preview and a hard cap**: "this run: ~$X, max $Y, stops at cap", shown before the first agent starts, plus the actual cost in the reveal.
2. **Judge against MY criteria and a real audience.** Let me paste my ICP and goal ("a controller at a 50-person company decides in 10 seconds"), have the judges role-play that buyer, and show a plain verdict ("B wins on X, C wins on Y") rather than a scoreboard with 2-point gaps.

## 5. Ideas backlog

- **Cost estimate + cap** · I can't tell what a run costs · print a dollar range per mode up front, accept `--max-cost`, report actuals · high · S/M
- **Buyer-persona judging** · generic judges don't know my customer · intake asks for ICP and goal, panel includes 2 simulated buyers who decide, not score · high · M
- **Skim mode / one-page digest** · I don't want to open nine folders · a single `summary.html` with all builds side by side, a "pick this if..." line each, and the grafts list · high · M
- **Confidence flag on rankings** · 2.2-point gaps look like a result · results.md states "statistically a tie" when the gap is within judge spread, and says which team to take if I care about X · high · S
- **B2B templates** · demos are visual toys · preset briefs for landing page, pricing page, onboarding, and cold-email angles, with a rubric tuned to each (copy clarity, objection handling) · med · M
- **Cheap "2 groups, 3 judges" mode** · I want to try before I trust it · a `tiny` mode of about 15 calls with a cost under a coffee · med · S
- **Build in my repo's stack** · static HTML is useless if my app is Next/Tailwind · optional constraint: build as components I can drop in, use my existing tokens · med · L
- **Graft step** · picking a winner then manually merging is the real work · after the reveal, one agent merges the winner with named features from the runners-up · med · M

## 6. Deal-breakers

- No visible cost, or a run that overshoots silently. I stop after one surprise bill.
- Rankings I can't explain to my cofounder in one sentence.
- Outputs that only look good in the screenshot (unverified claims, untested at phone width) and need rework before use.
- A run that blocks my terminal for 25+ minutes with no progress I can skim.
