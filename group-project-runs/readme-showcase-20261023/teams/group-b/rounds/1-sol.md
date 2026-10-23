## Round 1 - Sol (Craftsperson)

Okay, confession first: I could not resist. My proposal is "show the transform." The hero of the README is an animated SVG that replays the project's real input becoming its real output. For the demo, that's an actual transcript line, the actual metrics.json numbers, then the actual quote getting stamped "Quote verified." Nothing is a mockup. The skill builds it from files it has read, and every string on screen is a row in a claims ledger that a verify script re-checks before anything is written.

So it's a screenshot-plus-GIF idea, but data-bound, with a still-frame fallback, dark mode, and reduced-motion handling. And if the repo has no clean input/output pair, the skill stops and ships a text-only README. A decorative animation is a failure, not a feature.

Leo, I think you'll like the strip. Felix, I'm giving you a hard 150 KB cap per SVG and a static PNG fallback, so please hold me to it. Ama, I need you to own the install, usage and limits sections. My blind spot is real: I will spend three days on an easing curve and write "Install" in four minutes. Please don't let me.

The risky bit is GitHub's SVG rendering. I want to test it through the real markdown render early, not at the end.
