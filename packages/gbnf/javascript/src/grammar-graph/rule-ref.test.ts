import { describe, it, expect, vi } from 'vitest';
import { RuleRef } from './rule-ref.js';
import type { GraphNode } from './graph-node';

describe('RuleRef Class', () => {
  it('initializes with a given value', () => {
    const ruleRef = new RuleRef(123);
    expect(ruleRef.value).toBe(123);
  });

  it('allows setting and getting nodes', () => {
    const mockNodes = new Set<GraphNode>([{} as unknown as GraphNode]);
    const ruleRef = new RuleRef(123);
    ruleRef.nodes = mockNodes; // Set the nodes
    expect(ruleRef.nodes).toBe(mockNodes); // Get the nodes
  });

  it('throws an error if trying to get nodes before setting', () => {
    const ruleRef = new RuleRef(123);
    expect(() => ruleRef.nodes).toThrow('Nodes are not set');
  });
});
