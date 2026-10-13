# QUIZ-041 — Capa v3 com comunicação mais direta

Status: concluída — capa atualizada e verificada em produção.

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
- [x] Publicar após GO root/QA e verificar deployment READY, quatro rotas, assets e rollback.

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

## Publicação concluída

PR [#25](https://github.com/murillocaetano742/cowboy-site/pull/25), head `32c2929110dc2382e9c7084e47213e96ad846071`, com checks Vercel e Vercel Preview Comments aprovados e SHA exato conferido antes do merge. Merge `09ec3e1dd642266997a4a9df76ab0cbb2a2e04b2` em 13/10/2026 às 23h09min46s UTC. O deploy Git automático gerou `dpl_Ej9xb4MhNo33cbbJyRh8g5bKKetN`, READY/Production, URL `https://cowboy-site-kw5y18kb6-murillo-digital.vercel.app`, com os aliases principal e www confirmados. Não houve deploy manual duplicado.

[Capa publicada](https://cowboyenergiamasculina.com.br/quiz/v3-editorial/). Às 23h11min34s UTC, as quatro rotas — capa, questionário v3, v1 e v2 — responderam HTTP 200 e seus HTML foram idênticos aos da implantação obtidos por `vercel curl` autenticado. SHA-256 da capa: `15e665ff3995b0657b665f4136847984f83dc6ad9a689cedc81f5acf45a19bbc`. A manchete atualizada, a identificação publicitária, o CTA para o questionário e a nova imagem foram confirmados no HTML público.

Os 16 assets referenciados responderam 200. A imagem retornou `image/webp`, com SHA-256 `a561286dcab60ada67f98a3a3d9b5ab67fce120dc4d56de76ded655022cfec50`, idêntico ao arquivo aprovado. Os dois bundles de instrumentação e fluxo/player identificados na evidência QUIZ-040 mantiveram seus hashes nesta publicação. A homepage permaneceu igual; `/quiz` manteve 307 para v1 com query preservada. O MP4 respondeu 206 `video/mp4` para Range 0–1023 de 30.576.839 bytes; o poster manteve o hash original.

A consulta de logs de erro da implantação na janela de 15 minutos retornou zero entradas. Evidência privada: `.local/quiz-041-final-http.json`. O servidor local 4411 foi encerrado e a ausência de listener confirmada; capturas e PNG original foram preservados localmente. Rollback: `dpl_FXsFknKy7aRMD5ct66gvxas76amC`.

Esta alteração visual não repetiu configuração externa nem homologação de GA4, Meta ou Purchase. A prova anterior de recepção GA4 e as limitações externas permanecem nos documentos das respectivas entregas. O fechamento documental fica em commit local, sem novo push nem redeploy apenas por documentação.

## File List

- `docs/stories/QUIZ-041-capa-black.md`
- `docs/research/quiz-041-image-prompt.md`
- `packages/cowboy-quiz/public/sites/cowboy/capa-black-v3.webp`
- `packages/cowboy-quiz/src/app/quiz/v3-editorial/page.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-editorial.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-editorial.module.css`
