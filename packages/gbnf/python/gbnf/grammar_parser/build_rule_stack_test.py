from typing import cast

import pytest

from ..grammar_graph.grammar_graph_types import (
    Range,
    RuleChar,
    RuleCharExclude,
    RuleEnd,
)
from ..grammar_graph.rule_ref import RuleRef
from ..rules_builder.rules_builder_types import (
    InternalRuleDef,
    InternalRuleDefAlt,
    InternalRuleDefChar,
    InternalRuleDefCharAlt,
    InternalRuleDefCharNot,
    InternalRuleDefCharRngUpper,
    InternalRuleDefEnd,
    InternalRuleDefReference,
)
from .build_rule_stack import build_rule_stack


def ichar(value: list[int]) -> InternalRuleDefChar:
    return InternalRuleDefChar(value=value)


def ichar_alt(value: int) -> InternalRuleDefCharAlt:
    return InternalRuleDefCharAlt(value=value)


def ichar_rng_upper(value: int) -> InternalRuleDefCharRngUpper:
    return InternalRuleDefCharRngUpper(value=value)


def ichar_not(value: list[int]) -> InternalRuleDefCharNot:
    return InternalRuleDefCharNot(value=value)


def ialt() -> InternalRuleDefAlt:
    return InternalRuleDefAlt()


def iend() -> InternalRuleDefEnd:
    return InternalRuleDefEnd()


def iref(value: int) -> InternalRuleDefReference:
    return InternalRuleDefReference(value=value)


def make_range(lower: int | str, upper: int | str) -> Range:
    return cast(
        Range,
        [
            lower if isinstance(lower, int) else ord(str(lower)),
            upper if isinstance(upper, int) else ord(str(upper)),
        ],
    )


def describe_build_rule_stack():
    def test_it_builds_rule_stack_for_a_single_path():
        assert build_rule_stack(
            [
                ichar([120]),
            ],
        ) == [
            [
                RuleChar(value=[120]),
                RuleEnd(),
            ],
        ]

    def test_it_builds_rule_stack_for_two_alternate_paths():
        result = build_rule_stack(
            [
                ichar([ord("x")]),
                ialt(),
                ichar([ord("y")]),
            ],
        )
        assert result == [
            [
                RuleChar(value=[ord("x")]),
                RuleEnd(),
            ],
            [
                RuleChar(value=[ord("y")]),
                RuleEnd(),
            ],
        ]

    def test_it_builds_rule_stack_for_three_alternate_paths():
        assert build_rule_stack(
            [
                ichar([ord("x")]),
                ialt(),
                ichar([ord("y")]),
                ialt(),
                ichar([ord("z")]),
            ],
        ) == [
            [
                RuleChar(value=[ord("x")]),
                RuleEnd(),
            ],
            [
                RuleChar(value=[ord("y")]),
                RuleEnd(),
            ],
            [
                RuleChar(value=[ord("z")]),
                RuleEnd(),
            ],
        ]

    def test_it_builds_rule_stack_for_char_not():
        assert build_rule_stack(
            [
                ichar_not([ord("x")]),
                ialt(),
                ichar_not([ord("y")]),
                ialt(),
                ichar_not([ord("z")]),
            ],
        ) == [
            [
                RuleCharExclude(value=[ord("x")]),
                RuleEnd(),
            ],
            [
                RuleCharExclude(value=[ord("y")]),
                RuleEnd(),
            ],
            [
                RuleCharExclude(value=[ord("z")]),
                RuleEnd(),
            ],
        ]

    def test_it_builds_rule_stack_for_mixed_char_and_char_not():
        assert build_rule_stack(
            [
                ichar_not([ord("x")]),
                ialt(),
                ichar([ord("y")]),
                ialt(),
                ichar_not([ord("z")]),
            ],
        ) == [
            [
                RuleCharExclude(value=[ord("x")]),
                RuleEnd(),
            ],
            [
                RuleChar(value=[ord("y")]),
                RuleEnd(),
            ],
            [
                RuleCharExclude(value=[ord("z")]),
                RuleEnd(),
            ],
        ]

    def test_it_builds_rule_stack_for_char_not_with_two_characters_and_a_range():
        result = build_rule_stack(
            [
                ichar_not([ord("x")]),
                ichar_alt(ord("y")),
                ichar_alt(ord("z")),
                ichar_rng_upper(130),
            ],
        )
        assert result == [
            [
                RuleCharExclude(value=[120, 121, make_range(122, 130)]),
                RuleEnd(),
            ],
        ]

    def describe_ranges():
        @pytest.mark.parametrize(
            ("grammar", "input", "expected"),
            [
                (
                    "[a-z]",
                    [
                        ichar([ord("a")]),
                        ichar_rng_upper(ord("z")),
                        iend(),
                    ],
                    [
                        [
                            RuleChar(value=[make_range("a", "z")]),
                            RuleEnd(),
                        ],
                    ],
                ),
                (
                    "[a-zA-Z]",
                    [
                        ichar([ord("a")]),
                        ichar_rng_upper(ord("z")),
                        ichar_alt(ord("A")),
                        ichar_rng_upper(ord("Z")),
                        iend(),
                    ],
                    [
                        [
                            RuleChar(
                                value=[
                                    make_range("a", "z"),
                                    make_range("A", "Z"),
                                ],
                            ),
                            RuleEnd(),
                        ],
                    ],
                ),
                (
                    "[a-zA-Z0-9]",
                    [
                        ichar([ord("a")]),
                        ichar_rng_upper(ord("z")),
                        ichar_alt(ord("A")),
                        ichar_rng_upper(ord("Z")),
                        ichar_alt(ord("0")),
                        ichar_rng_upper(ord("9")),
                        iend(),
                    ],
                    [
                        [
                            RuleChar(
                                value=[
                                    make_range("a", "z"),
                                    make_range("A", "Z"),
                                    make_range("0", "9"),
                                ],
                            ),
                            RuleEnd(),
                        ],
                    ],
                ),
            ],
        )
        def test_it_builds_rule_stack_for_a_char_with_no_modifiers(
            grammar,
            input,
            expected,
        ):
            result = build_rule_stack(input)
            assert result == expected

    @pytest.mark.parametrize(
        ("grammar", "input", "expected"),
        [
            (
                "[a-z]?",
                [
                    ichar([ord("a")]),
                    ichar_rng_upper(ord("z")),
                    ialt(),
                    iend(),
                ],
                [
                    [
                        RuleChar(value=[make_range("a", "z")]),
                        RuleEnd(),
                    ],
                    [
                        RuleEnd(),
                    ],
                ],
            ),
            (
                "[a-zA-Z]?",
                [
                    ichar([ord("a")]),
                    ichar_rng_upper(ord("z")),
                    ichar_alt(ord("A")),
                    ichar_rng_upper(ord("Z")),
                    ialt(),
                    iend(),
                ],
                [
                    [
                        RuleChar(value=[make_range("a", "z"), make_range("A", "Z")]),
                        RuleEnd(),
                    ],
                    [
                        RuleEnd(),
                    ],
                ],
            ),
            (
                "[a-zA-Z0-9]?",
                [
                    ichar([ord("a")]),
                    ichar_rng_upper(ord("z")),
                    ichar_alt(ord("A")),
                    ichar_rng_upper(ord("Z")),
                    ichar_alt(ord("0")),
                    ichar_rng_upper(ord("9")),
                    ialt(),
                    iend(),
                ],
                [
                    [
                        RuleChar(
                            value=[
                                make_range("a", "z"),
                                make_range("A", "Z"),
                                make_range("0", "9"),
                            ],
                        ),
                        RuleEnd(),
                    ],
                    [
                        RuleEnd(),
                    ],
                ],
            ),
        ],
    )
    def test_it_builds_rule_stack_for_a_char_with_question_mark_modifier(
        grammar,
        input,
        expected,
    ):
        assert build_rule_stack(input) == expected

    @pytest.mark.parametrize(
        ("grammar", "input", "expected"),
        [
            (
                "[a-z]+",
                [
                    ichar([ord("a")]),
                    ichar_rng_upper(ord("z")),
                    iref(1),
                    ialt(),
                    ichar([ord("a")]),
                    ichar_rng_upper(ord("z")),
                    iend(),
                ],
                [
                    [
                        RuleChar(value=[make_range("a", "z")]),
                        RuleRef(1),
                        RuleEnd(),
                    ],
                    [
                        RuleChar(value=[make_range("a", "z")]),
                        RuleEnd(),
                    ],
                ],
            ),
            (
                "[a-zA-Z]+",
                [
                    ichar([ord("a")]),
                    ichar_rng_upper(ord("z")),
                    ichar_alt(ord("A")),
                    ichar_rng_upper(ord("Z")),
                    iref(1),
                    ialt(),
                    ichar([ord("a")]),
                    ichar_rng_upper(ord("z")),
                    ichar_alt(ord("A")),
                    ichar_rng_upper(ord("Z")),
                    iend(),
                ],
                [
                    [
                        RuleChar(value=[make_range("a", "z"), make_range("A", "Z")]),
                        RuleRef(1),
                        RuleEnd(),
                    ],
                    [
                        RuleChar(value=[make_range("a", "z"), make_range("A", "Z")]),
                        RuleEnd(),
                    ],
                ],
            ),
            (
                "[a-zA-Z0-9]+",
                [
                    ichar([ord("a")]),
                    ichar_rng_upper(ord("z")),
                    ichar_alt(ord("A")),
                    ichar_rng_upper(ord("Z")),
                    ichar_alt(ord("0")),
                    ichar_rng_upper(ord("9")),
                    iref(1),
                    ialt(),
                    ichar([ord("a")]),
                    ichar_rng_upper(ord("z")),
                    ichar_alt(ord("A")),
                    ichar_rng_upper(ord("Z")),
                    ichar_alt(ord("0")),
                    ichar_rng_upper(ord("9")),
                    iend(),
                ],
                [
                    [
                        RuleChar(
                            value=[
                                make_range("a", "z"),
                                make_range("A", "Z"),
                                make_range("0", "9"),
                            ],
                        ),
                        RuleRef(1),
                        RuleEnd(),
                    ],
                    [
                        RuleChar(
                            value=[
                                make_range("a", "z"),
                                make_range("A", "Z"),
                                make_range("0", "9"),
                            ],
                        ),
                        RuleEnd(),
                    ],
                ],
            ),
        ],
    )
    def test_it_builds_rule_stack_for_a_char_with_plus_modifier(
        grammar,
        input,
        expected,
    ):
        result = build_rule_stack(input)
        assert result == expected

    @pytest.mark.parametrize(
        ("grammar", "input", "expected"),
        [
            (
                "[a-z]*",
                [
                    ichar([ord("a")]),
                    ichar_rng_upper(ord("z")),
                    iref(1),
                    ialt(),
                    iend(),
                ],
                [
                    [
                        RuleChar(value=[make_range("a", "z")]),
                        RuleRef(1),
                        RuleEnd(),
                    ],
                    [
                        RuleEnd(),
                    ],
                ],
            ),
            (
                "[a-zA-Z]*",
                [
                    ichar([ord("a")]),
                    ichar_rng_upper(ord("z")),
                    ichar_alt(ord("A")),
                    ichar_rng_upper(ord("Z")),
                    iref(1),
                    ialt(),
                    iend(),
                ],
                [
                    [
                        RuleChar(
                            value=[
                                make_range("a", "z"),
                                make_range("A", "Z"),
                            ],
                        ),
                        RuleRef(1),
                        RuleEnd(),
                    ],
                    [
                        RuleEnd(),
                    ],
                ],
            ),
            (
                "[a-zA-Z0-9]*",
                [
                    ichar([ord("a")]),
                    ichar_rng_upper(ord("z")),
                    ichar_alt(ord("A")),
                    ichar_rng_upper(ord("Z")),
                    ichar_alt(ord("0")),
                    ichar_rng_upper(ord("9")),
                    iref(1),
                    ialt(),
                    iend(),
                ],
                [
                    [
                        RuleChar(
                            value=[
                                make_range("a", "z"),
                                make_range("A", "Z"),
                                make_range("0", "9"),
                            ],
                        ),
                        RuleRef(1),
                        RuleEnd(),
                    ],
                    [
                        RuleEnd(),
                    ],
                ],
            ),
        ],
    )
    def test_it_builds_rule_stack_for_a_char_with_asterisk_modifier(
        grammar,
        input,
        expected,
    ):
        result = build_rule_stack(input)
        assert result == expected

    def test_char_with_range():
        input: list[InternalRuleDef] = [
            ichar([ord("a")]),
            ichar_rng_upper(ord("z")),
            ichar_alt(ord("A")),
            ichar_rng_upper(ord("Z")),
            ichar_alt(ord("_")),
            iend(),
        ]

        assert build_rule_stack(input) == [
            [
                RuleChar(
                    value=[
                        make_range("a", "z"),
                        make_range("A", "Z"),
                        ord("_"),
                    ],
                ),
                RuleEnd(),
            ],
        ]

    def test_it_builds_rule_stack_for_situation_root_ws_plus_newline_ws_star():
        input: list[InternalRuleDef] = [
            ichar([32]),
            ichar_alt(92),
            ichar_alt(110),
            iref(4),
            ialt(),
            iend(),
        ]

        expected = [
            [
                RuleChar(value=[32, 92, 110]),
                RuleRef(4),
                RuleEnd(),
            ],
            [
                RuleEnd(),
            ],
        ]

        assert build_rule_stack(input) == expected

    def test_it_builds_rule_stack_for_situation_root_char_plus_char_range():
        input: list[InternalRuleDef] = [
            ichar([ord("a")]),
            ichar_rng_upper(ord("z")),
            ichar_alt(ord("A")),
            ichar_rng_upper(ord("Z")),
            iref(1),
            ialt(),
            ichar([ord("a")]),
            ichar_rng_upper(ord("z")),
            ichar_alt(ord("A")),
            ichar_rng_upper(ord("Z")),
            iend(),
        ]

        expected = [
            [
                RuleChar(
                    value=[
                        make_range("a", "z"),
                        make_range("A", "Z"),
                    ],
                ),
                RuleRef(1),
                RuleEnd(),
            ],
            [
                RuleChar(
                    value=[
                        make_range("a", "z"),
                        make_range("A", "Z"),
                    ],
                ),
                RuleEnd(),
            ],
        ]

        assert build_rule_stack(input) == expected
