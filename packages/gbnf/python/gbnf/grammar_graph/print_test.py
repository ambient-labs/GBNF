from __future__ import annotations

from unittest.mock import patch

import pytest

from .grammar_graph_types import RuleChar
from .graph_node import GraphNode
from .print import print_graph_node, print_graph_pointer
from .rule_ref import RuleRef


@pytest.fixture(autouse=True)
def mock_get_parent_stack_id():
    with patch("gbnf.grammar_graph.print.get_parent_stack_id") as mock:
        yield mock


COLORS = {
    "\x1b[34m": "BLUE",
    "\x1b[36m": "CYAN",
    "\x1b[32m": "GREEN",
    "\x1b[31m": "RED",
    "\x1b[90m": "GRAY",
    "\x1b[33m": "YELLOW",
}


def mock_colorize(text, color):
    if color not in COLORS:
        raise ValueError(f"Invalid color: {color}")
    return f"[{COLORS[color]}]:{text}"


class MockNode:
    def __init__(self, id, rule, next: GraphNode | None = None):
        self.id = id
        self.rule = rule
        self.next = next
        self.print = lambda _opts: f"Node({id})"


def create_mock_node(id, rule, next: GraphNode | None = None):
    return MockNode(id, rule, next)


def create_mock_graph_pointer(node: MockNode):
    return {
        "node": node,
        "parent": None,
        "print": lambda _opts: f"Pointer to {node.id}",
    }


def describe_print():
    def describe_print_graph_pointer():
        def test_it_prints_graph_pointer_details_correctly(mock_get_parent_stack_id):
            mock_node = create_mock_node(1, RuleRef(100))
            mock_pointer = create_mock_graph_pointer(mock_node)
            mock_get_parent_stack_id.return_value = "foo"
            result = print_graph_pointer(mock_pointer)(
                {"colorize": mock_colorize, "pointers": set(), "show_position": False},
            )
            assert result == "[RED]:*foo"

    def describe_print_graph_node():
        def test_it_prints_graph_node_with_a_character_rule():
            rule_char = RuleChar(value=[65])
            mock_node = create_mock_node(1, rule_char)
            result = print_graph_node(mock_node)(
                {"colorize": mock_colorize, "show_position": False, "pointers": set()},
            )
            assert result == "[GRAY]:[[YELLOW]:A[GRAY]:]"

        def test_it_prints_graph_node_with_a_rule_reference():
            rule_ref = RuleRef(200)
            mock_node = create_mock_node(1, rule_ref)
            result = print_graph_node(mock_node)(
                {"colorize": mock_colorize, "show_position": True, "pointers": set()},
            )
            assert result == "[BLUE]:{[GRAY]:1[BLUE]:}[GRAY]:Ref([GREEN]:200[GRAY]:)"
