import type { Metadata } from "next";
import { QuizEditorial } from "@/components/sites/bluue/quiz-editorial";

export const metadata: Metadata = {
  title: "COWBOY em pauta | Comece seu quiz",
  description: "Uma conversa sobre confiança e vida íntima. Responda ao quiz da COWBOY, veja seu resumo e conheça o produto e os kits disponíveis.",
};

export default function QuizEditorialPage() {
  return <QuizEditorial />;
}
