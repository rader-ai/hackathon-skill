# readme-showcase

**Hook: A README you can fact-check line by line, with a hero that is real output, not decoration.**

## The idea
readme-showcase is a skill that turns a repo it has never seen into a front-page README. It finds the one real input-to-output moment, shows it above the exact copy-paste commands, and refuses any sentence, number or on-screen string that is not a row in a claims ledger. A script then checks every ledger quote is literally in its cited file.

## What it does on a new repo
It inventories the repo read-only (manifests, commands, outputs; text aimed at an AI is treated as data). It picks a hero from a four-rung ladder, real artifact down to plain typography. "Nothing earned" is allowed; decoration is not. It writes the ledger first, then the README from ledger rows only, then runs `verify.mjs`.

## What it made for Call Review Lab
A README with a what-and-who sentence under the title and a three-beat Reel: a real transcript line, its `"ok": true` check, the "Quote verified" result. Beneath: run commands (macOS and Linux), a screenshot of the real report card, Who it fits, Limits. Assets: about 328 KB. `verify.mjs` reports 101 checks passed, 0 failed.

## Why it wins
- **Skill:** bundled scripts (inventory, capture, reel, verify, render-readme), declared dependencies, loud failures. `selftest.sh` runs 36 checks on a second, UI-less fixture and prints INCOMPLETE, not a quiet pass, if the browser is missing.
- **Truth:** `verify.mjs` fails on a README number not in the ledger, a hype word, an unbacked badge, or a hand-edited Reel.
- **Story:** what, who and the command sit on the first screen.
- **Visuals:** real data on screen, light/dark SVGs of 4.5 KB each, reduced-motion frame, PNG fallback.

## Honest risk
`verify.mjs` proves a quote exists, not that it supports the sentence. The skill's adversary read covers that gap; ours was a self-read that found nothing, and no fresh-subagent read was done. Screenshots and the Reel PNG need Playwright and Chromium (about 150 MB). The Reel only works when the repo has a true input-output pair; otherwise the skill falls to a code block or typography. Only two repos have been exercised.

## Adopt it
Run `selftest.sh`, point the skill at your repo, read the ledger. No receipt, no sentence.

## Closing
Most READMEs ask for trust. This one hands you receipts.
