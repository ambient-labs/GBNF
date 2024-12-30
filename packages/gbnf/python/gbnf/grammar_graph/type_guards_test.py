from __future__ import annotations

from typing import TYPE_CHECKING

import pytest

from .grammar_graph_types import (
    # Range,
    # RuleType,
    RuleChar,
    RuleCharExclude,
    RuleEnd,
    # UnresolvedRule,
)
from .graph_node import GraphNode
from .graph_pointer import GraphPointer
from .rule_ref import RuleRef

if TYPE_CHECKING:
    # from .graph_pointer import GraphPointer
    pass

from .type_guards import (
    is_graph_pointer_rule_char,
    is_graph_pointer_rule_char_exclude,
    is_graph_pointer_rule_end,
    is_graph_pointer_rule_ref,
    is_range,
    is_rule,
    is_rule_char,
    is_rule_char_exclude,
    is_rule_end,
    # is_rule_type,
    is_rule_ref,
)


def describe_rule_type_guards():
    def describe_is_graph_pointer_rule_ref():
        def test_it_returns_true():
            node = GraphNode(RuleRef(1), {"stackId": 1, "pathId": 2, "stepId": 3})
            pointer = GraphPointer(node)
            assert is_graph_pointer_rule_ref(pointer)

        def test_it_returns_false():
            node = GraphNode(RuleEnd(), {"stackId": 1, "pathId": 2, "stepId": 3})
            pointer = GraphPointer(node)
            assert not is_graph_pointer_rule_ref(pointer)

    def describe_is_graph_pointer_rule_end():
        def test_it_returns_false():
            node = GraphNode(RuleRef(1), {"stackId": 1, "pathId": 2, "stepId": 3})
            pointer = GraphPointer(node)
            assert not is_graph_pointer_rule_end(pointer)

        def test_it_returns_true():
            node = GraphNode(RuleEnd(), {"stackId": 1, "pathId": 2, "stepId": 3})
            pointer = GraphPointer(node)
            assert is_graph_pointer_rule_end(pointer)

    def describe_is_graph_pointer_rule_char():
        def test_it_returns_true():
            node = GraphNode(
                RuleChar(value=[97]), {"stackId": 1, "pathId": 2, "stepId": 3},
            )
            pointer = GraphPointer(node)
            assert is_graph_pointer_rule_char(pointer)

        def test_it_returns_false():
            node = GraphNode(RuleEnd(), {"stackId": 1, "pathId": 2, "stepId": 3})
            pointer = GraphPointer(node)
            assert not is_graph_pointer_rule_char(pointer)

    def describe_is_graph_pointer_rule_char_exclude():
        def test_it_returns_true():
            node = GraphNode(
                RuleCharExclude(value=[97]),
                {"stackId": 1, "pathId": 2, "stepId": 3},
            )
            pointer = GraphPointer(node)
            assert is_graph_pointer_rule_char_exclude(pointer)

        def test_it_returns_false():
            node = GraphNode(
                RuleChar(value=[97]),
                {"stackId": 1, "pathId": 2, "stepId": 3},
            )
            pointer = GraphPointer(node)
            assert not is_graph_pointer_rule_char_exclude(pointer)

    def describe_is_rule():
        def test_it_returns_false_for_null():
            assert not is_rule(None)

        def test_it_returns_false_for_a_non_rule():
            assert not is_rule({"type": "invalid", "value": []})

        def test_it_returns_true_for_valid_rule_objects():
            ruleChar: RuleChar = RuleChar(value=[65, (66, 67)])
            assert is_rule(ruleChar)

    # def describe_is_rule_type():
    #     def test_it_returns_true_for_valid_rule_types():
    #         assert is_rule_type(RuleType.CHAR)
    #         assert is_rule_type(RuleType.END)

    #     def test_it_returns_false_for_invalid_rule_types():
    #         assert is_rule_type("not_a_rule_type")

    def describe_is_rule_ref():
        def test_it_returns_true_for_valid_rule_refs():
            ruleRef = RuleRef(1)
            assert is_rule_ref(ruleRef)

        def test_it_returns_false_for_invalid_rule_refs():
            assert not is_rule_ref(RuleChar(value=[65]))

    def describe_is_rule_end():
        def test_it_returns_true_for_valid_rule_ends():
            assert is_rule_end(RuleEnd())

        def test_it_returns_false_for_invalid_rule_ends():
            assert not is_rule_end(RuleChar(value=[65]))

    def describe_is_rule_char():
        def test_it_returns_true_for_valid_rule_chars():
            assert is_rule_char(RuleChar(value=[65]))

        def test_it_returns_false_for_invalid_rule_chars():
            assert not is_rule_char(RuleCharExclude(value=[65]))

    def describe_is_rule_char_exclude():
        def test_it_returns_true_for_valid_rule_chars():
            assert is_rule_char_exclude(RuleCharExclude(value=[65]))

        def test_it_returns_false_for_invalid_rule_chars():
            assert not is_rule_char_exclude(RuleChar(value=[65]))

    def describe_is_range():
        def test_it_returns_true_for_valid_ranges():
            assert is_range([1, 10])

        @pytest.mark.parametrize("value", [[1, "10"], [1], 5])
        def test_it_returns_false_for_invalid_ranges(value):
            assert not is_range(value)
