import { generateTrackingId } from './generateTrackingId';
import { TrackingId } from './wrapper';

export type DebugInfo = {
  name: string;
  trackingId: TrackingId;
};
export type DebugParams = Pick<DebugInfo, 'name'>;

const DEBUG_INFO = Symbol('DebugInfo');

export function attachDebugInfo(
  // eslint-disable-next-line @typescript-eslint/ban-types
  o: Function | object,
  debugInfo: DebugInfo,
): void {
  if (!Object.hasOwn(o, DEBUG_INFO)) {
    Object.assign(o, { [DEBUG_INFO]: debugInfo });
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function getDebugInfo(fn: Function): DebugInfo | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (fn as any)[DEBUG_INFO] ?? undefined;
}

export function createDebugInfo(debugParams: DebugParams): DebugInfo {
  const trackingId = generateTrackingId();
  const debugInfo: DebugInfo = {
    ...debugParams,
    trackingId,
  };
  return debugInfo;
}
