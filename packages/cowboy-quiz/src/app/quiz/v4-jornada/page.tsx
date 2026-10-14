import type { Metadata } from "next";
import { QuizEditorial } from "@/components/sites/bluue/quiz-editorial";

export const metadata: Metadata = {
  title: "Sua jornada | COWBOY Energia",
  description: "Responda às perguntas, veja seu resumo e conheça a apresentação e os kits da COWBOY. Sem cadastro.",
};

export default function QuizJourneyCoverPage() {
  return <QuizEditorial variant="v4-jornada" />;
}
