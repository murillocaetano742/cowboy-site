"use client";

/* eslint-disable @next/next/no-img-element -- Reuses the four published product gallery assets. */

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, CircleCheck, Lock, ShieldCheck, Truck } from "lucide-react";
import styles from "@/components/sites/bluue/quiz-commerce.module.css";

const SLIDES = [
  { image: "kit-2.webp", alt: "Dois frascos COWBOY Energia", caption: "COWBOY Energia · suplemento em gotas", position: "50% 50%" },
  { image: "caixa-discreta.webp", alt: "Caixa fechada para o envio do produto", caption: "Chega em caixa fechada, sem o nome do produto", position: "50% 50%" },
  { image: "casal-cumplicidade.webp", alt: "Casal sorrindo de mãos dadas", caption: "Garantia comercial de 30 dias. Consulte as condições.", position: "50% 20%" },
  { image: "kit-3.webp", alt: "Três frascos COWBOY Energia", caption: "3 frascos: R$ 66,63 cada, frete grátis", position: "50% 50%" },
] as const;
const REASSURANCES = [
  { icon: ShieldCheck, label: "Checkout Seguro" },
  { icon: CircleCheck, label: "Teste de 30 Dias" },
  { icon: Lock, label: "Envio Discreto" },
  { icon: Truck, label: "Frete Grátis 2+ Frascos" },
] as const;

export function QuizProductGallery() {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const show = (next: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const target = (next + SLIDES.length) % SLIDES.length;
    viewport.scrollTo({ left: viewport.clientWidth * target, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => viewport.scrollTo({ left: viewport.clientWidth * indexRef.current, behavior: "instant" }));
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);
  return (
    <div className={styles.galleryBlock}>
      <section className={styles.gallery} data-offer-carousel aria-label="Imagens do COWBOY Energia" aria-roledescription="carrossel">
        <div ref={viewportRef} className={styles.galleryViewport} tabIndex={0} aria-label="Imagens do produto. Use as setas para navegar." onKeyDown={event => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          show(index + (event.key === "ArrowLeft" ? -1 : 1));
        }} onScroll={event => {
          const viewport = event.currentTarget;
          const next = Math.min(SLIDES.length - 1, Math.max(0, Math.round(viewport.scrollLeft / viewport.clientWidth)));
          if (next !== indexRef.current) { indexRef.current = next; setIndex(next); }
        }}>
          {SLIDES.map((slide, slideIndex) => <figure key={slide.image} className={styles.slide} aria-hidden={slideIndex !== index} data-carousel-slide>
            <img src={`/sites/cowboy/${slide.image}`} alt={slide.alt} width={600} height={450} loading="lazy" style={{ objectPosition: slide.position }} />
            <figcaption>{slide.caption}</figcaption>
          </figure>)}
        </div>
        <div className={styles.galleryControls}>
          <button type="button" aria-label="Imagem anterior" onClick={() => show(index - 1)}><ChevronLeft aria-hidden="true" /></button>
          <div className={styles.galleryDots}>{SLIDES.map((slide, slideIndex) => <button type="button" key={slide.image} aria-label={`Exibir imagem ${slideIndex + 1}`} aria-pressed={slideIndex === index} onClick={() => show(slideIndex)}><span /></button>)}</div>
          <button type="button" aria-label="Próxima imagem" onClick={() => show(index + 1)}><ChevronRight aria-hidden="true" /></button>
        </div>
        <span className={styles.screenReader} aria-live="polite" aria-atomic="true">Imagem {index + 1} de {SLIDES.length}</span>
      </section>
      <div className={styles.reassurances} data-offer-reassurances>{REASSURANCES.map(({ icon: Icon, label }) => <div key={label}><Icon aria-hidden="true" /><span>{label}</span></div>)}</div>
    </div>
  );
}
