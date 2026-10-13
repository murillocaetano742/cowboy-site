import type { Metadata } from "next";
import { Quiz } from "@/components/sites/bluue/Quiz";

export const metadata: Metadata = {
  title: "Seu quiz | COWBOY Energia",
  description: "Responda às perguntas no seu ritmo, acompanhe seu progresso e conheça a proposta da COWBOY Energia.",
};

export default function QuizEditorialFlowPage() {
  return <Quiz variant="v3-editorial" />;
}
