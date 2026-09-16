# Pedido para o Codex: integração da página VSL publicada (16/09/2026)

Cole no Codex a mensagem abaixo. Ela descreve o que a página já faz e o que falta ligar por fora.

---

A página `cowboy-nova.html` é a raiz do site em produção (PR #11, branch `feat/pagina-nova` mesclada em `main`). Não altere a copy, as imagens nem o CSS/JS da página sem combinar; a integração pedida é a seguinte.

1. **Cartpanda: preços e frete.** A página vende 1 frasco por R$ 79,90 (frete por conta do cliente), 2 frascos por R$ 154,80 e 3 frascos por R$ 199,90 com frete grátis, máximo de 3 por pedido. O checkout ainda cobra 54,76 / 84,76 / 127,14 e frete de R$ 25. Atualizar as variantes 211742450 (1), 211742746 (2) e 212751381 (3) para os preços novos, configurar frete grátis nas variantes de 2 e 3, e conferir o peso do kit de 3 (está 0; os outros têm 0,5 kg, 23×8×8 cm). Os links públicos estão em `config/commerce.js` (`CARTPANDA_PUBLIC_CHECKOUT_URLS`); a API `api/checkout.js` redireciona por `quantity` 1–3 e o kit de 4 foi descontinuado (`MAX_CART_QUANTITY = 3`). Depois de ajustar, rode `npm run check:commerce` e `node tests/qa/checkout-local.js` com o servidor local no ar.

2. **Parcelamento.** A página mostra "ou em até 12x no cartão" sem valor de parcela. Confirmar no Cartpanda o número máximo de parcelas e se há juros; se for 12x sem juros, o valor da parcela pode entrar nos cards (`.kit-pay`) de cada kit.

3. **WhatsApp.** Os botões existem e ficam ocultos até o número entrar em `<body data-whatsapp="55DDDNÚMERO">` em `cowboy-nova.html`. O JS monta o link `wa.me` com mensagem pré-preenchida (`data-whatsapp-text`).

4. **Avisos de atividade (prova social).** `assets/data/atividade.json` tem a lista `pedidos` vazia. Integrar com pedidos reais do Cartpanda (webhook de pedido pago ou exportação periódica) gravando `{ "nome": "Primeiro nome", "cidade": "Cidade/UF", "kit": 2, "quando": "2026-09-16T10:20:00-03:00" }`. Só dados reais; a página mostra os 12 mais recentes e depois os relatos dos clientes da galeria.

5. **Urgência.** `#kit` tem `data-deadline="2026-09-30T23:59:59-03:00"`; a contagem some sozinha quando a data passa. Trocar pela data real do lote quando o proprietário definir. `data-stock` opcional mostra um estoque real.

6. **Rastreamento.** Pixel Meta (`assets/js/cowboy-pixel.js`), GA4 (`assets/js/cowboy-google.js`) e UTMify já carregam na página. Eventos de vídeo `vsl_start`, `vsl_progress` (25/50/75) e `vsl_complete` são disparados via `gtag` e `fbq` quando existem; conferir se aparecem no GA4 e no Gerenciador de Eventos do Meta.

7. **Revelação atrasada da oferta.** Está desligada (`data-vsl-gate="off"` em `[data-vsl]`), então os kits aparecem sempre. Para esconder a oferta até o segundo 200 do vídeo, trocar para `"on"`. Não mudar sem o proprietário pedir.

Testes: `npm test` (36) e `PORT=4180 npm run dev` + `npx playwright test tests/e2e/cowboy-nova.spec.js` (6). As specs de v1.1/v1.2 pulam porque essas páginas saíram do build.

---
