# Usage

Tally turns a raw web access log into a ranked list of the paths that get the most hits, so you can see where traffic goes without a dashboard.

Each log line needs a method and a path: `GET /checkout 200`.

    python3 tally.py count examples/sample.log --top 3
    python3 tally.py report examples/sample.log --output out/sample-report.html

Run the tests with:

    python3 -m unittest discover -s tests
