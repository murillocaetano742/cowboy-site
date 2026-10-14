"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "@/components/sites/bluue/quiz-journey.module.css";

interface QuizJourneyDockProps {
  children: ReactNode;
}

/** Reserve the actual footer height, including wrapped text at browser/text zoom. */
export function QuizJourneyDock({ children }: QuizJourneyDockProps) {
  const dockRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const dock = dockRef.current;
    const journey = dock?.closest<HTMLElement>("[data-journey]");
    if (!dock || !journey) return;
    const measure = () => journey.style.setProperty("--journey-dock-height", `${dock.getBoundingClientRect().height}px`);
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(dock);
    window.addEventListener("resize", measure);
    return () => { observer?.disconnect(); window.removeEventListener("resize", measure); journey.style.removeProperty("--journey-dock-height"); };
  }, []);
  return <div ref={dockRef} className={styles.dock} data-journey-dock>{children}</div>;
}
