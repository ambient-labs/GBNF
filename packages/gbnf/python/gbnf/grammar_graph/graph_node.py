from __future__ import annotations
from typing import Optional, TypedDict

from .colorize import colorize

# from .print import printGraphNode
# from .rule_ref import RuleRef
from .grammar_graph_types import UnresolvedRule, PrintOpts


class GraphNodeMeta(TypedDict):
    stackId: int
    pathId: int
    stepId: int


# type GraphNodeRuleRef = GraphNode<RuleRef>;


class GraphNode:
    rule: UnresolvedRule
    next: Optional["GraphNode"]
    meta: GraphNodeMeta
    __id__: Optional[str]

    def __init__(
        self,
        rule: UnresolvedRule,
        meta: GraphNodeMeta,
        next: Optional[GraphNode] = None,
    ):
        self.rule = rule
        if meta is None:
            raise ValueError("Meta is undefined")
        self.meta = meta
        self.next = next

    @property
    def id(self) -> str:
        if self.__id__ is None:
            self.__id__ = (
                f"{self.meta['stackId']},{self.meta['pathId']},{self.meta['stepId']}"
            )
        return self.__id__

    def print(self, opts: PrintOpts) -> str:
        # return printGraphNode(self, opts)
        return "GraphNode"
