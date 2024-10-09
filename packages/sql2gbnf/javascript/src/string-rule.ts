import {
  GBNFRule,
  type ToStringArgs,
} from "gbnf";
import { getStringValue, } from "./get-string-value.js";
import {
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

export const $ = StringGBNFRule.templateTag();
