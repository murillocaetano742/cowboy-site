# Integrações comerciais — COWBOY Energia

## Estado de entrega

Retomada mais recente: `docs/integracoes/checkpoint-2026-09-08.md`. O catálogo foi relido, os preços permaneceram corretos e foram identificadas configurações distintas de limite de quantidade entre avulso e kits. O cadastro fiscal e as demais contas seguem pendentes de acesso suportado.

O serviço local está funcionando e a **API Cartpanda foi autenticada e utilizada para atualizar os três kits existentes**. Produtos, variantes, preços, peso e dimensões foram relidos após as alterações. As URLs reais de checkout estão no ambiente privado local, e o QA validou seus redirecionamentos sem seguir o destino externo. A leitura automatizada do resumo público recebeu desafio HTTP 403; portanto, checkout visual, pagamento de teste e total com frete ainda não foram homologados.

Melhor Envio ainda depende de credencial, conexão e cotação real; UTMify depende de configuração de conta e evento conciliado; Google depende de acesso e verificação da propriedade. A CLI Vercel encontrou autenticação inválida, e nenhuma versão foi publicada. Consulte `docs/integracoes/operacao-contas.md` para IDs, antes/depois, links, evidências de acesso e reversão. Código local, API validada, conta configurada e produção publicada são estados distintos.

## Logística confirmada

`config/logistics.js` é uma configuração pública versionada, sem segredos. Para kits de 1 a 4 frascos, a origem é **74475-239** e há uma única embalagem pronta de **comprimento 23 × largura 8 × altura 8 cm**, com **0,5 kg totais**. O peso unitário do frasco é **0,06 kg**, registrado apenas para inventário. A cotação envia ao Melhor Envio um produto-kit de `quantity: 1` com o peso/dimensões da embalagem já pronta e o seguro igual ao valor total do kit. Portanto, o peso de 0,5 kg não é multiplicado pela quantidade de frascos.

## Oferta fixa no código

| Kit | Preço por frasco | Total |
| --- | ---: | ---: |
| 1 frasco | R$ 54,76 | R$ 54,76 |
| 2 frascos | R$ 42,38 | R$ 84,76 |
| 3 frascos (opcional) | R$ 42,38 | R$ 127,14 |
| 4 frascos | R$ 42,38 | R$ 169,52 |

Os valores estão em `config/commerce.js`, em centavos. A página deve mostrar somente os kits que correspondem a checkouts Cartpanda configurados. Os links foram retornados pela API oficial da conta e ficam em variáveis de ambiente; este projeto não cria IDs de produto, links ou variantes fictícias. Os kits de 1, 2 e 4 frascos foram conciliados na conta; o kit de 3 permanece opcional e sem URL configurada.

## Contrato para o frontend

### Configuração pública

`GET /api/config` retorna os valores comerciais em centavos e somente booleanos de disponibilidade. Não expõe URLs de checkout, tokens, CEP de origem ou dimensões.

```json
{
  "currency": "BRL",
  "variants": [{ "quantity": 2, "unitPriceCents": 4238, "totalPriceCents": 8476, "checkoutAvailable": false }],
  "shippingAvailable": false
}
```

### Saída para checkout

Use `GET /api/checkout?quantity=2`. A rota aceita os kits 1, 2, 3 e 4, mas a configuração pública inicial só expõe 1, 2 e 4. Ela adiciona ao URL Cartpanda configurado apenas `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `src`, `sck`, `cid`, `gclid` e `fbclid`, e faz redirecionamento 302. O destino exige HTTPS e hostname `*.mycartpanda.com` ou hostname customizado declarado exatamente em `CARTPANDA_CHECKOUT_ALLOWED_HOSTS`; isso bloqueia open redirect. Em ausência de URL válida, responde `503` com `checkout_unavailable`; o frontend deve informar indisponibilidade e não redirecionar a outro processador.

Cartpanda documenta o registro de `utm_*`, `src` e `sck` no Resumo de Conversão e o uso de `cid` em seu postback S2S. [Parâmetros disponíveis](https://help.cartpanda.com/pt-br/article/parametros-disponiveis-1s71cr4/) · [S2S Postback](https://help.cartpanda.com/pt-br/article/s2s-postback-13wi92k/)

### Cotação de frete

Envie `POST /api/frete`:

```json
{ "postalCode": "01001-000", "quantity": 2 }
```

Resposta bem-sucedida:

```json
{
  "postalCode": "01001000",
  "quantity": 2,
  "currency": "BRL",
  "available": true,
  "quotes": [{ "id": 1, "company": "Correios", "service": "PAC", "price": 21.44, "deliveryDays": 5 }]
}
```

O endpoint retorna `400` para CEP/kit inválido, `413` para corpo excedente ou fora do contrato, `503` sem configuração local e `502` quando o fornecedor falha ou excede 6,5 segundos. Não retorna frete gratuito, R$ 25, estimativa ou desconto inventado. Preço nulo, vazio ou negativo vindo do fornecedor é descartado; `0` só aparece se o Melhor Envio retornar explicitamente o número zero. Prazo vazio fica `null`. A página deve usar `price` e `deliveryDays` apenas de uma resposta disponível; a seleção comercial final deve ser explícita para o cliente.

A rota chama `POST /api/v2/me/shipment/calculate` no Melhor Envio. A documentação exige token Bearer, JSON e `User-Agent` com aplicação/contato, e orienta usar `custom_price` e `custom_delivery_time` no retorno quando disponíveis. [Cálculo de fretes](https://docs.melhorenvio.com.br/reference/calculo-de-fretes-por-produtos) · [Introdução da API](https://docs.melhorenvio.com.br/reference/introducao-api-melhor-envio)

## Configuração operacional

1. Copie `.env.example` para `.env.local` (que não é versionado). CEP, peso e dimensões já confirmados ficam em `config/logistics.js`; não os replique como variáveis de ambiente.
2. Crie a aplicação/token do Melhor Envio no ambiente correto. Use exatamente `MELHOR_ENVIO_ENV=sandbox` para teste ou `production` após homologação; outro valor deixa a rota indisponível, sem fallback para produção. O sandbox e a produção usam cadastros/aplicações independentes. [Sandbox oficial](https://docs.melhorenvio.com.br/docs/sandbox)
3. Os checkouts diretos reais dos kits de 1, 2 e 4 já foram obtidos da Cartpanda e configurados em `.env.local`, nas variáveis `CARTPANDA_CHECKOUT_1_URL`, `_2_URL` e `_4_URL`. A variável `_3_URL` só deve ser preenchida se o kit de 3 for criado e conciliado. Para domínio próprio, declare somente o hostname exato em `CARTPANDA_CHECKOUT_ALLOWED_HOSTS`. O Link Bundler é uma alternativa do painel para quantidades e cupom. [Link Bundler](https://help.cartpanda.com/en-us/article/link-bundler-1stqek9/)
4. Adicione os valores sensíveis em Vercel para Production, Preview e Development com escopo apropriado; não exponha token usando prefixo público. [Vercel: variáveis de ambiente](https://vercel.com/docs/environment-variables)
5. Execute `npm run check:commerce` e `npm test`. O diagnóstico continuará indicando Melhor Envio pendente até a configuração real. Depois da configuração e do acesso necessários, homologue o checkout no **Test Mode** Cartpanda e uma cotação sandbox. Houve acesso autenticado à API e atualização dos produtos; não foi realizada compra, pagamento ou cotação real nesta entrega. [Cartpanda Test Mode](https://help.cartpanda.com/en-us/article/how-to-use-test-mode-1vj43ti/)

## UTMify e compra aprovada

Não há uma URL de postback nem esquema de assinatura UTMify público/configurado neste repositório. Por isso não foi criado um webhook que aceite compras sem autenticação, nem uma falsa confirmação de pedido. A integração indicada pela própria documentação Cartpanda é configurar o postback S2S no painel com a URL emitida pela conta UTMify, associar aos produtos reais e testar a conexão. O parâmetro `cid` é preservado pela rota de checkout para essa atribuição.

Antes de ativar, o operador deve obter no UTMify a URL gerada para a conta, confirmar o evento que representa pagamento aprovado e a política de autenticação/assinatura vigente, então configurar em `Admin > Rastreamento > Affiliate Tracking (Pixel & S2S)` no Cartpanda, conforme a documentação consultada. Configure uma única fonte de conversão aprovada e verifique duplicidade por `order_id`/`transaction_id` no painel antes de otimizar campanhas. A documentação Cartpanda descreve os parâmetros de postback e o teste de conexão; a confirmação de configuração depende das contas e não foi inferida. [Postback S2S Cartpanda](https://help.cartpanda.com/pt-br/article/s2s-postback-13wi92k/)

Não encaminhe nome, e-mail, telefone, CEP, diagnóstico, texto da página ou qualquer dado de saúde pelas UTMs, pelo `cid` ou por URLs. A rota tem allowlist e rejeita os demais parâmetros.

## Evidência local

`npm run test:integrations` cobre: CEP e kits válidos, configuração ausente sem chamada externa, pacote fixo/seguro por kit, corpo/headers ao Melhor Envio com mock, preço/prazo customizados, preços inválidos, ambiente inválido sem fallback, erro e timeout do fornecedor, limite de corpo, URL Cartpanda ausente e allowlist de atribuição. Esses testes não validam token, conta, sandbox, pagamento, inventário, frete real ou recebimento de postback.
