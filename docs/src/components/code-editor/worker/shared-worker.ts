import type { AbortEvent, StartEvent } from './types.js';
import { getModel, processScript } from './utils.js';

console.log('worker loaded');
getModel('Xenova/gpt2'); // preload

self.onconnect = (e) => {
  const port = e.ports[0];

  port.addEventListener("message", async ({ data: { threadID, ...data } }: MessageEvent<StartEvent | AbortEvent>) => {
    const post = (type: string, postData?: any) => port.postMessage(JSON.stringify({
      type,
      data: postData,
      threadID,
    }));

    const log = (...data: unknown[]) => {
      post('log', data);
    };
    const error = (...data: unknown[]) => {
      post('error', data.map(serializeError));
    };

    const consoleLog = (...data: unknown[]) => {
      post('worker-log', data);
    };
    const consoleError = (...data: unknown[]) => {
      post('worker-error', data);
    };

    if (data.type === 'abort') {
      consoleLog('abort!!!');
    } else {
      try {
        await processScript(data, log, error);
      } catch (err: unknown) {
        consoleError('error', (err as any).message);
      } finally {
        consoleLog(`[${threadID}] completed cell execution...`);
        post('complete');
      }
    }
  });

  port.start();
};
