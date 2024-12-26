from typing import Optional, Set

# import type { GraphNode, } from "./graph-node.js";
GraphNode = object


class RuleRef:
    __nodes__: Optional[Set[GraphNode]] = None
    value: int

    def __init__(self, value: int) -> None:
        self.value = value

    @property
    def nodes(self) -> Set[GraphNode]:
        if self.__nodes__ is None:
            raise ValueError("Nodes are not set")
        return self.__nodes__

    @nodes.setter
    def nodes(self, nodes: Set[GraphNode]) -> None:
        self.__nodes__ = nodes
