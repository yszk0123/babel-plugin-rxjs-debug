import { Observable, Subject, combineLatest } from 'rxjs';
import { triggerDebugEvent, DebugEventName } from './DebugEvent';

type TrackingId = string;

export type DebugInfo = {
  name: string;
  trackingId: TrackingId;
};
type DebugParams = Pick<DebugInfo, 'name'>;

type CombineLatest = typeof combineLatest;

let count = 0;
export function generateTrackingId(): string {
  count += 1;
  return 'tr-' + count;
}

const DEBUG_INFO = Symbol('DebugInfo');

const UNKNOWN_NAME = 'unknown';

// eslint-disable-next-line @typescript-eslint/ban-types
function attachDebugInfo(o: Function | object, debugInfo: DebugInfo): void {
  if (!Object.hasOwn(o, DEBUG_INFO)) {
    Object.assign(o, { [DEBUG_INFO]: debugInfo });
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
function getDebugInfo(fn: Function): DebugInfo | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (fn as any)[DEBUG_INFO] ?? undefined;
}

function createDebugInfo(debugParams: DebugParams): DebugInfo {
  const debugInfo: DebugInfo = {
    ...debugParams,
    trackingId: generateTrackingId(),
  };
  return debugInfo;
}

export function wrapObservableCreator<T extends CombineLatest>(
  combineLatest: T,
  debugParams: DebugParams,
): T {
  const debugInfo = createDebugInfo(debugParams);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function wrapped(this: any, ...args: any) {
    if (Array.isArray(args) && args.length === 1 && Array.isArray(args[0])) {
      const xs = args[0].map((v) => getDebugInfo(v)?.name ?? UNKNOWN_NAME);
      const chainedDebugInfo = chainDebugInfo(
        debugInfo,
        `combineLatest(${xs.join(',')})`,
      );
      triggerDebugEvent(DebugEventName.ObservableCreator, chainedDebugInfo);
    } else {
      triggerDebugEvent(DebugEventName.ObservableCreator, debugInfo);
    }
    return combineLatest.apply(this, args);
  }
  attachDebugInfo(wrapped, debugInfo);
  return wrapped as T;
}

export function wrapSubject<T = unknown>(
  subject: Subject<T>,
  debugParams: DebugParams,
): Subject<T> {
  const debugInfo = createDebugInfo(debugParams);
  attachDebugInfo(subject, debugInfo);
  return subject;
}

function chainDebugInfo(
  debugInfo: DebugInfo | undefined,
  name: string,
): DebugInfo {
  const chainedDebugInfo: DebugInfo = {
    name: debugInfo?.name ? debugInfo.name + '.' + name : name,
    trackingId: debugInfo?.trackingId ?? generateTrackingId(),
  };
  return chainedDebugInfo;
}

export function register() {
  {
    const pipe = Observable.prototype.pipe;
    Object.defineProperty(Observable.prototype, 'pipe', {
      get() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return function wrappedPipe(this: any, ...args: any) {
          const result = pipe.apply(this, args);
          const debugInfo = getDebugInfo(this);
          const chainedDebugInfo = chainDebugInfo(debugInfo, 'pipe');
          attachDebugInfo(result, chainedDebugInfo);
          triggerDebugEvent(DebugEventName.Pipe, chainedDebugInfo);
          return result;
        };
      },
    });
  }

  {
    const asObservable = Subject.prototype.asObservable;
    Object.defineProperty(Subject.prototype, 'asObservable', {
      get() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return function wrappedAsObservable(this: any, ...args: any) {
          const result = asObservable.apply(this, args);
          const debugInfo = getDebugInfo(this);
          const chainedDebugInfo = chainDebugInfo(debugInfo, 'asObservable');
          attachDebugInfo(result, chainedDebugInfo);
          triggerDebugEvent(DebugEventName.AsObservable, chainedDebugInfo);
          return result;
        };
      },
    });
  }

  {
    const next = Subject.prototype.next;
    Object.defineProperty(Subject.prototype, 'next', {
      get() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return function wrappedNext(this: any, ...args: any) {
          const result = next.apply(this, args);
          const debugInfo = getDebugInfo(this);
          const chainedDebugInfo = chainDebugInfo(debugInfo, 'next');
          triggerDebugEvent(DebugEventName.Next, chainedDebugInfo);
          return result;
        };
      },
    });
  }
}
