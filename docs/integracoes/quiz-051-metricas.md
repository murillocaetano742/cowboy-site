# QUIZ-051 — Métricas e leitura do funil COWBOY

## Escopo e estado da evidência

Esta entrega completa a medição técnica do funil, preservando conteúdo, preços, checkout e a reprodução integral exigida na v5 desde a QUIZ-050. A análise é agregada: não identifica quem respondeu, não segmenta pessoas por condição de saúde e não recupera respostas. Ausência de evento pode decorrer de bloqueadores, preferência de privacidade, encerramento abrupto ou falha de entrega; não equivale automaticamente a abandono voluntário.

GA4: propriedade `553376813`, medição `G-VYR2542XCN`. A variante principal usa `quiz_id=cowboy_v5_etapas`, capa `/quiz/v5-etapas/` e questionário `/quiz/v5-etapas/quiz/`. As versões anteriores conservam seus identificadores e contratos. O histórico de modificações da v5 compartilha o mesmo `quiz_id`; comparar períodos respeitando as datas de implantação. O bloqueio integral do vídeo foi publicado em 14/10/2026, merge às 15:49:06 UTC, conforme a story 050.

**Estado deste documento:** implementação validada em 36 casos E2E, além dos 121 testes dos gates; configuração GA4 confirmada pelo root. Publicação e smoke público ainda pendentes. Configuração de dimensão e emissão local não são prova de recebimento dos novos eventos.

## O que já existe

| Momento | Evento/condição | Interpretação correta |
|---|---|---|
| Capa e entrada do quiz | `page_view`, `landing_view`; `page_kind=cover|quiz` | Abertura do documento; separar acesso direto ao quiz da passagem pela capa |
| Seções e CTAs da capa | `quiz_cover_section_view` a 25%; `quiz_cover_cta` | Exposição do bloco e clique, deduplicados por seção/posição/documento |
| Etapas 1–21 | `quiz_step_view` com `step_index` | Primeira chegada por ordinal/documento; não multiplicar pelo número de outros eventos da tela |
| Perguntas | `quiz_start`, `quiz_answer` | Início na primeira resposta; somente 14 ordinais de resposta, nunca seu conteúdo |
| Voltar/revisitar | `quiz_back`, `quiz_step_revisit` | Navegação nas perguntas e novas visitas, separadas da primeira chegada |
| Etapa 18 | `quiz_complete`; `quiz_result_view` a 25% do bloco real | Questionário concluído e resultado efetivamente exposto são marcos diferentes |
| Etapas 18–21 | `page_view`, `quiz_journey_view`, `quiz_journey_action` | Trocas reais de tela e ações fixas; `page_view` inclui revisitas legítimas |
| VSL 19 | `vsl_visible`, `vsl_start`, `vsl_progress`, `vsl_complete` | Visibilidade, reprodução e cobertura 25/50/75/100%; autoplay não prova intenção nem atenção |
| Áudio/pausa | `vsl_unmute`, `vsl_mute`, `vsl_pause` | Mudanças repetidas com `interaction_count`; pausa também pode ser programática ao sair da tela |
| Falhas VSL | `vsl_error`, `vsl_autoplay_blocked` | Primeira ocorrência de cada tipo por documento, sem recorrência/duração no contrato anterior |
| Depoimentos 20 | `quiz_testimonials_view` a 25% do bloco de vídeos | Exposição; não significa que os vídeos dos clientes foram reproduzidos |
| Oferta 21 | `view_item` quando kits chegam a 25% de visibilidade | Impressão comercial real, diferente de apenas entrar na tela |
| Kits/checkout | `select_item`, `begin_checkout` | Troca de kit e clique de saída, uma vez por kit/documento; kit padrão não exige troca |
| Fontes/termos | `quiz_content_link` com IDs fixos | Nenhum texto médico, pergunta ou resposta no evento manual |

Os ordinais que admitem resposta são 1, 2, 3, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15 e 16. As etapas 4 e 10 são conteúdo, 17 é processamento, 18 é resultado, 19 é VSL, 20 é depoimentos e 21 é oferta. Esses nomes servem à leitura do relatório; o transporte usa ordinais e enumerações técnicas, não perguntas.

Na v5 atual, `vsl_complete` só é chamado após término nativo confiável e cobertura contínua integral, com tolerância total fixa de 0,1 segundo. Não transportar a regra histórica da QUIZ-048, que permitia liberação da interface por seek/erro, para a produção 050. As versões anteriores mantêm o contrato legado.

## Relatório e denominadores

Filtrar variante, período, dispositivo e origem/mídia/campanha. Excluir ou separar campanhas de QA conhecidas. Trabalhar com sessões ou usuários distintos, mantendo a mesma unidade em numerador e denominador. Não dividir contagens brutas de eventos: reload cria novo documento e reinicia a deduplicação local; uma sessão pode conter revisitas e mais de uma tentativa.

| Visão | Colunas/etapas | Cálculo e cuidado |
|---|---|---|
| Entrada | Capa → clique CTA → etapa 1 → primeira resposta | Relatar separadamente visitantes que iniciaram diretamente no quiz |
| Tabela 1–21 | Chegadas, avanço posterior à etapa seguinte, taxa de avanço, não avanço, revisitas, tempo ativo quando disponível | Taxa = sessões que chegaram a i e depois a i+1 / sessões que chegaram a i, na janela definida |
| Resultado/VSL |18 → resultado exposto →19 → visível → reprodução → áudio → cobertura →20 | Retenção por cobertura sobre inícios e sobre chegadas ? etapa 19; áudio é uma segmentação técnica, não resposta pessoal |
| Oferta |20 → depoimentos expostos →21 → kits expostos → checkout por kit | Entrada na oferta e impressão dos kits são diferentes; não somar `select_item` para contar compradores |
| Compra | Checkout → pedido realmente aprovado → receita aprovada | Depende de homologação no provedor, valor/moeda e identificador transacional deduplicado; clique não é compra |

“Não avançou” significa ausência de próxima etapa observada na janela; visitantes ainda ativos e eventos em processamento não devem ser classificados como abandono definitivo. A última etapa observada é uma estimativa de saída, não um evento de confirmação do fechamento. O tempo entre timestamps brutos inclui aba oculta/pausa e não substitui medição explícita de tempo ativo.

## Lacunas confirmadas e contrato adicional

A auditoria identificou ausência de tempo ativo por ordinal, checkpoint técnico de saída da VSL, buffering e recuperação após erro. O contrato adicional aprovado é exclusivo da v5:

| Evento | Campos adicionais | Semântica |
|---|---|---|
| `quiz_step_engagement` | `step_index`, `page_kind`, `active_time_ms`, `flush_reason` | Delta de tempo visível com foco; capa usa ordinal 0, questionário/jornada usam 1–21 |
| `vsl_retention` | `video_id=cowboy_vsl`, `video_percent` | Decis 10, 20, …, 90 calculados por cobertura real `played`, uma vez por marco/documento |
| `vsl_watch_checkpoint` | `video_id`, `position_bucket`, `video_percent`, `watched_time_ms`, `buffer_time_ms`, `checkpoint_reason`; `pause_reason` quando aplicável | Posição em faixas de 10 segundos; cobertura em faixas de 10%; deltas de reprodução e espera em primeiro plano |

Tempo ativo exige `document.visibilityState=visible` e `document.hasFocus()`. A amostra ocorre a cada segundo e o heartbeat a cada 30 segundos. Lacunas desconhecidas acima de 5 segundos são descartadas, não convertidas em atenção presumida. Os motivos de flush são `heartbeat`, `transition`, `hidden`, `blur` e `pagehide`; ocultar e descarregar sem saldo novo não duplica tempo.

Checkpoint VSL usa `heartbeat`, `pause`, `hidden`, `blur`, `pagehide`, `transition`, `completed`, `error`, `retry` ou `recovered`. Pausas distinguem `manual`, `viewport`, `lifecycle`, `completed` e `unknown`. `watched_time_ms` é tempo de reprodução em primeiro plano, não substitui a cobertura `played` nem o gate 050. `buffer_time_ms` acumula espera entre play/playing ou waiting/playing em primeiro plano; não presumir que toda espera foi causada pela rede. Esses campos são deltas aditivos; não somar máximos de posição como tempo assistido.

`recovered` também pode representar o primeiro início após a espera inicial, ou a retomada após pausa. Portanto, sua contagem isolada não é “número de falhas recuperadas”: para essa leitura, exigir uma falha anterior na mesma sequência. O heartbeat e os checkpoints fazem entrega de melhor esforço; encerramento do processo do navegador pode perder o último intervalo. O relatório deve chamar `position_bucket` de última faixa observada, não de segundo exato de abandono.

Quartis e conclusão anteriores permanecem. Não somar `vsl_progress` e `vsl_retention` para contar pessoas: são duas granularidades da mesma reprodução. A proposta de métrica separada de latência até primeiro frame só deve entrar no relatório se efetivamente implementada e validada; `buffer_time_ms` não afirma qual frame o usuário viu.

Não usar um ID próprio de pessoa/tentativa, respostas, intensidade, gravidade, idade, peso, condição médica, texto de perguntas, mensagens livres de erro ou session replay. Não acrescentar um emissor de Purchase ao quiz.

## Eventos automáticos e privacidade

A inspeção do SDK Google real na QA 050 encontrou `click` automático com `link_url` completo das referências Anvisa, DailyMed e Nature, além do evento manual neutro. Também encontrou `scroll` a 90% na tela curta inicial do SPA: isso não mede oferta vista. Esses payloads foram interceptados localmente; o teste não os enviou ao fornecedor.

O evento automático não continha resposta pessoal, mas expunha qual referência médica foi clicada e escapava da allowlist manual. Em 14/10, o root salvou e reabriu a configuração GA4, confirmando desativação de cliques de saída, busca no site, interações com formulários, downloads e page views por histórico. Scroll e medição automática YouTube permaneceram ativos por se tratar de configuração compartilhada com o restante do site; não usá-los como métricas específicas do quiz. Eventos manuais e linker foram preservados. Na QA 051, o SDK público atualizado executou o percurso real, com todos os coletores interceptados: os payloads não continham eventos automáticos de click/form/download/search, `link_url`, `link_classes`, `link_text`, URLs das três referências médicas, respostas nem dados pessoais. O redirect comercial preservou atribuição e linker.

Na mesma sessão, o root desativou e confirmou a opção “Detectar automaticamente dados enviados pelo usuário”. A permissão geral existente foi preservada; seletores manuais não foram ativados e o quiz não envia esses dados. O SDK público atualizado, guardado apenas para QA em `.local/quiz-051-evidence/gtag.js`, confirmou `isAutoEnabled=false`, `isManualEnabled=false` e módulos de medição aprimorada apenas de scroll/vídeo. SHA256: `4c8710b27c3ee8776db86991256fb821db5bc7b9066a286e692ae78fc91ab30f`. Isso confirma a configuração distribuída; o teste dos requests verifica separadamente seu comportamento.

GPC e opt-out definidos antes da carga impedem scripts e eventos. Se a preferência surgir depois, a instrumentação manual deve parar; não presumir remoção retroativa de fornecedores já carregados. As URLs usam allowlist de atribuição, com remoção de parâmetros arbitrários/fragmentos. Campanhas permitidas também não devem conter PII ou respostas. `_gl` é decorado no clique e preservado no redirect, sem fabricação/cache.

## Recebimento confirmado e limites externos

| Data/evidência | Confirmado | Não comprova |
|---|---|---|
| 06/10/2026, publicação 037, painel GA4 e tráfego real de QA | 17 `quiz_step_view`, 1 start/complete/view_item/select_item/begin_checkout e 2 page_views; `quiz_id=cowboy_v1_direto` no detalhe de checkout; continuidade de client/session IDs entre quiz e Appmax | Purchase ou desempenho orgânico; nenhum pedido/pagamento foi criado |
| 13/10/2026, publicação 040, Realtime GA4 | 2 page_views, 2 landing_views, 2 exposições de capa, 1 CTA e 1 step_view | Eventos posteriores, VSL e Purchase nessa visita |
| 14/10/2026, leitura autenticada atual informada pelo root | 8 step_views e 6 answers recebidos no Realtime | Atribuir a uma coorte orgânica específica, concluir todo o funil ou compra |
| QA 050 local e produção, coleta isolada | 34 regressões, controles/layout e original de 276,340998 segundos em 1x com cobertura contínua/término nativo; emissão dos marcos e navegação comercial | Processamento desses eventos de teste pelo GA4/Meta, pois os coletores foram interceptados |

A primeira linha reconcilia a versão final local de `quiz-037-release/docs/integracoes/quiz-037-tracking.md`. O documento 037 herdado nesta branch conservava uma conclusão anterior de recebimento pendente; essa conclusão foi superada pela homologação oficial descrita acima. Não registrar os valores dos identificadores client/session.

A integração documentada Appmax → UTMify preserva Purchase somente para vendas aprovadas. Ainda falta associar uma compra real aprovada ao recebimento e à deduplicação nos destinos; não enviar compra fictícia, reprocessar pedido antigo ou criar segunda origem. GA4 do checkout foi comprovado no percurso 037, mas isso não homologa o evento `purchase`.

Meta: a evidência histórica de 13/10 registrou categoria “Conteúdo inadequado”, análise rejeitada e fonte bloqueada, com diagnóstico adicional CAPI. Em 14/10/2026, às 17:16:18 UTC, o DevOps revalidou somente por GET da configuração pública do SDK 2.9.419: `prohibitedPixels.lockWebpage=true`, `blockReason=source_category`. A evidência sanitizada está em `.local/quiz-051-meta-public-config.json` no workspace original. Não executou coleta, não contornou a restrição e não tratou `fbq` local como recebimento.

## Definições GA4 e modelo de campanha

O root confirmou cinco dimensões adicionais de escopo Evento: `flush_reason`, `checkpoint_reason`, `pause_reason`, `video_percent` e `position_bucket`; e três métricas de escopo Evento com unidade milissegundos: `active_time_ms`, `watched_time_ms` e `buffer_time_ms`. Permaneceram as oito dimensões anteriores: `step_index`, `quiz_id`, `page_kind`, `percent`, `cta_location`, `section_id`, `link_id` e `link_location`. Definições novas não tornam dados anteriores retroativamente disponíveis.

Exploração criada: [COWBOY V5 — Funil e retenção](https://analytics.google.com/analytics/web/#/analysis/a407379979p553376813/edit/Ef8ngljEQ6eX_P4KPfpO0w). No fechamento técnico da QA, a configuração das abas ainda estava em conclusão pelo root. O plano efetivo contém: **Conversão até checkout**, funil fechado de seis marcos (`quiz_start`, `quiz_result_view`, `vsl_start`, `vsl_complete`, `view_item`, `begin_checkout`), filtrado pela v5, com usuários ativos por dispositivo e tempo entre marcos; **Etapas — alcance e tempo**, linhas por `step_index`, colunas de eventos step_view/engagement/revisit, usuários ativos e tempo ativo; e uma aba de retenção VSL em preparação. Não apresentar essas abas como já populadas com novos eventos nem converter usuários ativos em contagem de pessoas identificadas. A matriz de chegadas à etapa 1 e à capa deve ser analisada separadamente, pois o funil fechado começa na primeira resposta.

Modelo proposto para o campo de parâmetros de URL do Meta Ads, usando somente nomes já permitidos pelo quiz e pelo redirect:

```text
utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_id={{campaign.id}}&utm_term={{adset.name}}__{{adset.id}}&utm_content={{ad.name}}__{{ad.id}}
```

Usar nomes de campanha/conjunto/anúncio neutros e curtos, como códigos da versão/criativo, sem dados de pessoas, respostas ou classificações clínicas. Cada valor aceito tem limite de 256 caracteres. Uma alternativa que evita transportar nomes é `utm_campaign=quiz_v5`, `utm_id={{campaign.id}}`, `utm_term={{adset.id}}` e `utm_content={{ad.id}}`, mantendo source/medium do modelo. Não reutilizar `cid` para inventar identidade de cliente nem acrescentar campos de saúde.

Este é um modelo para revisão, não uma alteração de anúncios. Conferir a expansão dos parâmetros na prévia do anúncio antes de aplicar, preservando a rota canônica escolhida e evitando chaves duplicadas. A [referência oficial Meta de parâmetros dinâmicos](https://www.facebook.com/business/help/2360940870872492) redirecionou a login na consulta pública desta auditoria; não se declara homologação atual da expansão de macros. O teste local pode validar a preservação de valores já expandidos, não a substituição feita pela plataforma.

## QA e configuração efetiva 051

Em 14/10/2026, o artefato final local passou pelos 36 casos E2E: 34 regressões e dois casos novos de métricas. A primeira rodada teve 35 aprovações e uma leitura prematura do teste imediatamente após clicar em Pausar. O evento nativo `pause` é enfileirado; o teste passou após aguardar seu checkpoint, sem alteração no produto. O reteste isolado aprovou o caso restante.

Foram comprovados deltas de tempo por capa/etapa, transições e revisitas; ausência de duplicação em hidden/pagehide; descarte de intervalo desconhecido; suspensão por perda de foco e opt-out; buffering inicial controlado, pausa manual e saída da tela; decis de cobertura reais, conclusão única e gate integral preservado. Os testes de GPC/opt-out, fontes externas com URLs exatas, privacidade, três kits, callbacks e linker continuaram aprovados. V1–V4 passaram nas respectivas regressões. A validação não criou pedidos nem enviou hits aos fornecedores.

As regressões de vídeo usaram o MP4 real de 12 segundos selecionado explicitamente por `E2E_VSL_FIXTURE`; não falsificaram `ended` ou `played` para concluir o percurso. Os casos adversariais continuam verificando que eventos artificiais, saltos e alterações de taxa não liberam a etapa. A reprodução integral do original de 276,340998 segundos, local e pública, permanece comprovada na QA 050; sua lógica não mudou nesta entrega e não foi repetida desnecessariamente.

Evidências locais ignoradas pelo Git: `test-results/quiz-051-controls/**/engagement-deltas.json`, `test-results/quiz-051-controls/**/jornada-linker-isolado.json` e `test-results/quiz-051-video-recheck/**/vsl-telemetria-real.json`. O SDK atualizado está em `.local/quiz-051-evidence/gtag.js`; a fixture curta e seu comando de geração estão documentados na QUIZ-050. Invocação usada, em PowerShell na raiz da worktree:

```powershell
$env:E2E_BASE='http://127.0.0.1:4419'
$env:E2E_VSL_FIXTURE=(Resolve-Path '.local/quiz-050-fixtures/control-12s.mp4').Path
$env:GOOGLE_TAG_FIXTURE=(Resolve-Path '.local/quiz-051-evidence/gtag.js').Path
$env:UTM_TAG_FIXTURE='C:/Users/User/Downloads/VS_CODE/.local/quiz-037-evidence/utms.js'
npx playwright test tests/e2e/cowboy-quiz-steps.spec.js tests/e2e/cowboy-quiz-journey.spec.js tests/e2e/cowboy-quiz-editorial.spec.js tests/e2e/cowboy-quiz-vsl.spec.js --grep-invert '@full-vsl' --workers=3 --output=test-results/quiz-051-controls
npx playwright test tests/e2e/cowboy-quiz-steps.spec.js --grep 'vídeo real mede decis' --workers=1 --output=test-results/quiz-051-video-recheck
```

Critério de fechamento: distinguir instrumentado, emitido em teste, recebido pelo fornecedor e compra homologada. Sem transformar lacunas de observação em zero conversões ou certeza sobre o motivo da saída.
