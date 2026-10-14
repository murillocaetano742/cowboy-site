# QUIZ-047 — Versão paralela com etapas finais separadas

Status: publicada e verificada em produção; gates, QA funcional/visual e smoke público aprovados. Fechamento documental somente local.

## Pedido e base

O proprietário pediu botão Continuar flutuante na etapa 4 e uma nova versão paralela, preservando a última versão publicada. A sequência final solicitada é 18 resultado, 19 VSL, 20 depoimentos/avaliações e 21 kits/garantias, simplesmente separando o conteúdo da página final existente. Após oferecer oportunidade de resposta à pergunta assíncrona sem retorno, root anunciou a última v4 como referência e liberou o contrato abaixo. Não haverá redesign, nova copy comercial ou algoritmo de gravidade.

Worktree reutilizada: `.local/quiz-038-vsl`. Branch: `feat/quiz-047-split-steps`. Base local: `9d1b9b5a6ca35cd860a8c95c3685a681840d7f3d`, árvore limpa antes da story. Fetch confirmou `origin/main` em `6c28dbe182ad1e6cfde914a5e83ac0bfb4c40d69`, sem commits remotos novos. Produção e rollback 046 confirmados READY em `dpl_HTWy1m35FLZe4xNUrbstEts7yuBx`, URL imutável `https://cowboy-site-9s0ftd16f-murillo-digital.vercel.app`, com domínio canônico ativo.

Novas rotas propostas: `/quiz/v5-etapas/` e `/quiz/v5-etapas/quiz/`. Total de oito entradas HTML públicas após a integração, mantendo as seis anteriores, a homepage e `/quiz` apontando para v1. Servidor de QA previsto: 4417.

## Critérios de aceite

- [x] Confirmar a referência da página final com root e registrar a decisão antes de alterar esse conteúdo: última v4.
- [x] Criar a v5 paralela nas duas rotas previstas, preservando v1/v2/v3/v4 e seus fluxos; única alteração funcional na v4 é o CTA flutuante da etapa 4 explicitamente pedido.
- [x] Etapa 4 de v4 e v5 oferece Continuar flutuante acessível, sem ocultar conteúdo, fonte ou controles, inclusive em viewport pequeno; v3 permanece intocada.
- [x] Separar as etapas finais em 18 resultado fiel ao autorrelato v4, 19 VSL existente, 20 prova existente (dois vídeos e seis fotos) e 21 oferta v4 sem o bloco de prova já exibido. Nenhuma duplicação, redesign, copy comercial nova ou algoritmo de gravidade.
- [x] Manter perguntas/respostas e condições comerciais existentes conforme referência; não alterar preços, mídia, checkout ou garantias.
- [x] Barra, DOM e eventos refletem 21 etapas, mantendo 14 respostas e conclusão do questionário na 18. Navegação, foco, voltar e recarga são coerentes; VSL preserva autoplay silencioso visível, som por gesto e pausa manual. Vídeos de VSL/prova pausam fora da própria etapa.
- [x] Tracking neutro identifica a nova versão e as telas, sem respostas ou dados de saúde em eventos, URL, histórico persistente, storage ou cookies; preservar GPC/opt-out e atribuição.
- [x] Exportar oito HTML aprovados e rejeitar releases parciais; não publicar rotas privadas ou arquivos fonte.
- [x] Aprovar lint, TypeScript, testes, build/check:build, E2E e revisão visual mobile/desktop; regressão das versões anteriores sem bloqueadores.
- [x] Publicar somente após GO root/QA, com PR, checks, merge SHA exato, único deployment automático READY, smoke público e rollback preservado.

## Coordenação e limites

Root define conteúdo/escopo e revisa produto. Dev possui componentes, lib e testes unitários do pacote; QA possui E2E e inspeção independente. @devops possui esta story, allowlists/testes de build, gates, servidor 4417 e Git/release. Nenhum push antes do GO root/QA. Não alterar o workspace original, core protegido, campanhas, custos ou CRM. Limitações externas Meta/Purchase continuam pendentes e não serão tratadas como homologadas.

## Progresso

- [x] Confirmar base local, fetch remoto e rollback READY.
- [x] Criar branch e story antes do código.
- [x] Ampliar exportação e testes para oito rotas.
- [x] Registrar escopo final, implementação e evidências de QA.
- [x] Publicar, verificar, encerrar servidor e manter fechamento documental somente local.

Allowlist ampliada com capa e questionário v5, sem alteração de redirects ou configuração Vercel. Oito testes de build passaram, incluindo exclusão de rotas privadas aninhadas e rejeição de publicação parcial sem qualquer entrada v5.

Fonte consolidada pelo dev: rotas v5, `quiz_id=cowboy_v5_etapas`, quatro telas finais `result`, `presentation`, `testimonials` e `offer`. A barra de 21 etapas pertence somente à v5; a alteração visível na v4 é exclusivamente o botão flutuante da etapa 4. A extração de prova social mantém o DOM/conteúdo anterior na v4. Root revisou fonte e documentação sem pedir ajustes.

Gates completos aprovados: sintaxe de 54 arquivos JavaScript + ESLint, TypeScript, 112 testes (57 site, 19 fluxo e 36 tracking). Build/check:build gerou 152 arquivos públicos, oito HTML e preservou homepage/redirect. Servidor 4417 disponibilizado para QA. A rodada de 29 E2E passou em 1,7 minuto: dez novos, nove v4 e dez regressões editorial/VSL, sem alteração dos testes legados.

GO QA final: visual 375/390/1440 aprovado, zero overflow e CTA flutuante da etapa 4 validado também por teclado e zoom 200%. O indicador de carregamento dos controles nativos nas primeiras capturas era transitório: recaptura após três segundos, sem play, mostrou posters limpos com `preload=none`, `currentTime=0` e nenhum erro de mídia. Nenhuma fonte mudou após os testes. Evidências locais em `.local/quiz-047-final-captures/layout-final.json` e `test-results/quiz-047/`. Coleta, SDKs e checkout externos foram interceptados; não há confirmação de recebimento externo ou compra nesta validação.

## Publicação e fechamento

PR [#31](https://github.com/murillocaetano742/cowboy-site/pull/31), head `1dc45a8209fe5a914e3df349eacf9cfc731f2d94`, passou nos checks Vercel e Preview Comments e foi mesclado em `f9d506231e3f7d30ac60b4b0ff22235f368d623c` em 14/10/2026 às 12:54:35 UTC. O único deployment automático de produção `dpl_8CvS4JQrE8SZn2LvpdJ1w7QTffKZ` está READY, com aliases canônicos confirmados. URL imutável: `https://cowboy-site-nbmdovtwc-murillo-digital.vercel.app`. Rollback 046 preservado: `dpl_HTWy1m35FLZe4xNUrbstEts7yuBx`.

Nova [capa v5](https://cowboyenergiamasculina.com.br/quiz/v5-etapas/) e [questionário v5](https://cowboyenergiamasculina.com.br/quiz/v5-etapas/quiz/) publicados. Às 12:59:17 UTC, as oito rotas e 17 assets retornaram HTTP 200. Os oito HTML canônicos coincidiram byte a byte com o deployment autenticado; os bundles contêm `cowboy_v5_etapas`, eventos e prova social separada. Homepage preservada; `/quiz?utm_source=qa_route_only` retornou 307 para v1 mantendo a query. Imagens da capa/medicamentos e poster mantiveram hashes. O MP4 retornou 206 para range de 1.024 bytes, MIME `video/mp4` e tamanho total de 30.576.839 bytes. Evidência em `.local/quiz-047-final-http.json` do workspace original, fora do Git. Consulta dos logs Vercel de erro dos últimos 15 minutos retornou zero registros.

Auditor aprovou dois casos públicos em 18,6 segundos: fluxo completo v5 com as quatro telas, vídeos, histórico, três kits, atribuição e recarga; CTA da etapa 4 v4 com teclado, larguras móveis/desktop e zoom. SDKs, coleta e checkout externos foram interceptados; nenhum pedido ou compra foi criado. Evidências preservadas em `test-results/quiz-047-production/`. Esta validação não afirma recebimento dos novos eventos nos fornecedores; Meta e homologação de Purchase continuam pendências externas documentadas.

Servidor 4417 encerrado e consulta de listeners confirmou zero. Árvore limpa antes deste fechamento; o registro é mantido em commit local, sem push e sem deployment adicional. O workspace original e as evidências permanecem preservados.

## File List

- `docs/stories/QUIZ-047-etapas-finais.md`
- `scripts/build-quiz.js`
- `scripts/check-build.js`
- `tests/qa/quiz-build.test.js`
- `tests/e2e/cowboy-quiz-steps.spec.js`
- `docs/research/quiz-047-split-plan.md`
- `docs/integracoes/quiz-047-etapas.md`
- `packages/cowboy-quiz/README.md`
- `packages/cowboy-quiz/scripts/check-flow.mjs`
- `packages/cowboy-quiz/scripts/check-tracking.mjs`
- `packages/cowboy-quiz/src/app/quiz/v5-etapas/page.tsx`
- `packages/cowboy-quiz/src/app/quiz/v5-etapas/quiz/page.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/Quiz.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/SpecialScreens.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/machine.ts`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-editorial.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-journey-offer.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-journey-state.ts`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-journey.module.css`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-journey.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-research.module.css`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-research.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-social-proof.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-vsl.tsx`
- `packages/cowboy-quiz/src/lib/quiz-tracking.ts`
- `packages/cowboy-quiz/src/lib/quiz-variant.ts`
- `packages/cowboy-quiz/src/lib/vsl-playback.ts`
