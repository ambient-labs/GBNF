import { describe, it, expect } from 'vitest';
import { Graph } from './graph';
import { GraphPointer } from './graph-pointer';
import { GraphNode } from './graph-node';
import { RuleRef } from './rule-ref';
import { getSerializedRuleKey } from './get-serialized-rule-key';
import { GenericSet } from './generic-set';
import { isRuleRef, isRuleChar, isRuleCharExcluded, isRuleEnd } from './type-guards';
import { InputParseError } from '../utils/errors/input-parse-error';
import { RuleType, UnresolvedRule } from './types';

describe('Graph', () => {
  const grammar = 'example-grammar';
  const stackedRules: UnresolvedRule[][][] = [
    [
      [{ type: RuleType.CHAR, value: [65, 66, 67] }],
      [{ type: RuleType.CHAR, value: [68, 69, 70] }],
    ],
    [
      [{ type: RuleType.CHAR, value: [71, 72, 73] }],
      [{ type: RuleType.CHAR, value: [74, 75, 76] }],
    ],
  ];
  const rootId = 0;

  it('should create a Graph instance', () => {
    const graph = new Graph(grammar, stackedRules, rootId);
    expect(graph).toBeInstanceOf(Graph);
    expect(graph.grammar).toBe(grammar);
  });

  it('should get the root node', () => {
    const graph = new Graph(grammar, stackedRules, rootId);
    const rootNode = graph.getRootNode(rootId);
    expect(rootNode).toBeInstanceOf(Map);
    expect(rootNode.size).toBe(2);
  });

  it('should get the initial pointers', () => {
    const graph = new Graph(grammar, stackedRules, rootId);
    const pointers = graph.getInitialPointers();
    expect(pointers).toBeInstanceOf(GenericSet);
    expect(pointers.size).toBe(2);
  });

  describe('print', () => {
    it('should print the graph', () => {
      const graph = new Graph(grammar, stackedRules, rootId);
      const printedGraph = graph.print({ colors: true });
      expect(typeof printedGraph).toBe('string');
      expect(printedGraph).toContain('ABC');
      expect(printedGraph).toContain('DEF');
      expect(printedGraph).toContain('GHI');
    });
  });
});
