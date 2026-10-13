# QUIZ-039 — VSL inicia quando fica visível

Status: concluída — atualização publicada e verificada em produção.

## Pedido e base

Atualizar somente a VSL de `/quiz/v2-vsl/` para iniciar sem som quando o player entrar na tela durante a rolagem. Preservar `/quiz/v1-direto/`, o atalho `/quiz`, a homepage, o checkout e a atribuição existentes.

Base de produção confirmada após fetch: `b9de4a924a574d6d21d7f9f8c10339fb4ba4cf50`. A branch `feat/quiz-039-autoplay` reutiliza a worktree `.local/quiz-038-vsl` a partir do fechamento documental `de506cb`, sem mudança funcional adicional na base. Dependências e evidências locais anteriores são preservadas; o checkout original permanece intocado.

## Critérios de aceite

- [x] Somente na v2, tentar autoplay uma única vez quando pelo menos 50% do player estiver visível, usando IntersectionObserver.
- [x] Iniciar com áudio silenciado e reprodução inline; disponibilizar botão claro para ativar o som.
- [x] Não baixar a mídia antes de atingir a visibilidade necessária; preservar poster e controles nativos.
- [x] Não pausar automaticamente ao sair da tela e não retomar automaticamente após uma pausa manual.
- [x] Exibir ação explícita para iniciar a reprodução se o navegador rejeitar autoplay; preservar o estado de falha de mídia e o acesso aos kits.
- [x] Registrar playback somente a partir de reprodução real, mantendo marcos, deduplicação e privacidade existentes.
- [x] Preservar v1, homepage, preços, três kits, linker, UTMs e proteções GPC/opt-out.
- [x] Executar lint, TypeScript, testes, build e QA de navegador com autoplay, áudio, pausa manual, fallback e regressão v1.
- [x] Após GO root/QA, publicar via Git e verificar deployment READY, ambas as rotas, recursos e rollback.

## Coordenação e publicação

O root implementa o player e revisa o resultado. QA mantém os testes de navegador e evidências. @devops prepara a story, executa gates/build e opera Git/push/deploy após liberação. Não há alteração de SDK, pixel, domínio, checkout nem pedido de compra artificial.

Projeto Vercel: `murillo-digital/cowboy-site`. Rollback conhecido antes da atualização: `dpl_BWrdNT4w7WRKBi3Fog5wXQ2cRPWm`, produção da QUIZ-038. Publicação automática pelo merge Git, sem deploy manual duplicado. A restrição externa Meta e a homologação Purchase continuam documentadas separadamente.

## Validação

Gates locais em 13/10/2026: lint JavaScript de 51 arquivos e ESLint do pacote, TypeScript e 89 testes (53 do site, 13 do fluxo e 23 de tracking) aprovados. Build/check:build aprovados com 119 arquivos, ambas as rotas, allowlist pública e homepage preservada. `git diff --check` não encontrou erros de whitespace.

Servidor local em `http://127.0.0.1:4399`, servindo o build `dist` com as APIs existentes. QA aprovou quatro casos Playwright em 22,0 segundos: limiar simulado de visibilidade 49%/51%, reprodução e decodificação reais inicialmente silenciadas, ativação do áudio por botão, pausa manual sem reinício ao rolar, rejeição do autoplay com ação explícita e recuperação, v1 sem download de vídeo, erro de mídia 404, GPC e continuidade Google/linker/API. SDKs e checkout ficaram interceptados, sem pedido nem compra. Evidências preservadas localmente em `test-results/quiz-039/`. O root inspecionou e aprovou as telas de reprodução silenciada em 375 px e autoplay bloqueado em 390 px. A revisão final independente e o GO de publicação precedem o push.

A revisão independente identificou que `onVolumeChange` deveria espelhar somente a propriedade `muted`, sem converter volume zero em mute. Após essa correção de uma linha, lint, TypeScript e build/check:build passaram novamente. O reteste final aprovou quatro casos em 21,7 segundos, incluindo o slider 0 → 0,6 permanecendo com `muted=false`. O root recebeu o GO final da QA e autorizou commit, push, PR, merge e publicação automática.

## Publicação concluída

PR [#23](https://github.com/murillocaetano742/cowboy-site/pull/23), head `b43df1877dfb363779ebe05cd6b93dc0e7fc22d2`, com checks Vercel e Vercel Preview Comments aprovados e SHA exato conferido antes do merge. Merge `631063e30df726072c95887c615bb7228dfeffe8` em 13/10/2026 às 15h40min28s UTC. O deploy Git automático gerou `dpl_G4R8G5J8DUxEPNwzciECp8UBJSWj`, READY/Production, URL `https://cowboy-site-kuqie7tw2-murillo-digital.vercel.app`, com aliases principal e www confirmados. Não houve deploy manual duplicado.

Às 15h42min18s UTC, `/quiz/v2-vsl/` e `/quiz/v1-direto/` responderam 200 no domínio canônico e seus HTML foram idênticos aos da implantação obtidos com `vercel curl` autenticado. SHA-256 v2: `87ed0dd4d713679d72f96a9e80bc01183b4468646ed73a0359df1a4d35c1690b`; v1: `6e0a5c28715515395e021f4673755e95aaadf9e96c0e374b766bc0185ae4d108`. Os 14 assets referenciados responderam 200. O bundle `01oiag_1zhca8.js` contém `IntersectionObserver` e a ação de reprodução com som; SHA-256 `4f0085842c33fa19d84a7167fd559093b1d54b4cc11a48105ee18d1baab248dc`.

A homepage permaneceu igual; `/quiz` preservou 307 para v1 com a query íntegra. O MP4 respondeu 206 `video/mp4` para Range 0–1023 de 30.576.839 bytes, e o poster respondeu 200 com hash igual ao original. A consulta de logs de erro da implantação na janela de 15 minutos retornou zero entradas. Evidência privada `.local/quiz-039-final-http.json`.

O servidor local 4399 foi encerrado e a ausência de listener confirmada; as evidências QA foram preservadas. Rollback: `dpl_BWrdNT4w7WRKBi3Fog5wXQ2cRPWm`. O root não realizou outra sessão completa de analytics em produção nesta atualização; nenhum pedido, pagamento ou Purchase foi criado. O fechamento documental fica em commit local, sem novo push nem redeploy apenas por documentação.

## File List

- `docs/stories/QUIZ-039-vsl-autoplay.md`
- `docs/integracoes/quiz-038-vsl.md`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-vsl.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-vsl.module.css`
- `tests/e2e/cowboy-quiz-vsl.spec.js`
