# QUIZ-038 — Versão separada do quiz com VSL

Status: concluída — nova versão publicada e verificada em produção.

## Pedido e base

Criar e publicar uma versão separada do quiz que apresente a VSL depois do resultado e antes dos kits, preservando a versão atual. Nova rota: `/quiz/v2-vsl/`. A rota `/quiz/v1-direto/`, o atalho `/quiz` e a VSL da página inicial permanecem disponíveis com os comportamentos existentes.

Base confirmada após fetch: `59ca420f206f3b3d54c21a5854921b905dd1b27f`, produção da QUIZ-037. Worktree isolado `.local/quiz-038-vsl`, branch `feat/quiz-038-vsl`. O checkout original dirty e o fechamento documental local da QUIZ-037 (`3d15d0e`) são preservados.

## Critérios de aceite

- [x] Publicar `/quiz/v2-vsl/` com a sequência quiz → resultado → VSL → kits.
- [x] Preservar integralmente o fluxo atual em `/quiz/v1-direto/` e o destino do atalho `/quiz`.
- [x] Usar o vídeo existente confirmado pela QA, com controles utilizáveis no celular e sem impedir acesso ao checkout em caso de falha de mídia.
- [x] Preservar preços, kits, checkout, atribuição e proteções de privacidade; identificar a versão nos eventos sem enviar respostas ou condições de saúde.
- [x] Incluir somente as duas rotas aprovadas no export público, mantendo a homepage e os assets existentes.
- [x] Executar lint, TypeScript, testes pertinentes, build e QA de navegação/vídeo/checkout nas duas versões.
- [x] Publicar após GO root/QA e confirmar deployment, conteúdo das rotas, recursos HTTP/MIME e disponibilidade da versão anterior.

## Coordenação

- Dev implementa fluxo, componentes e instrumentação do pacote `packages/cowboy-quiz`.
- QA verifica fonte de vídeo, comportamento em celular, regressões da v1 e privacidade dos eventos.
- @devops mantém story/build root, prepara release isolado e executa Git/push/publicação após a liberação.
- A restrição externa Meta documentada na QUIZ-037 não será contornada por pixel, domínio ou categoria alternativos. Nenhum pedido, pagamento ou Purchase artificial é necessário para validar a nova versão.

## Build e publicação

`scripts/build-quiz.js` exige as duas entradas HTML e copia somente `quiz/v1-direto`, `quiz/v2-vsl`, `_next/static` e `sites`. A allowlist geral do site já inclui `videos/vsl/vsl-dr-durval-720.mp4` e `imagens/v5/vsl-poster-frame.webp`. A QA confirmou a mídia existente: 276,34 segundos, vertical 720×1280, legendas queimadas; o vídeo ocupa 30.576.839 bytes e o poster 52.468 bytes. Não há cópia duplicada no pacote do quiz. O check de build protege a VSL na raiz, o atalho da v1 e a integridade do vídeo copiado.

Preparação: dependências instaladas com `npm ci` na raiz e no pacote; quatro testes de allowlist/export passaram, incluindo preservação das duas entradas e rejeição de exportação parcial.

Gates locais em 13/10/2026: lint JavaScript de 51 arquivos e ESLint do pacote; TypeScript; 89 testes (53 do site, 13 do fluxo e 23 de tracking); `check:commerce` dos três kits; build/check:build com 119 arquivos, incluindo as duas rotas. Servidor de QA isolado em `http://127.0.0.1:4398`, servido de `dist` com as APIs existentes. QA de navegador e revisão visual aprovadas antes da liberação de publicação.

A primeira QA detectou que a classe Tailwind arbitrária de altura não tinha efeito no CSS estático herdado. O player passou a usar CSS Module isolado com limite de 70svh e fallback 70vh, fundo preto e object-fit contain. Lint/TypeScript e novo build/check:build passaram após a correção visual; o reteste de navegador usa esse artefato.

QA funcional final: três casos Playwright aprovados em 20,8 segundos, com coleta externa interceptada. V1 e atalho preservaram as 17 etapas sem baixar a VSL; v2 em 375 px decodificou áudio e vídeo reais, respeitou 70svh e manteve marcos neutros/deduplicação e os três kits; v2 em 390 px exibiu fallback para vídeo 404, preservou linker/client ID/session ID até a API e não carregou SDKs sob GPC. Nenhum pedido ou Purchase foi enviado. O root inspecionou `v2-player-375.png`, confirmou imagem e legendas completas, controles e início dos kits visíveis, e autorizou a publicação pelo fluxo Git.

Projeto de destino: Vercel `murillo-digital/cowboy-site`. Produção anterior conhecida: `dpl_7JQkBpnN9Ag1LyxWCjg8JHhCQ2G2`, sujeita a releitura antes de publicar. Sem alterações de domínio ou infraestrutura previstas.

### Publicação concluída

PR [#22](https://github.com/murillocaetano742/cowboy-site/pull/22), head `71f3ef0d8655a8515f87bb3301811c5ae5c1013e`, aprovado pelos checks Vercel e Vercel Preview Comments. O head exato foi reconferido antes do merge. Merge `b9de4a924a574d6d21d7f9f8c10339fb4ba4cf50` em 13/10/2026 às 13h13min10s UTC. O deploy Git automático, sem publicação manual duplicada, gerou `dpl_BWrdNT4w7WRKBi3Fog5wXQ2cRPWm`, **READY / Production**, URL `https://cowboy-site-2x5xs47zt-murillo-digital.vercel.app`, com aliases principal e www confirmados.

- Nova versão: `https://cowboyenergiamasculina.com.br/quiz/v2-vsl/`.
- Versão atual preservada: `https://cowboyenergiamasculina.com.br/quiz/v1-direto/`.

Verificação HTTP de 13/10/2026 às 13h15min35s UTC: ambas as rotas responderam 200 e seus arquivos foram idênticos aos da implantação imutável obtidos por `vercel curl` autenticado. SHA-256 v2: `2d0fdcc7db7ce14a8a3a1395ec129957890f6c8bcba557ed73f4b60dc7b9151c`; v1: `a7c1c8c522000f12f5558da3a0d4bbf6578b2e7faa8a68d58e2173c1f25112d6`. Os 14 assets referenciados responderam 200, incluindo o bundle com `cowboy_v2_vsl`. O atalho `/quiz` manteve 307 para v1 com query preservada; a homepage permaneceu idêntica à base. O MP4 respondeu 206 `video/mp4` para Range 0–1023 de 30.576.839 bytes, e o poster 200 com hash igual ao arquivo original.

Evidência privada preservada em `.local/quiz-038-final-http.json`; a consulta de logs de erro da implantação na janela de 15 minutos retornou zero entradas. O servidor local 4398 foi encerrado e a ausência de listener foi conferida. As evidências QA locais foram preservadas. Rollback disponível para `dpl_7JQkBpnN9Ag1LyxWCjg8JHhCQ2G2`. O fechamento documental fica em commit local, sem redeploy apenas por documentação.

## File List

- `docs/stories/QUIZ-038-versao-com-vsl.md`
- `scripts/build-quiz.js`
- `scripts/check-build.js`
- `tests/qa/quiz-build.test.js`
- `tests/e2e/cowboy-quiz-vsl.spec.js`
- `packages/cowboy-quiz/README.md`
- `packages/cowboy-quiz/scripts/check-tracking.mjs`
- `packages/cowboy-quiz/src/app/quiz/v2-vsl/page.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/PreCheckout.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/Quiz.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-vsl.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-vsl.module.css`
- `packages/cowboy-quiz/src/lib/checkout-navigation.ts`
- `packages/cowboy-quiz/src/lib/quiz-tracking.ts`
- `packages/cowboy-quiz/src/lib/quiz-variant.ts`
- `packages/cowboy-quiz/src/lib/vsl-playback.ts`
- `docs/integracoes/quiz-038-vsl.md`
