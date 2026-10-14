"use client";

import { useEffect, useRef, useState } from "react";
import { recordVslPlayback } from "@/lib/vsl-playback";
import { trackVslInteraction } from "@/lib/quiz-tracking";
import type { QuizVariant } from "@/lib/quiz-variant";
import styles from "@/components/sites/bluue/quiz-vsl.module.css";

interface QuizVslProps {
  variant: QuizVariant;
  onViewKits?: () => void;
  active?: boolean;
  presentation?: boolean;
  nextDestination?: "offer" | "testimonials";
}

export function QuizVsl({ variant, onViewKits, active = true, presentation = false, nextDestination = "offer" }: QuizVslProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const autoplayAttempted = useRef(false);
  const hasPlayed = useRef(false);
  const audible = useRef(false);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [requiresInteraction, setRequiresInteraction] = useState(false);
  const showError = () => { setHasError(true); trackVslInteraction("error", variant); };

  useEffect(() => {
    const video = videoRef.current;
    if (!active) { video?.pause(); return; }
    if (!video || typeof IntersectionObserver === "undefined") return;
    let isMounted = true;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.5)) return;
      trackVslInteraction("visible", variant);
      observer.disconnect();
      if (autoplayAttempted.current) return;
      // One attempt per mount: scrolling must never override a manual pause.
      autoplayAttempted.current = true;
      observer.disconnect();
      void video.play().catch(() => {
        if (isMounted) { setRequiresInteraction(true); trackVslInteraction("autoplay_blocked", variant); }
      });
    }, { threshold: 0.5 });
    observer.observe(video);
    return () => {
      isMounted = false;
      observer.disconnect();
    };
  }, [variant, active]);

  const playWithSound = () => {
    const video = videoRef.current;
    if (!video) return;
    autoplayAttempted.current = true;
    video.muted = false;
    video.volume = 1;
    void video.play().catch(() => setRequiresInteraction(true));
  };

  return (
    <section className="w-full mb-6" data-quiz-vsl aria-labelledby={presentation ? "journey-title" : "quiz-vsl-title"}>
      {!presentation && <h2 id="quiz-vsl-title" className="text-lg font-extrabold text-foreground text-center mb-2">Conheça o COWBOY</h2>}
      <p className="text-sm text-muted-foreground text-center mb-3">Entenda como usar e conheça a proposta do COWBOY.</p>
      <div className={styles.frame}>
      <video
        ref={videoRef}
        id="quiz-vsl-video"
        className={styles.player}
        controls
        muted={isMuted}
        playsInline
        preload="none"
        poster="/imagens/v5/vsl-poster-frame.webp"
        width={720}
        height={1280}
        aria-label="Vídeo de apresentação do COWBOY Energia"
        aria-describedby="quiz-vsl-caption"
        onPlay={() => { autoplayAttempted.current = true; }}
        onVolumeChange={(event) => {
          const video = event.currentTarget;
          setIsMuted(video.muted);
          const nextAudible = !video.muted && video.volume > 0;
          if (audible.current !== nextAudible) trackVslInteraction(nextAudible ? "unmute" : "mute", variant);
          audible.current = nextAudible;
        }}
        onPlaying={(event) => { hasPlayed.current = true; setHasError(false); setRequiresInteraction(false); recordVslPlayback("playing", event.currentTarget, variant); }}
        onPause={(event) => { if (hasPlayed.current && !event.currentTarget.ended) trackVslInteraction("pause", variant); }}
        onTimeUpdate={(event) => recordVslPlayback("timeupdate", event.currentTarget, variant)}
        onEnded={(event) => recordVslPlayback("ended", event.currentTarget, variant)}
        onError={showError}
      >
        <source src="/videos/vsl/vsl-dr-durval-720.mp4" type="video/mp4" onError={showError} />
        {presentation ? nextDestination === "testimonials" ? "Seu navegador não suporta a reprodução de vídeo. Você pode seguir para os depoimentos pelo botão." : "Seu navegador não suporta a reprodução de vídeo. Você pode acessar os kits pelo botão." : "Seu navegador não suporta a reprodução de vídeo. Você pode escolher seu kit abaixo."}
      </video>
      {isMuted || requiresInteraction ? (
        <button type="button" className={styles.soundButton} aria-controls="quiz-vsl-video" onClick={playWithSound}>
          {requiresInteraction ? "Reproduzir vídeo com som" : "Ativar som"}
        </button>
      ) : null}
      </div>
      {hasError ? <p role="status" className="text-sm text-muted-foreground text-center mt-2">{presentation ? nextDestination === "testimonials" ? "Não foi possível carregar o vídeo. Você pode seguir para os depoimentos pelo botão." : "Não foi possível carregar o vídeo. Você pode acessar os kits pelo botão." : "Não foi possível carregar o vídeo. Você pode escolher seu kit abaixo."}</p> : null}
      {requiresInteraction && !hasError ? <p role="status" className="text-sm text-muted-foreground text-center mt-2">Toque no botão para iniciar o vídeo.</p> : null}
      <p id="quiz-vsl-caption" className="text-xs text-muted-foreground text-center mt-2">O vídeo começa sem som ao aparecer na tela. Toque em “Ativar som” para ouvir. {presentation ? nextDestination === "testimonials" ? "Você pode seguir para os depoimentos quando quiser." : "Você pode acessar a oferta quando quiser." : "Os kits estão disponíveis abaixo."}</p>
      {onViewKits && <button type="button" data-view-kits aria-controls={presentation ? undefined : "quiz-kits"} className={styles.kitsButton} onClick={onViewKits}>Ver kits e valores</button>}
    </section>
  );
}
