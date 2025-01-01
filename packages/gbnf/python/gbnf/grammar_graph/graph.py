from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .grammar_graph_types import Pointers


class Graph:

    def add(self, _text: str, pointers: Pointers):
        return pointers

    @property
    def grammar(self) -> str:
        return "grammar"
