#!/usr/bin/env python3
"""Tests for check_readme.py, inspect_repo.py and capture.sh.

Run:  python3 -I scripts/test_checker.py        (from the skill folder; stdlib unittest)
Each FAIL rule has a test that proves the checker exits 1 for it; a clean README exits 0.
capture.sh tests are skipped (and say so) when headless Chrome or ImageMagick is absent.
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
CHECK = os.path.join(HERE, "check_readme.py")
INSPECT = os.path.join(HERE, "inspect_repo.py")
CAPTURE = os.path.join(HERE, "capture.sh")

PNG = bytes.fromhex(  # 1x1 PNG
    "89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c489"
    "0000000d49444154789c6360000002000001e221bc330000000049454e44ae426082")

CLEAN_README = """# Tool

Turns a CSV into a report.

![Report preview](assets/proof.png)

```bash
python3 run.py report
```

See [the license](LICENSE) and `docs/guide.md`.
"""
LEDGER = """| # | Claim | Source | Kind |
|---|-------|--------|------|
| 1 | `run.py report` builds the report | run.py:3 | observed |
| 2 | Guide exists | docs/guide.md:1 | copied |

| Image | Job |
|---|---|
| proof.png | shows the report the command produces |
"""


class Fixture(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp(prefix="rs-test-")
        self.repo = os.path.join(self.tmp, "repo")
        self.out = os.path.join(self.tmp, "out")
        os.makedirs(os.path.join(self.repo, "docs"))
        os.makedirs(os.path.join(self.out, "assets"))
        self.w(self.repo, "run.py", "import sys\n# subcommand: report\nprint('report', sys.argv)\n")
        self.w(self.repo, "docs/guide.md", "# Guide\n")
        self.w(self.repo, "LICENSE", "MIT License\n")
        with open(os.path.join(self.out, "assets", "proof.png"), "wb") as fh:
            fh.write(PNG)
        self.w(self.out, "claims.md", LEDGER)
        self.w(self.out, "README.md", CLEAN_README)

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def w(self, base, rel, text):
        with open(os.path.join(base, rel), "w") as fh:
            fh.write(text)

    def run_check(self, readme=None, extra=()):
        if readme is not None:
            self.w(self.out, "README.md", readme)
        cmd = [sys.executable, "-I", CHECK, os.path.join(self.out, "README.md"),
               "--repo", self.repo, "--ledger", os.path.join(self.out, "claims.md"),
               "--assets", os.path.join(self.out, "assets")] + list(extra)
        p = subprocess.run(cmd, capture_output=True, text=True)
        return p.returncode, p.stdout + p.stderr

    def assertFails(self, rule, readme=None, extra=()):
        code, out = self.run_check(readme, extra)
        self.assertEqual(code, 1, out)
        self.assertIn("FAIL", out)
        self.assertIn(rule, out)


class TestChecker(Fixture):
    def test_clean_passes(self):
        code, out = self.run_check()
        self.assertEqual(code, 0, out)
        self.assertIn("check_readme: PASS", out)

    def test_fake_command_script(self):
        self.assertFails("missing-path", CLEAN_README.replace("run.py report", "fake_tool.py go"))

    def test_fake_command_path_style(self):
        self.assertFails("missing-path", CLEAN_README.replace("python3 run.py report", "./bin/ship.sh"))

    def test_missing_image(self):
        self.assertFails("missing-image", CLEAN_README + "\n![Gone](assets/gone.png)\n")

    def test_missing_link(self):
        self.assertFails("missing-link", CLEAN_README + "\nSee [more](docs/nope.md).\n")

    def test_image_without_alt(self):
        self.assertFails("image-alt", CLEAN_README.replace("![Report preview]", "![]"))

    def test_html_img_without_alt(self):
        self.assertFails("image-alt", CLEAN_README + '\n<img src="assets/proof.png">\n')

    def test_skill_md_header_is_skipped(self):
        led = LEDGER.replace("| # | Claim | Source | Kind |", "| # | Claim | Source (file:line) | Kind |")
        self.w(self.out, "claims.md", led)
        code, out = self.run_check()
        self.assertEqual(code, 0, out)

    def test_behaviour_word_without_ledger_claim_warns(self):
        code, out = self.run_check(CLEAN_README.replace("Turns a CSV", "Validates every row and turns a CSV"))
        self.assertEqual(code, 0, out)
        self.assertIn("unverified-behaviour", out)

    def test_behaviour_word_with_ledger_claim_is_quiet(self):
        self.w(self.out, "claims.md", LEDGER.replace("| 2 | Guide", "| 3 | Validates every row of the CSV and turns it into a report | run.py:3 | observed |\n| 2 | Guide"))
        code, out = self.run_check(CLEAN_README.replace("Turns a CSV", "Validates every row and turns a CSV"))
        self.assertEqual(code, 0, out)
        self.assertNotIn("unverified-behaviour", out)

    def test_ledger_overlap_warns(self):
        self.w(self.out, "claims.md", LEDGER.replace("Guide exists", "Encryption uses hardware tokens"))
        code, out = self.run_check()
        self.assertEqual(code, 0, out)
        self.assertIn("ledger-overlap", out)

    def test_hype_phrase(self):
        self.assertFails("banned-phrase", CLEAN_README.replace("Turns a CSV", "A powerful tool that turns a CSV"))

    def test_hype_phrase_inside_code_is_ignored(self):
        code, out = self.run_check(CLEAN_README + "\n```bash\necho powerful\n```\n")
        self.assertEqual(code, 0, out)

    def test_backticked_missing_path(self):
        self.assertFails("missing-path", CLEAN_README + "\nConfig lives in `config/settings.json`.\n")

    def test_badge_url(self):
        self.assertFails("badge", CLEAN_README + "\n![build](https://img.shields.io/badge/build-passing-green)\n")

    def test_badge_allowed_flag(self):
        code, out = self.run_check(CLEAN_README + "\n![build](https://img.shields.io/x.svg)\n",
                                   ["--allow-badges", "--max-images", "2"])
        self.assertNotIn("badge  ", out)

    def test_asset_over_byte_budget(self):
        with open(os.path.join(self.out, "assets", "proof.png"), "ab") as fh:
            fh.write(b"\0" * 2_000_000)
        self.assertFails("asset-budget")

    def test_too_many_images(self):
        for n in ("a.png", "b.png", "c.png"):
            with open(os.path.join(self.out, "assets", n), "wb") as fh:
                fh.write(PNG)
        self.assertFails("image-count")

    def test_image_without_ledger_job(self):
        self.w(self.out, "claims.md", LEDGER.replace("| proof.png | shows the report the command produces |", ""))
        self.assertFails("image-job")

    def test_ledger_missing_source_file(self):
        self.w(self.out, "claims.md", LEDGER.replace("run.py:3", "nothere.py:3"))
        self.assertFails("ledger-source")

    def test_ledger_line_out_of_range(self):
        self.w(self.out, "claims.md", LEDGER.replace("run.py:3", "run.py:99"))
        self.assertFails("ledger-source")

    def test_ledger_inferred_rejected(self):
        self.w(self.out, "claims.md", LEDGER.replace("| observed |", "| inferred |"))
        self.assertFails("ledger-inferred")

    def test_ledger_bad_kind(self):
        self.w(self.out, "claims.md", LEDGER.replace("| copied |", "| guessed |"))
        self.assertFails("ledger-kind")

    def test_unverified_items_do_not_fail(self):
        code, out = self.run_check(CLEAN_README.replace("run.py report", "run.py report --verbose")
                                   + "\nRuns in 42 seconds on version 9.9.9.\n")
        self.assertEqual(code, 0, out)
        self.assertIn("WARN", out)
        self.assertIn("unverified-flag", out)
        self.assertIn("unverified-version", out)

    def test_generated_output_path_documented_in_cited_file(self):
        self.w(self.repo, "run.py", "# writes out/report.html\nimport sys\nprint('report')\n")
        code, out = self.run_check(CLEAN_README + "\nOpen `out/report.html`.\n")
        self.assertEqual(code, 0, out)
        self.assertIn("unverified-generated-path", out)

    def test_json_output(self):
        code, out = self.run_check(CLEAN_README + "\n![x](assets/none.png)\n", ["--json"])
        self.assertEqual(code, 1)
        self.assertEqual(json.loads(out)["status"], "FAIL")

    def test_bad_usage_exit_2(self):
        p = subprocess.run([sys.executable, "-I", CHECK, "/no/such/README.md", "--repo", self.repo],
                           capture_output=True, text=True)
        self.assertEqual(p.returncode, 2)
        self.assertIn("ERROR", p.stderr)


class TestInspect(Fixture):
    def test_inspect_lists_repo(self):
        p = subprocess.run([sys.executable, "-I", INSPECT, self.repo], capture_output=True, text=True)
        self.assertEqual(p.returncode, 0, p.stderr)
        data = json.loads(p.stdout)
        self.assertIn("run.py", data["entry_candidates"])
        self.assertEqual(data["license"]["file"], "LICENSE")

    def test_inspect_bad_path(self):
        p = subprocess.run([sys.executable, "-I", INSPECT, "/no/such/dir"], capture_output=True, text=True)
        self.assertEqual(p.returncode, 2)
        self.assertIn("ERROR", p.stderr)

    def test_inspect_empty_dir(self):
        empty = os.path.join(self.tmp, "empty")
        os.mkdir(empty)
        p = subprocess.run([sys.executable, "-I", INSPECT, empty], capture_output=True, text=True)
        self.assertEqual(p.returncode, 2)


class TestCapture(Fixture):
    def have_tools(self):
        return shutil.which("magick") or shutil.which("convert")

    def test_missing_input_exits_2(self):
        p = subprocess.run(["bash", CAPTURE, "/no/such.html", os.path.join(self.tmp, "o.png")],
                           capture_output=True, text=True)
        self.assertEqual(p.returncode, 2)
        self.assertIn("ERROR", p.stderr)

    def test_missing_tools_prints_hint(self):
        env = dict(os.environ, CHROME="/no/such/chrome", PATH="/usr/bin:/bin")
        html = os.path.join(self.tmp, "p.html")
        self.w(self.tmp, "p.html", "<h1>x</h1>")
        p = subprocess.run(["/bin/bash", CAPTURE, html, os.path.join(self.tmp, "o.png")],
                           capture_output=True, text=True, env=env)
        if p.returncode == 0:
            self.skipTest("a Chrome/Chromium and ImageMagick exist on the minimal PATH")
        self.assertEqual(p.returncode, 2)
        self.assertIn("install", p.stderr.lower())

    def test_real_capture(self):
        html = os.path.join(self.tmp, "p.html")
        self.w(self.tmp, "p.html", "<body style='font:20px sans-serif'><h1>Hello</h1><p>proof</p></body>")
        out = os.path.join(self.tmp, "o.png")
        p = subprocess.run(["bash", CAPTURE, html, out, "600", "full"], capture_output=True, text=True)
        if p.returncode == 2:
            self.skipTest("capture tools not installed: " + p.stderr.strip()[:120])
        self.assertEqual(p.returncode, 0, p.stderr)
        self.assertGreater(os.path.getsize(out), 200)
        crop = os.path.join(self.tmp, "c.png")
        p = subprocess.run(["bash", CAPTURE, html, crop, "600", "full", "--crop", "300x100+0+0"],
                           capture_output=True, text=True)
        self.assertEqual(p.returncode, 0, p.stderr)


if __name__ == "__main__":
    unittest.main(verbosity=2)
