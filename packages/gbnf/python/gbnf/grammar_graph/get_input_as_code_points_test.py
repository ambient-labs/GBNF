
from .get_input_as_code_points import get_input_as_code_points


def describe_get_input_as_code_points():
    def it_returns_code_points_for_string():
        assert get_input_as_code_points("abc") == [97, 98, 99]

    def it_returns_code_points_for_number():
        assert get_input_as_code_points(99) == [99]

    def it_returns_code_points_for_array_of_number():
        assert get_input_as_code_points([99, 100, 101]) == [99, 100, 101]
