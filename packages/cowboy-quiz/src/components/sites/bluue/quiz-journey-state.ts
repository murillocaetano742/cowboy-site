import type { JourneyScreen } from "@/lib/quiz-tracking";

export const JOURNEY_SCREEN_STEPS = { result: 18, presentation: 19, testimonials: 20, offer: 21 } as const;
const ORIGINAL_SCREENS: readonly JourneyScreen[] = ["result", "presentation", "offer"];
const SPLIT_SCREENS: readonly JourneyScreen[] = ["result", "presentation", "testimonials", "offer"];

export function nextJourneyScreen(screen: JourneyScreen, split: boolean): JourneyScreen {
  const screens = split ? SPLIT_SCREENS : ORIGINAL_SCREENS;
  const index = screens.indexOf(screen);
  return index < 0 ? "result" : screens[Math.min(index + 1, screens.length - 1)];
}

/** History may contain navigation identifiers only, never reconstructed answers. */
export function readJourneyScreen(value: unknown, split: boolean): JourneyScreen {
  return value === "presentation" || value === "offer" || (split && value === "testimonials") ? value : "result";
}
