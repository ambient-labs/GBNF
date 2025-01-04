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
    value: list[int]


@dataclass
class InternalRuleDefCharAlt:
    value: list[int]


class InternalRuleDefAlt:
    pass


@dataclass
class InternalRuleDefCharNot:
    value: list[int]


@dataclass
class InternalRuleDefAltChar:
    value: int


@dataclass
class InternalRuleDefCharRngUpper:
    value: int


@dataclass
class InternalRuleDefReference:
    value: int


@dataclass
class InternalRuleDefEnd:
    pass


@dataclass
class InternalRuleDefWithoutValue:
    pass


InternalRuleDef = (
    InternalRuleDefChar
    | InternalRuleDefEnd
    | InternalRuleDefCharNot
    | InternalRuleDefWithNumericValue
    | InternalRuleDefWithoutValue
    | InternalRuleDefAlt
    | InternalRuleDefCharRngUpper
    | InternalRuleDefCharAlt
    | InternalRuleDefAltChar
)

InternalRuleDefCharOrAltChar = InternalRuleDefChar | InternalRuleDefAltChar

SymbolIds = dict[str, int]


# Type Guards (Python version)
def is_rule_def_type(type_):
    return isinstance(type_, InternalRuleType)


def is_rule_def(rule):
    return hasattr(rule, "type") and is_rule_def_type(rule.type)


def is_rule_def_alt(rule):
    return isinstance(rule, InternalRuleDefAlt)


def is_rule_def_ref(rule):
    return isinstance(rule, InternalRuleDefReference)


def is_rule_def_end(rule):
    return isinstance(rule, InternalRuleDefEnd)


def is_rule_def_char(rule):
    return isinstance(rule, InternalRuleDefChar)


def is_rule_def_char_not(rule):
    return isinstance(rule, InternalRuleDefCharNot)


def is_rule_def_char_alt(rule):
    return isinstance(rule, InternalRuleDefAltChar)


def is_rule_def_char_rng_upper(rule):
    return isinstance(rule, InternalRuleDefCharRngUpper)
