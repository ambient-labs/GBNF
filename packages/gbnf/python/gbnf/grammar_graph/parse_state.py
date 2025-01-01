from __future__ import annotations

from collections.abc import Iterable
from typing import TYPE_CHECKING

from .grammar_graph_types import Rule, RuleType

if TYPE_CHECKING:
    from .grammar_graph_types import Pointers, ResolvedRule
    from .graph import Graph

import json


class CustomJSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, RuleType):
            return o.value
        if isinstance(o, Rule):
            return o
        return super().default(o)


class ParseState:
    __graph__: Graph
    __pointers__: Pointers

    def __init__(self, graph: Graph, pointers: Pointers):
        self.__graph__ = graph
        self.__pointers__ = pointers

    def __call__(self, text: str) -> ParseState:
        return self.add(text)

    def __iter__(self) -> Iterable[ResolvedRule]:
        yield from self.rules()

    def rules(self) -> Iterable[ResolvedRule]:
        rules = set()
        for pointer in self.__pointers__:
            rule = pointer.rule
            key = json.dumps(rule.__dict__, cls=CustomJSONEncoder)
            if key not in rules:
                rules.add(key)
                yield rule

    def add(self, text: str) -> ParseState:
        pointers = self.__graph__.add(text, self.__pointers__)
        return ParseState(self.__graph__, pointers)

    def __add__(self, text: str) -> ParseState:
        return self.add(text)

    @property
    def size(self) -> int:
        return len(list(self.rules()))

    @property
    def grammar(self) -> str:
        return self.__graph__.grammar
