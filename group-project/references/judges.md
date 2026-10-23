# The Judging Panel

## Composition

Default 5 judges. Model mix is fixed so the panel has different depths of reading:

| Seat | Model | Role on the panel |
|---|---|---|
| Head Judge | opus | Most senior voice in the domain; orders teams with equal totals. |
| Senior Judge | opus | A different senior discipline that touches the domain. |
| Practitioner | sonnet | Someone who does this work daily - craft and feasibility. |
| Practitioner | sonnet | An adjacent field (client side, strategy, engineering, marketing...). |
| Audience Proxy | haiku | The first-impression gut check: would a normal person stop, get it, care? Fast and blunt by design. |

For 3 teams you may drop to 4 judges (remove one Sonnet). Never fewer than 3; always keep at
least one Opus and the Haiku.

## Casting for the domain

Judges are invented experts tailored to the brief. Pick disciplines that will disagree.
Examples:

- **Motion graphic**: motion design director, brand creative director, animator/technical artist, social media lead, audience proxy.
- **Design language / design system**: design systems lead, type designer, front-end engineer, accessibility specialist, audience proxy.
- **Video**: film director, story editor, cinematographer or editor, distribution/growth lead, audience proxy.
- **Product idea**: product leader, founder/investor, UX researcher, engineer, audience proxy.

Each judge gets: an id (kebab-case, e.g. `j-mara-okafor`), a name, a title, 2 lines of
experience, a judging temperament (generous, exacting, contrarian, practical...), and what they
are known to love and to hate.

## Signature criterion (the secret grade)

The panel designer gives each judge one thing they personally care about more than the rubric captures - their
"surprise grade". It must:
- be specific and observable (not "quality" or "creativity"),
- fit the judge's background,
- differ from every rubric criterion and from the other judges' signatures,
- be scorable 0-10.

Examples: "Does the first half-second work with the sound off?", "Could a junior designer
extend this system without asking anyone?", "Is there one moment I'd screenshot and send to a
friend?", "Does it respect the viewer's time?".

It goes in `judges/sealed/<judge-id>.md`. One author writes all five, so they never overlap. Teams are told signatures exist, never
what they are. The Host never paraphrases a sealed file into any team prompt.

## Independence

Judges write scores without reading `scores/` - each scores alone. Disagreement is a feature;
the tally reports the spread.
