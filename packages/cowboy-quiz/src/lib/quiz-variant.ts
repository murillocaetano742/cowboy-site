export type QuizVariant = "v1-direto" | "v2-vsl";

export const QUIZ_IDS = {
  "v1-direto": "cowboy_v1_direto",
  "v2-vsl": "cowboy_v2_vsl",
} as const;

/** Only a known route can select the experiment; query text never becomes an ID. */
export function quizVariantForPath(pathname: string): QuizVariant {
  return /^\/quiz\/v2-vsl\/?$/.test(pathname) ? "v2-vsl" : "v1-direto";
}

export function quizIdForVariant(variant: QuizVariant): string {
  return variant === "v2-vsl" ? QUIZ_IDS["v2-vsl"] : QUIZ_IDS["v1-direto"];
}
