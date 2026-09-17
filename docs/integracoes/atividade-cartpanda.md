# Pedidos reais no feed de atividade

Exportador implementado na story VSL-030, em 16/09/2026. A VSL-034, em 17/09, limita os avisos da página a compras reais; relatos de fotos e vídeos permanecem somente na galeria.

## Estado verificado

Consulta autenticada somente leitura em 17/09/2026, às 10:27:19 BRT: HTTP 200, cinco pedidos, quatro pagos e zero elegíveis. Três são compras operacionais pagas: `51915653`, `51921061` e `51980506`, documentadas em `prontidao-campanhas-2026-09-10.md` e `docs/stories/VSL-034-entrada-atividade.md`; outro pedido tem indicação de teste e o restante está cancelado. As compras operacionais têm `test=0` na API e estão excluídas explicitamente pelo ID, mesmo se autorizadas por engano. Nenhum pedido novo além desses cinco foi encontrado; nenhum comprador foi publicado. A lista de autorizações está vazia e o fuso dos timestamps ainda não foi confirmado.

O feed desta revisão mantém `pedidos: []` e esvazia `relatos: []`, preservando o contrato do exportador. O navegador ignora relatos e mostra somente compras com nome, kit inteiro de 1 a 3 e data ISO com fuso válida e não futura, em ordem das mais recentes, limitadas a 12. Cada entrada aparece uma vez por visita; o fim da fila não reinicia os mesmos pedidos. Página oculta ou VSL reproduzindo adiam a apresentação sem consumir a compra. Fechar o aviso encerra a sequência. Sem compras elegíveis, nenhum aviso aparece. A galeria não foi alterada.

O script está disponível e testado. **Não há agendamento nem sincronização contínua ativados.** A publicação estática precisa de uma nova exportação, build e deploy para receber alterações. Um webhook escrevendo no filesystem de uma função Vercel não atualizaria o arquivo estático já publicado.

## Configuração privada

Configure em `.env.local` ou no ambiente secreto do executor, nunca em código público:

| Variável | Finalidade |
| --- | --- |
| `CARTPANDA_API_TOKEN` | Credencial somente no servidor/CLI. Já disponível no ambiente local. |
| `CARTPANDA_SHOP_SLUG` | Deve ser `cowboy-energia`; o script também confere a loja de cada pedido retornado. |
| `CARTPANDA_ACTIVITY_APPROVED_ORDER_IDS` | IDs separados por vírgula dos pedidos com autorização registrada para exibir primeiro nome e cidade/UF. Vazio publica zero pedidos. Não incluir dados pessoais nessa lista. |
| `CARTPANDA_ACTIVITY_EXCLUDE_ORDER_IDS` | IDs adicionais de testes, compras internas ou pedidos a retirar do feed. As três compras operacionais já conhecidas são sempre excluídas, mesmo se constarem da lista de autorizados. |
| `CARTPANDA_ORDER_TIMEZONE` | Fuso IANA confirmado para os timestamps sem offset retornados pela API. Não inferir pelo computador ou pela localização do cliente. |

A página afirma “nome como o cliente autorizou”; por isso pagamento aprovado sozinho não autoriza publicação. Registre a autorização fora do repositório antes de incluir o ID. Para revogar, retire-o da lista e execute exportação, build e deploy.

Na consulta atual, a API devolveu `created_at` sem offset e `shop.timezone` vazio. O fuso continua sem confirmação. Por exemplo, `America/Sao_Paulo` só pode ser configurado depois de confirmar que é o fuso dessas datas na Cartpanda. Um pedido com timestamp ISO já contendo `Z` ou offset não precisa dessa conversão. Datas inválidas, futuras, inexistentes ou ambíguas por horário de verão são rejeitadas.

## Execução

```powershell
npm run activity:check
npm run activity:sync
npm run build
npm run check:build
```

`activity:check` consulta a API e mostra apenas contagens e motivos agregados; não escreve arquivos e não imprime compradores, pedidos brutos ou credencial. `activity:sync` faz nova consulta completa e substitui apenas `pedidos` em `assets/data/atividade.json`, preservando o campo legado `relatos` vazio e os demais campos. O navegador não usa esse campo nos avisos. A escrita é atômica e, se o conteúdo já for igual, preserva o arquivo sem mudança. Uma retirada ou reembolso é refletido na próxima exportação bem-sucedida e publicação.

Depois desses comandos, o responsável `@devops` publica o build pelo fluxo do projeto e confere `/assets/data/atividade.json` no domínio. Executar apenas a sincronização local não altera produção. Se uma consulta falhar, a paginação mudar ou estiver incompleta, ou a data de um candidato autorizado não puder ser verificada, a gravação falha e o feed existente permanece intacto; o executor deve interromper o build/deploy e alertar o operador.

Para exportação periódica, configure o executor de CI/deploy para rodar essa mesma sequência, com ambiente secreto, a cada 15 minutos e sem execuções sobrepostas. Habilite publicação somente depois dos gates do projeto e confira o resultado em produção. A frequência é uma proposta operacional; nenhum cron, tarefa Windows, workflow de push ou daemon foi criado nesta entrega. O executor também deve executar uma rodada após revogação de autorização, cancelamento, reembolso ou compra identificada como teste.

## Regras de elegibilidade e privacidade

- Apenas pagamento `payment_status=3`, status conhecido permitido, sem cancelamento, reembolso parcial/total ou chargeback.
- Flags `test` e `is_cartx_test` precisam estar presentes e explicitamente desligadas. Marcadores de teste em notas/tags e os IDs de exclusão prevalecem sobre autorização.
- Variantes extraídas dos links públicos de `config/commerce.js`: `211742450` = 1 frasco; `211742746` = 2; `212751381` = 3. Soma as quantidades reais; rejeita itens desconhecidos, kit descontinuado, frações e pedidos com mais de três frascos.
- Saída limitada aos 12 pedidos autorizados mais recentes, com apenas `{ nome, cidade, kit, quando }`. `nome` contém só o primeiro nome; `cidade` contém cidade/UF validada. IDs, sobrenome, email, CPF, telefone, endereço, CEP e payload bruto não são gravados no feed ou logs.
- `quando` é o instante de criação de um pedido atualmente pago (`created_at`), convertido para ISO UTC; não é apresentado como o horário de confirmação do pagamento. Nada é substituído pelo horário da exportação.
- A API é relida por completo, sem mesclar resultados antigos, para retirar registros que perderam elegibilidade. Paginação é construída na origem fixa; redirects e URLs de próxima página recebidos não carregam a credencial. O limite de segurança é 100 páginas; excedê-lo interrompe a exportação sem publicar uma amostra parcial.

## Contrato e verificação

O [contrato oficial List Orders](https://dev.cartpanda.com/docs/cartx-api-doc/a25cdf50ac872-list-orders), relido em 16/09/2026, documenta `GET /{shop-slug}/orders`, resposta `orders.data`, paginação, `payment_status` (`1` pendente, `3` pago, `4` cancelado) e status de reembolso. O [recurso estruturado oficial](https://dev.cartpanda.com/api/v1/projects/cHJqOjI5NTM3/nodes/a25cdf50ac872) confirmou os campos usados. A consulta autenticada confirmou o formato para esta loja. A [central Cartpanda](https://help.cartpanda.com/pt-br/article/gerencie-seus-pedidos-e5sbif/) explica a consulta dos estados e a linha do tempo do pedido no painel.

`node --test tests/integrations/activity.test.js` verifica minimização de dados, autorização/revogação, exclusão de testes/reembolsos, variantes e quantidades, timezone/DST, ordenação/limite, paginação, prevenção de vazamento de credencial, escrita idempotente, preservação dos relatos e manutenção do arquivo em caso de falha. Os compradores das fixtures são sintéticos e existem somente nos testes; nunca são usados pelo exportador real.
