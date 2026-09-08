# REBUILD-005 — Revisão independente da vitrine

Status: Revisão local concluída — parecer conditional, homologação externa e dados do vendedor pendentes

## Objetivo

Revisar a implementação comercial sem produzir suas correções, com evidências reproduzíveis de comportamento, segurança, consistência e qualidade visual.

## Critérios de aceitação

- [x] Ler produto, oferta, código comercial e contratos de logística.
- [x] Executar os testes existentes e registrar seus limites.
- [x] Inspecionar as três imagens finais.
- [x] Exercitar cenários independentes de falha e fluxo de compra.
- [x] Revisar a versão final após correções do frontend e da API.
- [x] Entregar achados classificados, limitações e hashes dos arquivos revisados.
- [x] Executar HTTP real no servidor local e verificar isolamento de arquivos públicos.

## File List

- `docs/stories/REBUILD-005-qa-independente.md`
- `docs/qa/relatorio-v2.md`
- `tests/qa/api-boundaries.test.js`
- `tests/qa/frontend-flow.test.js`
- `tests/qa/http-smoke.js`
- `tests/qa/checkout-local.js`

## Rodada final local

`npm.cmd test`: 21/21. `node tests/qa/http-smoke.js http://127.0.0.1:4173`: 25/25 requisições com resultados esperados. `npm.cmd run check:build`: 14 arquivos permitidos, referências e isolamento passaram. `npm.cmd run lint`: sintaxe de 17 arquivos passou; não é ESLint/TypeScript. Os dois achados de entrada da API foram corrigidos pelo autor e os testes independentes agora passam.

## Último aceite local com links configurados

- [x] Padronização confirmada: comprimento23 × largura8 × altura8 cm, pacote0,5 kg, origem74475239.
- [x] Suíte21/21 reexecutada após alteração de eixos.
- [x] Smoke25/25 reexecutado: checkout302, frete503 sem Melhor Envio, arquivos internos404.
- [x] `node tests/qa/checkout-local.js`: 3/3 kits apontam ao host/variantes Cartpanda esperados e preservam UTMs, descartando campo arbitrário.
- [x] Nenhum redirecionamento seguido, acesso externo, solicitação de permissão ou pagamento realizado nesta rodada.

Validação do checkout na plataforma, pagamento e publicação permanecem pendentes; os resultados acima demonstram somente o redirecionamento pelo servidor local.

## Limites

O operador de contas é o único controlador do desktop. Simulação de DOM não equivale a teste visual de navegador, pagamento real, cotação real ou publicação.
