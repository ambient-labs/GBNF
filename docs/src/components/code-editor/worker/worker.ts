// import { serializeError } from 'https://cdn.jsdelivr.net/npm/serialize-error/index.js';
import { run, } from './run.js';
import { prepareDataForPosting } from './prepare-data-for-posting.js';

self.onmessage = async (event: MessageEvent) => {
  const postMessage = (type: string, postData?: unknown) => self.postMessage(JSON.stringify({
    type,
    data: postData,
  }));

  const getPostMessage = (type: string) => (...data: unknown[]) => postMessage(type, prepareDataForPosting(data));

  const consoleInfo = getPostMessage('worker-info');
  // const consoleLog = getPostMessage('log');
  // const consoleWarn = getPostMessage('warn');
  const consoleError = getPostMessage('worker-error');

  const scriptConsole = {
    'info': getPostMessage('info'),
    'log': getPostMessage('log'),
    'warn': getPostMessage('warn'),
    'error': getPostMessage('error'),
  };


  const { type, args, ...data } = event.data;
  if (type === 'abort') {
    // consoleInfo('abort!!!')
    // const fn = fns.get(id);
    // if (fn === undefined) {
    //   consoleError('No function found for id', id);
    // } else {
    //   // URL.revokeObjectURL(fn);
    // }
  } else if (type === 'start') {
    consoleInfo(`starting cell execution...`);
    try {
      const result = await run(data, scriptConsole, ...args);
      self.postMessage(JSON.stringify({ type: 'result', data: result }));
    } catch (err: unknown) {
      consoleError('error', (err as any).message);
    } finally {
      consoleInfo(`completed cell execution...`);
      self.postMessage(JSON.stringify({ type: 'complete' }));
    }
  } else {
    if (!type) {
      consoleError(`No "type" provided`);
    } else {
      consoleError(`unknown message type: "${type}"`);
    }
  }
}
