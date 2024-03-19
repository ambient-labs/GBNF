import pytest

from .errors import GrammarParseError, InputParseError, build_error_position


@pytest.mark.parametrize(
    ("grammar", "pos", "expected"),
    [
        ('root ::= "foo"', 1, ['root ::= "foo"', " ^"]),
        ('root ::= "foo"', 5, ['root ::= "foo"', "     ^"]),
        ("aa\nbb", 1, ["aa", " ^"]),
        ("aa\nbb", 2, ["aa", "bb", "^"]),
        ("aa\nbb", 2 + 1, ["aa", "bb", " ^"]),
        ("aa\nbb\ncc", 2 + 1, ["aa", "bb", " ^"]),
        ("aa\nbb\ncc", 2 + 2 + 0, ["aa", "bb", "cc", "^"]),
        ("aa\nbb\ncc", 2 + 2 + 1, ["aa", "bb", "cc", " ^"]),
        ("aa\nbb\ncc\ndd", 2 + 2 + 2 + 0, ["bb", "cc", "dd", "^"]),
        ("aa\nbb\ncc\ndd\nee", 2 + 2 + 2 + 2 + 1, ["cc", "dd", "ee", " ^"]),
    ],
)
def test_build_error_position(grammar, pos, expected):
    assert build_error_position(grammar, pos) == expected


def test_build_error_position_for_empty_string():
    assert build_error_position("", 0) == ["No input provided"]


def test_grammar_parse_error():
    grammar = "aa\nbb\ncc\ndd\nee"
    pos = 5
    reason = "reason"
    err = GrammarParseError(grammar, pos, reason)
    expected_message = "Failed to parse grammar: reason\naa\nbb\ncc\n ^"
    assert str(err) == expected_message


def test_input_parse_error():
    input_text = "some input"
    pos = 1
    err = InputParseError(input_text, pos)
    expected_message = "Failed to parse input string:\nsome input\n ^"
    assert str(err) == expected_message


def test_input_parse_error_with_code_point():
    pos = 0
    err = InputParseError(97, pos)
    expected_message = "Failed to parse input string:\na\n^"
    assert str(err) == expected_message


def test_input_parse_error_code_points():
    input_text = [97, 98, 99, 100]  # 'abcd'
    pos = 2
    err = InputParseError(input_text, pos)
    expected_message = "Failed to parse input string:\nabcd\n  ^"
    assert str(err) == expected_message
