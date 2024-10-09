export interface StartEvent {
  threadID: string;
  script: string;
  type: 'start';
}

export interface AbortEvent {
  threadID: string;
  type: 'abort';
}
