# QUIZ-043 — Headline afirmativa e incentivo na capa

Status: implementada; gates, QA e revisão visual de root aprovados. Publicação autorizada.

## Pedido e base

O proprietário pediu uma headline afirmativa forte na capa anterior ao quiz e um incentivo ou recompensa por responder. O exemplo de 134 mil homens não veio acompanhado de fonte. A copy final deve usar fatos verificáveis e explicitar uma entrega real do fluxo existente, sem inventar volume de usuários, prometer cura ou garantir resultados.

Escopo: capa `/quiz/v3-editorial/`, sua metadata e, se necessário para a nova copy, ajuste pontual de CSS responsivo. Preservar questionário, paleta vermelha v3, v1/v2, tracking, atribuição, consentimento, VSL, checkout, preços, mídia e homepage. A recompensa será definida por root de acordo com o que o quiz efetivamente entrega, sem nova funcionalidade presumida.

Fetch confirmou `origin/main` em `4d965172c7e55fb0a6224a7547b49a6c632724a7`. Branch `feat/quiz-043-headline` criada na mesma worktree `.local/quiz-038-vsl`, a partir de `7fb9aa9a81756299a946cf7f184236a5c5dc20da`, com árvore limpa e dependências/evidências preservadas.

## Critérios de aceite

- [x] Apresentar headline afirmativa, direta e coerente com a orientação do proprietário.
- [x] Explicitar incentivo verificável por responder, alinhado à entrega real do fluxo, sem inventar estatísticas, descontos ou garantias.
- [x] Preservar CTA, destino do quiz, identificação publicitária e contratos de tracking/atribuição.
- [x] Manter legibilidade, hierarquia, foco e responsividade em mobile e desktop.
- [x] Preservar todas as versões, etapas, VSL, cores, preços e integrações fora da capa.
- [x] Aprovar lint, TypeScript, testes, build/check:build e QA independente.
- [ ] Publicar após GO root/QA e confirmar READY, quatro rotas, assets e rollback.

## Coordenação e validação

Root possui copy, metadata e eventual ajuste de CSS. QA revisa a interface e os contratos existentes. @devops possui story, gates/build, Git e publicação. Servidor de QA previsto em `http://127.0.0.1:4413` com o artefato final `dist` e APIs locais.

Sem novas dependências ou integrações previstas. As limitações externas Meta/Purchase já documentadas permanecem fora desta atualização de copy. Evidências de QA ficam locais; fechamento documental após publicação não deve gerar novo deploy.

## Publicação e rollback

Projeto Vercel `murillo-digital/cowboy-site`. Rollback confirmado READY: `dpl_9NKXF3aFHxjYzhpsVmW7NCy4d6KX`, em `https://cowboy-site-dn27d4np4-murillo-digital.vercel.app`, produção de base `4d965172c7e55fb0a6224a7547b49a6c632724a7`. Manter quatro entradas HTML e `/quiz` apontando para v1. Usar PR e merge do SHA exato após os checks, com deploy automático único.

## Implementação e gates

Headline final: “Chega de deixar o medo de falhar comandar sua vida sexual.” A capa convida a responder 14 perguntas para desbloquear um resultado na hora, definido como resumo baseado nas respostas e acesso à apresentação da COWBOY. CTA: “Quero desbloquear meu resultado”. A gratuidade, ausência de cadastro e entrega ao concluir são explícitas. A seção explicativa, chamada final e metadata foram alinhadas. Não foi acrescentada estatística de público, promessa de cura ou resultado clínico garantido.

Somente strings da capa e metadata foram alteradas; estrutura, classes CSS, handlers, tracking e links permanecem iguais. O E2E existente teve apenas a expectativa textual do CTA atualizada. Lint JavaScript de 52 arquivos e ESLint, TypeScript e 100 testes (55 site, 16 fluxo, 29 tracking) aprovados. Build/check:build aprovados com 131 arquivos, quatro entradas HTML e homepage preservada. Artefato final disponível em 4413 para QA independente; `git diff --check` aprovado.

QA independente aprovou 6/6 E2E editoriais em 15,4 segundos. Capturas em 375/390/1440 pixels, teclado/foco e ausência de overflow aprovados; o CTA aparece acima da dobra nos dois celulares. Tracking, UTMs, GPC, linker, VSL e três kits validados com coleta externa e pedidos bloqueados. A auditoria confirmou que o número de 134 mil foi omitido por ausência de fonte e que o ganho descrito corresponde ao resumo e à apresentação existentes. Root inspecionou as capturas mobile/desktop e concedeu GO visual final de publicação. Evidências preservadas localmente em `test-results/quiz-043/`.

## File List

- `docs/stories/QUIZ-043-headline-capa.md`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-editorial.tsx`
- `packages/cowboy-quiz/src/app/quiz/v3-editorial/page.tsx`
- `tests/e2e/cowboy-quiz-editorial.spec.js`
