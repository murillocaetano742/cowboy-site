# REBUILD-016 — estado das integrações

Data: 8 de setembro de 2026.

## Resultado comprovado

| Integração | Estado verificável | Limite atual |
| --- | --- | --- |
| Cartpanda | API autenticada respondeu 200 em leitura; os produtos e variantes confirmam R$ 54,76, R$ 84,76 e R$ 169,52. Os kits 1, 2 e 4 têm checkout público versionado e override opcional por ambiente. Testes locais confirmam redirecionamento 302, host permitido e preservação restrita da atribuição, sem seguir o redirecionamento nem comprar. | Uma sonda HTTP automatizada direta recebeu 403 nos três checkouts; isso não comprova falha para um navegador de cliente e não foi contornado. O checkout público ainda precisa de homologação operacional final. A variante avulsa retornou `max_quantity: 0` e `max_quantity_count: 0`; o risco de quantidade está descrito em [plano-limite-quantidade.md](./plano-limite-quantidade.md). |
| UTMify | O script público recomendado pela UTMify para Cartpanda foi incluído. A página também mantém, durante a sessão, somente `utm_*`, `src`, `sck`, `cid`, `gclid` e `fbclid`, limitados a 256 caracteres, e os envia ao endpoint de checkout. A política de privacidade descreve esse armazenamento. | Isto comprova encaminhamento de atribuição até o checkout, não evento de venda. `initial_sale`/upsell e um teste de conexão dependem da configuração S2S na conta UTMify/Cartpanda. O endpoint `latest.js` é mantido pelo fornecedor e não tem versão fixa no URL oficial. |
| Melhor Envio | Contrato server-side, CEP 74475239, caixa 23×8×8 cm, 0,5 kg e valores segurados têm testes automatizados. A ausência de configuração falha fechado. | Não existem `MELHOR_ENVIO_ENV`, `MELHOR_ENVIO_TOKEN` e `MELHOR_ENVIO_USER_AGENT` no ambiente do checkout isolado. O indicador Cartpanda `default_shipping_created: 1` não comprova Melhor Envio. Faltam OAuth na conta, origem/tarifa e uma cotação real sem compra. |
| Google | A produção pública e o DNS consultados não revelaram `G-`, `GTM-`, `gtag`, `google-site-verification` ou TXT de verificação reutilizável. | Não há Measurement ID, container GTM ou propriedade Search Console comprovados. Nenhum identificador foi inventado e Google não foi declarado ativo. |
| Vercel | O check do novo head `8bb78a8` passou no deployment `E31pgCQxH2MXdUxjApYoyj17qx7F`. | A falha anterior foi superada por esse head. A causa do deployment antigo não foi obtida e não foi atribuída por hipótese. |

## Verificação local

- `npm test`: 26/26 testes passaram, incluindo fallback público Cartpanda, override inválido falhando fechado, allowlist de atribuição, persistência na mesma sessão e storage inválido falhando fechado.
- `npm run lint`: passou em 29 arquivos JavaScript.
- `git diff --check`: passou.
- `npm run check:commerce`: checkout 1/2/4 disponível; saída 1 somente porque os três itens de configuração do Melhor Envio estão ausentes.
- Nenhum token foi copiado para HTML, documentação ou configuração pública.

## Acessos técnicos restantes

1. Melhor Envio: sessão administrativa Cartpanda e autorização OAuth da conta Melhor Envio para configurar origem e tarifa, seguidas de uma cotação real sem finalizar pedido.
2. UTMify: acesso à área de rastreamento da Cartpanda/UTMify, URL S2S e evento de teste para `initiate_checkout` e `initial_sale`.
3. Google: propriedade e acesso administrativo, com Measurement ID ou container GTM e método de verificação Search Console definidos pelo proprietário.
4. Vercel: acesso aos logs do deployment e variáveis do projeto pelo fluxo oficial.

O Computer Use foi tentado pelo pacote oficial `@oai/sky`. A descoberta de janelas falhou duas vezes porque o pipe nativo não existia; após reset, o processo falhou com `CreateProcessWithLogonW failed: 2`. Nenhuma janela, credencial, conta ou configuração externa foi acessada ou alterada nessa tentativa.

## Fontes oficiais

- [UTMify — script de UTMs em páginas Cartpanda](https://utmify.help.center/article/1013-como-instalar-o-script-de-utms-em-minhas-paginas)
- [Cartpanda — S2S Postback](https://help.cartpanda.com/pt-br/article/s2s-postback-13wi92k/)
- [Cartpanda — integração Melhor Envio](https://help.cartpanda.com/pt-br/article/melhor-envio-a0iyi4/)
