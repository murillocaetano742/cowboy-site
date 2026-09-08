# REBUILD-009 — Prévia histórica da página de vendas

Status: Concluída — prévia isolada pronta para revisão visual

## Objetivo

Disponibilizar uma cópia local isolada da página de vendas histórica para revisão visual, sem modificar a versão atual e sem publicar ou reativar integrações externas.

## Origem escolhida

Será usada `loja.html` do commit `d4c726d9d2ae53c0394dfc74f4060dcb86a84472` (27/07/2026), a última versão registrada da página de vendas antes da reconstrução atual. Ela contém a apresentação completa, galerias e depoimentos em vídeo; `index.html` daquele commit é a página institucional e não será apresentada como a venda histórica.

O commit `30a188e8430c4e0d658c6e39cd487c06883fd896` também contém uma loja anterior, mas é anterior e tem menos assets; foi mantido somente como referência no histórico.

## Critérios de aceitação

- [x] Copiar a página e os assets do commit escolhido para `.local/`, sem alterar os arquivos atuais.
- [x] Desativar pixels, rastreadores, coleta e saídas de checkout na cópia de revisão.
- [x] Servir a cópia somente no endpoint local isolado, sem expor a raiz do projeto, documentação ou credenciais.
- [x] Confirmar HTTP 200 da página histórica e de seus assets locais.
- [x] Registrar URLs local da versão atual e da prévia histórica.

## File List

- `docs/stories/REBUILD-009-preview-historico.md`
- `.local/historico-cowboy-d4c726d/`
- `scripts/serve-historic-review.js`

## Verificação

- Atual: `http://127.0.0.1:4173/` respondeu HTTP 200.
- Histórica: `http://127.0.0.1:4174/` respondeu HTTP 200 e identifica o commit no topo.
- A página histórica foi entregue com `script-src 'none'`, sem blocos `script`/`noscript`, links externos de âncora ou folhas de estilo externas.
- `imagens/kit-4-frascos.jpg` e `videos/depoimento-1.mp4` responderam HTTP 200 com os MIME esperados.
- Tentativas de abrir o TAR de origem, `docs/` e `.env` no servidor histórico responderam 404.
