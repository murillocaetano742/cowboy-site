import { createForegroundClock, HEARTBEAT_INTERVAL_MS, isForeground, SAMPLE_INTERVAL_MS } from "@/lib/foreground-clock";
import { playedSeconds } from "@/lib/vsl-playback";
import { trackingAllowed, trackVslCheckpoint, trackVslRetention, type VslCheckpointReason, type VslPauseReason } from "@/lib/quiz-tracking";

export interface VslTelemetry {
  setActive: (active: boolean) => void;
  manualPause: () => void;
  retry: () => void;
  failed: () => void;
  completed: () => void;
  dispose: () => void;
}

/** Observation only: never plays, pauses, seeks, changes rate, or releases the video gate. */
export function observeVsl(video: HTMLVideoElement): VslTelemetry {
  const now = () => window.performance.now();
  let active = true;
  let suspended = false;
  let intent = false;
  let playing = false;
  let waiting = false;
  let failed = false;
  let completed = false;
  let nextPause: VslPauseReason = "unknown";
  let heartbeatAt = now();
  let previousSnapshot = "0:0";
  const foreground = () => active && !suspended && isForeground() && trackingAllowed();
  const watching = createForegroundClock(now, () => foreground() && playing && !waiting && !video.paused && !video.seeking && video.readyState >= 3);
  const buffering = createForegroundClock(now, () => foreground() && intent && waiting && !video.paused && !video.seeking);
  const sample = () => { watching.sample(); buffering.sample(); };
  const change = (update: () => void) => { sample(); update(); sample(); };
  const checkpoint = (reason: VslCheckpointReason, pauseReason?: VslPauseReason, force = false) => {
    sample();
    const watched = watching.take();
    const buffer = buffering.take();
    heartbeatAt = now();
    const duration = video.duration;
    const position = Number.isFinite(video.currentTime) ? Math.max(0, Math.min(video.currentTime, Number.isFinite(duration) ? duration : 0)) : 0;
    const percent = Number.isFinite(duration) && duration > 0 ? Math.min(100, Math.floor(playedSeconds(video) / duration * 10) * 10) : 0;
    const bucket = Math.floor(position / 10) * 10;
    const snapshot = `${bucket}:${percent}`;
    if (!trackingAllowed()) { previousSnapshot = snapshot; return; }
    // hidden -> pagehide and transition -> native pause must not report the same delta twice.
    if (!force && watched === 0 && buffer === 0 && snapshot === previousSnapshot) return;
    previousSnapshot = snapshot;
    trackVslCheckpoint({ position_bucket: bucket, video_percent: percent, watched_time_ms: watched, buffer_time_ms: buffer }, reason, pauseReason);
  };
  const retention = () => {
    if (!active || !trackingAllowed() || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const coverage = playedSeconds(video) / video.duration;
    for (let percent = 10; percent <= 90; percent += 10) {
      if (coverage >= percent / 100) trackVslRetention(percent);
    }
  };
  const onPlay = () => change(() => { intent = true; waiting = true; });
  const onPlaying = () => {
    const recovered = failed;
    const hadWaiting = waiting;
    change(() => { intent = true; playing = true; waiting = false; failed = false; });
    if (recovered || hadWaiting) checkpoint("recovered", undefined, recovered);
  };
  const onWaiting = () => {
    if (intent && !video.paused && !video.seeking) change(() => { waiting = true; });
  };
  const onPause = () => {
    const reason = video.ended ? "completed" : nextPause;
    change(() => { intent = false; playing = false; waiting = false; });
    nextPause = "unknown";
    // Native pause precedes ended. The trusted strict-completion handler owns that checkpoint.
    if (!video.ended) checkpoint("pause", reason);
  };
  const suspend = (reason: "hidden" | "blur" | "pagehide") => {
    change(() => { suspended = true; });
    checkpoint(reason, "lifecycle");
  };
  const resume = () => { change(() => { suspended = false; }); heartbeatAt = now(); };
  const onVisibility = () => document.visibilityState === "hidden" ? suspend("hidden") : resume();
  const onBlur = () => suspend("blur");
  const onPageHide = () => suspend("pagehide");
  const onSeeking = () => sample();
  const mediaEvents = { play: onPlay, playing: onPlaying, waiting: onWaiting, pause: onPause, timeupdate: retention, seeking: onSeeking, seeked: onSeeking };
  for (const [name, listener] of Object.entries(mediaEvents)) video.addEventListener(name, listener);
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("blur", onBlur);
  window.addEventListener("focus", resume);
  window.addEventListener("pagehide", onPageHide);
  window.addEventListener("pageshow", resume);
  const timer = window.setInterval(() => {
    sample();
    if (!trackingAllowed()) { watching.take(); buffering.take(); }
    if (active && now() - heartbeatAt >= HEARTBEAT_INTERVAL_MS) checkpoint("heartbeat");
  }, SAMPLE_INTERVAL_MS);
  return {
    setActive(next) {
      if (next === active) return;
      change(() => { active = next; });
      if (!next) { nextPause = "viewport"; checkpoint("transition", "viewport"); }
      else heartbeatAt = now();
    },
    manualPause() { nextPause = "manual"; },
    retry() {
      checkpoint("retry", undefined, true);
      change(() => { intent = false; playing = false; waiting = false; failed = true; });
    },
    failed() {
      if (failed) return;
      change(() => { intent = false; playing = false; waiting = false; failed = true; });
      checkpoint("error", undefined, true);
    },
    completed() {
      if (completed) return;
      completed = true;
      retention();
      checkpoint("completed", "completed", true);
    },
    dispose() {
      window.clearInterval(timer);
      for (const [name, listener] of Object.entries(mediaEvents)) video.removeEventListener(name, listener);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", resume);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", resume);
    },
  };
}
