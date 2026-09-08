# Checkpoint operacional — 8 de setembro de 2026

## Avanço comprovado nesta retomada

A leitura já autorizada `GET https://accounts.cartpanda.com/api/cowboy-energia/products` respondeu HTTP 200 às **00h03 de Brasília** (`2026-09-08T03:03:40.107Z`). Nenhuma alteração externa foi enviada nesta retomada. A resposta sanitizada está em `.local/cartpanda-store-readiness.json`, fora do Git e da publicação.

| Dado retornado pela conta | Resultado | Interpretação permitida |
| --- | --- | --- |
| Nome da loja | Cowboy Energia | Nome comercial; não comprova razão social |
| Slug | cowboy-energia | Mesma loja dos produtos já atualizados |
| País | Brazil / BR | País cadastrado da loja |
| website / domain no objeto consultado | nulos | Não foi confirmado domínio próprio nesse objeto |
| Campos de CNPJ, razão social e endereço fiscal | ausentes | Cadastro empresarial completo continua pendente |
| `default_shipping_created` | 1 | Indicador genérico de configuração de envio; não comprova conexão com Melhor Envio, tarifa ou origem |
| `min_cart_quantity` | 0 | Valor bruto da API; comportamento final depende de homologação do checkout |

O campo `send_address2` é uma configuração de envio e não um endereço empresarial. Ele foi excluído do conjunto de campos considerados como identificação fiscal.

## Oferta e quantidade

Os preços confirmados continuam iguais à nova oferta:

| Produto / variante | Kit | Preço confirmado | `max_quantity` | `max_quantity_count` |
| --- | --- | ---: | ---: | ---: |
| 29750488 / 211742450 | 1 frasco | R$ 54,76 | 0 | 0 |
| 29750542 / 211742746 | 2 frascos | R$ 84,76 | 1 | 1 |
| 29750543 / 211742749 | 4 frascos | R$ 169,52 | 1 | 1 |

Os valores acima foram observados diretamente. O comportamento de limites no checkout público não foi testado, pois a proteção de acesso continua pendente. O produto avulso possui configurações distintas dos kits de 2 e 4. Antes da produção, é necessário homologar um destes caminhos: limitar cada checkout ao kit selecionado ou aplicar uma regra de volume comprovada para que duas unidades avulsas não mantenham R$ 54,76 por unidade. Não foi criada regra de desconto nem alterado limite por um campo não confirmado no contrato da API.

Não há kit de 3 frascos ou regra de mistura de kits homologados. As variantes existentes continuam declarando envio físico. Nenhuma quantidade ou política de estoque foi alterada.

## Ambiente local

O arquivo privado `.env.local` contém somente as chaves Cartpanda já previstas: token, slug e URLs de checkout para 1, 2 e 4 frascos. Nenhum valor de credencial foi impresso.

`GET http://127.0.0.1:4173/api/config` respondeu HTTP 200 e confirmou preços em centavos, `checkoutAvailable: true` para os três kits e `shippingAvailable: false`. A porta 4173 já estava ocupada pelo servidor; uma tentativa de iniciar segunda instância retornou `EADDRINUSE`. O processo existente foi preservado e respondeu corretamente à verificação HTTP.

`npm run check:commerce` terminou com código 1 de forma esperada, indicando somente estas dependências de frete:

- `MELHOR_ENVIO_TOKEN`
- `MELHOR_ENVIO_USER_AGENT`
- `MELHOR_ENVIO_ENV`, com valor válido `sandbox` ou `production`

O código 1 é um diagnóstico de configuração incompleta, não uma cotação de frete. Não foram acrescentados identificadores fictícios de UTMify ou Google.

## Nova tentativa de acesso às contas abertas

O usuário informou que os aplicativos estavam abertos no navegador. O agente visual confirmou novamente a indisponibilidade da conexão Browser e liberou a exclusividade de GUI para o operador de contas.

Computer Use conseguiu listar uma janela real do Chrome com o título **“Vercel - Google Chrome”**. Ao solicitar somente o conteúdo acessível dessa janela, o runtime interrompeu a operação antes da captura:

> Computer Use has been stopped for this turn because it could not determine the current browser URL on Windows with enough confidence to enforce policy. Stop your work and send a final message noting why Computer Use ended.

Nenhum clique, digitação, login, alteração de segurança ou mudança de conta foi executado. Não houve nova tentativa com coordenadas, cookies, perfis ou outro mecanismo para contornar essa interrupção. A Vercel CLI não foi consultada novamente, pois não houve mudança comprovada da credencial inválida.

## Caminhos restantes

O endpoint de catálogo utilizado fornece produtos e um objeto limitado da loja. Os arquivos e respostas disponíveis não contêm um contrato confirmado para leitura de cadastro fiscal completo, credencial Melhor Envio ou configuração UTMify/Search Console. Nenhum endpoint de conta foi adivinhado para enviar o token.

As pendências são específicas: acesso suportado ao navegador e às contas; cadastro empresarial completo; regra de quantidade/volume; credencial e ambiente Melhor Envio; tarifa real no checkout; configuração UTMify e evento de teste; verificação Google; autenticação e preview Vercel antes da publicação. O preço na API e o redirecionamento local continuam comprovados, enquanto pagamento, frete real e produção permanecem sem homologação.

O comando de documentação que gerou solicitações repetidas não foi reexecutado. Esta retomada não criou compras, etiquetas, campanhas, assinaturas, mensagens ou produção publicada.

