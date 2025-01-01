from __future__ import annotations

from typing import TYPE_CHECKING, Generic, TypeVar

from .grammar_graph_types import PrintOpts, UnresolvedRule
from .graph_node import GraphNode
from .print import print_graph_pointer
from .type_guards import (
    is_graph_pointer_rule_char,
    is_graph_pointer_rule_char_exclude,
    is_graph_pointer_rule_end,
    is_graph_pointer_rule_ref,
    is_rule_end,
)

if TYPE_CHECKING:
    from .graph_node import GraphNode

T = TypeVar("T", bound=UnresolvedRule)

GraphPointerKey = str


class GraphPointer(Generic[T]):
    node: GraphNode[T]
    parent: GraphPointer | None = None
    id: str
    __valid__: bool | None = None

    def __init__(self, node: GraphNode[T], parent: GraphPointer | None = None):
        if node is None:
            raise ValueError("Node is undefined")
        self.node = node
        self.parent = parent
        self.id = f"{parent.id}-{node.id}" if parent else node.id

    @property
    def rule(self) -> T:
        return self.node.rule

    @property
    def valid(self) -> bool | None:
        return self.__valid__

    @valid.setter
    def valid(self, valid: bool) -> None:
        self.__valid__ = valid

    def print(self, opts: PrintOpts):
        return print_graph_pointer(self)(opts)

    def resolve(self, resolved=False):
        """
        Resolve the graph pointer.

        Args:
            resolved (bool, optional): Whether the pointer has already been resolved. Defaults to False.

        Yields:
            ResolvedGraphPointer: The resolved graph pointer.
        """
        if is_graph_pointer_rule_ref(self):
            if resolved:
                if not self.node.next:
                    raise ValueError(f"No next node: {self.node}")
                yield from GraphPointer(self.node.next, self.parent).resolve()
            else:
                for node in self.node.rule.nodes:
                    yield from GraphPointer(node, self).resolve()
        elif is_graph_pointer_rule_end(self):
            if not self.parent:
                yield self
            else:
                yield from self.parent.resolve(True)
        elif is_graph_pointer_rule_char(self) or is_graph_pointer_rule_char_exclude(
            self,
        ):
            yield self
        else:
            raise ValueError(f"Unknown rule: {self.node.rule}")

    def fetch_next(self):
        """
        Fetch the next resolved graph pointer.

        Yields:
            ResolvedGraphPointer: The next resolved graph pointer.
        """
        # If this pointer is invalid, then we don't return any new pointers
        if not self.valid:
            return

        # If this pointer is an end node, we return the parent's next node.
        # If no parent exists, we return nothing, since it's the end of the line.
        if is_rule_end(self.node.rule):
            if self.parent:
                yield from self.parent.fetch_next()
        else:
            if not self.node.next:
                raise ValueError(f"No next node: {self.node}")
            pointer = GraphPointer(self.node.next, self.parent)
            yield from pointer.resolve()
