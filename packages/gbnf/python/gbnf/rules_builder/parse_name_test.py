import pytest

from .errors import GrammarParseError
from .parse_name import PARSE_NAME_ERROR, parse_name


def test_should_return_correct_name_when_encountering_a_valid_name():
    src = "validName"
    name = parse_name(src, 0)
    assert name == src


def test_should_return_correct_name_when_encountering_a_valid_name_starting_at_a_non_zero_position():
    src = "123validName"
    name = parse_name(src, 3)
    assert name == "validName"


def test_should_throw_error_when_encountering_an_invalid_name():
    src = "123"
    with pytest.raises(GrammarParseError) as exc_info:
        parse_name(src, 0)
    assert str(exc_info.value) == str(GrammarParseError(src, 0, PARSE_NAME_ERROR))
