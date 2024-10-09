import type { Graph, } from "./graph.js";
import type { Pointers, ResolvedRule, } from "./types.js";


export class ParseState extends Function {
  protected _graph: Graph;
  protected _pointers: Pointers;

  constructor(graph: Graph, pointers: Pointers) {
    super();
    this._graph = graph;
    this._pointers = pointers;
    return new Proxy(this, {
      apply: (target, _, args: [string]) => {
        const _call = target._call.bind(target);
        return _call(...args);
      },
    });
  }

  _call(input: string) {
    return this.add(input);
  }

  __call__(input: string): ParseState {
    return this.add(input);
  }

  *[Symbol.iterator](): IterableIterator<ResolvedRule> {
    yield* this.rules();
  }

  *rules(): IterableIterator<ResolvedRule> {
    const rules = new Set<string>();
    for (const { rule, } of this._pointers) {
      const key = JSON.stringify(rule);
      if (!rules.has(key)) {
        rules.add(key);
        yield rule;
      }
    }
  }

  add(input: string): ParseState {
    const pointers = this._graph.add(input, this._pointers);
    return new ParseState(this._graph, pointers);
  }

  get size() {
    return Array.from(this.rules()).length;
  }

  get grammar() {
    return this._graph.grammar;
  }
}
