from __future__ import annotations

import json

from .colorize import Color
from .get_parent_stack_id import get_parent_stack_id
from .grammar_graph_types import RuleEnd
from .graph_node import GraphNode
from .graph_pointer import GraphPointer


def s(str: str) -> str:
    return json.dumps(str)


def mock_colorize(text: str | int, color: str) -> str:
    return f"[{s(color)}]:{text}"


red = s(Color.RED)
gray = s(Color.GRAY)


def create_mock_pointer(
    stack_id: int,
    path_id: int,
    step_id: int,
    parent: GraphPointer | None = None,
) -> GraphPointer:
    return GraphPointer(
        GraphNode(
            RuleEnd(),
            {
                "stackId": stack_id,
                "pathId": path_id,
                "stepId": step_id,
            },
        ),
        parent,
    )


def describe_get_parent_stack_id():
    def test_returns_an_empty_string_if_no_parents():
        pointer = create_mock_pointer(1, 1, 1)
        result = get_parent_stack_id(pointer, mock_colorize)
        assert result == ""

    def test_returns_a_single_parent_id_colored_correctly():
        parent_pointer = create_mock_pointer(1, 1, 1)
        pointer = create_mock_pointer(2, 2, 2, parent_pointer)
        result = get_parent_stack_id(pointer, mock_colorize)
        assert result == f"[{red}]:1,1,1"

    def test_returns_multiple_parent_ids_separated_by_colored_arrows():
        grandparent_pointer = create_mock_pointer(0, 0, 0)
        parent_pointer = create_mock_pointer(1, 1, 1, grandparent_pointer)
        pointer = create_mock_pointer(2, 2, 2, parent_pointer)
        result = get_parent_stack_id(pointer, mock_colorize)
        assert result == f"[{red}]:1,1,1[{gray}]:<-[{red}]:0,0,0"

    def test_handles_deep_nesting_of_pointers():
        great_grandparent_pointer = create_mock_pointer(0, 0, 0)
        grandparent_pointer = create_mock_pointer(1, 1, 1, great_grandparent_pointer)
        parent_pointer = create_mock_pointer(2, 2, 2, grandparent_pointer)
        pointer = create_mock_pointer(3, 3, 3, parent_pointer)
        result = get_parent_stack_id(pointer, mock_colorize)
        expectedOutput = (
            f"[{red}]:2,2,2[{gray}]:<-[{red}]:1,1,1[{gray}]:<-[{red}]:0,0,0"
        )
        assert result == expectedOutput
