import vm, { Script } from 'node:vm';

const constants = (vm as any).constants;

export const runJavascript = async (code: string) => {
  const context = { console };
  vm.createContext(context);
  const script = new Script(
    code,
    { importModuleDynamically: constants.USE_MAIN_CONTEXT_DEFAULT_LOADER });
  return await script.runInNewContext(context);
};

