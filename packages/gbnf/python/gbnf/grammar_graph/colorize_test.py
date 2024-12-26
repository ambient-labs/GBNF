from .colorize import Color, colorize


def test_colorize_strings():
    assert colorize("hello", Color.BLUE) == "\x1b[34mhello"
    assert colorize("test", Color.CYAN) == "\x1b[36mtest"
    assert colorize("example", Color.GREEN) == "\x1b[32mexample"


def test_colorize_numbers():
    assert colorize(123, Color.RED) == "\x1b[31m123"
    assert colorize(456, Color.GRAY) == "\x1b[90m456"
    assert colorize(789, Color.YELLOW) == "\x1b[33m789"
