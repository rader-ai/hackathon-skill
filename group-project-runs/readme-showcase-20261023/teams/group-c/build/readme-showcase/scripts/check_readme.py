#!/usr/bin/env python3
"""check_readme.py - mechanical honesty check for a generated README.

Usage:
  python3 check_readme.py README.md --repo REPO [--ledger claims.md] [--assets DIR]
         [--max-images 2] [--max-bytes 1572864] [--banned FILE] [--allow-badges] [--json]

Needs:  Python 3.8+ standard library only. Reads files; never runs repo code.
Exit:   0 = no FAIL (WARN-UNVERIFIED items may remain: hand-check them)
        1 = at least one FAIL        2 = bad usage / unreadable inputs

FAIL  (blocks):  relative link/image target missing; image without alt text;
                 more images or bytes than the budget; banned hype phrase in prose;
                 command whose script/path operand is not in the repo; backticked
                 path not in the repo; badge URL; ledger row with a missing source
                 file, a line number out of range, a bad kind, or kind=inferred;
                 an image in the assets dir with no "job" line in the ledger.
WARN-UNVERIFIED (hand-check): subcommands/flags not found in repo text, version
                 numbers and other numbers not found in repo or ledger, external
                 links (not fetched), unknown commands, weak first screen.
Behaviour claims ("it verifies every quote") are NOT checked here. The checker only
WARNs when a prose line uses a behaviour/guarantee word (verifies, every, never, only if...)
and no ledger claim holds that word. Invented prose with other words passes: read it yourself.
Ledger sources also WARN (ledger-overlap) when the cited lines share no 4+ letter word with the claim.
"""
import argparse
import json
import os
import re
import shlex
import sys
import urllib.parse

HERE = os.path.dirname(os.path.abspath(__file__))
SKIP_DIRS = {".git", "node_modules", "__pycache__", ".venv", "venv", ".tox", "target"}
IMG_EXT = (".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp")
PATH_EXT = (".py", ".sh", ".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".json", ".md",
            ".csv", ".html", ".htm", ".txt", ".toml", ".yaml", ".yml", ".cfg", ".ini",
            ".rb", ".go", ".rs", ".java", ".c", ".h", ".cpp", ".sql", ".css", ".env",
            ".lock", ".xml", ".png", ".jpg", ".svg", ".gif")
# bare names like `whisper.cpp` are usually tool names, so only unambiguous file types count
BARE_EXT = (".py", ".sh", ".js", ".mjs", ".json", ".md", ".csv", ".html", ".txt", ".toml",
            ".yaml", ".yml", ".cfg", ".ini", ".png", ".svg", ".gif", ".jpg")
SCRIPT_EXT = (".py", ".sh", ".js", ".mjs", ".cjs", ".ts", ".rb", ".pl", ".php")
INTERP = {"python", "python3", "node", "bash", "sh", "zsh", "ruby", "perl", "deno",
          "bun", "php", "py"}
SYSTEM = {"git", "cd", "ls", "cat", "echo", "mkdir", "cp", "mv", "rm", "pip", "pip3",
          "npm", "npx", "yarn", "pnpm", "brew", "apt", "apt-get", "curl", "wget", "open",
          "xdg-open", "chmod", "export", "source", "docker", "cargo", "go", "make",
          "pytest", "uv", "poetry", "conda", "which", "sudo", "touch", "tar", "unzip",
          "code", "gh", "pipx", "tree", "head", "tail", "grep", "jq", "rustup", "start",
          "set", "python -m"}
SHELL_LANGS = {"bash", "sh", "shell", "console", "zsh", "terminal", "shell-session", "cmd",
               "powershell", "bat"}
BADGE_RE = re.compile(r"shields\.io|badge\.fury\.io|badgen\.net|img\.shields|/badge\.svg|"
                      r"badges\.|codecov\.io/.*badge|coveralls\.io/repos|travis-ci\.\w+/.*\.svg|"
                      r"/badge/", re.I)
LINK_RE = re.compile(r"(!?)\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+\"[^\"]*\")?\s*\)")
HTML_TAG_RE = re.compile(r"<(img|a|source|video)\b([^>]*)>", re.I)
SPAN_RE = re.compile(r"`([^`\n]+)`")
BEHAVIOUR_RE = re.compile(r"(?<![\w-])(validates?|verif(?:ies|y|ied)|encrypts?|guarantees?|every|never|always|"
                          r"automatically|detects?|secures?|only if|ensures?|prevents?)(?![\w-])")
VALID_KINDS = ("observed", "copied", "inferred")


class Report:
    def __init__(self):
        self.fails, self.warns = [], []

    def fail(self, rule, line, msg):
        self.fails.append({"rule": rule, "line": line, "message": msg})

    def warn(self, rule, line, msg):
        self.warns.append({"rule": rule, "line": line, "message": msg})


def die(msg):
    sys.stderr.write("check_readme.py: ERROR: %s\n" % msg)
    sys.exit(2)


def read(path):
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as fh:
            return fh.read()
    except OSError as exc:
        die("cannot read %s: %s" % (path, exc))


def repo_files(repo):
    out = []
    for dp, dn, fn in os.walk(repo):
        dn[:] = [d for d in dn if d not in SKIP_DIRS]
        for f in fn:
            out.append(os.path.relpath(os.path.join(dp, f), repo))
    return out


def build_corpus(repo, files, exclude):
    parts = []
    for rel in files:
        if os.path.abspath(os.path.join(repo, rel)) == exclude:
            continue
        full = os.path.join(repo, rel)
        try:
            if os.path.getsize(full) > 1500000:
                continue
            with open(full, "rb") as fh:
                data = fh.read()
            if b"\0" in data[:2000]:
                continue
            parts.append(data.decode("utf-8", "replace"))
        except OSError:
            continue
    return "\n".join(parts)


def split_doc(text):
    """Return (prose_lines, fences) where prose_lines is [(lineno, text)] outside fences
    and fences is [(start_lineno, lang, [(lineno, text)])]."""
    prose, fences, cur = [], [], None
    in_comment = False
    for i, raw in enumerate(text.splitlines(), 1):
        m = re.match(r"^\s*(`{3,}|~{3,})\s*([\w+-]*)", raw)
        if cur is not None:
            if m and raw.strip().startswith(cur["mark"]) and not m.group(2):
                fences.append((cur["start"], cur["lang"], cur["lines"]))
                cur = None
            else:
                cur["lines"].append((i, raw))
            continue
        if m:
            cur = {"mark": m.group(1)[:3], "lang": m.group(2).lower(), "start": i, "lines": []}
            continue
        line = raw
        if in_comment:
            if "-->" in line:
                line = line.split("-->", 1)[1]
                in_comment = False
            else:
                continue
        line = re.sub(r"<!--.*?-->", "", line)
        if "<!--" in line:
            line = line.split("<!--", 1)[0]
            in_comment = True
        prose.append((i, line))
    if cur is not None:
        fences.append((cur["start"], cur["lang"], cur["lines"]))
    return prose, fences


def is_placeholder(tok):
    return bool(re.search(r"[<>{}$*]|YOUR|your[-_]|path/to|\.\.\.|xxx", tok, re.I)) or tok.startswith(("~", "/"))


class Ctx:
    def __init__(self, repo, readme_dir, files, corpus, ledger_sources):
        self.repo, self.readme_dir = repo, readme_dir
        self.files, self.corpus = files, corpus
        self.fileset = set(files)
        self.basenames = {os.path.basename(f) for f in files}
        self.ledger_sources = ledger_sources  # text of files cited by ledger rows

    def exists(self, tok):
        t = re.sub(r":\d+(-\d+)?$", "", tok.strip().lstrip("./") if tok.startswith("./") else tok.strip())
        t = t.rstrip("/")
        if not t:
            return True
        for base in (self.repo, self.readme_dir):
            if os.path.exists(os.path.join(base, t)):
                return True
        if "/" not in t and t in self.basenames:
            return True
        return False

    def documented_output(self, tok):
        t = tok.strip().lstrip("./").rstrip("/")
        base = os.path.basename(t)
        return any(t in txt or (base and base in txt) for txt in self.ledger_sources)


def check_path(ctx, rep, line, tok, hard, where):
    """hard=True: missing -> FAIL (unless a ledger-cited file documents it as output)."""
    if is_placeholder(tok) or ctx.exists(tok):
        return
    if ctx.documented_output(tok):
        rep.warn("unverified-generated-path", line,
                 "%s `%s` is not in the repo but a ledger-cited file mentions it "
                 "(generated output?). Hand-check." % (where, tok))
    elif hard:
        rep.fail("missing-path", line, "%s `%s` does not exist in the repo" % (where, tok))
    else:
        rep.warn("unverified-path-arg", line, "%s argument `%s` not found in repo" % (where, tok))


def corpus_has(ctx, word):
    return re.search(r"(?<![\w-])" + re.escape(word) + r"(?![\w-])", ctx.corpus) is not None


def check_command(ctx, rep, line, cmdline):
    cmdline = cmdline.strip()
    cmdline = re.sub(r"^(\$|>|PS>|#)\s+", "", cmdline) if not cmdline.startswith("#!") else cmdline
    if not cmdline or cmdline.startswith("#"):
        return
    for seg in re.split(r"\s*(?:&&|\|\||\||;)\s*", cmdline):
        seg = seg.strip()
        if not seg:
            continue
        try:
            toks = shlex.split(seg, posix=True)
        except ValueError:
            rep.warn("unparsed-command", line, "could not parse `%s`; hand-check" % seg)
            continue
        while toks and (re.match(r"^[A-Za-z_][A-Za-z0-9_]*=", toks[0]) or toks[0] == "sudo"):
            toks.pop(0)
        if not toks:
            continue
        cmd, rest = toks[0], toks[1:]
        base_cmd = os.path.basename(cmd)
        shown = " ".join(toks)[:80]
        script_text = None
        sub_args = None
        if cmd in ("cd", "git", "echo", "export", "source", "mkdir", "ls", "cat") \
                or (base_cmd in SYSTEM and base_cmd not in INTERP and base_cmd not in
                    ("pip", "pip3", "npm", "make", "yarn", "pnpm")):
            continue
        if base_cmd in ("pip", "pip3") or (base_cmd in INTERP and "-m" in rest[:2]
                                           and len(rest) > 2 and rest[1] == "pip"):
            for k, t in enumerate(rest):
                if t in ("-r", "--requirement") and k + 1 < len(rest):
                    check_path(ctx, rep, line, rest[k + 1], True, "pip requirements file")
            continue
        if base_cmd in ("npm", "yarn", "pnpm"):
            if rest[:1] == ["run"] and len(rest) > 1:
                pj = os.path.join(ctx.repo, "package.json")
                if not os.path.exists(pj):
                    rep.fail("missing-path", line, "`%s` but the repo has no package.json" % shown)
                elif '"%s"' % rest[1] not in read(pj):
                    rep.fail("missing-script", line,
                             "`%s`: no \"%s\" script in package.json" % (shown, rest[1]))
            continue
        if base_cmd == "make":
            if not os.path.exists(os.path.join(ctx.repo, "Makefile")):
                rep.fail("missing-path", line, "`%s` but the repo has no Makefile" % shown)
            elif rest and not rest[0].startswith("-") and not re.search(
                    r"^%s\s*:" % re.escape(rest[0]), read(os.path.join(ctx.repo, "Makefile")), re.M):
                rep.fail("missing-script", line, "`%s`: no such Makefile target" % shown)
            continue
        if base_cmd in INTERP:
            if rest[:1] in (["-m"], ["-c"], ["-"]):
                continue
            operands = [t for t in rest if not t.startswith("-")]
            if not operands:
                continue
            op = operands[0]
            if op.endswith(SCRIPT_EXT) or "/" in op:
                check_path(ctx, rep, line, op, True, "command script")
                if is_placeholder(op) or not ctx.exists(op):
                    continue
                full = os.path.join(ctx.repo, op.lstrip("./"))
                script_text = read(full) if os.path.isfile(full) else ctx.corpus
                sub_args = rest[rest.index(op) + 1:]
            else:
                rep.warn("unverified-command", line, "`%s`: operand `%s` is not a script path" % (shown, op))
                continue
        elif cmd.startswith(("./", "../")) or "/" in cmd or cmd.endswith(SCRIPT_EXT):
            check_path(ctx, rep, line, cmd, True, "command")
            if is_placeholder(cmd) or not ctx.exists(cmd):
                continue
            script_text, sub_args = ctx.corpus, rest
        else:
            if corpus_has(ctx, cmd):
                script_text, sub_args = ctx.corpus, rest
            else:
                rep.warn("unverified-command", line,
                         "`%s`: `%s` is not found in repo text or manifests; hand-check "
                         "that it is a real installed tool" % (shown, cmd))
                continue
        # subcommands and flags against the script (or corpus)
        seen_sub = False
        for t in sub_args or []:
            if t.startswith("-"):
                flag = t.split("=", 1)[0]
                if flag not in script_text and flag not in ctx.corpus:
                    rep.warn("unverified-flag", line, "flag `%s` in `%s` not found in repo text" % (flag, shown))
            elif not seen_sub and re.match(r"^[A-Za-z][\w-]*$", t):
                seen_sub = True
                if not re.search(r"(?<![\w-])" + re.escape(t) + r"(?![\w-])", script_text):
                    rep.warn("unverified-subcommand", line,
                             "subcommand `%s` in `%s` not found in the script text" % (t, shown))
            elif "/" in t or t.endswith(PATH_EXT):
                check_path(ctx, rep, line, t, False, "command")


def looks_like_path(span):
    if re.search(r"\s", span) or "://" in span or span.startswith("-") or re.search(r"[<>*{}$=()|]", span):
        return False
    if re.match(r"^v?\d", span) or span.startswith(("~", "/", "@")) or span.endswith(("()", ".")):
        return False
    if re.match(r"^(e\.g|i\.e)", span):
        return False
    if re.match(r"^\w+\.(js|ts)$", span, re.I) and span.lower() in ("node.js", "vue.js", "next.js", "express.js", "react.js"):
        return False
    return "/" in span or span.lower().endswith(BARE_EXT)


def slugify(h):
    s = re.sub(r"[^\w\- ]", "", h.strip().lower())
    return s.replace(" ", "-")


def parse_ledger(path, repo, rep):
    """Returns (rows, cited_texts, text)."""
    text = read(path)
    rows, cited, cited_lines = [], [], []
    for i, raw in enumerate(text.splitlines(), 1):
        if not raw.strip().startswith("|"):
            continue
        cells = [c.strip() for c in raw.strip().strip("|").split("|")]
        if all(re.match(r"^:?-{2,}:?$", c) for c in cells if c):
            continue
        if len(cells) < 3:
            continue
        low = [c.lower() for c in cells]
        if (low[0] == "#" or low[-1] == "kind" or any(c.startswith("source") for c in low)
                or "image" in low[0] or low[0] in ("asset", "file")):
            continue  # any header row: SKILL.md and ledger.md spell it differently
        kind = cells[-1].strip("` ").lower()
        if kind not in VALID_KINDS:
            if any(os.path.splitext(w)[1].lower() in IMG_EXT for w in re.findall(r"[\w./-]+", raw)):
                continue  # image-job row, checked separately
            rep.fail("ledger-kind", i, "ledger row kind must be observed|copied|inferred, got `%s`" % cells[-1])
            continue
        if kind == "inferred":
            rep.fail("ledger-inferred", i, "inferred claim `%s`: drop it or find a source" % cells[1][:60])
        src = cells[-2]
        ok_any = False
        for part in re.split(r"\s*;\s*", src):
            part = part.strip("` ")
            m = re.match(r"^(.+?):(\d+)(?:-(\d+))?$", part)
            if not m:
                rep.fail("ledger-source", i, "source `%s` is not file:line" % part)
                continue
            f, a, b = m.group(1), int(m.group(2)), int(m.group(3) or m.group(2))
            full = os.path.join(repo, f)
            if not os.path.isfile(full):
                rep.fail("ledger-source", i, "source file `%s` not in repo" % f)
                continue
            body = read(full)
            n = body.count("\n") + (0 if body.endswith("\n") or not body else 1)
            if a < 1 or b < a or b > n:
                rep.fail("ledger-source", i, "`%s` line out of range (file has %d lines)" % (part, n))
                continue
            ok_any = True
            cited.append(body)
            lines_txt = "\n".join(body.splitlines()[a - 1:b]).lower()
            cited_lines.append(lines_txt)
        # overlap: the cited lines should share a 4+ letter word with the claim
        words = set(re.findall(r"[a-z]{4,}", cells[1].lower()))
        if ok_any and words and not any(w in t for t in cited_lines[-len(re.split(r"\s*;\s*", src)):] for w in words):
            rep.warn("ledger-overlap", i, "cited lines share no 4+ letter word with claim `%s`: "
                     "check the source really says this" % cells[1][:50])
        rows.append({"line": i, "claim": cells[1], "source": src, "kind": kind, "ok": ok_any})
    return rows, cited, text


def main():
    ap = argparse.ArgumentParser(description="Mechanical honesty check for a README.")
    ap.add_argument("readme")
    ap.add_argument("--repo", required=True, help="path of the repo the README describes")
    ap.add_argument("--ledger", help="claims.md ledger (strongly recommended)")
    ap.add_argument("--assets", help="assets directory to budget-check")
    ap.add_argument("--max-images", type=int, default=2)
    ap.add_argument("--max-bytes", type=int, default=1572864)
    ap.add_argument("--banned", default=os.path.join(HERE, "..", "references", "banned-words.txt"))
    ap.add_argument("--allow-badges", action="store_true",
                    help="permit badge URLs (list the reason in LEFT-OUT.md)")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()

    readme = os.path.abspath(a.readme)
    repo = os.path.abspath(a.repo)
    if not os.path.isfile(readme):
        die("README not found: %s" % readme)
    if not os.path.isdir(repo):
        die("repo directory not found: %s" % repo)
    if not os.path.isfile(a.banned):
        die("banned-words file not found: %s" % a.banned)
    if a.ledger and not os.path.isfile(a.ledger):
        die("ledger not found: %s" % a.ledger)
    if a.assets and not os.path.isdir(a.assets):
        die("assets directory not found: %s" % a.assets)

    rep = Report()
    text = read(readme)
    if not text.strip():
        die("README is empty: %s" % readme)
    files = repo_files(repo)
    if not files:
        die("repo has no files: %s" % repo)
    corpus = build_corpus(repo, files, readme)

    rows, cited, ledger_text = [], [], ""
    if a.ledger:
        rows, cited, ledger_text = parse_ledger(a.ledger, repo, rep)
        if not rows:
            rep.fail("ledger-empty", 0, "ledger has no claim rows")
        if len(rows) > 30:
            rep.warn("ledger-long", 0, "ledger has %d rows; keep it near 25" % len(rows))
    else:
        rep.warn("no-ledger", 0, "no --ledger given: claims are not traced to file:line")

    ctx = Ctx(repo, os.path.dirname(readme), files, corpus + "\n" + ledger_text, cited)
    prose, fences = split_doc(text)

    # banned phrases (prose only)
    phrases = [l.strip().lower() for l in read(a.banned).splitlines() if l.strip() and not l.startswith("#")]
    for ln, line in prose:
        plain = SPAN_RE.sub(" ", line).lower()
        for ph in phrases:
            if re.search(r"(?<![\w-])" + re.escape(ph) + r"(?![\w-])", plain):
                rep.fail("banned-phrase", ln, "hype phrase `%s`" % ph)

    # links, images, badges, alt text
    referenced_images = set()
    heads = {slugify(re.sub(r"^#+\s*", "", l)) for _, l in prose if re.match(r"^#{1,6}\s", l)}
    for ln, line in prose:
        targets = []
        for m in LINK_RE.finditer(line):
            is_img, alt, tgt = m.group(1) == "!", m.group(2), m.group(3)
            targets.append((tgt, is_img))
            if is_img and not alt.strip():
                rep.fail("image-alt", ln, "image `%s` has empty alt text" % tgt)
        for m in HTML_TAG_RE.finditer(line):
            tag, attrs = m.group(1).lower(), m.group(2)
            sm = re.search(r"(?:src|href)\s*=\s*[\"']([^\"']+)[\"']", attrs)
            if tag == "img":
                am = re.search(r"\balt\s*=\s*[\"']([^\"']*)[\"']", attrs)
                if not am or not am.group(1).strip():
                    rep.fail("image-alt", ln, "<img %s> lacks alt text" % (sm.group(1) if sm else ""))
            if sm:
                targets.append((sm.group(1), tag in ("img", "source")))
        for tgt, is_img in targets:
            if BADGE_RE.search(tgt) and not a.allow_badges:
                rep.fail("badge", ln, "badge URL `%s` (badges need a real CI/package; see story.md)" % tgt[:80])
                continue
            if re.match(r"^(https?:)?//", tgt):
                rep.warn("unverified-external-link", ln, "external link not fetched: %s" % tgt[:100])
                continue
            if tgt.startswith("mailto:"):
                continue
            if tgt.startswith("#"):
                if tgt[1:].lower() not in heads:
                    rep.warn("unverified-anchor", ln, "anchor %s matches no heading" % tgt)
                continue
            clean = urllib.parse.unquote(re.split(r"[#?]", tgt)[0])
            found = None
            for base in (ctx.readme_dir, repo):
                if os.path.exists(os.path.join(base, clean)):
                    found = os.path.join(base, clean)
                    break
            if not found:
                rep.fail("missing-link" if not is_img else "missing-image", ln,
                         "relative %s `%s` does not exist" % ("image" if is_img else "link", tgt))
            elif is_img or clean.lower().endswith(IMG_EXT):
                referenced_images.add(os.path.abspath(found))

    # inline code: paths and commands
    for ln, line in prose:
        for m in SPAN_RE.finditer(line):
            span = m.group(1).strip()
            first = span.split()[0] if span.split() else ""
            if " " in span and (os.path.basename(first) in INTERP or first.startswith(("./", "npm", "make", "pip"))):
                check_command(ctx, rep, ln, span)
            elif looks_like_path(span):
                check_path(ctx, rep, ln, span, True, "backticked path")

    # fenced commands
    for start, lang, lines in fences:
        if lang in SHELL_LANGS:
            buf = ""
            for ln, l in lines:
                s = l.rstrip()
                if lang == "console" and not s.lstrip().startswith(("$", ">")):
                    continue
                if s.endswith("\\"):
                    buf += s[:-1] + " "
                    continue
                check_command(ctx, rep, ln, buf + s)
                buf = ""
        elif lang == "":
            for ln, l in lines:
                if l.lstrip().startswith("$ "):
                    check_command(ctx, rep, ln, l)

    # image budget + jobs
    assets = set()
    if a.assets:
        for dp, _, fn in os.walk(a.assets):
            for f in fn:
                if f.lower().endswith(IMG_EXT):
                    assets.add(os.path.abspath(os.path.join(dp, f)))
    imgs = assets | referenced_images
    total = sum(os.path.getsize(p) for p in imgs if os.path.exists(p))
    if len(imgs) > a.max_images:
        rep.fail("image-count", 0, "%d images (%s); cap is %d" % (
            len(imgs), ", ".join(sorted(os.path.basename(p) for p in imgs)), a.max_images))
    if total > a.max_bytes:
        rep.fail("asset-budget", 0, "images total %d bytes; cap is %d" % (total, a.max_bytes))
    if a.ledger:
        for p in sorted(imgs):
            name = os.path.basename(p)
            job_ok = False
            for l in ledger_text.splitlines():
                if name in l:
                    rest = re.sub(r"[|`]", " ", l.replace(name, " "))
                    if len(re.findall(r"[A-Za-z]{2,}", rest)) >= 3:
                        job_ok = True
            if not job_ok:
                rep.fail("image-job", 0, "image `%s` has no one-line job in the ledger" % name)

    # behaviour words: the checker cannot read code, so it asks for a ledger claim
    claim_texts = [r["claim"].lower() for r in rows]
    for ln, line in prose:
        plain = SPAN_RE.sub(" ", line).lower()
        lt = set(re.findall(r"[a-z]{4,}", plain))
        for m in BEHAVIOUR_RE.finditer(plain):
            verb = m.group(1)
            if not any(verb in c and len(lt & set(re.findall(r"[a-z]{4,}", c))) >= 3 for c in claim_texts):
                rep.warn("unverified-behaviour", ln,
                         "`%s` is a behaviour/guarantee word with no ledger claim containing it; "
                         "read the code, add a row that says what is and is not checked, or reword" % verb)

    # versions and numbers (prose, minus code and link targets)
    seen = set()
    for ln, line in prose:
        t = SPAN_RE.sub(" ", line)
        t = LINK_RE.sub(lambda m: m.group(2), t)
        t = re.sub(r"https?://\S+|<[^>]+>", " ", t)
        t = re.sub(r"^\s*\d+[.)]\s", "", t)
        for m in re.finditer(r"(?<![\w.])v?\d+(?:[.,]\d+)*\+?(?![\w])", t):
            tok = m.group(0).rstrip(",.")
            core = tok.lstrip("v").rstrip("+")
            if (ln, core) in seen:
                continue
            seen.add((ln, core))
            is_version = "." in core or tok.startswith("v")
            if not is_version and len(core) < 2:
                continue
            if core not in ctx.corpus:
                rep.warn("unverified-version" if is_version else "unverified-number", ln,
                         "`%s` not found in repo text or ledger" % tok)

    # first-screen sanity (advisory)
    h1 = [ln for ln, l in prose if re.match(r"^#\s", l)]
    if not h1:
        rep.warn("first-screen", 1, "no H1 title")
    first_fence = min([s for s, lg, _ in fences if lg in SHELL_LANGS], default=None)  # command blocks only
    first_img = next((ln for ln, l in prose if LINK_RE.search(l) and "!" in l or "<img" in l.lower()), None)
    if first_fence and first_fence > 40:
        rep.warn("first-screen", first_fence, "first code block starts at line %d (> 40)" % first_fence)
    if first_fence and first_img and first_img > first_fence:
        rep.warn("first-screen", first_img, "first image comes after the first command block")
    if not first_img:
        rep.warn("first-screen", 0, "no image: fine only if the ledger says 'no visual warranted'")

    status = "FAIL" if rep.fails else "PASS"
    summary = "check_readme: %s - %d fail, %d unverified (hand-check); %d images, %d bytes; %d ledger rows" % (
        status, len(rep.fails), len(rep.warns), len(imgs), total, len(rows))
    if a.json:
        json.dump({"status": status, "fails": rep.fails, "warnings": rep.warns,
                   "images": sorted(os.path.basename(p) for p in imgs), "image_bytes": total,
                   "ledger_rows": len(rows), "summary": summary}, sys.stdout, indent=2)
        sys.stdout.write("\n")
    else:
        print("check_readme: %s  (repo: %s)" % (os.path.basename(readme), os.path.basename(repo)))
        for f in rep.fails:
            print("FAIL  line %-4s %-18s %s" % (f["line"] or "-", f["rule"], f["message"]))
        for w in rep.warns:
            print("WARN  line %-4s %-18s %s" % (w["line"] or "-", w["rule"], w["message"]))
        print(summary)
    return 1 if rep.fails else 0


if __name__ == "__main__":
    sys.exit(main())
