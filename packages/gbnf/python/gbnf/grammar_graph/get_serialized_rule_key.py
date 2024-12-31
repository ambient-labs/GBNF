from __future__ import annotations

import json

from .grammar_graph_types import (
    RuleChar,
    RuleCharExclude,
    RuleRef,
    RuleType,
    UnresolvedRule,
)
from .type_guards import is_rule_char, is_rule_char_exclude, is_rule_end, is_rule_ref

KEY_TRANSLATION = {
    RuleType.END: 0,
    RuleType.CHAR: 1,
    RuleType.CHAR_EXCLUDE: 2,
}


def get_serialized_rule_key(rule: UnresolvedRule) -> str:
    if is_rule_end(rule):
        return f"{KEY_TRANSLATION[RuleType.END]}"

    if is_rule_char(rule):
        assert isinstance(rule, RuleChar)
        return f"{KEY_TRANSLATION[RuleType.CHAR]}-{json.dumps(rule.value)}"

    if is_rule_char_exclude(rule):
        assert isinstance(rule, RuleCharExclude)
        return f"{KEY_TRANSLATION[RuleType.CHAR_EXCLUDE]}-{json.dumps(rule.value)}"

    if is_rule_ref(rule):
        assert isinstance(rule, RuleRef)
        return f"3-{rule.value}"

    raise ValueError(f"Unknown rule type: {rule}")
