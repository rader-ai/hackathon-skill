#!/usr/bin/env python3
"""Tally a group-project run.

Usage: tally.py <workspace> [--round N]
Reads <workspace>/judges/rubric.json and <workspace>/scores/*.json,
writes <workspace>/results.json and <workspace>/results.md.
With --round N (N >= 2, a rematch) it reads scores-vN/ instead, writes results-vN.*,
and compares every team with the previous round's results. If every judge also scored v1
in the same pass (a "v1" block per team), the change comes from that pass and drift is reported.
"""
import json
import statistics
import sys
from pathlib import Path

LANDED = ("yes", "partly", "no", "rejected")


def fail(msg):
    sys.exit(f"tally: {msg}")


def load_json(path):
    try:
        return json.loads(path.read_text())
    except (OSError, json.JSONDecodeError) as e:
        fail(f"cannot read {path}: {e}")


def main():
    args = sys.argv[1:]
    rnd = 1
    if len(args) == 3 and args[1] == "--round" and args[2].isdigit():
        rnd = int(args[2])
        args = args[:1]
    if len(args) != 1 or rnd < 1:
        fail("usage: tally.py <workspace> [--round N]")
    ws = Path(args[0])
    suffix = "" if rnd == 1 else f"-v{rnd}"
    prev_suffix = "" if rnd <= 2 else f"-v{rnd - 1}"
    baseline = load_json(ws / f"results{prev_suffix}.json") if rnd > 1 else None
    rubric = load_json(ws / "judges" / "rubric.json")
    criteria = rubric["criteria"]
    crit_ids = [c["id"] for c in criteria]
    weights = {c["id"]: c["weight"] for c in criteria}
    if sum(weights.values()) != 100:
        fail(f"rubric weights sum to {sum(weights.values())}, expected 100")
    sig_points = rubric.get("signature_points", 3)
    head = rubric.get("head_judge")

    team_dir = ws / "teams"
    teams = sorted(p.name for p in team_dir.iterdir() if p.is_dir()) if team_dir.is_dir() else []
    score_dir = f"scores{suffix}"
    score_files = sorted((ws / score_dir).glob("*.json"))
    if not score_files:
        fail(f"no score files in {score_dir}/")

    def check_block(label, block, errors):
        c = block.get("criteria", {})
        for cid in crit_ids:
            v = c.get(cid)
            if not isinstance(v, (int, float)) or not 1 <= v <= 10:
                errors.append(f"{label}: criterion {cid} = {v!r} (need 1-10)")
        sv = block.get("signature_score")
        if not isinstance(sv, (int, float)) or not 0 <= sv <= 10:
            errors.append(f"{label}: signature_score = {sv!r} (need 0-10)")

    judges = []
    errors = []
    for f in score_files:
        s = load_json(f)
        jid = s.get("judge", f.stem)
        st = s.get("teams", {})
        if not teams:
            teams = sorted(st)
        for t in teams:
            if t not in st:
                errors.append(f"{jid}: missing team {t}")
                continue
            check_block(f"{jid}/{t}", st[t], errors)
            if "v1" in st[t]:
                check_block(f"{jid}/{t}/v1", st[t]["v1"], errors)
            if rnd > 1 and st[t].get("fix_landed") not in LANDED:
                errors.append(f"{jid}/{t}: fix_landed = {st[t].get('fix_landed')!r} (need one of {', '.join(LANDED)})")
        judges.append(s)
    if errors:
        fail("invalid scores:\n  " + "\n  ".join(errors))

    # A rematch is "paired" when every judge scored v1 again in the same pass as v2.
    has_v1 = [all("v1" in s["teams"][t] for t in teams) for s in judges]
    if rnd > 1 and any(has_v1) and not all(has_v1):
        fail("some judges scored v1 in this pass and some did not; re-score them all paired or none")
    paired = rnd > 1 and all(has_v1)

    def summarize(t, pick):
        per_judge = {}
        bonus = 0.0
        for s in judges:
            entry = pick(s["teams"][t])
            per_judge[s["judge"]] = sum(entry["criteria"][c] / 10 * weights[c] for c in crit_ids)
            bonus += entry["signature_score"] / 10 * sig_points
        rub = statistics.mean(per_judge.values())
        return {
            "rubric": round(rub, 2),
            "signature_bonus": round(bonus, 2),
            "total": round(rub + bonus, 2),
            "per_judge": {j: round(v, 2) for j, v in per_judge.items()},
            "spread": round(max(per_judge.values()) - min(per_judge.values()), 2),
            "criteria_avg": {
                c: round(statistics.mean(pick(s["teams"][t])["criteria"][c] for s in judges), 2)
                for c in crit_ids
            },
        }

    results = {t: summarize(t, lambda e: e) for t in teams}
    if paired:
        for t in teams:
            same = summarize(t, lambda e: e["v1"])
            results[t]["v1_same_pass"] = {k: same[k] for k in ("total", "rubric", "signature_bonus", "criteria_avg", "per_judge")}

    def rank_key(t):
        r = results[t]
        return (-r["total"], -r["per_judge"].get(head, 0), r["spread"])

    ranking = sorted(teams, key=rank_key)

    awards = []
    for s in judges:
        best = max(teams, key=lambda t: s["teams"][t]["signature_score"])
        sig = s.get("signature", {})
        awards.append({
            "judge": s["judge"],
            "model": s.get("model", ""),
            "signature": sig.get("name", ""),
            "description": sig.get("description", ""),
            "winner": best,
            "score": s["teams"][best]["signature_score"],
            "why": s["teams"][best].get("signature_why", ""),
        })

    most_split = max(teams, key=lambda t: results[t]["spread"])
    out = {"round": rnd, "ranking": ranking, "teams": results, "signature_awards": awards,
           "most_divisive": most_split, "criteria": criteria, "signature_points": sig_points}
    if rnd > 1:
        out["paired"] = paired

    if baseline:
        for t in teams:
            b = baseline["teams"].get(t)
            r = results[t]
            if b:
                r["previous_total"] = b["total"]
                r["previous_rank"] = baseline["ranking"].index(t) + 1
            if paired:
                # The change is measured inside one scoring pass, so judge drift cancels out.
                r["change"] = round(r["total"] - r["v1_same_pass"]["total"], 2)
                if b:
                    r["drift"] = round(r["v1_same_pass"]["total"] - b["total"], 2)
            elif b:
                r["change"] = round(r["total"] - b["total"], 2)
            results[t]["fixes"] = {s["judge"]: {"landed": s["teams"][t]["fix_landed"],
                                                "note": s["teams"][t].get("fix_note", "")}
                                   for s in judges}
        changed = [t for t in teams if "change" in results[t]]
        if changed:
            out["most_improved"] = max(changed, key=lambda t: results[t]["change"])
        out["lessons"] = [{"judge": s["judge"], "lesson": s["lesson"]} for s in judges if s.get("lesson")]

    (ws / f"results{suffix}.json").write_text(json.dumps(out, indent=2))

    jids = [s["judge"] for s in judges]
    title = "# Results" if rnd == 1 else f"# Results - round {rnd} (rematch)"
    if paired:
        extra_head, extra_rule = " v1 today | Change | Drift |", "---|---|---|"
    elif baseline:
        extra_head, extra_rule = " Change |", "---|"
    else:
        extra_head, extra_rule = "", ""
    lines = [title, ""]
    if rnd > 1:
        lines += ["Paired re-score: every judge scored v1 and v2 in the same pass. **Change** is v2 minus "
                  "today's v1; **Drift** is today's v1 minus its round-1 score." if paired else
                  "**Unpaired re-score**: the change compares v2 with round-1 scores, so it includes "
                  "any drift in how harshly the judges score.", ""]
    lines += ["## Standings", "",
              "| # | Team | Total |" + extra_head + " Rubric | Signature bonus | " + " | ".join(jids) + " | Spread |",
              "|---|---|---|" + extra_rule + "---|---|" + "---|" * len(jids) + "---|"]
    for i, t in enumerate(ranking, 1):
        r = results[t]
        pj = " | ".join(f"{r['per_judge'][j]:.1f}" for j in jids)
        ch = ""
        if paired:
            dr = f"{r['drift']:+.1f}" if "drift" in r else "n/a"
            ch = f" {r['v1_same_pass']['total']:.1f} | {r['change']:+.1f} | {dr} |"
        elif baseline:
            ch = f" {r['change']:+.1f} (was #{r['previous_rank']}) |" if "change" in r else " new |"
        lines.append(f"| {i} | {t} | **{r['total']:.1f}** |{ch} {r['rubric']:.1f} | "
                     f"+{r['signature_bonus']:.1f} | {pj} | {r['spread']:.1f} |")
    if out.get("most_improved"):
        mi = out["most_improved"]
        lines += ["", f"Most improved: **{mi}** ({results[mi]['change']:+.1f})"]
    if paired and baseline:
        v1_today = sorted(teams, key=lambda t: -results[t]["v1_same_pass"]["total"])
        lines += ["", "v1 ranking today: " + ", ".join(v1_today) +
                  " · round 1: " + ", ".join(baseline["ranking"])]
    lines += ["", "## Criterion averages", "",
              "| Team | " + " | ".join(c["name"] for c in criteria) + " |",
              "|---|" + "---|" * len(criteria)]
    for t in ranking:
        lines.append(f"| {t} | " + " | ".join(f"{results[t]['criteria_avg'][c]:.1f}" for c in crit_ids) + " |")
    lines += ["", "## Signature criteria revealed", ""]
    for a in awards:
        lines.append(f"- **{a['judge']}** ({a['model']}) - *{a['signature']}*: {a['description']}  ")
        lines.append(f"  Winner: **{a['winner']}** ({a['score']}/10) - {a['why']}")
    lines += ["", f"Most divisive: **{most_split}** (spread {results[most_split]['spread']:.1f})", ""]
    if baseline:
        lines += ["## Did the judges' notes land?", "",
                  "| Team | " + " | ".join(LANDED) + " |", "|---|" + "---|" * len(LANDED)]
        for t in ranking:
            counts = [sum(1 for f in results[t]["fixes"].values() if f["landed"] == k) for k in LANDED]
            lines.append(f"| {t} | " + " | ".join(str(c) for c in counts) + " |")
        lines.append("")
        for t in ranking:
            lines.append(f"### {t}")
            for j, f in results[t]["fixes"].items():
                lines.append(f"- {j}: **{f['landed']}** - {f['note']}")
            lines.append("")
        if out.get("lessons"):
            lines += ["## Judges' lessons for this domain", ""]
            lines += [f"- {l['judge']}: {l['lesson']}" for l in out["lessons"]]
            lines.append("")
    lines += ["## Judge notes", ""]
    for t in ranking:
        lines.append(f"### {t}")
        for s in judges:
            e = s["teams"][t]
            lines.append(f"- {s['judge']}: loved - {e.get('loved', '')}; docked - {e.get('docked', '')}")
        lines.append("")
    (ws / f"results{suffix}.md").write_text("\n".join(lines))
    print("\n".join(lines[:6 + len(ranking)]))


if __name__ == "__main__":
    main()
