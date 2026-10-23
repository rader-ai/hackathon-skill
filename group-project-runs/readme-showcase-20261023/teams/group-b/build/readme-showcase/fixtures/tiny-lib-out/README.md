# clampy

Two small numeric helpers for Python: `clamp` and `lerp`.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/reel-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="assets/reel-light.svg">
  <img src="assets/reel-final.png" alt="A two-step animation: the call clamp(15, 0, 10) goes in and the value 10 comes out." width="880">
</picture>

## Try it

Copy `clampy.py` next to your code, then:

```python
from clampy import clamp
clamp(15, 0, 10)
```

The documented result is `10`. `lerp` is linear interpolation between a start and an end value.

Run the tests with `python3 -m unittest discover -s tests`. This command is unverified: it was not run while writing this README.

## Limits

Copying the file is the only documented way to use it. This repository documents no package install.

## License

MIT licensed.
