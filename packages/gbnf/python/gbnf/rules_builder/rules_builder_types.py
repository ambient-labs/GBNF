from dataclasses import dataclass, field
from typing import Any

from ..utils.validate_non_empty import validate_non_empty


@dataclass
class InternalRuleDefWithNumericValue:
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
    value: list[int] = field(
        default_factory=list, metadata={"validate": validate_non_empty},
    )

    def __post_init__(self):
        self.value = self.value.copy()


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
    | InternalRuleDefCharAlt
)

InternalRuleDefCharOrAltChar = InternalRuleDefChar | InternalRuleDefCharAlt

SymbolIds = dict[str, int]


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
    return isinstance(rule, InternalRuleDefCharAlt)


def is_rule_def_char_rng_upper(rule):
    return isinstance(rule, InternalRuleDefCharRngUpper)
