import unittest

from clampy import clamp, lerp


class ClampyTests(unittest.TestCase):
    def test_clamp_high(self):
        self.assertEqual(clamp(15, 0, 10), 10)

    def test_lerp_midpoint(self):
        self.assertEqual(lerp(0, 10, 0.5), 5.0)


if __name__ == "__main__":
    unittest.main()
