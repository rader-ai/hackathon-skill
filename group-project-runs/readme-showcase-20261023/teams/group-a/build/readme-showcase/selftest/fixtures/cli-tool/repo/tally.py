#!/usr/bin/env python3
"""Tally: rank the paths in a web access log by hit count. Standard library only."""
import argparse
import collections
import html
import sys


def read_paths(handle):
    for line in handle:
        parts = line.split()
        if len(parts) >= 2:
            yield parts[1]


def count(args):
    with open(args.file, encoding="utf-8") as handle:
        ranked = collections.Counter(read_paths(handle)).most_common(args.top)
    for path, hits in ranked:
        print(f"{path:<12}{hits}")


def report(args):
    with open(args.file, encoding="utf-8") as handle:
        ranked = collections.Counter(read_paths(handle)).most_common(10)
    rows = "".join(f"<tr><td>{html.escape(p)}</td><td>{n}</td></tr>" for p, n in ranked)
    page = f"<!doctype html><title>Tally</title><table>{rows}</table>"
    with open(args.output, "w", encoding="utf-8") as out:
        out.write(page)
    print(f"Wrote {args.output}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    c = sub.add_parser("count", help="print the busiest paths")
    c.add_argument("file")
    c.add_argument("--top", type=int, default=5)
    r = sub.add_parser("report", help="write an HTML table")
    r.add_argument("file")
    r.add_argument("--output", required=True)
    args = parser.parse_args()
    try:
        {"count": count, "report": report}[args.command](args)
    except OSError as exc:
        sys.exit(f"Error: {exc}")


if __name__ == "__main__":
    main()
