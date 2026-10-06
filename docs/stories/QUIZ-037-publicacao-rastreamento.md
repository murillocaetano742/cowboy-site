# QUIZ-037 — Publicação do quiz novo e integração de rastreamento

Status: versão visual publicada; implementação de rastreamento validada e liberada para publicação, com bloqueio externo Meta e homologação de compra pendentes.

## Pedido e base

Publicar a última atualização do quiz COWBOY e conectar o rastreamento necessário. O usuário priorizou publicar a versão visual imediatamente para conferir no celular antes do trabalho de rastreamento. Fonte: `C:/Users/User/Downloads/cowboy-quiz`, atualização de 05/10/2026. Base do site: `7f3b989`, worktree isolado `.local/quiz-037-release`, branch `feat/quiz-037-tracking`.

## Critérios de aceite

- [x] Copiar a fonte atual em `packages/cowboy-quiz`, excluindo dependências, builds e pesquisa volumosa.
- [x] Exportar Next.js no build existente, publicando apenas `quiz/v1-direto`, `_next/static` e `sites`; preservar a VSL na raiz.
- [x] Criar atalho `/quiz` com redirecionamento e preservação dos parâmetros de campanha.
- [x] Preservar URLs de checkout e ampliar a passagem de identificadores Google permitidos.
- [x] Concluir gates e publicar a versão visual em produção, verificando URL, arquivos e HTTPS.
- [x] Integrar e validar o contrato dos eventos sem enviar respostas pessoais ou de saúde, distinguindo implementação de recebimento.
- [x] Registrar evidências e limites da verificação de checkout e Purchase.
- [ ] Confirmar liberação externa e recebimento dos eventos Meta: SDK sinaliza bloqueio de fonte/categoria.
- [ ] Homologar Purchase por pagamento real aprovado Appmax e correlacionar recebimento; nenhuma compra de teste foi autorizada ou realizada.

## Publicação e rollback

Projeto existente Vercel `murillo-digital/cowboy-site`; Node 24, site estático e APIs existentes. A produção anterior é `dpl_7qSWXHtPTwpUNToH8NkuWNJCDENU`, URL `https://cowboy-site-oeip6szk4-murillo-digital.vercel.app`. Rollback disponível por `vercel rollback` para essa implantação. Nenhum pedido ou evento de compra será fabricado.

### Versão visual publicada

Commit visual `8499b49`; deployment `dpl_GYBbQRMpMp62C9egTaZT57c814Yc`, **READY / Production**, URL imutável `https://cowboy-site-bwy9k6v5m-murillo-digital.vercel.app`. Link público: `https://cowboyenergiamasculina.com.br/quiz/v1-direto/`. O deploy foi isolado em `.local/quiz-037-visual` para permitir o trabalho posterior de rastreamento sem alterar o snapshot enviado.

Gates aprovados: lint JavaScript (48 arquivos) e ESLint quiz; TypeScript; 52 testes do site e 13 do quiz; build e check:build (113 arquivos); configuração Appmax dos três kits. QA independente percorreu o fluxo completo em 375 e 390 px, sem overflow, erro JavaScript ou recurso 404, conferindo kits e UTMs com analytics/checkout bloqueados.

Verificação pública por HTTP: rota canônica 200 `text/html`; `/quiz?utm_source=qa_route_only` responde 307 com query preservada; `/` responde 200 e conteúdo normalizado idêntico à VSL original; vídeo de depoimento responde 200 `video/mp4`. As consultas HTTP não executam scripts de analytics.

A primeira tentativa (`dpl_9uvPfHh4syHdwigfEkTUPjF9hZFB`) falhou antes da publicação porque as exclusões/reinclusões herdadas de `.vercelignore` omitiram um asset exigido pelo build no upload CLI. A correção removeu todas as regras de `imagens` e `videos` da origem de upload; o build continua controlando os arquivos efetivamente públicos por allowlist. A produção anterior permaneceu ativa durante a falha.

O npm reportou 11 advisories herdados do quiz (10 high, 1 critical): cadeia shadcn/glob/eslint, proxy-addr e source-map-js. Nenhum advisory Next/React foi listado. Nenhum `node_modules` é publicado neste export estático; atualização de dependências permanece manutenção separada, sem atualização forçada nesta entrega visual.

### Preparação do rastreamento

O gate `npm test` inclui agora 52 testes do site, 13 do fluxo e 16 testes isolados de rastreamento (81 no total). Lint JavaScript de 50 arquivos e ESLint, TypeScript, build e check:build passaram com a implementação de tracking. O arquivo `docs/integracoes/quiz-037-tracking.md` registra IDs, configurações externas confirmadas, contrato dos eventos e limitações de homologação de compra.

A QA com o SDK Google real, mantendo a coleta interceptada localmente, comprovou `_gl` gerado no clique e preservado até o redirecionamento Appmax, UTMs e `gbraid`, 17 etapas neutras, deduplicação, kit/valor e ausência de respostas ou dados de saúde nos payloads inspecionados. GPC/opt-out e falha de SDK preservam o funcionamento do checkout.

O SDK Meta real retornou configuração pública `prohibitedPixels`, `lockWebpage: true`, `blockReason: source_category`; o SDK enfileira os eventos mas não envia. Essa restrição externa é um bloqueio de recebimento Meta, não um teste de entrega aprovado. O root autorizou publicar os ganhos GA4/UTM/linker com essa limitação documentada. Nenhum pixel, domínio ou categoria foi trocado para contornar a restrição. A integração de Purchase Appmax/UTMify permanece dependente da homologação real descrita no relatório.

A QA identificou que navegar imediatamente podia perder o batch Google com `begin_checkout`. A correção aguarda o callback de evento, com fallback independente de 800 ms, captura o href após a decoração do linker e mantém cliques modificados nativos. Os seis testes adicionais cobrem callback síncrono/assíncrono, SDK bloqueado, repetição de clique, opt-out e navegação modificada.

## File List

- `packages/cowboy-quiz/` (fonte, configurações e assets públicos)
- `scripts/build-quiz.js`
- `scripts/build-site.js`
- `scripts/check-build.js`
- `scripts/serve-site.js`
- `config/commerce.js`
- `tests/integrations/google-linker.test.js`
- `tests/qa/quiz-build.test.js`
- `tests/e2e/cowboy-quiz.spec.js`
- `tests/e2e/cowboy-quiz-tracking.spec.js`
- `packages/cowboy-quiz/scripts/check-tracking.mjs`
- `packages/cowboy-quiz/src/instrumentation-client.ts`
- `packages/cowboy-quiz/src/lib/quiz-tracking.ts`
- `packages/cowboy-quiz/src/lib/checkout-navigation.ts`
- `package.json`
- `.gitignore`
- `.vercelignore`
- `vercel.json`
- `docs/stories/QUIZ-037-publicacao-rastreamento.md`
- `docs/integracoes/quiz-037-tracking.md`
- `docs/integracoes/quiz-037-meta-block.md`
