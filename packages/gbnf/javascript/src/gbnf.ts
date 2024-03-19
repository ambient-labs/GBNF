import { GrammarParseError, } from "./utils/errors.js";
import { buildRuleStack, } from "./grammar-parser/build-rule-stack.js";
import { Graph, } from "./grammar-graph/graph.js";
import { ParseState, } from "./grammar-graph/parse-state.js";
import {
  UnresolvedRule,
  ValidInput,
} from "./grammar-graph/types.js";
import { RulesBuilder, } from "./rules-builder/index.js";
import { GBNFRule, } from "./builder/gbnf-rule.js";

export const GBNF = (input: string | GBNFRule, initialString: ValidInput = ''): ParseState => {
  const grammar = typeof input === 'string' ? input : input.compile();
  const { rules, symbolIds, } = new RulesBuilder(grammar);
  if (rules.length === 0) {
    throw new GrammarParseError(grammar, 0, 'No rules were found');
  }
  if (symbolIds.get('root') === undefined) {
    throw new GrammarParseError(grammar, 0, `Grammar does not contain a root symbol. Available symbols are: ${JSON.stringify(symbolIds.keys())}`);
  }
  const rootId = symbolIds.get('root');

  const stackedRules: UnresolvedRule[][][] = rules.map(buildRuleStack);
  const graph = new Graph(grammar, stackedRules, rootId);
  return new ParseState(graph, graph.add(initialString));
};
