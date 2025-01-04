from .build_error_position import build_error_position


def GRAMMAR_PARSER_ERROR_HEADER_MESSAGE(reason: str) -> str:
    return f"Failed to parse grammar: {reason}"


class GrammarParseError(Exception):
    grammar: str
    pos: int
    reason: str

    def __init__(self, grammar: str, pos: int, reason: str):
        super().__init__(
            "\n".join(
                [
                    GRAMMAR_PARSER_ERROR_HEADER_MESSAGE(reason),
                    "",
                    *build_error_position(grammar, pos),
                ],
            ),
        )
        self.grammar = grammar
        self.pos = pos
        self.reason = reason
