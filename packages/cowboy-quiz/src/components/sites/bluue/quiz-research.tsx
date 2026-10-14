"use client";

/* eslint-disable @next/next/no-img-element -- The static export serves documented reference packaging unchanged. */

import { Logo } from "@/components/sites/bluue/Logo";
import { trackContentLink } from "@/lib/quiz-tracking";
import styles from "@/components/sites/bluue/quiz-research.module.css";

interface QuizResearchIntroProps {
  onNext: () => void;
  floatingContinue?: boolean;
}

interface QuizResearchArticleProps extends QuizResearchIntroProps {
  onBack: () => void;
}

const RESEARCH_URL = "https://www.nature.com/articles/s41467-025-66723-7";
const MEDICINE_ALERT_URL = "https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2025/anvisa-emite-alerta-sobre-uso-indiscriminado-de-medicamentos-para-disfuncao-eretil/";
const MEDICINE_LEAFLET_URL = "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=bcd8f8ab-81a2-4891-83db-24a0b0e25895";

export function QuizResearchIntro({ onNext, floatingContinue = false }: QuizResearchIntroProps) {
  return (
    <section className={`${styles.screen}${floatingContinue ? ` ${styles.withFloatingContinue}` : ""}`} data-quiz-introduction data-quiz-medicine aria-labelledby="quiz-introduction-title">
      <div className={styles.introHeader}><Logo className="cb-logo-lg" /></div>
      <div className={styles.medicine}>
        <p className={styles.medicineDisclosure}>Conteúdo publicitário <span aria-hidden="true">•</span> Informação de saúde</p>
        <h2 id="quiz-introduction-title" className={styles.medicineTitle}>Tadala não é brincadeira.</h2>
        <p className={styles.medicineLead}>Usar sem orientação pode trazer riscos graves.</p>
        <figure className={styles.medicineProducts}>
          <div className={styles.medicineImages}>
            <img src="/sites/cowboy/tadalafila-ems-reference.webp" alt="Embalagem de tadalafila genérica" width={600} height={600} loading="eager" />
            <img src="/sites/cowboy/cialis-reference.webp" alt="Embalagem de Cialis" width={600} height={600} loading="eager" />
          </div>
          <figcaption>Cialis contém tadalafila. Embalagens exibidas apenas para identificação, sem indicação de dose.</figcaption>
        </figure>
        <section className={styles.medicineNews} aria-label="Alerta publicado pela Anvisa">
          <p className={styles.medicineKicker}>NOTÍCIA PUBLICADA</p>
          <p className={styles.medicineMetadata}>Anvisa <span aria-hidden="true">•</span> <time dateTime="2025-09-05">05/09/2025</time></p>
          <blockquote>Anvisa emite alerta sobre uso indiscriminado de medicamentos para disfunção erétil</blockquote>
          <p>O alerta aborda o uso recreativo e fora das indicações médicas, com possibilidade de efeitos graves.</p>
          <a
            className={`${styles.medicineSource} quiz-research-source`}
            data-medicine-alert
            data-medicine-source="alert"
            href={MEDICINE_ALERT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackContentLink("medicine_alert", "quiz")}
          >Ler o alerta da Anvisa (abre em nova guia)</a>
        </section>
        <div className={styles.medicineRisks}>
          <div>
            <h3>Mistura perigosa</h3>
            <p>Tadalafila é contraindicada com nitratos: a combinação pode causar queda importante da pressão.</p>
          </div>
          <div>
            <h3>Efeitos adversos existem</h3>
            <p>Dor de cabeça, indigestão e dores nas costas estão entre os efeitos comuns descritos na bula.</p>
          </div>
        </div>
        <a
          className={`${styles.medicineSource} quiz-research-source`}
          data-medicine-leaflet
          data-medicine-source="leaflet"
          href={MEDICINE_LEAFLET_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackContentLink("medicine_leaflet", "quiz")}
        >Consultar a bula do Cialis (em inglês; abre em nova guia)</a>
        <p className={styles.medicineNote}>Esses medicamentos podem tratar a disfunção erétil quando indicados. Não suspenda nem troque seu tratamento por conta própria.</p>
      </div>
      {floatingContinue ? <div className={styles.continueDock}><button type="button" data-floating-continue className={`cb-btn ${styles.continueButton}`} onClick={onNext}>CONTINUAR</button></div> : <button type="button" className={`cb-btn ${styles.continueButton}`} onClick={onNext}>CONTINUAR</button>}
    </section>
  );
}

/** The editorial screen has no timer: reading ends only through an explicit action. */
export function QuizResearchArticle({ onNext, onBack }: QuizResearchArticleProps) {
  return (
    <section className={styles.screen} data-quiz-research>
      <div className={styles.header}>
        <button type="button" className={styles.backButton} onClick={onBack}><span aria-hidden="true">←</span> Voltar</button>
        <Logo className="text-[15px]" />
      </div>
      <article className={styles.article} aria-labelledby="quiz-research-title">
        <p className={styles.disclosure}>Conteúdo publicitário <span aria-hidden="true">•</span> Divulgação científica</p>
        <div className={styles.metadata}>
          <span>Nature Communications</span>
          <time dateTime="2025-11-24">24/11/2025</time>
        </div>
        <h2 id="quiz-research-title" className={styles.headline}>Estudo com mais de 1 milhão de participantes revela novas pistas sobre as falhas de ereção.</h2>
        <p className={styles.summary}>A pesquisa reuniu dados de <strong>1.038.509 participantes</strong> e identificou associações genéticas ligadas à disfunção erétil. Os achados ampliam a investigação sobre seus fatores biológicos.</p>
        <p className={styles.limit}>Pesquisa genética: não testou suplementos nem comprovou tratamento, cura ou duração da relação.</p>
        <a
          className={`${styles.source} quiz-research-source`}
          data-research-source
          href={RESEARCH_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackContentLink("research_paper", "quiz")}
        >Ler o estudo na Nature Communications <span className={styles.newTab}>(abre em nova guia)</span></a>
      </article>
      <button type="button" className={`cb-btn ${styles.continueButton}`} onClick={onNext}>CONTINUAR</button>
    </section>
  );
}
