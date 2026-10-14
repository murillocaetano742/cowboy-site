/** A direct self-report, never a health score. These values stay in React memory. */
export const CONFIDENCE_OPTIONS = [
  { value: "none", label: "Nada", support: "Você relatou que isso não afeta sua confiança hoje. Esse é o ponto de partida do seu resumo." },
  { value: "little", label: "Um pouco", support: "Você relatou um pequeno impacto na sua confiança hoje. Seu resumo respeita essa percepção." },
  { value: "considerable", label: "Bastante", support: "Você relatou que isso afeta bastante sua confiança hoje. Seu resumo registra o que você nos contou." },
  { value: "much", label: "Muito", support: "Você relatou que isso afeta muito sua confiança hoje. Essa é a sua percepção, não uma classificação médica." },
] as const;

export type ConfidenceImpact = typeof CONFIDENCE_OPTIONS[number]["value"];
export const CONFIDENCE_QUESTION = {
  id: "confidence_impact",
  question: "Quanto isso afeta sua confiança hoje?",
  options: CONFIDENCE_OPTIONS.map(option => option.label),
};

export function confidenceReport(value: string | undefined) {
  return CONFIDENCE_OPTIONS.find(option => option.value === value) ?? null;
}

export function confidenceValue(label: string): ConfidenceImpact | undefined {
  return CONFIDENCE_OPTIONS.find(option => option.label === label)?.value;
}
