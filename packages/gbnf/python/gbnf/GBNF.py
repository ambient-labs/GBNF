from .rules_builder import RulesBuilder

# import RulesBuilder from .rules_builder
# import { buildRuleStack, } from "./grammar-parser/build-rule-stack.js";
# import { Graph, } from "./grammar-parser/graph/graph.js";
# import { ParseState, } from "./grammar-parser/graph/parse-state.js";
# import { UnresolvedRule, ValidInput, } from "./grammar-parser/graph/types.js";
# import { RulesBuilder, } from "./rules-builder/rules-builder.js";

# export const GBNF = (grammar: string, initialString: ValidInput = ''): ParseState => {
#   const { rules, symbolIds, } = new RulesBuilder(grammar);
#   if (rules.length === 0) {
#     throw new Error(`Failed to parse grammar: ${grammar}`);
#   }
#   if (symbolIds.get('root') === undefined) {
#     throw new Error("Grammar does not contain a 'root' symbol");
#   }
#   const rootId = symbolIds.get('root');

#   const stackedRules: UnresolvedRule[][][] = rules.map(buildRuleStack);
#   const graph = new Graph(grammar, stackedRules, rootId);
#   return new ParseState(graph, graph.add(initialString));
# };


def GBNF(grammar: str, _initial_string: str = ""):
    rules_builder = RulesBuilder(grammar)
    rules = rules_builder.rules
    symbol_ids = rules_builder.symbol_ids
    if len(rules) == 0:
        raise Exception(f"Failed to parse grammar: {grammar}")
    if symbol_ids.get("root") is None:
        raise Exception("Grammar does not contain a 'root' symbol")
    # root_id = symbol_ids.get("root")

    return rules, symbol_ids

    # stacked_rules = list(map(build_rule_stack, rules))
    # graph = Graph(grammar, stacked_rules, root_id)
    # return ParseState(graph, graph.add(initial_string)
