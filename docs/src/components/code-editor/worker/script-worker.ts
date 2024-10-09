// sharedWorker = new SharedWorker(workerUrl);
// worker = new Worker(workerUrl);

import { CodeEditor } from "../code-editor.js";

export class AbortError extends Error {
  constructor() {
    super('aborted');
    this.name = 'AbortError';
  }
}

const makeResolver = (): { promise: Promise<void>, resolve: () => void, reject: (reason?: any) => void } => {
  let resolve: null | (() => void) = null;
  let reject: null | ((reason?: any) => void) = null;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  if (!resolve) {
    throw new Error('resolve not set');
  }
  if (!reject) {
    throw new Error('reject not set');
  }
  return {
    promise,
    resolve,
    reject,
  };
}
// // console.log(worker);
//   worker = new SharedWorker(new URL('./worker.js', import.meta.url), {
//     type: 'module'
//   });
export class ScriptWorker {
  private #worker?: Worker;
  constructor(protected url: string, protected el: CodeEditor) {
    this.startWorker();
  }

  running?: ReturnType<typeof makeResolver>;

  get worker() {
    if (!this.#worker) {
      throw new Error('worker not started');
    }
    return this.#worker;
  }

  run(script: string) {
    if (this.running) {
      throw new Error('already running');
    }
    this.running = makeResolver();
    const { promise } = this.running;
    this.worker.postMessage({
      type: 'start',
      script,
    });
    return promise;
  }

  postMessage(message: Record<string, unknown>) {
    this.worker.postMessage(message);
  }

  onMessage(callback: (event: MessageEvent) => void) {
    this.worker.addEventListener('message', callback);
  }

  abort = () => {
    if (!this.running) {
      throw new Error('not running');
    }
    this.worker.terminate();
    this.running?.reject(new AbortError());
    this.running = undefined;
    this.startWorker();
  }

  startWorker = () => {
    this.#worker = new Worker(this.url, { type: 'module' });
    // this.sharedWorker.port.start();
    // this.sharedWorker.port.addEventListener('message', e => {
    //   const { type, data, threadID } = JSON.parse(e.data);
    //   if (type === 'log' || type === 'error' || type === 'result') {
    //     if (threadID === this.threadID) {
    //       this.output.push(data.length === 1 ? data[0] : data);
    //       // Because we are mutating output
    //       this.requestUpdate();
    //     }
    //   } else if (type === 'worker-log') {
    //     console.log(...data);
    //   } else if (type === 'worker-error') {
    //     console.error(...data);
    //   } else if (type === 'complete' && threadID === this.threadID) {
    //     this.running = false;
    //   }
    // });


    this.worker.onmessage = (event) => {
      const { type, data, threadID } = JSON.parse(event.data);
      // console.log('worker message', type, data, threadID);
      // if (type === 'log' || type === 'error' || type === 'result') {
      if (type === 'log' || type === 'error' || type === 'info' || type === 'warn') {
        // if (type === 'error') {
        //   console.error(...data);
        // }
        // if (threadID === this.threadID) {
        if (data) {
          // console.log(...data)
          this.el.output.push({
            type,
            data,
          });
          this.el.requestUpdate();
          this.el.codeConsole.value?.requestUpdate();
        }
        // }
      } else if (type === 'worker-log') {
        console.log(...data);
      } else if (type === 'worker-info') {
        console.info(...data);
      } else if (type === 'worker-warn') {
        console.warn(...data);
      } else if (type === 'worker-error') {
        console.error(...data);
      } else if (type === 'complete') {
        if (!this.running) {
          throw new Error('not running');
        }
        this.running.resolve();
      }
    };

  }
}


// this.sharedWorker.port.postMessage({
//   threadID: this.threadID,
//   type: 'abort',
// });
// this.sharedWorker.port.postMessage({
//   threadID: this.threadID,
//   type: 'start',
//   script: this.ref.value?.script,
//   importMap: IMPORT_MAP,
// });
