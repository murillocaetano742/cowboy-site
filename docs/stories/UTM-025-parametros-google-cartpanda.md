# UTM-025 — Parâmetros Google até o checkout Cartpanda

Status: implementação local validada; publicação do site em andamento. Nenhuma configuração Google Ads salva nesta etapa.

## Solicitação e evidência

Proprietário forneceu o modelo UTMify Google/Cartpanda com CID `74579222594`. Teste pela página publicada e botão real de compra preservou as cinco UTMs e o CID, mas descartou `keyword`, `device` e `network`. Esses três campos não estavam nas listas de parâmetros permitidos do formulário e da API.

Conta Google Ads aberta: `122-583-9164`. Modelo de rastreamento e sufixo do URL final vazios. Solicitada identificação de conta exclusiva COWBOY ou compartilhada antes de decidir o alcance da configuração. Nenhuma campanha, anúncio ou orçamento alterado.

## Critérios

- [x] Preservar os nove parâmetros do modelo fornecido no percurso formulário → API → URL Cartpanda.
- [x] Manter bloqueio de parâmetros arbitrários e limite de 256 caracteres por valor.
- [x] Conferir persistência dos parâmetros permitidos na navegação interna.
- [x] Executar testes de regressão, sintaxe e build.
- [ ] Publicar a correção e verificar o percurso em produção.
- [ ] Configurar o modelo Google no escopo COWBOY identificado e reler o valor salvo.

## Modelo fornecido

```text
{lpurl}?utm_source=google&utm_campaign={campaignid}&utm_medium={adgroupid}&utm_content={creative}&utm_term={placement}::{keyword}&keyword={keyword}&device={device}&network={network}&cid=74579222594
```

O modelo pertence ao campo de rastreamento do Google Ads; não é um script para o Head da Cartpanda. Preservar macros e CID como fornecidos. Atribuição de venda e expansão real das macros dependem de validação própria.

## Validação local

- `npm test`: 32 testes aprovados, incluindo o percurso formulário → API → Cartpanda com os nove parâmetros Google e descarte de campos não permitidos.
- `npm run lint`: sintaxe dos 34 arquivos JavaScript aprovada.
- `npm run build` e `npm run check:build`: 40 arquivos públicos, referências locais e isolamento da saída Vercel aprovados.
- `git diff --check`: sem erros de whitespace. Projeto JavaScript sem script `typecheck`.

## File List

- `config/commerce.js`
- `assets/js/cowboy-store.js`
- `assets/js/cowboy-v3.js`
- `loja.html`
- `tests/qa/frontend-flow.test.js`
- `docs/stories/UTM-025-parametros-google-cartpanda.md`
