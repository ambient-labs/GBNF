export function throttle<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  delay: number
): (...args: T) => Promise<void> {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastArgs: T | null = null;

  return function (...args: T): Promise<void> {
    return new Promise((resolve) => {
      lastArgs = args;

      if (!timeoutId) {
        timeoutId = setTimeout(async () => {
          if (lastArgs) {
            await fn(...lastArgs);
          }
          timeoutId = null;
          lastArgs = null;
          resolve();
        }, delay);
      } else {
        resolve();
      }
    });
  };
}
