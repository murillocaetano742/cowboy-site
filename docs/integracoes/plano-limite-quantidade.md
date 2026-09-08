# Ajuste proposto do limite do frasco avulso

**Status: proposta para revisão; não aplicada.**

## Problema

O produto 29750488, variante 211742450, custa R$ 54,76 e retornou `max_quantity: 0` e `max_quantity_count: 0`. Os kits de 2 e 4 retornaram 1 para os dois campos. Ainda não foi homologado se o checkout avulso permite aumentar quantidade mantendo o preço individual, o que conflitaria com a oferta de R$ 42,38 por frasco nos kits.

## Mudança pretendida

Limitar o checkout avulso a uma unidade do produto e encaminhar a escolha de dois ou quatro frascos para seus kits reais. Não alterar preço, estoque, variante, imposto, pagamento ou o conteúdo dos kits.

| Campo do produto | Antes, conforme GET | Alvo proposto |
| --- | ---: | ---: |
| `id` | 29750488 | preservar |
| `max_quantity` | 0 | 1 |
| `max_quantity_count` | 0 | 1 |

Representação revisável dos campos candidatos:

```json
{
  "id": 29750488,
  "max_quantity": 1,
  "max_quantity_count": 1
}
```

O endpoint de atualização de produto é oficial, mas os dois campos de limite não apareceram no esquema público de atualização já consultado. Portanto, esse JSON **não é um contrato de execução validado**. Antes de qualquer envio, confirmar a semântica e suporte dos campos em documentação vigente ou configurar o equivalente no painel autorizado e acessível. Não houve solicitação HTTP para aplicar a proposta.

## Verificação necessária

1. Observar o comportamento atual do checkout avulso sem concluir pagamento.
2. Confirmar o controle oficial de limite e preservar snapshot dos campos.
3. Configurar máximo de uma unidade apenas no produto avulso.
4. Reler o cadastro e conferir que a quantidade não pode ultrapassar um nesse checkout.
5. Conferir o kit de 2 por R$ 84,76 e o de 4 por R$ 169,52, com quantidade de um kit por pedido e frete correto.

Se a intenção comercial for permitir quantidades livres ou misturar kits, será necessária uma regra de desconto por volume e logística correspondente, ambas homologadas. Esta proposta limita o fluxo aos kits já conciliados; não cria essa regra.

## Reversão

Se o ajuste de limite for executado posteriormente e causar regressão, restaurar exclusivamente os dois campos aos valores anteriores do snapshot e verificar o checkout novamente. Nenhuma reversão foi executada ou agendada.

## Impedimento atual

A captura da janela Vercel/Chrome foi interrompida pelo runtime porque ele não conseguiu determinar com confiança a URL atual. Isso ocorreu antes de observar o conteúdo autenticado e é distinto de uma tela pedindo login. Nenhuma falha de autenticação de Melhor Envio, UTMify ou Google foi inferida a partir desse bloqueio de captura.

