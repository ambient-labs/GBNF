from __future__ import annotations

from typing import TYPE_CHECKING, Any

from .grammar_graph_types import (
    RuleChar,
    RuleCharExclude,
    RuleEnd,
    RuleType,
    UnresolvedRule,
)
from .rule_ref import RuleRef

if TYPE_CHECKING:
    from .graph_pointer import GraphPointer


# def is_rule_type(type: Any) -> bool:
#     return type is not None and type in RuleType.__members__


def is_rule(rule: Any) -> bool:
    return rule is not None and isinstance(
        rule,
        (RuleChar | RuleCharExclude | RuleEnd | RuleRef),
    )


def is_rule_ref(rule: UnresolvedRule) -> bool:
    return isinstance(rule, RuleRef)


def is_rule_end(rule: UnresolvedRule) -> bool:
    return rule is not None and isinstance(rule, RuleEnd) and rule.type == RuleType.END


def is_rule_char(rule: UnresolvedRule) -> bool:
    return (
        rule is not None and isinstance(rule, RuleChar) and rule.type == RuleType.CHAR
    )


def is_rule_char_exclude(rule: UnresolvedRule) -> bool:
    return (
        rule is not None
        and isinstance(rule, RuleCharExclude)
        and rule.type == RuleType.CHAR_EXCLUDE
    )


def is_range(inpt: Any) -> bool:
    return (
        isinstance(inpt, list)
        and len(inpt) == 2
        and all(isinstance(n, int) for n in inpt)
    )


def is_graph_pointer_rule_ref(pointer: GraphPointer) -> bool:
    return is_rule_ref(pointer.rule)


def is_graph_pointer_rule_end(pointer: GraphPointer) -> bool:
    return is_rule_end(pointer.rule)


def is_graph_pointer_rule_char(pointer: GraphPointer) -> bool:
    return is_rule_char(pointer.rule)


def is_graph_pointer_rule_char_exclude(pointer: GraphPointer) -> bool:
    return is_rule_char_exclude(pointer.rule)
