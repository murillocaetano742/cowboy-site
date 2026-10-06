import assert from "node:assert/strict";
import test from "node:test";
import { initialState, LAST_QUESTION, progressFor, quizReducer } from "../src/components/sites/bluue/machine.ts";
import { caseResult, questions, RECOMMENDED_KIT } from "../src/components/sites/bluue/data.ts";
import { checkoutHref } from "../src/components/sites/bluue/checkout.ts";

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

function normalStates() {
  return normalActions.reduce((states, next) => [...states, quizReducer(states.at(-1), next)], [fresh()]);
}

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
