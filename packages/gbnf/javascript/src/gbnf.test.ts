import { describe, test, expect, vi } from 'vitest';

import { GBNF } from './gbnf.js';
import { RulesBuilder, } from './rules-builder/index.js';
import * as _RulesBuilder from './rules-builder/index.js';
import { GrammarParseError } from './utils/errors.js';
import { afterEach } from 'node:test';
import { InternalRuleDef, InternalRuleType, SymbolIds } from './rules-builder/types.js';
import { buildRuleStack, } from './grammar-parser/build-rule-stack.js';
import * as _buildRuleStack from './grammar-parser/build-rule-stack.js';
import { Graph, } from './grammar-graph/graph.js';
import * as _Graph from './grammar-graph/graph.js';
import { ParseState, } from './grammar-graph/parse-state.js';
import * as _ParseState from './grammar-graph/parse-state.js';
import { _ } from './builder/template-tags.js';

vi.mock('./grammar-graph/parse-state.js', async () => {
  const actual = await vi.importActual('./grammar-graph/parse-state.js') as typeof _ParseState;
  class MockParseState {
  }
  return {
    ...actual,
    ParseState: vi.fn().mockImplementation(() => new MockParseState()),
  };
});

vi.mock('./grammar-parser/build-rule-stack.js', async () => {
  const actual = await vi.importActual('./grammar-parser/build-rule-stack.js') as typeof _buildRuleStack;
  return {
    ...actual,
    buildRuleStack: vi.fn()
  };
});

vi.mock('./grammar-graph/graph.js', async () => {
  const actual = await vi.importActual('./grammar-graph/graph.js') as typeof _Graph;
  class MockGraph {
  }
  return {
    ...actual,
    Graph: vi.fn().mockImplementation(() => new MockGraph()),
  };
});

vi.mock('./rules-builder/index.js', async () => {
  const actual = await vi.importActual('./rules-builder/index.js') as typeof _RulesBuilder;
  class MockRulesBuilder {
    rules: InternalRuleDef[][] = [];
    symbolIds: SymbolIds = new Map();
  }
  return {
    ...actual,
    RulesBuilder: vi.fn().mockImplementation(() => new MockRulesBuilder()),
  };
});

describe('GBNF', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should throw if rules are empty', () => {
    expect(() => GBNF('')).toThrowError(new GrammarParseError('', 0, 'No rules were found'));
  });

  test('should throw if symbol ids does not have root', () => {
    const symbolIds = new Map();
    symbolIds.set('root1', 1);
    symbolIds.set('root2', 1);
    vi.mocked(RulesBuilder).mockImplementation(() => {
      class MockRulesBuilder {
        rules: InternalRuleDef[][] = [[{ type: InternalRuleType.END }]];
        symbolIds = symbolIds;
      }
      return new MockRulesBuilder() as RulesBuilder;
    });
    expect(() => GBNF('')).toThrowError(new GrammarParseError('', 0, `Grammar does not contain a root symbol. Available symbols are: ${JSON.stringify(symbolIds.keys())}`));
  });

  test('it builds parse state', () => {
    const grammar = 'grammar';
    const initialString = 'foo';
    const symbolIds = new Map();
    symbolIds.set('root', 1);
    const rules: InternalRuleDef[][] = [
      [{ type: InternalRuleType.END }],
      [{ type: InternalRuleType.CHAR, value: [97] }],
    ];
    vi.mocked(RulesBuilder).mockImplementation(() => {
      class MockRulesBuilder {
        rules = rules;
        symbolIds = symbolIds;
      }
      return new MockRulesBuilder() as unknown as RulesBuilder;
    });
    class MockGraph { add = vi.fn().mockImplementation(() => 'foo') }
    const mockGraph = new MockGraph();
    vi.mocked(Graph).mockImplementation(() => mockGraph as unknown as Graph);
    class MockParseState { }
    const mockParseState = new MockParseState();
    vi.mocked(ParseState).mockImplementation(() => mockParseState as ParseState);
    vi.mocked(buildRuleStack).mockImplementation((rules) => rules as any);

    expect(GBNF(grammar, initialString)).toEqual(mockParseState);
    expect(buildRuleStack).toHaveBeenCalledWith(rules[0], 0, rules);
    expect(buildRuleStack).toHaveBeenCalledWith(rules[1], 1, rules);
    expect(Graph).toHaveBeenCalledWith(grammar, rules, 1);
    expect(mockGraph.add).toHaveBeenCalledWith(initialString);
    expect(ParseState).toHaveBeenCalledWith(mockGraph, 'foo');
  });

  test('it builds parse state with a GBNF Rule as input', () => {
    const grammar = _`"foo"`;
    const initialString = 'foo';
    const symbolIds = new Map();
    symbolIds.set('root', 1);
    const rules: InternalRuleDef[][] = [
      [{ type: InternalRuleType.END }],
      [{ type: InternalRuleType.CHAR, value: [97] }],
    ];
    vi.mocked(RulesBuilder).mockImplementation(() => {
      class MockRulesBuilder {
        rules = rules;
        symbolIds = symbolIds;
      }
      return new MockRulesBuilder() as unknown as RulesBuilder;
    });
    class MockGraph { add = vi.fn().mockImplementation(() => 'foo') }
    const mockGraph = new MockGraph();
    vi.mocked(Graph).mockImplementation(() => mockGraph as unknown as Graph);
    class MockParseState { }
    const mockParseState = new MockParseState();
    vi.mocked(ParseState).mockImplementation(() => mockParseState as ParseState);
    vi.mocked(buildRuleStack).mockImplementation((rules) => rules as any);

    expect(GBNF(grammar, initialString)).toEqual(mockParseState);
    expect(Graph).toHaveBeenCalledWith(grammar.toString(), rules, 1);
  });
});
