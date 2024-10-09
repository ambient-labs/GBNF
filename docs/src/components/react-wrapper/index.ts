import { define } from "../../utils/define.js";
import { TAG_NAME, ReactWrapper } from "./react-wrapper.js";

define(ReactWrapper);

declare global {
  interface HTMLElementTagNameMap {
    [TAG_NAME]: ReactWrapper;
  }
}

