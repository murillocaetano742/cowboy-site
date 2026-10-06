export interface Question {
  id: string;
  question: string;
  subtitle?: string;
  preSelected?: string;
  options: { label: string; description?: string; image?: string }[];
}

export const intro = [
  {
    id: "intro_goal",
    question: "O que você quer melhorar na sua vida sexual?",
    options: [
      "Sexo mais longo",
      "Ereções mais fortes",
      "Quero melhorar tudo acima",
    ],
  },
  {
    id: "intro_performance",
    question: "Como está sua performance hoje?",
    options: [
      "Boa, mas sei que posso mais",
      "Caiu nos últimos tempos",
      "Não está legal há muito tempo",
    ],
  },
  {
    id: "intro_urgency",
    question: "Quando você quer começar a sentir a diferença?",
    options: [
      "Quero resultado rápido",
      "Nos próximos dias",
      "Ainda estou avaliando",
    ],
  },
];

export const questions: Question[] = [
  {
    id: "age",
    question: "Qual a sua faixa etária?",
    subtitle: "Isso nos ajuda a personalizar sua recomendação.",
    options: [
      {
        label: "Até 39",
        image: "/sites/cowboy/idade-ate-39.webp",
      },
      {
        label: "40-49",
        image: "/sites/cowboy/idade-40-49.webp",
      },
      {
        label: "50-59",
        image: "/sites/cowboy/idade-50-59.webp",
      },
      {
        label: "60+",
        image: "/sites/cowboy/idade-60-mais.webp",
      },
    ],
  },
  {
    id: "concern",
    question: "Qual a sua principal preocupação?",
    subtitle: "Selecione a que mais se aplica a você.",
    options: [
      {
        label: "Dificuldade de ereção",
        description: "Dificuldade em iniciar uma ereção",
      },
      {
        label: "Ereção não mantida",
        description: "A ereção não dura o suficiente",
      },
      {
        label: "Falta de desejo",
        description: "Baixa libido ou interesse sexual",
      },
      {
        label: "Ejaculação precoce",
        description: "Dificuldade em controlar o momento",
      },
    ],
  },
  {
    id: "frequency",
    question: "Com que frequência isso acontece?",
    options: [
      {
        label: "Sempre",
      },
      {
        label: "Frequentemente",
      },
      {
        label: "Às vezes",
      },
      {
        label: "Raramente",
      },
    ],
  },
  {
    id: "duration",
    question: "Você faz uso de algum medicamento atualmente?",
    options: [
      {
        label: "Não",
      },
      {
        label: "Sim",
      },
    ],
    preSelected: "Não",
  },
  {
    id: "surgery",
    question: "Já passou por alguma cirurgia?",
    options: [
      {
        label: "Não",
      },
      {
        label: "Sim",
      },
    ],
    preSelected: "Não",
  },
  {
    id: "conditions",
    question: "Você já teve alguma dessas condições?",
    options: [
      {
        label: "Nenhuma das opções",
      },
      {
        label: "Diabetes",
      },
      {
        label: "Hipertensão",
      },
      {
        label: "AVC",
      },
      {
        label: "Infarto",
      },
      {
        label: "Arritmia",
      },
      {
        label: "Outros",
      },
    ],
    preSelected: "Nenhuma das opções",
  },
  {
    id: "noticed",
    question: "Ela já percebeu?",
    subtitle: "Seja sincero. Esta resposta fica só com você.",
    options: [
      { label: "Já, e não fala nada" },
      { label: "Já, e já reclamou" },
      { label: "Acho que ainda não" },
      { label: "Estou sem parceira agora" },
    ],
  },
  {
    id: "fear",
    question: "Do que você tem mais medo?",
    subtitle: "Responda pra você mesmo. Ninguém vai ver.",
    options: [
      { label: "Dela procurar outro" },
      { label: "Dela perder o interesse em mim" },
      { label: "De desistir de vez do sexo" },
      { label: "De passar vergonha com uma mulher nova" },
    ],
  },
];

export type KitQuantity = 1 | 2 | 3;
export type Severity = "MODERADA" | "ALTA" | "MUITO ALTA";

export interface CaseResult {
  severity: Severity;
  score: number;
  /** Marker position on the gauge, 0-100. */
  gauge: number;
  points: string[];
  punchline: string;
}

/** The offer always recommends (and pre-selects) the 3-bottle kit. */
export const RECOMMENDED_KIT: KitQuantity = 3;

const SCORES: Record<string, Record<string, number>> = {
  intro_performance: {
    "Boa, mas sei que posso mais": 0,
    "Caiu nos últimos tempos": 1,
    "Não está legal há muito tempo": 2,
  },
  age: { "Até 39": 0, "40-49": 1, "50-59": 2, "60+": 2 },
  frequency: { Sempre: 3, Frequentemente: 2, "Às vezes": 1, Raramente: 0 },
  weight: { Sim: 1 },
  duration: { Sim: 1 },
  conditions: { Diabetes: 1, Hipertensão: 1, AVC: 1, Infarto: 1, Arritmia: 1, Outros: 1 },
  noticed: {
    "Já, e não fala nada": 2,
    "Já, e já reclamou": 2,
    "Acho que ainda não": 1,
    "Estou sem parceira agora": 1,
  },
};

const CONCERN: Record<string, string> = {
  "Dificuldade de ereção": "A ereção não vem",
  "Ereção não mantida": "A ereção não se sustenta",
  "Falta de desejo": "A vontade sumiu",
  "Ejaculação precoce": "Você termina rápido demais",
};
const FREQUENCY: Record<string, string> = {
  Sempre: "toda vez",
  Frequentemente: "com frequência",
  "Às vezes": "às vezes",
  Raramente: "de vez em quando",
};
const PERFORMANCE: Record<string, string> = {
  "Boa, mas sei que posso mais": "Você sabe que pode mais do que está entregando.",
  "Caiu nos últimos tempos": "Seu desempenho caiu nos últimos tempos.",
  "Não está legal há muito tempo": "Já faz tempo que não está legal.",
};
const NOTICED: Record<string, string> = {
  "Já, e não fala nada": "Ela já percebeu. E não fala nada.",
  "Já, e já reclamou": "Ela já percebeu. E já reclamou.",
  "Acho que ainda não": "Ela ainda não percebeu. Ainda.",
  "Estou sem parceira agora": "Você está sem parceira. E não quer chegar assim na próxima.",
};
const FEAR: Record<string, string> = {
  "Dela procurar outro": "Seu maior medo é ela procurar outro. Esse medo não some enquanto nada mudar.",
  "Dela perder o interesse em mim": "Seu maior medo é ela perder o interesse. Cada noite que falha alimenta esse medo.",
  "De desistir de vez do sexo": "Seu maior medo é desistir de vez. Não deixe chegar nesse ponto.",
  "De passar vergonha com uma mulher nova": "Seu maior medo é passar vergonha com uma mulher nova. Chegue preparado.",
};
const FACTORS: Record<string, Record<string, string>> = {
  age: { "50-59": "idade acima dos 50", "60+": "idade acima dos 60" },
  conditions: {
    Diabetes: "diabetes",
    Hipertensão: "pressão alta",
    AVC: "histórico de AVC",
    Infarto: "histórico de infarto",
    Arritmia: "arritmia",
  },
  weight: { Sim: "acima do peso" },
  duration: { Sim: "uso de medicamento" },
};

/**
 * Case severity from the answers: MODERADA up to 3 points, ALTA from 4 to 8,
 * MUITO ALTA from 9 (max 12). Health answers never stop the quiz; they add
 * weight here. Most men who reach the end score ALTA.
 */
export function caseResult(answers: Record<string, string>): CaseResult {
  const score = Object.entries(SCORES).reduce(
    (total, [id, table]) => total + (table[answers[id]] ?? 0),
    0,
  );
  const severity: Severity = score >= 9 ? "MUITO ALTA" : score >= 4 ? "ALTA" : "MODERADA";
  const gauge =
    severity === "MODERADA"
      ? 8 + (score / 3) * 22
      : severity === "ALTA"
        ? 38 + ((score - 4) / 4) * 34
        : 80 + (Math.min(score - 9, 2) / 2) * 14;

  const points: string[] = [];
  const concern = CONCERN[answers.concern];
  if (concern)
    points.push(`${concern}${FREQUENCY[answers.frequency] ? `, ${FREQUENCY[answers.frequency]}` : ""}.`);
  if (PERFORMANCE[answers.intro_performance]) points.push(PERFORMANCE[answers.intro_performance]);
  if (NOTICED[answers.noticed]) points.push(NOTICED[answers.noticed]);
  const factors = Object.entries(FACTORS)
    .map(([id, table]) => table[answers[id]])
    .filter(Boolean);
  if (factors.length) points.push(`Pesa no seu caso: ${factors.join(", ")}.`);

  return {
    severity,
    score,
    gauge: Math.round(gauge),
    points,
    punchline:
      FEAR[answers.fear] ?? "Quanto mais tempo fica assim, mais vira hábito. E mais ela percebe.",
  };
}
