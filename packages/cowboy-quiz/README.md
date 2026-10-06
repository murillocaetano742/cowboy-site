# COWBOY Energia: quiz

Quiz de entrada para o COWBOY Energia (suplemento alimentar em gotas), modelado sobre o quiz da Bluue (`bluue-quiz-codigo.zip`, 05/10/2026). Mantém o mesmo fluxo, telas e animações; mudou só o necessário para o produto. React, TypeScript e Next.js com exportação estática.

## Abrir localmente

Requer Node.js 24 ou superior.

```sh
npm ci
npm run build
npm run preview
```

Abra `http://localhost:3003/quiz/v1-direto/` (a página `/` também abre o quiz).

## O que mudou em relação à Bluue

| Parte | Bluue | COWBOY |
|---|---|---|
| Visual | Azul e branco, Montserrat/Geist | Branco com dourado em todas as telas, Oswald + Manrope, logotipo em texto |
| Faixa etária | 18-29 / 30-39 / 40-49 / 50+ (fotos da Bluue) | Até 39 / 40-49 / 50-59 / 60+ (fotos novas geradas pelo Codex, gpt-6-astra) |
| Tela "89% dos clientes" | Número da Bluue, passa sozinha | 92% dos clientes COWBOY (número informado pelo proprietário em 05/10/2026), com 6 fotos de clientes segurando o frasco e botão Continuar (não passa sozinha) |
| Tela "Seguro / Discreto / Frete grátis" | Depoimentos da Bluue | "Sem receita / Discreto / 30 dias de teste" com imagem gerada: mãos abrindo caixa parda lisa com o frasco real dentro (rótulo colado do PNG verdadeiro) |
| Última pergunta | Relações por mês (doses) | Duas perguntas de dor: "Ela já percebeu?" e "Do que você tem mais medo?" |
| Topo da oferta | "Seu tratamento foi aprovado!" | Resultado: imagem forte, gravidade do caso (moderada / alta / muito alta) calculada pelas respostas, o que pesa no caso dele e o protocolo indicado (sempre 3 frascos) |
| Oferta | Planos ESSENCIAL/CONFIANÇA/PERFORMANCE, assinatura | Kits de 3, 2 e 1 frasco com os preços, parcelas e frete do site; valor por dia em destaque em cada kit; o de 3 vem marcado; sem assinatura |
| Prova social na oferta | Fotos da Bluue | Os 2 vídeos reais de clientes (com legenda) + carrossel de fotos de clientes |
| Botão de compra | Aviso "pagamento não conectado" | Checkout real: `cowboyenergiamasculina.com.br/api/checkout?quantity=N`, levando `utm_*`, `fbclid`, `src` etc. |
| FAQ, garantia, rodapé | Medicamento manipulado, CRM, farmácia | FAQ do site, garantia de 30 dias, fabricante e SAC do rótulo |
| Termo de consentimento | TCLE médico da Bluue | Nota curta sobre o uso das respostas + link da política de privacidade |
| Avaliações "4.8 de 1.285", "+40 mil homens" | Números da Bluue | 4,8 de 1.836 avaliações e +38 mil homens (informados pelo proprietário em 05/10/2026) |

Ficaram iguais: as três perguntas iniciais, preocupação, frequência, régua de peso, sobrepeso, medicação, cirurgia, condições de saúde e todas as animações.

**Sem interrupções:** na Bluue, remédio com nitrato, cirurgia no coração, AVC/infarto recentes, pressão acima de 16 por 9 e arritmia levavam à tela "Vamos parar por aqui?". Como o COWBOY é suplemento vendido sem receita, o proprietário decidiu (05/10/2026) que nada interrompe: essas perguntas de acompanhamento e a tela de parada foram retiradas, e as respostas de saúde (remédio, diabetes, pressão alta, AVC, infarto, arritmia, sobrepeso) passam a somar na gravidade do caso.

## Onde editar

- `src/components/sites/bluue/data.ts`: perguntas, opções e o cálculo da gravidade (`caseResult`: pontos por resposta, faixas e frases do resultado). Até 3 pontos = moderada, 4 a 8 = alta, 9 ou mais = muito alta.
- `src/components/sites/bluue/PreCheckout.tsx`: resultado, kits, preços, parcelas, banners, números de prova social (`RATING`, `REVIEWS`, `CUSTOMERS`), fotos de clientes, FAQ e garantia.
- `src/components/sites/bluue/checkout.ts`: link do checkout e parâmetros repassados.
- `src/components/sites/bluue/SpecialScreens.tsx`: telas animadas, depoimentos e nota de privacidade.
- `src/app/cowboy.css`: cores, fontes e componentes do tema COWBOY (por cima do CSS original preservado em `source.css`).
- `public/sites/cowboy/`: imagens, fontes e `videos/` (depoimentos com capa e legenda, os mesmos do site). Originais das fotos geradas em `docs/criacao/originais/`; os pedidos feitos ao Codex em `docs/criacao/pedido-codex-*.md` (faixa etária, gravidade, sem receita).

Os nomes internos (`sites/bluue`, classes `bluue-*`) foram mantidos para não mexer no que não precisava; nada disso aparece para o visitante.

**Se os preços mudarem no site**, atualize `plans` em `PreCheckout.tsx` (valores à vista, parcela 12x com juros, total parcelado, frete do kit de 1).

## Checkout

O botão leva para `https://cowboyenergiamasculina.com.br/api/checkout?quantity=N` (o mesmo endpoint dos kits do site, que redireciona para a Appmax). Para servir o quiz no mesmo domínio do site, gere com `NEXT_PUBLIC_CHECKOUT_URL=/api/checkout npm run build`.

As respostas ficam só na memória da aba; nada é enviado. O quiz não tem Meta Pixel nem GA4.

## Verificar

```sh
npm run check
```

Roda ESLint, TypeScript, os testes do fluxo (incluindo a gravidade por resposta e o repasse de UTMs) e o build.

## Publicar

`out/` é um site estático. Suba o conteúdo na raiz de uma hospedagem (ou em um projeto Vercel próprio) e acesse por HTTP/HTTPS, preservando as pastas `_next`, `sites` e `quiz`.
