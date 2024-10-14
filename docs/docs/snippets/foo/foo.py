print("foo")
from gbnf import GBNF

grammar = GBNF('root ::= "foo" | "bar" | "baz"')  # throws if invalid grammar
print(grammar)
