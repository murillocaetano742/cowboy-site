# QUIZ-037 — rastreamento do quiz COWBOY

## Identificadores preservados

- GA4: propriedade `553376813`, medição `G-VYR2542XCN`.
- Meta: Pixel COWBOY `1006075098894986`, empresa `383730844330268`.
- UTMify: grupo existente `6aa16d0bee215350c09b5b31`; compra aprovada pela integração Appmax existente. Não criar uma segunda fonte de Purchase.

## Operações externas observadas nesta sessão (05–06/10/2026)

No GA4, as dimensões de evento **Quiz COWBOY**, parâmetro `quiz_id`, e **Etapa do quiz**, parâmetro `step_index`, foram criadas e confirmadas na listagem (duas dimensões).

No Pixel COWBOY, **Incluir automaticamente informações mais detalhadas de páginas e produtos** e **Correspondência automática de site** foram desativados e os estados Desativado foram conferidos na interface. Esses controles valem para o Pixel inteiro. Os eventos manuais e a integração de conversões por API não foram desativados. **Eventos automáticos** e **Rastrear eventos automaticamente sem código** já estavam desativados.

A sessão UTMify inicialmente expirou e foi solicitado login direto no serviço, sem pedir senha no chat. Posteriormente, a sessão autenticada foi encontrada e a configuração foi relida: webhook **COWBOY — Appmax / Ativado**; Pixel **COWBOY / 6aa16d0bee215350c09b5b31 / Meta / Qualquer / Ativado**, associado ao Pixel Meta `1006075098894986`. Lead e Add To Cart desabilitados; Initiate Checkout habilitado pelo texto **Quero meu teste de 30 dias**; Purchase **Apenas vendas aprovadas / Valor da venda / Qualquer produto**. A leitura foi fechada sem alterações, preservando a emissão de compra existente. Ainda não há comprovação de uma nova compra Appmax nesta sessão.

O painel Appmax também redirecionou ao login, com os campos vazios. Foi solicitado ao proprietário entrar diretamente. Nenhum pagamento foi iniciado.

## Contrato de implementação

GA4: `page_view`, `quiz_start`, `quiz_step_view`, `quiz_complete`, `view_item`, `select_item`, `begin_checkout`. Etapas usam apenas `step_index`, número ordinal, e `quiz_id=cowboy_v1_direto`. Respostas, nomes de perguntas, idade, peso, condições de saúde e gravidade não podem aparecer em eventos, armazenamento de atribuição ou URLs.

Meta: eventos manuais PageView, ViewContent e InitiateCheckout, sem Purchase, Lead ou AddToCart artificiais. Não carregar SDK Pixel UTMify no quiz, pois a inspeção do fornecedor encontrou leitura automática de formulários e botões. A compra continua dependente de pagamento aprovado Appmax e da integração UTMify existente.

E-commerce usa o kit como um item (quantidade 1), com valores em BRL 79.90 / 154.80 / 199.90, sem frete. Preservar parâmetros de campanha permitidos e identificadores Google; `_gl` somente gerado pelo Google no momento da saída, sem fabricação ou cache.

## Evidências e limitações

QA visual local: Playwright passou em 375×812 e 390×844, fluxo completo, três kits e UTMs, sem erros JavaScript, HTTP 4xx de assets ou overflow horizontal. Analytics e navegação de checkout foram bloqueados nesses testes. Esses resultados não comprovam recebimento dos eventos reais.

A versão visual foi publicada como `dpl_GYBbQRMpMp62C9egTaZT57c814Yc` e a URL canônica `/quiz/v1-direto/` foi aberta no navegador com a primeira tela correta. Os três endpoints públicos `/api/checkout?quantity=1|2|3` retornaram 302 para os kits Appmax esperados, preservando `utm_source`, `gbraid` e `wbraid` de QA e descartando parâmetro `email`. Os redirects não foram seguidos; não houve evento de compra ou pedido.

Implementação de tracking: gates locais de lint, TypeScript e 81 testes (52 do site, 13 do fluxo, 16 da instrumentação/navegação) aprovados. Build público com 113 arquivos aprovado. QA navegador confirmou 17 etapas neutras, deduplicação ao voltar e repetir clique, valores dos kits corretos e checkout funcionando com SDK bloqueado. Com GPC ou opt-out GA definidos antes da carga, nenhum script externo ou evento foi carregado.

O SDK Google real, com requisições de coleta interceptadas, gerou `_gl` no clique para o hostname alternativo. A API preservou o valor até o destino Appmax; UTMs e `gbraid` permaneceram corretos. Os payloads inspecionados não continham respostas ou dados de saúde. Isso valida a emissão e o transporte local, sem comprovar recebimento nos painéis.

A saída do checkout aguarda o callback GA4 com timeout de 700 ms e fallback independente de 800 ms. O href decorado é capturado após a propagação do clique, preservando o linker; cliques modificados seguem nativos. Os testes isolados cobrem falha de SDK, callback síncrono/assíncrono, opt-out e repetição. A observação do último batch no descarregamento da página não equivale a recebimento confirmado no GA4; `begin_checkout` recebido permanece sem homologação externa.

O SDK Meta está configurado, mas retorna bloqueio de fonte/categoria e não envia. O [diagnóstico específico](quiz-037-meta-block.md) separa essa restrição externa dos testes de implementação. Nenhuma mudança de pixel, domínio ou categoria foi feita para contornar o bloqueio. A aprovação de publicação não declara recebimento Meta nem Purchase.

Fontes primárias: [GA4 e-commerce](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce), [linker Google](https://developers.google.com/tag-platform/devguides/cross-domain), [eventos automáticos GA4](https://support.google.com/analytics/answer/9216061).
