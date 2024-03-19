import pytest

from .errors import GrammarParseError
from .parse_char import parse_char


@pytest.mark.parametrize(
    ("description", "char", "code_point"),
    [
        ("escaped 8-bit unicode char", "a", ord("a")),
        ("escaped 8-bit unicode char", "9", ord("9")),
    ],
)
def test_parse_char_simple(description, char, code_point):
    grammar = f'root ::= "{char}" "foo"'
    assert parse_char(grammar, len('root ::= "')) == (code_point, 1)


@pytest.mark.parametrize(
    ("description", "escaped_char", "code_point", "inc_pos"),
    [
        ("escaped 8-bit unicode char", "\\x2A", ord("\x2A"), 4),
        ("escaped 16-bit unicode char", "\\u006F", ord("\u006F"), 6),
        ("escaped 32-bit unicode char", "\\U0001F4A9", 128169, 10),
        ("escaped tab char", "\\t", ord("\t"), 2),
        ("escaped new line char", "\\n", ord("\n"), 2),
        ("escaped \r char", "\\r", ord("\r"), 2),
        ("escaped quote char", '\\"', ord('"'), 2),
        ("escaped [ char", "\\[", ord("["), 2),
        ("escaped ] char", "\\]", ord("]"), 2),
        ("escaped \\ char", "\\\\", ord("\\"), 2),
    ],
)
def test_parse_char_complex(description, escaped_char, code_point, inc_pos):
    grammar = f'root ::= "{escaped_char}" "foo"'
    assert parse_char(grammar, len('root ::= "')) == (code_point, inc_pos)


def test_parse_char_throws():
    with pytest.raises(GrammarParseError):
        parse_char("", 0)
    with pytest.raises(GrammarParseError):
        parse_char("a", 1)
