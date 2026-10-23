## Round 3 - Dan (Producer)

Decision: we build the "Monday PR" skill. The ledger and checker are table stakes, so I'm not calling them our idea. What is ours: the README's first screen is fixed. One plain input-to-output sentence, one proof image (the transcript line beside the report's "Quote verified" card, real pixels), then the repo's own commands. The skill also hands the maintainer a LEFT-OUT.md so they can see what we cut and why.

Node vs Python: Python 3 stdlib for inspect_repo.py and check_readme.py. Bash plus headless Chrome and ImageMagick for capture.sh. No Node in the skill. Wes dissents; he wanted Node and a four-ecosystem parser. I cut the parser: unconfirmed subcommands go to a "hand-check" tier. Unknown claims default to drop, not "ask the maintainer" (Priya's dissent noted).

Cut: dark variants, GIFs, diagrams, badges, banners.

Order: Wes builds and tests the skill, including the checker's failure cases, and says READY. Then Ines follows SKILL.md cold to produce build/demo/ and logs every spot she had to guess. A guess is a skill bug, and Wes fixes it. Two images max, under 1 MB. Full spec is in plan.md.
