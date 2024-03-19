import { GraphPointer, } from "./graph-pointer.js";
import { GraphNode, } from "./graph-node.js";
import { getSerializedRuleKey, } from "./get-serialized-rule-key.js";
import { colorize, } from "./colorize.js";
import { GenericSet, } from "./generic-set.js";
import {
  type UnresolvedRule,
  type Pointers,
  customInspectSymbol,
  type ValidInput,
  type ResolvedGraphPointer,
} from "./types.js";
import {
  isRange,
  isRuleChar,
  isRuleCharExcluded,
  isRuleEnd,
  isRuleRef,
} from './type-guards.js';
import { isPointInRange, } from "../utils/is-point-in-range.js";
import { InputParseError, } from "../utils/errors.js";
import { RuleRef, } from "./rule-ref.js";
import { getInputAsCodePoints, } from "./get-input-as-code-points.js";

type RootNode = Map<number, GraphNode>;
const makePointers = () => new GenericSet<ResolvedGraphPointer, string>(p => p.id);
export class Graph {
  roots = new Map<number, RootNode>();
  // rootId: number;
  #rootNode?: RootNode;
  pointers?: Pointers;
  grammar: string;

  constructor(grammar: string, stackedRules: UnresolvedRule[][][], rootId: number) {
    this.grammar = grammar;
    const ruleRefs: RuleRef[] = [];
    const uniqueRules = new GenericSet<UnresolvedRule, string>(rule => getSerializedRuleKey(rule));
    for (let stackId = 0; stackId < stackedRules.length; stackId++) {
      const stack = stackedRules[stackId];
      const nodes = new Map<number, GraphNode>();
      for (let pathId = 0; pathId < stack.length; pathId++) {
        const path = stack[pathId];
        let node: GraphNode | undefined = undefined;
        for (let stepId = path.length - 1; stepId >= 0; stepId--) {
          const next: undefined | GraphNode = node;
          const rule = stack[pathId][stepId];
          uniqueRules.add(rule);
          if (isRuleRef(rule)) {
            ruleRefs.push(rule);
          }
          // rules coming in may be identical but have different references.
          // here, we ensure we always use the same reference for an identical rule.
          // this makes future comparisons easier.
          const uniqueRule = uniqueRules.get(rule);
          if (uniqueRule === undefined) {
            throw new Error('Could not get unique rule');
          }
          node = new GraphNode(uniqueRule, { stackId, pathId, stepId, }, next);
        }
        if (node === undefined) {
          throw new Error('Could not get node');
        }
        nodes.set(pathId, node);
      }

      this.roots.set(stackId, nodes);
    }
    this.rootNode = this.roots.get(rootId);

    for (const ruleRef of ruleRefs) {
      const referencedNodes = new Set<GraphNode>();
      for (const node of this.getRootNode(ruleRef.value).values()) {
        referencedNodes.add(node);
      }
      ruleRef.nodes = referencedNodes;
    }
  }

  getRootNode = (value: number): RootNode => {
    const rootNode = this.roots.get(value);
    if (!rootNode) {
      throw new Error(`Root node not found for value: ${value}`);
    }
    return rootNode;
  };

  get rootNode(): RootNode {
    if (!this.#rootNode) {
      throw new Error('Root node is not defined');
    }
    return this.#rootNode;
  }
  set rootNode(rootNode: undefined | RootNode) {
    if (!rootNode) {
      throw new Error('Root node is not defined');
    }
    this.#rootNode = rootNode;
  }

  getInitialPointers = (): Pointers => {
    const pointers = makePointers();

    for (const { node, parent, } of this.fetchNodesForRootNode(this.rootNode)) {
      const pointer = new GraphPointer(node, parent);
      for (const resolvedPointer of this.resolvePointer(pointer)) {
        pointers.add(resolvedPointer);
      }
    }
    return pointers;
  };

  setValid(pointers: GraphPointer[], valid: boolean) {
    for (const pointer of pointers) {
      pointer.valid = valid;
    }
  }

  parse(currentPointers: Pointers, codePoint: number): Pointers {
    for (const { rule, rulePointers, } of this.iterateOverPointers(currentPointers)) {
      if (isRuleChar(rule)) {
        const valid = rule.value.reduce((
          isValid,
          possibleCodePoint,
        ) => {
          if (isValid) {
            return true;
          }
          if (isRange(possibleCodePoint)) {
            return isPointInRange(codePoint, possibleCodePoint);
          }
          return codePoint === possibleCodePoint;
        }, false);
        this.setValid(rulePointers, valid);
      } else if (isRuleCharExcluded(rule)) {
        const valid = rule.value.reduce((
          isValid,
          possibleCodePoint,
        ) => {
          if (!isValid) {
            return false;
          }
          return isRange(possibleCodePoint) ? !isPointInRange(codePoint, possibleCodePoint) : codePoint !== possibleCodePoint;
        }, true);
        this.setValid(rulePointers, valid);
      } else if (!isRuleEnd(rule)) {
        throw new Error(`Unsupported rule: ${JSON.stringify(rule)}`);
      }
    }

    // a pointer's id is the sum of its node's id and its parent's id chain.
    // if two pointers share the same id, it means they point to the same node and have identical parent chains.
    // for the purposes of walking the graph, we only need to keep one of them.
    const nextPointers = makePointers();
    for (const currentPointer of currentPointers) {
      for (const unresolvedNextPointer of currentPointer.fetchNext()) {
        for (const resolvedNextPointer of this.resolvePointer(unresolvedNextPointer)) {
          nextPointers.add(resolvedNextPointer);
        }
      }
    }
    return nextPointers;
  }

  * resolvePointer(unresolvedPointer: GraphPointer): IterableIterator<ResolvedGraphPointer> {
    for (const resolvedPointer of unresolvedPointer.resolve()) {
      if (isRuleRef(resolvedPointer.node.rule)) {
        throw new Error('Encountered a reference rule when building pointers to the graph');
      }
      if (isRuleEnd(resolvedPointer.node.rule) && !!resolvedPointer.parent) {
        throw new Error('Encountered an ending rule with a parent when building pointers to the graph');
      }
      yield resolvedPointer;
    }
  }

  public add = (src: ValidInput, _pointers?: Pointers,): Pointers => {
    let pointers = _pointers || this.getInitialPointers();
    const codePoints = getInputAsCodePoints(src);
    for (let codePointPos = 0; codePointPos < codePoints.length; codePointPos++) {
      const codePoint = codePoints[codePointPos];
      pointers = this.parse(pointers, codePoint);
      if (pointers.size === 0) {
        throw new InputParseError(codePoints, codePointPos);
      }
    }
    return pointers;
  };

  // generator that yields either the node, or if a reference rule, the referenced node
  // we need these function, as distinct from leveraging the logic in GraphPointer,
  // because that needs a rule ref with already defined nodes; this function is used to _set_ those nodes
  * fetchNodesForRootNode(
    rootNodes: Map<number, GraphNode>,
    parent?: GraphPointer,
  ): IterableIterator<{ node: GraphNode; parent?: GraphPointer; }> {
    for (const node of rootNodes.values()) {
      if (isRuleRef(node.rule)) {
        yield* this.fetchNodesForRootNode(this.getRootNode(node.rule.value), new GraphPointer(node, parent));
      } else {
        yield { node, parent, };
      }
    }
  }


  [customInspectSymbol](
    // depth: number, inspectOptions: InspectOptions, inspect: CustomInspectFunction
  ) {
    return this.print({ colors: true, });
  }

  print = ({ pointers, colors = false, }: { pointers?: Pointers; colors?: boolean } = {}) => {
    const nodes: GraphNode[][] = Array.from(this.roots.values()).map(nodes => Array.from(nodes.values()));
    const graphView = nodes.reduce<string[]>((acc, rootNode) => acc.concat(rootNode.map(node => node.print({
      pointers,
      showPosition: true,
      colorize: colors ? colorize : str => `${str}`,
    }))), []);
    return `\n${graphView.join('\n')}`;
  };

  * iterateOverPointers(pointers: Pointers): IterableIterator<{ rule: UnresolvedRule; rulePointers: GraphPointer[]; }> {
    const seenRules = new Map<UnresolvedRule, GraphPointer[]>();
    for (const pointer of pointers) {
      const rule = pointer.rule;
      if (isRuleRef(rule)) {
        throw new Error('Encountered a reference rule in the graph, this should not happen');
      }
      let seenRule = seenRules.get(rule);
      if (!seenRule) {
        seenRule = [pointer,];
        seenRules.set(rule, seenRule,);
      } else {
        seenRule.push(pointer);
      }
    }

    for (const [rule, rulePointers,] of seenRules.entries()) {
      yield { rule, rulePointers, };
    }
  }
}
