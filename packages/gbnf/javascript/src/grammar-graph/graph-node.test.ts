import { describe, it, expect, vi } from 'vitest';
import { GraphNode } from './graph-node.js';
import { RuleRef } from './rule-ref.js';
import { printGraphNode } from './print.js';

import * as _print from "./print.js";
import { colorize } from './colorize.js';

// Mock the entire module
vi.mock('./print.js', async () => {
  const actual = await vi.importActual('./print') as typeof _print;
  return {
    ...actual,
  };
});

vi.mock('./colorize.js', () => ({
  colorize: vi.fn((str, color) => `[${color}]:${str}`),
}));

vi.mock('./print.js', () => ({
  printGraphNode: vi.fn().mockImplementation(node => () => node.rule.type),
}));

describe('GraphNode', () => {
  const meta = { stackId: 1, pathId: 2, stepId: 3 };
  const rule = new RuleRef(42);

  it('should construct with a rule and meta', () => {
    const node = new GraphNode(rule, meta);
    expect(node.rule).toBe(rule);
    expect(node.meta).toEqual(meta);
  });

  it('should throw if meta is undefined', () => {
    expect(() => new GraphNode(rule, undefined as any)).toThrow('Meta is undefined');
  });

  it('should correctly calculate and cache its id', () => {
    const node = new GraphNode(rule, meta);
    expect(node.id).toBe('1,2,3');
    node.meta = { stackId: 4, pathId: 5, stepId: 6 };
    // Check if it uses cached value on second access
    expect(node.id).toBe('1,2,3');
  });

  it('should delegate print to the printGraphNode function', () => {
    const node = new GraphNode(rule, meta);
    node.print({ colorize, showPosition: false });
    expect(printGraphNode).toHaveBeenCalledWith(node);
  });

  it('should handle next node linkage', () => {
    const nextNode = new GraphNode(new RuleRef(43), meta);
    const node = new GraphNode(rule, meta, nextNode);
    expect(node.next).toBe(nextNode);
  });
});

