import type { Metadata } from "next";
import { QuizEditorial } from "@/components/sites/bluue/quiz-editorial";

export const metadata: Metadata = {
  title: "COWBOY em pauta | Uma conversa sem rodeios",
  description: "Responda 14 perguntas sobre sua vida íntima, veja seu resumo e conheça a apresentação e os kits da COWBOY. Sem cadastro.",
};

export default function QuizEditorialPage() {
  return <QuizEditorial />;
}
