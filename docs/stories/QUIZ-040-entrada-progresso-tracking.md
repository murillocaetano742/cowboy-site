# QUIZ-040 — Entrada editorial, progresso e tracking

Status: implementada; gates, QA e revisão visual aprovados, publicação liberada pelo root.

## Pedido e base

Criar uma terceira versão independente do quiz, com capa editorial COWBOY identificada como conteúdo publicitário, fluxo de 14 perguntas em 18 etapas, progresso único em todas as etapas, CTA de kits próximo à VSL e mensagens de segurança de compra. Preservar v1, v2, homepage, atalho `/quiz`, preços, checkout e mídia.

Entrada nova: `/quiz/v3-editorial/`. Fluxo novo: `/quiz/v3-editorial/quiz/`. Após dar oportunidade de resposta assíncrona por mais de 60 segundos, o root adotou a redação “Há quanto tempo você percebe essa dificuldade?” para a pergunta após frequência. A resposta não altera o cálculo de severidade. Nenhuma resposta do proprietário havia chegado no momento dessa decisão; registrar eventual correção de conteúdo antes da publicação.

Base confirmada por fetch: produção `631063e30df726072c95887c615bb7228dfeffe8`. Branch `feat/quiz-040-editorial` criada a partir do HEAD local `9e26e2294f6f6e07153ba9a00d9aa71111ddc6d0`, que inclui somente o fechamento documental da QUIZ-039 acima da produção. Reutilizada exatamente a worktree `.local/quiz-038-vsl`, com dependências e evidências preservadas; nenhum novo worktree criado nem delta externo descartado.

## Critérios de aceite

- [x] Implementar capa editorial publicitária em `/quiz/v3-editorial/`, levando ao fluxo em `/quiz/v3-editorial/quiz/`.
- [x] Implementar 14 perguntas em 18 etapas, incluindo a pergunta de tempo após frequência com o texto adotado pelo root e sem efeito na severidade.
- [x] Exibir progresso único coerente em todas as etapas, inclusive transições, preservando navegação e respostas anteriores.
- [x] Oferecer CTA para ver kits junto à VSL e mensagens de segurança de compra sustentadas pela oferta existente.
- [x] Manter tracking neutro das entradas, navegação, progresso, VSL, kits e checkout, com identificação da v3, deduplicação e continuidade de atribuição.
- [x] Não transmitir respostas ou condições de saúde, dados pessoais ou conteúdo livre; preservar GPC, opt-out e fallback do checkout.
- [x] Preservar integralmente v1, v2, `/quiz` apontando para v1, homepage, preços, destinos de checkout e mídia.
- [x] Exigir no build as quatro entradas HTML aprovadas e excluir rotas/artefatos não autorizados.
- [x] Aprovar lint, TypeScript, testes, build e QA independente de navegação, mobile, mídia, tracking e regressões.
- [ ] Após GO root/QA, publicar via Git e verificar deployment READY, rotas, assets e rollback.

## Coordenação

- Root: capa editorial, novas rotas, decisões de conteúdo, integração e revisão final.
- Dev: fluxo, progresso, tracking e componentes existentes do pacote.
- QA: testes E2E e evidências independentes.
- @devops: story, build/allowlist raiz e seus testes, Git e publicação após gates.

Sem novas dependências previstas. Não alterar SDK, pixel, domínio ou integração comercial fora do escopo. A restrição externa Meta e a homologação Purchase seguem documentadas separadamente; não criar pedido ou pagamento artificial.

## Build e publicação

O export deve incluir `quiz/v1-direto/index.html`, `quiz/v2-vsl/index.html`, `quiz/v3-editorial/index.html` e `quiz/v3-editorial/quiz/index.html`, além dos assets permitidos. A homepage existente continua sendo a VSL da raiz. A inclusão de uma pasta de rota não deve liberar subrotas arbitrárias.

Implementado: cada rota copia apenas suas entradas `index.html`/`index.txt` e a metadata Next de prefetch em `.txt`. Assets seguem os diretórios aprovados. A entrada da capa não engloba recursivamente o questionário, evitando duplicação e publicação acidental de outras subrotas. `check:build` exige exatamente quatro entradas HTML e confere referências locais a quiz, imagens, vídeos e recursos Next.

Projeto Vercel: `murillo-digital/cowboy-site`. Rollback conhecido: `dpl_G4R8G5J8DUxEPNwzciECp8UBJSWj`, produção QUIZ-039. Reconfirmar antes da publicação. Fluxo Git com PR, checagem do SHA exato e deploy automático do merge; sem deploy manual duplicado.

## Validação

Preparação do build: seis testes aprovados para exportação das quatro entradas, exclusão de subrotas não autorizadas, rejeição de arquivos ocultos/fontes, exigência das entradas v1/v2/capa/questionário e bloqueio de HTML dentro de metadata Next.

Gates completos em 13/10/2026: lint JavaScript de 52 arquivos e ESLint do pacote, TypeScript e 100 testes (55 do site, 16 do fluxo e 29 de tracking) aprovados. Build/check:build aprovados com 130 arquivos e as quatro entradas HTML. O build contém a correção de hidratação da atribuição na capa feita pelo root com `useSyncExternalStore`. Servidor `dist` + APIs iniciado na porta 4410 e liberado para dez casos E2E (seis novos e quatro de regressão QUIZ-039).

QA independente: dez casos Playwright aprovados em 33,5 segundos, seis da QUIZ-040 e quatro da QUIZ-039. Confirmados fluxo, progresso, capa, privacidade, SDK Google real servido por fixture, linker/cookies e API de checkout com redirecionamento 302. O player decodificou a mídia real de 276,340998 s, 720 × 1280, `readyState=4`, com áudio/vídeo; autoplay inicialmente silenciado a partir de 50% visível, ativação do som, pausa manual e fallback passaram. Coleta externa e compra bloqueadas durante a QA. Evidências preservadas em `test-results/quiz-040/`; a restrição externa Meta continua documentada sem alegação de recebimento.

O root revisou e aprovou a fonte e as telas mobile da capa, VSL e kits, liberando commit, PR, merge e publicação após o GO da QA. Capturas complementares de desktop em 1440 px, pergunta de tempo e CTA em 390 px também foram revisadas e aprovadas. As configurações efetivas das cinco novas dimensões GA4 e o estado da restrição externa Meta estão registrados em `docs/integracoes/quiz-040-editorial.md`. O texto final distingue o callback do SDK da confirmação de recebimento pelo fornecedor.

## File List

- `docs/stories/QUIZ-040-entrada-progresso-tracking.md`
- `docs/integracoes/quiz-040-editorial.md`
- `scripts/build-quiz.js`
- `scripts/check-build.js`
- `tests/qa/quiz-build.test.js`
- `tests/e2e/cowboy-quiz-editorial.spec.js`
- `packages/cowboy-quiz/README.md`
- `packages/cowboy-quiz/scripts/check-flow.mjs`
- `packages/cowboy-quiz/scripts/check-tracking.mjs`
- `packages/cowboy-quiz/src/app/quiz/v3-editorial/page.tsx`
- `packages/cowboy-quiz/src/app/quiz/v3-editorial/quiz/page.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/PreCheckout.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/Quiz.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/SpecialScreens.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/data.ts`
- `packages/cowboy-quiz/src/components/sites/bluue/machine.ts`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-editorial.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-editorial.module.css`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-flow.module.css`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-vsl.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-vsl.module.css`
- `packages/cowboy-quiz/src/lib/quiz-tracking.ts`
- `packages/cowboy-quiz/src/lib/quiz-variant.ts`
- `packages/cowboy-quiz/src/lib/vsl-playback.ts`
