export type Stage =
  | "intro"
  | "explanation"
  | "quiz"
  | "weight_kg"
  | "weight"
  | "testimonials"
  | "analyzing"
  | "precheckout";
export interface QuizState {
  stage: Stage;
  introIndex: number;
  questionIndex: number;
  direction: 1 | -1;
  answers: Record<string, string>;
}
export type QuizAction =
  | { type: "ANSWER"; id: string; value: string }
  | { type: "NEXT" }
  | { type: "BACK" };
export const initialState: QuizState = {
  stage: "intro",
  introIndex: 0,
  questionIndex: 0,
  direction: 1,
  answers: {},
};

/** Index of the last question in data.ts (the two pain questions close the quiz). */
export const LAST_QUESTION = 7;

/**
 * All quiz answers remain in memory. No production tracking or medical API.
 * Health answers (medication, surgery, conditions) never interrupt the quiz:
 * COWBOY is a food supplement sold without prescription (owner's decision,
 * 05/10/2026). They only feed the case severity on the offer screen.
 */
export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  const { stage, questionIndex: q } = state;
  if (action.type === "BACK") {
    if (stage === "intro")
      return { ...state, introIndex: Math.max(0, state.introIndex - 1) };
    if (stage === "weight_kg")
      return { ...state, stage: "quiz", questionIndex: 0, direction: -1 };
    if (stage === "weight" || stage === "testimonials")
      return { ...state, stage: "quiz", questionIndex: 2, direction: -1 };
    if (stage === "quiz")
      return {
        ...state,
        direction: -1,
        stage:
          q === 0
            ? "explanation"
            : q === 1
              ? "weight_kg"
              : q === 3
                ? "weight"
                : "quiz",
        questionIndex: q === 1 || q === 3 ? q : Math.max(0, q - 1),
      };
    return state;
  }
  if (action.type === "NEXT") {
    if (stage === "explanation")
      return { ...state, stage: "quiz", questionIndex: 0, direction: 1 };
    if (stage === "testimonials") return { ...state, stage: "weight" };
    if (stage === "analyzing") return { ...state, stage: "precheckout" };
    return state;
  }
  const next = {
    ...state,
    answers: { ...state.answers, [action.id]: action.value },
    direction: 1 as const,
  };
  if (stage === "intro")
    return {
      ...next,
      introIndex: Math.min(2, state.introIndex + 1),
      stage: state.introIndex === 2 ? "explanation" : "intro",
    };
  if (stage === "weight_kg")
    return { ...next, stage: "quiz", questionIndex: 1 };
  if (stage === "weight") return { ...next, stage: "quiz", questionIndex: 3 };
  if (stage === "quiz") {
    if (action.id === "age") return { ...next, stage: "weight_kg" };
    if (action.id === "frequency") return { ...next, stage: "testimonials" };
    return {
      ...next,
      stage: q === LAST_QUESTION ? "analyzing" : "quiz",
      questionIndex: q === LAST_QUESTION ? q : q + 1,
    };
  }
  return state;
}

export function progressFor(state: QuizState) {
  return state.stage === "weight_kg"
    ? 2
    : state.stage === "testimonials"
      ? 4
      : state.stage === "weight"
        ? 5
        : state.questionIndex === 0
          ? 1
          : state.questionIndex + 2;
}
