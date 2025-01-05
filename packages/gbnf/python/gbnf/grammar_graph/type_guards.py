from __future__ import annotations

from collections.abc import Callable
from typing import TYPE_CHECKING, Any, TypeGuard, TypeVar

from .grammar_graph_types import (
    RuleChar,
    RuleCharExclude,
    RuleEnd,
    UnresolvedRule,
)
from .rule_ref import RuleRef

if TYPE_CHECKING:
    from .graph_pointer import GraphPointer


T = TypeVar("T")


def type_guard(predicate: Callable[[Any], bool]) -> Callable[[Any], TypeGuard[T]]:
    def wrapper(value: Any) -> TypeGuard[T]:
        return predicate(value)

    return wrapper


@type_guard
def is_rule(rule: Any) -> bool:
    return rule is not None and isinstance(
        rule,
        (RuleChar | RuleCharExclude | RuleEnd | RuleRef),
    )


@type_guard
def is_rule_ref(rule: UnresolvedRule) -> bool:
    return isinstance(rule, RuleRef)


@type_guard
def is_rule_end(rule: UnresolvedRule) -> bool:
    return rule is not None and isinstance(rule, RuleEnd) and isinstance(rule, RuleEnd)


@type_guard
def is_rule_char(rule: UnresolvedRule) -> bool:
    return (
        rule is not None and isinstance(rule, RuleChar) and isinstance(rule, RuleChar)
    )


@type_guard
def is_rule_char_exclude(rule: UnresolvedRule) -> bool:
    return rule is not None and isinstance(rule, RuleCharExclude)


@type_guard
def is_range(inpt: Any) -> bool:
    return (
        isinstance(inpt, list)
        and len(inpt) == 2
        and all(isinstance(n, int) for n in inpt)
    )


@type_guard
def is_graph_pointer_rule_ref(pointer: GraphPointer) -> bool:
    return is_rule_ref(pointer.rule)


@type_guard
def is_graph_pointer_rule_end(pointer: GraphPointer) -> bool:
    return is_rule_end(pointer.rule)


@type_guard
def is_graph_pointer_rule_char(pointer: GraphPointer) -> bool:
    return is_rule_char(pointer.rule)


@type_guard
def is_graph_pointer_rule_char_exclude(pointer: GraphPointer) -> bool:
    return is_rule_char_exclude(pointer.rule)
