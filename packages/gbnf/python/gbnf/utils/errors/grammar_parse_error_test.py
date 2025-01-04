
from .grammar_parse_error import GRAMMAR_PARSER_ERROR_HEADER_MESSAGE, GrammarParseError


def describe_grammar_parse_error():
    def test_it_renders_a_message():
        grammar = "aa\\nbb\\ncc\\ndd\\nee"
        pos = 5
        reason = "reason"
        err = GrammarParseError("\n".join(grammar.split("\\n")), pos, reason)
        assert err.args[0] == "\n".join(
            [
                GRAMMAR_PARSER_ERROR_HEADER_MESSAGE(reason),
                "",
                "aa",
                "bb",
                "cc",
                " ^",
            ],
        )
