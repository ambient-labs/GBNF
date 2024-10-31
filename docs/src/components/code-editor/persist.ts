import { type CodeEditor } from "./code-editor/code-editor.js";

export const getLocalItem = <T>(key: string) => localStorage.getItem(getLocalKey(key)) as T | null;
export const getLocalKey = (key: string) => `@ambient-labs/code-editor/${key}`;
export const broadcast = <E extends CodeEditor, K extends keyof E>(tagName: string[], key: K, value: E[K], root: ShadowRoot | HTMLDocument = window.document) => {
  root.querySelectorAll(tagName[0]).forEach((el) => {
    if (tagName.length === 1) {
      (el as E)[key] = value;
    } else {
      const shadowRoot = el.shadowRoot;
      if (!shadowRoot) {
        throw new Error(`shadowRoot not found for el ${el.tagName}`);
      }
      broadcast(tagName.slice(1), key, value, shadowRoot);
    }
  });
};
export function persist<E extends CodeEditor, K extends keyof E>(key: K, value: E[K], ...tagNames: (string | string[])[]) {
  if (value === 'Default') {
    localStorage.removeItem(getLocalKey(key as string));
  } else {
    localStorage.setItem(getLocalKey(key as string), value as string);
  }
  tagNames.forEach((tagName) => {
    broadcast(typeof tagName === 'string' ? [tagName] : tagName, key, value);
  })
}
