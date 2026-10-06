import { initializeQuizTracking } from "@/lib/quiz-tracking";

try {
  initializeQuizTracking();
} catch {
  // The quiz and native checkout work even if optional scripts/storage fail.
}
