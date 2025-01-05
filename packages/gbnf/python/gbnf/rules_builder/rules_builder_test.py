import pytest

from .rules_builder import RulesBuilder
from .rules_builder_types import (
    InternalRuleDefAlt,
    InternalRuleDefChar,
    InternalRuleDefCharAlt,
    InternalRuleDefCharNot,
    InternalRuleDefCharRngUpper,
    InternalRuleDefEnd,
    InternalRuleDefReference,
)

test_cases = [
    (
        "single-string",
        'root ::= "foo"',
        (
            [("root", 0)],
            [
                [
                    InternalRuleDefChar(value=[ord("f")]),
                    InternalRuleDefChar(value=[ord("o")]),
                    InternalRuleDefChar(value=[ord("o")]),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefChar(value=[ord('"')]),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefReference(value=1),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[ord("b")]),
                    InternalRuleDefChar(value=[ord("a")]),
                    InternalRuleDefChar(value=[ord("r")]),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefReference(value=1),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[ord("b")]),
                    InternalRuleDefChar(value=[ord("a")]),
                    InternalRuleDefChar(value=[ord("r")]),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefReference(value=4),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=2),
                    InternalRuleDefChar(value=[61]),
                    InternalRuleDefReference(value=3),
                    InternalRuleDefChar(value=[10]),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=3),
                    InternalRuleDefReference(value=6),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=7),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=1),
                    InternalRuleDefReference(value=4),
                    InternalRuleDefAlt(),
                    InternalRuleDefReference(value=1),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[45]),
                    InternalRuleDefCharAlt(value=43),
                    InternalRuleDefCharAlt(value=42),
                    InternalRuleDefCharAlt(value=47),
                    InternalRuleDefReference(value=3),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=5),
                    InternalRuleDefReference(value=6),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[48]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefReference(value=7),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[48]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefReference(value=5),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=2),
                    InternalRuleDefChar(value=[61]),
                    InternalRuleDefReference(value=3),
                    InternalRuleDefReference(value=4),
                    InternalRuleDefChar(value=[10]),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=4),
                    InternalRuleDefReference(value=7),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=12),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=8),
                    InternalRuleDefAlt(),
                    InternalRuleDefReference(value=9),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[40]),
                    InternalRuleDefReference(value=3),
                    InternalRuleDefReference(value=2),
                    InternalRuleDefChar(value=[41]),
                    InternalRuleDefReference(value=3),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=1),
                    InternalRuleDefReference(value=5),
                    InternalRuleDefAlt(),
                    InternalRuleDefReference(value=1),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[45]),
                    InternalRuleDefCharAlt(value=43),
                    InternalRuleDefCharAlt(value=42),
                    InternalRuleDefCharAlt(value=47),
                    InternalRuleDefReference(value=4),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=6),
                    InternalRuleDefReference(value=7),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[97]),
                    InternalRuleDefCharRngUpper(value=122),
                    InternalRuleDefReference(value=10),
                    InternalRuleDefReference(value=3),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=11),
                    InternalRuleDefReference(value=3),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[97]),
                    InternalRuleDefCharRngUpper(value=122),
                    InternalRuleDefCharAlt(value=48),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefCharAlt(value=95),
                    InternalRuleDefReference(value=10),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[48]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefReference(value=11),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[48]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[32]),
                    InternalRuleDefCharAlt(value=9),
                    InternalRuleDefCharAlt(value=10),
                    InternalRuleDefReference(value=12),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefChar(value=[ord("ぁ")]),
                    InternalRuleDefCharRngUpper(value=ord("ゟ")),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefChar(value=[ord("a")]),
                    InternalRuleDefCharAlt(value=ord("z")),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefChar(value=[ord("a")]),
                    InternalRuleDefCharRngUpper(value=ord("z")),
                    InternalRuleDefCharAlt(value=ord("A")),
                    InternalRuleDefCharRngUpper(value=ord("Z")),
                    InternalRuleDefCharAlt(value=ord("0")),
                    InternalRuleDefCharRngUpper(value=ord("9")),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefChar(value=[ord("a")]),
                    InternalRuleDefCharRngUpper(value=ord("z")),
                    InternalRuleDefCharAlt(value=ord("-")),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefChar(value=[ord("f")]),
                    InternalRuleDefReference(value=1),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[ord("b")]),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[ord("a")]),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefReference(value=1),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[ord("f")]),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefReference(value=1),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[ord("f")]),
                    InternalRuleDefReference(value=1),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefReference(value=1),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[ord("f")]),
                    InternalRuleDefReference(value=1),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[ord("f")]),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefReference(value=1),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[ord("a")]),
                    InternalRuleDefCharRngUpper(value=ord("z")),
                    InternalRuleDefCharAlt(value=ord("A")),
                    InternalRuleDefCharRngUpper(value=ord("Z")),
                    InternalRuleDefCharAlt(value=ord("0")),
                    InternalRuleDefCharRngUpper(value=ord("9")),
                    InternalRuleDefReference(value=1),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefChar(value=[ord("f")]),
                    InternalRuleDefReference(value=2),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[ord("b")]),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[ord("a")]),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=1),
                    InternalRuleDefReference(value=2),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefCharNot(value=[ord("\n")]),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefCharNot(value=[ord("0")]),
                    InternalRuleDefCharRngUpper(value=ord("9")),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefReference(value=1),
                    InternalRuleDefChar(value=[ord("\n")]),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefCharNot(value=[ord("\n")]),
                    InternalRuleDefReference(value=1),
                    InternalRuleDefAlt(),
                    InternalRuleDefCharNot(value=[ord("\n")]),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefChar(value=[34]),
                    InternalRuleDefReference(value=2),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefCharNot(value=[34]),
                    InternalRuleDefCharAlt(value=97),
                    InternalRuleDefCharAlt(value=98),
                    InternalRuleDefCharAlt(value=99),
                    InternalRuleDefCharAlt(value=100),
                    InternalRuleDefCharAlt(value=101),
                    InternalRuleDefCharAlt(value=102),
                    InternalRuleDefCharAlt(value=103),
                    InternalRuleDefCharAlt(value=104),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=1),
                    InternalRuleDefReference(value=2),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefChar(value=[34]),
                    InternalRuleDefReference(value=2),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefCharNot(value=[34]),
                    InternalRuleDefCharAlt(value=97),
                    InternalRuleDefCharAlt(value=98),
                    InternalRuleDefCharAlt(value=99),
                    InternalRuleDefCharAlt(value=100),
                    InternalRuleDefCharAlt(value=101),
                    InternalRuleDefCharAlt(value=102),
                    InternalRuleDefCharAlt(value=103),
                    InternalRuleDefCharAlt(value=104),
                    InternalRuleDefCharAlt(value=65),
                    InternalRuleDefCharRngUpper(value=ord("Z")),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=1),
                    InternalRuleDefReference(value=2),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
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
                        InternalRuleDefChar(value=[actual_char]),
                        InternalRuleDefEnd(),
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
                    InternalRuleDefReference(value=4),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=2),
                    InternalRuleDefChar(value=[61]),
                    InternalRuleDefReference(value=3),
                    InternalRuleDefChar(value=[10]),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=3),
                    InternalRuleDefReference(value=6),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=7),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=1),
                    InternalRuleDefReference(value=4),
                    InternalRuleDefAlt(),
                    InternalRuleDefReference(value=1),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[45]),
                    InternalRuleDefCharAlt(value=43),
                    InternalRuleDefCharAlt(value=42),
                    InternalRuleDefCharAlt(value=47),
                    InternalRuleDefReference(value=3),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=5),
                    InternalRuleDefReference(value=6),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[48]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefReference(value=7),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[48]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefReference(value=1),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[97]),
                    InternalRuleDefCharRngUpper(value=122),
                    InternalRuleDefCharAlt(value=48),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefCharAlt(value=95),
                    InternalRuleDefReference(value=1),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefChar(value=[97]),
                    InternalRuleDefCharRngUpper(value=122),
                    InternalRuleDefReference(value=1),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[97]),
                    InternalRuleDefCharRngUpper(value=122),
                    InternalRuleDefCharAlt(value=48),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefCharAlt(value=95),
                    InternalRuleDefReference(value=1),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefReference(value=1),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[97]),
                    InternalRuleDefCharRngUpper(value=122),
                    InternalRuleDefReference(value=2),
                    InternalRuleDefReference(value=3),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[97]),
                    InternalRuleDefCharRngUpper(value=122),
                    InternalRuleDefCharAlt(value=48),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefCharAlt(value=95),
                    InternalRuleDefReference(value=2),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=4),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[32]),
                    InternalRuleDefCharAlt(value=9),
                    InternalRuleDefCharAlt(value=10),
                    InternalRuleDefReference(value=4),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefChar(value=[42]),  # \x2A
                    InternalRuleDefChar(value=[111]),  # \u006F
                    InternalRuleDefChar(value=[128169]),  # \U0001F4A9
                    InternalRuleDefChar(value=[9]),  # \t
                    InternalRuleDefChar(value=[10]),  # \n
                    InternalRuleDefChar(value=[13]),  # \r
                    InternalRuleDefChar(value=[34]),  # \"
                    InternalRuleDefChar(value=[91]),  # \[
                    InternalRuleDefChar(value=[93]),  # \]
                    InternalRuleDefChar(value=[92]),  # \\
                    InternalRuleDefEnd(),
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
                    InternalRuleDefChar(value=[42]),
                    InternalRuleDefChar(value=[111]),
                    InternalRuleDefChar(value=[128169]),
                    InternalRuleDefChar(value=[9]),
                    InternalRuleDefChar(value=[10]),
                    InternalRuleDefChar(value=[13]),
                    InternalRuleDefChar(value=[34]),
                    InternalRuleDefChar(value=[91]),
                    InternalRuleDefChar(value=[93]),
                    InternalRuleDefChar(value=[92]),
                    InternalRuleDefReference(value=1),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[42]),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[111]),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[128169]),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[9]),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[10]),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[13]),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[34]),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[91]),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[93]),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[92]),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefReference(value=5),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=2),
                    InternalRuleDefChar(value=[61]),
                    InternalRuleDefReference(value=3),
                    InternalRuleDefReference(value=4),
                    InternalRuleDefChar(value=[10]),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=4),
                    InternalRuleDefReference(value=7),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=12),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=8),
                    InternalRuleDefAlt(),
                    InternalRuleDefReference(value=9),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[40]),
                    InternalRuleDefReference(value=3),
                    InternalRuleDefReference(value=2),
                    InternalRuleDefChar(value=[41]),
                    InternalRuleDefReference(value=3),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=1),
                    InternalRuleDefReference(value=5),
                    InternalRuleDefAlt(),
                    InternalRuleDefReference(value=1),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[45]),
                    InternalRuleDefCharAlt(value=43),
                    InternalRuleDefCharAlt(value=42),
                    InternalRuleDefCharAlt(value=47),
                    InternalRuleDefReference(value=4),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=6),
                    InternalRuleDefReference(value=7),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[97]),
                    InternalRuleDefCharRngUpper(value=122),
                    InternalRuleDefReference(value=10),
                    InternalRuleDefReference(value=3),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=11),
                    InternalRuleDefReference(value=3),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[97]),
                    InternalRuleDefCharRngUpper(value=122),
                    InternalRuleDefCharAlt(value=48),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefCharAlt(value=95),
                    InternalRuleDefReference(value=10),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[48]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefReference(value=11),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[48]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[32]),
                    InternalRuleDefCharAlt(value=9),
                    InternalRuleDefCharAlt(value=10),
                    InternalRuleDefReference(value=12),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefChar(value=[34]),
                    InternalRuleDefReference(value=3),
                    InternalRuleDefChar(value=[34]),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefCharNot(value=[34]),
                    InternalRuleDefCharAlt(value=92),
                    InternalRuleDefCharAlt(value=127),
                    InternalRuleDefCharAlt(value=0),
                    InternalRuleDefCharRngUpper(value=31),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[92]),
                    InternalRuleDefReference(value=2),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[34]),
                    InternalRuleDefCharAlt(value=92),
                    InternalRuleDefCharAlt(value=47),
                    InternalRuleDefCharAlt(value=98),
                    InternalRuleDefCharAlt(value=102),
                    InternalRuleDefCharAlt(value=110),
                    InternalRuleDefCharAlt(value=114),
                    InternalRuleDefCharAlt(value=116),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[117]),
                    InternalRuleDefChar(value=[48]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefCharAlt(value=97),
                    InternalRuleDefCharRngUpper(value=102),
                    InternalRuleDefCharAlt(value=65),
                    InternalRuleDefCharRngUpper(value=70),
                    InternalRuleDefChar(value=[48]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefCharAlt(value=97),
                    InternalRuleDefCharRngUpper(value=102),
                    InternalRuleDefCharAlt(value=65),
                    InternalRuleDefCharRngUpper(value=70),
                    InternalRuleDefChar(value=[48]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefCharAlt(value=97),
                    InternalRuleDefCharRngUpper(value=102),
                    InternalRuleDefCharAlt(value=65),
                    InternalRuleDefCharRngUpper(value=70),
                    InternalRuleDefChar(value=[48]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefCharAlt(value=97),
                    InternalRuleDefCharRngUpper(value=102),
                    InternalRuleDefCharAlt(value=65),
                    InternalRuleDefCharRngUpper(value=70),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=1),
                    InternalRuleDefReference(value=3),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefReference(value=1),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[123]),
                    InternalRuleDefReference(value=7),
                    InternalRuleDefReference(value=11),
                    InternalRuleDefChar(value=[125]),
                    InternalRuleDefReference(value=7),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=1),
                    InternalRuleDefAlt(),
                    InternalRuleDefReference(value=3),
                    InternalRuleDefAlt(),
                    InternalRuleDefReference(value=4),
                    InternalRuleDefAlt(),
                    InternalRuleDefReference(value=5),
                    InternalRuleDefAlt(),
                    InternalRuleDefReference(value=6),
                    InternalRuleDefReference(value=7),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[91]),
                    InternalRuleDefReference(value=7),
                    InternalRuleDefReference(value=15),
                    InternalRuleDefChar(value=[93]),
                    InternalRuleDefReference(value=7),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[34]),
                    InternalRuleDefReference(value=18),
                    InternalRuleDefChar(value=[34]),
                    InternalRuleDefReference(value=7),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=19),
                    InternalRuleDefReference(value=25),
                    InternalRuleDefReference(value=29),
                    InternalRuleDefReference(value=7),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[116]),
                    InternalRuleDefChar(value=[114]),
                    InternalRuleDefChar(value=[117]),
                    InternalRuleDefChar(value=[101]),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[102]),
                    InternalRuleDefChar(value=[97]),
                    InternalRuleDefChar(value=[108]),
                    InternalRuleDefChar(value=[115]),
                    InternalRuleDefChar(value=[101]),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[110]),
                    InternalRuleDefChar(value=[117]),
                    InternalRuleDefChar(value=[108]),
                    InternalRuleDefChar(value=[108]),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=31),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=4),
                    InternalRuleDefChar(value=[58]),
                    InternalRuleDefReference(value=7),
                    InternalRuleDefReference(value=2),
                    InternalRuleDefReference(value=10),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[44]),
                    InternalRuleDefReference(value=7),
                    InternalRuleDefReference(value=4),
                    InternalRuleDefChar(value=[58]),
                    InternalRuleDefReference(value=7),
                    InternalRuleDefReference(value=2),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=9),
                    InternalRuleDefReference(value=10),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=8),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=2),
                    InternalRuleDefReference(value=14),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[44]),
                    InternalRuleDefReference(value=7),
                    InternalRuleDefReference(value=2),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=13),
                    InternalRuleDefReference(value=14),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=12),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefCharNot(value=[34]),
                    InternalRuleDefCharAlt(value=92),
                    InternalRuleDefCharAlt(value=127),
                    InternalRuleDefCharAlt(value=0),
                    InternalRuleDefCharRngUpper(value=31),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[92]),
                    InternalRuleDefReference(value=17),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[34]),
                    InternalRuleDefCharAlt(value=92),
                    InternalRuleDefCharAlt(value=47),
                    InternalRuleDefCharAlt(value=98),
                    InternalRuleDefCharAlt(value=102),
                    InternalRuleDefCharAlt(value=110),
                    InternalRuleDefCharAlt(value=114),
                    InternalRuleDefCharAlt(value=116),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[117]),
                    InternalRuleDefChar(value=[48]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefCharAlt(value=97),
                    InternalRuleDefCharRngUpper(value=102),
                    InternalRuleDefCharAlt(value=65),
                    InternalRuleDefCharRngUpper(value=70),
                    InternalRuleDefChar(value=[48]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefCharAlt(value=97),
                    InternalRuleDefCharRngUpper(value=102),
                    InternalRuleDefCharAlt(value=65),
                    InternalRuleDefCharRngUpper(value=70),
                    InternalRuleDefChar(value=[48]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefCharAlt(value=97),
                    InternalRuleDefCharRngUpper(value=102),
                    InternalRuleDefCharAlt(value=65),
                    InternalRuleDefCharRngUpper(value=70),
                    InternalRuleDefChar(value=[48]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefCharAlt(value=97),
                    InternalRuleDefCharRngUpper(value=102),
                    InternalRuleDefCharAlt(value=65),
                    InternalRuleDefCharRngUpper(value=70),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=16),
                    InternalRuleDefReference(value=18),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=20),
                    InternalRuleDefReference(value=21),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[45]),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[48]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[49]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefReference(value=22),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[48]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefReference(value=22),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[46]),
                    InternalRuleDefReference(value=24),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[48]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefReference(value=24),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[48]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=23),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[101]),
                    InternalRuleDefCharAlt(value=69),
                    InternalRuleDefReference(value=27),
                    InternalRuleDefReference(value=28),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[45]),
                    InternalRuleDefCharAlt(value=43),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[48]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefReference(value=28),
                    InternalRuleDefAlt(),
                    InternalRuleDefChar(value=[48]),
                    InternalRuleDefCharRngUpper(value=57),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=26),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[32]),
                    InternalRuleDefCharAlt(value=9),
                    InternalRuleDefCharAlt(value=10),
                    InternalRuleDefReference(value=7),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=30),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
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
                    InternalRuleDefReference(value=2),
                    InternalRuleDefReference(value=5),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=6),
                    InternalRuleDefAlt(),
                    InternalRuleDefReference(value=7),
                    InternalRuleDefAlt(),
                    InternalRuleDefReference(value=8),
                    InternalRuleDefAlt(),
                    InternalRuleDefReference(value=9),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=1),
                    InternalRuleDefReference(value=2),
                    InternalRuleDefAlt(),
                    InternalRuleDefReference(value=1),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[32]),
                    InternalRuleDefCharAlt(value=9),
                    InternalRuleDefCharAlt(value=10),
                    InternalRuleDefReference(value=4),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=1),
                    InternalRuleDefReference(value=4),
                    InternalRuleDefAlt(),
                    InternalRuleDefReference(value=1),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefReference(value=3),
                    InternalRuleDefReference(value=5),
                    InternalRuleDefAlt(),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[12353]),
                    InternalRuleDefCharRngUpper(value=12447),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[12449]),
                    InternalRuleDefCharRngUpper(value=12543),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[12289]),
                    InternalRuleDefCharRngUpper(value=12350),
                    InternalRuleDefEnd(),
                ],
                [
                    InternalRuleDefChar(value=[19968]),
                    InternalRuleDefCharRngUpper(value=40959),
                    InternalRuleDefEnd(),
                ],
            ],
        ),
    ),
]


@pytest.mark.parametrize(("key", "grammar", "expected"), test_cases)
def test_grammar_parser(key, grammar, expected):
    symbol_ids_expected, rules_expected = expected
    parsed_grammar = RulesBuilder(grammar.replace("\\n", "\n"))
    assert parsed_grammar.rules == rules_expected
    assert list(parsed_grammar.symbol_ids.items()) == symbol_ids_expected
