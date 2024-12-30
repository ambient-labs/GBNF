from __future__ import annotations

from typing import TYPE_CHECKING, Generic, TypeVar


if TYPE_CHECKING:
    from .graph_node import GraphNode
from .grammar_graph_types import UnresolvedRule

T = TypeVar("T", bound=UnresolvedRule)


class GraphPointer(Generic[T]):
    node: GraphNode[T]
    parent: GraphPointer | None = None
    id: str

    def __init__(self, node: GraphNode[T], parent: GraphPointer | None = None):
        if node is None:
            raise ValueError("Node is undefined")
        self.node = node
        self.parent = parent
        self.id = parent.id if parent else node.id

    @property
    def rule(self) -> T:
        return self.node.rule
