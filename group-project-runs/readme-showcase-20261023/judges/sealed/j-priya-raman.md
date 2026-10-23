# Sealed criterion - Priya Raman (j-priya-raman)

## Name
First-Screen Conversion: what, proof, and a path to a working result before the first scroll

## Description
I open the generated demo README (build/demo/README.md, rendered as GitHub renders it) at a 1280x800 desktop viewport and look only at what is visible before scrolling. Then I follow the quickstart exactly as written. I check four observable things:

1. **What + who (one sentence):** A first-screen sentence that says what the tool does and for whom, in plain words, with no hype adjectives. A stranger could repeat it back.
2. **Proof on screen:** A real visual of the tool's actual output (e.g. a capture of the generated report) visible above the fold, not a logo, stock banner or diagram of something hypothetical.
3. **Path visible:** The route to a first result (a Quickstart heading, link or command block) is on the first screen or one obvious click away.
4. **Path works:** The quickstart commands are copy-pasteable, match the repo's real entry points and requirements (checked against run.py, docs and the repo's own README), and lead to the shown output in the fewest honest steps. Nothing invented (no fake install command, package name, flag or badge).

The skill itself is judged by whether its SKILL.md explicitly drives toward this outcome (first-screen ordering, real-output visual, verified quickstart), so the result is repeatable on an unseen repo, not a lucky one-off.

## How I'll score (0-10)
- **0-2:** First screen is a title, badges and/or a wall of text; I cannot tell what it does or how to try it without scrolling. Or the quickstart contains an invented/broken command.
- **3-4:** One of the four checks passes clearly; the others are missing or buried. Quickstart exists but needs guesswork or reading source.
- **5-6:** Two or three checks pass. Value statement is clear but proof is below the fold, or proof is there but the path to a result is vague or has unexplained steps.
- **7-8:** All four pass with minor friction: slightly long intro, a visual that's real but hard to read at README width, or one extra step that could be cut.
- **9-10:** All four pass cleanly. One-sentence value, real output visible, a short accurate quickstart a newcomer could run in under two minutes, zero hype; and the SKILL.md makes this outcome deliberate and repeatable.
Deductions: -2 for any invented command, flag, metric or badge in the first screen; -1 if the hero visual exceeds a sensible weight (slow first paint) or is unreadable at GitHub's content width.

## Why I care
In 14 years of README clinics, the single biggest leak is the first screen: most visitors decide in seconds, and they leave when they can't see what a project does, can't see it working, or hit a quickstart that doesn't run. A marketing-quality README is not one that sounds impressive; it's one that converts a visitor into someone who has seen the tool produce a result. If a README skill can't reliably get that first screen right, nothing further down the page matters.
