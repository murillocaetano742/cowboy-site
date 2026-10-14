"use client";

/* eslint-disable @next/next/no-img-element -- Reuse the published customer media without conversion. */

import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { videos, clients, RATING, REVIEWS, CUSTOMERS } from "@/components/sites/bluue/quiz-offer-data";
import { trackTestimonialsView } from "@/lib/quiz-tracking";
import styles from "@/components/sites/bluue/quiz-journey.module.css";
import commerce from "@/components/sites/bluue/quiz-commerce.module.css";

interface QuizSocialProofProps {
  active?: boolean;
  standalone?: boolean;
  showRating?: boolean;
}
const ASSETS = "/sites/cowboy/";

export function QuizSocialProof({ active = true, standalone = false, showRating = false }: QuizSocialProofProps) {
  const rootRef = useRef<HTMLElement>(null);
  const exposureRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    const pause = () => root?.querySelectorAll("video").forEach(video => video.pause());
    if (!active) pause();
    return pause;
  }, [active]);
  useEffect(() => {
    const exposure = exposureRef.current;
    if (!standalone || !active || !exposure || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.25)) {
        trackTestimonialsView();
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    observer.observe(exposure);
    return () => observer.disconnect();
  }, [active, standalone]);
  const Title = standalone ? "h1" : "h2";
  return (
    <section ref={rootRef} className={styles.proof} data-quiz-social-proof aria-labelledby={standalone ? "journey-testimonials-title" : "journey-proof"}>
      {showRating ? <header className={commerce.proofHeader}>
        <div data-proof-rating>
          <div className={commerce.rating} aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <Star key={index} />)}</div>
          <p className={commerce.ratingText}>{RATING} de {REVIEWS} AVALIAÇÕES.</p>
        </div>
        <Title id={standalone ? "journey-testimonials-title" : "journey-proof"} tabIndex={standalone ? -1 : undefined} data-journey-title={standalone || undefined} className={commerce.proofTitle}><span>{CUSTOMERS.toUpperCase()}</span> JÁ ESCOLHERAM O COWBOY</Title>
        <p className={commerce.proofIntro}>Dois gravaram o próprio vídeo. Outros mandaram a foto com o frasco na mão.</p>
      </header> : <>
        <Title id={standalone ? "journey-testimonials-title" : "journey-proof"} tabIndex={standalone ? -1 : undefined} data-journey-title={standalone || undefined} className={standalone ? styles.proofHeading : undefined}>Quem já incluiu o COWBOY na rotina</Title>
        <p>Relatos e imagens dos clientes. Experiências individuais não garantem o mesmo resultado para outras pessoas.</p>
      </>}
      <div ref={exposureRef} className={styles.testimonials} data-testimonials-exposure={standalone || undefined}>{videos.map((video, index) => <figure key={video.file}>
        <video controls playsInline preload="none" poster={`${ASSETS}videos/${video.file}.jpg`} aria-label={`Vídeo de depoimento de cliente ${index + 1}`}>
          <source src={`${ASSETS}videos/${video.file}.mp4`} type="video/mp4" />
          <track kind="subtitles" srcLang="pt-BR" label="Português" src={`${ASSETS}videos/${video.file}.vtt`} />
        </video>
        <figcaption><blockquote>“{video.quote}”</blockquote><cite>{video.cite}</cite></figcaption>
      </figure>)}</div>
      <div className={styles.photos}>{clients.map(client => <figure key={client.image}>
        <img src={`${ASSETS}${client.image}`} alt={client.alt} loading="lazy" width={300} height={300} />
        <figcaption>Cliente {client.name}</figcaption>
      </figure>)}</div>
      {showRating && <p className={commerce.proofNotice}>Experiências individuais não garantem o mesmo resultado para outras pessoas.</p>}
    </section>
  );
}
