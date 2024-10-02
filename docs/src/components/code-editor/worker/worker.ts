import { serializeError } from 'https://cdn.jsdelivr.net/npm/serialize-error/index.js';
import { run, RunConsole } from './run.js';
import { prepareDataForPosting } from './prepare-data-for-posting.js';

self.onmessage = async (event: MessageEvent) => {
  const postMessage = (type: string, postData?: unknown) => self.postMessage(JSON.stringify({
    type,
    data: postData,
    threadID,
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


  const { threadID, type, ...data } = event.data;
  // consoleInfo(event)
  if (data.type === 'abort') {
    // consoleInfo('abort!!!')
    // const fn = fns.get(id);
    // if (fn === undefined) {
    //   consoleError('No function found for id', id);
    // } else {
    //   // URL.revokeObjectURL(fn);
    // }
  } else {
    consoleInfo(`[${threadID}] starting cell execution...`);
    try {
      const result = await run(data, scriptConsole);
      self.postMessage(JSON.stringify({ type: 'result', data: result, threadID }));
    } catch (err: unknown) {
      consoleError('error', (err as any).message);
    } finally {
      consoleInfo(`[${threadID}] completed cell execution...`);
      self.postMessage(JSON.stringify({ type: 'complete', threadID }));
    }
  }
}
