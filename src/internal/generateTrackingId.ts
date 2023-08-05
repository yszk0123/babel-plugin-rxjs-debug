let count = 0;
export function generateTrackingId(): string {
  count += 1;
  return 'tr-' + count;
}
