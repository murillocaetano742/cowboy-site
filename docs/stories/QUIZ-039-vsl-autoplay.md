# QUIZ-039 — VSL inicia quando fica visível

Status: implementada; gates, QA e revisões aprovados, publicação liberada pelo root.

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
- [ ] Após GO root/QA, publicar via Git e verificar deployment READY, ambas as rotas, recursos e rollback.

## Coordenação e publicação

O root implementa o player e revisa o resultado. QA mantém os testes de navegador e evidências. @devops prepara a story, executa gates/build e opera Git/push/deploy após liberação. Não há alteração de SDK, pixel, domínio, checkout nem pedido de compra artificial.

Projeto Vercel: `murillo-digital/cowboy-site`. Rollback conhecido antes da atualização: `dpl_BWrdNT4w7WRKBi3Fog5wXQ2cRPWm`, produção da QUIZ-038. Publicação automática pelo merge Git, sem deploy manual duplicado. A restrição externa Meta e a homologação Purchase continuam documentadas separadamente.

## Validação

Gates locais em 13/10/2026: lint JavaScript de 51 arquivos e ESLint do pacote, TypeScript e 89 testes (53 do site, 13 do fluxo e 23 de tracking) aprovados. Build/check:build aprovados com 119 arquivos, ambas as rotas, allowlist pública e homepage preservada. `git diff --check` não encontrou erros de whitespace.

Servidor local em `http://127.0.0.1:4399`, servindo o build `dist` com as APIs existentes. QA aprovou quatro casos Playwright em 22,0 segundos: limiar simulado de visibilidade 49%/51%, reprodução e decodificação reais inicialmente silenciadas, ativação do áudio por botão, pausa manual sem reinício ao rolar, rejeição do autoplay com ação explícita e recuperação, v1 sem download de vídeo, erro de mídia 404, GPC e continuidade Google/linker/API. SDKs e checkout ficaram interceptados, sem pedido nem compra. Evidências preservadas localmente em `test-results/quiz-039/`. O root inspecionou e aprovou as telas de reprodução silenciada em 375 px e autoplay bloqueado em 390 px. A revisão final independente e o GO de publicação precedem o push.

A revisão independente identificou que `onVolumeChange` deveria espelhar somente a propriedade `muted`, sem converter volume zero em mute. Após essa correção de uma linha, lint, TypeScript e build/check:build passaram novamente. O reteste final aprovou quatro casos em 21,7 segundos, incluindo o slider 0 → 0,6 permanecendo com `muted=false`. O root recebeu o GO final da QA e autorizou commit, push, PR, merge e publicação automática.

## File List

- `docs/stories/QUIZ-039-vsl-autoplay.md`
- `docs/integracoes/quiz-038-vsl.md`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-vsl.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-vsl.module.css`
- `tests/e2e/cowboy-quiz-vsl.spec.js`
