MAXIMUM_NUMBER_OF_ERROR_LINES_TO_SHOW = 3


def GRAMMAR_PARSER_ERROR_HEADER_MESSAGE(reason: str) -> str:
    return f"Failed to parse grammar: {reason}"


INPUT_PARSER_ERROR_HEADER_MESSAGE = "Failed to parse input string:"


class GrammarParseError(Exception):
    def __init__(self, grammar: str, pos: int, reason: str):
        msg = "\n".join(
            [
                GRAMMAR_PARSER_ERROR_HEADER_MESSAGE(reason),
                *build_error_position(grammar, pos),
            ],
        )
        super().__init__(msg)
        self.grammar = grammar
        self.pos = pos
        self.reason = reason
        self.name = "GrammarParseError"


ValidInput = str | int | list[int]


class InputParseError(Exception):
    def __init__(
        self,
        most_recent_input: ValidInput,
        pos: int,
        _previous_input: ValidInput = "",
    ):
        msg = "\n".join(
            [
                INPUT_PARSER_ERROR_HEADER_MESSAGE,
                *build_error_position(get_input_as_string(most_recent_input), pos),
            ],
        )
        super().__init__(msg)
        self.src = most_recent_input
        self.pos = pos
        self.name = "InputParseError"


def build_error_position(src: str, pos: int) -> list[str]:
    if src == "":
        return ["No input provided"]
    grammar_lines = src.split("\n")
    line_idx = 0
    while line_idx < len(grammar_lines) and pos > len(grammar_lines[line_idx]) - 1:
        pos -= len(grammar_lines[line_idx])
        line_idx += 1

    start_line = max(0, line_idx - (MAXIMUM_NUMBER_OF_ERROR_LINES_TO_SHOW - 1))
    lines_to_show = [
        grammar_lines[i]
        for i in range(start_line, line_idx + 1)
        if i < len(grammar_lines)
    ]

    # Append the position marker
    return [*lines_to_show, " " * pos + "^"]


def get_input_as_string(src: ValidInput) -> str:
    if isinstance(src, str):
        return src
    if isinstance(src, list):
        return "".join(chr(cp) for cp in src)
    return str(chr(src))
