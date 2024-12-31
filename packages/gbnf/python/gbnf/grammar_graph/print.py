from __future__ import annotations

from collections.abc import Callable
from typing import TYPE_CHECKING

from .colorize import Color
from .get_parent_stack_id import get_parent_stack_id

if TYPE_CHECKING:
    from .grammar_graph_types import PrintOpts
    from .graph_node import GraphNode
    from .graph_pointer import GraphPointer

from .type_guards import is_range, is_rule_char, is_rule_ref


def print_graph_pointer(pointer: GraphPointer) -> Callable[[PrintOpts], str]:
    def print_graph_pointer_inner(opts: PrintOpts) -> str:
        col = opts["colorize"]
        return col(
            f"*{get_parent_stack_id(pointer, col)}",
            Color.RED,
        )

    return print_graph_pointer_inner


def print_graph_node(node: GraphNode) -> Callable[[PrintOpts], str]:
    def print_graph_node_inner(opts: PrintOpts) -> str:
        pointers = opts.get("pointers", set())
        col = opts["colorize"]
        show_position = opts.get("show_position", False)
        rule = node.rule
        parts: list[str] = []
        if show_position:
            parts.extend(
                [col("{", Color.BLUE), col(node.id, Color.GRAY), col("}", Color.BLUE)],
            )

        if is_rule_char(rule):
            parts.extend(
                [
                    col("[", Color.GRAY),
                    col(
                        "".join(
                            [
                                (
                                    "".join(
                                        [col(get_char(val), Color.YELLOW) for val in v],
                                    )
                                    if is_range(v)
                                    else get_char(v)
                                )
                                for v in rule.value
                            ],
                        ),
                        Color.YELLOW,
                    ),
                    col("]", Color.GRAY),
                ],
            )

        elif is_rule_ref(rule):
            parts.extend(
                [
                    col("Ref(", Color.GRAY),
                    col(rule.value, Color.GREEN),
                    col(")", Color.GRAY),
                ],
            )

        else:
            parts.append(col(rule.type, Color.YELLOW))

        if pointers:
            for pointer in pointers:
                pointer_parts: list[str] = []
                if pointer.node == node:
                    pointer_parts.append(pointer.print(opts))

                if len(pointer_parts) > 0:
                    parts.extend(
                        [
                            col("[", Color.GRAY),
                            col("".join(pointer_parts), Color.YELLOW),
                            col("]", Color.GRAY),
                        ],
                    )

        parts_to_return = [
            "".join(parts),
        ]
        if node.next:
            parts_to_return.append(node.next.print(opts))

        return col("-> ", Color.GRAY).join(parts_to_return)

    return print_graph_node_inner


def get_char(char_code: int) -> str:
    char = chr(char_code)
    if char == "\n":
        return "\\n"
    return char
