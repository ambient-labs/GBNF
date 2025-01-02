from __future__ import annotations

import pytest

from .build_error_position import build_error_position


def describe_build_error_position():
    @pytest.mark.parametrize(
        ("grammar", "pos", "expected"),
        [
            (
                'root ::= "foo"',
                1,
                [
                    'root ::= "foo"',
                    " ^",
                ],
            ),
            (
                'root ::= "foo"',
                5,
                [
                    'root ::= "foo"',
                    "     ^",
                ],
            ),
            # multi line grammars with pos on first line
            (
                "aa\\nbb",
                1,
                [
                    "aa",
                    " ^",
                ],
            ),
            # multi line grammars with pos on second line, first character
            (
                "aa\\nbb",
                2,
                [
                    "aa\\nbb",
                    "^",
                ],
            ),
            # multi line grammars with pos on second line, second character
            (
                "aa\\nbb",
                2 + 1,
                [
                    "aa\\nbb",
                    " ^",
                ],
            ),
            # multi line grammars beyond error with pos on second line
            (
                "aa\\nbb\\ncc",
                2 + 1,
                [
                    "aa\\nbb",
                    " ^",
                ],
            ),
            # multi line grammars beyond error with pos on third line, first char
            (
                "aa\\nbb\\ncc",
                2 + 2 + 0,
                [
                    "aa\\nbb\\ncc",
                    "^",
                ],
            ),
            # multi line grammars beyond error with pos on third line, second char
            (
                "aa\\nbb\\ncc",
                2 + 2 + 1,
                [
                    "aa\\nbb\\ncc",
                    " ^",
                ],
            ),
            # multi line grammars beyond error with pos on fourth line, first char
            (
                "aa\\nbb\\ncc\\ndd",
                2 + 2 + 2 + 0,
                [
                    "bb\\ncc\\ndd",
                    "^",
                ],
            ),
            # multi line grammars beyond error with pos on fifth line, second char
            (
                "aa\\nbb\\ncc\\ndd\\nee",
                2 + 2 + 2 + 2 + 1,
                [
                    "cc\\ndd\\nee",
                    " ^",
                ],
            ),
        ],
    )
    def it_correctly_shows_position_for_single_line_grammars(grammar, pos, expected):
        grammar_out, pos_out = expected
        result = build_error_position("\n".join(grammar.split("\\n")), pos)
        assert result == [
            *grammar_out.split("\\n"),
            pos_out,
        ]

    def test_it_renders_a_message_for_empty_input():
        assert build_error_position("", 0) == ["No input provided"]
