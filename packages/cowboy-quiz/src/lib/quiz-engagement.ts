import { createForegroundClock, HEARTBEAT_INTERVAL_MS, isForeground, SAMPLE_INTERVAL_MS } from "@/lib/foreground-clock";

export type EngagementReason = "heartbeat" | "transition" | "hidden" | "blur" | "pagehide";
export interface StepEngagement {
  setStep: (step: number) => void;
  flush: (reason: EngagementReason) => void;
}

/** One document-level observer; no React mount/unmount or answer data crosses this boundary. */
export function startStepEngagement(allowed: () => boolean, emit: (step: number, milliseconds: number, reason: EngagementReason) => void): StepEngagement {
  let step: number | undefined;
  const now = () => window.performance.now();
  let heartbeatAt = now();
  let suspended = false;
  const clock = createForegroundClock(now, () => step !== undefined && !suspended && isForeground() && allowed());
  const flush = (reason: EngagementReason) => {
    clock.sample();
    const milliseconds = clock.take();
    heartbeatAt = now();
    if (step !== undefined && milliseconds > 0 && allowed()) emit(step, milliseconds, reason);
  };
  const suspend = (reason: EngagementReason) => {
    suspended = true;
    flush(reason);
  };
  const resume = () => {
    suspended = false;
    clock.sample();
    heartbeatAt = now();
  };
  document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" ? suspend("hidden") : resume());
  window.addEventListener("blur", () => suspend("blur"));
  window.addEventListener("focus", resume);
  window.addEventListener("pagehide", () => suspend("pagehide"));
  window.addEventListener("pageshow", resume);
  window.setInterval(() => {
    clock.sample();
    if (!allowed()) clock.take();
    if (now() - heartbeatAt >= HEARTBEAT_INTERVAL_MS) flush("heartbeat");
  }, SAMPLE_INTERVAL_MS);
  return {
    flush,
    setStep(next) {
      if (!Number.isInteger(next) || next < 0 || next > 21 || next === step) return;
      flush("transition");
      step = next;
      clock.sample();
    },
  };
}
