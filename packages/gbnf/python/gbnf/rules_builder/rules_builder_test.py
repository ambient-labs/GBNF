import pytest

from .gbnf_types import InternalRuleType
from .rules_builder import RulesBuilder

test_cases = [
    (
        "single-string",
        'root ::= "foo"',
        (
            [("root", 0)],
            [
                [
                    {"type": InternalRuleType.CHAR, "value": [ord("f")]},
                    {"type": InternalRuleType.CHAR, "value": [ord("o")]},
                    {"type": InternalRuleType.CHAR, "value": [ord("o")]},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "quote character",
        r'root ::= "\""',
        (
            [("root", 0)],
            [
                [
                    {"type": InternalRuleType.CHAR, "value": [ord('"')]},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "two-lines-referencing-expression",
        '''root ::= foo
        foo ::= "bar"''',
        (
            [("root", 0), ("foo", 1)],
            [
                [
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [ord("b")]},
                    {"type": InternalRuleType.CHAR, "value": [ord("a")]},
                    {"type": InternalRuleType.CHAR, "value": [ord("r")]},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "expression with dash",
        '''root ::= foo-bar
        foo-bar ::= "bar"''',
        (
            [("root", 0), ("foo-bar", 1)],
            [
                [
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [ord("b")]},
                    {"type": InternalRuleType.CHAR, "value": [ord("a")]},
                    {"type": InternalRuleType.CHAR, "value": [ord("r")]},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "simple-grammar",
        """
        root  ::= (expr "=" term "\n")+
        expr  ::= term ([-+*/] term)*
        term  ::= [0-9]+
        """,
        (
            [
                ("root", 0),
                ("root_1", 1),
                ("expr", 2),
                ("term", 3),
                ("root_4", 4),
                ("expr_5", 5),
                ("expr_6", 6),
                ("term_7", 7),
            ],
            [
                [
                    {"type": InternalRuleType.RULE_REF, "value": 4},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 2},
                    {"type": InternalRuleType.CHAR, "value": [61]},
                    {"type": InternalRuleType.RULE_REF, "value": 3},
                    {"type": InternalRuleType.CHAR, "value": [10]},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 3},
                    {"type": InternalRuleType.RULE_REF, "value": 6},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 7},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.RULE_REF, "value": 4},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [45]},
                    {"type": InternalRuleType.CHAR_ALT, "value": 43},
                    {"type": InternalRuleType.CHAR_ALT, "value": 42},
                    {"type": InternalRuleType.CHAR_ALT, "value": 47},
                    {"type": InternalRuleType.RULE_REF, "value": 3},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 5},
                    {"type": InternalRuleType.RULE_REF, "value": 6},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [48]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.RULE_REF, "value": 7},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [48]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "longer-grammar",
        """
        root  ::= (expr "=" ws term "\n")+
        expr  ::= term ([-+*/] term)*
        term  ::= ident | num | "(" ws expr ")" ws
        ident ::= [a-z] [a-z0-9_]* ws
        num   ::= [0-9]+ ws
        ws    ::= [ \t\n]*
        """,
        (
            [
                ("root", 0),
                ("root_1", 1),
                ("expr", 2),
                ("ws", 3),
                ("term", 4),
                ("root_5", 5),
                ("expr_6", 6),
                ("expr_7", 7),
                ("ident", 8),
                ("num", 9),
                ("ident_10", 10),
                ("num_11", 11),
                ("ws_12", 12),
            ],
            [
                [
                    {"type": InternalRuleType.RULE_REF, "value": 5},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 2},
                    {"type": InternalRuleType.CHAR, "value": [61]},
                    {"type": InternalRuleType.RULE_REF, "value": 3},
                    {"type": InternalRuleType.RULE_REF, "value": 4},
                    {"type": InternalRuleType.CHAR, "value": [10]},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 4},
                    {"type": InternalRuleType.RULE_REF, "value": 7},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 12},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 8},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.RULE_REF, "value": 9},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [40]},
                    {"type": InternalRuleType.RULE_REF, "value": 3},
                    {"type": InternalRuleType.RULE_REF, "value": 2},
                    {"type": InternalRuleType.CHAR, "value": [41]},
                    {"type": InternalRuleType.RULE_REF, "value": 3},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.RULE_REF, "value": 5},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [45]},
                    {"type": InternalRuleType.CHAR_ALT, "value": 43},
                    {"type": InternalRuleType.CHAR_ALT, "value": 42},
                    {"type": InternalRuleType.CHAR_ALT, "value": 47},
                    {"type": InternalRuleType.RULE_REF, "value": 4},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 6},
                    {"type": InternalRuleType.RULE_REF, "value": 7},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [97]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 122},
                    {"type": InternalRuleType.RULE_REF, "value": 10},
                    {"type": InternalRuleType.RULE_REF, "value": 3},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 11},
                    {"type": InternalRuleType.RULE_REF, "value": 3},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [97]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 122},
                    {"type": InternalRuleType.CHAR_ALT, "value": 48},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.CHAR_ALT, "value": 95},
                    {"type": InternalRuleType.RULE_REF, "value": 10},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [48]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.RULE_REF, "value": 11},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [48]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [32]},
                    {"type": InternalRuleType.CHAR_ALT, "value": 9},
                    {"type": InternalRuleType.CHAR_ALT, "value": 10},
                    {"type": InternalRuleType.RULE_REF, "value": 12},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "character unicode grammar",
        "root  ::= [ぁ-ゟ]",
        (
            [("root", 0)],
            [
                [
                    {"type": InternalRuleType.CHAR, "value": [ord("ぁ")]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": ord("ゟ")},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "character alts grammar",
        "root  ::= [az]",
        (
            [("root", 0)],
            [
                [
                    {"type": InternalRuleType.CHAR, "value": [ord("a")]},
                    {"type": InternalRuleType.CHAR_ALT, "value": ord("z")},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "character range grammar",
        "root  ::= [a-zA-Z0-9]",
        (
            [("root", 0)],
            [
                [
                    {"type": InternalRuleType.CHAR, "value": [ord("a")]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": ord("z")},
                    {"type": InternalRuleType.CHAR_ALT, "value": ord("A")},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": ord("Z")},
                    {"type": InternalRuleType.CHAR_ALT, "value": ord("0")},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": ord("9")},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "character range grammar with dash at end",
        "root  ::= [a-z-]",
        (
            [("root", 0)],
            [
                [
                    {"type": InternalRuleType.CHAR, "value": [ord("a")]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": ord("z")},
                    {"type": InternalRuleType.CHAR_ALT, "value": ord("-")},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "grouping",
        'root  ::= "f" ("b" | "a")',
        (
            [("root", 0), ("root_1", 1)],
            [
                [
                    {"type": InternalRuleType.CHAR, "value": [ord("f")]},
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [ord("b")]},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [ord("a")]},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "optional",
        'root  ::= "f"?',
        (
            [("root", 0), ("root_1", 1)],
            [
                [
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [ord("f")]},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "repeating",
        'root  ::= "f"*',
        (
            [("root", 0), ("root_1", 1)],
            [
                [
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [ord("f")]},
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "repeating-at-least-once",
        'root  ::= "f"+',
        (
            [("root", 0), ("root_1", 1)],
            [
                [
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [ord("f")]},
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [ord("f")]},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "character range with optional repeating",
        "root  ::= [a-zA-Z0-9]*",
        (
            [("root", 0), ("root_1", 1)],
            [
                [
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [ord("a")]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": ord("z")},
                    {"type": InternalRuleType.CHAR_ALT, "value": ord("A")},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": ord("Z")},
                    {"type": InternalRuleType.CHAR_ALT, "value": ord("0")},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": ord("9")},
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "grouping-repeating",
        'root  ::= "f" ("b" | "a")*',
        (
            [("root", 0), ("root_1", 1), ("root_2", 2)],
            [
                [
                    {"type": InternalRuleType.CHAR, "value": [ord("f")]},
                    {"type": InternalRuleType.RULE_REF, "value": 2},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [ord("b")]},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [ord("a")]},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.RULE_REF, "value": 2},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "negation",
        r"root ::= [^\n]",
        (
            [("root", 0)],
            [
                [
                    {"type": InternalRuleType.CHAR_NOT, "value": [ord("\n")]},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "negation of range",
        "root ::= [^0-9]",
        (
            [("root", 0)],
            [
                [
                    {"type": InternalRuleType.CHAR_NOT, "value": [ord("0")]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": ord("9")},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "negation with after",
        r'root ::= [^\n]+ "\n"',
        (
            [("root", 0), ("root_1", 1)],
            [
                [
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.CHAR, "value": [ord("\n")]},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR_NOT, "value": [ord("\n")]},
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR_NOT, "value": [ord("\n")]},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "longer negation",
        r'root ::= "\"" ( [^"abcdefgh])* ',
        (
            [("root", 0), ("root_1", 1), ("root_2", 2)],
            [
                [
                    {"type": InternalRuleType.CHAR, "value": [34]},
                    {"type": InternalRuleType.RULE_REF, "value": 2},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR_NOT, "value": [34]},
                    {"type": InternalRuleType.CHAR_ALT, "value": 97},
                    {"type": InternalRuleType.CHAR_ALT, "value": 98},
                    {"type": InternalRuleType.CHAR_ALT, "value": 99},
                    {"type": InternalRuleType.CHAR_ALT, "value": 100},
                    {"type": InternalRuleType.CHAR_ALT, "value": 101},
                    {"type": InternalRuleType.CHAR_ALT, "value": 102},
                    {"type": InternalRuleType.CHAR_ALT, "value": 103},
                    {"type": InternalRuleType.CHAR_ALT, "value": 104},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.RULE_REF, "value": 2},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "longer negation with a range",
        r'root ::= "\"" ( [^"abcdefghA-Z])* ',
        (
            [("root", 0), ("root_1", 1), ("root_2", 2)],
            [
                [
                    {"type": InternalRuleType.CHAR, "value": [34]},
                    {"type": InternalRuleType.RULE_REF, "value": 2},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR_NOT, "value": [34]},
                    {"type": InternalRuleType.CHAR_ALT, "value": 97},
                    {"type": InternalRuleType.CHAR_ALT, "value": 98},
                    {"type": InternalRuleType.CHAR_ALT, "value": 99},
                    {"type": InternalRuleType.CHAR_ALT, "value": 100},
                    {"type": InternalRuleType.CHAR_ALT, "value": 101},
                    {"type": InternalRuleType.CHAR_ALT, "value": 102},
                    {"type": InternalRuleType.CHAR_ALT, "value": 103},
                    {"type": InternalRuleType.CHAR_ALT, "value": 104},
                    {"type": InternalRuleType.CHAR_ALT, "value": 65},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 90},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.RULE_REF, "value": 2},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    *[
        (
            key,
            f'root ::= "{escaped_char}"',
            (
                [("root", 0)],
                [
                    [
                        {"type": InternalRuleType.CHAR, "value": [actual_char]},
                        {"type": InternalRuleType.END},
                    ],
                ],
            ),
        )
        for key, escaped_char, actual_char in [
            ("escaped 8-bit unicode char", r"\x2A", ord("\x2A")),
            ("escaped 16-bit unicode char", r"\u006F", ord("\u006F")),
            ("escaped 32-bit unicode char", r"\U0001F4A9", 128169),
            ("escaped tab char", r"\t", ord("\t")),
            ("escaped new line char", r"\n", ord("\n")),
            ("escaped \r char", r"\r", ord("\r")),
            ("escaped quote char", r"\"", ord('"')),
            ("escaped [ char", r"\[", ord("[")),
            ("escaped ] char", r"\]", ord("]")),
            ("escaped \\ char", r"\\", ord("\\")),
        ]
    ],
    (
        "simple arithmetic",
        r"""
        root ::= (expr "=" term "\n")+
        expr ::= term ([-+*/] term)*
        term ::= [0-9]+
        """,
        (
            [
                ("root", 0),
                ("root_1", 1),
                ("expr", 2),
                ("term", 3),
                ("root_4", 4),
                ("expr_5", 5),
                ("expr_6", 6),
                ("term_7", 7),
            ],
            [
                [
                    {"type": InternalRuleType.RULE_REF, "value": 4},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 2},
                    {"type": InternalRuleType.CHAR, "value": [61]},
                    {"type": InternalRuleType.RULE_REF, "value": 3},
                    {"type": InternalRuleType.CHAR, "value": [10]},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 3},
                    {"type": InternalRuleType.RULE_REF, "value": 6},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 7},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.RULE_REF, "value": 4},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [45]},
                    {"type": InternalRuleType.CHAR_ALT, "value": 43},
                    {"type": InternalRuleType.CHAR_ALT, "value": 42},
                    {"type": InternalRuleType.CHAR_ALT, "value": 47},
                    {"type": InternalRuleType.RULE_REF, "value": 3},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 5},
                    {"type": InternalRuleType.RULE_REF, "value": 6},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [48]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.RULE_REF, "value": 7},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [48]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "ranges with chars",
        """
        root ::= [a-z0-9_]*
        """,
        (
            [("root", 0), ("root_1", 1)],
            [
                [
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [97]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 122},
                    {"type": InternalRuleType.CHAR_ALT, "value": 48},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.CHAR_ALT, "value": 95},
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "nested ranges with chars",
        """
        root ::= [a-z] [a-z0-9_]*
        """,
        (
            [("root", 0), ("root_1", 1)],
            [
                [
                    {"type": InternalRuleType.CHAR, "value": [97]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 122},
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [97]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 122},
                    {"type": InternalRuleType.CHAR_ALT, "value": 48},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.CHAR_ALT, "value": 95},
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "expression with nested range with chars",
        r"""
        root ::= ident
        ident ::= [a-z] [a-z0-9_]* ws
        ws ::= [ \t\n]*
        """,
        (
            [("root", 0), ("ident", 1), ("ident_2", 2), ("ws", 3), ("ws_4", 4)],
            [
                [
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [97]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 122},
                    {"type": InternalRuleType.RULE_REF, "value": 2},
                    {"type": InternalRuleType.RULE_REF, "value": 3},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [97]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 122},
                    {"type": InternalRuleType.CHAR_ALT, "value": 48},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.CHAR_ALT, "value": 95},
                    {"type": InternalRuleType.RULE_REF, "value": 2},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 4},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [32]},
                    {"type": InternalRuleType.CHAR_ALT, "value": 9},
                    {"type": InternalRuleType.CHAR_ALT, "value": 10},
                    {"type": InternalRuleType.RULE_REF, "value": 4},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "lots of escapes",
        r'root ::= "\x2A" "\u006F" "\U0001F4A9" "\t" "\n" "\r" "\"" "\[" "\]" "\\"',
        (
            [("root", 0)],
            [
                [
                    {"type": InternalRuleType.CHAR, "value": [42]},  # \x2A
                    {"type": InternalRuleType.CHAR, "value": [111]},  # \u006F
                    {"type": InternalRuleType.CHAR, "value": [128169]},  # \U0001F4A9
                    {"type": InternalRuleType.CHAR, "value": [9]},  # \t
                    {"type": InternalRuleType.CHAR, "value": [10]},  # \n
                    {"type": InternalRuleType.CHAR, "value": [13]},  # \r
                    {"type": InternalRuleType.CHAR, "value": [34]},  # \"
                    {"type": InternalRuleType.CHAR, "value": [91]},  # \[
                    {"type": InternalRuleType.CHAR, "value": [93]},  # \]
                    {"type": InternalRuleType.CHAR, "value": [92]},  # \\
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "lots of escape and alternate escapes",
        r"""root ::= "\x2A" "\u006F" "\U0001F4A9" "\t" "\n" "\r" "\"" "\[" "\]" "\\" (
            "\x2A" | "\u006F" | "\U0001F4A9" | "\t" | "\n" | "\r" | "\"" | "\[" | "\]"  | "\\" )""",
        (
            [("root", 0), ("root_1", 1)],
            [
                [
                    {"type": InternalRuleType.CHAR, "value": [42]},
                    {"type": InternalRuleType.CHAR, "value": [111]},
                    {"type": InternalRuleType.CHAR, "value": [128169]},
                    {"type": InternalRuleType.CHAR, "value": [9]},
                    {"type": InternalRuleType.CHAR, "value": [10]},
                    {"type": InternalRuleType.CHAR, "value": [13]},
                    {"type": InternalRuleType.CHAR, "value": [34]},
                    {"type": InternalRuleType.CHAR, "value": [91]},
                    {"type": InternalRuleType.CHAR, "value": [93]},
                    {"type": InternalRuleType.CHAR, "value": [92]},
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [42]},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [111]},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [128169]},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [9]},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [10]},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [13]},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [34]},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [91]},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [93]},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [92]},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "arithmetic",
        r"""
        root  ::= (expr "=" ws term "\n")+
        expr  ::= term ([-+*/] term)*
        term  ::= ident | num | "(" ws expr ")" ws
        ident ::= [a-z] [a-z0-9_]* ws
        num   ::= [0-9]+ ws
        ws    ::= [ \t\n]*
        """,
        (
            [
                ("root", 0),
                ("root_1", 1),
                ("expr", 2),
                ("ws", 3),
                ("term", 4),
                ("root_5", 5),
                ("expr_6", 6),
                ("expr_7", 7),
                ("ident", 8),
                ("num", 9),
                ("ident_10", 10),
                ("num_11", 11),
                ("ws_12", 12),
            ],
            [
                [
                    {"type": InternalRuleType.RULE_REF, "value": 5},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 2},
                    {"type": InternalRuleType.CHAR, "value": [61]},
                    {"type": InternalRuleType.RULE_REF, "value": 3},
                    {"type": InternalRuleType.RULE_REF, "value": 4},
                    {"type": InternalRuleType.CHAR, "value": [10]},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 4},
                    {"type": InternalRuleType.RULE_REF, "value": 7},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 12},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 8},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.RULE_REF, "value": 9},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [40]},
                    {"type": InternalRuleType.RULE_REF, "value": 3},
                    {"type": InternalRuleType.RULE_REF, "value": 2},
                    {"type": InternalRuleType.CHAR, "value": [41]},
                    {"type": InternalRuleType.RULE_REF, "value": 3},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.RULE_REF, "value": 5},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [45]},
                    {"type": InternalRuleType.CHAR_ALT, "value": 43},
                    {"type": InternalRuleType.CHAR_ALT, "value": 42},
                    {"type": InternalRuleType.CHAR_ALT, "value": 47},
                    {"type": InternalRuleType.RULE_REF, "value": 4},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 6},
                    {"type": InternalRuleType.RULE_REF, "value": 7},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [97]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 122},
                    {"type": InternalRuleType.RULE_REF, "value": 10},
                    {"type": InternalRuleType.RULE_REF, "value": 3},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 11},
                    {"type": InternalRuleType.RULE_REF, "value": 3},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [97]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 122},
                    {"type": InternalRuleType.CHAR_ALT, "value": 48},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.CHAR_ALT, "value": 95},
                    {"type": InternalRuleType.RULE_REF, "value": 10},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [48]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.RULE_REF, "value": 11},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [48]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [32]},
                    {"type": InternalRuleType.CHAR_ALT, "value": 9},
                    {"type": InternalRuleType.CHAR_ALT, "value": 10},
                    {"type": InternalRuleType.RULE_REF, "value": 12},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "json.gbnf (string)",
        r"""
        root ::=
        "\"" (
            [^"\\\x7F\x00-\x1F] |
            "\\" (["\\/bfnrt] | "u" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F]) # escapes
        )* "\""
        """,
        (
            [("root", 0), ("root_1", 1), ("root_2", 2), ("root_3", 3)],
            [
                [
                    {"type": InternalRuleType.CHAR, "value": [34]},
                    {"type": InternalRuleType.RULE_REF, "value": 3},
                    {"type": InternalRuleType.CHAR, "value": [34]},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR_NOT, "value": [34]},
                    {"type": InternalRuleType.CHAR_ALT, "value": 92},
                    {"type": InternalRuleType.CHAR_ALT, "value": 127},
                    {"type": InternalRuleType.CHAR_ALT, "value": 0},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 31},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [92]},
                    {"type": InternalRuleType.RULE_REF, "value": 2},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [34]},
                    {"type": InternalRuleType.CHAR_ALT, "value": 92},
                    {"type": InternalRuleType.CHAR_ALT, "value": 47},
                    {"type": InternalRuleType.CHAR_ALT, "value": 98},
                    {"type": InternalRuleType.CHAR_ALT, "value": 102},
                    {"type": InternalRuleType.CHAR_ALT, "value": 110},
                    {"type": InternalRuleType.CHAR_ALT, "value": 114},
                    {"type": InternalRuleType.CHAR_ALT, "value": 116},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [117]},
                    {"type": InternalRuleType.CHAR, "value": [48]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.CHAR_ALT, "value": 97},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 102},
                    {"type": InternalRuleType.CHAR_ALT, "value": 65},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 70},
                    {"type": InternalRuleType.CHAR, "value": [48]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.CHAR_ALT, "value": 97},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 102},
                    {"type": InternalRuleType.CHAR_ALT, "value": 65},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 70},
                    {"type": InternalRuleType.CHAR, "value": [48]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.CHAR_ALT, "value": 97},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 102},
                    {"type": InternalRuleType.CHAR_ALT, "value": 65},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 70},
                    {"type": InternalRuleType.CHAR, "value": [48]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.CHAR_ALT, "value": 97},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 102},
                    {"type": InternalRuleType.CHAR_ALT, "value": 65},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 70},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.RULE_REF, "value": 3},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "json.gbnf (full)",
        r"""
        root   ::= object
        value  ::= object | array | string | number | ("true" | "false" | "null") ws
        object ::=
          "{" ws (
                    string ":" ws value
            ("," ws string ":" ws value)*
          )? "}" ws
        array  ::=
          "[" ws (
                    value
            ("," ws value)*
          )? "]" ws
              string ::=
          "\"" (
            [^"\\\x7F\x00-\x1F] |
            "\\" (["\\/bfnrt] | "u" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F]) # escapes
          )* "\"" ws
        number ::= ("-"? ([0-9] | [1-9] [0-9]*)) ("." [0-9]+)? ([eE] [-+]? [0-9]+)? ws
        # Optional space: by convention, applied in this grammar after literal chars when allowed
        ws ::= ([ \t\n] ws)?
        """,
        (
            [
                ("root", 0),
                ("object", 1),
                ("value", 2),
                ("array", 3),
                ("string", 4),
                ("number", 5),
                ("value_6", 6),
                ("ws", 7),
                ("object_8", 8),
                ("object_9", 9),
                ("object_10", 10),
                ("object_11", 11),
                ("array_12", 12),
                ("array_13", 13),
                ("array_14", 14),
                ("array_15", 15),
                ("string_16", 16),
                ("string_17", 17),
                ("string_18", 18),
                ("number_19", 19),
                ("number_20", 20),
                ("number_21", 21),
                ("number_22", 22),
                ("number_23", 23),
                ("number_24", 24),
                ("number_25", 25),
                ("number_26", 26),
                ("number_27", 27),
                ("number_28", 28),
                ("number_29", 29),
                ("ws_30", 30),
                ("ws_31", 31),
            ],
            [
                [
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [123]},
                    {"type": InternalRuleType.RULE_REF, "value": 7},
                    {"type": InternalRuleType.RULE_REF, "value": 11},
                    {"type": InternalRuleType.CHAR, "value": [125]},
                    {"type": InternalRuleType.RULE_REF, "value": 7},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.RULE_REF, "value": 3},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.RULE_REF, "value": 4},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.RULE_REF, "value": 5},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.RULE_REF, "value": 6},
                    {"type": InternalRuleType.RULE_REF, "value": 7},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [91]},
                    {"type": InternalRuleType.RULE_REF, "value": 7},
                    {"type": InternalRuleType.RULE_REF, "value": 15},
                    {"type": InternalRuleType.CHAR, "value": [93]},
                    {"type": InternalRuleType.RULE_REF, "value": 7},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [34]},
                    {"type": InternalRuleType.RULE_REF, "value": 18},
                    {"type": InternalRuleType.CHAR, "value": [34]},
                    {"type": InternalRuleType.RULE_REF, "value": 7},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 19},
                    {"type": InternalRuleType.RULE_REF, "value": 25},
                    {"type": InternalRuleType.RULE_REF, "value": 29},
                    {"type": InternalRuleType.RULE_REF, "value": 7},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [116]},
                    {"type": InternalRuleType.CHAR, "value": [114]},
                    {"type": InternalRuleType.CHAR, "value": [117]},
                    {"type": InternalRuleType.CHAR, "value": [101]},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [102]},
                    {"type": InternalRuleType.CHAR, "value": [97]},
                    {"type": InternalRuleType.CHAR, "value": [108]},
                    {"type": InternalRuleType.CHAR, "value": [115]},
                    {"type": InternalRuleType.CHAR, "value": [101]},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [110]},
                    {"type": InternalRuleType.CHAR, "value": [117]},
                    {"type": InternalRuleType.CHAR, "value": [108]},
                    {"type": InternalRuleType.CHAR, "value": [108]},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 31},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 4},
                    {"type": InternalRuleType.CHAR, "value": [58]},
                    {"type": InternalRuleType.RULE_REF, "value": 7},
                    {"type": InternalRuleType.RULE_REF, "value": 2},
                    {"type": InternalRuleType.RULE_REF, "value": 10},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [44]},
                    {"type": InternalRuleType.RULE_REF, "value": 7},
                    {"type": InternalRuleType.RULE_REF, "value": 4},
                    {"type": InternalRuleType.CHAR, "value": [58]},
                    {"type": InternalRuleType.RULE_REF, "value": 7},
                    {"type": InternalRuleType.RULE_REF, "value": 2},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 9},
                    {"type": InternalRuleType.RULE_REF, "value": 10},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 8},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 2},
                    {"type": InternalRuleType.RULE_REF, "value": 14},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [44]},
                    {"type": InternalRuleType.RULE_REF, "value": 7},
                    {"type": InternalRuleType.RULE_REF, "value": 2},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 13},
                    {"type": InternalRuleType.RULE_REF, "value": 14},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 12},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR_NOT, "value": [34]},
                    {"type": InternalRuleType.CHAR_ALT, "value": 92},
                    {"type": InternalRuleType.CHAR_ALT, "value": 127},
                    {"type": InternalRuleType.CHAR_ALT, "value": 0},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 31},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [92]},
                    {"type": InternalRuleType.RULE_REF, "value": 17},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [34]},
                    {"type": InternalRuleType.CHAR_ALT, "value": 92},
                    {"type": InternalRuleType.CHAR_ALT, "value": 47},
                    {"type": InternalRuleType.CHAR_ALT, "value": 98},
                    {"type": InternalRuleType.CHAR_ALT, "value": 102},
                    {"type": InternalRuleType.CHAR_ALT, "value": 110},
                    {"type": InternalRuleType.CHAR_ALT, "value": 114},
                    {"type": InternalRuleType.CHAR_ALT, "value": 116},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [117]},
                    {"type": InternalRuleType.CHAR, "value": [48]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.CHAR_ALT, "value": 97},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 102},
                    {"type": InternalRuleType.CHAR_ALT, "value": 65},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 70},
                    {"type": InternalRuleType.CHAR, "value": [48]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.CHAR_ALT, "value": 97},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 102},
                    {"type": InternalRuleType.CHAR_ALT, "value": 65},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 70},
                    {"type": InternalRuleType.CHAR, "value": [48]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.CHAR_ALT, "value": 97},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 102},
                    {"type": InternalRuleType.CHAR_ALT, "value": 65},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 70},
                    {"type": InternalRuleType.CHAR, "value": [48]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.CHAR_ALT, "value": 97},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 102},
                    {"type": InternalRuleType.CHAR_ALT, "value": 65},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 70},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 16},
                    {"type": InternalRuleType.RULE_REF, "value": 18},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 20},
                    {"type": InternalRuleType.RULE_REF, "value": 21},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [45]},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [48]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [49]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.RULE_REF, "value": 22},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [48]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.RULE_REF, "value": 22},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [46]},
                    {"type": InternalRuleType.RULE_REF, "value": 24},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [48]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.RULE_REF, "value": 24},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [48]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 23},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [101]},
                    {"type": InternalRuleType.CHAR_ALT, "value": 69},
                    {"type": InternalRuleType.RULE_REF, "value": 27},
                    {"type": InternalRuleType.RULE_REF, "value": 28},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [45]},
                    {"type": InternalRuleType.CHAR_ALT, "value": 43},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [48]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.RULE_REF, "value": 28},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.CHAR, "value": [48]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 57},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 26},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [32]},
                    {"type": InternalRuleType.CHAR_ALT, "value": 9},
                    {"type": InternalRuleType.CHAR_ALT, "value": 10},
                    {"type": InternalRuleType.RULE_REF, "value": 7},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 30},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
    (
        "japanese",
        r"""
        # A probably incorrect grammar for Japanese
        root        ::= jp-char+ ([ \t\n] jp-char+)*
        jp-char     ::= hiragana | katakana | punctuation | cjk
        hiragana    ::= [ぁ-ゟ]
        katakana    ::= [ァ-ヿ]
        punctuation ::= [、-〾]
        cjk         ::= [一-鿿]
        """,
        (
            [
                ("root", 0),
                ("jp-char", 1),
                ("root_2", 2),
                ("root_3", 3),
                ("root_4", 4),
                ("root_5", 5),
                ("hiragana", 6),
                ("katakana", 7),
                ("punctuation", 8),
                ("cjk", 9),
            ],
            [
                [
                    {"type": InternalRuleType.RULE_REF, "value": 2},
                    {"type": InternalRuleType.RULE_REF, "value": 5},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 6},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.RULE_REF, "value": 7},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.RULE_REF, "value": 8},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.RULE_REF, "value": 9},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.RULE_REF, "value": 2},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [32]},
                    {"type": InternalRuleType.CHAR_ALT, "value": 9},
                    {"type": InternalRuleType.CHAR_ALT, "value": 10},
                    {"type": InternalRuleType.RULE_REF, "value": 4},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.RULE_REF, "value": 4},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.RULE_REF, "value": 1},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.RULE_REF, "value": 3},
                    {"type": InternalRuleType.RULE_REF, "value": 5},
                    {"type": InternalRuleType.ALT},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [12353]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 12447},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [12449]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 12543},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [12289]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 12350},
                    {"type": InternalRuleType.END},
                ],
                [
                    {"type": InternalRuleType.CHAR, "value": [19968]},
                    {"type": InternalRuleType.CHAR_RNG_UPPER, "value": 40959},
                    {"type": InternalRuleType.END},
                ],
            ],
        ),
    ),
]


@pytest.mark.parametrize(("key", "grammar", "expected"), test_cases)
def test_grammar_parser(key, grammar, expected):
    symbol_ids_expected, rules_expected = expected
    parsed_grammar = RulesBuilder(grammar.replace("\\n", "\n"))
    # for i, rules in enumerate(parsed_grammar.rules):
    #     for j, rule in enumerate(rules):
    #         # print(i, j, "expected", rules_expected[i][j], "received", rule)
    #         assert rule == rules_expected[i][j]
    assert parsed_grammar.rules == rules_expected
    assert list(parsed_grammar.symbol_ids.items()) == symbol_ids_expected
