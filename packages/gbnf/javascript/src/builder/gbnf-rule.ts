import {
  joinWith,
} from "./join.js";
import {
  customInspectSymbol,
  TemplateTag,
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
  _key?: string;
  _wrapped?: string;
  _separator?: string;
  constructor(
    protected strings: TemplateStringsArray,
    protected values: Value[],
    {
      key,
      wrapped,
      separator,
    }: GBNFOpts = {}
  ) {
    this._key = key;
    this._wrapped = wrapped;
    this._separator = separator;
  }

  static templateTag<GBNFRuleType extends GBNFRule>() {
    const makeTemplateTag = (opts: GBNFOpts = {}) => {
      const templateTag = (strings: TemplateStringsArray, ...values: Value[]) => new this(strings, values, opts) as GBNFRuleType;
      templateTag.key = (key: string) => makeTemplateTag({ ...opts, key, });
      templateTag.wrap = (wrapped: string) => makeTemplateTag({ ...opts, wrapped, });
      return templateTag;
    };
    return makeTemplateTag();
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
      key: this._key,
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

  get separator() {
    return this._separator;
  }

  getGBNF = (parser: GrammarBuilder, args: T) => {
    const {
      values,
      separator,
    } = this;

    const ruleNames = getRuleNames(parser, values, separator, args);
    const strings = this.renderStrings(this.strings, args);
    return getGBNF(ruleNames, strings, {
      wrapped: this._wrapped,
      separator: this.separator,
    });
  };

  addToParser = (parser: GrammarBuilder, args: T, leaf = false): string => {
    const gbnf = this.getGBNF(parser, args);
    return parser.addRule(gbnf, !leaf ? 'root' : this._key);
  };
}
