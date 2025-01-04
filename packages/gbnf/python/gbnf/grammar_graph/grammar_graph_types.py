from __future__ import annotations

import json
from collections.abc import Callable
from dataclasses import dataclass, field
from enum import Enum
from typing import TYPE_CHECKING, Any, TypedDict

from .rule_ref import RuleRef


class PrintOpts(TypedDict):
    pointers: set[GraphPointer]
    colorize: Callable[[str | int, str], str]
    show_position: bool


class RuleType(Enum):
    CHAR = "char"
    CHAR_EXCLUDE = "char_exclude"
    END = "end"


Range = tuple[int, int]


class Rule:
    type: RuleType
    value: Any | None

    @property
    def __dict__(self):
        if self.value is None:
            return {
                "type": self.type,
            }
        return {"type": self.type, "value": self.value}


@dataclass
class RuleChar(Rule):
    type: RuleType = RuleType.CHAR
    value: list[int | Range] = field(default_factory=list)

    def __init__(self, value: list[int | Range]):
        self.value = value

    def __eq__(self, other: object) -> bool:
        return isinstance(other, RuleChar) and json.dumps(self.value) == json.dumps(
            other.value,
        )

    def __repr__(self) -> str:
        return f"RuleChar(value={self.value})"


class RuleCharExclude(Rule):
    type: RuleType = RuleType.CHAR_EXCLUDE

    value: list[int | Range] = field(default_factory=list)

    def __init__(self, value: list[int | Range]):
        self.value = value

    def __eq__(self, other: object) -> bool:
        return isinstance(other, RuleCharExclude) and json.dumps(
            self.value,
        ) == json.dumps(other.value)

    def __repr__(self) -> str:
        return f"RuleCharExclude(value={self.value})"


class RuleEnd(Rule):
    type: RuleType = RuleType.END

    def __eq__(self, other: object) -> bool:
        return isinstance(other, RuleEnd)

    def __repr__(self) -> str:
        return "RuleEnd()"


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
