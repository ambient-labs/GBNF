import { buildGrammar, } from "./build-grammar.js";
import { getID, } from "./get-id.js";
import { getRuleName, } from "./get-rule-name.js";

export type AddRule = (rule: string, symbolName?: string) => string;

export class GrammarBuilder {
  #rules = new Map<string, string>();
  #keys = new Set();

  public addRule: AddRule = (
    rule,
    key,
  ) => {
    let symbolId = key ? key : (this.#rules.get(rule) ?? getRuleName(rule));
    const existingSymbolId = this.#rules.get(rule);
    if (existingSymbolId !== undefined && existingSymbolId !== symbolId) {
      rule = existingSymbolId;
      // throw new Error(`Rule already exists: "${rule}" is already defined as "${this.#rules.get(rule)}". It cannot be redefined as "${symbolId}".`);
    }
    if (this.#keys.has(symbolId) && symbolId !== this.#rules.get(rule)) {
      let i = 0;
      let symbolIdCandidate = `${symbolId}-${getID(i)}`;
      while (this.#keys.has(symbolIdCandidate) && symbolIdCandidate !== this.#rules.get(rule)) {
        i += 1;
        symbolIdCandidate = `${symbolId}-${getID(i)}`;
      }
      symbolId = symbolIdCandidate;
    }
    this.#rules.set(rule, symbolId);
    this.#keys.add(symbolId);
    return symbolId;
  };

  public get grammar(): IterableIterator<string> {
    return buildGrammar(this.#rules.entries());
  }
}
