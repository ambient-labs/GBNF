from __future__ import annotations

from collections.abc import Callable
from dataclasses import field
from enum import Enum
from typing import TYPE_CHECKING, TypedDict

from .rule_ref import RuleRef

if TYPE_CHECKING:
    """
    import type { Colorize, } from "./colorize.js";
    import type { GenericSet, } from "./generic-set.js";
    import type { GraphPointer, } from "./graph-pointer.js";
    import { RuleRef, } from "./rule-ref.js";
    """


class PrintOpts(TypedDict):
    # pointers: Pointers
    colorize: Callable[[str | int, str], str]
    showPosition: bool


class RuleType(Enum):
    CHAR = "char"
    CHAR_EXCLUDE = "char_exclude"
    END = "end"


Range = tuple[int, int]


class RuleChar:
    type: RuleType = RuleType.CHAR
    value: list[int | Range] = field(default_factory=list)

    def __init__(self, value: list[int | Range]):
        self.value = value


class RuleCharExclude:
    type: RuleType = RuleType.CHAR_EXCLUDE

    value: list[int | Range] = field(default_factory=list)

    def __init__(self, value: list[int | Range]):
        self.value = value


class RuleEnd:
    type: RuleType = RuleType.END


UnresolvedRule = RuleChar | RuleCharExclude | RuleRef | RuleEnd

# RuleRefs should never be exposed to the end user.
ResolvedRule = RuleCharExclude | RuleChar | RuleEnd
"""ResolvedGraphPointer = GraphPointer<ResolvedRule>"""

# ValidInput can either be a string, or a number indicating a code point.
# It CANNOT be a number representing a number; a number intended as input (like "8")
# should be passed in as a string.
ValidInput = str | int | list[int]

"""Pointers = set[ResolvedGraphPointer, str]"""
