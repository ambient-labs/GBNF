from time import perf_counter

from ..utils.errors import GrammarParseError
from .is_word_char import is_word_char
from .parse_char import parse_char
from .parse_name import parse_name
from .parse_space import parse_space
from .rules_builder_types import (
    InternalRuleDef,
    InternalRuleDefAlt,
    InternalRuleDefChar,
    InternalRuleDefCharAlt,
    InternalRuleDefCharNot,
    InternalRuleDefCharRngUpper,
    InternalRuleDefEnd,
    InternalRuleDefReference,
)
from .symbol_ids import SymbolIds


def get_out_elements(
    type_of_rule: type[InternalRuleDef],
    startchar_value: int,
) -> InternalRuleDef:
    if type_of_rule == InternalRuleDefChar:
        return InternalRuleDefChar(value=[startchar_value])
    if type_of_rule == InternalRuleDefCharNot:
        return InternalRuleDefCharNot(value=[startchar_value])
    if type_of_rule == InternalRuleDefCharRngUpper:
        return InternalRuleDefCharRngUpper(value=startchar_value)
    if type_of_rule == InternalRuleDefAlt:
        return InternalRuleDefAlt()
    if type_of_rule == InternalRuleDefEnd:
        return InternalRuleDefEnd()
    if type_of_rule == InternalRuleDefCharAlt:
        return InternalRuleDefCharAlt(value=startchar_value)

    raise ValueError(f"Invalid type: {type_of_rule}")


class RulesBuilder:
    pos: int
    symbol_ids: SymbolIds
    rules: list[list[InternalRuleDef]]
    src: str
    start: float
    time_limit: int

    def __init__(self, src: str, limit: int = 1000):
        self.pos = 0
        self.symbol_ids = SymbolIds()
        self.rules = []
        self.src = src
        self.start = perf_counter()
        self.time_limit = limit
        self.parse(src)

    def parse(self, src: str) -> None:
        self.pos = parse_space(src, 0, True)
        while self.pos < len(src):
            self.parse_rule(src)

        # Validate the state to ensure that all rules are defined
        for rule in self.rules:
            for elem in rule:
                if isinstance(elem, InternalRuleDefReference):
                    rule_exists = (
                        elem.value < len(self.rules) and len(self.rules[elem.value]) > 0
                    )
                    if not rule_exists:
                        missing_rule_name = self.symbol_ids.reverse_get(elem.value)
                        missing_rule_pos = self.symbol_ids.get_pos(missing_rule_name)

                        # Skip over the ::= and any whitespace
                        while missing_rule_pos < len(src) and (
                            src[missing_rule_pos] == ":"
                            or src[missing_rule_pos] == "="
                            or src[missing_rule_pos].isspace()
                        ):
                            missing_rule_pos += 1

                        raise GrammarParseError(
                            src,
                            missing_rule_pos,
                            f'Undefined rule identifier "{missing_rule_name}"',
                        )

    def parse_rule(self, src: str) -> None:
        name = parse_name(src, self.pos)
        self.pos = parse_space(src, self.pos + len(name), False)
        rule_id = self.get_symbol_id(name, len(name))

        self.pos = parse_space(src, self.pos, True)
        if not (
            self.pos + 2 < len(src)  # Ensure the position + 2 is within bounds
            and src[self.pos] == ":"
            and src[self.pos + 1] == ":"
            and src[self.pos + 2] == "="
        ):
            raise GrammarParseError(src, self.pos, f"Expecting ::= at {self.pos}")
        self.pos += 3
        self.pos = parse_space(src, self.pos, True)

        self.parse_alternates(name, rule_id)

        # Check if self.pos is within the bounds of src before checking for a carriage return
        if self.pos < len(src) and src[self.pos] == "\r":
            self.pos += 2 if src[self.pos + 1] == "\n" else 1
        elif self.pos < len(src) and src[self.pos] == "\n":
            self.pos += 1
        elif self.pos < len(src) and src[self.pos]:
            raise GrammarParseError(
                src,
                self.pos,
                f"Expecting newline or end at {self.pos}",
            )
        self.pos = parse_space(src, self.pos, True)

    def get_symbol_id(self, src: str, length: int) -> int:
        next_id = len(self.symbol_ids)
        key = src[:length]
        if key not in self.symbol_ids:
            self.symbol_ids.set(key, next_id, self.pos)
        return self.symbol_ids[key]

    def generate_symbol_id(self, base_name: str) -> int:
        next_id = len(self.symbol_ids)
        self.symbol_ids.set(f"{base_name}_{next_id}", next_id, self.pos)
        return next_id

    def add_rule(self, rule_id: int, rule: list[InternalRuleDef]) -> None:
        while len(self.rules) <= rule_id:
            self.rules.append([])
        self.rules[rule_id] = rule

    def check_duration(self) -> None:
        if perf_counter() - self.start > self.time_limit:
            raise GrammarParseError(
                self.src,
                self.pos,
                f"Duration of {self.time_limit} exceeded",
            )

    def parse_sequence(
        self,
        rule_name: str,
        out_elements: list[InternalRuleDef],
        depth: int = 0,
    ) -> None:
        is_nested = depth != 0
        src = self.src
        last_sym_start = len(out_elements)

        while self.pos < len(src):
            if src[self.pos] == '"':
                self.pos += 1
                last_sym_start = len(out_elements)
                while src[self.pos] != '"':
                    self.check_duration()
                    value, inc_pos = parse_char(src, self.pos)
                    out_elements.append(
                        InternalRuleDefChar(
                            value=[value],
                        ),
                    )
                    self.pos += inc_pos
                self.pos = parse_space(src, self.pos + 1, is_nested)
            elif src[self.pos] == "[":
                self.pos += 1
                start_type: type[InternalRuleDef] = InternalRuleDefChar
                if src[self.pos] == "^":
                    self.pos += 1
                    start_type = InternalRuleDefCharNot
                last_sym_start = len(out_elements)
                while src[self.pos] != "]":
                    self.check_duration()
                    type_: type[InternalRuleDef] = (
                        InternalRuleDefCharAlt
                        if last_sym_start < len(out_elements)
                        else start_type
                    )
                    startchar_value, inc_pos = parse_char(src, self.pos)
                    self.pos += inc_pos
                    out_elements.append(get_out_elements(type_, startchar_value))

                    if src[self.pos] == "-" and src[self.pos + 1] != "]":
                        self.pos += 1
                        endchar_value, inc_pos = parse_char(src, self.pos)
                        out_elements.append(
                            InternalRuleDefCharRngUpper(
                                value=endchar_value,
                            ),
                        )
                        self.pos += inc_pos
                self.pos = parse_space(src, self.pos + 1, is_nested)
            elif is_word_char(src[self.pos]):
                name = parse_name(src, self.pos)
                ref_rule_id = self.get_symbol_id(name, len(name))
                self.pos += len(name)
                self.pos = parse_space(src, self.pos, is_nested)

                last_sym_start = len(out_elements)
                out_elements.append(
                    InternalRuleDefReference(
                        value=ref_rule_id,
                    ),
                )
            elif src[self.pos] == "(":
                self.pos = parse_space(src, self.pos + 1, True)
                sub_rule_id = self.generate_symbol_id(rule_name)
                self.parse_alternates(rule_name, sub_rule_id, depth + 1)
                last_sym_start = len(out_elements)
                out_elements.append(
                    InternalRuleDefReference(
                        value=sub_rule_id,
                    ),
                )
                if src[self.pos] != ")":
                    raise GrammarParseError(
                        src,
                        self.pos,
                        f"Expecting ')' at {self.pos}",
                    )
                self.pos = parse_space(src, self.pos + 1, is_nested)
            elif src[self.pos] in "*+?":
                if last_sym_start == len(out_elements):
                    raise GrammarParseError(
                        src,
                        self.pos,
                        f"Expecting preceding item to */+/? at {self.pos}",
                    )
                sub_rule_id = self.generate_symbol_id(rule_name)
                sub_rule = out_elements[last_sym_start:]
                if src[self.pos] in "*+":
                    sub_rule.append(
                        InternalRuleDefReference(
                            value=sub_rule_id,
                        ),
                    )
                sub_rule.append(InternalRuleDefAlt())
                if src[self.pos] == "+":
                    sub_rule.extend(out_elements[last_sym_start:])
                sub_rule.append(InternalRuleDefEnd())
                self.add_rule(sub_rule_id, sub_rule)
                out_elements[last_sym_start:] = [
                    InternalRuleDefReference(
                        value=sub_rule_id,
                    ),
                ]
                self.pos = parse_space(src, self.pos + 1, is_nested)
            else:
                break

    def parse_alternates(self, rule_name: str, rule_id: int, depth: int = 0) -> None:
        src = self.src
        rule = []
        self.parse_sequence(rule_name, rule, depth)
        # Ensure that self.pos is within bounds before checking src[self.pos]
        while self.pos < len(src) and src[self.pos] == "|":
            self.check_duration()
            rule.append(InternalRuleDefAlt())
            self.pos = parse_space(src, self.pos + 1, True)
            self.parse_sequence(rule_name, rule, depth)
        rule.append(InternalRuleDefEnd())
        self.add_rule(rule_id, rule)
