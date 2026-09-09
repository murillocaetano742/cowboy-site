# GA4-019 — Instalar a propriedade Google Analytics informada

Status: Implementação validada; preparando preview e publicação.

## Objetivo

Instalar o GA4 `G-VYR2542XCN`, fornecido pelo proprietário na captura da tela de configuração do Google, nas páginas públicas da COWBOY. Publicar e orientar a verificação no painel sem declarar coleta confirmada antes do teste.

## Critérios

- [x] Conferir o ID na captura enviada pelo proprietário.
- [x] Carregar uma única tag GA4 em cada página pública HTML.
- [x] Preservar a fila existente e respeitar Global Privacy Control.
- [x] Atualizar a informação de privacidade.
- [ ] Validar build, sintaxe, testes e preview Vercel.
- [ ] Publicar e conferir o artefato no domínio público.
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
