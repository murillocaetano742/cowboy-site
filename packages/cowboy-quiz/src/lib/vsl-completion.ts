/** A fixed media-timing allowance, shared across every gap and the final tail. */
export const COMPLETION_TOLERANCE_SECONDS = 0.1;

type CoverageMedia = Pick<HTMLVideoElement, "duration" | "played">;
type CompletionMedia = CoverageMedia & Pick<HTMLVideoElement, "ended" | "currentTime" | "playbackRate">;

interface ContinuousCoverage {
  end: number;
  missing: number;
}

/** Browser TimeRanges are normalized and ordered. A seek cannot fill an unseen gap. */
export function continuousCoverage(video: CoverageMedia): ContinuousCoverage {
  if (!Number.isFinite(video.duration) || video.duration <= 0) return { end: 0, missing: 0 };
  let end = 0;
  let missing = 0;
  let previousStart = 0;
  try {
    for (let index = 0; index < video.played.length; index++) {
      const start = video.played.start(index);
      const rangeEnd = video.played.end(index);
      if (!Number.isFinite(start) || !Number.isFinite(rangeEnd) || start < previousStart || start < 0 || rangeEnd < start) return { end: 0, missing: 0 };
      const gap = Math.max(0, start - end);
      if (missing + gap > COMPLETION_TOLERANCE_SECONDS + Number.EPSILON) break;
      missing += gap;
      end = Math.max(end, Math.min(rangeEnd, video.duration));
      previousStart = start;
    }
  } catch { return { end: 0, missing: 0 }; }
  return { end, missing };
}

/** Only a real ended event at 1x can release the UI, after continuous playback. */
export function hasCompletedVsl(video: CompletionMedia, trustedEnded: boolean): boolean {
  if (!trustedEnded || !video.ended || video.playbackRate !== 1 || !Number.isFinite(video.duration) || video.duration <= 0 || !Number.isFinite(video.currentTime)) return false;
  const coverage = continuousCoverage(video);
  if (coverage.end <= 0) return false;
  const remaining = Math.max(0, video.duration - coverage.end);
  return Math.abs(video.duration - video.currentTime) <= COMPLETION_TOLERANCE_SECONDS && coverage.missing + remaining <= COMPLETION_TOLERANCE_SECONDS + Number.EPSILON;
}

/** A time position alone is never accepted as evidence of watching. */
export function allowedSeekTarget(video: CoverageMedia, requestedTime: number): number {
  const limit = continuousCoverage(video).end;
  return Number.isFinite(requestedTime) ? Math.max(0, Math.min(requestedTime, limit)) : 0;
}
