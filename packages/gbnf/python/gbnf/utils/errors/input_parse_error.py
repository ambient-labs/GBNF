from .build_error_position import build_error_position
from .errors_types import ValidInput
from .get_input_as_string import get_input_as_string

INPUT_PARSER_ERROR_HEADER_MESSAGE = "Failed to parse input string:"


class InputParseError(Exception):
    most_recent_input: ValidInput
    pos: int
    previous_input: ValidInput

    def __init__(
        self,
        most_recent_input: ValidInput,
        pos: int,
        previous_input: ValidInput = "",
    ):
        super().__init__(
            "\n".join(
                [
                    INPUT_PARSER_ERROR_HEADER_MESSAGE,
                    "",
                    *build_error_position(
                        f"{get_input_as_string(previous_input)}{get_input_as_string(most_recent_input)}",
                        pos + len(get_input_as_string(previous_input)),
                    ),
                ],
            ),
        )
        self.most_recent_input = most_recent_input
        self.pos = pos
        self.previous_input = previous_input

    @property
    def src(self):
        return f"{get_input_as_string(self.previous_input)}{get_input_as_string(self.most_recent_input)}"

    @property
    def error_for_most_recent_input(self):
        return "\n".join(
            [
                INPUT_PARSER_ERROR_HEADER_MESSAGE,
                "",
                *build_error_position(
                    get_input_as_string(self.most_recent_input),
                    self.pos,
                ),
            ],
        )

    def __str__(self):
        return "\n".join(
            [
                INPUT_PARSER_ERROR_HEADER_MESSAGE,
                "",
                *build_error_position(
                    f"{get_input_as_string(self.previous_input)}{get_input_as_string(self.most_recent_input)}",
                    self.pos + len(get_input_as_string(self.previous_input)),
                ),
            ],
        )

    def __eq__(self, other):
        return str(self) == str(other)
