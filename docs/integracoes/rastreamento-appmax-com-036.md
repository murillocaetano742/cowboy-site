# COM-036 — Rastreamento do AppCheckout

Evidência de 17/09/2026, consulta e configuração concluídas até **18h41 BRT**. Base da story: `ee4a91e0af822da73b13ee99f5c0f54e8fa7cedc`. Foi aplicada a skill `analytics`. A mudança desta frente foi externa, no cadastro Appmax existente; este arquivo documenta o resultado. A aparência do checkout é tratada em outra frente.

## Resultado comprovado

O checkout carregava GA4 e atribuição de UTMs, mas faltava o carregador do Pixel UTMify. Após autorização, foi acrescentado `cowboy-pixel.js` ao registro **8426**, exclusivamente na loja **COWBOY Energia**, página **Pagamento**, tipo **inline**. O registro foi salvo e reaberto: os três scripts estavam persistidos, uma vez cada.

```html
<script src="https://cowboyenergiamasculina.com.br/assets/js/cowboy-google.js" defer></script>
<script src="https://cdn.utmify.com.br/scripts/utms/latest.js" data-utmify-prevent-xcod-sck data-utmify-prevent-subids async defer></script>
<script src="https://cowboyenergiamasculina.com.br/assets/js/cowboy-pixel.js" defer></script>
```

Foram feitas três visitas públicas, sem preencher cliente/cartão nem finalizar pedido. Nos três kits, o DOM da **janela principal** confirmou esses carregadores, `cdn.utmify.com.br/scripts/pixel/pixel.js`, `connect.facebook.net/en_US/fbevents.js` e a configuração do Pixel **1006075098894986**. O carregador Google também estava presente; a propriedade é **G-VYR2542XCN**. O iframe `/pixel/page_checkout` permaneceu separado: a comprovação dos scripts principais não dependeu de ler seu conteúdo.

Às **18h28 BRT**, o [histórico da UTMify](https://app.utmify.com.br/dashboards/6a9855d26cd42f1e4cb639d3/eventos) mostrou **3 PageView e 3 ViewContent** novos, todos com título **Checkout - COWBOY Energia**, destino **1006075098894986**, **Ok: 1 / Erro: 0** por evento. Antes dessas visitas, os registros mais recentes eram da vitrine às 18h26. Os seis novos registros são evidência do envio informado pela UTMify; não substituem a consulta do processamento no Gerenciador de Eventos Meta.

| Checkout conferido | Parcela selecionada, incluindo frete | Controle Finalizar Pedido |
| --- | --- | --- |
| [1 frasco — 38251476](https://cowboyenergia.carrinho.app/one-checkout/ocmdf/38251476) | 12× R$ 11,54 | Habilitado |
| [2 frascos — 38251410](https://cowboyenergia.carrinho.app/one-checkout/ocmdf/38251410) | 12× R$ 16,75 | Habilitado |
| [3 frascos — 38251519](https://cowboyenergia.carrinho.app/one-checkout/ocmdf/38251519) | 12× R$ 21,64 | Habilitado |

Nenhum evento Purchase foi fabricado ou reenviado, e não foi criado emissor Meta nativo nem registro de rastreamento nas páginas de sucesso.

## Consulta independente ao Meta

Às **18h40–18h41 BRT**, foi consultado o [Gerenciador de Eventos, Pixel 1006075098894986, dia 17/09/2026](https://eventsmanager.facebook.com/events_manager2/list/dataset/1006075098894986/overview?business_id=383730844330268&date=2026-09-17_2026-09-17), em aba própria e somente leitura. O painel exibiu:

| Evento | Total do período | Integração | Última recepção exibida |
| --- | --- | --- | --- |
| PageView | 115 | Várias | Há 50 minutos |
| ViewContent / Ver conteúdo | 102 | Várias | Há 50 minutos |
| InitiateCheckout | 5 | API de Conversões | Há 2 horas |
| Purchase / Compra | 1 | API de Conversões | Há 9 horas |

Todos estavam **Ativo**. A relação **Sites**, explicitamente referente a **28 dias**, listava sete domínios (Cartpanda e seis prévias Vercel), sem `cowboyenergia.carrinho.app`. Esses dados agregados ainda não permitiam correlacionar as visitas Appmax das **18h28** com eventos processados pelo Meta. O Purchase exibido era anterior a esta homologação; não comprova uma compra Appmax.

O painel informava que eventos podem levar até 30 minutos para aparecer. A consulta ocorreu cerca de 12 minutos após as visitas, portanto a ausência de correlação nessa leitura não demonstra falha de entrega. Os seis registros **Ok** da UTMify permanecem evidência de envio, com confirmação independente de recebimento Meta ainda pendente. Não houve recarregamento de checkout nem evento adicional nessa consulta.

Também estava visível uma recomendação sobre **fbclid modificado no parâmetro fbc**, associada à API de Conversões. A visão geral não identificava ali qual domínio ou evento originou o alerta; não foi atribuído à COM-036 nem interpretado como bloqueio geral. Nenhuma configuração foi alterada. O painel GA4 não foi reconsultado nesta rodada.

## Configurações conferidas

Na [UTMify → Integrações](https://app.utmify.com.br/dashboards/6a9855d26cd42f1e4cb639d3/integracoes), os webhooks **COWBOY — Appmax** e **COWBOY — Cartpanda** estavam ativados. O grupo de Pixel **COWBOY**, `6aa16d0bee215350c09b5b31`, permanecia ativo para Meta **1006075098894986**:

| Regra | Estado persistido |
| --- | --- |
| Lead | Desabilitado |
| AddToCart | Desabilitado |
| InitiateCheckout | Habilitado; **Contém texto** = **Quero meu teste de 30 dias** |
| Purchase | **Apenas vendas aprovadas**; **Valor da venda**; produto **Qualquer** |

Na Appmax, o webhook remetente da loja **COWBOY Energia** estava ativo, com **Modelo Padrão (Recomendado)** e **14 eventos**. A edição foi aberta somente para leitura; a marcação visual confirmou:

- Pedido aprovado; Pedido autorizado; Boleto Gerado; Pedido pago.
- Pedido Estornado; Pedido Recusado por Risco; Pedido Estornado Parcialmente.
- Pix Gerado; Pix Expirado; Pix Pago.
- Pedido integrado; Pedido com boleto vencido.
- Pedido Chargeback em Tratamento; Pedido Chargeback Ganho.

Clientes, assinaturas e Pagamento não autorizado não estavam selecionados. Não foi acionado Testar Eventos. O endpoint e credenciais não estão neste documento.

## InitiateCheckout: limite identificado e decisão

A detecção atual por texto continua ligada ao CTA da vitrine. Não foi alterada nem acrescida uma chamada manual no checkout.

Foi inspecionada a alternativa UTMify **Contém URL**, sem salvar. A própria interface descreve uma condição sobre a URL contida no **botão de compra**, e não um gatilho comprovado de chegada à página. Trocar simplesmente para `cowboyenergia.carrinho.app/one-checkout/` poderia perder a detecção do formulário da vitrine e não demonstraria cobertura de acessos diretos. Após fechar e reabrir, a regra persistida continuou **text-match / Quero meu teste de 30 dias**.

O [formulário Meta nativo da Appmax](https://admin.appmax.com.br/pixels-types/facebook/create) também foi inspecionado sem salvar: com tipo **PIXEL** selecionado e visitas marcadas, apresentou apenas os blocos **Eventos de visita em Checkout** e **Evento de Conversão de Vendas**. Não exibiu seleção isolada de InitiateCheckout, PageView e ViewContent. A lista de pixels Facebook nativos estava vazia. Assim, não foi criado um segundo canal de visitas sem comprovação de como separar seus eventos.

**IC para uma chegada direta ao checkout continua não comprovado.** As três visitas de homologação produziram PV/VC; não houve clique no CTA da vitrine nem tentativa de compra nessa rodada. A diferença é documentada, sem tratar PageView como InitiateCheckout.

## Contrato de eventos e pendências

| Evento / sinal | Origem e condição | Evidência / limite |
| --- | --- | --- |
| PageView / ViewContent Meta | Pixel UTMify carregado no pagamento | Três pares no histórico UTMify às 18h28, sem erros informados. |
| InitiateCheckout Meta | Regra UTMify no CTA da vitrine | Configuração preservada. Cobertura de acesso direto pendente. |
| Purchase Meta | Pedido aprovado Appmax → webhook → UTMify | Conexão configurada; ainda falta uma compra Appmax efetivamente aprovada para correlacionar pedido, valor/moeda e recebimento. |
| Page view GA4 | Tag própria `G-VYR2542XCN` no checkout | Loader confirmado. Recebimento no GA4 e continuidade de sessão não foram consultados nesta frente. |
| Purchase GA4 | Confirmação de pagamento real | Não foi acrescentado a uma simples página de sucesso. Contrato e homologação continuam pendentes. |
| UTMs / `cid` / `_gl` | Redirecionamento e loaders da vitrine/checkout | Código presente; persistência e correlação no novo pedido ainda exigem homologação. |
| Lead / AddToCart / AddPaymentInfo | Ação específica do comprador | Nenhuma ação dessas foi simulada ou acrescentada para inflar cobertura. |

A origem prevista de Purchase Meta continua única, pela UTMify. Não foi comprovado um `event_id` compartilhado com outro emissor, portanto a configuração não introduziu Purchase nativo Appmax ou manual em paralelo. Um novo pagamento autorizado deve confirmar identificador do pedido, valor BRL, status aprovado, origem e ausência de repetição; compras Cartpanda antigas não servem para esse teste.

## Referências oficiais usadas

A documentação UTMify distingue a instalação do **Pixel** da instalação do **script de UTMs**. O guia de UTMs orienta sua presença no funil e fornece, para outras plataformas, as duas opções genéricas preservadas nesta integração. [Instalar Pixel](https://utmify.help.center/article/1043-como-instalar-o-pixel-da-utmify-em-minhas-paginas), [instalar UTMs](https://utmify.help.center/article/1013-como-instalar-o-script-de-utms-em-minhas-paginas).

O guia de diagnóstico também distingue origem orgânica/recuperação de atribuição a anúncios; uma visita orgânica não demonstra atribuição paga. [Diagnóstico de rastreamento UTMify](https://utmify.help.center/article/1024-voce-esta-tendo-vendas-nao-trackeadas).

Esta frente não alterou o código do site, campanhas, credenciais, regras comerciais ou o registro de aparência mantido pela outra frente. A verificação foi limitada às configurações e sinais descritos, sem compra ou dados pessoais.
