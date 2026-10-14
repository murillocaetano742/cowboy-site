/** Direct self-report only. These values never leave the in-memory quiz state. */
export const INTENSITY_OPTIONS = [
  { value: "none", option: "Não percebo dificuldade hoje", label: "Nenhuma", gauge: 6, color: "#53645b" },
  { value: "light", option: "Leve", label: "Leve", gauge: 26, color: "#756222" },
  { value: "moderate", option: "Moderada", label: "Moderada", gauge: 48, color: "#9a6f1f" },
  { value: "high", option: "Alta", label: "Alta", gauge: 70, color: "#b34118" },
  { value: "very_high", option: "Muito alta", label: "Muito alta", gauge: 94, color: "#c9261b" },
] as const;

export type SymptomIntensity = typeof INTENSITY_OPTIONS[number]["value"];
export const INTENSITY_QUESTION = {
  id: "symptom_intensity",
  question: "Como você avalia a intensidade dessa dificuldade hoje?",
  options: INTENSITY_OPTIONS.map(option => option.option),
};

export function intensityReport(value: string | undefined) {
  return INTENSITY_OPTIONS.find(option => option.value === value) ?? null;
}

export function intensityValue(label: string): SymptomIntensity | undefined {
  return INTENSITY_OPTIONS.find(option => option.option === label)?.value;
}

const SUMMARY_FIELDS = [
  { id: "concern", label: "sua principal preocupação", values: ["Dificuldade de ereção", "Ereção não mantida", "Falta de desejo", "Ejaculação precoce"] },
  { id: "frequency", label: "a frequência", values: ["Sempre", "Frequentemente", "Às vezes", "Raramente"] },
  { id: "intro_performance", label: "sua percepção do desempenho", values: ["Boa, mas sei que posso mais", "Caiu nos últimos tempos", "Não está legal há muito tempo"] },
  { id: "noticed", label: "sobre a percepção da parceira", values: ["Já, e não fala nada", "Já, e já reclamou", "Acho que ainda não", "Estou sem parceira agora"] },
] as const;

/** Quotes recognized choices without causal interpretation, scoring or recommendation. */
export function intensitySummary(answers: Readonly<Record<string, string>>): string[] {
  return SUMMARY_FIELDS.flatMap(field => {
    const value = answers[field.id];
    return field.values.some(option => option === value) ? [`Você informou ${field.label}: “${value}”.`] : [];
  });
}
