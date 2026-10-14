export const SAMPLE_INTERVAL_MS = 1_000;
export const HEARTBEAT_INTERVAL_MS = 30_000;
export const MAX_SAMPLE_GAP_MS = 5_000;

/** Foreground time, not proof of attention. Long suspended/unknown gaps are discarded. */
export function createForegroundClock(now: () => number, active: () => boolean) {
  let previous = now();
  let wasActive = active();
  let pending = 0;
  return {
    sample() {
      const current = now();
      const elapsed = current - previous;
      if (wasActive && elapsed >= 0 && elapsed <= MAX_SAMPLE_GAP_MS) pending += elapsed;
      previous = current;
      wasActive = active();
    },
    take() {
      const value = Math.floor(pending);
      pending = 0;
      return value;
    },
  };
}

export function isForeground(): boolean {
  return document.visibilityState === "visible" && document.hasFocus();
}
