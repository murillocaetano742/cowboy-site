import type { Metadata } from "next";
import "./source.css";
import "./globals.css";
import "@/components/sites/bluue/finish.css";
import "@/components/sites/bluue/special.css";
import "./cowboy.css";

export const metadata: Metadata = {
  title: "COWBOY Energia | Descubra o kit certo pra você",
  description:
    "Responda em 1 minuto e veja o kit de COWBOY Energia em gotas indicado para a sua rotina. Teste de 30 dias: não sentiu diferença em 10, o dinheiro volta.",
  robots: { index: false, follow: false },
  icons: { icon: "/sites/cowboy/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
