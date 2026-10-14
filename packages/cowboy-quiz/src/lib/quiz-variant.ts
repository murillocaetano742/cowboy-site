export type QuizVariant = "v1-direto" | "v2-vsl" | "v3-editorial" | "v4-jornada";

export const QUIZ_IDS = {
  "v1-direto": "cowboy_v1_direto",
  "v2-vsl": "cowboy_v2_vsl",
  "v3-editorial": "cowboy_v3_editorial",
  "v4-jornada": "cowboy_v4_jornada",
} as const;

/** Only a known route can select the experiment; query text never becomes an ID. */
export function quizVariantForPath(pathname: string): QuizVariant {
  if (/^\/quiz\/v4-jornada(?:\/quiz)?\/?$/.test(pathname)) return "v4-jornada";
  if (/^\/quiz\/v3-editorial(?:\/quiz)?\/?$/.test(pathname)) return "v3-editorial";
  return /^\/quiz\/v2-vsl\/?$/.test(pathname) ? "v2-vsl" : "v1-direto";
}

export function quizIdForVariant(variant: QuizVariant): string {
  return QUIZ_IDS[variant] ?? QUIZ_IDS["v1-direto"];
}
