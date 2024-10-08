import {
  joinWith,
} from "./join.js";
import {
  customInspectSymbol,
  type ToStringArgs,
  type Value,
} from "./types.js";
import { GrammarBuilder, } from "./grammar-builder.js";
import { getRawValue, } from "./get-raw-value.js";
import { getRuleNames, } from "./get-rule-names.js";
import { getGBNF, } from "./get-gbnf.js";
import { log, LogOptions, } from "./log.js";

export interface GBNFOpts {
  key?: string;
  wrapped?: string;
  separator?: string;
}

export class GBNFRule<T extends ToStringArgs = ToStringArgs> {
  #key?: string;
  #wrapped?: string;
  #separator?: string;
  constructor(
    protected strings: TemplateStringsArray,
    protected values: Value[],
    {
      key,
      wrapped,
      separator,
    }: GBNFOpts = {}
  ) {
    this.#key = key;
    this.#wrapped = wrapped;
    this.#separator = separator;
  }

  toString = ({
    include = [],
    ...args
  }: T = {} as T, parser = new GrammarBuilder()) => {
    for (const rule of include) {
      rule.addToParser(parser, args, true);
    }
    this.addToParser(parser, args as T);
    return joinWith('\n',
      ...[...parser.grammar,].sort(),
    );
  };

  clone = (opts: Partial<GBNFOpts>) => {
    return new GBNFRule(this.strings, this.values, {
      key: this.#key,
      wrapped: this.#wrapped,
      separator: this.#separator,
      ...opts,
    });
  };

  key = (key: string) => {
    return this.clone({ key, });
  };

  wrap = (wrapped = '') => {
    return this.clone({ wrapped, });
  };

  join = (separator: string) => {
    return this.clone({ separator, });
  };

  [customInspectSymbol]() {
    return this.toString();
  }

  log = (opts: LogOptions & T = {} as T) => log(this.toString(opts), opts);

  getGBNF = (parser: GrammarBuilder, args: T) => {
    const {
      strings,
      values,
      #separator: separator,
    } = this;

    const ruleNames = getRuleNames(values, parser, separator, args);
    let inQuote = false;
    const _strings = strings.map(string => {
      const { str, inQuote: _inQuote, } = getRawValue(string, inQuote);
      inQuote = _inQuote;
      return str;
    });
    return getGBNF(ruleNames, _strings, {
      raw: true,
      wrapped: this.#wrapped,
      separator: this.#separator,
    });
  };

  addToParser = (parser: GrammarBuilder, args: T, leaf = false): string => {
    const gbnf = this.getGBNF(parser, args);
    return parser.addRule(gbnf, !leaf ? 'root' : this.#key);
  };
}
