# Appmax e rastreamento — auditoria de 17/09/2026

Consulta inicial somente de leitura na UTMify em 17/09/2026, aproximadamente 17h25–17h35 BRT. Às 17h41 BRT, após autorização para a migração, foi confirmada a criação do webhook descrito abaixo. Nenhum evento de compra foi disparado nesta tarefa.

## Configuração realizada após a auditoria

**Atualização da implantação COM-035:** o remetente foi salvo na Appmax para a loja **COWBOY Energia**, ID 344127. A listagem confirmou o webhook ativo, **Pedido aprovado + 13 eventos**; a edição reaberta confirmou a loja, o modelo padrão e as seleções Pedido aprovado, Pedido autorizado, Boleto Gerado, Pedido pago e Pedido Estornado. Os demais eventos selecionados abrangem Pix e atualizações de pagamento. Não foi acionado o botão Testar Eventos para enviar dados simulados à integração de produção. O recebimento de uma nova compra real na UTMify e Meta continua pendente.

Os cards foram atualizados conforme as leituras Appmax abaixo. O domínio do linker GA4 passou a ser `cowboyenergia.carrinho.app`, e o carregador UTMify da vitrine usa as duas opções genéricas confirmadas no painel. As observações seguintes preservam a sequência da auditoria; os valores antigos Cartpanda no contrato de homologação são referência histórica.

Foi criado na UTMify o webhook **COWBOY — Appmax**, selecionando a plataforma Appmax. A interface confirmou **Webhook criado com sucesso ✅** e exibiu a URL HTTPS gerada. O cartão da integração passou a existir na lista. O endpoint foi transferido entre os formulários autenticados e não foi incluído no repositório.

Depois da coordenação para transferência privada do endpoint, a ação **Finalizar** foi concluída e o cartão **COWBOY — Appmax** confirmou **Status: Ativado**. A loja informada pelo responsável é `cowboyenergia.carrinho.app`; sua configuração não foi operada nesta tarefa. Criar e ativar o endpoint UTMify não comprova que o webhook remetente da Appmax está configurado ou recebendo pedidos.

Não foi criado um Pixel adicional nem um emissor nativo Meta Purchase. A configuração existente de eventos foi preservada.

### Primeira leitura do checkout Appmax

O [checkout público do kit de 2](https://cowboyenergia.carrinho.app/one-checkout/ocmdf/38251410) foi aberto em 17/09/2026, aproximadamente 17h42–17h43 BRT, sem preencher cliente, cartão ou acionar Finalizar Pedido. A página apresentou **1× R$ 154,80**, **12× R$ 16,75**, **Frete R$ 0,00 — Frete grátis** e **Taxa de 2,49% p.p**. A soma das parcelas é **R$ 201,00**, calculada como 12 × R$ 16,75; esse total não apareceu como campo separado na tela. Portanto, o parcelamento do kit de 2 difere do valor anterior Cartpanda de 12× R$ 16,08.

Na leitura seguinte do [checkout público do avulso](https://cowboyenergia.carrinho.app/one-checkout/ocmdf/38251476), o topo anunciou **12× R$ 8,65** para o produto. A opção de frete selecionada era **R$ 26,75 — Frete - 1 frasco**; o seletor efetivo de pagamento mostrou **1× R$ 106,65** e **12× R$ 11,54**, incluindo o frete. A soma desse parcelamento é **R$ 138,48**, calculada como 12 × R$ 11,54. A mesma taxa de **2,49% p.p** estava visível. Assim, R$ 8,65 por parcela não é o valor final da compra com frete. Novamente, nenhum campo de cliente ou pagamento foi preenchido e Finalizar Pedido não foi acionado.

O [checkout público do kit de 3](https://cowboyenergia.carrinho.app/one-checkout/ocmdf/38251519) também foi conferido: **1× R$ 199,90**, **12× R$ 21,64** no topo e no seletor, **Frete R$ 0,00 — Frete grátis** e **Taxa de 2,49% p.p**. A soma calculada das 12 parcelas é **R$ 259,68**. A leitura não preencheu campos nem acionou compra.

## Estado observado antes da criação

[Dashboard Principal → Integrações](https://app.utmify.com.br/dashboards/6a9855d26cd42f1e4cb639d3/integracoes):

| Item | Evidência no painel |
| --- | --- |
| Webhook existente | **COWBOY — Cartpanda**, ativado; não havia webhook Appmax listado. |
| Appmax disponível | Adicionar Webhook → Appmax apresenta nome do webhook e ação Criar Webhook. Modal fechado sem criar. |
| Taxas Appmax | O painel informa que não são enviadas pelo webhook; precisam ser cadastradas manualmente na UTMify. Usar as taxas efetivas contratadas. |
| Pixel UTMify | **COWBOY**, grupo `6aa16d0bee215350c09b5b31`, tipo Meta, ativo, produto **Qualquer**. |
| Destino Meta | **PIXEL COWBOY**, `1006075098894986`. |
| InitiateCheckout | Habilitado; regra **Contém texto** = **Quero meu teste de 30 dias**. |
| Purchase | **Apenas vendas aprovadas**; valor **Valor da venda**. |
| Lead / AddToCart | Desabilitados. |
| GA4 | Não há Pixel Google listado; o GA4 do site é uma tag própria, `G-VYR2542XCN`. Não foi comprovada configuração GA4 no AppCheckout nesta auditoria. |

A leitura do formulário Editar Dados não alterou essas opções. Tokens não foram copiados para este documento.

## Conexão Appmax indicada pela própria UTMify

O modal Appmax aponta para o [tutorial oficial da UTMify](https://youtu.be/PK8b7zcio-c). Ele orienta:

1. Na UTMify: Integrações → Adicionar Webhook → Appmax → informar nome → Criar Webhook e copiar a URL gerada.
2. Na Appmax: Configurações → Webhooks → Novo Webhook → selecionar loja, colar URL e adicionar os eventos necessários; manter **modelo padrão** e salvar.
3. Voltar à UTMify e finalizar a integração.

O tutorial é anterior à interface atual. Sua narração não enumera os eventos selecionados; a lista exata deve ser conferida no painel Appmax durante a configuração. Esta auditoria não acessou a aba Appmax operada pelo responsável pela implantação. A URL de webhook é uma credencial operacional e não deve entrar no repositório.

## Script de atribuição para a nova plataforma

No painel: Integrações → UTMs → Script de UTMs → Ver opções. A seleção atual oferece **Outra**, sem uma opção específica Appmax. O script público baixado nessa opção foi decodificado estaticamente, sem execução. Ele carrega:

```html
<script
  src="https://cdn.utmify.com.br/scripts/utms/latest.js"
  data-utmify-prevent-xcod-sck
  data-utmify-prevent-subids
  async
  defer
></script>
```

O resultado genérico não inclui `data-utmify-is-cartpanda` nem `data-utmify-ignore-iframe`, presentes na integração antiga da página. A existência do carregador genérico não comprova, por si só, a persistência dos identificadores no pedido Appmax; a homologação deve observar esse percurso.

## Contrato proposto para homologação

- **Uma origem para Purchase:** se a UTMify for responsável pelo envio Meta, usar Appmax → webhook de pedido aprovado → UTMify → Pixel existente. Conferir se o AppCheckout também envia Purchase nativo antes de ativar os dois caminhos. Não foi encontrado nesta leitura um contrato que assegure o mesmo `event_id` entre eles; a deduplicação cruzada permanece não comprovada.
- **Atribuição:** preservar UTMs e `cid` no redirecionamento; manter `_gl` sem transformações para o GA4. Confirmar os identificadores em um percurso real autorizado e depois no pedido correspondente. Compra orgânica e atribuição a anúncio são cenários diferentes; o painel auditado não comprova o comportamento de Purchase orgânico da Appmax.
- **GA4:** atualizar o linker do site com o domínio efetivo do novo checkout e confirmar suporte/configuração da mesma propriedade no destino. Na compra aprovada, conferir `transaction_id`, `value` e `currency`; a configuração de Purchase Meta na UTMify não substitui essa etapa.
- **Valores:** os cards publicados trazem as parcelas homologadas na Cartpanda: 12× R$ 8,30 / R$ 16,08 / R$ 20,77, com juros e totais de R$ 99,60 / R$ 192,96 / R$ 249,24. Esses valores precisam ser novamente confirmados na Appmax antes de afirmar equivalência. Frete deve permanecer pago no avulso e gratuito nos kits de 2 e 3.
- **Transição:** preservar a origem de cada pedido. Os scripts administrativos e de atividade Cartpanda não importam pedidos Appmax; não presumir que migraram junto com os links. Não reenviar compras antigas para testar o novo canal.

O teste que encerra a integração deve relacionar um pedido aprovado real, seu valor/moeda e identificador ao recebimento na UTMify e no Meta, além do GA4 quando configurado. Aceite da API ou status de envio e visualização processada no painel são evidências distintas e devem ter horários registrados.

## Limites desta evidência

Foram inspecionados os controles atuais da UTMify, o carregador público disponibilizado pelo painel e o tutorial indicado por ele. Em etapa posterior autorizada, foi criado apenas o endpoint receptor UTMify **COWBOY — Appmax**, conforme registrado acima. Não houve inspeção de contrato privado Appmax, alteração de pixel, configuração de checkout ou teste de compra. A conexão efetiva e a ausência de duplicação ainda dependem da configuração e homologação conduzidas na implantação COM-035.
