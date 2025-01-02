from __future__ import annotations

from typing import TYPE_CHECKING
from unittest.mock import patch

import pytest

from .graph_node import GraphNode, GraphNodeMeta, PrintOpts
from .rule_ref import RuleRef

if TYPE_CHECKING:
    pass


@pytest.fixture(autouse=True)
def mock_print_graph_node():
    with patch(
        "gbnf.grammar_graph.graph_node.print_graph_node",
    ) as mock_print_graph_node:

        def mock_print_graph_node_inner(_opts: PrintOpts) -> str:
            return "mocked_response"

        mock_print_graph_node.return_value = mock_print_graph_node_inner
        yield mock_print_graph_node


def describe_graph_node():
    meta: GraphNodeMeta = {"stackId": 1, "pathId": 2, "stepId": 3}
    rule = RuleRef(42)

    def test_construct_with_rule_and_meta():
        node = GraphNode(rule, meta)
        assert node.rule == rule
        assert node.meta == meta

    def test_throw_if_meta_is_undefined():
        with pytest.raises(ValueError, match="Meta is undefined"):
            GraphNode(rule, None)

    def test_correctly_calculate_and_cache_its_id():
        node = GraphNode(rule, meta)
        assert node.id == "1,2,3"
        node.meta = {"stackId": 4, "pathId": 5, "stepId": 6}
        assert node.id == "1,2,3"

    def test_delegate_print_to_the_print_graph_node_function(mock_print_graph_node):
        node = GraphNode(rule, meta)
        opts: PrintOpts = {"colorize": lambda x, _y: str(x), "show_position": False}
        node.print(opts)

        mock_print_graph_node.assert_called_with(node)

    def test_handle_next_node_linkage():
        nextNode = GraphNode(RuleRef(43), meta)
        node = GraphNode(rule, meta, nextNode)
        assert node.next == nextNode
