from .grammar_graph.graph import Graph
from .grammar_graph.parse_state import ParseState
from .grammar_parser.build_rule_stack import build_rule_stack
from .rules_builder import GrammarParseError, RulesBuilder

# ValidInput = str | int | float | list[int | float]


def GBNF(grammar: str, initial_string: str = ""):
    if not isinstance(grammar, str):
        raise ValueError("grammar must be a string")

    if not isinstance(initial_string, str):
        raise ValueError("input must be a string")

    #   const grammar = typeof input === 'string' ? input : input.toString();

    rules_builder = RulesBuilder(grammar)
    rules, symbol_ids = rules_builder.rules, rules_builder.symbol_ids
    if len(rules) == 0:
        raise GrammarParseError(grammar, 0, "No rules were found")
    if symbol_ids["root"] is None:
        raise GrammarParseError(grammar, 0, "Grammar does not contain a 'root' symbol")
    root_id: int = symbol_ids["root"]

    stacked_rules = [build_rule_stack(rule) for rule in rules]
    graph = Graph(grammar, stacked_rules, root_id)
    return ParseState(graph, graph.add(initial_string))
