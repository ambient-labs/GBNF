import { waitFor } from "../wait-for.js";
import type { CodeEditor } from "./code-editor.js";

export const getScript = (el: CodeEditor, timeout?: number) => waitFor(
  () => !!el.ref.value?.script, timeout
).then(
  () => el.ref.value?.script
);
