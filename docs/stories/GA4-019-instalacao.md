# GA4-019 — Instalar a propriedade Google Analytics informada

Status: GA4 publicado; aguardando teste no painel Google e corrigindo a rota alternativa `/nova`.

## Objetivo

Instalar o GA4 `G-VYR2542XCN`, fornecido pelo proprietário na captura da tela de configuração do Google, nas páginas públicas da COWBOY. Publicar e orientar a verificação no painel sem declarar coleta confirmada antes do teste.

## Critérios

- [x] Conferir o ID na captura enviada pelo proprietário.
- [x] Carregar uma única tag GA4 em cada página pública HTML.
- [x] Preservar a fila existente e respeitar Global Privacy Control.
- [x] Atualizar a informação de privacidade.
- [x] Validar build, sintaxe, testes e preview Vercel.
- [x] Publicar e conferir o artefato no domínio público.
- [ ] Corrigir e verificar `/nova`, cujo teste de produção identificou resposta 404.
- [ ] Obter resultado do teste de instalação no Google Analytics.

## Escopo e limites

Esta etapa instala a tag de medição básica. Checkout Cartpanda, medição entre domínios, eventos de compra e Search Console dependem de configurações e validação separadas. Nenhum evento de compra é simulado.

## Validação local

- `npm run check:build`: 40 arquivos, referências e isolamento público aprovados.
- `npm run lint`: sintaxe de 34 arquivos JavaScript aprovada.
- `npm test`: 31/31 testes passaram, incluindo uma configuração por página, preservação da fila e opt-out.
- `git diff --check`: passou. Projeto JavaScript sem script TypeScript.

## File List

- `assets/js/cowboy-google.js`
- `cowboy-nova.html`
- `privacidade.html`
- `termos.html`
- `scripts/build-site.js`
- `tests/integrations/google-analytics.test.js`
- `docs/stories/GA4-019-instalacao.md`
- `vercel.json`

## Publicação e rota alternativa

- PR #4 publicado em `main`, commit `b1191abc489d17c75b85f847f1d8cd80733b966e`.
- Preview e produção Vercel concluídos com sucesso. Em 2026-09-09 às 03:02 UTC, `/`, `/privacidade`, `/termos` e o JavaScript GA4 retornaram HTTP 200 e conteúdo idêntico ao build validado; uma referência à tag em cada página.
- O teste identificou `/nova` com HTTP 404. O destino `/cowboy-nova` responde HTTP 200. A correção remove a extensão `.html` do destino do rewrite, conforme a [documentação oficial da Vercel](https://vercel.com/docs/project-configuration/vercel-json#rewrites) para `cleanUrls: true`.
- A recepção de dados pelo Google Analytics ainda depende de confirmação na conta do proprietário.
