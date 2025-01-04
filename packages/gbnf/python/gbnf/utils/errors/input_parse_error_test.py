from .input_parse_error import INPUT_PARSER_ERROR_HEADER_MESSAGE, InputParseError


def describe_input_parse_error():
    def test_it_renders_a_message():
        input = "some input"
        pos = 1
        err = InputParseError(input, pos)
        assert err.args[0] == "\n".join(
            [
                INPUT_PARSER_ERROR_HEADER_MESSAGE,
                "",
                input,
                " ^",
            ],
        )

    def test_it_renders_a_message_for_code_point():
        pos = 0
        err = InputParseError("a", pos)
        assert err.args[0] == "\n".join(
            [
                INPUT_PARSER_ERROR_HEADER_MESSAGE,
                "",
                "a",
                "^",
            ],
        )

    def test_it_renders_a_message_for_code_points():
        pos = 2
        err = InputParseError("abcd", pos)
        assert err.args[0] == "\n".join(
            [
                INPUT_PARSER_ERROR_HEADER_MESSAGE,
                "",
                "abcd",
                "  ^",
            ],
        )
