export interface StartEvent {
  script: string;
  type: 'start';
}

export interface AbortEvent {
  type: 'abort';
}
