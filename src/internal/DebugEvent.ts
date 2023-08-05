import { Tracking } from './Tracking';

export const DebugEventName = {
  Next: 'Next',
  Pipe: 'Pipe',
  AsObservable: 'AsObservable',
  ObservableCreator: 'ObservableCreator',
  ObservableCreatorPipe: 'ObservableCreatorPipe',
} as const;

export type DebugEventName =
  (typeof DebugEventName)[keyof typeof DebugEventName];

export type DebugEvent = {
  name: DebugEventName;
  tracking: Tracking | undefined;
};

export type DebugEventListener = (event: DebugEvent) => void;

type DebugEventCleanup = () => void;

let listeners: DebugEventListener[] = [];

export function clearDebugEventListeners(): void {
  listeners = [];
}

export function addDebugEventListener(
  listener: DebugEventListener,
): DebugEventCleanup {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((v) => v !== listener);
  };
}

export function triggerDebugEvent(
  name: DebugEventName,
  tracking: Tracking | undefined,
): void {
  const event: DebugEvent = {
    name,
    tracking,
  };
  for (const listener of listeners) {
    listener(event);
  }
}
