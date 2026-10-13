"use client";

import { useState } from "react";
import { recordVslPlayback } from "@/lib/vsl-playback";
import type { QuizVariant } from "@/lib/quiz-variant";
import styles from "@/components/sites/bluue/quiz-vsl.module.css";

interface QuizVslProps {
  variant: QuizVariant;
}

export function QuizVsl({ variant }: QuizVslProps) {
  const [hasError, setHasError] = useState(false);
  const showError = () => setHasError(true);
  return (
    <section className="w-full mb-6" data-quiz-vsl aria-labelledby="quiz-vsl-title">
      <h2 id="quiz-vsl-title" className="text-lg font-extrabold text-foreground text-center mb-2">Conheça o COWBOY</h2>
      <p className="text-sm text-muted-foreground text-center mb-3">Entenda como usar e conheça a proposta do COWBOY.</p>
      <video
        className={styles.player}
        controls
        playsInline
        preload="none"
        poster="/imagens/v5/vsl-poster-frame.webp"
        width={720}
        height={1280}
        aria-label="Vídeo de apresentação do COWBOY Energia"
        aria-describedby="quiz-vsl-caption"
        onPlaying={(event) => { setHasError(false); recordVslPlayback("playing", event.currentTarget, variant); }}
        onTimeUpdate={(event) => recordVslPlayback("timeupdate", event.currentTarget, variant)}
        onEnded={(event) => recordVslPlayback("ended", event.currentTarget, variant)}
        onError={showError}
      >
        <source src="/videos/vsl/vsl-dr-durval-720.mp4" type="video/mp4" onError={showError} />
        Seu navegador não suporta a reprodução de vídeo. Você pode escolher seu kit abaixo.
      </video>
      {hasError ? <p role="status" className="text-sm text-muted-foreground text-center mt-2">Não foi possível carregar o vídeo. Você pode escolher seu kit abaixo.</p> : null}
      <p id="quiz-vsl-caption" className="text-xs text-muted-foreground text-center mt-2">Toque para assistir com som. O vídeo tem legendas e os kits estão disponíveis abaixo.</p>
    </section>
  );
}
