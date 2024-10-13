from gbnf import GBNF

grammar = GBNF('root ::= "foo" | "bar" | "baz"')  # throws if invalid grammar
state = grammar("ba")  # throws if invalid input
print([*grammar])  # get rules
