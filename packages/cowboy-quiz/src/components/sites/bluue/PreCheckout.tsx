"use client";

/* eslint-disable @next/next/no-img-element -- Static export serves the local images as they are. */

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, CircleCheck, Lock, ShieldCheck, Star, TriangleAlert, Truck } from "lucide-react";
import { caseResult, RECOMMENDED_KIT, type KitQuantity } from "./data";
import { checkoutHref } from "./checkout";

const ASSETS = "/sites/cowboy/";
const SITE = "https://cowboyenergiamasculina.com.br";

type Plan = {
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
const plans: Plan[] = [
  { quantity: 3, label: "3 frascos", meta: "90 dias · R$ 66,63 por frasco · melhor preço", image: "kit-3.webp", cashPrice: "R$ 199,90", perDay: "R$ 2,22", installment: "R$ 21,64", installmentTotal: "R$ 259,68", freeShipping: true, badge: "Indicado pra você", save: "Economize R$ 64,80" },
  { quantity: 2, label: "2 frascos", meta: "60 porções · 2 meses de rotina", image: "kit-2.webp", cashPrice: "R$ 154,80", perDay: "R$ 2,58", installment: "R$ 16,75", installmentTotal: "R$ 201,00", freeShipping: true, badge: "Teste completo", save: "Economize R$ 30 com o frete" },
  { quantity: 1, label: "1 frasco", meta: "30 porções · para conhecer", image: "kit-1.webp", cashPrice: "R$ 79,90", perDay: "R$ 2,66", installment: "R$ 8,65", installmentTotal: "R$ 103,80", freeShipping: false },
];

// Social proof declared by the owner on 05/10/2026 (orders and reviews across all sales channels).
const RATING = "4,8";
const REVIEWS = "1.836";
const CUSTOMERS = "+38 mil homens";

const banners = [
  { image: "kit-2.webp", caption: "COWBOY Energia · suplemento em gotas", position: "50% 50%" },
  { image: "caixa-discreta.webp", caption: "Chega em caixa fechada, sem o nome do produto", position: "50% 50%" },
  { image: "casal-cumplicidade.webp", caption: "30 dias para voltar a ser o homem que ela conheceu", position: "50% 20%" },
  { image: "kit-3.webp", caption: "3 frascos: R$ 66,63 cada, frete grátis", position: "50% 50%" },
];

// Customer videos (filmed by the customers) with their own words, as on the sales page.
const videos = [
  { file: "depoimento-1", quote: "Tem duas semanas que eu tô tomando. Tô top demais agora.", cite: "Cliente, no vídeo" },
  { file: "depoimento-2", quote: "Segundo frasco já que eu estou indo.", cite: "Cliente no segundo frasco" },
];

// Customer photos and names as published on the sales page.
const clients = [
  { image: "cliente-04.webp", name: "Marcos", alt: "Casal sorrindo em uma mesa ao ar livre à noite, cada um segurando um frasco COWBOY Energia" },
  { image: "cliente-06.webp", name: "Ricardo", alt: "Casal sorrindo dentro de um avião, a mulher segurando um frasco COWBOY Energia" },
  { image: "cliente-05.webp", name: "Fernando", alt: "Homem de camisa clara sorrindo em uma praça à noite, segurando um frasco COWBOY Energia" },
  { image: "cliente-02.webp", name: "Paulo", alt: "Homem de óculos deitado na cama, segurando um frasco COWBOY Energia" },
  { image: "cliente-01.webp", name: "André", alt: "Homem de boné e óculos escuros no sofá, segurando um frasco COWBOY Energia" },
  { image: "cliente-03.webp", name: "Sérgio", alt: "Homem de gorro no sofá, segurando um frasco COWBOY Energia" },
];

const reassurances = [
  { icon: ShieldCheck, label: "Checkout\nSeguro" },
  { icon: CircleCheck, label: "Teste de\n30 Dias" },
  { icon: Lock, label: "Envio\nDiscreto" },
  { icon: Truck, label: "Frete Grátis\n2+ Frascos" },
];

const questions = [
  { q: "E se eu não sentir diferença?", a: "Você tem 30 dias. Se em 10 não sentir diferença, manda uma mensagem para o SAC (WhatsApp ou e-mail) e devolvemos o valor dos produtos, sem justificativa, conforme as condições da garantia. O risco é nosso." },
  { q: "Funciona no mesmo dia?", a: "Não é comprimido de uma noite. É rotina: 12 gotas, uma vez por dia. Por isso o desafio é de 30 dias, com o dinheiro de volta se você não sentir diferença em 10." },
  { q: "Isso é remédio?", a: "Não. É suplemento em gotas: sem receita, sem tarja, sem fila de farmácia. Você compra hoje e começa no dia em que chegar." },
  { q: "Posso usar com a minha medicação?", a: "O rótulo é aberto: seis componentes, todos com a quantidade declarada. Leve para quem acompanha você e tire a dúvida em um minuto." },
  { q: "Como uso?", a: "Doze gotas (1 mL), uma vez por dia, medidas no conta-gotas do frasco. Siga as orientações da embalagem. Depois de aberto, consuma em até 60 dias." },
  { q: "Quanto tempo dura um frasco?", a: "Cada frasco tem 30 porções declaradas no rótulo. Dois frascos, 60 porções: cobrem os 30 dias do teste com folga." },
  { q: "Quanto é o frete?", a: "Grátis a partir de 2 frascos, para todo o Brasil. No kit de 1 frasco, o frete de R$ 26,75 é somado no checkout, antes de você pagar. Sem assinatura, sem cobrança recorrente." },
  { q: "Posso parcelar?", a: "Sim. Cartão em até 12x ou Pix, no checkout seguro da Appmax. O valor da parcela aparece antes de você confirmar." },
  { q: "O envio é discreto?", a: "Sim. Caixa fechada, sem o nome do produto do lado de fora. O que tem dentro fica entre você e você." },
  { q: "Posso comprar mais de 3 frascos?", a: "Nesta condição, o limite é de 3 frascos por pedido. Precisa de mais? Faça dois pedidos ou fale com a gente no WhatsApp." },
  { q: "Quem fabrica?", a: "BNT Farma, CNPJ 21.027.384/0001-06, como impresso no rótulo. SAC: contato@cowboyenergiamasculina.com.br." },
];

export function PreCheckout({ answers }: { answers: Record<string, string> }) {
  const result = caseResult(answers);
  const [selectedPlan, setSelectedPlan] = useState<KitQuantity>(RECOMMENDED_KIT);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const plan = plans.find((item) => item.quantity === selectedPlan) ?? plans[0];

  useEffect(() => {
    const timer = window.setInterval(() => setBannerIndex((index) => (index + 1) % banners.length), 3000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setTestimonialIndex((index) => (index + 1) % (clients.length - 2)), 3000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="bluue-finish-enter flex flex-col items-center px-4 py-8 max-w-md mx-auto" data-build="cowboy-1">
      <section className="cb-result w-full mb-6" data-severity={result.severity} aria-labelledby="cb-result-level">
        <div className="cb-result-media">
          <img src={`${ASSETS}gravidade.webp`} alt="Homem sentado na beira da cama à noite, de cabeça baixa, com a mulher deitada de costas para ele" loading="eager" fetchPriority="high" />
          <span className="cb-result-tag">Seu resultado</span>
        </div>
        <p className="cb-result-label">Gravidade do seu caso</p>
        <h1 id="cb-result-level" className="cb-result-level">{result.severity}</h1>
        <div className="cb-gauge" role="img" aria-label={`Medidor de gravidade: ${result.severity.toLowerCase()}`}>
          <div className="cb-gauge-bar"><span className="cb-gauge-marker" style={{ left: `${result.gauge}%` }} /></div>
          <div className="cb-gauge-labels" aria-hidden="true"><span>Moderada</span><span>Alta</span><span>Muito alta</span></div>
        </div>
        {result.points.length > 0 && (
          <ul className="cb-result-points">
            {result.points.map((point) => <li key={point}><TriangleAlert aria-hidden="true" />{point}</li>)}
          </ul>
        )}
        <p className="cb-result-punch">{result.punchline}</p>
        <div className="cb-result-rec">
          <img src={`${ASSETS}kit-3.webp`} alt="" />
          <div>
            <span>Indicado para o seu caso</span>
            <b>Protocolo completo: 3 frascos</b>
            <small>90 dias de rotina, sem interromper. É o kit que já vem marcado abaixo.</small>
          </div>
        </div>
      </section>

      <p className="text-sm font-bold text-foreground text-center mb-3">Selecione o seu kit</p>

      <div className="w-full space-y-3 mb-4" role="group" aria-label="Kits disponíveis">
        {plans.map((item) => (
          <button type="button" key={item.quantity} onClick={() => setSelectedPlan(item.quantity)} aria-pressed={selectedPlan === item.quantity} className={`w-full rounded-2xl border-2 p-3.5 text-left transition-all duration-200 ${selectedPlan === item.quantity ? "cb-option-selected" : "cb-option"}`}>
            <div className="flex items-center gap-3">
              <img src={`${ASSETS}${item.image}`} alt="" className="cb-plan-img" loading="lazy" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-foreground text-sm uppercase">{item.label}</span>
                  {item.badge && <span className={`cb-badge ${item.quantity === RECOMMENDED_KIT ? "cb-badge-gold" : "cb-badge-green"}`}>{item.badge}</span>}
                </div>
                <span className="block text-xs text-muted-foreground">{item.meta}</span>
                <div className="flex items-end justify-between gap-2 mt-2">
                  <div>
                    <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full inline-flex items-center gap-1"><Truck className="w-3 h-3" />{item.freeShipping ? "Frete Grátis" : "Frete R$ 26,75"}</span>
                    {item.save && <p className="cb-save text-[10px] font-semibold mt-1.5">{item.save}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="cb-per-day"><b>{item.perDay}</b><small>/dia</small></span>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">{item.cashPrice} à vista</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="w-full text-center mb-3 py-3">
        <p className="text-base text-muted-foreground">12x de <span className="text-4xl cb-installment">{plan.installment}</span></p>
        <p className="text-sm text-muted-foreground mt-1">Ou {plan.cashPrice} à vista{plan.freeShipping ? " · frete grátis" : " + frete de R$ 26,75"}</p>
        <p className="text-[10px] text-muted-foreground mt-1">
          {plan.freeShipping
            ? `No cartão, com juros. Total ${plan.installmentTotal}.`
            : `No cartão, com juros. Total do produto ${plan.installmentTotal}. Com frete: 12x de R$ 11,54 ou R$ 106,65 à vista.`}
        </p>
      </div>
      {/* Tracking parameters of the quiz URL (utm_*, fbclid, src...) go on to the checkout. */}
      <a href={checkoutHref(plan.quantity)} onClick={(event) => { event.currentTarget.href = checkoutHref(plan.quantity, window.location.search); }} className="bluue-finish-button cb-btn w-full h-14 px-8 rounded-full text-base font-bold mb-6">{plan.quantity === RECOMMENDED_KIT ? "Quero o protocolo completo »" : "Quero começar agora »"}</a>

      <div className="w-full rounded-2xl overflow-hidden mb-4 relative" aria-label="COWBOY Energia">
        <div className="relative w-full">
          {banners.map((banner, index) => (
            <figure key={banner.image} className={`w-full transition-opacity duration-700 ${index === bannerIndex ? "relative opacity-100" : "absolute inset-0 opacity-0"}`} aria-hidden={index !== bannerIndex}>
              <img src={`${ASSETS}${banner.image}`} alt="" loading={index === 0 ? "eager" : "lazy"} className="cb-banner-img w-full" style={{ objectPosition: banner.position }} />
              <figcaption className="cb-banner-caption">{banner.caption}</figcaption>
            </figure>
          ))}
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {banners.map((banner, index) => <button type="button" key={banner.image} onClick={() => setBannerIndex(index)} aria-label={`Exibir imagem ${index + 1}`} aria-pressed={index === bannerIndex} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === bannerIndex ? "bg-primary w-5" : "bg-white/60"}`} />)}
        </div>
      </div>


      <div className="grid grid-cols-4 gap-2 w-full mb-6">
        {reassurances.map(({ icon: Icon, label }) => <div key={label} className="flex flex-col items-center text-center gap-1.5 glass-card-sm py-3 px-1"><Icon className="w-6 h-6 text-primary" /><span className="text-[10px] text-muted-foreground whitespace-pre-line leading-tight font-medium">{label}</span></div>)}
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="flex gap-0.5 mb-1">{Array.from({ length: 5 }, (_, index) => <Star key={index} className="cb-star w-4 h-4" />)}</div>
        <p className="text-xs text-muted-foreground">{RATING} de {REVIEWS} AVALIAÇÕES.</p>
      </div>
      <h2 className="text-lg font-extrabold text-foreground text-center mb-1"><span className="gradient-text">{CUSTOMERS}</span> já escolheram o COWBOY</h2>
      <p className="text-xs text-muted-foreground text-center mb-4">Dois gravaram o próprio vídeo. Outros mandaram a foto com o frasco na mão.</p>
      <div className="cb-videos w-full mb-4">
        {videos.map((video, index) => (
          <figure key={video.file} className="cb-video">
            <video controls playsInline preload="none" poster={`${ASSETS}videos/${video.file}.jpg`} aria-label={`Vídeo de depoimento de cliente ${index + 1}`}>
              <source src={`${ASSETS}videos/${video.file}.mp4`} type="video/mp4" />
              <track kind="subtitles" srcLang="pt-BR" label="Português" src={`${ASSETS}videos/${video.file}.vtt`} />
            </video>
            <figcaption>
              <blockquote>“{video.quote}”</blockquote>
              <cite>{video.cite}</cite>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="w-full mb-8 overflow-hidden">
        <div className="flex gap-3 transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${testimonialIndex * (100 / 3 + 1.2)}%)` }}>
          {clients.map((client) => (
            <figure key={client.image} className="bluue-testimonial-photo flex-shrink-0">
              <img src={`${ASSETS}${client.image}`} alt={client.alt} loading="lazy" className="cb-client-photo w-full rounded-xl" />
              <figcaption className="cb-client-name text-center mt-1">Cliente {client.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <h3 className="text-lg font-extrabold text-foreground mb-3">Dúvidas <span className="gradient-text">Frequentes</span></h3>
      <div className="w-full mb-8">
        {questions.map((question, index) => (
          <button type="button" key={question.q} aria-expanded={expandedQuestion === index} aria-controls={`bluue-faq-${index}`} onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)} className="w-full text-left border-b border-border/60 py-3 group">
            <span className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground pr-4 group-hover:text-primary transition-colors">{question.q}</span>
              {expandedQuestion === index ? <ChevronUp className="w-4 h-4 text-primary flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />}
            </span>
            {expandedQuestion === index && <span id={`bluue-faq-${index}`} className="bluue-faq-answer text-sm text-muted-foreground mt-2"><span className="bluue-faq-answer-content">{question.a}</span></span>}
          </button>
        ))}
      </div>
      <div className="flex flex-col items-center text-center mb-8">
        <div className="cb-seal mb-6" role="img" aria-label="Selo de garantia: 30 dias">
          <ShieldCheck aria-hidden="true" />
          <small aria-hidden="true">Garantia</small>
          <b aria-hidden="true">30 dias</b>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">Você tem 30 dias para testar o COWBOY. Não sentiu diferença em 10? Manda uma mensagem para o SAC e o valor dos produtos volta, conforme as <a href={`${SITE}/termos`} target="_blank" rel="noopener" className="cb-link">condições da garantia</a>. Sem burocracia. Sem enrolação.</p>
      </div>
      <footer className="cb-footer text-center">
        <p>COWBOY Energia · Suplemento alimentar em gotas, 30 mL. Este produto não é um medicamento.</p>
        <p>Fabricado por BNT Farma, CNPJ 21.027.384/0001-06 · SAC: contato@cowboyenergiamasculina.com.br</p>
        <p className="mt-2"><a href={`${SITE}/privacidade`} target="_blank" rel="noopener">Privacidade</a> · <a href={`${SITE}/termos`} target="_blank" rel="noopener">Termos e garantia</a></p>
      </footer>
    </div>
  );
}
