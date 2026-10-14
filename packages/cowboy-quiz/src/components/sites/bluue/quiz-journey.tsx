"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { confidenceReport } from "@/components/sites/bluue/confidence-impact";
import { intensityReport } from "@/components/sites/bluue/symptom-intensity";
import { Logo } from "@/components/sites/bluue/Logo";
import { QuizIntensityResult } from "@/components/sites/bluue/quiz-intensity-result";
import { QuizJourneyDock } from "@/components/sites/bluue/quiz-journey-dock";
import { QuizVsl } from "@/components/sites/bluue/quiz-vsl";
import { QuizJourneyOffer } from "@/components/sites/bluue/quiz-journey-offer";
import { QuizSocialProof } from "@/components/sites/bluue/quiz-social-proof";
import { JOURNEY_SCREEN_STEPS, nextJourneyScreen, readJourneyScreen } from "@/components/sites/bluue/quiz-journey-state";
import { RECOMMENDED_KIT, type KitQuantity } from "@/components/sites/bluue/data";
import { trackJourneyAction, trackJourneyView, trackResultView, trackViewKits, type JourneyScreen } from "@/lib/quiz-tracking";
import styles from "@/components/sites/bluue/quiz-journey.module.css";

interface QuizJourneyProps {
  impact: string | undefined;
  answers?: Readonly<Record<string, string>>;
  variant?: "v4-jornada" | "v5-etapas";
  onStepChange?: (step: number) => void;
}
const PHASES = [
  { id: "result", label: "Resultado" },
  { id: "presentation", label: "Apresentação" },
  { id: "offer", label: "Oferta" },
] as const;

export function QuizJourney({ impact, answers, variant = "v4-jornada", onStepChange }: QuizJourneyProps) {
  const split = variant === "v5-etapas";
  const report = split ? intensityReport(answers?.symptom_intensity) : confidenceReport(impact);
  const confidence = confidenceReport(impact);
  const [screen, setScreen] = useState<JourneyScreen>("result");
  const [hasVideo, setHasVideo] = useState(false);
  const [hasTestimonials, setHasTestimonials] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<KitQuantity>(RECOMMENDED_KIT);
  const [presentationReady, setPresentationReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const releasePresentation = useCallback(() => setPresentationReady(true), []);

  useEffect(() => {
    // Only fixed navigation identifiers enter history; personal state stays in Quiz.
    window.history.replaceState({ ...window.history.state, cowboyJourney: "result" }, "", window.location.href);
    const onPop = (event: PopStateEvent) => {
      const next = readJourneyScreen(event.state?.cowboyJourney, split);
      if (next === "presentation") setHasVideo(true);
      if (next === "testimonials") setHasTestimonials(true);
      setScreen(next);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [split]);

  useEffect(() => {
    if (split) onStepChange?.(JOURNEY_SCREEN_STEPS[screen]);
  }, [screen, split, onStepChange]);

  useEffect(() => {
    const title = rootRef.current?.querySelector<HTMLElement>(`[data-journey-screen="${screen}"] [data-journey-title]`);
    if (!title) return;
    window.scrollTo({ top: 0, behavior: "instant" });
    title.focus({ preventScroll: true });
    trackJourneyView(screen);
    const reportElement = screen === "result" ? rootRef.current?.querySelector<HTMLElement>("[data-journey-report]") : null;
    if (!reportElement || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.25) continue;
        if (entry.target === reportElement) trackResultView(variant);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.25 });
    observer.observe(reportElement);
    return () => observer.disconnect();
  }, [screen, variant]);

  const forward = () => {
    const destination = nextJourneyScreen(screen, split);
    trackJourneyAction(screen === "result" ? "result_continue" : screen === "testimonials" ? "testimonials_continue" : "presentation_continue", screen);
    if (destination === "presentation") setHasVideo(true);
    if (destination === "testimonials") setHasTestimonials(true);
    if (destination === "offer") trackViewKits(variant);
    window.history.pushState({ ...window.history.state, cowboyJourney: destination }, "", window.location.href);
    setScreen(destination);
  };

  const back = () => {
    trackJourneyAction("back", screen);
    window.history.back();
  };

  if (!report) return <div className={styles.restart} role="status">Esta sessão foi reiniciada. <a href={`/quiz/${variant}/quiz/`}>Responda novamente para ver seu resumo.</a></div>;
  const phases = split ? [PHASES[0], PHASES[1], { id: "testimonials", label: "Depoimentos" }, PHASES[2]] : PHASES;

  return (
    <div ref={rootRef} className={`${styles.journey}${split ? ` ${styles.splitJourney}` : ""} ${screen === "presentation" ? styles.dark : ""}`} data-journey>
      <header className={styles.header}>
        {screen === "result" ? <span className={styles.completed}>Questionário concluído</span> : <button type="button" onClick={back} data-journey-back className={styles.back}>Voltar</button>}
        <Logo />
      </header>
      <ol className={`${styles.phases}${split ? ` ${styles.splitPhases}` : ""}`} aria-label="Fases da sua jornada">
        {phases.map(phase => <li key={phase.id} aria-current={phase.id === screen ? "step" : undefined}>{phase.label}</li>)}
      </ol>

      {screen === "result" && <section className={styles.result} data-journey-screen="result">
        {split && answers ? <QuizIntensityResult answers={answers} /> : <>
        {!split && <div className={styles.completeProgress} data-quiz-progress><span>Etapa 18 de 18</span><div role="progressbar" aria-label="Progresso do questionário" aria-valuemin={0} aria-valuemax={18} aria-valuenow={18} aria-valuetext="Etapa 18 de 18"><span /></div></div>}
        <h1 id="journey-title" tabIndex={-1} data-journey-title>Seu resultado está pronto.</h1>
        <div className={styles.report} data-journey-report>
          <p>Impacto na sua confiança:</p>
          <strong data-journey-impact>{report.label}</strong>
          <p>{confidence?.support}</p>
        </div>
        <p className={styles.note}>Este resumo reflete suas respostas e não é um diagnóstico médico.</p>
        <button type="button" className={styles.primary} data-journey-next="result" onClick={forward}>Assistir à apresentação</button>
        <p className={styles.nextNote}>Na próxima tela, conheça a proposta da COWBOY antes de decidir.</p>
        </>}
      </section>}

      {hasVideo && <section className={styles.presentation} data-journey-screen="presentation" hidden={screen !== "presentation"}>
        <h1 id={screen === "presentation" ? "journey-title" : undefined} tabIndex={-1} data-journey-title>{split ? "Apresentação do COWBOY" : "Conheça a proposta. Decida no seu tempo."}</h1>
        {!split && <><p>Você contou como isso afeta sua confiança. Agora, assista à apresentação do COWBOY e conheça a oferta.</p>
        <button type="button" className={styles.primary} data-journey-next="presentation" onClick={forward}>Ver kits e valores</button></>}
        <div className={styles.video}><QuizVsl variant={variant} active={screen === "presentation"} presentation nextDestination={split ? "testimonials" : "offer"} compact={split} onContinueReady={split ? releasePresentation : undefined} onPlaybackFallback={split ? () => { releasePresentation(); forward(); } : undefined} /></div>
      </section>}

      {hasTestimonials && <section className={styles.offer} data-journey-screen="testimonials" hidden={screen !== "testimonials"}>
        <QuizSocialProof active={screen === "testimonials"} standalone />
      </section>}
      {screen === "offer" && <QuizJourneyOffer impactLabel={report.label} selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} variant={variant} />}
      {split && screen !== "offer" && <QuizJourneyDock>
        {screen === "presentation" && <p className={styles.dockHint} aria-live="polite">{presentationReady ? "Próximo: depoimentos de clientes" : "Ao final do vídeo, siga para os depoimentos de clientes."}</p>}
        {(screen !== "presentation" || presentationReady) && <button type="button" className={styles.primary} data-journey-next={screen} onClick={forward}>{screen === "result" ? "Assistir à apresentação" : "Escolher meu kit"}</button>}
      </QuizJourneyDock>}
    </div>
  );
}
