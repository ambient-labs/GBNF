from __future__ import annotations

from .grammar_graph_types import RuleChar, UnresolvedRule
from .graph import Graph


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
        root_node = graph.get_root_node(root_id)
        assert isinstance(root_node, dict)
        assert len(root_node) == 2

    def test_should_get_the_initial_pointers():
        graph = Graph(grammar, stackedRules, root_id)
        root_node = graph.get_root_node(root_id)
        assert isinstance(root_node, dict)
        assert len(root_node) == 2

    def test_should_print_the_graph():
        graph = Graph(grammar, stackedRules, root_id)
        printed_graph = graph.print(colors=True)
        assert isinstance(printed_graph, str)
        assert len(printed_graph) > 0
