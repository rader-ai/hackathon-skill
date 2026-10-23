# Cold-reader gate

Purpose: a reader who has not seen your ledger tells you what the first screen communicates. If their answer does not match the ledger, the README fails, however pleasant it reads to you.

## Run it

1. Cut the first screen: `node $SKILL/scripts/cold-reader-check.mjs pack <README> --out $OUT/first-screen.md`
2. Hand the file to a fresh subagent (a new context that has not seen the repo, the ledger or this skill). If your environment has no subagent tool, say so in the report and mark this gate "not independent"; do not pretend you read it cold.
3. Prompt for the subagent (copy exactly, filling in the path):

```
Read only the file <ABSOLUTE PATH to first-screen.md>. Do not open anything else and do not run anything.
Answer in JSON with exactly these string fields and nothing else:
{"does": "what this project does, in one sentence, naming what goes in and what comes out",
 "audience": "who would use it, in one sentence",
 "command": "the exact command you would run first, or the word none if the page shows no command"}
If the page does not tell you something, say "unclear" in that field rather than guessing.
```

4. Save the reply as `$OUT/cold-reader-answer.json`, then:
   `node $SKILL/scripts/cold-reader-check.mjs check $OUT/cold-reader-answer.json $OUT/claims.json`

## Reading the result

- `does-names-input` / `does-names-output` fail: the opener is too vague or the nouns are buried. Rewrite the first sentence; re-run the first-screen gate; ask a NEW subagent (reusing one contaminates the test).
- `command` fails: the first command is not obvious or not the pinned one. Move it up or simplify the fence.
- `audience` fails: the page never says who it is for. Decision rule: if you can pin a repo quote that names the audience, add one sentence built from that quote. If not, do not write one: set `first_screen.audience_waived` to a reason (15+ characters), add it to `could_not_verify`, and re-run `check`; the waiver is printed and goes in the final report. A derived audience ("people who ...") that no quote supports is an invention.
- Two failed rounds: stop iterating and report. The opener probably needs a different source sentence from the repo's docs, not more polish.
