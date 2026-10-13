# QUIZ-042 — Paleta vermelha no questionário v3

Status: implementada e aprovada por root/QA; publicação autorizada.

## Pedido e base

O proprietário pediu o quiz em vermelho no lugar do dourado para combinar com a capa atual. O escopo é aplicar a paleta vermelha somente à versão v3 do questionário, da oferta e da VSL em `/quiz/v3-editorial/quiz/`. A capa já publicada, v1, v2, homepage e atalho `/quiz` ficam preservados. Fluxo, conteúdo, respostas, progresso, tracking, preços, checkout e mídia não mudam.

Fetch confirmou a produção `09ec3e1dd642266997a4a9df76ab0cbb2a2e04b2`. Branch `feat/quiz-042-red` criada na mesma worktree `.local/quiz-038-vsl`, a partir do fechamento documental local `9dec9893f4d1781ffc7b315191b636a368da0a11`, com árvore limpa, dependências e evidências anteriores preservadas.

## Critérios de aceite

- [x] Aplicar tons vermelhos coerentes com a capa aos destaques, seleções, progresso, CTAs e oferta/VSL da v3, sem dourado residual nos elementos abrangidos.
- [x] Isolar a paleta por variante para preservar integralmente a aparência de v1 e v2.
- [x] Preservar legibilidade, contraste, estados de foco, navegação por teclado e responsividade.
- [x] Preservar fluxo, conteúdo, tracking, privacidade, callback/fallback, atribuição, preços, checkout e mídia.
- [x] Aprovar lint, TypeScript, testes, build/check:build e QA independente mobile/desktop e das variantes anteriores.
- [ ] Publicar após GO root/QA e verificar deployment READY, quatro rotas, assets e rollback.

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

## File List

- `docs/stories/QUIZ-042-quiz-v3-vermelho.md`
- `packages/cowboy-quiz/src/components/sites/bluue/Quiz.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/SpecialScreens.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-flow.module.css`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-vsl.module.css`
