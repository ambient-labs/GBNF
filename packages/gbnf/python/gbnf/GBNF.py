from .rules_builder import GrammarParseError, RulesBuilder

ValidInput = str | int | float | list[int | float]


def GBNF(grammar: str, _initial_string: ValidInput = ""):
    #   const grammar = typeof input === 'string' ? input : input.toString();

    rules_builder = RulesBuilder(grammar)
    rules, symbol_ids = rules_builder.rules, rules_builder.symbol_ids
    if len(rules) == 0:
        raise GrammarParseError(grammar, 0, "No rules were found")
    if symbol_ids.get("root") is None:
        raise GrammarParseError(grammar, 0, "Grammar does not contain a 'root' symbol")
    # root_id = symbol_ids.get("root")

    # stacked_rules = list(map(build_rule_stack, rules))
    # graph = Graph(grammar, stacked_rules, root_id)
    # return ParseState(graph, graph.add(initial_string)


#   const stackedRules: UnresolvedRule[][][] = rules.map(buildRuleStack);
#   const graph = new Graph(grammar, stackedRules, rootId);
#   return new ParseState(graph, graph.add(initialString));
