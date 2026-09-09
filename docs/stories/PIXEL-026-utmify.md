# PIXEL-026 — Pixel UTMify na página COWBOY

Status: implementação local validada; publicação do site em andamento. Pixel criado pelo proprietário e ativo na UTMify.

## Solicitação

Após pedir explicitamente concluir a conexão na UTMify, o proprietário enviou o código gerado e a captura “Pixel criado com sucesso”. O código foi conferido como dados, sem executar o texto recebido durante a análise: carrega https://cdn.utmify.com.br/scripts/pixel/pixel.js e define o identificador público pixelId como 6aa16d0bee215350c09b5b31.

O painel confirma COWBOY / Meta / Produto Qualquer / Ativado. Pixel Meta associado: 1006075098894986. Lead e Add to Cart desabilitados; Initiate Checkout pelo texto “Quero começar minha rotina”; Purchase apenas vendas aprovadas, valor da venda.

## Critérios

- [x] Instalar o carregador fornecido na página de vendas.
- [x] Substituir o disparo direto anterior da Meta, preservando Global Privacy Control e proteção contra repetição.
- [x] Preservar o script de UTMs, GA4, ofertas e checkout.
- [x] Executar testes, sintaxe e build.
- [ ] Publicar e conferir carregamento em produção.
- [ ] Coordenar o envio nativo da Cartpanda com a nova integração e verificar os eventos disponíveis.

## Limites

Instalação e navegação não comprovam recebimento de compra. Nenhum pedido/pagamento deve ser inventado. Não imprimir credenciais de API. A configuração de Google Ads continua independente desta instalação.

## Validação local

- `npm test`: 32 testes aprovados. Os testes do Pixel conferem o identificador e SDK UTMify, inicialização única, ausência de chamadas diretas à Meta e respeito ao Global Privacy Control.
- `npm run lint`: sintaxe dos 34 arquivos JavaScript aprovada.
- `npm run build` e `npm run check:build`: 40 arquivos públicos, referências locais e isolamento da saída Vercel aprovados.
- `git diff --check`: sem erros de whitespace. Projeto JavaScript sem script `typecheck`.

## File List

- assets/js/cowboy-pixel.js
- tests/integrations/meta-pixel.test.js
- privacidade.html
- docs/stories/PIXEL-026-utmify.md
