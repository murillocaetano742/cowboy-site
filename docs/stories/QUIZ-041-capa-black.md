# QUIZ-041 — Capa v3 com comunicação mais direta

Status: implementada; gates, QA e revisão visual aprovados, publicação liberada pelo root.

## Pedido e base

O proprietário pediu uma “pegada mais black” e esclareceu que isso inclui a imagem e uma linguagem sexual mais crua e direta. O escopo definido pelo root é atualizar somente a capa `/quiz/v3-editorial/`, com copy e imagem mais dramáticas e visual mais forte em preto, branco e vermelho. A apresentação permanece identificada como conteúdo publicitário COWBOY. O exemplo de manchete com “90% dos homens” não será convertido em estatística factual sem comprovação; não inventar percentuais, pesquisa, diagnóstico ou resultado garantido.

Questionário, VSL e demais mídias existentes, tracking, checkout, preços, v1, v2, homepage e atalho `/quiz` ficam preservados. Uma imagem nova para a capa é permitida neste escopo. O root concluirá imagem, CSS, copy e metadata antes de liberar os gates.

Fetch confirmou a produção `0aa87aff78f841effb275340d5fe4a1af1a03c38`. Branch `feat/quiz-041-black` criada na mesma worktree `.local/quiz-038-vsl`, a partir do fechamento documental local `f5f0baa1d9fdf108ce89da3d7efa7edf21fa470d`, sem delta externo nem nova instalação de dependências.

## Critérios de aceite

- [x] Revisar copy direta, imagem dramática, hierarquia e cores somente da capa v3, mantendo a identificação publicitária e sem estatísticas ou resultados inventados.
- [x] Preservar CTA nativo para `/quiz/v3-editorial/quiz/`, atribuição, callback/fallback e seletores existentes de tracking.
- [x] Manter legibilidade, responsividade, foco e navegação por teclado na capa.
- [x] Preservar questionário, progresso, VSL, instrumentação, checkout, preços, demais mídias, v1, v2, homepage e `/quiz`.
- [x] Aprovar lint, TypeScript, testes, build/check:build e QA independente da capa e regressões relevantes.
- [ ] Publicar após GO root/QA e verificar deployment READY, quatro rotas, assets e rollback.

## Coordenação

- Root: capa TSX/CSS, nova imagem e metadata da página, conteúdo e revisão visual.
- QA: navegador, mobile/desktop, CTA/atribuição, evidências e regressões.
- @devops: story, gates/build, Git e publicação após liberação.

Sem novas dependências, eventos, SDKs ou alterações em integrações. As limitações externas Meta/Purchase já documentadas não são alteradas nem contornadas por esta atualização visual.

## Publicação e rollback

Projeto Vercel `murillo-digital/cowboy-site`; manter as quatro entradas HTML da QUIZ-040. Rollback conhecido: `dpl_FXsFknKy7aRMD5ct66gvxas76amC`. Usar PR, verificar o SHA exato e deixar o merge gerar o deploy automaticamente, sem publicação manual duplicada.

## Validação

Copy/CSS/metadata passaram por lint JavaScript de 52 arquivos e ESLint, TypeScript e 100 testes (55 do site, 16 de fluxo e 29 de tracking). A imagem final foi integrada pelo root e o build/check:build aprovou 131 arquivos, quatro entradas HTML e referências locais. Não houve alteração dos contratos de navegação ou instrumentação.

A imagem ilustrativa `capa-black-v3.webp` tem 1448 × 1086 px, 49.676 bytes e SHA-256 `a561286dcab60ada67f98a3a3d9b5ab67fce120dc4d56de76ded655022cfec50`. O root inspecionou e aprovou o asset. O prompt e a procedência estão documentados; o PNG original permanece em `.local/quiz-041-image/original.png`, fora do Git e do pacote público.

Servidor local em `http://127.0.0.1:4411`, servindo `dist` com as APIs existentes. QA liberada para seis casos editoriais existentes e capturas em 375, 390 e 1440 px. Evidências ficam locais; o fechamento documental final não deve disparar redeploy adicional.

QA independente aprovada: seis E2E existentes passaram em 15,3 segundos, sem mudanças nos arquivos de teste. Foram verificados capa, fluxo de 18 etapas, VSL real/fallback, três kits, atribuição/linker, opt-out e GPC. Capturas em 375, 390 e 1440 px confirmaram CTA acima da dobra, ausência de overflow, imagem íntegra, recorte desktop, teclado/foco e contraste. Evidências locais em `test-results/quiz-041/` (`capa-mobile.png`, `capa-mobile-390.png`, `capa-desktop-1440.png` e `qa-screen.json`). Coleta externa e compra ficaram bloqueadas.

O root conferiu as capturas em 375 e 1440 px, aprovou imagem, visual e botão, e autorizou commit, PR, merge e publicação automática sem ajustes adicionais. Nenhuma configuração externa de analytics foi alterada nesta atualização.

## File List

- `docs/stories/QUIZ-041-capa-black.md`
- `docs/research/quiz-041-image-prompt.md`
- `packages/cowboy-quiz/public/sites/cowboy/capa-black-v3.webp`
- `packages/cowboy-quiz/src/app/quiz/v3-editorial/page.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-editorial.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-editorial.module.css`
