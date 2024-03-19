import { describe, it, expect, vi } from 'vitest';
import { printGraphPointer, printGraphNode } from './print.js';
import { RuleChar, RuleType } from './types.js';
import { RuleRef } from './rule-ref.js';
import { type Colorize } from './colorize.js';
import { GraphPointer } from './graph-pointer.js';

import type { GraphNode } from './graph-node.js';
import { getParentStackId, } from "./get-parent-stack-id.js";
import * as _getParentStackId from "./get-parent-stack-id.js";

// Mock the entire module
vi.mock('./get-parent-stack-id.js', async () => {
  const actual = await vi.importActual('./get-parent-stack-id.js') as typeof _getParentStackId;
  return {
    ...actual,
    getParentStackId: vi.fn().mockImplementation(actual.getParentStackId),
  };
});

const COLORS = {
  '\x1b[34m': 'BLUE',
  '\x1b[36m': 'CYAN',
  '\x1b[32m': 'GREEN',
  '\x1b[31m': 'RED',
  '\x1b[90m': 'GRAY',
  '\x1b[33m': 'YELLOW',
}

const mockColorize: Colorize = (text, color) => {
  return `[${COLORS[color]}]:${text}`;
};
const createMockNode = (id, rule, next?: GraphNode) => ({
  id,
  rule,
  next,
  print: ({ colorize }) => `Node(${id})`
} as unknown as GraphNode);
const createMockGraphPointer = (node) => ({
  node,
  parent: null,
  print: ({ colorize }) => `Pointer to ${node.id}`,
} as unknown as GraphPointer);

describe('print', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('printGraphPointer', () => {
    it('prints graph pointer details correctly', () => {
      const mockNode = createMockNode(1, new RuleRef(100));
      const mockPointer = createMockGraphPointer(mockNode);
      vi.mocked(getParentStackId).mockImplementation(() => 'foo');
      const result = printGraphPointer(mockPointer)({ colorize: mockColorize });
      expect(result).toBe(`[RED]:*foo`);
    });
  });

  describe('printGraphNode', () => {
    it('prints a graph node with a character rule', () => {
      const ruleChar = {
        type: RuleType.CHAR,
        value: [65]  // ASCII for 'A'
      } as RuleChar;
      const node = createMockNode(1, ruleChar);
      const result = printGraphNode(node)({ colorize: mockColorize, showPosition: false });
      expect(result).toBe(`[GRAY]:[[YELLOW]:A[GRAY]:]`);
    });

    it('prints a graph node with a rule reference', () => {
      const ruleRef = new RuleRef(200);
      const node = createMockNode(1, ruleRef);
      const result = printGraphNode(node)({ colorize: mockColorize, showPosition: true });
      expect(result).toBe('[BLUE]:{[GRAY]:1[BLUE]:}[GRAY]:Ref([GREEN]:200[GRAY]:)');
    });
  });
});
