from __future__ import annotations

from collections.abc import Callable
from typing import TYPE_CHECKING

from .colorize import Color

if TYPE_CHECKING:
    from .graph_pointer import GraphPointer


def get_parent_stack_id(
    pointer: GraphPointer,
    col: Callable[[str | int, str], str],
) -> str:
    stack_ids: list[str] = []
    parent: GraphPointer | None = pointer.parent
    while parent:
        stack_ids.append(
            f"{parent.node.meta['stackId']},{parent.node.meta['pathId']},{parent.node.meta['stepId']}",
        )
        parent = parent.parent
    arrow = col("<-", Color.GRAY)
    return arrow.join([col(stack_id, Color.RED) for stack_id in stack_ids])
