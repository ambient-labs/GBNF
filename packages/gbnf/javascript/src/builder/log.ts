import { GBNF, } from "../gbnf.js";
import { isRuleChar, isRuleCharExcluded, isRuleEnd, } from "../grammar-graph/type-guards.js";
import { ParseState, } from "../grammar-graph/parse-state.js";
import { shuffleSort, } from "./shuffle-sort.js";

export type LogOptions = {
  shuffle?: boolean;
  n?: number;
  maxDepth?: number;
  maxRunTime?: number;
};

export const log = (gbnf: string, {
  shuffle = true,
  n = Infinity,
  maxDepth = 20,
  maxRunTime = 50,
}: LogOptions = {}) => {
  gbnf = gbnf.replaceAll(/\((.*?)\)\*/g, '($1)? ($1)? ($1)?');
  gbnf = gbnf.replaceAll(/\((.*?)\)\+/g, '($1)  ($1)? ($1)?');
  gbnf = gbnf.replaceAll(/\[(.*?)\]\*/g, '[$1]? [$1]? [$1]?');
  gbnf = gbnf.replaceAll(/\[(.*?)\]\+/g, '[$1]  [$1]? [$1]?');
  class Node {
    char: string;
    terminal = false;
    reachedMaxDepth = false;
    children: Node[] = [];

    constructor(char = '') {
      this.char = char;
    }
  }
  const parseState = GBNF(gbnf);
  const rootNode = new Node('');

  let remaining = n;
  const start = performance.now();
  let reachedMaximumRunTime = false;
  function traverseParseState(currentNode: Node, parseState: ParseState, remainingDepth = maxDepth) {
    if (performance.now() - start > maxRunTime) {
      reachedMaximumRunTime = true;
      return;
    }
    if (remainingDepth <= 0) {
      currentNode.reachedMaxDepth = true;
      remaining -= 1;
      return;
    }
    for (const rule of parseState) {
      if (remaining <= 0) {
        return;
      }
      if (isRuleChar(rule)) {
        for (const value of rule.value) {
          const char = Array.isArray(value) ? 'x' : String.fromCodePoint(value);
          const nextNode = new Node(char);
          currentNode.children.push(nextNode);
          traverseParseState(nextNode, parseState.add(Array.isArray(value) ? String.fromCodePoint(value[0]) : char), remainingDepth - 1);
        }
      } else if (isRuleCharExcluded(rule)) {
        for (const value of rule.value) {
          const char = Array.isArray(value) ? '^' : String.fromCodePoint(value);
          const nextNode = new Node(char);
          currentNode.children.push(nextNode);
          traverseParseState(nextNode, parseState.add(Array.isArray(value) ? String.fromCodePoint(value[0] - 1) : char), remainingDepth - 1);
        }
      } else if (isRuleEnd(rule)) {
        remaining -= 1;
        currentNode.terminal = true;
      }
    }
  }

  traverseParseState(rootNode, parseState);

  const result = new Set<string>();
  function traverse(node: Node, path = '') {
    if (result.size >= n) {
      return;
    }
    if (node.terminal || node.reachedMaxDepth || (reachedMaximumRunTime && node.children.length === 0)) {
      result.add(path);
    }
    for (const child of (shuffle ? shuffleSort(node.children) : node.children)) {
      traverse(child, path + child.char);
    }
  }
  traverse(rootNode);
  return [...result,].join('\n');
};
