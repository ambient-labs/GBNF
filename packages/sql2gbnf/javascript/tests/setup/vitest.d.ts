import type { GBNFRule } from "gbnf";

interface CustomMatchers<R = unknown> {
  toThrowInputParseError(fn: () => void, str: string, errorPos?: number): R;
  toHaveBeenCalledWithError(message: string, type: string): R;
  toMatchGBNF(received: GBNFRule | GBNFRule[], expected: GBNFRule | GBNFRule[]): R;
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> { }
  interface AsymmetricMatchersContaining extends CustomMatchers { }
}
