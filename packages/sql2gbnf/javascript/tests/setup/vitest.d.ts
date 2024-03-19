interface CustomMatchers<R = unknown> {
  toThrowInputParseError(fn: () => void, str: string, errorPos?: number): R;
  toHaveBeenCalledWithError(message: string, type: string): R;
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> { }
  interface AsymmetricMatchersContaining extends CustomMatchers { }
}
