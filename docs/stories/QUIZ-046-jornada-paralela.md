# QUIZ-046 — Jornada paralela de resultado, apresentação e oferta

Status: publicada e verificada em produção; gates, QA final, revisão visual e smoke público aprovados. Fechamento documental mantido somente local.

## Pedido e base

O proprietário pediu mapear e planejar antes de criar uma versão paralela. O plano completo foi elaborado e apresentado por root; esta story segue `docs/research/quiz-046-funnel-plan.md`, sem alterar a experiência já publicada. Nova capa em `/quiz/v4-jornada/` e questionário em `/quiz/v4-jornada/quiz/`; seis entradas HTML no total, mantendo as quatro anteriores e `/quiz` direcionado à v1.

Worktree reutilizada `.local/quiz-038-vsl`, branch `feat/quiz-046-parallel-journey`, base local `62b2f19e7c49dea84b9bce2f56a0c69920bd4138`. Fetch confirmou produção `f8b977144e70e553dc8e94e67515cd653d0c1ab5`, com árvore limpa. Rollback READY: `dpl_cFswBcb2TGMiYh4tbYsrw55owjVy`, deployment `https://cowboy-site-de1qt8eru-murillo-digital.vercel.app`.

## Experiência prevista

Reutilizar a entrada e as telas editoriais da v3 para as 14 perguntas e 18 etapas iniciais. Na v4, a terceira pergunta será “Quanto isso afeta sua confiança hoje?”, com “Nada”, “Um pouco”, “Bastante” e “Muito”. O resultado reflete esse autorrelato, sem `caseResult`, pesos clínicos ou gravidade inflada.

As três fases finais ocupam telas próprias na mesma aplicação: resultado sem produto, apresentação da VSL e oferta. O estado pessoal permanece exclusivamente em memória. Voltar preserva contexto sem duplicar eventos; retornar ao vídeo o mantém pausado. Recarregar reinicia com mensagem clara, sem recuperar ou inventar resultado.

Resultado: “Seu resultado está pronto.” e “Impacto na sua confiança: [resposta declarada]”, com apoio fiel e nota de que o resumo não é diagnóstico médico. CTA “Assistir à apresentação.” Sem kits, fotos do COWBOY, preços ou classificação clínica. A barra termina em 18/18; depois, navegação Resultado/Apresentação/Oferta sem aparentar novas perguntas.

Apresentação: ambiente dedicado e escuro, VSL existente, autoplay silencioso visível, som por gesto, pausa manual respeitada, retorno ao resultado e CTA “Ver kits e valores” disponível inclusive em falha. Sem bloqueio temporal ou contagem regressiva inventados.

Oferta: composição própria com retomada breve do impacto declarado, headline “Teste o COWBOY por 30 dias. Decida pela sua experiência.”, identificação do suplemento e condições da garantia, produto real, composição baseada no rótulo, depoimentos existentes, kits e preços atuais, checkout e dúvidas essenciais. Sem kit tratado como prescrição, estatística nova, promessa de cura ou associação do estudo genético à eficácia do suplemento.

## Critérios de aceite

- [x] Nova v4 isolada nas duas rotas previstas; seis HTML no artefato, v1/v2/v3, homepage e atalho preservados.
- [x] Preservar 14 perguntas/18 etapas e telas editoriais; terceira pergunta e quatro respostas de confiança somente na v4.
- [x] Resultado fiel a todas as respostas declaradas, inclusive “Nada”, sem pontuação clínica ou produto nessa tela.
- [x] Resultado, apresentação e oferta são telas distintas com título, foco, navegação e CTA próprios.
- [x] VSL preserva reprodução real, privacidade, autoplay silencioso, gesto de som, pausa manual e acesso à oferta em falha, sem bloqueio por tempo.
- [x] Oferta própria mantém condições comerciais e dados reais, sem inventar prova ou garantia clínica.
- [x] Contexto pessoal somente em memória; nunca em URL, history.state, storage, cookies, CRM ou eventos.
- [x] Voltar entre fases preserva contexto, não duplica conversões e retorna ao vídeo pausado; recarga reinicia de forma clara.
- [x] Tracking com `quiz_id` exclusivo e IDs fixos de tela/ação, fases por visita real e resultado/kits por visibilidade real, preservando GPC/opt-out e atribuição do checkout.
- [x] Sem cadastro obrigatório, novas operações de CRM, alteração de anúncios, orçamento ou campanhas.
- [x] Gates, seis rotas, QA mobile/desktop, quatro respostas e regressão das versões anteriores aprovados.
- [x] Publicar somente após GO root/QA, via PR e merge de SHA exato, com READY, smoke público e rollback confirmado.

## Coordenação

Dev possui componentes/lib e testes unitários do pacote. QA possui E2E e inspeção independente. Root possui plano/README, revisão de produto e conteúdo. @devops possui story, exportação/allowlist de build, gates, servidor 4416 e Git/release. Não alterar workspace original, core protegido ou dependências sem necessidade demonstrada. Limitações externas Meta/Purchase permanecem explicitamente pendentes; não alegar ganho de conversão ou compras homologadas.

## Progresso de build

Exportação ampliada de quatro para seis rotas aprovadas, sem mudar homepage, redirect ou configurações da Vercel. Fixture de publicação cobre metadados e exclusão de rotas aninhadas não aprovadas nas duas novas entradas; release parcial sem capa ou questionário v4 é rejeitado. Os sete testes de build passaram antes da integração da fonte.

Gates da fonte consolidada aprovados: lint JavaScript de 53 arquivos e ESLint, TypeScript, 108 testes (56 site, 18 fluxo, 34 tracking), build/check:build com 142 arquivos e seis entradas HTML. `git diff --check` limpo. Servidor 4416 atualizado para QA final. A consolidação inclui visibilidade real do bloco de resultado, consentimento neutro somente na v4 e CTA da oferta com rolagem/foco nos kits; variantes anteriores preservadas.

Tracking v4 identificado por `cowboy_v4_jornada`, com `quiz_journey_view`/`quiz_journey_action`, fases `result`, `presentation`, `offer` e ações fixas `result_continue`, `presentation_continue`, `offer_view_kits`, `back`. A impressão de resultado depende do bloco visível em pelo menos 25%; sem IntersectionObserver não é presumida. O histórico carrega apenas o ID fixo de navegação, nunca respostas ou resultado.

QA funcional aprovou 19/19 E2E em 1,1 minuto, incluindo nove casos da v4 e dez regressões das versões anteriores. O CSS final usa a variável real `--font-heading` e logo `#ff858b` no fundo escuro. A revisão final também corrigiu um disparo de fase que dependia de o título ficar visível: `page_view`/`quiz_journey_view` agora acompanham a mudança real de tela, enquanto `quiz_result_view` mantém o observer de 25% no bloco do resultado e `view_item` depende dos kits. Lint/TypeScript e build/check:build passaram novamente.

No último JS+CSS, os nove E2E v4 passaram novamente em 35,9 segundos, incluindo regressão explícita sem callback IO do título e rolagem imediata. As dez regressões legadas anteriormente aprovadas permanecem válidas. Smoke visual final em 375/390/1440 pixels confirmou Oswald, contraste do logo, ausência de overflow, CTA da oferta acima da dobra e rolagem/foco nos kits. Root aprovou as três telas, conteúdo/condições e plano e concedeu GO completo. Evidências locais em `test-results/quiz-046-v4-final/` e `.local/quiz-046-final-captures/`; fornecedores externos e compras interceptados durante QA.

## Publicação e fechamento

PR [#30](https://github.com/murillocaetano742/cowboy-site/pull/30), head `d840573264d1bf0046f5cc4615cb4e2086f0b871`, aprovado nos checks Vercel e Preview Comments e mesclado em `6c28dbe182ad1e6cfde914a5e83ac0bfb4c40d69` em 14/10/2026 às 01:13:29 UTC. O único deployment automático `dpl_HTWy1m35FLZe4xNUrbstEts7yuBx` está READY em produção, com aliases canônicos confirmados. URL imutável: `https://cowboy-site-9s0ftd16f-murillo-digital.vercel.app`. Rollback preservado: `dpl_cFswBcb2TGMiYh4tbYsrw55owjVy`.

Nova entrada pública: [capa v4](https://cowboyenergiamasculina.com.br/quiz/v4-jornada/) e [questionário v4](https://cowboyenergiamasculina.com.br/quiz/v4-jornada/quiz/). Às 01:14:39 UTC, as seis rotas retornaram HTTP 200 e seus HTML coincidiram byte a byte com o deployment autenticado. Dezessete assets passaram; bundles contêm a variante `cowboy_v4_jornada`, fases e ações novas, Oswald e logo final. Homepage preservada; `/quiz?utm_source=qa_route_only` retornou 307 para a v1 com query preservada. Capa, imagens de medicamentos e poster mantiveram hashes; MP4 respondeu 206 a range de 1.024 bytes, MIME `video/mp4` e tamanho total de 30.576.839 bytes. Evidência HTTP em `.local/quiz-046-final-http.json` no workspace original, fora do Git. Consulta dos logs Vercel de erro dos últimos 15 minutos retornou zero registros.

Auditor aprovou o smoke móvel no domínio canônico: 1/1 caso em 15,8 segundos. Resultado → apresentação com vídeo real 720×1280 e áudio → oferta, histórico, pausa, CTA com foco nos kits, três kits, atribuição e recarga passaram. SDKs, coleta externa e checkout foram interceptados; nenhum pedido foi criado. Evidências preservadas em `test-results/quiz-046-production/`. A verificação não constitui recebimento externo de eventos v4; as limitações Meta e homologação de Purchase continuam pendentes conforme documentação de integração.

Servidor local 4416 encerrado; consulta de listeners confirmou zero. Este fechamento é documental local, sem push nem segundo deployment. O workspace original e as evidências locais permanecem preservados.

## File List

- `docs/stories/QUIZ-046-jornada-paralela.md`
- `scripts/build-quiz.js`
- `scripts/check-build.js`
- `tests/qa/quiz-build.test.js`
- `docs/research/quiz-046-funnel-plan.md`
- `docs/integracoes/quiz-046-jornada.md`
- `packages/cowboy-quiz/README.md`
- `packages/cowboy-quiz/scripts/check-flow.mjs`
- `packages/cowboy-quiz/scripts/check-tracking.mjs`
- `packages/cowboy-quiz/src/app/quiz/v4-jornada/page.tsx`
- `packages/cowboy-quiz/src/app/quiz/v4-jornada/quiz/page.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/PreCheckout.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/Quiz.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/SpecialScreens.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/machine.ts`
- `packages/cowboy-quiz/src/components/sites/bluue/confidence-impact.ts`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-editorial.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-flow.module.css`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-journey.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-journey.module.css`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-journey-offer.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-offer-data.ts`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-vsl.tsx`
- `packages/cowboy-quiz/src/lib/quiz-tracking.ts`
- `packages/cowboy-quiz/src/lib/quiz-variant.ts`
- `packages/cowboy-quiz/src/lib/vsl-playback.ts`
- `tests/e2e/cowboy-quiz-journey.spec.js`
