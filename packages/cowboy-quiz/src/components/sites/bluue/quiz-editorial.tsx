"use client";

/* eslint-disable @next/next/no-img-element -- Serve the local campaign image directly in the static export. */

import { useEffect, useRef, useSyncExternalStore, type MouseEvent } from "react";
import { readAttribution } from "@/components/sites/bluue/checkout";
import { trackContentLink, trackCoverCta, trackCoverSection } from "@/lib/quiz-tracking";
import styles from "@/components/sites/bluue/quiz-editorial.module.css";

const COVER_SECTIONS = ["intro", "how_it_works", "footer"] as const;
type CtaLocation = "hero" | "footer";

function quizHref(path: string) {
  const search = new URLSearchParams(readAttribution()).toString();
  return path + (search ? `?${search}` : "");
}

// Attribution is fixed for this document; hydrate native links from browser storage.
const subscribeAttribution = () => () => {};
interface QuizEditorialProps { variant?: "v3-editorial" | "v4-jornada" }
export function QuizEditorial({ variant = "v3-editorial" }: QuizEditorialProps) {
  const path = `/quiz/${variant}/quiz/`;
  const rootRef = useRef<HTMLElement>(null);
  const navigating = useRef(false);
  const href = useSyncExternalStore(subscribeAttribution, () => quizHref(path), () => path);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.25) continue;
        const section = COVER_SECTIONS.find(value => value === (entry.target as HTMLElement).dataset.editorialSection);
        if (section) trackCoverSection(section);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.25 });
    for (const element of root.querySelectorAll("[data-editorial-section]")) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const startQuiz = (event: MouseEvent<HTMLAnchorElement>, location: CtaLocation) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      trackCoverCta(location);
      return;
    }
    event.preventDefault();
    if (navigating.current) return;
    navigating.current = true;
    const destination = quizHref(path);
    trackCoverCta(location, () => window.location.assign(destination));
  };

  return (
    <main ref={rootRef} className={styles.page} data-quiz-editorial>
      <div className={styles.disclosure}>Conteúdo publicitário da COWBOY Energia</div>
      <div className={styles.paper}>
        <header className={styles.masthead}>
          <p className={styles.edition}>Vida íntima masculina</p>
          <p className={styles.brand}>COWBOY <span>em pauta</span></p>
          <p className={styles.topics}>Uma conversa sem rodeios.</p>
        </header>

        <article className={styles.lead} data-editorial-section="intro">
          <div className={styles.leadCopy}>
            <h1 className={styles.headline}>Chega de broxar e de gozar rápido no momento em que sua mulher mais te quer firme.</h1>
            <p className={styles.deck}>Responda 14 perguntas e desbloqueie seu resultado na hora: um resumo baseado nas suas respostas e acesso à apresentação da COWBOY.</p>
            <a href={href} onClick={event => startQuiz(event, "hero")} className={styles.cta} data-editorial-cta="hero">Quero desbloquear meu resultado</a>
            <p className={styles.quizDetails}>Quiz gratuito. Sem cadastro. Resultado ao concluir.</p>
            <p className={styles.privacyNote}>Suas respostas ficam apenas nesta aba e não são enviadas aos serviços de rastreamento.</p>
          </div>
          <figure className={styles.figure}>
            <img src="/sites/cowboy/capa-black-v3.webp" alt="Homem com expressão tensa sentado na beira da cama, com a parceira de costas ao fundo em um quarto escuro" width={1448} height={1086} fetchPriority="high" loading="eager" className={styles.photo} />
            <figcaption>Quando a preocupação ocupa o lugar da confiança. Imagem ilustrativa.</figcaption>
          </figure>
        </article>

        <section className={styles.explainer} aria-labelledby="editorial-how-title" data-editorial-section="how_it_works">
          <div className={styles.explainerIntro}>
            <h2 id="editorial-how-title">14 respostas. Um próximo passo.</h2>
            <p>Conte o que você está vivendo e veja seu resumo ao concluir. Depois, assista à apresentação da COWBOY e compare os kits antes de decidir.</p>
          </div>
          <ol className={styles.steps}>
            <li><span aria-hidden="true">1</span><div><h3>Vá direto ao ponto</h3><p>O que mudou, há quanto tempo e o que você quer melhorar. Suas respostas ficam nesta aba.</p></div></li>
            <li><span aria-hidden="true">2</span><div><h3>Desbloqueie seu resultado</h3><p>Veja um resumo baseado no que você respondeu e conheça a proposta da COWBOY.</p></div></li>
            <li><span aria-hidden="true">3</span><div><h3>Decida o próximo passo</h3><p>Assista ao vídeo, veja os preços e compare os kits antes de escolher.</p></div></li>
          </ol>
        </section>

        <footer className={styles.footer} data-editorial-section="footer">
          <div className={styles.lastCall}>
            <p>Seu resultado começa com a primeira resposta.</p>
            <a href={href} onClick={event => startQuiz(event, "footer")} className={styles.cta} data-editorial-cta="footer">Quero desbloquear meu resultado</a>
          </div>
          <p className={styles.notice}>Conteúdo publicitário da COWBOY Energia. Este questionário apresenta uma oferta comercial e não substitui uma avaliação de saúde. COWBOY é um suplemento alimentar, não um medicamento.</p>
          <div className={styles.legal}>
            <span>COWBOY Energia</span>
            <a href="/privacidade" target="_blank" rel="noopener noreferrer" onClick={() => trackContentLink("privacy", "cover")}>Privacidade</a>
            <a href="/termos" target="_blank" rel="noopener noreferrer" onClick={() => trackContentLink("terms", "cover")}>Termos</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
