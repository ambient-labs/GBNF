import type { Graph, } from "./graph.js";
import type { Pointers, ResolvedRule, } from "./types.js";


export class ParseState {
  #graph: Graph;
  #pointers: Pointers;
  constructor(graph: Graph, pointers: Pointers) {
    this.#graph = graph;
    this.#pointers = pointers;
  }

  *[Symbol.iterator](): IterableIterator<ResolvedRule> {
    yield* this.rules();
  }

  *rules(): IterableIterator<ResolvedRule> {
    const rules = new Set<string>();
    for (const { rule, } of this.#pointers) {
      const key = JSON.stringify(rule);
      if (!rules.has(key)) {
        rules.add(key);
        yield rule;
      }
    }
  }

  add(input: string): ParseState {
    const pointers = this.#graph.add(input, this.#pointers);
    return new ParseState(this.#graph, pointers);
  }

  get size() {
    return Array.from(this.rules()).length;
  }

  get grammar() {
    return this.#graph.grammar;
  }
}
