"use client";

import { useEffect, useRef, useState } from "react";
import { recordVslPlayback } from "@/lib/vsl-playback";
import { allowedSeekTarget, hasCompletedVsl } from "@/lib/vsl-completion";
import { trackVslInteraction } from "@/lib/quiz-tracking";
import type { QuizVariant } from "@/lib/quiz-variant";
import styles from "@/components/sites/bluue/quiz-vsl.module.css";

interface QuizVslProps {
  variant: QuizVariant;
  onViewKits?: () => void;
  active?: boolean;
  presentation?: boolean;
  nextDestination?: "offer" | "testimonials";
  compact?: boolean;
  onContinueReady?: () => void;
  strictCompletion?: boolean;
}

export function QuizVsl({ variant, onViewKits, active = true, presentation = false, nextDestination = "offer", compact = false, onContinueReady, strictCompletion = false }: QuizVslProps) {
  const strict = strictCompletion && variant === "v5-etapas";
  const videoRef = useRef<HTMLVideoElement>(null);
  const autoplayAttempted = useRef(false);
  const hasPlayed = useRef(false);
  const audible = useRef(false);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [requiresInteraction, setRequiresInteraction] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const showError = () => { setHasError(true); trackVslInteraction("error", variant); if (!strict) onContinueReady?.(); };

  useEffect(() => {
    const video = videoRef.current;
    if (!active) { video?.pause(); return; }
    if (!video) return;
    let isMounted = true;
    if (onContinueReady && (typeof video.play !== "function" || typeof video.canPlayType !== "function" || !video.canPlayType("video/mp4"))) {
      queueMicrotask(() => {
        if (!isMounted) return;
        setHasError(true);
        trackVslInteraction("error", variant);
        if (!strict) onContinueReady();
      });
      return () => { isMounted = false; };
    }
    if (typeof IntersectionObserver === "undefined") return;
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
  }, [variant, active, onContinueReady, strict]);

  const playWithSound = () => {
    const video = videoRef.current;
    if (!video) return;
    autoplayAttempted.current = true;
    video.muted = false;
    video.volume = 1;
    void video.play().catch(() => setRequiresInteraction(true));
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video || typeof video.play !== "function") return;
    autoplayAttempted.current = true;
    if (!video.paused) video.pause();
    else void video.play().catch(() => setRequiresInteraction(true));
  };

  const toggleAudio = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.muted || video.volume === 0) { video.muted = false; video.volume = 1; }
    else video.muted = true;
  };

  const retryPlayback = () => {
    const video = videoRef.current;
    if (!video || typeof video.load !== "function" || typeof video.play !== "function") return;
    autoplayAttempted.current = true;
    setHasError(false);
    setRequiresInteraction(false);
    // Reloading starts a new played range at zero; no previous coverage is invented.
    video.load();
    void video.play().catch(() => setRequiresInteraction(true));
  };

  const guardSeek = (video: HTMLVideoElement) => {
    if (!strict) return;
    const allowed = allowedSeekTarget(video, video.currentTime);
    if (video.currentTime > allowed + 0.001) video.currentTime = allowed;
  };

  return (
    <section className={`w-full mb-6${compact ? ` ${styles.compact}` : ""}${strict ? ` ${styles.strict}` : ""}`} data-quiz-vsl data-vsl-strict={strict || undefined} aria-labelledby={presentation ? "journey-title" : "quiz-vsl-title"}>
      {!presentation && <h2 id="quiz-vsl-title" className="text-lg font-extrabold text-foreground text-center mb-2">Conheça o COWBOY</h2>}
      {!compact && <p className="text-sm text-muted-foreground text-center mb-3">Entenda como usar e conheça a proposta do COWBOY.</p>}
      <div className={styles.frame}>
      <video
        ref={videoRef}
        id="quiz-vsl-video"
        className={styles.player}
        controls={!strict}
        controlsList={strict ? "nodownload noplaybackrate noremoteplayback" : undefined}
        disablePictureInPicture={strict || undefined}
        disableRemotePlayback={strict || undefined}
        muted={isMuted}
        playsInline
        preload="none"
        poster="/imagens/v5/vsl-poster-frame.webp"
        width={720}
        height={1280}
        aria-label="Vídeo de apresentação do COWBOY Energia"
        aria-describedby="quiz-vsl-caption"
        onContextMenu={strict ? event => event.preventDefault() : undefined}
        onKeyDown={strict ? event => { if (["ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown", "j", "l"].includes(event.key)) event.preventDefault(); } : undefined}
        onSeeking={strict ? event => guardSeek(event.currentTarget) : undefined}
        onSeeked={strict ? event => guardSeek(event.currentTarget) : undefined}
        onRateChange={strict ? event => {
          if (event.currentTarget.playbackRate !== 1) event.currentTarget.playbackRate = 1;
          if (event.currentTarget.defaultPlaybackRate !== 1) event.currentTarget.defaultPlaybackRate = 1;
        } : undefined}
        onPlay={() => { autoplayAttempted.current = true; if (strict) setIsPlaying(true); }}
        onVolumeChange={(event) => {
          const video = event.currentTarget;
          setIsMuted(video.muted);
          const nextAudible = !video.muted && video.volume > 0;
          if (audible.current !== nextAudible) trackVslInteraction(nextAudible ? "unmute" : "mute", variant);
          audible.current = nextAudible;
        }}
        onPlaying={(event) => { hasPlayed.current = true; if (strict) setIsPlaying(true); setHasError(false); setRequiresInteraction(false); recordVslPlayback("playing", event.currentTarget, variant); }}
        onPause={(event) => { if (strict) setIsPlaying(false); if (hasPlayed.current && !event.currentTarget.ended) trackVslInteraction("pause", variant); }}
        onTimeUpdate={(event) => recordVslPlayback("timeupdate", event.currentTarget, variant)}
        onEnded={(event) => {
          if (strict) {
            setIsPlaying(!event.currentTarget.paused);
            if (!hasCompletedVsl(event.currentTarget, event.nativeEvent.isTrusted)) {
              recordVslPlayback("timeupdate", event.currentTarget, variant);
              return;
            }
          }
          recordVslPlayback("ended", event.currentTarget, variant);
          onContinueReady?.();
        }}
        onError={showError}
      >
        <source src="/videos/vsl/vsl-dr-durval-720.mp4" type="video/mp4" onError={showError} />
        {strict ? "Seu navegador não suporta este vídeo. Use um navegador compatível para assistir à apresentação completa." : presentation ? nextDestination === "testimonials" ? "Seu navegador não suporta a reprodução de vídeo. Você pode seguir para os depoimentos pelo botão." : "Seu navegador não suporta a reprodução de vídeo. Você pode acessar os kits pelo botão." : "Seu navegador não suporta a reprodução de vídeo. Você pode escolher seu kit abaixo."}
      </video>
      {!strict && (isMuted || requiresInteraction) ? (
        <button type="button" className={styles.soundButton} aria-controls="quiz-vsl-video" onClick={playWithSound}>
          {requiresInteraction ? "Reproduzir vídeo com som" : "Ativar som"}
        </button>
      ) : null}
      </div>
      {strict && <div className={styles.playbackControls} aria-label="Controles do vídeo">
        <button type="button" data-vsl-playback aria-controls="quiz-vsl-video" onClick={togglePlayback}>{isPlaying ? "Pausar vídeo" : "Retomar vídeo"}</button>
        <button type="button" data-vsl-audio aria-controls="quiz-vsl-video" onClick={toggleAudio}>{isMuted ? "Ativar som" : "Desativar som"}</button>
      </div>}
      {hasError ? <p role="status" className="text-sm text-muted-foreground text-center mt-2">{strict ? "Não foi possível carregar o vídeo. Tente recarregar para assistir à apresentação completa." : presentation ? nextDestination === "testimonials" ? "Não foi possível carregar o vídeo. Você pode seguir para os depoimentos pelo botão." : "Não foi possível carregar o vídeo. Você pode acessar os kits pelo botão." : "Não foi possível carregar o vídeo. Você pode escolher seu kit abaixo."}</p> : null}
      {strict && hasError && <button type="button" className={styles.fallbackButton} data-vsl-retry aria-controls="quiz-vsl-video" onClick={retryPlayback}>Recarregar vídeo do início</button>}
      {requiresInteraction && !hasError ? <p role="status" className="text-sm text-muted-foreground text-center mt-2">Toque no botão para iniciar o vídeo.</p> : null}
      <p id="quiz-vsl-caption" className="text-xs text-muted-foreground text-center mt-2">O vídeo começa sem som ao aparecer na tela. Toque em “Ativar som” para ouvir. {strict ? "Você pode pausar e retomar. Assista à apresentação completa para liberar a próxima etapa." : onContinueReady ? "Ao final, o botão leva aos depoimentos de clientes." : presentation ? nextDestination === "testimonials" ? "Você pode seguir para os depoimentos quando quiser." : "Você pode acessar a oferta quando quiser." : "Os kits estão disponíveis abaixo."}</p>
      {onViewKits && <button type="button" data-view-kits aria-controls={presentation ? undefined : "quiz-kits"} className={styles.kitsButton} onClick={onViewKits}>Ver kits e valores</button>}
    </section>
  );
}
