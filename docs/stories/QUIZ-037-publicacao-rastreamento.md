# QUIZ-037 — Publicação do quiz novo e integração de rastreamento

Status: publicação visual em andamento; rastreamento na etapa seguinte.

## Pedido e base

Publicar a última atualização do quiz COWBOY e conectar o rastreamento necessário. O usuário priorizou publicar a versão visual imediatamente para conferir no celular antes do trabalho de rastreamento. Fonte: `C:/Users/User/Downloads/cowboy-quiz`, atualização de 05/10/2026. Base do site: `7f3b989`, worktree isolado `.local/quiz-037-release`, branch `feat/quiz-037-tracking`.

## Critérios de aceite

- [x] Copiar a fonte atual em `packages/cowboy-quiz`, excluindo dependências, builds e pesquisa volumosa.
- [x] Exportar Next.js no build existente, publicando apenas `quiz/v1-direto`, `_next/static` e `sites`; preservar a VSL na raiz.
- [x] Criar atalho `/quiz` com redirecionamento e preservação dos parâmetros de campanha.
- [x] Preservar URLs de checkout e ampliar a passagem de identificadores Google permitidos.
- [ ] Concluir gates e publicar a versão visual em produção, verificando URL, arquivos e HTTPS.
- [ ] Integrar e validar os eventos de rastreamento sem enviar respostas pessoais ou de saúde.
- [ ] Registrar evidências e limites da verificação de checkout e Purchase.

## Publicação e rollback

Projeto existente Vercel `murillo-digital/cowboy-site`; Node 24, site estático e APIs existentes. A produção anterior é `dpl_7qSWXHtPTwpUNToH8NkuWNJCDENU`, URL `https://cowboy-site-oeip6szk4-murillo-digital.vercel.app`. Rollback disponível por `vercel rollback` para essa implantação. Nenhum pedido ou evento de compra será fabricado.

## File List

- `packages/cowboy-quiz/` (fonte, configurações e assets públicos)
- `scripts/build-quiz.js`
- `scripts/build-site.js`
- `scripts/check-build.js`
- `scripts/serve-site.js`
- `config/commerce.js`
- `tests/integrations/google-linker.test.js`
- `tests/qa/quiz-build.test.js`
- `package.json`
- `.gitignore`
- `.vercelignore`
- `vercel.json`
- `docs/stories/QUIZ-037-publicacao-rastreamento.md`
