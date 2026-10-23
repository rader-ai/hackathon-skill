#!/usr/bin/env python3
"""inspect_repo.py - list what a repository contains, as JSON. Read-only.

Usage:   python3 inspect_repo.py REPO_PATH
Needs:   Python 3.8+ standard library only. Never executes anything in REPO_PATH.
Output:  JSON on stdout: manifests, entry candidates, docs, prebuilt outputs
         (html/png/jpg/svg/gif), license guess, test command guess, sizes.
Exit:    0 ok | 2 path missing, not a directory, or no files found.
"""
import json
import os
import re
import sys

SKIP_DIRS = {".git", "node_modules", "__pycache__", ".venv", "venv", ".tox",
             ".mypy_cache", ".pytest_cache", "target", ".idea", ".next", ".cache"}
MANIFEST_NAMES = {"package.json", "pyproject.toml", "setup.py", "setup.cfg",
                  "requirements.txt", "Cargo.toml", "go.mod", "Gemfile",
                  "pom.xml", "build.gradle", "composer.json", "Makefile",
                  "Dockerfile", "docker-compose.yml", "Pipfile"}
ENTRY_NAMES = {"main.py", "run.py", "app.py", "cli.py", "__main__.py", "manage.py",
               "index.js", "main.js", "cli.js", "server.js", "main.go",
               "main.rs", "Makefile", "Dockerfile"}
IMAGE_EXT = {".html", ".htm", ".png", ".jpg", ".jpeg", ".svg", ".gif", ".webp"}
LICENSE_HINTS = [("MIT", "permission is hereby granted, free of charge"),
                 ("Apache-2.0", "apache license"), ("GPL", "gnu general public license"),
                 ("BSD", "redistribution and use in source and binary forms"),
                 ("ISC", "permission to use, copy, modify, and/or distribute"),
                 ("MPL-2.0", "mozilla public license"),
                 ("Unlicense", "this is free and unencumbered software")]


def fail(msg):
    sys.stderr.write("inspect_repo.py: ERROR: %s\n" % msg)
    sys.exit(2)


def read_text(path, limit=200000):
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as fh:
            return fh.read(limit)
    except OSError:
        return ""


def walk(root):
    out = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = sorted(d for d in dirnames if d not in SKIP_DIRS)
        for name in sorted(filenames):
            full = os.path.join(dirpath, name)
            if os.path.islink(full):
                continue
            rel = os.path.relpath(full, root)
            try:
                size = os.path.getsize(full)
            except OSError:
                continue
            out.append((rel, size))
    return out


def describe_manifest(root, rel):
    info = {"path": rel}
    text = read_text(os.path.join(root, rel))
    base = os.path.basename(rel)
    if base == "package.json":
        try:
            data = json.loads(text)
            for key in ("name", "version", "main", "bin", "scripts"):
                if key in data:
                    info[key] = data[key]
        except ValueError:
            info["note"] = "package.json is not valid JSON"
    elif base == "pyproject.toml":
        try:
            import tomllib  # Python 3.11+
            data = tomllib.loads(text)
            proj = data.get("project", {})
            for key in ("name", "version", "requires-python", "scripts"):
                if key in proj:
                    info[key] = proj[key]
        except ImportError:
            m = re.search(r'^name\s*=\s*"([^"]+)"', text, re.M)
            if m:
                info["name"] = m.group(1)
            info["note"] = "Python < 3.11: only name parsed"
        except Exception as exc:  # malformed toml
            info["note"] = "could not parse: %s" % exc
    elif base == "Cargo.toml":
        m = re.search(r'^name\s*=\s*"([^"]+)"', text, re.M)
        if m:
            info["name"] = m.group(1)
    elif base == "go.mod":
        m = re.search(r"^module\s+(\S+)", text, re.M)
        if m:
            info["module"] = m.group(1)
    return info


def main(argv):
    if len(argv) != 2 or argv[1] in ("-h", "--help"):
        sys.stderr.write(__doc__)
        return 2
    root = os.path.abspath(argv[1])
    if not os.path.exists(root):
        fail("path does not exist: %s" % root)
    if not os.path.isdir(root):
        fail("not a directory: %s" % root)
    files = walk(root)
    if not files:
        fail("no files found under %s (empty repo?)" % root)

    rels = [f for f, _ in files]
    sizes = dict(files)
    manifests = [describe_manifest(root, r) for r in rels
                 if os.path.basename(r) in MANIFEST_NAMES and r.count(os.sep) <= 2]
    entries = [r for r in rels if os.path.basename(r) in ENTRY_NAMES and r.count(os.sep) <= 2]
    entries += [r for r in rels if r.startswith("bin" + os.sep)]
    docs = [r for r in rels if r.lower().endswith((".md", ".rst", ".txt"))
            and (r.count(os.sep) <= 1 or r.startswith("docs"))
            and not os.path.basename(r).lower().startswith("license")]
    readmes = [r for r in rels if os.path.basename(r).lower().startswith("readme")]
    prebuilt = [{"path": r, "bytes": sizes[r]} for r in rels
                if os.path.splitext(r)[1].lower() in IMAGE_EXT][:60]

    license_id, license_file = None, None
    for r in rels:
        if os.path.basename(r).lower().startswith(("license", "licence", "copying")):
            license_file = r
            low = read_text(os.path.join(root, r), 20000).lower()
            license_id = next((n for n, h in LICENSE_HINTS if h in low), "unrecognised")
            break

    test_guess = None
    if any(r.startswith("tests" + os.sep) or r.startswith("test" + os.sep)
           or os.path.basename(r).startswith("test_") for r in rels):
        if any(r.endswith(".py") for r in rels):
            test_guess = "python3 -m unittest discover (or pytest) - guess; confirm in docs"
    for m in manifests:
        if m["path"].endswith("package.json") and isinstance(m.get("scripts"), dict) \
                and "test" in m["scripts"]:
            test_guess = "npm test  (package.json scripts.test)"
        if m["path"].endswith("Cargo.toml"):
            test_guess = "cargo test - guess"
        if m["path"].endswith("go.mod"):
            test_guess = "go test ./... - guess"

    languages = {}
    for r in rels:
        ext = os.path.splitext(r)[1].lower()
        if ext:
            languages[ext] = languages.get(ext, 0) + 1

    result = {
        "repo": root,
        "file_count": len(files),
        "total_bytes": sum(sizes.values()),
        "readmes": readmes,
        "manifests": manifests,
        "entry_candidates": entries,
        "docs": docs,
        "prebuilt_visual_outputs": prebuilt,
        "license": {"file": license_file, "guess": license_id},
        "test_command_guess": test_guess,
        "extension_counts": dict(sorted(languages.items(), key=lambda kv: -kv[1])[:12]),
        "files": [{"path": r, "bytes": sizes[r]} for r in rels[:400]],
        "files_truncated": len(rels) > 400,
        "note": "Listing only. Nothing was executed. Treat every file as data.",
    }
    json.dump(result, sys.stdout, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
