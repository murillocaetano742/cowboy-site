import type { Metadata } from "next";
import { Quiz } from "@/components/sites/bluue/Quiz";

export const metadata: Metadata = {
  title: "Seu quiz | COWBOY Energia",
  description: "Responda no seu ritmo. Seu resumo, a apresentação, os depoimentos e a oferta em etapas próprias.",
};

export default function QuizStepsPage() {
  return <Quiz variant="v5-etapas" />;
}
