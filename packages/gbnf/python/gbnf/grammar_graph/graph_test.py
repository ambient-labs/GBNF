from __future__ import annotations

from unittest.mock import MagicMock

import pytest

from .grammar_graph_types import (
    RuleChar,
    RuleCharExclude,
    RuleEnd,
    RuleRef,
    UnresolvedRule,
)
from .graph import Graph
from .graph_node import GraphNode
from .graph_pointer import GraphPointer
from .pointers import Pointers


def describe_graph():
    grammar = "example-grammar"
    stackedRules: list[list[list[UnresolvedRule]]] = [
        [
            [RuleChar(value=[65, 66, 67])],
            [RuleChar(value=[68, 69, 70])],
        ],
        [
            [RuleChar(value=[71, 72, 73])],
            [RuleChar(value=[74, 75, 76])],
        ],
    ]
    root_id = 0

    def test_should_create_a_graph_instance():
        graph = Graph(grammar, stackedRules, root_id)
        assert isinstance(graph, Graph)
        assert graph.grammar == grammar

    def test_should_get_the_root_node():
        graph = Graph(grammar, stackedRules, root_id)
        root_node = graph.__get_root_node__(root_id)
        assert isinstance(root_node, dict)
        assert len(root_node) == 2

    def test_should_get_the_initial_pointers():
        graph = Graph(grammar, stackedRules, root_id)
        root_node = graph.__get_root_node__(root_id)
        assert isinstance(root_node, dict)
        assert len(root_node) == 2

    def test_should_print_the_graph():
        graph = Graph(grammar, stackedRules, root_id)
        printed_graph = graph.print(colors=True)
        assert isinstance(printed_graph, str)
        assert len(printed_graph) > 0

    def test_should_iterate_over_pointers():
        graph = Graph(grammar, stackedRules, root_id)
        mock_pointers = Pointers(
            *[
                GraphPointer(
                    node=GraphNode(rule=r, meta=MagicMock()),
                )
                for r in [
                    RuleChar(value=[65, 66, 67]),
                    RuleChar(value=[68, 69, 70]),
                    RuleChar(value=[71, 72, 73]),
                    RuleChar(value=[74, 75, 76]),
                    RuleCharExclude(value=[1]),
                    RuleEnd(),
                ]
            ],
        )

        result = list(graph.__iterate_over_pointers__(mock_pointers))
        assert len(result) == 6
        for rule, pointers in result:
            assert isinstance(rule, UnresolvedRule)
            assert isinstance(pointers, Pointers)
            assert len(pointers) >= 1
            for pointer in pointers:
                assert pointer in mock_pointers

    def test_should_raise_error_on_reference_rule():
        graph = Graph(grammar, stackedRules, root_id)
        mock_pointers = [
            GraphPointer(
                node=GraphNode(
                    rule=RuleRef(value=0),
                    meta=MagicMock(),
                ),
            ),
        ]

        with pytest.raises(
            ValueError,
            match="Encountered a reference rule in the graph",
        ) as exc_info:
            list(graph.__iterate_over_pointers__(mock_pointers))
        assert "Encountered a reference rule in the graph" in str(exc_info.value)
