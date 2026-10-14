import type { Metadata } from "next";
import { Quiz } from "@/components/sites/bluue/Quiz";

export const metadata: Metadata = {
  title: "Seu quiz | COWBOY Energia",
  description: "Responda no seu ritmo. Seu resumo, a apresentação e a oferta em etapas próprias.",
};

export default function QuizJourneyPage() {
  return <Quiz variant="v4-jornada" />;
}
