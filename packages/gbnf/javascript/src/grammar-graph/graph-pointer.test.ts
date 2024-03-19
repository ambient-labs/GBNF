import { describe, it, expect, vi } from 'vitest';
import { GraphPointer } from './graph-pointer.js';

import {
  isGraphPointerRuleRef,
  isGraphPointerRuleEnd,
  isGraphPointerRuleChar,
  isGraphPointerRuleCharExclude,
  RuleEnd,
  RuleType,
  UnresolvedRule,
} from './types.js';
import * as _types from "./types.js";
import { GraphNode } from './graph-node.js';
import { RuleRef } from './rule-ref.js';

vi.mock('./types.js', async () => {
  const actual = await vi.importActual('./types.js') as typeof _types;
  return {
    ...actual,
    isGraphPointerRuleRef: vi.fn(),
    isGraphPointerRuleEnd: vi.fn(),
    isGraphPointerRuleChar: vi.fn(),
    isGraphPointerRuleCharExclude: vi.fn(),
  };
});

describe('GraphPointer', () => {
  describe('constructor', () => {
    it('initializes correctly with just node parameter', () => {
      const node = new GraphNode({ type: RuleType.END }, { stackId: 1, pathId: 2, stepId: 3 });
      const pointer = new GraphPointer(node);
      expect(pointer.node).toBe(node);
      expect(pointer.id).toBe('1,2,3');
      expect(pointer.parent).toBeUndefined();
    });

    it('throws an error if node is undefined', () => {
      expect(() => new GraphPointer(undefined as any)).toThrow('Node is undefined');
    });

    it('initializes correctly with node and parent', () => {
      const parentNode = new GraphNode({ type: RuleType.CHAR, value: [97] }, { stackId: 1, pathId: 2, stepId: 3 });
      const childNode = new GraphNode({ type: RuleType.CHAR, value: [98] }, { stackId: 4, pathId: 5, stepId: 6 });
      const parentPointer = new GraphPointer(parentNode);
      const childPointer = new GraphPointer(childNode, parentPointer);
      expect(childPointer.parent).toBe(parentPointer);
      expect(childPointer.id).toBe('1,2,3-4,5,6');
    });
  });

  describe('resolve method', () => {
    it('throws an error on unknown rule types', () => {
      // Create a GraphNode with an unhandled rule type
      const unhandledRule = { type: 'UNKNOWN_RULE_TYPE' };
      const node = new GraphNode(unhandledRule as any, { stackId: 1, pathId: 2, stepId: 3 });
      const pointer = new GraphPointer(node);

      vi.mocked(isGraphPointerRuleRef).mockImplementation(() => false);
      vi.mocked(isGraphPointerRuleEnd).mockImplementation(() => false);
      vi.mocked(isGraphPointerRuleChar).mockImplementation(() => false);
      vi.mocked(isGraphPointerRuleCharExclude).mockImplementation(() => false);

      expect(() => {
        Array.from(pointer.resolve());
      }).toThrow(/Unknown rule/);
    });

    it('yields a char rule', () => {
      const rule = { type: RuleType.CHAR, value: [97] };
      const node = new GraphNode(rule, { stackId: 1, pathId: 2, stepId: 3 });
      const pointer = new GraphPointer(node);

      vi.mocked(isGraphPointerRuleRef).mockImplementation(() => false);
      vi.mocked(isGraphPointerRuleEnd).mockImplementation(() => false);
      vi.mocked(isGraphPointerRuleChar).mockImplementation(() => true);
      vi.mocked(isGraphPointerRuleCharExclude).mockImplementation(() => false);

      expect(Array.from(pointer.resolve())).toEqual([pointer]);
    });

    it('yields a char excluded rule', () => {
      const rule = { type: RuleType.CHAR_EXCLUDE, value: [97] };
      const node = new GraphNode(rule, { stackId: 1, pathId: 2, stepId: 3 });
      const pointer = new GraphPointer(node);

      vi.mocked(isGraphPointerRuleRef).mockImplementation(() => false);
      vi.mocked(isGraphPointerRuleEnd).mockImplementation(() => false);
      vi.mocked(isGraphPointerRuleChar).mockImplementation(() => false);
      vi.mocked(isGraphPointerRuleCharExclude).mockImplementation(() => true);

      expect(Array.from(pointer.resolve())).toEqual([pointer]);
    });

    it('yields an end rule without a parent', () => {
      const rule = { type: RuleType.END } as RuleEnd;
      const node = new GraphNode(rule, { stackId: 1, pathId: 2, stepId: 3 });
      const pointer = new GraphPointer(node);

      vi.mocked(isGraphPointerRuleRef).mockImplementation(() => false);
      vi.mocked(isGraphPointerRuleEnd).mockImplementation(() => true);
      vi.mocked(isGraphPointerRuleChar).mockImplementation(() => false);
      vi.mocked(isGraphPointerRuleCharExclude).mockImplementation(() => false);

      expect(Array.from(pointer.resolve())).toEqual([pointer]);
    });

    it('yields an end rule with a parent', () => {
      const rule = { type: RuleType.END } as RuleEnd;
      const parentPointer = new GraphPointer(new GraphNode(rule, { stackId: 2, pathId: 1, stepId: 1 }));
      const childPointer = new GraphPointer(new GraphNode(rule, { stackId: 1, pathId: 1, stepId: 1 }), parentPointer);

      vi.mocked(isGraphPointerRuleRef).mockImplementation(() => false);
      vi.mocked(isGraphPointerRuleEnd).mockImplementation(() => true);
      vi.mocked(isGraphPointerRuleChar).mockImplementation(() => false);
      vi.mocked(isGraphPointerRuleCharExclude).mockImplementation(() => false);

      expect(Array.from(childPointer.resolve())).toEqual([parentPointer]);
    });

    it('yields an end rule with a grandparent', () => {
      const rule = { type: RuleType.END } as RuleEnd;
      const grandParentPointer = new GraphPointer(new GraphNode(rule, { stackId: 2, pathId: 1, stepId: 1 }));
      const parentPointer = new GraphPointer(new GraphNode(rule, { stackId: 2, pathId: 1, stepId: 1 }), grandParentPointer);
      const childPointer = new GraphPointer(new GraphNode(rule, { stackId: 1, pathId: 1, stepId: 1 }), parentPointer);

      vi.mocked(isGraphPointerRuleRef).mockImplementation(() => false);
      vi.mocked(isGraphPointerRuleEnd).mockImplementation(() => true);
      vi.mocked(isGraphPointerRuleChar).mockImplementation(() => false);
      vi.mocked(isGraphPointerRuleCharExclude).mockImplementation(() => false);

      expect(Array.from(childPointer.resolve())).toEqual([grandParentPointer]);
    });

    it('yields an end rule\'s parent that is not an end with a grandparent', () => {
      const rule = { type: RuleType.END } as RuleEnd;
      const grandParentPointer = new GraphPointer(new GraphNode(rule, { stackId: 2, pathId: 1, stepId: 1 }));
      const parentPointer = new GraphPointer(new GraphNode({ type: RuleType.CHAR, value: [97] }, { stackId: 2, pathId: 1, stepId: 1 }), grandParentPointer);
      const childPointer = new GraphPointer(new GraphNode(rule, { stackId: 1, pathId: 1, stepId: 1 }), parentPointer);

      vi.mocked(isGraphPointerRuleRef).mockImplementation(() => false);
      vi.mocked(isGraphPointerRuleEnd).mockImplementation((pointer: GraphPointer<UnresolvedRule>) => 'type' in pointer.rule && pointer.rule.type === RuleType.END);
      vi.mocked(isGraphPointerRuleChar).mockImplementation((pointer: GraphPointer<UnresolvedRule>) => 'type' in pointer.rule && pointer.rule.type === RuleType.CHAR);
      vi.mocked(isGraphPointerRuleCharExclude).mockImplementation(() => false);

      expect(Array.from(childPointer.resolve())).toEqual([parentPointer]);
    });
  });
});
