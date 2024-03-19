import { describe, it, expect } from 'vitest';
import { getParentStackId } from './get-parent-stack-id.js';
import type { GraphPointer } from './graph-pointer.js';
import { Color } from './colorize.js';

// Mocks for dependencies
const s = (str: string) => JSON.stringify(str);
const mockColorize = (text, color) => `[${s(color)}]:${text}`;
const red = s(Color.RED);
const gray = s(Color.GRAY);

const createMockPointer = (stackId: number, pathId: number, stepId: number, parent?: GraphPointer) => ({
  node: {
    meta: { stackId, pathId, stepId },
  },
  parent,
} as unknown as GraphPointer);

describe('getParentStackId', () => {
  it('returns an empty string if no parents', () => {
    const pointer = createMockPointer(1, 1, 1);
    const result = getParentStackId(pointer, mockColorize);
    expect(result).toBe('');
  });

  it('returns a single parent id colored correctly', () => {
    const parentPointer = createMockPointer(1, 1, 1);
    const pointer = createMockPointer(2, 2, 2, parentPointer);
    const result = getParentStackId(pointer, mockColorize);
    expect(result).toBe(`[${red}]:1,1,1`);
  });

  it('returns multiple parent ids separated by colored arrows', () => {
    const grandparentPointer = createMockPointer(0, 0, 0);
    const parentPointer = createMockPointer(1, 1, 1, grandparentPointer);
    const pointer = createMockPointer(2, 2, 2, parentPointer);
    const result = getParentStackId(pointer, mockColorize);
    const expectedOutput = `[${red}]:1,1,1[${gray}]:<-[${red}]:0,0,0`;
    expect(result).toBe(expectedOutput);
  });

  it('handles deep nesting of pointers', () => {
    const greatGrandparentPointer = createMockPointer(0, 0, 0);
    const grandparentPointer = createMockPointer(1, 1, 1, greatGrandparentPointer);
    const parentPointer = createMockPointer(2, 2, 2, grandparentPointer);
    const pointer = createMockPointer(3, 3, 3, parentPointer);
    const result = getParentStackId(pointer, mockColorize);
    const expectedOutput = `[${red}]:2,2,2[${gray}]:<-[${red}]:1,1,1[${gray}]:<-[${red}]:0,0,0`;
    expect(result).toBe(expectedOutput);
  });
});
