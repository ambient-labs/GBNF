import {
  GBNFRule,
} from "./gbnf-rule.js";
import { getGBNF, } from "./get-gbnf.js";
import { getRuleNames, } from "./get-rule-names.js";
import { getStringValue, } from "./get-string-value.js";
import {
  type GrammarBuilder,
} from "./grammar-builder.js";
import {
  type ToStringArgs,
  type CaseKind,
} from "./types.js";

type Args = { caseKind?: CaseKind } & ToStringArgs;
export class StringGBNFRule extends GBNFRule<Args> {
  getGBNF = (parser: GrammarBuilder, args: Args) => {
    const {
      strings,
      values,
      #separator: separator,
    } = this;

    const ruleNames = getRuleNames(values, parser, separator, args);
    const _strings = strings.map(string => {
      return getStringValue(string, args);
    });
    return getGBNF(ruleNames, _strings, {
      raw: false,
      wrapped: this._wrapped,
      separator: this._separator,
    });
  };

}
