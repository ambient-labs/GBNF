import vm, { Script, } from 'node:vm';

const constants = vm.constants;

export const runJavascript = async (code: string): Promise<unknown> => {
  const context: { console: typeof console } = { console, };
  vm.createContext(context);
  const script = new Script(
    code,
    { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER, });
  const result: unknown = await script.runInNewContext(context);
  return result;
};

