import { define } from "../../../utils/define.js";
import { CodeEditorActions, TAG_NAME } from "./code-editor-actions.js";

define(CodeEditorActions);

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: CodeEditorActions;
  }
}
