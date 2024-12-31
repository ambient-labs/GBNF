from __future__ import annotations

from unittest.mock import patch

import pytest

from .grammar_graph_types import (
    RuleChar,
    RuleCharExclude,
    RuleEnd,
)
from .graph_node import GraphNode
from .graph_pointer import GraphPointer
from .type_guards import (
    is_graph_pointer_rule_char,
    is_graph_pointer_rule_end,
)


@pytest.fixture(autouse=True)
def mock_is_graph_pointer_rule_ref():
    with patch(
        "gbnf.grammar_graph.graph_pointer.is_graph_pointer_rule_ref", return_value=False,
    ) as mock:
        yield mock


@pytest.fixture(autouse=True)
def mock_is_graph_pointer_rule_end():
    with patch(
        "gbnf.grammar_graph.graph_pointer.is_graph_pointer_rule_end", return_value=False,
    ) as mock:
        yield mock


@pytest.fixture(autouse=True)
def mock_is_graph_pointer_rule_char():
    with patch(
        "gbnf.grammar_graph.graph_pointer.is_graph_pointer_rule_char",
        return_value=False,
    ) as mock:
        yield mock


@pytest.fixture(autouse=True)
def mock_is_graph_pointer_rule_char_exclude():
    with patch(
        "gbnf.grammar_graph.graph_pointer.is_graph_pointer_rule_char_exclude",
        return_value=False,
    ) as mock:
        yield mock


def describe_graph_pointer():
    def test_constructor():
        node = GraphNode(RuleEnd(), {"stackId": 1, "pathId": 2, "stepId": 3})
        pointer = GraphPointer(node)
        assert pointer.node == node
        assert pointer.id == "1,2,3"
        assert pointer.parent is None

    def test_it_raises_error_if_node_is_undefined():
        with pytest.raises(ValueError, match="Node is undefined"):
            GraphPointer(None)

    def test_it_initializes_correctly_with_node_and_parent():
        parent_node = GraphNode(
            RuleChar(value=[97]), {"stackId": 1, "pathId": 2, "stepId": 3},
        )
        child_node = GraphNode(
            RuleChar(value=[98]), {"stackId": 4, "pathId": 5, "stepId": 6},
        )
        parent_pointer = GraphPointer(parent_node)
        child_pointer = GraphPointer(child_node, parent_pointer)
        assert child_pointer.parent == parent_pointer
        assert child_pointer.id == "1,2,3-4,5,6"

    def describe_resolve():
        def test_it_raises_error_on_unknown_rule_types():
            node = GraphNode(
                {type: "UNKNOWN_RULE_TYPE"}, {"stackId": 1, "pathId": 2, "stepId": 3},
            )
            pointer = GraphPointer(node)
            with pytest.raises(ValueError, match="Unknown rule"):
                list(pointer.resolve())

        def test_it_yields_a_char_rule(mock_is_graph_pointer_rule_char):
            mock_is_graph_pointer_rule_char.return_value = True
            rule = RuleChar(value=[97])
            node = GraphNode(rule, {"stackId": 1, "pathId": 2, "stepId": 3})
            pointer = GraphPointer(node)
            assert list(pointer.resolve()) == [pointer]

        def test_it_yields_a_char_excluded_rule(
            mock_is_graph_pointer_rule_char_exclude,
        ):
            mock_is_graph_pointer_rule_char_exclude.return_value = True
            rule = RuleCharExclude(value=[97])
            node = GraphNode(rule, {"stackId": 1, "pathId": 2, "stepId": 3})
            pointer = GraphPointer(node)
            assert list(pointer.resolve()) == [pointer]

        def test_it_yields_an_end_rule_without_a_parent(mock_is_graph_pointer_rule_end):
            mock_is_graph_pointer_rule_end.return_value = True
            rule = RuleEnd()
            node = GraphNode(rule, {"stackId": 1, "pathId": 2, "stepId": 3})
            pointer = GraphPointer(node)
            assert list(pointer.resolve()) == [pointer]

        def test_it_yields_an_end_rule_with_a_parent(mock_is_graph_pointer_rule_end):
            mock_is_graph_pointer_rule_end.return_value = True
            rule = RuleEnd()
            parent_node = GraphNode(rule, {"stackId": 2, "pathId": 1, "stepId": 1})
            parent_pointer = GraphPointer(parent_node)
            child_node = GraphNode(rule, {"stackId": 1, "pathId": 1, "stepId": 1})
            child_pointer = GraphPointer(child_node, parent_pointer)
            assert list(child_pointer.resolve()) == [parent_pointer]

        def test_it_yields_an_end_rule_with_a_grandparent(
            mock_is_graph_pointer_rule_end,
        ):
            mock_is_graph_pointer_rule_end.return_value = True
            rule = RuleEnd()
            grandparent_node = GraphNode(rule, {"stackId": 2, "pathId": 1, "stepId": 1})
            grandparent_pointer = GraphPointer(grandparent_node)
            parent_node = GraphNode(rule, {"stackId": 2, "pathId": 1, "stepId": 1})
            parent_pointer = GraphPointer(parent_node, grandparent_pointer)
            child_node = GraphNode(rule, {"stackId": 1, "pathId": 1, "stepId": 1})
            child_pointer = GraphPointer(child_node, parent_pointer)
            assert list(child_pointer.resolve()) == [grandparent_pointer]

        def test_it_yields_an_end_rule_with_a_parent_that_is_not_an_end_with_a_grandparent(
            mock_is_graph_pointer_rule_end,
            mock_is_graph_pointer_rule_char,
        ):
            mock_is_graph_pointer_rule_end.side_effect = is_graph_pointer_rule_end
            mock_is_graph_pointer_rule_char.side_effect = is_graph_pointer_rule_char
            rule = RuleEnd()
            grandparent_node = GraphNode(rule, {"stackId": 2, "pathId": 1, "stepId": 1})
            grandparent_pointer = GraphPointer(grandparent_node)
            parent_node = GraphNode(
                RuleChar(value=[97]), {"stackId": 2, "pathId": 1, "stepId": 1},
            )
            parent_pointer = GraphPointer(parent_node, grandparent_pointer)
            child_node = GraphNode(rule, {"stackId": 1, "pathId": 1, "stepId": 1})
            child_pointer = GraphPointer(child_node, parent_pointer)
            assert list(child_pointer.resolve()) == [parent_pointer]
