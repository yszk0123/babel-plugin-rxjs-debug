import { Observable, Subject, combineLatest } from 'rxjs';
import { triggerDebugEvent, DebugEventName } from './DebugEvent';
import {
  TrackingParams,
  createTracking,
  getTracking,
  attachTracking,
  Tracking,
  generateTrackingId,
} from './Tracking';

type CombineLatest = typeof combineLatest;

const UNKNOWN_NAME = 'unknown';

export function wrapObservableCreatorPipe(tracking: Tracking): () => void {
  function wrapped() {
    triggerDebugEvent(DebugEventName.ObservableCreatorPipe, tracking);
  }
  return wrapped;
}

export function wrapObservableCreator<T extends CombineLatest>(
  combineLatest: T,
  params: TrackingParams,
): T {
  const tracking = createTracking(params);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function wrapped(this: any, ...args: any) {
    if (Array.isArray(args) && args.length === 1 && Array.isArray(args[0])) {
      const xs = args[0].map((v) => getTracking(v)?.label ?? UNKNOWN_NAME);
      const chainedTracking = chainTracking(
        tracking,
        `combineLatest(${xs.join(',')})`,
      );
      triggerDebugEvent(DebugEventName.ObservableCreator, chainedTracking);
    } else {
      triggerDebugEvent(DebugEventName.ObservableCreator, tracking);
    }
    return combineLatest.apply(this, args);
  }
  attachTracking(wrapped, tracking);
  return wrapped as T;
}

export function wrapSubject<T = unknown>(
  subject: Subject<T>,
  params: TrackingParams,
): Subject<T> {
  const tracking = createTracking(params);
  attachTracking(subject, tracking);
  return subject;
}

function chainTracking(
  tracking: Tracking | undefined,
  label: string,
): Tracking {
  const chainedTracking: Tracking = {
    label: tracking?.label ? tracking.label + '.' + label : label,
    id: tracking?.id ?? generateTrackingId(),
  };
  return chainedTracking;
}

export function register() {
  {
    const pipe = Observable.prototype.pipe;
    Object.defineProperty(Observable.prototype, 'pipe', {
      get() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return function wrappedPipe(this: any, ...args: any) {
          const result = pipe.apply(this, args);
          const tracking = getTracking(this);
          const chainedTracking = chainTracking(tracking, 'pipe');
          attachTracking(result, chainedTracking);
          triggerDebugEvent(DebugEventName.Pipe, chainedTracking);
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
          const tracking = getTracking(this);
          const chainedTracking = chainTracking(tracking, 'asObservable');
          attachTracking(result, chainedTracking);
          triggerDebugEvent(DebugEventName.AsObservable, chainedTracking);
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
          const tracking = getTracking(this);
          const chainedTracking = chainTracking(tracking, 'next');
          triggerDebugEvent(DebugEventName.Next, chainedTracking);
          return result;
        };
      },
    });
  }
}
