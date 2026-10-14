"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useReducer, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft } from "lucide-react";
import { intro, questions, problemDurationQuestion, RECOMMENDED_KIT, type Question } from "@/components/sites/bluue/data";
import { initialState, progressFor, quizReducer, quizStepFor, type QuizState, type QuizAction } from "@/components/sites/bluue/machine";
import { trackOfferView, trackQuizAnswer, trackQuizBack, trackQuizComplete, trackQuizStart, trackQuizStep } from "@/lib/quiz-tracking";
import type { QuizVariant } from "@/lib/quiz-variant";
import {
  Explanation,
  Testimonials,
  Analyzing,
  ConsentModal,
} from "@/components/sites/bluue/SpecialScreens";
import { PreCheckout } from "@/components/sites/bluue/PreCheckout";
import { CONFIDENCE_QUESTION, confidenceReport, confidenceValue } from "@/components/sites/bluue/confidence-impact";
import { QuizJourney } from "@/components/sites/bluue/quiz-journey";
import { Logo } from "@/components/sites/bluue/Logo";
import styles from "@/components/sites/bluue/quiz-flow.module.css";

const panel =
  "flex flex-col items-center px-4 py-4 max-w-lg mx-auto h-[100dvh] overflow-hidden";
const unselected = "cb-option";
const selectedOption = "cb-option-selected";

export function Progress({ current }: { current: number }) {
  const percent = Math.min(100, Math.max(6, current * 10));
  return (
    <div className="w-full px-4 pt-3">
      <div
        className="w-full h-1.5 bg-muted/60 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progresso do questionário"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function Header({
  onBack,
  weight = false,
}: {
  onBack: () => void;
  weight?: boolean;
}) {
  return (
    <div
      className={
        weight
          ? "w-full flex items-center justify-between px-6 pt-6 pb-4 flex-shrink-0"
          : "w-full flex items-center justify-between mb-4"
      }
    >
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>
      <Logo className="text-[15px]" />
      <div className="w-14" />
    </div>
  );
}

function useChoice(
  onAnswer: (answer: string) => void,
  initial: string | null = null,
) {
  const [selected, setSelected] = useState(initial);
  const busy = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  function choose(value: string) {
    if (busy.current) return;
    busy.current = true;
    setSelected(value);
    timers.current = [setTimeout(() => onAnswer(value), 200)];
  }
  return { selected, choose };
}

function IntroScreen({
  index,
  onAnswer,
  onBack,
  editorial = false,
  savedAnswer,
  journey = false,
}: {
  index: number;
  onAnswer: (answer: string) => void;
  onBack: () => void;
  editorial?: boolean;
  savedAnswer?: string;
  journey?: boolean;
}) {
  const [consentOpen, setConsentOpen] = useState(false);
  const data = journey && index === 2 ? CONFIDENCE_QUESTION : intro[index];
  return (
    <div className="flex flex-col items-center px-4 py-6 pt-8 max-w-lg mx-auto min-h-[100dvh]">
      <Logo className="cb-logo-lg mb-4 flex-shrink-0" />
      {index > 0 && (
        <button
          type="button"
          onClick={onBack}
          className="self-start mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      )}
      {!editorial && <div className="cb-steps flex items-center rounded-full px-1.5 py-1.5 mb-6 gap-1 shadow-sm border">
        {[0, 1, 2].map((step) => (
          <div
            key={step}
            className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all duration-300 ${step === index ? "cb-step-active" : step < index ? "bg-primary/15 text-primary" : "text-muted-foreground"}`}
          >
            {step + 1}
          </div>
        ))}
      </div>}
      <h2 className="text-xl md:text-2xl font-extrabold text-foreground text-center mb-3 leading-tight">
        {data.question}
      </h2>
      <div className="flex flex-col gap-2.5 w-full">
        {data.options.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onAnswer(option)}
            aria-pressed={editorial ? savedAnswer === option : undefined}
            className={`w-full text-left rounded-2xl border-2 px-4 py-3 flex items-center gap-3 transition-all duration-200 backdrop-blur-sm active:scale-[0.97] ${savedAnswer === option ? selectedOption : unselected} hover:scale-[1.01]`}
          >
            <div className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 border-muted-foreground/30" />
            <span className="text-sm font-semibold text-foreground">
              {option}
            </span>
          </button>
        ))}
      </div>
      {index === 0 && (
        <>
          <div className="w-full mt-3 rounded-2xl overflow-hidden flex-shrink-0">
            <img
              src="/sites/cowboy/casal-cumplicidade.webp"
              alt="Casal sorrindo de mãos dadas no sofá"
              className="w-full h-auto max-h-[22vh] object-cover rounded-2xl"
              style={{ objectPosition: "50% 22%" }}
              loading="eager"
              fetchPriority="high"
              width={1024}
              height={1536}
            />
          </div>
          <p className="mt-3 max-w-md text-[10px] leading-relaxed text-foreground/45 [&_button:hover]:text-foreground/70 mx-auto mt-6 text-center">
            Ao clicar em uma das opções acima você concorda com o{" "}
            <button
              type="button"
              onClick={() => setConsentOpen(true)}
              className="underline underline-offset-2 transition-colors"
            >
              uso das suas respostas
            </button>{" "}
            pela COWBOY Energia. Elas ficam só neste aparelho e servem para{" "}
            {editorial ? "organizar um resumo. Ao final, você verá esse resumo e uma oferta." : "indicar o kit certo pra você."}
          </p>
        </>
      )}
      {consentOpen && <ConsentModal onClose={() => setConsentOpen(false)} neutral={journey} />}
    </div>
  );
}

function QuestionScreen({
  data,
  onAnswer,
  onBack,
  savedAnswer,
}: {
  data: Question;
  onAnswer: (answer: string) => void;
  onBack: () => void;
  savedAnswer?: string;
}) {
  const { selected, choose } = useChoice(onAnswer, savedAnswer ?? data.preSelected ?? null);
  const hasImages = data.options.some((option) => option.image);
  return (
    <div className={panel}>
      <Header onBack={onBack} />
      <div className="w-full flex-1 flex flex-col pt-[60px]">
        <h2 className="text-xl md:text-2xl font-extrabold text-foreground mb-1 leading-tight text-center">
          {data.question}
        </h2>
        {data.subtitle && (
          <p className="text-sm text-muted-foreground mb-3 text-center">
            {data.subtitle}
          </p>
        )}
        <div
          className={
            hasImages
              ? "grid grid-cols-2 gap-2 mt-3"
              : "flex flex-col gap-2 mt-3"
          }
        >
          {data.options.map((option) =>
            hasImages ? (
              <button
                type="button"
                key={option.label}
                onClick={() => choose(option.label)}
                aria-pressed={selected === option.label}
                className={`flex flex-col items-center rounded-2xl border-2 p-3 transition-all duration-200 backdrop-blur-sm active:scale-[0.97] ${selected === option.label ? selectedOption : unselected}`}
              >
                <img
                  src={option.image}
                  alt={`Homem na faixa ${option.label}`}
                  className="cb-age-photo w-full aspect-square rounded-xl object-cover mb-2"
                  loading="eager"
                />
                <span className="text-sm font-bold text-foreground">
                  {option.label}
                </span>
              </button>
            ) : (
              <button
                type="button"
                key={option.label}
                onClick={() => choose(option.label)}
                aria-pressed={selected === option.label}
                className={`w-full text-center rounded-xl border-2 px-4 py-3 flex items-center justify-center gap-3 transition-all duration-200 ease-out backdrop-blur-sm active:scale-[0.97] ${selected === option.label ? selectedOption : `${unselected} hover:scale-[1.01]`}`}
              >
                <div className="flex-1">
                  <span className="text-base font-semibold text-foreground">
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="block text-sm text-muted-foreground mt-0.5">
                      {option.description}
                    </span>
                  )}
                </div>
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function OverweightScreen({
  onAnswer,
  onBack,
  savedAnswer,
}: {
  onAnswer: (answer: string) => void;
  onBack: () => void;
  savedAnswer?: string;
}) {
  const { selected, choose } = useChoice(onAnswer, savedAnswer ?? "Não");
  return (
    <div className={panel}>
      <Header onBack={onBack} />
      <div className="w-full flex-1 flex flex-col items-center pt-[60px]">
        <h2 className="text-xl md:text-2xl font-extrabold text-foreground mb-8 text-center">
          {"Você está acima do peso\n(obeso/sobrepeso)?"}
        </h2>
        <div className="flex flex-col gap-3 w-full">
          {["Não", "Sim"].map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => choose(option)}
              aria-pressed={selected === option}
              className={`w-full text-left rounded-2xl border-2 px-5 py-4 transition-all duration-200 backdrop-blur-sm active:scale-[0.97] ${selected === option ? selectedOption : unselected}`}
            >
              <span className="text-base font-semibold text-foreground">
                {option}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function WeightScreen({
  onAnswer,
  onBack,
  savedAnswer,
}: {
  onAnswer: (answer: string) => void;
  onBack: () => void;
  savedAnswer?: string;
}) {
  const [weight, setWeight] = useState(() => savedAnswer ? Number.parseInt(savedAnswer, 10) : 70);
  const drag = useRef<{ x: number; weight: number } | null>(null);
  const clamp = (value: number) =>
    Math.max(40, Math.min(180, Math.round(value)));
  const start = Math.max(40, weight - 20);
  const end = Math.min(180, weight + 20);
  return (
    <div className="flex flex-col items-center h-[100dvh] max-w-lg mx-auto bg-background">
      <Header onBack={onBack} weight />
      <div className="flex-1 flex flex-col items-center justify-center w-full px-6">
        <h2 className="text-[22px] font-extrabold text-foreground mb-5 text-center leading-tight">
          Qual é o seu peso atual?
        </h2>
        <div className="flex items-center mb-7">
          <div className="px-6 py-1.5 bg-primary text-primary-foreground text-sm font-bold rounded-full">
            kg
          </div>
        </div>
        <div className="flex items-baseline justify-center gap-0.5 mb-8">
          <span className="text-[56px] font-black text-foreground leading-none tracking-tight">
            {weight}
          </span>
          <span className="text-lg font-bold text-muted-foreground">kg</span>
        </div>
        <div className="w-full max-w-[300px] mx-auto relative mb-2">
          <div
            className="cursor-grab active:cursor-grabbing touch-none select-none relative"
            role="slider"
            aria-label="Peso atual em quilogramas"
            aria-valuemin={40}
            aria-valuemax={180}
            aria-valuenow={weight}
            aria-valuetext={`${weight} kg`}
            tabIndex={0}
            onPointerDown={(event) => {
              drag.current = { x: event.clientX, weight };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (drag.current)
                setWeight(
                  clamp(
                    drag.current.weight + (drag.current.x - event.clientX) / 10,
                  ),
                );
            }}
            onPointerUp={() => {
              drag.current = null;
            }}
            onPointerCancel={() => {
              drag.current = null;
            }}
            onKeyDown={(event) => {
              const changes: Record<string, number> = {
                ArrowRight: 1,
                ArrowUp: 1,
                ArrowLeft: -1,
                ArrowDown: -1,
                PageUp: 10,
                PageDown: -10,
              };
              if (event.key in changes) {
                event.preventDefault();
                setWeight(clamp(weight + changes[event.key]));
              } else if (event.key === "Home" || event.key === "End") {
                event.preventDefault();
                setWeight(event.key === "Home" ? 40 : 180);
              }
            }}
          >
            <svg
              width="300"
              height="70"
              viewBox="0 0 300 70"
              className="w-full"
              aria-hidden="true"
            >
              <line
                x1="0"
                y1="2"
                x2="300"
                y2="2"
                stroke="var(--quiz-ruler-line, rgba(154,111,31,.35))"
                strokeWidth="1"
              />
              {Array.from({ length: end - start + 1 }, (_, index) => {
                const n = start + index;
                const x = 150 + (n - weight) * 10;
                if (x < -10 || x > 310) return null;
                const ten = n % 10 === 0;
                const five = n % 5 === 0 && !ten;
                const height = ten ? 30 : five ? 20 : 12;
                return (
                  <g key={n}>
                    <line
                      x1={x}
                      y1={2}
                      x2={x}
                      y2={2 + height}
                      stroke={ten ? "var(--quiz-ruler-major, #5f564a)" : five ? "var(--quiz-ruler-medium, #a39a8c)" : "var(--quiz-ruler-minor, #d9d0c1)"}
                      strokeWidth={ten ? 2 : five ? 1.5 : 1}
                      strokeLinecap="round"
                    />
                    {ten && (
                      <text
                        x={x}
                        y={2 + height + 14}
                        textAnchor="middle"
                        fill="var(--quiz-ruler-text, #8a8173)"
                        fontSize="12"
                        fontWeight="500"
                        fontFamily="system-ui, sans-serif"
                      >
                        {n}
                      </text>
                    )}
                  </g>
                );
              })}
              <line
                x1="150"
                y1="0"
                x2="150"
                y2="34"
                stroke="var(--ring)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <polygon points="143,34 157,34 150,44" fill="var(--ring)" />
            </svg>
          </div>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-primary/60 text-lg ruler-arrow-left">←</span>
            <p className="text-[12px] text-muted-foreground">
              Arraste para ajustar
            </p>
            <span className="text-primary/60 text-lg ruler-arrow-right">→</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onAnswer(`${weight} kg`)}
          className="cb-btn mt-8 w-full max-w-md font-bold py-4 rounded-2xl text-base"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

interface QuizProps {
  variant?: QuizVariant;
}

const subscribeRestart = () => () => {};
const readRestart = () => ["result", "presentation", "testimonials", "offer"].includes(window.history.state?.cowboyJourney);
const noRestart = () => false;
function JourneyRestartNotice() {
  const restarted = useSyncExternalStore(subscribeRestart, readRestart, noRestart);
  return restarted ? <p role="status" className={styles.restart}>Esta sessão foi reiniciada. Responda novamente para ver seu resumo.</p> : null;
}

export function Quiz({ variant = "v1-direto" }: QuizProps) {
  const [state, dispatch] = useReducer((current: QuizState, action: QuizAction) => quizReducer(current, action, variant), initialState);
  const { stage, introIndex, questionIndex } = state;
  const [finalStep, setFinalStep] = useState(18);
  const focusAfterContinue = useRef(false);
  const quizRef = useRef<HTMLElement>(null);
  const split = variant === "v5-etapas";
  const journey = variant === "v4-jornada" || split;
  const editorial = variant === "v3-editorial" || journey;
  const stepIndex = split && stage === "precheckout" ? finalStep : quizStepFor(state, variant);
  const stepTotal = split ? 21 : 18;
  const question = questions[questionIndex];
  const next = () => dispatch({ type: "NEXT" });
  const back = () => {
    const previous = quizReducer(state, { type: "BACK" }, variant);
    trackQuizBack(stepIndex, quizStepFor(previous, variant), variant);
    dispatch({ type: "BACK" });
  };
  const answer = (id: string, value: string) => {
    trackQuizStart(variant);
    trackQuizAnswer(stepIndex, variant);
    dispatch({ type: "ANSWER", id, value });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    if (focusAfterContinue.current) {
      const title = quizRef.current?.querySelector<HTMLElement>("h1, h2");
      if (title) { title.tabIndex = -1; title.focus({ preventScroll: true }); }
      focusAfterContinue.current = false;
    }
    // Only an ordinal crosses the analytics boundary; answer/state objects never do.
    trackQuizStep(stepIndex, variant);
    if (stage === "precheckout" && (!split || stepIndex === 18)) {
      trackQuizComplete(variant);
      if (!editorial) trackOfferView(RECOMMENDED_KIT, variant);
    }
  }, [stage, stepIndex, variant, editorial, split]);
  return (
    <main
      ref={quizRef}
      className={`min-h-screen cb-bg${editorial ? ` ${styles.flow}` : ""}`}
      data-stage={stage}
      data-step-index={editorial ? stepIndex : undefined}
    >
      {journey && stage === "intro" && introIndex === 0 && <JourneyRestartNotice />}
      {editorial && (split || !(journey && stage === "precheckout")) && <div className={styles.progress} data-quiz-progress>
        <p>Etapa {stepIndex} de {stepTotal}</p>
        <div className={styles.track} role="progressbar" aria-label={split ? "Progresso da jornada" : "Progresso do questionário"} aria-valuemin={0} aria-valuemax={stepTotal} aria-valuenow={stepIndex} aria-valuetext={`Etapa ${stepIndex} de ${stepTotal}`}>
          <div className={styles.fill} style={{ width: `${stepIndex / stepTotal * 100}%` }} />
        </div>
      </div>}
      {!editorial && ["quiz", "weight", "weight_kg"].includes(stage) && (
        <Progress current={progressFor(state)} />
      )}
      {stage === "intro" && (
        <IntroScreen
          key={introIndex}
          index={introIndex}
          onAnswer={(value) => {
            if (journey && introIndex === 2) {
              const impact = confidenceValue(value);
              if (impact) answer(CONFIDENCE_QUESTION.id, impact);
            } else answer(intro[introIndex].id, value);
          }}
          onBack={back}
          editorial={editorial}
          journey={journey}
          savedAnswer={journey && introIndex === 2 ? confidenceReport(state.answers.confidence_impact)?.label : editorial ? state.answers[intro[introIndex].id] : undefined}
        />
      )}
      {stage === "explanation" && <Explanation onNext={() => { focusAfterContinue.current = journey; next(); }} editorial={editorial} floatingContinue={journey} />}
      {stage === "quiz" && (
        <QuestionScreen
          key={question.id}
          data={question}
          onAnswer={(value) => answer(question.id, value)}
          onBack={back}
          savedAnswer={editorial ? state.answers[question.id] : undefined}
        />
      )}
      {stage === "timeframe" && <QuestionScreen key="problem_duration" data={problemDurationQuestion} savedAnswer={state.answers.problem_duration} onAnswer={(value) => answer(problemDurationQuestion.id, value)} onBack={back} />}
      {stage === "weight_kg" && (
        <WeightScreen
          onAnswer={(value) => answer("weight_kg", value)}
          onBack={back}
          savedAnswer={editorial ? state.answers.weight_kg : undefined}
        />
      )}
      {stage === "weight" && (
        <OverweightScreen
          onAnswer={(value) => answer("weight", value)}
          onBack={back}
          savedAnswer={editorial ? state.answers.weight : undefined}
        />
      )}
      {stage === "testimonials" && <Testimonials onNext={next} onBack={back} editorial={editorial} />}
      {stage === "analyzing" && <Analyzing onNext={next} neutral={journey} />}
      {stage === "precheckout" && (journey ? <QuizJourney impact={state.answers.confidence_impact} variant={split ? "v5-etapas" : "v4-jornada"} onStepChange={split ? setFinalStep : undefined} /> : <PreCheckout answers={state.answers} variant={variant} />)}
    </main>
  );
}
