import type { KitQuantity } from "@/components/sites/bluue/data";

export type Plan = {
  quantity: KitQuantity;
  label: string;
  meta: string;
  image: string;
  cashPrice: string;
  /** Cash price divided by the days of use (30 servings per bottle), as on the site. */
  perDay: string;
  installment: string;
  installmentTotal: string;
  freeShipping: boolean;
  badge?: string;
  save?: string;
};

// Prices, installments and shipping exactly as on the sales page (#kit) and the
// Appmax checkout: 1 frasco R$ 79,90 + frete R$ 26,75; 2 e 3 frascos com frete grátis.
// The recommended kit (3 frascos) comes first and pre-selected; the others stay visible.
export const plans: Plan[] = [
  { quantity: 3, label: "3 frascos", meta: "90 dias · R$ 66,63 por frasco · melhor preço", image: "kit-3.webp", cashPrice: "R$ 199,90", perDay: "R$ 2,22", installment: "R$ 21,64", installmentTotal: "R$ 259,68", freeShipping: true, badge: "Indicado pra você", save: "Economize R$ 64,80" },
  { quantity: 2, label: "2 frascos", meta: "60 porções · 2 meses de rotina", image: "kit-2.webp", cashPrice: "R$ 154,80", perDay: "R$ 2,58", installment: "R$ 16,75", installmentTotal: "R$ 201,00", freeShipping: true, badge: "Teste completo", save: "Economize R$ 30 com o frete" },
  { quantity: 1, label: "1 frasco", meta: "30 porções · para conhecer", image: "kit-1.webp", cashPrice: "R$ 79,90", perDay: "R$ 2,66", installment: "R$ 8,65", installmentTotal: "R$ 103,80", freeShipping: false },
];

// Social proof declared by the owner on 05/10/2026 (orders and reviews across all sales channels).
export const RATING = "4,8";
export const REVIEWS = "1.836";
export const CUSTOMERS = "+38 mil homens";

// Customer videos (filmed by the customers) with their own words, as on the sales page.
export const videos = [
  { file: "depoimento-1", quote: "Tem duas semanas que eu tô tomando. Tô top demais agora.", cite: "Cliente, no vídeo" },
  { file: "depoimento-2", quote: "Segundo frasco já que eu estou indo.", cite: "Cliente no segundo frasco" },
];

// Customer photos and names as published on the sales page.
export const clients = [
  { image: "cliente-04.webp", name: "Marcos", alt: "Casal sorrindo em uma mesa ao ar livre à noite, cada um segurando um frasco COWBOY Energia" },
  { image: "cliente-06.webp", name: "Ricardo", alt: "Casal sorrindo dentro de um avião, a mulher segurando um frasco COWBOY Energia" },
  { image: "cliente-05.webp", name: "Fernando", alt: "Homem de camisa clara sorrindo em uma praça à noite, segurando um frasco COWBOY Energia" },
  { image: "cliente-02.webp", name: "Paulo", alt: "Homem de óculos deitado na cama, segurando um frasco COWBOY Energia" },
  { image: "cliente-01.webp", name: "André", alt: "Homem de boné e óculos escuros no sofá, segurando um frasco COWBOY Energia" },
  { image: "cliente-03.webp", name: "Sérgio", alt: "Homem de gorro no sofá, segurando um frasco COWBOY Energia" },
];
