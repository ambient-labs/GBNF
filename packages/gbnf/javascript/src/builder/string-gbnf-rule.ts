import {
  GBNFRule,
} from "./gbnf-rule.js";
import { getGBNF, } from "./get-gbnf.js";
import { getRuleNames, } from "./get-rule-names.js";
import { getStringValue, } from "./get-string-value.js";
import { GrammarBuilder, } from "./grammar-builder.js";
import {
  type ToStringArgs,
  type CaseKind,
} from "./types.js";

type Args = { caseKind?: CaseKind } & ToStringArgs;
export class StringGBNFRule extends GBNFRule<Args> {
  renderStrings = (
    strings: TemplateStringsArray,
    args: Args,
  ): string[] => strings.map(string => getStringValue(string, args));

  get separator() {
    const { _separator: separator, } = this;
    return separator ? ` ${separator} ` : ' ';
  }
}
