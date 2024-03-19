import { describe, it, expect, vi } from 'vitest';
import { ParseState } from './parse-state.js';
import { Graph } from './graph.js';
import { ResolvedRule } from './types.js';

// Mock implementations for Graph and Pointers
const mockGraph = {
  add: vi.fn(),
  grammar: 'sample-grammar',
};
const mockPointers = new Set([{ rule: { type: 'char', value: [65] } }]); // ASCII 'A'

vi.mock('./graph.js', () => ({
  Graph: vi.fn(() => mockGraph),
}));

describe('ParseState', () => {
  it('constructs with given graph and pointers', () => {
    const parseState = new ParseState(mockGraph, mockPointers);
    expect(parseState).toBeInstanceOf(ParseState);
  });

  it('returns unique rules from pointers', () => {
    const parseState = new ParseState(mockGraph, mockPointers);
    const rules = Array.from(parseState.rules());
    expect(rules.length).toBe(1);
    expect(rules[0].value).toEqual([65]);
  });

  it('iterates over unique rules using Symbol.iterator', () => {
    const parseState = new ParseState(mockGraph, mockPointers);
    const rules = [...parseState];
    expect(rules.length).toBe(1);
    expect(rules[0].type).toBe('char');
  });

  it('adds new input and returns new ParseState with updated pointers', () => {
    const newPointers = new Set([{ rule: { type: 'char', value: [66] } }]); // ASCII 'B'
    mockGraph.add.mockReturnValue(newPointers);

    const parseState = new ParseState(mockGraph, mockPointers);
    const newState = parseState.add('B');
    expect(newState).toBeInstanceOf(ParseState);
    expect(mockGraph.add).toHaveBeenCalledWith('B', mockPointers);
  });

  it('calculates the size of unique rules correctly', () => {
    const parseState = new ParseState(mockGraph, mockPointers);
    const size = parseState.size;
    expect(size).toBe(1);
  });

  it('provides access to the underlying graph grammar', () => {
    const parseState = new ParseState(mockGraph, mockPointers);
    expect(parseState.grammar).toBe('sample-grammar');
  });
});

