"""clampy: two tiny numeric helpers."""


def clamp(value, low, high):
    """Return value limited to the range low..high.

    >>> clamp(15, 0, 10)
    10
    """
    if low > high:
        raise ValueError("low must not exceed high")
    return max(low, min(value, high))


def lerp(start, end, t):
    """Linear interpolation between start and end.

    >>> lerp(0, 10, 0.5)
    5.0
    """
    return start + (end - start) * t
