# Revisão mobile-first — redesign integral da V3

Data: 08/09/2026. Responsabilidade desta frente: preservar o baseline, fixar o contrato de regressão e executar uma rodada única de QA após a implementação. O frontend pertence à frente de implementação; esta revisão não altera HTML, CSS ou JavaScript da página.

## Estado

- Baseline móvel anterior ao redesign: **capturado**.
- Contrato comercial: **documentado abaixo**.
- Roteiro pós-implementação: **executado na versão final baseada na referência histórica**.
- Primeira montagem do redesign: **rejeitada pelo proprietário antes da rodada em lote**.
- Rodada final 320/390/430 + smoke desktop: **aprovada para a versão refinada**.

A montagem rejeitada não foi submetida à rodada em lote. Após a adoção da referência histórica, `.local/qa-mobile-redesign.cjs` foi executado contra a versão final e gerou `.local/revisao-mobile-redesign/round-1/results.json` e capturas full page em 320, 390, 430 e 1440 px.

A rodada confirmou largura exata do documento, ausência de elementos fora da viewport, sobreposição na fórmula, imagens deformadas ou descarregadas, violações axe, erros de console/página e respostas locais com erro. Inter e Oswald locais carregaram; a galeria alternou corretamente suas três imagens; os dois vídeos reproduziram; havia um único formulário e um único CTA de checkout no bloco final; kits 1/2/4, totais, máscara de CEP, frete indisponível e allowlist de atribuição passaram. A V3 não solicitou recursos 360 ou Three.js. O navegador solicitou os endpoints dos vídeos com `preload="metadata"`; a rodada comprovou reprodução, mas não mediu volume transferido na carga inicial.

O primeiro passe encontrou links com área interativa inferior a 44 px. Após a correção concentrada, `.local/qa-mobile-targets-retest.cjs` gerou `.local/revisao-mobile-redesign/round-1/targets-retest.json`: todos os alvos medidos na V3 e na prévia ficaram com pelo menos 44 px, sem regressão de largura em 320/390/430, sem elementos fora da tela e com foco visível de 3 px. Os alertas automáticos de `clippedText` foram descartados como falsos positivos de métrica de linha: os retângulos permaneciam dentro da viewport e a inspeção visual independente não encontrou corte.

## Baseline preservado

Captura realizada em Google Chrome headless, contexto isolado, viewport 390 × 844, contra a V3 local anterior ao redesign:

- `.local/revisao-mobile-redesign/baseline-390-viewport.png` — primeira dobra;
- `.local/revisao-mobile-redesign/baseline-390-full.png` — página inteira;
- `.local/revisao-mobile-redesign/baseline-390.json` — geometria, controles, links, vídeos, rede e erros;
- `.local/capture-mobile-redesign-baseline.cjs` — captura reproduzível.

O baseline tinha `scrollWidth=390`, `scrollHeight=9673`, nove controles de formulário/botões, dois vídeos e zero erros de página ou console. A primeira dobra usava cabeçalho preto/dourado, título serifado grande e foto do frasco abaixo do texto. A versão ainda solicitava dois recursos do viewer 360, que deverão desaparecer no redesign.

Os dois vídeos reais ocupavam 350 × 621/622 px no viewport de 390 px, com `controls`, `playsinline`, `preload="none"`, poster próprio e trilha VTT. O único botão que continuava ao pagamento estava no bloco final de oferta.

## Contrato comercial que o redesign deve preservar

### DOM e campos

| Elemento | Contrato |
|---|---|
| Formulário | `form[data-v3-checkout-form]`, `action="/api/checkout"`, `method="get"` |
| Kits | três radios `name="quantity"`, valores exatos `1`, `2`, `4`; kit 2 selecionado inicialmente |
| CEP | `[data-v3-postal-code]`, `name="postalCode"`, `inputmode="numeric"`, `autocomplete="postal-code"`, `maxlength="9"` |
| Frete | `[data-v3-shipping-button]`, `[data-v3-shipping-status]`, `[data-v3-shipping-results]` |
| Resumo | `[data-v3-selected-kit]`, `[data-v3-order-summary]` |
| Checkout | `[data-v3-checkout-button]`, `[data-v3-checkout-status]`, `[data-v3-support-link]` |

Os atributos são o contrato entre o novo HTML e `assets/js/cowboy-v3.js`; classes visuais podem mudar sem quebrar a integração.

### Preços e seleção

| Quantidade | Total | Unitário |
|---:|---:|---:|
| 1 | R$ 54,76 | R$ 54,76 |
| 2 | R$ 84,76 | R$ 42,38 |
| 4 | R$ 169,52 | R$ 42,38 |

Os valores são centavos inteiros em `config/commerce.js`: `5476`, `8476` e `16952`. Selecionar um kit precisa:

1. atualizar o radio e o texto do kit selecionado;
2. recalcular produtos e valor unitário;
3. invalidar cotação de frete anterior, limpar opções e total com frete;
4. abortar resposta de frete em curso para que resultado antigo não sobrescreva o novo kit.

### APIs e eventos

- Ao carregar, `GET /api/config` fornece `currency`, variantes 1/2/4 com disponibilidade de checkout e `shippingAvailable`.
- Se `shippingAvailable=false`, o botão de frete fica desabilitado e o texto deve explicar que a consulta está indisponível e que o valor de entrega será informado antes do pagamento.
- Digitar CEP remove caracteres não numéricos, aplica a máscara `00000-000` e invalida cotação anterior.
- Consultar frete exige oito dígitos e envia `POST /api/frete` com JSON `{ postalCode, quantity }`.
- Resposta válida lista serviço, prazo quando presente, produto + frete e total. Resposta vazia/erro mantém mensagem compreensível.
- O submit final usa `GET /api/checkout?quantity=...`. Se a variante não tiver checkout configurado, o JavaScript impede a navegação, informa indisponibilidade e revela atendimento.
- Atribuição permitida é limitada a 256 caracteres por valor e apenas às chaves `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `src`, `sck`, `cid`, `gclid`, `fbclid`.

A página não deve criar outro fluxo de pagamento. Links editoriais podem navegar entre seções; somente o bloco final contém seleção de kits, CEP e ação para continuar ao pagamento.

## Evidência regulatória limitada para copy

A [IN 28/2018, Anexos III, IV e V](https://bvs.saude.gov.br/bvs/saudelegis/anvisa/2018/int0028_26_07_2018.pdf) lista, para suplementos, alegações atribuídas aos nutrientes e limites por grupo populacional. Para vitamina B6, há textos como “auxilia no metabolismo energético” e “auxilia no funcionamento do sistema imune”. Para zinco, também há “auxilia no funcionamento do sistema imune”, além de funções em metabolismo/síntese de proteínas, divisão celular, ossos, visão e manutenção de cabelo, pele e unhas.

Para ≥19 anos, a tabela da IN traz mínimo/máximo de 0,26/98,60 mg para vitamina B6 e 1,65/29,59 mg para zinco na recomendação diária. As quantidades declaradas no rótulo desta página, 3 mg de B6 e 1,7 mg de zinco por porção, ficam entre esses valores **se a porção corresponde à recomendação diária aplicável**.

A própria Anvisa orienta consultar no painel vigente as quantidades, população, alegações e condições de uso: [lista oficial de ingredientes autorizados](https://www.gov.br/anvisa/pt-br/assuntos/alimentos/suplementos-alimentares/consulte-a-lista-de-ingredientes-autorizados). A copy deve atribuir a função ao nutriente, manter o verbo autorizado e evitar inferir eficácia da fórmula. Esses dados não sustentam alegação de tratar disfunção erétil, ejaculação precoce, doença, efeito sexual ou superioridade clínica. Antes da publicação, conferir a versão vigente do painel e a regularização específica do produto.

## Roteiro dirigido após o redesign

Executar em uma só rodada, acumulando defeitos para uma única correção. Viewports móveis: 320 × 800, 390 × 844 e 430 × 932. Smoke desktop: 1440 × 1000.

Na página `cowboy-mobile-preview.html`, conferir os controles 320/390/430 e o link direto para a V3. A medida deve usar `iframe.contentWindow.innerWidth`: selecionar 390 precisa produzir largura interna real de 390 px; borda, padding ou `box-sizing` do invólucro não podem reduzir o documento embutido para 388 px.

### Estrutura e leitura

- `documentElement.scrollWidth <= innerWidth` em todos os quatro tamanhos.
- Nenhum título, parágrafo, tabela, imagem, vídeo ou formulário ultrapassa o viewport.
- Título principal e argumentos continuam legíveis em 320 px, sem palavras cortadas, sobreposição ou fonte reduzida a ponto de prejudicar leitura.
- Produto permanece reconhecível na primeira dobra e seu enquadramento não corta embalagem de forma acidental.
- Texto de argumento, explicação de fórmula e advertências possuem contraste e espaçamento suficientes.
- Ordem de headings, landmarks, nomes acessíveis e foco visível permanecem coerentes.
- Todo alvo interativo visível mede ao menos 44 × 44 CSS px, incluindo navegação, cards de kit, CEP, frete, vídeo e checkout.

### Conteúdo real e mídia

- Os dois vídeos reais continuam visíveis, com poster, controles, `playsinline`, fonte MP4 e VTT; nenhum autoplay com áudio.
- Posters e vídeos respondem sem erro quando solicitados; `preload="none"` ou comportamento equivalente evita baixar os dois MP4 na carga inicial.
- Não existe controle, texto ou placeholder de 360.
- A rede da V3 não solicita `manifest.json`, `frame-*.webp`, Three.js, `cowboy-v3-3d` ou `cowboy-360-real`.
- Não existem import, script ou CSS mortos do viewer removido na V3 ou no build destinado a ela.

### Compra somente no final

- Há exatamente um `form[data-v3-checkout-form]` e um `[data-v3-checkout-button]`, ambos no último bloco comercial antes do footer.
- Antes desse bloco, não há botão/link de comprar, checkout, preço ou formulário comercial.
- Os únicos radios de `quantity` têm valores 1/2/4 e o padrão é 2.
- Selecionar 1/2/4 produz exatamente os totais e unitários da tabela do contrato.
- O resumo nunca reaproveita frete de kit/CEP anterior.
- O submit inclui a quantidade selecionada e somente os parâmetros de atribuição permitidos.

### Frete indisponível

Interceptar `GET /api/config` com variantes disponíveis e `shippingAvailable:false`:

- botão de frete desabilitado;
- mensagem de indisponibilidade visível e anunciável;
- digitar CEP ou trocar kit não reabilita o botão;
- checkout final do kit permanece funcional conforme `checkoutAvailable`;
- nenhuma chamada a `/api/frete` ocorre.

Executar um smoke adicional com config indisponível para confirmar que a página mantém formulário e mensagem de contingência sem exceção JavaScript.

### Qualidade técnica

- Zero `pageerror`, erro de console inesperado e resposta local 4xx/5xx para assets próprios.
- Verificação automatizada de acessibilidade com axe, complementada por foco via teclado e contraste dos estados normal, hover, focus, disabled e erro.
- Capturas full page nos três viewports móveis e primeira dobra no desktop.
- `npm.cmd run lint`, `npm.cmd run check:build` e `git diff --check` passam.

## Critério de encerramento

O redesign passa quando todos os itens dirigidos forem comprovados ou as falhas forem consolidadas em uma lista única para correção e reteste. O baseline antigo permanece como evidência histórica; não é uma meta estética para a nova página.

## Registro da montagem rejeitada

A inspeção estática, encerrada assim que a direção foi rejeitada, observou:

- a V3 proposta já não continha referência ao viewer 360 ou Three.js no próprio HTML;
- o hero usava `object-fit: contain`, uma escolha compatível com preservar ponta e base, porém não houve aceite visual;
- a fórmula permanecia em duas colunas no CSS mobile; a colisão em 320 px seria medida na rodada, que não chegou a executar;
- o JavaScript aplicava `disabled` e a classe `.is-unavailable`, mas o CSS lido não possuía regra `:disabled` ou `.is-unavailable`; o cursor global de botões permanecia `pointer` e o hover de frete continuava definido;
- a prévia declarava dispositivo de 390 px com borda de 1 px e `box-sizing: border-box`, portanto a largura interna deveria ser medida; essa medição não foi executada.

Esses pontos são observações do candidato rejeitado e não constituem aprovação, reprovação completa nem lista de correção para uma versão futura.
