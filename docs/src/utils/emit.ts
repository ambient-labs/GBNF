export function emit<T extends Record<string, any>>(
  el: HTMLElement,
  name: string,
  detail?: T,
  options?: CustomEventInit,
) {
  const event = new CustomEvent<T>(name, {
    bubbles: true,
    cancelable: false,
    composed: true,
    ...options,
    detail,
  });

  el.dispatchEvent(event);
  return event;
}
