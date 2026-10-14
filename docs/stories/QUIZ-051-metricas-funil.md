# QUIZ-051 — Auditoria e métricas do funil

Status: implementação, gates e QA aprovados; GO root/QA concedido. Publicação em preparação; exploração GA4 ainda em configuração.

## Pedido e base

O proprietário pediu auditar e completar o rastreamento para entender onde os visitantes estão e onde param. A auditoria definiu métricas técnicas de etapas, tempo ativo e retenção de vídeo na V5, com GA4 como origem principal de comportamento e a integração Appmax/UTMify como origem de vendas aprovadas. Não inferir abandono ou compra a partir de evidência insuficiente.

Base local `1dd618a45608177dfc1bd4062007e8faf78b2873`, worktree reutilizada `.local/quiz-038-vsl`, branch `feat/quiz-051-funnel-metrics`. Árvore limpa antes da story; fetch confirmou produção `4e24a076b73d0b6516d78d35c84503045a20d37f`, sem commits remotos novos. Rollback 050 `dpl_B1ngVEzUBHY2jFNxyn5dMvVm4ksm` confirmado READY, URL imutável `https://cowboy-site-qcbh1nz79-murillo-digital.vercel.app` e aliases canônicos ativos.

Preservar a VSL obrigatória da produção050, conteúdo, preços, checkout e rotas. Não coletar saúde, respostas, dados pessoais identificáveis ou session replay. Sem mudanças de anúncios, orçamento, CRM ou contorno do bloqueio Meta. Root está autorizado a configurar os campos GA4 do contrato; testes externos continuam limitados à autorização específica, sem compras ou execução de emissores históricos. Auditoria de caminhos e metadados não lê nem imprime segredos.

## Critérios de aceite

- [x] Auditar fluxo e eventos existentes, integrações GA4/UTMify/Appmax e evidências de recebimento, identificando lacunas concretas e limitações.
- [x] Definir com root o contrato de etapas, tempo, retenção, saída e checkout antes de implementar; distinguir emissão, recebimento e interpretação de métricas.
- [x] Identificar somente caminhos/metadados de scripts, autorização e webhooks existentes, sem expor credenciais ou dados de clientes.
- [x] Medir engajamento por deltas de tempo ativo, checkpoints de vídeo e retenção pela cobertura realmente reproduzida, conforme contrato abaixo; não duplicar saldo em flushes consecutivos.
- [x] Instrumentação nova limitada a dados técnicos neutros, com GPC/opt-out, deduplicação e atribuição preservados; sem respostas, saúde, PII ou replay.
- [x] Preservar integralmente a VSL obrigatória050 e o funcionamento comercial das versões publicadas.
- [x] Não tratar begin_checkout como compra, nem saída estimada como fato confirmado; documentar limitações de sessão, navegador e bloqueadores.
- [x] Validar alterações com gates e QA adequados ao contrato final; nenhuma coleta externa de teste antes da autorização específica.
- [ ] Publicar somente após GO root/QA via PR, checks e merge exato; único deployment automático READY, smoke autorizado e rollback preservado.

## Coordenação e progresso

Root possui plano/contrato/documentação e decisões sobre contas. Dev possui produto/lib; QA possui auditoria/testes independentes. @devops possui esta story, gates/build e Git/release exclusivamente. Sem push antes do GO root/QA. Não alterar workspace original ou core protegido. Meta/Purchase continuam limites externos até evidência apropriada em contrário.

- [x] Confirmar base limpa, fetch e rollback READY.
- [x] Criar branch e story antes do código.
- [x] Entregar inventário somente leitura de integrações/autorização.
- [x] Consolidar contrato de métricas técnicas somente V5 e revalidar a restrição pública atual da Meta.
- [x] Executar lint, typecheck, 121 testes e build/check:build; servir artefato final para QA na porta4419.
- [x] Consolidar contrato, File List, gates e evidências de QA.
- [ ] Publicar, verificar e manter fechamento documental somente local.

## Inventário inicial, somente leitura

GA4 existente: propriedade `553376813`, medição `G-VYR2542XCN`. Código relevante: `packages/cowboy-quiz/src/lib/quiz-tracking.ts`, `checkout-navigation.ts`, `config/commerce.js` e `assets/js/cowboy-google.js`. Não foi localizado cliente das APIs Analytics Data/Admin ou service account no escopo de código examinado. A operação autenticada descrita nos documentos ocorreu por sessão de navegador; esta auditoria de arquivos não confirma que a sessão ainda esteja válida.

Referências: `docs/integracoes/quiz-037-tracking.md`, `quiz-040-editorial.md`, `appmax-tracking-2026-09-17.md` e `rastreamento-appmax-com-036.md`. O documento037 desta branch conserva uma conclusão antiga de recebimento pendente; a versão final local em `.local/quiz-037-release/docs/integracoes/quiz-037-tracking.md`, no workspace original, registra o recebimento no Realtime de navegação e begin_checkout, incluindo identificação do quiz e continuidade cross-domain, sem registrar valores de client/session IDs. A documentação040 registra recebimento real até a primeira etapa. São evidências históricas, não leitura atual da conta.

Purchase existente documentado: loja Appmax `344127` → webhook “COWBOY — Appmax” ativo na UTMify, com Purchase apenas para vendas aprovadas e valor da venda. A URL operacional foi transferida entre formulários autenticados, sem entrar no repositório; não foi acessada nesta auditoria. Não há homologação documentada de compra Appmax aprovada nesta sequência de entregas. Scripts e recibos históricos de Purchase encontrados apenas por nome/metadados em `.local/` não foram abertos nem executados; não serão usados para simular nova compra. Fixtures de SDK público de QA estão em `.local/quiz-037-evidence/`, fora do Git.

Nenhum segredo, arquivo `.env`, token, pedido ou evento de compra foi lido/enviado; não houve alteração de conta analytics. Este inventário foi entregue ao root para definir o contrato final antes de código.

## Contrato final de instrumentação

Somente `cowboy_v5_etapas` recebe os novos payloads; V1–V4 não recebem eventos ou parâmetros adicionais. O gate obrigatório050 permanece baseado no término nativo confiável e cobertura contínua integral. As métricas não liberam progressão, alteram preços ou enviam respostas.

| Evento | Parâmetros técnicos permitidos |
| --- | --- |
| `quiz_step_engagement` | `step_index` 0–21, `page_kind`, `active_time_ms` em DELTA e `flush_reason`: `heartbeat`, `transition`, `hidden`, `blur` ou `pagehide` |
| `vsl_retention` | `video_id` fixo e `video_percent` 10–90; cada marco uma vez, pela cobertura `played` |
| `vsl_watch_checkpoint` | `video_id` fixo, `position_bucket` arredondado para baixo em blocos de 10 segundos, `video_percent` de cobertura arredondado para baixo em dezenas, `watched_time_ms` e `buffer_time_ms` em DELTA apenas no primeiro plano, `checkpoint_reason` e `pause_reason` quando aplicável |

`checkpoint_reason` admite `heartbeat`, `pause`, `hidden`, `blur`, `pagehide`, `transition`, `completed`, `error`, `retry` e `recovered`. `pause_reason` admite `manual`, `viewport`, `lifecycle`, `completed` e `unknown`. Amostragem de 1 segundo e heartbeat de 30 segundos; lacunas desconhecidas acima de 5 segundos são descartadas. `hidden` é uma mudança de visibilidade, não abandono confirmado. `pagehide` não pode reenviar saldo já contabilizado.

Root configura dimensões e métricas GA4 e registra os nomes efetivos em sua documentação. QA verifica emissão, privacidade, deltas e preservação funcional com provedores isolados. Uma sessão observada no Realtime em 14/10/2026 tinha `quiz_step_view` 8 e `quiz_answer` 6: demonstra recebimento parcial atual, sem homologar o funil inteiro ou Purchase.

## Limites externos revalidados

Em 14/10/2026 às 17:16:18 UTC, a leitura HTTP pública do SDK Meta `2.9.419` e da configuração do pixel `1006075098894986` para o domínio canônico retornou HTTP200. O bloco `prohibitedPixels` continua com `lockWebpage: true` e `blockReason: source_category`. Não houve execução do SDK, evento, cookie, compra ou tentativa de contorno. A evidência sanitizada está em `.local/quiz-051-meta-public-config.json` no workspace original, fora do Git; SHA-256 do SDK `9e4b581a7483e88873ad835a840ffaaff1c85b3be28951e12e8207a318e7776b` e da configuração `6ff7ca5719501eb817c99195a59988ec892fbc3f9023350cd280e32370d85d42`.

O bloqueio é um limite do provedor: configurar carregamento ou filas locais não comprova aceitação de eventos pela Meta. Purchase permanece dependente de aprovação real na integração comercial, sem homologação nova nesta tarefa.

## File List

- `docs/stories/QUIZ-051-metricas-funil.md`
- `docs/integracoes/quiz-051-metricas.md`
- `packages/cowboy-quiz/src/lib/foreground-clock.ts`
- `packages/cowboy-quiz/src/lib/quiz-engagement.ts`
- `packages/cowboy-quiz/src/lib/vsl-telemetry.ts`
- `packages/cowboy-quiz/src/lib/quiz-tracking.ts`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-vsl.tsx`
- `packages/cowboy-quiz/scripts/check-tracking.mjs`
- `tests/e2e/cowboy-quiz-steps.spec.js`

## Validação e publicação

- `npm run lint`: aprovado; sintaxe de54 arquivos JavaScript e ESLint do pacote.
- `npm run typecheck`: aprovado.
- `npm test`:121 aprovados, sem falhas —57 integração/QA do site,25 fluxo e39 tracking.
- `npm run build` e `npm run check:build`: aprovados;152 arquivos públicos e as mesmas oito rotas HTML, com homepage preservada e allowlist exata. Aviso preexistente do Next sobre dois lockfiles não impediu compilação/exportação.
- Artefato disponível para QA em `http://127.0.0.1:4419`, sem carregar segredos de ambiente; sessão local66769 controlada por @devops.
- QA independente: 36/36 cenários aprovados — 35 na rodada completa e um reteste isolado após aguardar corretamente o evento nativo de pausa. Nenhum delta de produto após o build. Confirmados deltas/lifecycle, vídeo real de 12 segundos, ausência de payloads médicos/PII no SDK público atualizado, privacidade, linker, três kits e regressões legadas. Comandos e evidências estão em `docs/integracoes/quiz-051-metricas.md`.
- Reteste final do SDK: 1/1 aprovado em 37 segundos com asserção explícita dos três eventos novos no coletor interceptado. Evidência adicional em `test-results/quiz-051-sdk-recheck/`; nenhuma coleta externa, compra ou alteração de produto.
- GO root condicionado ao QA final foi concedido e a condição foi cumprida. PR/checks/merge, READY e smoke público permanecem pendentes; sem publicação nesta etapa documental.
- Root confirmou cinco dimensões e três métricas adicionais na GA4. A exploração salva existe, mas segue em configuração; não se declara painel final nem recebimento dos novos eventos antes da verificação de produção.
