import manualSelectTests from "./manual-select-tests.js";
import manualInsertTests from "./manual-insert-tests.js";
import foundCodeTests from "./found-code-select/index.js";
import tests from "./synthetic-llm-select-tests.js";
export const noSchemaTests = [
  ...manualSelectTests,
  ...foundCodeTests,
  ...tests,
  ...manualInsertTests,
];
