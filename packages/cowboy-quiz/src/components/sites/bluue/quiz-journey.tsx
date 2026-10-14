"use client";

import { useEffect, useRef, useState } from "react";
import { confidenceReport } from "@/components/sites/bluue/confidence-impact";
import { Logo } from "@/components/sites/bluue/Logo";
import { QuizVsl } from "@/components/sites/bluue/quiz-vsl";
import { QuizJourneyOffer } from "@/components/sites/bluue/quiz-journey-offer";
import { RECOMMENDED_KIT, type KitQuantity } from "@/components/sites/bluue/data";
import { trackJourneyAction, trackJourneyView, trackResultView, trackViewKits, type JourneyScreen } from "@/lib/quiz-tracking";
import styles from "@/components/sites/bluue/quiz-journey.module.css";

interface QuizJourneyProps { impact: string | undefined }
const PHASES = [
  { id: "result", label: "Resultado" },
  { id: "presentation", label: "Apresentação" },
  { id: "offer", label: "Oferta" },
] as const;

function historyScreen(value: unknown): JourneyScreen {
  return value === "presentation" || value === "offer" ? value : "result";
}

export function QuizJourney({ impact }: QuizJourneyProps) {
  const report = confidenceReport(impact);
  const [screen, setScreen] = useState<JourneyScreen>("result");
  const [hasVideo, setHasVideo] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<KitQuantity>(RECOMMENDED_KIT);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only fixed navigation identifiers enter history; personal state stays in Quiz.
    window.history.replaceState({ ...window.history.state, cowboyJourney: "result" }, "", window.location.href);
    const onPop = (event: PopStateEvent) => {
      const next = historyScreen(event.state?.cowboyJourney);
      if (next === "presentation") setHasVideo(true);
      setScreen(next);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

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
        if (entry.target === reportElement) trackResultView("v4-jornada");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.25 });
    observer.observe(reportElement);
    return () => observer.disconnect();
  }, [screen]);

  const forward = () => {
    const destination = screen === "result" ? "presentation" : "offer";
    trackJourneyAction(screen === "result" ? "result_continue" : "presentation_continue", screen);
    if (destination === "presentation") setHasVideo(true);
    else trackViewKits("v4-jornada");
    window.history.pushState({ ...window.history.state, cowboyJourney: destination }, "", window.location.href);
    setScreen(destination);
  };

  const back = () => {
    trackJourneyAction("back", screen);
    window.history.back();
  };

  if (!report) return <div className={styles.restart} role="status">Esta sessão foi reiniciada. <a href="/quiz/v4-jornada/quiz/">Responda novamente para ver seu resumo.</a></div>;

  return (
    <div ref={rootRef} className={`${styles.journey} ${screen === "presentation" ? styles.dark : ""}`} data-journey>
      <header className={styles.header}>
        {screen === "result" ? <span className={styles.completed}>Questionário concluído</span> : <button type="button" onClick={back} data-journey-back className={styles.back}>Voltar</button>}
        <Logo />
      </header>
      <ol className={styles.phases} aria-label="Fases da sua jornada">
        {PHASES.map(phase => <li key={phase.id} aria-current={phase.id === screen ? "step" : undefined}>{phase.label}</li>)}
      </ol>

      {screen === "result" && <section className={styles.result} data-journey-screen="result">
        <div className={styles.completeProgress} data-quiz-progress><span>Etapa 18 de 18</span><div role="progressbar" aria-label="Progresso do questionário" aria-valuemin={0} aria-valuemax={18} aria-valuenow={18} aria-valuetext="Etapa 18 de 18"><span /></div></div>
        <h1 id="journey-title" tabIndex={-1} data-journey-title>Seu resultado está pronto.</h1>
        <div className={styles.report} data-journey-report>
          <p>Impacto na sua confiança:</p>
          <strong data-journey-impact>{report.label}</strong>
          <p>{report.support}</p>
        </div>
        <p className={styles.note}>Este resumo reflete suas respostas e não é um diagnóstico médico.</p>
        <button type="button" className={styles.primary} data-journey-next="result" onClick={forward}>Assistir à apresentação</button>
        <p className={styles.nextNote}>Na próxima tela, conheça a proposta da COWBOY antes de decidir.</p>
      </section>}

      {hasVideo && <section className={styles.presentation} data-journey-screen="presentation" hidden={screen !== "presentation"}>
        <h1 id={screen === "presentation" ? "journey-title" : undefined} tabIndex={-1} data-journey-title>Conheça a proposta. Decida no seu tempo.</h1>
        <p>Você contou como isso afeta sua confiança. Agora, assista à apresentação do COWBOY e conheça a oferta.</p>
        <button type="button" className={styles.primary} data-journey-next="presentation" onClick={forward}>Ver kits e valores</button>
        <div className={styles.video}><QuizVsl variant="v4-jornada" active={screen === "presentation"} presentation /></div>
      </section>}

      {screen === "offer" && <QuizJourneyOffer impactLabel={report.label} selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} />}
    </div>
  );
}
