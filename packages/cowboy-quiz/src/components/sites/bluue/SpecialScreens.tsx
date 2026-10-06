"use client";

/* eslint-disable @next/next/no-img-element -- Local original images preserve the source quiz sizing. */

import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import "./special.css";

type NextProps = { onNext: () => void };
type BackProps = NextProps & { onBack: () => void };

const ASSETS = "/sites/cowboy/";
const PRIVACY_URL = "https://cowboyenergiamasculina.com.br/privacidade";
// Customer confidence figure declared by the owner (05/10/2026), same slot as the reference quiz.
const CONFIDENT_PERCENT = 92;

function useDelayedNext(onNext: () => void, delay: number) {
  const callback = useRef(onNext);
  useEffect(() => {
    callback.current = onNext;
  }, [onNext]);
  useEffect(() => {
    const timer = window.setTimeout(() => callback.current(), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);
}

function easeOut(progress: number) {
  let low = 0;
  let high = 1;
  let time = progress;
  for (let i = 0; i < 14; i++) {
    time = (low + high) / 2;
    const x = 3 * (1 - time) * time * time * 0.58 + time * time * time;
    if (x < progress) low = time;
    else high = time;
  }
  return 3 * (1 - time) * time * time + time * time * time;
}

// Customer photos with the bottle in hand, as published on the sales page.
const CLIENT_PHOTOS = [
  { image: "cliente-04.webp", name: "Marcos", alt: "Casal sorrindo em uma mesa ao ar livre à noite, cada um segurando um frasco COWBOY Energia" },
  { image: "cliente-05.webp", name: "Fernando", alt: "Homem de camisa clara sorrindo em uma praça à noite, segurando um frasco COWBOY Energia" },
  { image: "cliente-06.webp", name: "Ricardo", alt: "Casal sorrindo dentro de um avião, a mulher segurando um frasco COWBOY Energia" },
  { image: "cliente-02.webp", name: "Paulo", alt: "Homem de óculos deitado na cama, segurando um frasco COWBOY Energia" },
  { image: "cliente-01.webp", name: "André", alt: "Homem de boné e óculos escuros no sofá, segurando um frasco COWBOY Energia" },
  { image: "cliente-03.webp", name: "Sérgio", alt: "Homem de gorro no sofá, segurando um frasco COWBOY Energia" },
];

export function Explanation({ onNext }: NextProps) {
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    let frame = 0;
    const started = performance.now();
    const animate = (time: number) => {
      const progress = Math.min((time - started) / 2500, 1);
      setPercent(CONFIDENT_PERCENT * easeOut(progress));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);
  const circumference = 2 * Math.PI * 67;

  return (
    <div className="relative flex flex-col items-center min-h-[100dvh] max-w-lg mx-auto bg-background">
      <div className="pt-8 pb-6">
        <Logo className="cb-logo-lg flex-shrink-0" />
      </div>
      <div className="relative flex items-center justify-center mb-6 flex-shrink-0">
        <svg width={140} height={140} className="-rotate-90" aria-hidden="true">
          <circle
            cx={70}
            cy={70}
            r={67}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={6}
          />
          <circle
            cx={70}
            cy={70}
            r={67}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - percent / 100)}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-extrabold text-foreground">
            <span>{Math.round(percent)}</span>
            <span className="text-2xl align-top ml-0.5">%</span>
          </span>
        </div>
      </div>
      <p className="text-left text-2xl font-bold text-muted-foreground leading-tight px-8 mb-5">
        dos clientes{" "}
        <span className="font-extrabold text-foreground">COWBOY</span> dizem se
        sentir mais confiantes na hora H.
      </p>
      <div className="cb-client-grid w-full px-5">
        {CLIENT_PHOTOS.map((client) => (
          <figure key={client.image}>
            <img src={`${ASSETS}${client.image}`} alt={client.alt} loading="eager" />
            <figcaption>Cliente {client.name}</figcaption>
          </figure>
        ))}
      </div>
      <div className="cb-fade-bottom sticky bottom-0 w-full px-5 pb-5 pt-3 mt-auto">
        <button
          type="button"
          onClick={onNext}
          className="cb-btn w-full py-4 rounded-xl font-bold text-base"
        >
          CONTINUAR
        </button>
      </div>
    </div>
  );
}

export function Testimonials({ onNext, onBack }: BackProps) {
  useDelayedNext(onNext, 6000);
  return (
    <div className="flex flex-col h-[100dvh] max-w-lg mx-auto bg-background">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          type="button"
          onClick={onBack}
          className="cb-icon-btn p-1.5 rounded-full transition-colors"
          aria-label="Voltar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M5 12h14" />
          </svg>
        </button>
        <Logo className="text-[15px]" />
        <div className="w-8" />
      </div>
      <div className="relative">
        <div className="w-full px-4 pt-3">
          <div
            className="w-full h-1.5 bg-muted/60 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={40}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso do questionário"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
              style={{ width: "40%" }}
            />
          </div>
        </div>
        <div className="absolute inset-0 px-4 pt-3 pointer-events-none">
          <div className="w-full h-1.5 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-white/30 rounded-full bluue-shimmer" />
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground animate-pulse px-4 pt-2">
        Montando o seu perfil...
      </p>
      <div className="flex-1 flex flex-col px-5 pt-8 overflow-y-auto">
        <div className="flex flex-col items-start gap-1 mb-8">
          {["SEM RECEITA", "DISCRETO", "30 DIAS DE TESTE"].map((text) => (
            <span key={text} className="cb-big-word bluue-slide-up">
              {text}
            </span>
          ))}
        </div>
        <img
          src={`${ASSETS}sem-receita.webp`}
          alt="Caixa parda sem identificação aberta, com o frasco COWBOY Energia dentro"
          className="cb-promise-img w-full rounded-2xl"
          loading="eager"
        />
      </div>
      <div className="cb-fade-bottom sticky bottom-0 w-full px-5 pb-5 pt-3">
        <button
          type="button"
          onClick={onNext}
          className="cb-btn w-full py-4 rounded-xl font-bold text-base"
        >
          CONTINUAR
        </button>
      </div>
    </div>
  );
}

const ANALYSIS_ITEMS = [
  { icon: "✓", label: "Seu histórico" },
  { icon: "🕒", label: "Frequência do problema" },
  { icon: "⚠️", label: "Fatores que pesam" },
  { icon: "🔥", label: "Gravidade do seu caso" },
];

export function Analyzing({ onNext }: NextProps) {
  const [percent, setPercent] = useState(0);
  useDelayedNext(onNext, 6400);
  useEffect(() => {
    const started = Date.now();
    const timer = window.setInterval(() => {
      const progress = Math.min((Date.now() - started) / 60, 100);
      setPercent(progress);
      if (progress >= 100) window.clearInterval(timer);
    }, 30);
    return () => window.clearInterval(timer);
  }, []);
  const circumference = 2 * Math.PI * 70;
  const activeItem = Math.min(
    Math.floor((percent / 100) * ANALYSIS_ITEMS.length),
    ANALYSIS_ITEMS.length - 1,
  );
  return (
    <div
      className="relative flex flex-col items-center justify-center h-[100dvh] w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(145deg, #ffffff 0%, #fdf8ee 40%, #f8ecd4 70%, #ffffff 100%)",
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[300px] h-[300px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute w-[200px] h-[200px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #e8bf6a 0%, transparent 70%)",
            bottom: "20%",
            right: "-10%",
            filter: "blur(40px)",
          }}
        />
      </div>
      <Logo className="cb-logo-lg mb-8 relative z-10" />
      <div className="relative mb-10">
        <svg width={170} height={170} viewBox="0 0 170 170" aria-hidden="true">
          <circle
            cx={85}
            cy={85}
            r={70}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={2.5}
          />
          <circle
            cx={85}
            cy={85}
            r={70}
            fill="none"
            stroke="#b8862b"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - percent / 100)}
            transform="rotate(-90 85 85)"
            style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-foreground text-sm font-medium text-center leading-snug px-6">
            Calculando a gravidade
            <br />
            do seu caso...
          </p>
        </div>
      </div>
      <div className="w-full max-w-xs px-4 space-y-0">
        {ANALYSIS_ITEMS.map((item, index) => (
          <div key={item.label}>
            <div
              className="flex items-center gap-3 py-3.5 transition-opacity duration-300"
              style={{ opacity: index <= activeItem ? 1 : 0.35 }}
            >
              <span className="text-base w-6 text-center flex-shrink-0">
                <span className={index === 0 ? "text-primary" : undefined}>
                  {item.icon}
                </span>
              </span>
              <span className="text-foreground text-sm font-medium tracking-wide">
                {item.label}
              </span>
            </div>
            {index < ANALYSIS_ITEMS.length - 1 && (
              <div
                className="h-px w-full"
                style={{ background: "var(--line)" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ConsentModal({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key !== "Tab") return;
      const items = dialog.current?.querySelectorAll<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex="0"]',
      );
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      previousFocus?.focus();
    };
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 bluue-consent-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bluue-consent-title"
        className="cb-dialog fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] gap-4 border shadow-lg outline-none rounded-2xl flex w-[95vw] max-w-lg flex-col overflow-hidden p-0"
      >
        <h2
          id="bluue-consent-title"
          className="cb-dialog-title leading-none flex-shrink-0 border-b px-5 pb-3 pt-5 text-base font-bold"
        >
          Uso das suas respostas
        </h2>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <ConsentText />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden"
          aria-label="Fechar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ConsentText() {
  return (
    <div className="cb-dialog-body text-[13px] sm:text-sm leading-relaxed space-y-4">
      <p>
        As respostas deste questionário servem para uma coisa: indicar o kit de
        COWBOY Energia que combina com a sua rotina.
      </p>
      <h3>O que acontece com elas</h3>
      <p>
        Ficam só neste aparelho, enquanto a página estiver aberta. Não são
        enviadas, não são salvas e somem quando você fecha ou recarrega a
        página.
      </p>
      <h3>Saúde</h3>
      <p>
        O COWBOY Energia é um suplemento alimentar em gotas, vendido sem
        receita. As perguntas de saúde não são avaliação médica: servem para
        medir a gravidade do seu caso e indicar o kit.
      </p>
      <h3>Compra</h3>
      <p>
        Na compra, os dados que você digitar no checkout seguem a política de
        privacidade da COWBOY Energia:{" "}
        <a
          href={PRIVACY_URL}
          target="_blank"
          rel="noopener"
          className="cb-link"
        >
          ler a política de privacidade
        </a>
        . Dúvidas: contato@cowboyenergiamasculina.com.br.
      </p>
    </div>
  );
}
