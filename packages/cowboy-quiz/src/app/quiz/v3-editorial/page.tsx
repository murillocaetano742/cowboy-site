import type { Metadata } from "next";
import { QuizEditorial } from "@/components/sites/bluue/quiz-editorial";

export const metadata: Metadata = {
  title: "COWBOY em pauta | Desbloqueie seu resultado",
  description: "Responda 14 perguntas sobre sua vida íntima e desbloqueie seu resultado e a apresentação da COWBOY. Quiz gratuito, sem cadastro.",
};

export default function QuizEditorialPage() {
  return <QuizEditorial />;
}
