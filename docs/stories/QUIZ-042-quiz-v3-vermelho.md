# QUIZ-042 — Paleta vermelha no questionário v3

Status: concluída e publicada; fechamento documental local, sem novo deploy.

## Pedido e base

O proprietário pediu o quiz em vermelho no lugar do dourado para combinar com a capa atual. O escopo é aplicar a paleta vermelha somente à versão v3 do questionário, da oferta e da VSL em `/quiz/v3-editorial/quiz/`. A capa já publicada, v1, v2, homepage e atalho `/quiz` ficam preservados. Fluxo, conteúdo, respostas, progresso, tracking, preços, checkout e mídia não mudam.

Fetch confirmou a produção `09ec3e1dd642266997a4a9df76ab0cbb2a2e04b2`. Branch `feat/quiz-042-red` criada na mesma worktree `.local/quiz-038-vsl`, a partir do fechamento documental local `9dec9893f4d1781ffc7b315191b636a368da0a11`, com árvore limpa, dependências e evidências anteriores preservadas.

## Critérios de aceite

- [x] Aplicar tons vermelhos coerentes com a capa aos destaques, seleções, progresso, CTAs e oferta/VSL da v3, sem dourado residual nos elementos abrangidos.
- [x] Isolar a paleta por variante para preservar integralmente a aparência de v1 e v2.
- [x] Preservar legibilidade, contraste, estados de foco, navegação por teclado e responsividade.
- [x] Preservar fluxo, conteúdo, tracking, privacidade, callback/fallback, atribuição, preços, checkout e mídia.
- [x] Aprovar lint, TypeScript, testes, build/check:build e QA independente mobile/desktop e das variantes anteriores.
- [x] Publicar após GO root/QA e verificar deployment READY, quatro rotas, assets e rollback.

## Coordenação

- Root/dev: implementação visual isolada da v3 e revisão da interface.
- QA: verificação independente das cores, acessibilidade, variantes e regressões relevantes.
- @devops: story, gates/build, Git e publicação após liberação.

Sem novas dependências, eventos, SDKs, integrações ou ativos de mídia previstos. As limitações externas Meta/Purchase já documentadas permanecem fora desta atualização visual.

## Publicação e rollback

Projeto Vercel `murillo-digital/cowboy-site`. Manter as quatro entradas HTML existentes e `/quiz` apontando para v1. Rollback conhecido: `dpl_Ej9xb4MhNo33cbbJyRh8g5bKKetN`. Usar PR, checar o SHA exato e permitir que o merge gere o deploy automaticamente, sem publicação manual duplicada.

## Validação

A implementação usa tokens CSS no wrapper `.flow`, montado somente pela v3, com vermelho principal `#bd171d` e escuro `#8f1117`. Cores fixas de SVG/régua e da tela de análise passaram a usar variáveis com fallback original, preservando v1/v2. Cores semânticas de sucesso, economia e escala de severidade permanecem inalteradas.

Lint JavaScript de 52 arquivos e ESLint, TypeScript e 100 testes (55 site, 16 fluxo, 29 tracking) aprovados. Build/check:build aprovados com 131 arquivos e quatro entradas HTML; `git diff --check` limpo. Servidor `dist` + APIs em `http://127.0.0.1:4412`, liberado para QA independente. Evidências ficam locais. O fechamento documental após publicação não deve disparar novo deploy.

QA independente aprovou 10/10 E2E (6 editoriais e 4 VSL) em 33,4 segundos, com coleta externa e pedidos bloqueados. A inspeção das 18 etapas confirmou a ausência de dourado de acento residual; o gauge semântico da oferta foi preservado intencionalmente. V1/v2 mantêm `--primary: #9a6f1f`, `--ring: #b8862b` e logo dourado. Modal, foco, seleção, régua, análise, VSL, kits e selo aprovados em 375/390/1440 pixels; contraste do CTA de 6,36–9,29:1 e do CTA VSL de 5,86:1. Root revisou as imagens e concedeu GO final de publicação.

Nota preexistente e fora deste escopo: o texto de consentimento em `Quiz.tsx` usa `text-[10px] text-foreground/45` e continua claro; documentado por decisão de root, sem alteração nesta atualização. Evidências locais em `.local/quiz-042-captures/` e `test-results/quiz-042/`, sem dados de compra. A publicação não afirma nova homologação de eventos externos Meta/Purchase.

## Fechamento da publicação

- PR [#26](https://github.com/murillocaetano742/cowboy-site/pull/26), commit de implementação `a0aa6c74597b40782dae6a6e505cf196a1c1c848`; os dois checks Vercel foram aprovados antes do merge do SHA exato.
- Merge de produção `4d965172c7e55fb0a6224a7547b49a6c632724a7`, em 13/10/2026 às 23:24:15 UTC. Deploy automático `dpl_9NKXF3aFHxjYzhpsVmW7NCy4d6KX`, status READY, sem deploy manual paralelo.
- Deployment imutável: `https://cowboy-site-dn27d4np4-murillo-digital.vercel.app`. Domínios canônicos com e sem `www` apontam para esta versão.
- Quiz vermelho publicado em [v3](https://cowboyenergiamasculina.com.br/quiz/v3-editorial/quiz/), com a [capa atual preservada](https://cowboyenergiamasculina.com.br/quiz/v3-editorial/). [V1](https://cowboyenergiamasculina.com.br/quiz/v1-direto/) e [v2](https://cowboyenergiamasculina.com.br/quiz/v2-vsl/) permanecem disponíveis.
- Verificação pública às 23:25:18 UTC: quatro rotas HTTP 200, com HTML idêntico ao deployment consultado por CLI autenticada; 16 assets HTTP 200. Wrapper `.flow` encontrado somente no questionário v3; CSS publicado contém os tokens vermelhos aprovados. A capa, v1 e v2 não recebem esse escopo.
- HTML v3 SHA-256 `6ee42059d6d7ccf754c4aa960169c9b1b5b5f459f833a533748bcafa9518c5d8`. CSS vermelho SHA-256 `7153724f72048a74fb141536a4d7a26321568f108cad5bb38fadd628c20fd223`.
- Imagem da capa e poster mantêm os hashes originais. Homepage idêntica à fonte existente; `/quiz` responde 307 para v1, preservando a query. MP4 respondeu 206 a `bytes=0-1023`, MIME `video/mp4` e tamanho total de 30.576.839 bytes. Bundle de tracking mantém SHA-256 `917114cd1c04b632ef994bbc4ff9b3a40bdaf3b1bcc6bd0ad13fe45436d7234c`.
- Consulta de logs de erro do novo deployment nos últimos 15 minutos retornou zero registros. Servidor local 4412 encerrado e ausência de listener confirmada. Evidências HTTP, logs e QA foram preservadas localmente.
- Rollback permanece `dpl_Ej9xb4MhNo33cbbJyRh8g5bKKetN`. Este fechamento altera apenas a story e fica em commit local, sem push ou redeploy documental.

## File List

- `docs/stories/QUIZ-042-quiz-v3-vermelho.md`
- `packages/cowboy-quiz/src/components/sites/bluue/Quiz.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/SpecialScreens.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-flow.module.css`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-vsl.module.css`
