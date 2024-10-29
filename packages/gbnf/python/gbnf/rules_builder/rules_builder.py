from time import perf_counter

from .errors import GrammarParseError
from .gbnf_types import InternalRuleType
from .is_word_char import is_word_char
from .parse_char import parse_char
from .parse_name import parse_name
from .parse_space import parse_space


class RulesBuilder:
    def __init__(self, src, limit=1000):
        self.pos = 0
        self.symbol_ids = {}
        self.rules = []
        self.src = src
        self.start = perf_counter()
        self.time_limit = limit
        self.parse(src)

    def parse(self, src):
        self.pos = parse_space(src, 0, True)
        while self.pos < len(src):
            self.parse_rule(src)

        # Validate the state to ensure that all rules are defined
        for rule in self.rules:
            for elem in rule:
                if elem["type"] == InternalRuleType.RULE_REF:
                    if (
                        elem["value"] >= len(self.rules)
                        or not self.rules[elem["value"]]
                    ):
                        for key, value in self.symbol_ids.items():
                            if value == elem["value"]:
                                raise GrammarParseError(
                                    src,
                                    self.pos,
                                    f"Undefined rule identifier '{key}'",
                                )

    def parse_rule(self, src):
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

    def get_symbol_id(self, src, length):
        key = src[:length]
        if key not in self.symbol_ids:
            self.symbol_ids[key] = len(self.symbol_ids)
        return self.symbol_ids[key]

    def generate_symbol_id(self, base_name):
        next_id = len(self.symbol_ids)
        new_name = f"{base_name}_{next_id}"
        self.symbol_ids[new_name] = next_id
        return next_id

    def add_rule(self, rule_id, rule):
        while len(self.rules) <= rule_id:
            self.rules.append([])
        self.rules[rule_id] = rule

    def check_duration(self):
        if perf_counter() - self.start > self.time_limit:
            raise GrammarParseError(
                self.src,
                self.pos,
                f"Duration of {self.time_limit} exceeded",
            )

    def parse_sequence(self, rule_name, out_elements, depth=0):
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
                        {"type": InternalRuleType.CHAR, "value": [value]},
                    )
                    self.pos += inc_pos
                self.pos = parse_space(src, self.pos + 1, is_nested)
            elif src[self.pos] == "[":
                self.pos += 1
                start_type = InternalRuleType.CHAR
                if src[self.pos] == "^":
                    self.pos += 1
                    start_type = InternalRuleType.CHAR_NOT
                last_sym_start = len(out_elements)
                while src[self.pos] != "]":
                    self.check_duration()
                    type_ = (
                        InternalRuleType.CHAR_ALT
                        if last_sym_start < len(out_elements)
                        else start_type
                    )
                    startchar_value, inc_pos = parse_char(src, self.pos)
                    self.pos += inc_pos
                    out_elements.append(
                        {
                            "type": type_,
                            "value": (
                                [startchar_value]
                                if type_
                                in (InternalRuleType.CHAR, InternalRuleType.CHAR_NOT)
                                else startchar_value
                            ),
                        },
                    )

                    if src[self.pos] == "-" and src[self.pos + 1] != "]":
                        self.pos += 1
                        endchar_value, inc_pos = parse_char(src, self.pos)
                        out_elements.append(
                            {
                                "type": InternalRuleType.CHAR_RNG_UPPER,
                                "value": endchar_value,
                            },
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
                    {"type": InternalRuleType.RULE_REF, "value": ref_rule_id},
                )
            elif src[self.pos] == "(":
                self.pos = parse_space(src, self.pos + 1, True)
                sub_rule_id = self.generate_symbol_id(rule_name)
                self.parse_alternates(rule_name, sub_rule_id, depth + 1)
                last_sym_start = len(out_elements)
                out_elements.append(
                    {"type": InternalRuleType.RULE_REF, "value": sub_rule_id},
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
                        {"type": InternalRuleType.RULE_REF, "value": sub_rule_id},
                    )
                sub_rule.append({"type": InternalRuleType.ALT})
                if src[self.pos] == "+":
                    sub_rule.extend(out_elements[last_sym_start:])
                sub_rule.append({"type": InternalRuleType.END})
                self.add_rule(sub_rule_id, sub_rule)
                out_elements[last_sym_start:] = [
                    {"type": InternalRuleType.RULE_REF, "value": sub_rule_id},
                ]
                self.pos = parse_space(src, self.pos + 1, is_nested)
            else:
                break

    def parse_alternates(self, rule_name, rule_id, depth=0):
        src = self.src
        rule = []
        self.parse_sequence(rule_name, rule, depth)
        # Ensure that self.pos is within bounds before checking src[self.pos]
        while self.pos < len(src) and src[self.pos] == "|":
            self.check_duration()
            rule.append({"type": InternalRuleType.ALT})
            self.pos = parse_space(src, self.pos + 1, True)
            self.parse_sequence(rule_name, rule, depth)
        rule.append({"type": InternalRuleType.END})
        self.add_rule(rule_id, rule)
