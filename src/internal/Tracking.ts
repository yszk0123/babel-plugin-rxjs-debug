export type TrackingId = string;

let count = 0;

export function generateTrackingId(): TrackingId {
  count += 1;
  return 'tr-' + count;
}

export type Tracking = {
  label: string;
  id: TrackingId;
};
export type DebugParams = Pick<Tracking, 'label'>;

const DEBUG_INFO = Symbol('Tracking');

export function attachTracking(
  // eslint-disable-next-line @typescript-eslint/ban-types
  o: Function | object,
  tracking: Tracking,
): void {
  if (!Object.hasOwn(o, DEBUG_INFO)) {
    Object.assign(o, { [DEBUG_INFO]: tracking });
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function getTracking(fn: Function): Tracking | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (fn as any)[DEBUG_INFO] ?? undefined;
}

export function createTracking(debugParams: DebugParams): Tracking {
  const trackingId = generateTrackingId();
  const tracking: Tracking = {
    ...debugParams,
    id: trackingId,
  };
  return tracking;
}
