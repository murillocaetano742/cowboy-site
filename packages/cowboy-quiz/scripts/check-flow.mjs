import assert from "node:assert/strict";
import test from "node:test";
import { initialState, LAST_QUESTION, progressFor, quizReducer, quizStepFor } from "../src/components/sites/bluue/machine.ts";
import { caseResult, problemDurationQuestion, questions, RECOMMENDED_KIT } from "../src/components/sites/bluue/data.ts";
import { checkoutHref } from "../src/components/sites/bluue/checkout.ts";
import { CONFIDENCE_QUESTION, confidenceReport, confidenceValue } from "../src/components/sites/bluue/confidence-impact.ts";
import { JOURNEY_SCREEN_STEPS, nextJourneyScreen, readJourneyScreen } from "../src/components/sites/bluue/quiz-journey-state.ts";
import { INTENSITY_QUESTION, intensityReport, intensityValue, intensitySummary } from "../src/components/sites/bluue/symptom-intensity.ts";
import { productSavings } from "../src/components/sites/bluue/quiz-product-savings.ts";
import { plans } from "../src/components/sites/bluue/quiz-offer-data.ts";

// Expected paths are transcribed from the public original handlers documented in
// docs/research/RESEARCH.md. Tests use synthetic answers and perform no I/O.
const answer = (state, id, value) => quizReducer(state, { type: "ANSWER", id, value });
const action = (state, type) => quizReducer(state, { type });
const fresh = () => structuredClone(initialState);
const screen = (state) => state.stage === "intro" ? `intro:${state.introIndex}` : state.stage === "quiz" ? `quiz:${state.questionIndex}` : state.stage;

const normalActions = [
  { type: "ANSWER", id: "intro_goal", value: "Quero melhorar tudo acima" },
  { type: "ANSWER", id: "intro_performance", value: "Boa, mas sei que posso mais" },
  { type: "ANSWER", id: "intro_urgency", value: "Ainda estou avaliando" },
  { type: "NEXT" },
  { type: "ANSWER", id: "age", value: "40-49" },
  { type: "ANSWER", id: "weight_kg", value: "82 kg" },
  { type: "ANSWER", id: "concern", value: "Ereção não mantida" },
  { type: "ANSWER", id: "frequency", value: "Às vezes" },
  { type: "NEXT" },
  { type: "ANSWER", id: "weight", value: "Não" },
  { type: "ANSWER", id: "duration", value: "Não" },
  { type: "ANSWER", id: "surgery", value: "Não" },
  { type: "ANSWER", id: "conditions", value: "Nenhuma das opções" },
  { type: "ANSWER", id: "noticed", value: "Já, e não fala nada" },
  { type: "ANSWER", id: "fear", value: "Dela procurar outro" },
  { type: "NEXT" },
];

test("v5 product savings compare current kit prices with individual bottles, excluding freight", () => {
  const single = plans.find(plan => plan.quantity === 1).cashPrice;
  assert.deepEqual(plans.map(plan => [plan.quantity, productSavings(single, plan.cashPrice, plan.quantity)]), [[3, "R$ 39,80"], [2, "R$ 5,00"], [1, null]]);
  assert.equal(productSavings("R$ 80,00", "R$ 155,00", 2), "R$ 5,00", "Savings derive from supplied prices instead of copied legacy labels");
  assert.equal(productSavings("R$ 79,90", "R$ 170,00", 2), null, "Do not advertise negative savings");
  for (const quantity of [0, 4, 1.5, NaN]) assert.equal(productSavings(single, "R$ 0,00", quantity), null);
  assert.equal(productSavings("PRIVATE", "R$ 154,80", 2), null);
  assert.equal(productSavings(single, "PRIVATE", 3), null);
});

function editorialStates() {
  const actions = [...normalActions];
  actions.splice(8, 0, { type: "ANSWER", id: "problem_duration", value: "De 1 a 6 meses" });
  return actions.reduce((states, next) => [...states, quizReducer(states.at(-1), next, "v3-editorial")], [fresh()]);
}

test("editorial adds exactly one question and reaches each ordinal from 1 to 18", () => {
  const states = editorialStates();
  assert.deepEqual(states.map((state) => quizStepFor(state, "v3-editorial")), Array.from({ length: 18 }, (_, index) => index + 1));
  assert.equal(screen(states[8]), "timeframe");
  assert.equal(Object.keys(states.at(-1).answers).length, 14);
  assert.equal(states.at(-1).answers.problem_duration, "De 1 a 6 meses");
  assert.equal(states.at(-1).answers.duration, "Não", "Medication retains its distinct existing key");
  for (const variant of ["v1-direto", "v2-vsl"]) {
    const original = normalActions.reduce((states, next) => [...states, quizReducer(states.at(-1), next, variant)], [fresh()]);
    assert.deepEqual(original.map((state) => quizStepFor(state, variant)), Array.from({ length: 17 }, (_, index) => index + 1));
    assert.ok(original.every((state) => state.stage !== "timeframe"));
  }
});

test("editorial back decrements visible progress and preserves all remembered answers", () => {
  for (const state of editorialStates().filter((state) => ["intro", "quiz", "weight_kg", "weight", "timeframe", "testimonials"].includes(state.stage))) {
    const previous = quizReducer(state, { type: "BACK" }, "v3-editorial");
    assert.equal(quizStepFor(previous, "v3-editorial"), Math.max(1, quizStepFor(state, "v3-editorial") - 1));
    assert.deepEqual(previous.answers, state.answers);
  }
  const concern = editorialStates().find((state) => state.stage === "quiz" && state.questionIndex === 1);
  const ruler = quizReducer(concern, { type: "BACK" }, "v3-editorial");
  assert.equal(ruler.answers.weight_kg, "82 kg");
});

test("timeframe context never changes scoring or fabricates result statements", () => {
  const original = normalStates().at(-1).answers;
  for (const option of problemDurationQuestion.options) {
    assert.deepEqual(caseResult({ ...original, problem_duration: option.label }), caseResult(original));
  }
  assert.equal(problemDurationQuestion.id, "problem_duration");
  assert.equal(problemDurationQuestion.options.length, 5);
});

function normalStates() {
  return normalActions.reduce((states, next) => [...states, quizReducer(states.at(-1), next)], [fresh()]);
}

test("v4 preserves 14 answers and 18 ordinals while replacing only the third introductory answer", () => {
  const actions = normalActions.map((action, index) => index === 2 ? { type: "ANSWER", id: "confidence_impact", value: "none" } : action);
  actions.splice(8, 0, { type: "ANSWER", id: "problem_duration", value: "Há mais de 1 ano" });
  const states = actions.reduce((all, next) => [...all, quizReducer(all.at(-1), next, "v4-jornada")], [fresh()]);
  assert.deepEqual(states.map(state => quizStepFor(state, "v4-jornada")), Array.from({ length: 18 }, (_, index) => index + 1));
  assert.equal(Object.keys(states.at(-1).answers).length, 14);
  assert.equal(states.at(-1).answers.confidence_impact, "none");
  assert.equal(states.at(-1).answers.intro_urgency, undefined);
  for (const state of states.filter(state => ["intro", "quiz", "weight_kg", "weight", "timeframe", "testimonials"].includes(state.stage))) {
    const previous = quizReducer(state, { type: "BACK" }, "v4-jornada");
    assert.equal(quizStepFor(previous, "v4-jornada"), Math.max(1, quizStepFor(state, "v4-jornada") - 1));
    assert.deepEqual(previous.answers, state.answers);
  }
  assert.equal(editorialStates().at(-1).answers.intro_urgency, "Ainda estou avaliando");
});

test("confidence summary exactly reflects the four self-reports and never invents a default", () => {
  assert.equal(CONFIDENCE_QUESTION.question, "Quanto isso afeta sua confiança hoje?");
  for (const [value, label] of [["none", "Nada"], ["little", "Um pouco"], ["considerable", "Bastante"], ["much", "Muito"]]) {
    assert.equal(confidenceReport(value).label, label);
    assert.equal(confidenceValue(label), value);
    assert.equal(confidenceReport(value).severity, undefined);
    assert.equal(confidenceReport(value).score, undefined);
  }
  for (const invalid of [undefined, "", "ALTA", "PRIVATE", "Nada", { age: "70", conditions: "PRIVATE" }]) assert.equal(confidenceReport(invalid), null);
});

test("v5 replaces only Q3 with direct intensity and keeps 14 answers before its four final screens", () => {
  const actions = normalActions.map((action, index) => index === 2 ? { type: "ANSWER", id: "symptom_intensity", value: "none" } : action);
  actions.splice(8, 0, { type: "ANSWER", id: "problem_duration", value: "Há mais de 1 ano" });
  const v5 = actions.reduce((all, next) => [...all, quizReducer(all.at(-1), next, "v5-etapas")], [fresh()]);
  assert.equal(Object.keys(v5.at(-1).answers).length, 14);
  assert.equal(v5.at(-1).answers.symptom_intensity, "none");
  assert.equal(v5.at(-1).answers.confidence_impact, undefined);
  const restored = quizReducer(v5[3], { type: "BACK" }, "v5-etapas");
  assert.equal(restored.answers.symptom_intensity, "none");
  assert.deepEqual(v5.map(state => quizStepFor(state, "v5-etapas")), Array.from({ length: 18 }, (_, index) => index + 1));
  let screen = "result";
  const screens = [screen];
  for (let index = 0; index < 3; index++) { screen = nextJourneyScreen(screen, true); screens.push(screen); }
  assert.deepEqual(screens, ["result", "presentation", "testimonials", "offer"]);
  assert.deepEqual(screens.map(value => JOURNEY_SCREEN_STEPS[value]), [18, 19, 20, 21]);
  assert.equal(nextJourneyScreen("offer", true), "offer");
  assert.equal(nextJourneyScreen("presentation", false), "offer", "v4 never inserts testimonials");
  assert.equal(readJourneyScreen("testimonials", false), "result");
  assert.equal(readJourneyScreen("testimonials", true), "testimonials");
  for (const value of [undefined, "PRIVATE", { confidence_impact: "much" }]) assert.equal(readJourneyScreen(value, true), "result");
});

test("v5 intensity faithfully reflects five self-reports without assigning a score or medical weight", () => {
  assert.equal(INTENSITY_QUESTION.id, "symptom_intensity");
  assert.equal(INTENSITY_QUESTION.question, "Como você avalia a intensidade dessa dificuldade hoje?");
  const expected = [
    ["none", "Não percebo dificuldade hoje", "Nenhuma", 6],
    ["light", "Leve", "Leve", 26], ["moderate", "Moderada", "Moderada", 48],
    ["high", "Alta", "Alta", 70], ["very_high", "Muito alta", "Muito alta", 94],
  ];
  for (const [value, option, label, gauge] of expected) {
    const report = intensityReport(value);
    assert.equal(intensityValue(option), value);
    assert.equal(report.label, label);
    assert.equal(report.gauge, gauge);
    assert.equal(report.score, undefined);
    assert.equal(report.severity, undefined);
    const extraAnswers = { symptom_intensity: value, age: "60+", conditions: "Diabetes", duration: "Sim", weight: "Sim" };
    assert.deepEqual(intensityReport(extraAnswers.symptom_intensity), report, "Health context never weights this direct self-report");
  }
  for (const invalid of [undefined, "", "PRIVATE", "Alta", "much", "toString", { symptom_intensity: "high" }]) assert.equal(intensityReport(invalid), null);
  assert.equal(intensityValue("PRIVATE"), undefined);
  assert.equal(confidenceReport("none").label, "Nada", "v4 keeps its own question and wording");
});

test("v5 factual list quotes only recognized choices and never interprets risk or recommends a kit", () => {
  const answers = Object.freeze({
    concern: "Ereção não mantida", frequency: "Às vezes", intro_performance: "Boa, mas sei que posso mais", noticed: "Estou sem parceira agora",
    age: "60+", conditions: "Diabetes", fear: "PRIVATE", weight_kg: "PRIVATE", symptom_intensity: "none",
  });
  assert.deepEqual(intensitySummary(answers), [
    "Você informou sua principal preocupação: “Ereção não mantida”.",
    "Você informou a frequência: “Às vezes”.",
    "Você informou sua percepção do desempenho: “Boa, mas sei que posso mais”.",
    "Você informou sobre a percepção da parceira: “Estou sem parceira agora”.",
  ]);
  assert.deepEqual(intensitySummary({ concern: "<script>PRIVATE</script>", frequency: "PRIVATE", intro_performance: "PRIVATE", noticed: "PRIVATE" }), []);
  assert.deepEqual(intensitySummary({}), []);
  assert.doesNotMatch(intensitySummary(answers).join(" "), /PRIVATE|Pesa no seu caso|diagnóstico|kit|diabetes|score/i);
});

function atQuestion(index) {
  const state = normalStates().find((candidate) => candidate.stage === "quiz" && candidate.questionIndex === index);
  assert.ok(state, `Normal flow reaches question ${index}`);
  return state;
}

test("normal path follows all 17 screens and stores the 13 answers", () => {
  const states = normalStates();
  assert.deepEqual(states.map(screen), [
    "intro:0", "intro:1", "intro:2", "explanation", "quiz:0", "weight_kg", "quiz:1", "quiz:2",
    "testimonials", "weight", "quiz:3", "quiz:4", "quiz:5", "quiz:6", "quiz:7", "analyzing", "precheckout",
  ]);
  assert.deepEqual(states.at(-1).answers, {
    intro_goal: "Quero melhorar tudo acima",
    intro_performance: "Boa, mas sei que posso mais",
    intro_urgency: "Ainda estou avaliando",
    age: "40-49",
    weight_kg: "82 kg",
    concern: "Ereção não mantida",
    frequency: "Às vezes",
    weight: "Não",
    duration: "Não",
    surgery: "Não",
    conditions: "Nenhuma das opções",
    noticed: "Já, e não fala nada",
    fear: "Dela procurar outro",
  });
});

test("health answers never interrupt: medication, surgery and every condition go to the next question", () => {
  assert.equal(screen(answer(atQuestion(3), "duration", "Sim")), "quiz:4");
  assert.equal(screen(answer(atQuestion(4), "surgery", "Sim")), "quiz:5");
  for (const option of questions.find((question) => question.id === "conditions").options) {
    const next = answer(atQuestion(5), "conditions", option.label);
    assert.equal(screen(next), "quiz:6", option.label);
    assert.equal(next.answers.conditions, option.label);
  }
});

test("every question's back destination follows the source matrix", () => {
  const expected = ["explanation", "weight_kg", "quiz:1", "weight", "quiz:3", "quiz:4", "quiz:5", "quiz:6"];
  for (let index = 0; index < expected.length; index++) {
    const current = atQuestion(index);
    const previous = action(current, "BACK");
    assert.equal(screen(previous), expected[index], `question ${index}`);
    assert.equal(previous.direction, -1);
    assert.deepEqual(previous.answers, current.answers);
  }
});

test("intro back destinations preserve answers and cannot underflow", () => {
  const states = normalStates();
  assert.equal(screen(action(states[2], "BACK")), "intro:1");
  assert.equal(screen(action(states[1], "BACK")), "intro:0");
  assert.equal(screen(action(states[0], "BACK")), "intro:0");
  assert.deepEqual(action(states[2], "BACK").answers, states[2].answers);
});

test("weight and testimonial back buttons return to frequency; ruler returns to age", () => {
  const states = normalStates();
  for (const stage of ["testimonials", "weight"]) {
    const state = states.find((candidate) => candidate.stage === stage);
    assert.equal(screen(action(state, "BACK")), "quiz:2");
  }
  const ruler = states.find((candidate) => candidate.stage === "weight_kg");
  assert.equal(screen(action(ruler, "BACK")), "quiz:0");
});

test("visible progress matches the original's non-linear ten-unit scale", () => {
  const states = normalStates();
  const expected = new Map([
    ["quiz:0", 1], ["weight_kg", 2], ["quiz:1", 3], ["quiz:2", 4], ["testimonials", 4],
    ["weight", 5], ["quiz:3", 5], ["quiz:4", 6], ["quiz:5", 7], ["quiz:6", 8], ["quiz:7", 9],
  ]);
  for (const state of states) {
    if (expected.has(screen(state))) assert.equal(progressFor(state), expected.get(screen(state)), screen(state));
  }
});

test("source-supported timers advance only explanation, testimonials and analyzing", () => {
  for (const [stage, destination] of [["explanation", "quiz:0"], ["testimonials", "weight"], ["analyzing", "precheckout"]]) {
    const state = normalStates().find((candidate) => candidate.stage === stage);
    assert.equal(screen(action(state, "NEXT")), destination);
  }
  for (const state of normalStates().filter((candidate) => !["explanation", "testimonials", "analyzing"].includes(candidate.stage))) {
    assert.deepEqual(action(state, "NEXT"), state, screen(state));
  }
});

test("weight answer is overwritten after returning, with other answers retained", () => {
  const concern = atQuestion(1);
  const ruler = action(concern, "BACK");
  assert.equal(ruler.answers.weight_kg, "82 kg");
  const corrected = answer(ruler, "weight_kg", "70 kg");
  assert.equal(screen(corrected), "quiz:1");
  assert.equal(corrected.answers.weight_kg, "70 kg");
  assert.equal(corrected.answers.age, "40-49");
});

test("reducer does not mutate source state or shared initial answers", () => {
  const state = fresh();
  Object.freeze(state.answers);
  Object.freeze(state);
  const next = answer(state, "intro_goal", "Sexo mais longo");
  assert.notEqual(next, state);
  assert.notEqual(next.answers, state.answers);
  assert.deepEqual(state, initialState);
  assert.deepEqual(initialState.answers, {});
  normalStates();
  assert.deepEqual(initialState.answers, {});
});

test("COWBOY: the machine's last question is the last one in data.ts", () => {
  assert.equal(LAST_QUESTION, questions.length - 1);
  assert.deepEqual(questions.slice(-2).map((question) => question.id), ["noticed", "fear"]);
});

test("COWBOY: the normal path scores ALTA, cites the answers and always recommends 3 bottles", () => {
  const result = caseResult(normalStates().at(-1).answers);
  assert.equal(result.severity, "ALTA");
  assert.equal(RECOMMENDED_KIT, 3);
  assert.ok(result.gauge >= 38 && result.gauge <= 72, String(result.gauge));
  assert.deepEqual(result.points, [
    "A ereção não se sustenta, às vezes.",
    "Você sabe que pode mais do que está entregando.",
    "Ela já percebeu. E não fala nada.",
  ]);
  assert.match(result.punchline, /procurar outro/);
});

test("COWBOY: severity follows the score (moderada, alta, muito alta)", () => {
  const low = caseResult({ intro_performance: "Boa, mas sei que posso mais", age: "Até 39", frequency: "Raramente", noticed: "Acho que ainda não" });
  assert.equal(low.severity, "MODERADA");
  const high = caseResult({
    intro_performance: "Não está legal há muito tempo", age: "60+", frequency: "Sempre", weight: "Sim",
    conditions: "Diabetes", noticed: "Já, e já reclamou", concern: "Dificuldade de ereção",
  });
  assert.equal(high.severity, "MUITO ALTA");
  assert.equal(high.score, 11);
  assert.ok(high.points.includes("Pesa no seu caso: idade acima dos 60, diabetes, acima do peso."));
  const cardiac = caseResult({ age: "40-49", frequency: "Às vezes", conditions: "Infarto", duration: "Sim", noticed: "Acho que ainda não" });
  assert.equal(cardiac.score, 5);
  assert.ok(cardiac.points.includes("Pesa no seu caso: histórico de infarto, uso de medicamento."));
  assert.equal(caseResult({}).severity, "MODERADA");
  for (const r of [low, high, caseResult({})]) assert.ok(r.gauge >= 0 && r.gauge <= 100);
});

test("COWBOY: checkout link carries the kit and only allowlisted tracking parameters", () => {
  const href = new URL(checkoutHref(3, "?utm_source=fb&utm_campaign=quiz&fbclid=abc&src=RB&email=x%40y.com"));
  assert.equal(href.origin + href.pathname, "https://www.cowboyenergiamasculina.com.br/api/checkout");
  assert.equal(href.searchParams.get("quantity"), "3");
  assert.equal(href.searchParams.get("utm_source"), "fb");
  assert.equal(href.searchParams.get("utm_campaign"), "quiz");
  assert.equal(href.searchParams.get("fbclid"), "abc");
  assert.equal(href.searchParams.get("src"), "RB");
  assert.equal(href.searchParams.has("email"), false);
  assert.equal(new URL(checkoutHref(1)).search, "?quantity=1");
  assert.equal(new URL(checkoutHref(2, `?utm_term=${"x".repeat(300)}`)).searchParams.has("utm_term"), false);
});
