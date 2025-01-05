from __future__ import annotations

import json
from collections.abc import Callable
from dataclasses import dataclass, field
from enum import Enum
from typing import TYPE_CHECKING, Any, TypedDict

from .rule_ref import RuleRef
from ..utils.validate_non_empty import validate_non_empty


class PrintOpts(TypedDict):
    pointers: set[GraphPointer]
    colorize: Callable[[str | int, str], str]
    show_position: bool


Range = tuple[int, int]


class Rule:
    def __eq__(self, other):
        return isinstance(other, self.__class__)

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}()"


@dataclass
class RuleWithValue(Rule):
    value: Any

    def __eq__(self, other):
        return isinstance(other, self.__class__) and self.value == other.value

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(value={self.value})"


@dataclass
class RuleWithListOfIntsOrRanges(RuleWithValue):
    value: list[int | Range] = field(
        default_factory=lambda: [], metadata={"validate": validate_non_empty}
    )

    def __post_init__(self):
        self.value = self.value.copy()


@dataclass
class RuleChar(RuleWithListOfIntsOrRanges):
    pass


class RuleCharExclude(RuleWithListOfIntsOrRanges):
    pass


class RuleEnd(Rule):
    pass


UnresolvedRule = RuleChar | RuleCharExclude | RuleRef | RuleEnd


# ValidInput can either be a string, or a number indicating a code point.
# It CANNOT be a number representing a number; a number intended as input (like "8")
# should be passed in as a string.
ValidInput = str | int | list[int]


if TYPE_CHECKING:
    from .graph_pointer import GraphPointer

    # RuleRefs should never be exposed to the end user.
    ResolvedRule = RuleCharExclude | RuleChar | RuleEnd
    ResolvedGraphPointer = GraphPointer[ResolvedRule]
    Pointers = set[ResolvedGraphPointer]
