import unittest
import tally


class ReadPaths(unittest.TestCase):
    def test_second_field_is_the_path(self):
        self.assertEqual(list(tally.read_paths(["GET /a 200"])), ["/a"])


if __name__ == "__main__":
    unittest.main()
