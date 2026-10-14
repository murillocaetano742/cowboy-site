/* eslint-disable @next/next/no-img-element -- Reuses the existing result illustration. */

import type { CSSProperties } from "react";
import { Info } from "lucide-react";
import { intensityReport, intensitySummary } from "@/components/sites/bluue/symptom-intensity";
import styles from "@/components/sites/bluue/quiz-journey.module.css";

interface QuizIntensityResultProps {
  answers: Readonly<Record<string, string>>;
}

export function QuizIntensityResult({ answers }: QuizIntensityResultProps) {
  const report = intensityReport(answers.symptom_intensity);
  if (!report) return null;
  const points = intensitySummary(answers);
  return (
    <div className={`cb-result ${styles.intensityResult}`} style={{ "--sev": report.color } as CSSProperties}>
      <div className="cb-result-media">
        <img src="/sites/cowboy/gravidade.webp" alt="Ilustração de um casal no quarto" width={768} height={512} />
        <span className="cb-result-tag">Seu resultado</span>
      </div>
      <div data-journey-report>
        <p className="cb-result-label">Intensidade que você relatou</p>
        <h1 id="journey-title" tabIndex={-1} data-journey-title data-journey-intensity className="cb-result-level">{report.label}</h1>
        <div className="cb-gauge" role="img" aria-label={`Intensidade informada por você: ${report.label.toLowerCase()}`}>
          <div className="cb-gauge-bar"><span className="cb-gauge-marker" style={{ left: `${report.gauge}%` }} /></div>
          <div className="cb-gauge-labels" aria-hidden="true"><span>Nenhuma</span><span>Leve</span><span>Moderada</span><span>Alta</span><span>Muito alta</span></div>
        </div>
        <p className={styles.note}>É a sua percepção, não um diagnóstico médico.</p>
      </div>
      {points.length > 0 && <ul className="cb-result-points">{points.map(point => <li key={point}><Info aria-hidden="true" /><span>{point}</span></li>)}</ul>}
      <p className={styles.note}>Um profissional de saúde pode avaliar seus sintomas e orientar você.</p>
    </div>
  );
}
