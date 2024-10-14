export const getLocalItem = <T>(key: string) => localStorage.getItem(getLocalKey(key)) as T | null;
export const getLocalKey = (key: string) => `@ambient-labs/code-editor/${key}`;
export function persist<E extends HTMLElement, K extends keyof E>(key: K, value: E[K], tagName?: string) {
  if (value === 'Default') {
    localStorage.removeItem(getLocalKey(key as string));
  } else {
    localStorage.setItem(getLocalKey(key as string), value as string);
  }
  if (tagName) {
    window.document.querySelectorAll(tagName).forEach((editor) => {
      (editor as E)[key] = value;
    });
  }
}
