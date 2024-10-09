export function define(
  element: CustomElementConstructor & {
    metadata: { version: string; tag: string; }
  }
) {
  const { tag } = element.metadata;
  if (!customElements.get(tag)) {
    customElements.define(tag, element);
  }
}
