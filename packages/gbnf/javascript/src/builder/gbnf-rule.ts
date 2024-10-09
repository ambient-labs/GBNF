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
  protected _wrapped?: string;
  protected _separator?: string;
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
    this._wrapped = wrapped;
    this._separator = separator;
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
      wrapped: this._wrapped,
      separator: this._separator,
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

  renderStrings: (strings: TemplateStringsArray, _args: T) => string[] = (strings) => {
    let inQuote = false;
    return strings.map(string => {
      const { str, inQuote: _inQuote, } = getRawValue(string, inQuote);
      inQuote = _inQuote;
      return str;
    });
  };

  getGBNF = (parser: GrammarBuilder, args: T) => {
    const {
      values,
      _separator: separator,
    } = this;

    const ruleNames = getRuleNames(parser, values, separator, args);
    const strings = this.renderStrings(this.strings, args);
    return getGBNF(ruleNames, strings, {
      raw: true,
      wrapped: this._wrapped,
      separator: this._separator,
    });
  };

  addToParser = (parser: GrammarBuilder, args: T, leaf = false): string => {
    const gbnf = this.getGBNF(parser, args);
    return parser.addRule(gbnf, !leaf ? 'root' : this.#key);
  };
}
