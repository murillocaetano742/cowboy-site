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

## Frete ainda pendente de acesso

Na consulta atual do kit de 2 ao CEP público 01001-000, o checkout ofereceu PAC por **R$ 34,78** e SEDEX por R$ 72,15. Com PAC, o total foi **R$ 189,58 à vista / 12× R$ 19,70**. Logo, a condição gratuita nos kits de 2 e 3 ainda não pode ser considerada configurada ou homologada. A sessão administrativa segue no login.

Configuração autorizada a aplicar: manter a variante 211742450 no perfil pago; criar perfil gratuito apenas para 211742746 e 212751381; conferir entrega, parcela e total após inserir CEP em cada checkout, além dos limites de quantidade. A [documentação oficial de frete](https://help.cartpanda.com/pt-br/article/configure-o-frete-da-sua-loja-li5szb/) orienta Admin > Frete > Criar Novo Perfil e permite selecionar variantes específicas.

A [API oficial Shipping Rate v3](https://dev.cartpanda.com/api/v1/projects/cHJqOjg1NTYz/nodes/e9906233413a2) documenta cadastro de transportadoras externas por `callback_url`, não perfis nativos ou taxa fixa por variante. O [schema Update Product](https://dev.cartpanda.com/api/v1/projects/cHJqOjI5NTM3/nodes/b915e306b8540) não documenta `max_quantity`/`max_quantity_count`; a [ajuda de produto físico](https://help.cartpanda.com/pt-br/article/criando-um-produto-fisico-rgya2r/) aponta Apps > Limitar quantidades. Não foram tentados endpoints administrativos privados nem criados serviços de frete alternativos.

## Publicação

A nova versão dos cards será disponibilizada em Preview. A produção permanece no PR #14 até alinhar o frete no checkout com a condição anunciada. A pendência é acesso administrativo, não nova aprovação para o ajuste já solicitado.

## Validação

Revisão visual nos tamanhos 320, 390 e 1440 px: parcelas sem quebra, sem rolagem horizontal e sem erros locais de console/runtime com rastreadores externos isolados. Parcelas em 28–32 px e valores à vista em 13,44 px. Juros e totais permanecem visíveis; no avulso, o frete pago deixou de ser riscado. Capturas reais privadas: `.local/vsl-031/viewport-320.png`, `viewport-390.png` e `viewport-1440.png`.

No worktree isolado baseado na main após PR #14, `npm test` passou 47/47, lint de sintaxe passou (43 arquivos) e build passou (60 arquivos). `check:commerce` confirma os três destinos e retorna exit 1 somente pela configuração ausente de Melhor Envio, como na VSL-030. Os seis E2E da página passaram em 1,7 minuto, incluindo acessibilidade e capturas mobile/desktop; os artefatos ficaram somente na pasta temporária.
