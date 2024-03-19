export const ARITHMETIC_GRAMMAR = `
root  ::= (expr "=" ws term "\n")+
expr  ::= term ([-+*/] term)*
term  ::= ident | num | "(" ws expr ")" ws
ident ::= [a-z] [a-z0-9_]* ws
num   ::= [0-9]+ ws
ws    ::= [ \t\n]*
`;

export const CHESS_GRAMMAR = `
# Specifies chess moves as a list in algebraic notation, using PGN conventions

# Force first move to "1. ", then any 1-2 digit number after, relying on model to follow the pattern
root    ::= "1. " move " " move "\n" ([1-9] [0-9]? ". " move " " move "\n")+
move    ::= (pawn | nonpawn | castle) [+#]?

# piece type, optional file/rank, optional capture, dest file & rank
nonpawn ::= [NBKQR] [a-h]? [1-8]? "x"? [a-h] [1-8]

# optional file & capture, dest file & rank, optional promotion
pawn    ::= ([a-h] "x")? [a-h] [1-8] ("=" [NBKQR])?

castle  ::= "O-O" "-O"?
`;

export const JSON_GRAMMAR = `
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
`;

