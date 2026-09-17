# COM-035 — Migração urgente do checkout para Appmax

Status: validado para publicação; homologação de compra real pendente · 17/09/2026

## Pedido

O proprietário informou que a conta Cartpanda caiu e solicitou migração urgente para Appmax. Confirmou conta aprovada e concluiu o login no painel. Preservar ofertas de 1/2/3 frascos, preços R$ 79,90 / R$ 154,80 / R$ 199,90, frete pago no avulso e grátis nos kits de 2 e 3. Reconfirmar parcelamento e rastreamento no novo checkout. Não inventar links, preços de frete, parcelas, pedidos ou eventos de compra.

Base: `e2e4578983ff97b512d3c2e184145b926a4c8702`, após PRs #17 e #18; preservar as mudanças existentes.

## Critérios de aceite

- [x] Cadastrar/confirmar três kits no AppCheckout com produto físico, endereço, preços e fretes corretos.
- [x] Obter três links públicos reais e conferir checkout antes de ativar redirecionamentos.
- [x] Selecionar Appmax explicitamente; configuração ausente/inválida não retorna à Cartpanda.
- [x] Preservar quantidades 1–3, atribuição permitida e resposta amigável de indisponibilidade.
- [x] Atualizar referências de provedor e parcelas somente conforme condições confirmadas.
- [ ] Configurar/verificar recebimento de pedidos na UTMify e eventos Meta/GA4, distinguindo configuração de compra comprovada.
- [x] Executar testes de integração, checkout local, lint, build e E2E pertinentes.
- [ ] Publicar pelo fluxo @devops e verificar domínio/links da versão final.

## Decisões e dependências

A documentação oficial distingue Link de Pagamentos de AppCheckout. AppCheckout oferece kits, endereço completo e frete por kit; a documentação confirma frete fixo, exigindo definição do valor para o avulso se não houver cotação dinâmica na conta. Os valores de parcelamento anteriores pertencem à Cartpanda e não serão presumidos válidos para Appmax.

O proprietário aprovou R$ 26,75 de frete fixo no avulso. A loja AppCheckout criada é COWBOY Energia, ID 344127, domínio `cowboyenergia.carrinho.app`. Os três kits têm compra única, endereço completo e máximo/padrão de 12 parcelas. As regras de frete foram vinculadas por kit, sem ativação global em outras lojas.

| Frascos | Kit Appmax | Produto à vista | Frete | 12 parcelas no checkout, incluindo frete |
| --- | --- | --- | --- | --- |
| 1 | 38251476 | R$ 79,90 | R$ 26,75 | R$ 11,54 |
| 2 | 38251410 | R$ 154,80 | Grátis | R$ 16,75 |
| 3 | 38251519 | R$ 199,90 | Grátis | R$ 21,64 |

O topo do avulso anuncia 12x R$ 8,65 somente para o produto; a página explicita o frete e o valor completo com frete. A Appmax exibe taxa de 2,49% p.p.; os totais parcelados da página são a soma das 12 parcelas observadas. O kit de 3 usa produto físico fechado `COWBOY-30ML-3`, com três frascos, evitando o arredondamento para R$ 199,89 que ocorria ao dividir a oferta em três unidades iguais. Não foram inferidas unidades dos campos opcionais de peso/dimensões. A imagem opcional do checkout não foi enviada: a extensão Chrome bloqueou upload de arquivos locais.

O webhook receptor UTMify **COWBOY — Appmax** e o remetente Appmax para a loja COWBOY Energia estão ativos; o remetente usa Modelo Padrão e 14 eventos, incluindo Pedido aprovado e Pedido pago, conferidos após reabrir o cadastro. O Pixel Meta existente na UTMify continua limitado a compras aprovadas. Nenhuma compra foi gerada ou reenviada. Falta confirmar recebimento de um novo pagamento real na UTMify/Meta; GA4 no destino está em investigação separada. O feed de atividade permanece sem pedidos inventados; o importador legado Cartpanda não importa Appmax.

Fontes: [AppCheckout](https://help-center.appmax.com.br/artigos/utilizando-o-checkout-da-appmax), [frete](https://help-center.appmax.com.br/artigos/criando-uma-configuracao-de-frete), [parcelamento](https://help-center.appmax.com.br/artigos/configuracoes-de-parcelamento).

## Validação

- `npm test`: 49/49.
- `npm run lint`: sintaxe de 43 arquivos aprovada; este projeto não oferece script typecheck.
- `npm run check:commerce`: Appmax e fretes fixos 2675/0/0 centavos aprovados, sem exigir Melhor Envio no fluxo AppCheckout.
- `npm run build` e `npm run check:build`: 60 arquivos da allowlist pública.
- Servidor local porta 4180 + `node tests/qa/checkout-local.js http://127.0.0.1:4180`: 3/3 URLs reais e parâmetros conferidos, sem seguir redirects externos.
- `npx playwright test tests/e2e/cowboy-nova.spec.js`: 12/12 em 4,4 minutos; axe e capturas desktop/mobile aprovados, HTTPS externo bloqueado nos testes.
- Checkouts públicos inspecionados sem preencher dados ou finalizar pedidos.

## File List

- `docs/stories/COM-035-migracao-appmax.md`
- `docs/integracoes/appmax-tracking-2026-09-17.md`
- `.env.example`
- `config/commerce.js`
- `scripts/check-commerce-config.js`
- `assets/js/cowboy-google.js`
- `cowboy-nova.html`
- `privacidade.html`
- `termos.html`
- `tests/integrations/commerce.test.js`
- `tests/integrations/google-analytics.test.js`
- `tests/integrations/google-linker.test.js`
- `tests/qa/checkout-local.js`
- `tests/qa/frontend-flow.test.js`
