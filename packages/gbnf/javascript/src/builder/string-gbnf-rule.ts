import {
  GBNFRule,
} from "./gbnf-rule.js";
import { getStringValue, } from "./get-string-value.js";
import {
  type ToStringArgs,
  type CaseKind,
} from "./types.js";

type Args = { caseKind?: CaseKind } & ToStringArgs;
export class StringGBNFRule extends GBNFRule<Args> {
  renderStrings = (strings: TemplateStringsArray, args: Args): string[] => {
    return strings.map(string => {
      return getStringValue(string, args);
    });
  };
}
