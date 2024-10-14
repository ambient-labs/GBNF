const TIMEOUT = 1000;
const INTERVAL = 5;

const wait = (dur: number) => new Promise((resolve) => setTimeout(resolve, dur));

export const waitFor = (
  condition: () => boolean,
  timeout = TIMEOUT,
  interval = INTERVAL,
) => new Promise<void>(async (resolve, reject) => {
  const timer = setTimeout(() => {
    console.error(timeout)
    reject(new Error(`Could not satisfy condition (${condition}) in ${timeout}ms`));
  }, timeout);


  while (!(await checkCondition(condition))) {
    await wait(interval);
  }

  clearTimeout(timer);
  resolve();
})

const checkCondition = async (condition: () => (boolean | Promise<boolean>)) => {
  try {
    return await condition();
  } catch (e) {
  }
  return false;
}
