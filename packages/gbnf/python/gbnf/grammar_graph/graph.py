from __future__ import annotations

from collections.abc import Iterable
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .grammar_graph_types import (
        Pointers,
        ResolvedGraphPointer,
        UnresolvedRule,
        ValidInput,
    )


from ..utils.errors import InputParseError
from ..utils.is_point_in_range import is_point_in_range
from .colorize import colorize
from .get_input_as_code_points import get_input_as_code_points
from .get_serialized_rule_key import get_serialized_rule_key
from .graph_node import GraphNode
from .graph_pointer import GraphPointer
from .rule_ref import RuleRef
from .type_guards import (
    is_range,
    is_rule_char,
    is_rule_char_exclude,
    is_rule_end,
    is_rule_ref,
)

RootNode = dict[int, GraphNode]


def make_pointers() -> Pointers:
    """
    Create a set of pointers with a custom comparison based on pointer ID.
    """
    return set()


class Graph:
    __roots__: dict[int, RootNode]
    grammar: str
    __rootNode__: RootNode | None
    previous_code_points: list[int]

    def __init__(
        self,
        grammar: str,
        stacked_rules: list[list[list[UnresolvedRule]]],
        root_id: int,
    ):
        self.__roots__ = {}
        self.grammar = grammar
        self.previous_code_points = []
        rule_refs: list[RuleRef] = []
        unique_rules: dict[str, UnresolvedRule] = {}

        for stack_id in range(len(stacked_rules)):
            stack = stacked_rules[stack_id]
            nodes: dict[int, GraphNode] = {}
            for path_id in range(len(stack)):
                path = stack[path_id]
                node: GraphNode | None = None
                for step_id in range(len(path) - 1, -1, -1):
                    next_node: GraphNode | None = node
                    rule = stack[path_id][step_id]
                    unique_rules[get_serialized_rule_key(rule)] = rule
                    if is_rule_ref(rule):
                        rule_refs.append(rule)
                    # rules coming in may be identical but have different references.
                    # here, we ensure we always use the same reference for an identical rule.
                    # this makes future comparisons easier.
                    unique_rule = unique_rules.get(get_serialized_rule_key(rule))
                    if unique_rule is None:
                        raise ValueError("Could not get unique rule")
                    node = GraphNode(
                        unique_rule,
                        {
                            "stackId": stack_id,
                            "pathId": path_id,
                            "stepId": step_id,
                        },
                        next_node,
                    )

                if node is None:
                    raise ValueError("Could not get node")
                nodes[path_id] = node
            self.__roots__[stack_id] = nodes

        root_node = self.__roots__.get(root_id)
        if root_node is None:
            raise ValueError(f"Root node not found for value: {root_id}")
        self.__rootNode__ = root_node

        for rule_ref in rule_refs:
            referenced_nodes = set()
            referenced_nodes.update(self.__get_root_node__(rule_ref.value).values())
            rule_ref.nodes = referenced_nodes

    def __get_root_node__(self, value: int) -> RootNode:
        root_node = self.__roots__.get(value)
        if root_node is None:
            raise ValueError(f"Root node not found for value: {value}")
        return root_node

    def __get_initial_pointers__(self) -> Pointers:
        pointers = make_pointers()

        root_node = self.__rootNode__
        if root_node is None:
            raise ValueError("Root node is not defined")

        for node, parent in self.__fetch_nodes_for_root_node__(root_node):
            pointer = GraphPointer(node, parent)
            for resolvedPointer in self.__resolve_pointer__(pointer):
                pointers.add(resolvedPointer)
        return pointers

    def __set_valid__(self, pointers: Pointers, valid: bool):
        for pointer in pointers:
            pointer.valid = valid

    def __parse__(self, current_pointers: Pointers, code_point: int) -> Pointers:
        for rule, rule_pointers in self.__iterate_over_pointers__(current_pointers):
            if is_rule_char(rule):
                valid = False
                for possible_code_point in rule.value:
                    if valid is True:
                        pass
                    elif is_range(possible_code_point):
                        if is_point_in_range(code_point, possible_code_point):
                            valid = True
                    elif code_point == possible_code_point:
                        valid = True
                self.__set_valid__(rule_pointers, valid)

            elif is_rule_char_exclude(rule):
                valid = True
                for possible_code_point in rule.value:
                    if valid is False:
                        pass
                    elif is_range(possible_code_point):
                        if is_point_in_range(code_point, possible_code_point):
                            valid = False
                    else:
                        if code_point == possible_code_point:
                            valid = False
                self.__set_valid__(rule_pointers, valid)

            elif not is_rule_end(rule):
                raise ValueError(f"Unsupported rule: {rule}")

        # a pointer's id is the sum of its node's id and its parent's id chain.
        # if two pointers share the same id, it means they point to the same node and have identical parent chains.
        # for the purposes of walking the graph, we only need to keep one of them.
        next_pointers = make_pointers()
        for current_pointer in current_pointers:
            for unresolved_next_pointer in current_pointer.fetch_next():
                for resolved_next_pointer in self.__resolve_pointer__(
                    unresolved_next_pointer,
                ):
                    next_pointers.add(resolved_next_pointer)
        return next_pointers

    def __resolve_pointer__(
        self,
        unresolved_pointer: GraphPointer,
    ) -> Iterable[ResolvedGraphPointer]:
        for resolved_pointer in unresolved_pointer.resolve():
            if is_rule_ref(resolved_pointer.node.rule):
                raise ValueError(
                    "Encountered a reference rule when building pointers to the graph",
                )
            if (
                is_rule_end(resolved_pointer.node.rule)
                and resolved_pointer.parent is not None
            ):
                raise ValueError(
                    "Encountered an ending rule with a parent when building pointers to the graph",
                )
            yield resolved_pointer

    def add(self, src: ValidInput, pointers: Pointers | None = None) -> Pointers:
        if not isinstance(src, str):
            raise ValueError("src must be a string in graph.add")
        pointers = pointers or self.__get_initial_pointers__()

        code_points = get_input_as_code_points(src)
        for code_point in code_points:
            if type(code_point) is not int:
                raise ValueError("code_point must be an integer!")

        for code_point_pos in range(len(code_points)):
            code_point = code_points[code_point_pos]
            pointers = self.__parse__(pointers, code_point)
            if len(pointers) == 0:
                raise InputParseError(
                    code_points,
                    code_point_pos,
                    self.previous_code_points,
                )
        self.previous_code_points.extend(code_points)
        return pointers

    #   // generator that yields either the node, or if a reference rule, the referenced node
    #   // we need these function, as distinct from leveraging the logic in GraphPointer,
    #   // because that needs a rule ref with already defined nodes; this function is used to _set_ those nodes
    def __fetch_nodes_for_root_node__(
        self,
        root_nodes: dict[int, GraphNode],
        parent: GraphPointer | None = None,
    ) -> Iterable[tuple[GraphNode, GraphPointer | None]]:
        for node in root_nodes.values():
            if is_rule_ref(node.rule):
                yield from self.__fetch_nodes_for_root_node__(
                    self.__get_root_node__(node.rule.value),
                    GraphPointer(node, parent),
                )
            else:
                yield node, parent

    def print(self, pointers: Pointers | None = None, colors: bool = False) -> str:
        nodes: list[list[GraphNode]] = [
            list(root_node.values()) for root_node in self.__roots__.values()
        ]
        graph_view: list[str] = []
        for root_node in nodes:
            for node in root_node:
                graph_view.extend(
                    [
                        node.print(
                            {
                                "pointers": pointers or set(),
                                "show_position": True,
                                "colorize": colorize if colors else lambda s, _: str(s),
                            },
                        ),
                    ],
                )

        return "\n".join(graph_view)

    def __iterate_over_pointers__(
        self,
        pointers: Pointers,
    ) -> Iterable[tuple[UnresolvedRule, Pointers]]:
        seen_rules: dict[UnresolvedRule, Pointers] = {}
        for pointer in pointers:
            rule = pointer.rule
            if is_rule_ref(rule):
                raise ValueError("Encountered a reference rule in the graph")
            seen_rule = seen_rules.get(rule)
            if seen_rule is None:
                seen_rule = set([pointer])
                seen_rules[rule] = seen_rule
            else:
                seen_rule.add(pointer)
        yield from seen_rules.items()
