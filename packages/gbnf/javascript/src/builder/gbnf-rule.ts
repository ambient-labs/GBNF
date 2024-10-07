import {
  joinWith,
} from "./join.js";
import {
  customInspectSymbol,
  type CaseKind,
  type Value,
} from "./types.js";
import { GrammarBuilder, } from "./grammar-builder.js";
import { getRawValue, } from "./get-raw-value.js";
import { getStringValue, } from "./get-string-value.js";
import { GBNF, } from "../gbnf.js";
import { isRuleChar, isRuleCharExcluded, isRuleEnd, } from "../grammar-graph/type-guards.js";
import { ParseState, } from "../grammar-graph/parse-state.js";
import { getRuleNames, } from "./get-rule-names.js";
import { getGBNF, } from "./get-gbnf.js";

interface Opts {
  raw: boolean;
  name?: string;
  wrapped?: string;
  separator?: string;
}

export class GBNFRule {
  raw: boolean;
  #name?: string;
  wrapped?: string;
  separator?: string;
  constructor(
    protected strings: TemplateStringsArray,
    protected values: Value[],
    {
      raw,
      name,
      wrapped,
      separator,
    }: Opts
  ) {
    this.raw = raw;
    this.#name = name;
    this.wrapped = wrapped;
    this.separator = separator;
  }

  compile = ({
    include = [],
    caseKind = 'default',
  }: {
    caseKind?: CaseKind;
    include?: GBNFRule[];
  } = {}, parser = new GrammarBuilder()) => {
    for (const rule of include) {
      rule.addToParser(parser, caseKind, true);
    }
    this.addToParser(parser, caseKind);
    return joinWith('\n',
      ...[...parser.grammar,].sort(),
    );
  };

  clone = (opts: Partial<Opts>) => {
    return new GBNFRule(this.strings, this.values, {
      raw: this.raw,
      name: this.#name,
      wrapped: this.wrapped,
      separator: this.separator,
      ...opts,
    });
  };

  name = (name: string) => {
    return this.clone({ name, });
  };

  wrap = (wrapped = '') => {
    return this.clone({ wrapped, });
  };

  separate = (separator: string) => {
    return this.clone({ separator, });
  };

  [customInspectSymbol]() {
    return this.compile();
  }

  log = ({
    shuffle = true,
    n = Infinity,
    maxDepth = 20,
    maxRunTime = 50,
    ...opts
  }: {
    shuffle?: boolean;
    n?: number;
    maxDepth?: number;
    maxRunTime?: number;
  } & Parameters<typeof this.compile>[0] = {}) => {
    let gbnf = this.compile(opts);
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

  getGBNF = (parser: GrammarBuilder, caseKind: CaseKind) => {
    const {
      strings,
      values,
      raw,
      separator,
    } = this;

    const ruleNames = getRuleNames(values, parser, caseKind, separator);
    let inQuote = false;
    const _strings = strings.map(string => {
      if (raw) {
        const { str, inQuote: _inQuote, } = getRawValue(string, inQuote);
        inQuote = _inQuote;
        return str;
      }
      return getStringValue(string, caseKind);
    });
    return getGBNF(ruleNames, _strings, {
      raw: this.raw,
      wrapped: this.wrapped,
      separator: this.separator,
    });
  };

  addToParser = (parser: GrammarBuilder, caseKind: CaseKind, leaf = false): string => {
    const gbnf = this.getGBNF(parser, caseKind);
    return parser.addRule(gbnf, !leaf ? 'root' : this.#name);
  };
}

function shuffleSort<T>(arr: T[]): T[] {
  return arr
    .map(value => ({ value, sort: Math.random(), }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value, }) => value);
}
