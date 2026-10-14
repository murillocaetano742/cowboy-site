import { trackVslMilestone } from "@/lib/quiz-tracking";
import type { QuizVariant } from "@/lib/quiz-variant";

export type VslPlaybackEvent = "playing" | "timeupdate" | "ended";
type Playback = Pick<HTMLVideoElement, "duration" | "played" | "ended">;

/** TimeRanges are normalized by the browser: replays do not add watch time twice. */
export function playedSeconds(video: Playback): number {
  if (!Number.isFinite(video.duration) || video.duration <= 0) return 0;
  let seconds = 0;
  try {
    for (let index = 0; index < video.played.length; index++) {
      const start = video.played.start(index);
      const end = video.played.end(index);
      if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
      seconds += Math.max(0, Math.min(end, video.duration) - Math.max(0, start));
    }
  } catch { return 0; }
  return Math.min(video.duration, seconds);
}

/** Seeking changes currentTime but cannot manufacture any watched-coverage milestone. */
export function recordVslPlayback(event: VslPlaybackEvent, video: Playback, variant: QuizVariant) {
  if (variant !== "v2-vsl" && variant !== "v3-editorial" && variant !== "v4-jornada") return;
  if (event === "playing") {
    trackVslMilestone(0, variant);
    return;
  }
  if (!Number.isFinite(video.duration) || video.duration <= 0) return;
  const watched = playedSeconds(video);
  for (const percent of [25, 50, 75] as const) {
    if (watched / video.duration >= percent / 100) trackVslMilestone(percent, variant);
  }
  // Allow small media-timing gaps while rejecting a seek straight to the ending.
  const tolerance = Math.max(0.5, video.duration * 0.01);
  if (event === "ended" && video.ended && watched >= video.duration - tolerance) {
    trackVslMilestone(100, variant);
  }
}
