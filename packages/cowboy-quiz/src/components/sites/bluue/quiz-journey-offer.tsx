"use client";

/* eslint-disable @next/next/no-img-element -- Local product and customer media are shared with the published offer. */

import { useEffect, useRef } from "react";
import { plans } from "@/components/sites/bluue/quiz-offer-data";
import { QuizSocialProof } from "@/components/sites/bluue/quiz-social-proof";
import type { KitQuantity } from "@/components/sites/bluue/data";
import { checkoutHref, readAttribution } from "@/components/sites/bluue/checkout";
import { handleCheckoutClick } from "@/lib/checkout-navigation";
import { trackContentLink, trackJourneyAction, trackKitSelection, trackOfferView } from "@/lib/quiz-tracking";
import styles from "@/components/sites/bluue/quiz-journey.module.css";

interface QuizJourneyOfferProps {
  impactLabel: string;
  selectedPlan: KitQuantity;
  onSelectPlan: (quantity: KitQuantity) => void;
  variant?: "v4-jornada" | "v5-etapas";
}
const ASSETS = "/sites/cowboy/";
const INGREDIENTS = ["Taurina", "Arginina", "Feno-grego", "Vitamina B6", "Zinco", "Boro"] as const;

export function QuizJourneyOffer({ impactLabel, selectedPlan, onSelectPlan, variant = "v4-jornada" }: QuizJourneyOfferProps) {
  const kitsRef = useRef<HTMLDivElement>(null);
  const plan = plans.find(item => item.quantity === selectedPlan) ?? plans[0];
  const viewKits = () => {
    trackJourneyAction("offer_view_kits", "offer");
    kitsRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    kitsRef.current?.focus({ preventScroll: true });
  };
  useEffect(() => {
    const kits = kitsRef.current;
    if (!kits || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.25)) {
        trackOfferView(selectedPlan, variant);
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    observer.observe(kits);
    return () => observer.disconnect();
  }, [selectedPlan, variant]);

  return (
    <section className={styles.offer} data-journey-screen="offer">
      <p className={styles.redline}>Você relatou este impacto na sua confiança: <strong data-journey-impact>{impactLabel}</strong>.</p>
      <div className={styles.offerHero}>
        <div>
          <h1 id="journey-title" tabIndex={-1} data-journey-title>Teste o COWBOY por 30 dias. Decida pela sua experiência.</h1>
          <p>Suplemento alimentar em gotas, 30 mL. Conheça a composição, compare os kits e escolha com calma.</p>
          <p className={styles.note}>Garantia comercial de 30 dias a partir do recebimento, conforme as condições abaixo. Este produto não é um medicamento.</p>
          <a className={styles.textLink} href="/termos" target="_blank" rel="noopener noreferrer" onClick={() => trackContentLink("terms", "offer")}>Ler condições da garantia</a>
          <button type="button" className={styles.primary} data-offer-view-kits aria-controls="journey-kits" onClick={viewKits}>Ver kits e valores</button>
        </div>
        <img src={`${ASSETS}kit-3.webp`} alt="Três frascos COWBOY Energia" width={600} height={600} />
      </div>

      <section className={styles.composition} aria-labelledby="journey-composition">
        <h2 id="journey-composition">O que está no rótulo</h2>
        <ul>{INGREDIENTS.map(name => <li key={name}>{name}</li>)}</ul>
        <p>Siga as orientações da embalagem. Se usa medicamentos ou tem dúvidas sobre o consumo, converse com o profissional que acompanha você.</p>
      </section>

      {variant === "v4-jornada" && <QuizSocialProof />}

      <section className={styles.purchase} aria-labelledby="journey-kits-title">
        <h2 id="journey-kits-title">Escolha seu kit</h2>
        <p>Compare quantidades e valores. A escolha é sua.</p>
        <div ref={kitsRef} id="journey-kits" tabIndex={-1} className={styles.kits} role="group" aria-label="Kits disponíveis" data-journey-kits>
          {plans.map(item => <button type="button" key={item.quantity} aria-pressed={selectedPlan === item.quantity} className={styles.kit} onClick={() => {
            if (selectedPlan !== item.quantity) trackKitSelection(item.quantity, variant);
            onSelectPlan(item.quantity);
          }}>
            <img src={`${ASSETS}${item.image}`} alt="" width={140} height={140} loading="lazy" />
            <span className={styles.kitInfo}><strong>{item.label}</strong><span>{item.quantity === 3 ? "Melhor preço por frasco" : `${item.quantity} ${item.quantity === 1 ? "frasco" : "frascos"} de 30 mL`}</span><b>{item.cashPrice} à vista</b><span>{item.freeShipping ? "Frete grátis" : "Frete R$ 26,75"}</span></span>
            <span className={styles.selectedMark} aria-hidden="true">{selectedPlan === item.quantity ? "✓" : ""}</span>
          </button>)}
        </div>
        <div className={styles.price} aria-live="polite">
          <p>12x de <strong>{plan.installment}</strong></p>
          <p>Ou {plan.cashPrice} à vista{plan.freeShipping ? " · frete grátis" : " + frete de R$ 26,75"}</p>
          <small>{plan.freeShipping ? `No cartão, com juros. Total ${plan.installmentTotal}.` : `No cartão, com juros. Total do produto ${plan.installmentTotal}. Com frete: 12x de R$ 11,54 ou R$ 106,65 à vista.`}</small>
        </div>
        <p className={styles.trust} data-checkout-trust>{plan.freeShipping ? "Frete grátis" : "Frete R$ 26,75"} · Envio discreto · Garantia comercial de 30 dias</p>
        <a href={checkoutHref(plan.quantity, "", readAttribution())} onClick={event => handleCheckoutClick(event, plan.quantity, variant)} className={`${styles.primary} bluue-finish-button`} data-journey-checkout>Continuar com {plan.label}</a>
        <p className={styles.nextNote}>Checkout seguro Appmax. Sem assinatura ou cobrança recorrente.</p>
      </section>

      <section className={styles.guarantee} aria-labelledby="journey-guarantee">
        <h2 id="journey-guarantee">30 dias para decidir</h2>
        <p>O prazo começa no recebimento. Do 1º ao 10º dia, solicite o reembolso sem justificativa. Do 11º ao 30º dia, entre em contato com o SAC para seguir as condições da garantia.</p>
        <p>A garantia cobre o valor dos produtos. Fretes não estão incluídos.</p>
        <a href="/termos" target="_blank" rel="noopener noreferrer" onClick={() => trackContentLink("terms", "offer")}>Consultar termos e garantia</a>
      </section>
      <section className={styles.faq} aria-labelledby="journey-faq">
        <h2 id="journey-faq">Antes de escolher</h2>
        <details><summary>Como usar?</summary><p>Siga as orientações de consumo e as advertências da embalagem. O produto é um suplemento alimentar para adultos, não um medicamento.</p></details>
        <details><summary>Uso medicamentos. Posso consumir?</summary><p>Leve a composição ao profissional que acompanha você antes de iniciar o consumo. Não suspenda nem troque seu tratamento por conta própria.</p></details>
        <details><summary>Como é o envio?</summary><p>Caixa fechada, sem o nome do produto do lado de fora. Frete grátis nos kits de 2 ou 3 frascos. Para 1 frasco, frete de R$ 26,75, somado antes do pagamento.</p></details>
        <details><summary>Posso parcelar?</summary><p>Cartão em até 12x com juros ou Pix no checkout Appmax. Confira o total antes de confirmar.</p></details>
      </section>
      <footer className={styles.footer}>
        <p>COWBOY Energia · Suplemento alimentar em gotas, 30 mL. Este produto não é um medicamento.</p>
        <p>Fabricado por BNT Farma, CNPJ 21.027.384/0001-06 · SAC: contato@cowboyenergiamasculina.com.br</p>
        <p><a href="/privacidade" target="_blank" rel="noopener noreferrer" onClick={() => trackContentLink("privacy", "offer")}>Privacidade</a> · <a href="/termos" target="_blank" rel="noopener noreferrer" onClick={() => trackContentLink("terms", "offer")}>Termos e garantia</a></p>
      </footer>
    </section>
  );
}
