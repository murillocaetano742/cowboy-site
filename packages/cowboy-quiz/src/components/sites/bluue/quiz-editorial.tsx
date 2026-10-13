"use client";

/* eslint-disable @next/next/no-img-element -- Reuse the existing local campaign image in the static export. */

import { useEffect, useRef, useSyncExternalStore, type MouseEvent } from "react";
import { readAttribution } from "@/components/sites/bluue/checkout";
import { trackContentLink, trackCoverCta, trackCoverSection } from "@/lib/quiz-tracking";
import styles from "@/components/sites/bluue/quiz-editorial.module.css";

const QUIZ_PATH = "/quiz/v3-editorial/quiz/";
const COVER_SECTIONS = ["intro", "how_it_works", "footer"] as const;
type CtaLocation = "hero" | "footer";

function quizHref() {
  const search = new URLSearchParams(readAttribution()).toString();
  return QUIZ_PATH + (search ? `?${search}` : "");
}

// Attribution is fixed for this document; hydrate native links from browser storage.
const subscribeAttribution = () => () => {};
const serverQuizHref = () => QUIZ_PATH;

export function QuizEditorial() {
  const rootRef = useRef<HTMLElement>(null);
  const navigating = useRef(false);
  const href = useSyncExternalStore(subscribeAttribution, quizHref, serverQuizHref);

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
    const destination = quizHref();
    trackCoverCta(location, () => window.location.assign(destination));
  };

  return (
    <main ref={rootRef} className={styles.page} data-quiz-editorial>
      <div className={styles.disclosure}>Conteúdo publicitário da COWBOY Energia</div>
      <div className={styles.paper}>
        <header className={styles.masthead}>
          <p className={styles.edition}>Especial sobre vida íntima</p>
          <p className={styles.brand}>COWBOY <span>em pauta</span></p>
          <p className={styles.topics}>Confiança · Relacionamentos · Bem-estar</p>
        </header>

        <article className={styles.lead} data-editorial-section="intro">
          <div className={styles.leadCopy}>
            <h1 className={styles.headline}>Quando a confiança muda, o silêncio não precisa continuar.</h1>
            <p className={styles.deck}>Percebeu mudanças na sua vida íntima? Comece por organizar suas dúvidas em um quiz. No final, conheça a proposta da COWBOY e os kits disponíveis.</p>
            <a href={href} onClick={event => startQuiz(event, "hero")} className={styles.cta} data-editorial-cta="hero">Começar meu quiz</a>
            <p className={styles.quizDetails}>14 perguntas. Sem cadastro. No seu ritmo.</p>
            <p className={styles.privacyNote}>Suas respostas ficam apenas nesta aba e não são enviadas aos serviços de rastreamento.</p>
          </div>
          <figure className={styles.figure}>
            <img src="/sites/cowboy/casal-cumplicidade.webp" alt="Casal sentado no sofá, de mãos dadas, olhando um para o outro" width={1024} height={1536} fetchPriority="high" loading="eager" className={styles.photo} />
            <figcaption>Confiança também merece espaço na conversa. Imagem ilustrativa.</figcaption>
          </figure>
        </article>

        <section className={styles.explainer} aria-labelledby="editorial-how-title" data-editorial-section="how_it_works">
          <div className={styles.explainerIntro}>
            <h2 id="editorial-how-title">Um primeiro passo, feito por você.</h2>
            <p>Sem preencher nome, e-mail ou telefone para responder. Você acompanha o progresso e pode voltar às perguntas.</p>
          </div>
          <ol className={styles.steps}>
            <li><span aria-hidden="true">1</span><div><h3>Conte o que percebe</h3><p>Responda sobre sua rotina, suas dúvidas e o que gostaria de melhorar.</p></div></li>
            <li><span aria-hidden="true">2</span><div><h3>Veja o seu resumo</h3><p>Reveja os pontos informados antes de conhecer a proposta do produto.</p></div></li>
            <li><span aria-hidden="true">3</span><div><h3>Conheça e escolha</h3><p>Assista à apresentação, confira valores e compare os kits. A decisão é sua.</p></div></li>
          </ol>
        </section>

        <footer className={styles.footer} data-editorial-section="footer">
          <div className={styles.lastCall}>
            <p>Comece pela primeira pergunta.</p>
            <a href={href} onClick={event => startQuiz(event, "footer")} className={styles.cta} data-editorial-cta="footer">Começar meu quiz</a>
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
