# QUIZ-046 — Jornada paralela e medição

## Escopo

Variante `v4-jornada`, identificada por `quiz_id=cowboy_v4_jornada`, com capa em `/quiz/v4-jornada/` e questionário em `/quiz/v4-jornada/quiz/`. O resultado é entregue na etapa 18. Resultado, apresentação e oferta são telas independentes dentro da mesma aplicação, não três documentos que transportam respostas na URL.

O plano anterior à implementação está em [quiz-046-funnel-plan.md](../research/quiz-046-funnel-plan.md). O registro de gates, QA e publicação pertence à [story QUIZ-046](../stories/QUIZ-046-jornada-paralela.md).

## Personalização

A terceira pergunta da v4 registra apenas o impacto declarado na confiança: Nada, Um pouco, Bastante ou Muito. O resumo reproduz a resposta correspondente e não calcula gravidade clínica por idade, medicamentos ou condições de saúde. Nada e ausência de resposta não podem virar uma classificação elevada. A oferta retoma o relato, sem indicar um kit como prescrição individual.

As respostas e o resumo vivem em memória. Navegar entre telas conserva a sessão; recarregar não restaura dados íntimos. O histórico do navegador pode identificar somente a tela por uma enumeração fixa. Não incluir respostas, pontuação, diagnóstico ou texto do resultado em URLs, cookies, armazenamento, histórico ou eventos.

## Eventos

O fluxo reutiliza os eventos de entrada, perguntas, fontes, reprodução e comércio já documentados na v3. Os identificadores da variante permitem separá-los nos relatórios.

| Momento | Evento | Parâmetros específicos |
|---|---|---|
| Entrada na capa/questionário | `page_view`, `landing_view` | `page_kind=cover` ou `quiz` |
| Conclusão do questionário | `quiz_complete` | Sem conteúdo das respostas |
| Resultado efetivamente visível | `quiz_result_view` | Sem intensidade ou classificação |
| Mudança real de tela final | `page_view` | `page_kind=result`, `presentation` ou `offer`; título neutro e URL sanitizada |
| Primeira visita a cada tela final | `quiz_journey_view` | `page_kind` entre os três identificadores fixos |
| Continuidade/retorno na jornada | `quiz_journey_action` | `cta_location=result_continue`, `presentation_continue`, `offer_view_kits` ou `back`, com `page_kind` de origem permitido |
| Vídeo visível e reprodução | `vsl_visible`, `vsl_start`, `vsl_progress`, `vsl_complete` | ID fixo; cobertura de trechos realmente assistidos |
| Som, pausa ou falha | `vsl_unmute`, `vsl_mute`, `vsl_pause`, `vsl_error`, `vsl_autoplay_blocked` | Identificadores e contadores fixos, sem mensagens livres |
| Visualização dos kits | `view_item` | Somente após visibilidade real dos kits; item comercial e valor |
| Escolha de kit e checkout | `select_item`, `begin_checkout` | Oferta selecionada e valor, sem associar resposta ou intensidade |

As dimensões `page_kind` e `cta_location` já estão registradas no GA4 conforme a documentação QUIZ-040. Não é necessário criar campos `screen_id` ou `action_id` para esta jornada. O evento de transição não comprova entrega ao fornecedor; testes interceptados validam o payload e o comportamento local.

GPC e opt-out permanecem respeitados. O checkout mantém UTMs permitidas, linker e callback limitado com fallback independente. Os links Anvisa, DailyMed e Nature conservam a exclusão UTMify já validada na QUIZ-045. Cliques automáticos do Google podem incluir a URL pública dessas fontes, nunca as respostas do questionário.

## Operação

Sem novas integrações de CRM, disparos de mensagens, gate de contato, bloqueio por tempo do vídeo ou alterações em campanhas. A garantia comercial segue os termos publicados: 30 dias a partir do recebimento, cobertura do valor dos produtos e condições de solicitação; não equivale a uma promessa de resultado terapêutico.

A condição externa do Meta e a homologação de `Purchase` continuam como pendências independentes, conforme a documentação anterior. Não interpretar `begin_checkout` como compra concluída nem usar a ausência de homologação para inventar conversões.

## Verificação

Ver a story para o resultado final dos gates e da publicação. A QA deve cobrir os quatro autorrelatos, isolamento das telas, volta/recarga, pausa e cobertura do vídeo, falha de reprodução, teclado, tamanhos móveis e desktop, visibilidade dos kits, atribuição, opt-outs e regressão v1/v2/v3.
