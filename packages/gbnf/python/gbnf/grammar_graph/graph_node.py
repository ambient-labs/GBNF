from __future__ import annotations

from typing import Generic, TypedDict, TypeVar

from .grammar_graph_types import PrintOpts, UnresolvedRule

# from .print import printGraphNode
from .rule_ref import RuleRef


class GraphNodeMeta(TypedDict):
    stackId: int
    pathId: int
    stepId: int


T = TypeVar("T", bound=UnresolvedRule)


class GraphNode(Generic[T]):
    rule: T
    next: GraphNode | None
    meta: GraphNodeMeta
    __id__: str | None

    def __init__(
        self,
        rule: T,
        meta: GraphNodeMeta,
        next_node: GraphNode | None = None,
    ):
        self.rule = rule
        if meta is None:
            raise ValueError("Meta is undefined")
        self.meta = meta
        self.next = next_node

    @property
    def id(self) -> str:
        if self.__id__ is None:
            self.__id__ = (
                f"{self.meta['stackId']},{self.meta['pathId']},{self.meta['stepId']}"
            )
        return self.__id__

    def print(self, opts: PrintOpts) -> str:
        _ = opts
        # return printGraphNode(self, opts)
        return "GraphNode"


GraphNodeRuleRef = GraphNode[RuleRef]
