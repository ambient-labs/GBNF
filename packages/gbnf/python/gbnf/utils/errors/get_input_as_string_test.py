import pytest

from .get_input_as_string import get_input_as_string


def describe_get_input_as_string():
    @pytest.mark.parametrize(
        ("input", "expected"),
        [
            ("hello", "hello"),
            ([104, 101, 108, 108, 111], "hello"),
            (104, "h"),
            (0x1F600, "😀"),
            ([0x1F600, 0x1F601], "😀😁"),
        ],
    )
    def it_correctly_converts_strings_to_strings(input, expected):
        assert get_input_as_string(input) == expected
