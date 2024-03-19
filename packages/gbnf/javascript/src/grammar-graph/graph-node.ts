import { colorize, } from "./colorize.js";
import { printGraphNode, } from "./print.js";
import { RuleRef, } from "./rule-ref.js";
import { type UnresolvedRule, customInspectSymbol, } from "./types.js";

interface GraphNodeMeta {
  stackId: number;
  pathId: number;
  stepId: number;
}
export type GraphNodeRuleRef = GraphNode<RuleRef>;
export class GraphNode<R extends UnresolvedRule = UnresolvedRule> {
  rule: R;
  next?: GraphNode;
  meta: GraphNodeMeta;
  #id?: string;
  constructor(rule: R, meta: GraphNodeMeta, next?: GraphNode) {
    this.rule = rule;
    if (meta === undefined) {
      throw new Error('Meta is undefined');
    }
    this.meta = meta;
    this.next = next;
  }

  get id() {
    if (!this.#id) {
      this.#id = `${this.meta.stackId},${this.meta.pathId},${this.meta.stepId}`;
    }
    return this.#id;
  }

  [customInspectSymbol]() {
    return this.print({ colorize, showPosition: false, });
  }

  print = printGraphNode(this);
}
