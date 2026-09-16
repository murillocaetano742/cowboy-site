# Integração da VSL — 16/09/2026

Story: `docs/stories/VSL-030-integracao-pagina-publicada.md`.

## Cartpanda: alterações reais

API autenticada da loja `cowboy-energia` consultada antes e depois da atualização. Os preços também foram conferidos no checkout público pelo navegador, sem finalizar pedido.

| Frascos | Produto | Variante | Antes | Depois |
| --- | --- | --- | --- | --- |
| 1 | 29750488 | 211742450 | R$ 54,76 | R$ 79,90 |
| 2 | 29750542 | 211742746 | R$ 84,76 | R$ 154,80 |
| 3 | 29892228 | 212751381 | R$ 127,14 | R$ 199,90 |

Os três kits têm `requires_shipping=1`, peso **0,5 kg**, comprimento **23 cm**, largura e altura **8 cm**. O peso do kit de 3 já estava corrigido antes desta execução. O script preservou título, descrição, SEO, imagens, estoque, SKU, regras de quantidade e demais campos monitorados; fez a releitura de cada produto para conciliar o resultado.

Comando usado: `node --env-file=.env.local scripts/cartpanda-sync-vsl-offer.js --apply`. Sem `--apply`, somente lê e apresenta as alterações. Snapshots de antes/depois ficam na pasta privada `.local/vsl-030/offer-*/`. Não executar o script legado `cartpanda-update-offer.js` para esta oferta: ele representa preços anteriores.

## Frete e limite de quantidade: pendentes

O login administrativo do Cartpanda estava expirado; acesso solicitado ao proprietário. A API de produtos não configura os perfis de frete. A documentação oficial orienta criar um perfil personalizado, escolher os produtos/variantes e cadastrar a taxa de envio: [frete personalizado por produtos](https://help.cartpanda.com/pt-br/article/configure-o-frete-da-sua-loja-li5szb/).

Configuração a concluir no painel: perfil restrito às variantes **211742746 e 212751381**, taxa gratuita nos destinos atendidos, mantendo frete pago no avulso. A consulta do kit de 3 para o CEP operacional 74475-239 retornou **R$ 16,98 de SEDEX**, total à vista **R$ 216,88**. Portanto, frete grátis ainda **não está homologado**; a cobrança atual não é necessariamente os R$ 25 informados no pedido inicial.

O site aceita somente os kits 1–3 e rejeita o kit de 4. Na conta, os kits de 2 e 3 têm máximo de uma unidade do kit, mas o avulso estava sem limite (`max_quantity=0`). O produto legado de 4 frascos continua cadastrado. A configuração de limite no provedor e a desativação do legado devem ser concluídas no painel; não foram consideradas resolvidas pelo limite da API local.

## Parcelamento confirmado no checkout

O seletor do Cartpanda Pay oferece **até 12 parcelas com acréscimo**. Antes de adicionar frete, foram observadas estas opções:

- Avulso: 1× R$ 79,90 ou 12× R$ 8,30 (soma R$ 99,60).
- Kit de 2: 1× R$ 154,80 ou 12× R$ 16,08 (soma R$ 192,96).
- Kit de 3: 1× R$ 199,90 ou 12× R$ 20,77 (soma R$ 249,24).

O frete altera a base e os valores das parcelas. Nenhum número de cartão ou dado pessoal de comprador foi informado. Não houve pagamento nem pedido criado. Os cards da página continuam sem valor de parcela, pois a condição não é 12× sem juros.

## Página e dados

O proprietário informou **11 97084-2160** nesta sessão. Alteração autorizada no HTML: `body data-whatsapp="5511970842160"`. Copy, imagens e CSS/JS da página foram preservados. A data atual de 30/09 e o estoque vazio permanecem aguardando informação real; `data-vsl-gate="off"` foi preservado.

Pedidos reais: implementação e condições de ativação em `atividade-cartpanda.md`. O histórico inclui compras operacionais com flag de teste falsa; elas devem ser excluídas explicitamente. Não foram fabricados pedidos para preencher o feed.

Rastreamento: `rastreamento-vsl-2026-09-16.md`. GA4 recebeu start/progress; complete e eventos VSL no Meta não foram confirmados.

Validação local: `validacao-vsl-2026-09-16.md`. Publicação do HTML e execução recorrente são estados separados dos preços já atualizados na conta.
