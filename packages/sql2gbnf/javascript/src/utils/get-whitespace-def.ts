import { WhitespaceKind, } from "../types.js";
import {
  GBNFRule,
  _,
} from "gbnf/builder";

const isWhitespaceKind = (whitespace: WhitespaceKind): whitespace is WhitespaceKind => ['default', 'succinct', 'verbose',].includes(whitespace);

const WS = _`[ \\t\\n\\r]`;

const getGetWhitespaceDef = (whitespace: WhitespaceKind) => (mandatory: boolean, recommended = true) => {
  if (!isWhitespaceKind(whitespace)) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`Unsupported whitespace type: ${whitespace}`);
  }
  return {
    succinct: () => {
      if (mandatory) {
        return WS;
      }
      return undefined;
    },
    verbose: () => {
      if (mandatory) {
        return WS.wrap('+');
      }
      return WS.wrap('*');
    },
    default: () => {
      if (mandatory) {
        return WS;
      }
      if (recommended) {
        return WS;
      }
      return undefined;
    },
  }[whitespace]();
};

export const getWhitespaceDefs = (
  whitespaceKind: WhitespaceKind
): {
  ws: GBNFRule;
  optRecWS: GBNFRule | undefined;
  optNonRecWS: GBNFRule | undefined;
} => {
  const getWhitespaceDef = getGetWhitespaceDef(whitespaceKind);
  return {
    ws: getWhitespaceDef(true) as GBNFRule,
    optRecWS: getWhitespaceDef(false, true),
    optNonRecWS: getWhitespaceDef(false, false),
  };
};
