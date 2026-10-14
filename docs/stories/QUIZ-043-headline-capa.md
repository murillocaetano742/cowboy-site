# QUIZ-043 — Headline afirmativa e incentivo na capa

Status: concluída e publicada; fechamento documental local, sem novo deploy.

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
- [x] Publicar após GO root/QA e confirmar READY, quatro rotas, assets e rollback.

## Coordenação e validação

Root possui copy, metadata e eventual ajuste de CSS. QA revisa a interface e os contratos existentes. @devops possui story, gates/build, Git e publicação. Servidor de QA previsto em `http://127.0.0.1:4413` com o artefato final `dist` e APIs locais.

Sem novas dependências ou integrações previstas. As limitações externas Meta/Purchase já documentadas permanecem fora desta atualização de copy. Evidências de QA ficam locais; fechamento documental após publicação não deve gerar novo deploy.

## Publicação e rollback

Projeto Vercel `murillo-digital/cowboy-site`. Rollback confirmado READY: `dpl_9NKXF3aFHxjYzhpsVmW7NCy4d6KX`, em `https://cowboy-site-dn27d4np4-murillo-digital.vercel.app`, produção de base `4d965172c7e55fb0a6224a7547b49a6c632724a7`. Manter quatro entradas HTML e `/quiz` apontando para v1. Usar PR e merge do SHA exato após os checks, com deploy automático único.

## Implementação e gates

Headline final: “Chega de deixar o medo de falhar comandar sua vida sexual.” A capa convida a responder 14 perguntas para desbloquear um resultado na hora, definido como resumo baseado nas respostas e acesso à apresentação da COWBOY. CTA: “Quero desbloquear meu resultado”. A gratuidade, ausência de cadastro e entrega ao concluir são explícitas. A seção explicativa, chamada final e metadata foram alinhadas. Não foi acrescentada estatística de público, promessa de cura ou resultado clínico garantido.

Somente strings da capa e metadata foram alteradas; estrutura, classes CSS, handlers, tracking e links permanecem iguais. O E2E existente teve apenas a expectativa textual do CTA atualizada. Lint JavaScript de 52 arquivos e ESLint, TypeScript e 100 testes (55 site, 16 fluxo, 29 tracking) aprovados. Build/check:build aprovados com 131 arquivos, quatro entradas HTML e homepage preservada. Artefato final disponível em 4413 para QA independente; `git diff --check` aprovado.

QA independente aprovou 6/6 E2E editoriais em 15,4 segundos. Capturas em 375/390/1440 pixels, teclado/foco e ausência de overflow aprovados; o CTA aparece acima da dobra nos dois celulares. Tracking, UTMs, GPC, linker, VSL e três kits validados com coleta externa e pedidos bloqueados. A auditoria confirmou que o número de 134 mil foi omitido por ausência de fonte e que o ganho descrito corresponde ao resumo e à apresentação existentes. Root inspecionou as capturas mobile/desktop e concedeu GO visual final de publicação. Evidências preservadas localmente em `test-results/quiz-043/`.

## Fechamento da publicação

- PR [#27](https://github.com/murillocaetano742/cowboy-site/pull/27), commit de implementação `39fb204c609bd65ec384e020ef351dca704bc381`. Os dois checks Vercel passaram antes do merge do SHA exato.
- Merge de produção `475f7d7a19f788ed01dc273e6f42d380208dad62`, em 13/10/2026 às 23:53:09 UTC. Deploy automático `dpl_Fm7F5c6PzxQdfEumDi1doiwZUtwB`, status READY, sem deploy manual paralelo.
- Deployment imutável `https://cowboy-site-rcwihhg9x-murillo-digital.vercel.app`; aliases canônicos com e sem `www` confirmados. [Capa atualizada](https://cowboyenergiamasculina.com.br/quiz/v3-editorial/) publicada, mantendo o [questionário v3](https://cowboyenergiamasculina.com.br/quiz/v3-editorial/quiz/), [v1](https://cowboyenergiamasculina.com.br/quiz/v1-direto/) e [v2](https://cowboyenergiamasculina.com.br/quiz/v2-vsl/).
- Smoke público às 23:54:30 UTC: quatro rotas HTTP 200 com HTML igual ao deployment autenticado e 16 assets HTTP 200. Headline afirmativa, CTA, incentivo verificável e nova metadata confirmados no domínio. HTML da capa SHA-256 `67f8a8282f8958e8715c9d6191e239195e7b2ff4d9770dec57c3493253a8d241`.
- Bundle de tracking preservado, SHA-256 `917114cd1c04b632ef994bbc4ff9b3a40bdaf3b1bcc6bd0ad13fe45436d7234c`. Bundle de fluxo/VSL preservado, SHA-256 `8980a1bbfbaf985c440c5dddc411cdf9a3dd9e2ad623bc10d29eb5d30d736f21`. A paleta vermelha permanece isolada no wrapper v3.
- Imagem da capa e poster mantêm os hashes aprovados. Homepage idêntica à fonte existente; `/quiz` responde 307 para v1 com query preservada. MP4 responde 206 ao intervalo `bytes=0-1023`, MIME `video/mp4`, total de 30.576.839 bytes.
- Consulta de erros do deployment nos últimos 15 minutos: zero registros. Servidor 4413 encerrado, ausência de listener confirmada e evidências QA/HTTP/logs preservadas localmente. Nenhuma nova configuração externa ou homologação Meta/Purchase foi alegada.
- Rollback permanece `dpl_9NKXF3aFHxjYzhpsVmW7NCy4d6KX`. Este fechamento altera somente a story, em commit local sem push, para evitar redeploy documental.

## File List

- `docs/stories/QUIZ-043-headline-capa.md`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-editorial.tsx`
- `packages/cowboy-quiz/src/app/quiz/v3-editorial/page.tsx`
- `tests/e2e/cowboy-quiz-editorial.spec.js`
