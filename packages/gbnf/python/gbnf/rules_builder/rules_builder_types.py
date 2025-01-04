from dataclasses import dataclass
from enum import Enum
from typing import Any


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
class InternalBase:
    def __eq__(self, other):
        return isinstance(other, self.__class__)


@dataclass
class InternalBaseWithValue:
    value: Any

    def __eq__(self, other):
        return isinstance(other, self.__class__) and self.value == other.value


@dataclass
class InternalBaseWithInt(InternalBaseWithValue):
    value: int


@dataclass
class InternalBaseWithListOfInts(InternalBaseWithValue):
    value: list[int]


@dataclass
class InternalRuleDefChar(InternalBaseWithListOfInts):
    pass


@dataclass
class InternalRuleDefCharAlt(InternalBaseWithInt):
    pass


class InternalRuleDefAlt(InternalBase):
    pass


@dataclass
class InternalRuleDefCharNot(InternalBaseWithListOfInts):
    pass


@dataclass
class InternalRuleDefAltChar(InternalBaseWithInt):
    pass


@dataclass
class InternalRuleDefCharRngUpper(InternalBaseWithInt):
    pass


@dataclass
class InternalRuleDefReference(InternalBaseWithInt):
    pass


@dataclass
class InternalRuleDefEnd(InternalBase):
    pass


@dataclass
class InternalRuleDefWithoutValue(InternalBase):
    pass


InternalRuleDef = (
    InternalRuleDefChar
    | InternalRuleDefEnd
    | InternalRuleDefReference
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
