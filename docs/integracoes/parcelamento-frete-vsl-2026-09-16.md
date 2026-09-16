# Parcelamento em destaque e frete por kit — VSL-031

O proprietário autorizou destacar o valor das parcelas nos cards, mantendo o frete pago no avulso e gratuito nos kits de 2 e 3.

## Valores confirmados no checkout público

| Kit | À vista | 12 parcelas antes de frete | Soma das parcelas do produto |
| --- | --- | --- | --- |
| 1 frasco | R$ 79,90 | R$ 8,30 | R$ 99,60 |
| 2 frascos | R$ 154,80 | R$ 16,08 | R$ 192,96 |
| 3 frascos | R$ 199,90 | R$ 20,77 | R$ 249,24 |

Todos têm acréscimo no parcelamento. Os valores foram relidos nas opções do seletor de parcelas das variantes 211742450, 211742746 e 212751381 em 16/09/2026; nenhuma compra ou pagamento foi realizado. A soma acima é a multiplicação das 12 parcelas exibidas, não uma taxa mensal inferida.

A nova hierarquia usa parcela como valor principal, com juros e soma informados, preço à vista secundário e nota de frete à parte no avulso. Fontes, cores, imagens, script da página, WhatsApp e gate são preservados.

## Frete configurado e homologado

Na consulta anterior ao ajuste, do kit de 2 ao CEP público 01001-000, o checkout ofereceu PAC por **R$ 34,78** e SEDEX por R$ 72,15. Com PAC, o total foi **R$ 189,58 à vista / 12× R$ 19,70**. Essa divergência bloqueou a publicação dos novos cards até corrigir e homologar o frete.

Após o proprietário confirmar o login, root concluiu a configuração no painel autenticado: perfil **822059 — COWBOY — Frete grátis kits 2 e 3**, restrito aos produtos dos kits de variantes **211742746 e 212751381**; zona **1419583**, Brasil **27/27 estados**; taxa **117409 — Frete grátis**, **R$ 0**, peso **0–100000 g**, `hide_paid_if_has_free=1`. A origem logística existente **581233**, Goiânia/GO, foi preservada. O perfil pago **818748** ficou somente com a variante avulsa **211742450**.

A releitura do perfil pago confirmou a zona **1408068**, Brasil **27/27 estados**, taxa **40904 — Melhor Envio Calculado**, `isFree=0`, `hide_paid_if_has_free=0`. Assim, o frete calculado do avulso foi mantido nacionalmente. A [documentação oficial de frete](https://help.cartpanda.com/pt-br/article/configure-o-frete-da-sua-loja-li5szb/) orienta Admin > Frete > Criar Novo Perfil e permite selecionar variantes específicas.

Root homologou o comportamento nos checkouts públicos pelo navegador, após inserir CEP e sem finalizar pedido ou pagamento:

| Kit e destino | Frete observado | À vista com o frete escolhido | Parcelamento com o frete escolhido |
| --- | --- | --- | --- |
| 1 frasco — São Paulo/SP, 01001-000 | PAC R$ 34,03; SEDEX R$ 71,40. PAC selecionado. | R$ 113,93 | 12× R$ 11,84 |
| 2 frascos — São Paulo/SP, 01001-000 | Somente Frete grátis, R$ 0 | R$ 154,80 | 12× R$ 16,08 |
| 3 frascos — São Paulo/SP, 01001-000 | Frete grátis, R$ 0 | R$ 199,90 | 12× R$ 20,77 |
| 3 frascos — Manaus/AM, 69005-010 | Frete grátis, R$ 0 | Sem alteração do total de R$ 199,90 | Total sem alteração |

O avulso antes do frete manteve R$ 79,90 à vista / 12× R$ 8,30. A releitura dos perfis confirmou um produto no perfil pago e dois produtos/uma zona no gratuito.

## Limites de quantidade

O avulso estava sem limite e recebeu máximo de **três unidades**, com persistência relida no painel. Em checkout público fresco, root confirmou a sequência 1→2→3; tentar adicionar a quarta unidade fez o servidor retornar o carrinho a três unidades, com aviso de atualização. Os kits de 2 e 3 já tinham máximo de **uma unidade de cada kit**, mantido sem alterações. Preços e estoque foram preservados; nenhum dado pessoal, pedido ou pagamento foi enviado nessa validação.

O limite nativo é por produto e não comprova teto agregado de três frascos em carrinho misto. No produto legado de quatro frascos (**29750543**), a ação de torná-lo indisponível foi salva, mas a releitura mostrou **Loja online 0 / Checkout 1**. O checkout legado continua ativo: não se declara desativação completa. O formulário do kit não foi salvo por apresentar recomposição divergente do preço. A investigação desse checkout segue separada; root autorizou publicar os cards, cujo fluxo atual aceita somente os kits de 1–3 frascos.

A [API oficial Shipping Rate v3](https://dev.cartpanda.com/api/v1/projects/cHJqOjg1NTYz/nodes/e9906233413a2) documenta cadastro de transportadoras externas por `callback_url`, não perfis nativos ou taxa fixa por variante. O [schema Update Product](https://dev.cartpanda.com/api/v1/projects/cHJqOjI5NTM3/nodes/b915e306b8540) não documenta `max_quantity`/`max_quantity_count`; a [ajuda de produto físico](https://help.cartpanda.com/pt-br/article/criando-um-produto-fisico-rgya2r/) aponta Apps > Limitar quantidades. Não foram tentados endpoints administrativos privados nem criados serviços de frete alternativos.

## Publicação

A nova versão dos cards está no [PR #15, em rascunho](https://github.com/murillocaetano742/cowboy-site/pull/15), commit `7352c5022f80be9784dcd24bb93fbb2e1a07cef4`. A [prévia na seção dos kits](https://cowboy-site-kwqhv79m3-murillo-digital.vercel.app/#kit) está READY: deployment `dpl_WsnEVxe3riXwof3CCMo4xUzTLs9Q`, target Preview. Ambos os checks Vercel passaram.

A consulta HTTP sem sessão à prévia retornou 302 para o SSO Vercel. A proteção foi preservada; o smoke remoto de parcelas/CSS/checkout depende desse acesso, sem ser confundido com os testes locais aprovados. Após homologar o frete nos checkouts públicos, root autorizou liberar o rascunho e publicar a PR #15 quando os checks estiverem aprovados.

## Validação

Revisão visual nos tamanhos 320, 390 e 1440 px: parcelas sem quebra, sem rolagem horizontal e sem erros locais de console/runtime com rastreadores externos isolados. Parcelas em 28–32 px e valores à vista em 13,44 px. Juros e totais permanecem visíveis; no avulso, o frete pago deixou de ser riscado. Capturas reais privadas: `.local/vsl-031/viewport-320.png`, `viewport-390.png` e `viewport-1440.png`.

No worktree isolado baseado na main após PR #14, `npm test` passou 47/47, lint de sintaxe passou (43 arquivos) e build passou (60 arquivos). `check:commerce` confirma os três destinos e retorna exit 1 somente pela configuração ausente de Melhor Envio, como na VSL-030. Os seis E2E da página passaram em 1,7 minuto, incluindo acessibilidade e capturas mobile/desktop; os artefatos ficaram somente na pasta temporária.

Após configurar o perfil Cartpanda, foram repetidos somente os comandos solicitados: `npm run check:commerce` manteve os três checkouts disponíveis e exit 1 pela ausência local de Melhor Envio; `node tests/qa/checkout-local.js` passou **3/3** com servidor em 4173, HTTP 302 e variantes/UTMs corretas, sem seguir os destinos. O servidor próprio foi encerrado. Não houve alteração de código nem repetição dos 47 testes/seis E2E nesta etapa.
