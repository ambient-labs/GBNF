from dataclasses import dataclass
from enum import Enum


class InternalRuleType(Enum):
    CHAR = "CHAR"
    CHAR_RNG_UPPER = "CHAR_RNG_UPPER"
    RULE_REF = "RULE_REF"
    ALT = "ALT"
    END = "END"
    CHAR_NOT = "CHAR_NOT"
    CHAR_ALT = "CHAR_ALT"


@dataclass
class InternalRuleDefWithNumericValue:
    type: InternalRuleType
    value: int


@dataclass
class InternalRuleDefChar:
    type: InternalRuleType
    value: list[int]


@dataclass
class InternalRuleDefCharNot:
    type: InternalRuleType
    value: list[int]


@dataclass
class InternalRuleDefAltChar:
    type: InternalRuleType
    value: int


@dataclass
class InternalRuleDefReference:
    type: InternalRuleType
    value: int


@dataclass
class InternalRuleDefEnd:
    type: InternalRuleType


@dataclass
class InternalRuleDefWithoutValue:
    type: InternalRuleType


InternalRuleDef = (
    InternalRuleDefChar
    | InternalRuleDefCharNot
    | InternalRuleDefWithNumericValue
    | InternalRuleDefWithoutValue
)
InternalRuleDefCharOrAltChar = InternalRuleDefChar | InternalRuleDefAltChar

SymbolIds = dict[str, int]


# Type Guards (Python version)
def is_rule_def_type(type_):
    return isinstance(type_, InternalRuleType)


def is_rule_def(rule):
    return hasattr(rule, "type") and is_rule_def_type(rule.type)


def is_rule_def_alt(rule):
    return getattr(rule, "type", None) == InternalRuleType.ALT


def is_rule_def_ref(rule):
    return getattr(rule, "type", None) == InternalRuleType.RULE_REF


def is_rule_def_end(rule):
    return getattr(rule, "type", None) == InternalRuleType.END


def is_rule_def_char(rule):
    return getattr(rule, "type", None) == InternalRuleType.CHAR


def is_rule_def_char_not(rule):
    return getattr(rule, "type", None) == InternalRuleType.CHAR_NOT


def is_rule_def_char_alt(rule):
    return getattr(rule, "type", None) == InternalRuleType.CHAR_ALT


def is_rule_def_char_rng_upper(rule):
    return getattr(
        rule,
        "type",
        None,
    ) == InternalRuleType.CHAR_RNG_UPPER and isinstance(
        getattr(rule, "value", None),
        int,
    )
