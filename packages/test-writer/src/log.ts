const origLog = console.log;
console.log = () => { };
export const log = (...args: unknown[]) => {
  origLog(...args);
};
