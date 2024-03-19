import selectTests from "./found-code-select/index.js";
export const noSchemaTests: [string, any][] = [
  ...selectTests,
].map((test) => {
  if (typeof test === 'string') {
    return [test, undefined];
  }
  return test;
});
