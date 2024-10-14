export interface StartEvent {
  script: string;
  kernel: 'javascript' | 'python';
  type: 'start';
}

export interface AbortEvent {
  type: 'abort';
}

export interface RunConsole {
  info: typeof console.info;
  log: typeof console.log;
  warn: typeof console.warn;
  error: typeof console.error;
}

export interface RunOptions {
  script: string;
  kernel: 'javascript' | 'python';
}
