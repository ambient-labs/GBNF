
# import type { GraphNode, } from "./graph-node.js";
GraphNode = object


class RuleRef:
    __nodes__: set[GraphNode] | None = None
    value: int

    def __init__(self, value: int) -> None:
        self.value = value

    @property
    def nodes(self) -> set[GraphNode]:
        if self.__nodes__ is None:
            raise ValueError("Nodes are not set")
        return self.__nodes__

    @nodes.setter
    def nodes(self, nodes: set[GraphNode]) -> None:
        self.__nodes__ = nodes
