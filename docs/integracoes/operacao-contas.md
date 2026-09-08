# Operação das contas e publicação — COWBOY Energia

Checkpoint de 7 de setembro de 2026, horário de Brasília. A conferência dos produtos terminou às 23h41 (2026-09-08T02:41:56Z).

## Estado comprovado

| Camada | Resultado | Limite |
| --- | --- | --- |
| Código e serviço local | Build público isolado, páginas e APIs disponíveis em `http://127.0.0.1:4173` | Serviço de revisão local, sem publicação externa |
| API real validada | Cartpanda respondeu HTTP 200 à listagem e à releitura de cada produto atualizado | Não equivale à conclusão de compra |
| Conta configurada | Três kits Cartpanda com os preços novos, títulos, descrição, dimensões e envio físico | Melhor Envio, UTMify e cadastro fiscal completo ainda não foram confirmados |
| Produção publicada | Não realizada | Autenticação Vercel inválida; checkout público bloqueou a leitura automatizada |

## Produtos e preços Cartpanda

Os produtos existentes foram atualizados; seus IDs e variantes foram preservados. Não foi enviada alteração de quantidade, controle de estoque, tributos ou forma de pagamento.

| Kit | Produto | Variante | Preço anterior | Preço confirmado depois |
| --- | ---: | ---: | ---: | ---: |
| 1 frasco de 30 mL | 29750488 | 211742450 | R$ 89,90 | R$ 54,76 |
| 2 frascos de 30 mL | 29750542 | 211742746 | R$ 109,90 | R$ 84,76 |
| 4 frascos de 30 mL | 29750543 | 211742749 | R$ 219,92 | R$ 169,52 |

Os títulos passaram de “Tratamento Cowboy Energia” para “COWBOY Energia” acompanhado da quantidade e do volume. A descrição informa categoria, composição, advertências e uso conforme rótulo; não promete tratar doenças, não apresenta 24 gotas como recomendação geral e não inventa duração de kit. A ancoragem anterior de preço foi removida (`compare_at_price = 0`).

Cada variante representa **um kit pronto para envio**, com peso total de 0,5 kg, comprimento de 23 cm, largura de 8 cm e altura de 8 cm. O campo `requires_shipping` passou de 0 para 1, coerente com um produto físico. O peso de 0,06 kg por frasco continua sendo um dado separado de inventário em `config/logistics.js`; não foi somado novamente ao pacote pronto. Preço, peso, medidas e indicação de envio foram relidos na API após cada alteração.

Os valores novos foram enviados em reais; a conferência comparou os preços das variantes com 5476, 8476 e 16952 centavos. Nenhum pedido ou pagamento foi criado.

### Links reais retornados pela conta

- [Checkout de 1 frasco](https://cowboy-energia.mycartpanda.com/checkout/211742450:1)
- [Checkout de 2 frascos](https://cowboy-energia.mycartpanda.com/checkout/211742746:1)
- [Checkout de 4 frascos](https://cowboy-energia.mycartpanda.com/checkout/211742749:1)

Esses links estão configurados nas variáveis `CARTPANDA_CHECKOUT_1_URL`, `CARTPANDA_CHECKOUT_2_URL` e `CARTPANDA_CHECKOUT_4_URL` do arquivo privado `.env.local`. O serviço local foi reiniciado após essa configuração e após a padronização dos eixos da embalagem. `checkoutAvailable` informa a presença dessas URLs validadas no contrato local; não atesta aprovação de pagamento ou frete.

A leitura HTTP dos três resumos públicos recebeu **403**, com a página “Just a moment…” e a indicação de habilitar JavaScript/cookies. Esse desafio não foi contornado. Portanto, os valores estão comprovados pela API autenticada, mas o resumo visual, meios de pagamento e total com frete ainda precisam de homologação no checkout.

O kit de 3 frascos não foi criado. Alterações de quantidade no carrinho, combinações de kits e pedidos acima de quatro frascos não foram homologados. O desconto unitário está representado nos kits de 2 e 4; não foi criada uma regra automática para qualquer combinação de carrinho.

## Melhor Envio, UTMify e Google

**Melhor Envio:** a origem confirmada é 74475-239. O pacote já está configurado no código e nas variantes Cartpanda. Não há token Melhor Envio, ambiente homologado, serviços aceitos ou cotação real comprovados. A documentação Cartpanda descreve a conexão em Admin → Frete → Gerenciar Integrações → Melhor Envio, seguida de origem e taxa de envio. A conexão OAuth e o cálculo final no checkout não foram feitos. O endpoint local de frete informa indisponibilidade, sem criar valores ou prazos. [Integração oficial Melhor Envio](https://help.cartpanda.com/pt-br/article/melhor-envio-a0iyi4/)

**UTMify:** não foi obtida a URL de postback/pixel da conta, nem ativado rastreador ou evento de compra. A rota local preserva os parâmetros de atribuição permitidos. A documentação Cartpanda localiza o postback em Admin → Rastreamento → Affiliate Tracking (Pixel & S2S); a configuração depende da URL emitida pela própria UTMify e de um teste de atribuição e pagamento em modo de teste. [Postback oficial](https://help.cartpanda.com/pt-br/article/s2s-postback-13wi92k/)

**Google:** robots, sitemap e metadados foram preparados no projeto. Não houve acesso autenticado ao Search Console, verificação de propriedade ou envio do sitemap. Não há afirmação de indexação, ranking ou configuração completa do Google. A URL pública prevista continua `https://cowboyenergiamasculina.com.br/`.

O nome empresarial completo e o endereço físico do vendedor não foram confirmados pela conta. O CNPJ informado no rótulo, sozinho, não resolve essa pendência. Nenhum dado de diretório secundário foi publicado como cadastro fiscal validado.

## Acesso ao computador e Vercel

A ferramenta Browser retornou lista vazia de navegadores. Computer Use localizou janelas do Chrome, mas interrompeu a captura antes de acessar os painéis. Mensagem exata:

> Computer Use has been stopped for this turn because it could not determine the current browser URL on Windows with enough confidence to enforce policy. Stop your work and send a final message noting why Computer Use ended.

As ações de GUI foram interrompidas. Não foram alteradas configurações de segurança, instaladas extensões ou usados cookies/perfis extraídos.

O projeto Vercel existente é `cowboy-site`, ID `prj_ajQb20v1ThC8YW1XZWeCbRBTPbpD`, organização `team_6Lu95yqd8jYXoRTRTCmWhj2g`. O conector retornou 403 em inspeção anterior. A CLI oficial 59.11.7 foi executada no projeto e respondeu:

> The specified token is not valid. Use `vercel login` to generate a new token.

Nenhum projeto substituto foi criado. Não houve preview remoto, promoção de produção ou push. Após a instrução do usuário para cessar solicitações de ambiente, a investigação externa foi encerrada neste checkpoint; somente trabalho local continuou.

## Build e revisão local

O comando `npm run build` copia uma lista explícita de 14 arquivos para `dist/`: quatro páginas HTML, robots, sitemap, CSS, JavaScript e seis imagens finais. Arquivos novos no repositório não entram automaticamente no site. O `outputDirectory` Vercel aponta para `dist`; as APIs seguem em `api/` com as configurações necessárias no servidor. `.vercelignore` exclui documentos, auditorias, testes, arquivos privados e scripts operacionais da origem de publicação.

`npm run dev` inicia o servidor de revisão em `127.0.0.1:4173`, servindo apenas `dist/` e os três handlers de API. `.env.local` é carregado somente no processo de servidor. Logs não imprimem seus valores. O servidor foi deixado em execução na sessão 58230; ele depende de o computador e o processo permanecerem ativos. Se essa sessão encerrar, abra um terminal na pasta `C:\Users\User\Downloads\VS_CODE`, execute `npm.cmd run build` e depois `npm.cmd run dev`. Mantenha esse terminal ativo enquanto revisa `http://127.0.0.1:4173`. Não há serviço permanente instalado nem promessa de persistência do host.

Verificações locais realizadas: 21 testes automatizados, 25 requisições HTTP do QA independente, três redirecionamentos locais para as variantes reais, isolamento de arquivos públicos e validação de sintaxe JavaScript. A primeira rodada HTTP ocorreu sem URLs de checkout configuradas; a revisão posterior de redirecionamentos usou os links reais acima e passou sem seguir o destino externo. Consulte `docs/qa/relatorio-v2.md` para o resultado final de cada rodada.

O comando `lint` valida sintaxe com `node --check`; não é ESLint. TypeScript não é utilizado neste projeto, e análise estática de tipos não foi executada. O empacotamento das funções na infraestrutura Vercel ainda precisa de execução autenticada; passar no servidor local não comprova o runtime remoto.

## Evidências privadas e reversão

Os seguintes arquivos são locais, ignorados pelo Git e excluídos do build público:

- `.env.local`: credencial Cartpanda e URLs dos kits; não copiar para documentação ou frontend.
- `.local/cartpanda-products-before.json`: snapshot sanitizado inicial de produtos e variantes.
- `.local/cartpanda-before-fields-29750488.json`, `-29750542.json` e `-29750543.json`: campos anteriores a cada atualização.
- `.local/cartpanda-offer-receipt.json`: campos relidos após a atualização.
- `.local/cartpanda-checkout-public.json`: resultado das leituras públicas, incluindo os bloqueios 403.

Para reverter preços, o operador deve usar os preços das variantes nos snapshots, em reais: 89,90; 109,90; 219,92. O `price` superior de alguns retornos está em centavos; não o reenviar como reais. A reversão deve restaurar apenas os campos desejados, preservar IDs/estoque e reler cada produto para conciliar o resultado. Não há reversão automática agendada. Nenhuma reversão foi executada.

O script `scripts/cartpanda-update-offer.js` possui modo de revisão por padrão; a opção `--apply` foi utilizada apenas para as alterações autorizadas registradas acima. Os scripts `cartpanda-*` são ferramentas operacionais fora da publicação. Sua presença não significa execução contínua.

## Próximas dependências concretas

1. Restabelecer um acesso autorizado e funcional à Vercel do projeto existente e ao navegador, respeitando os controles do ambiente.
2. Homologar resumo dos kits, pagamento de teste, envio físico, origem e frete real no Cartpanda/Melhor Envio.
3. Configurar a conta UTMify e demonstrar atribuição de um evento de teste, sem duplicidade.
4. Confirmar identificação empresarial/endereço do vendedor e políticas comerciais aplicáveis.
5. Fazer preview Vercel, conferir funções/arquivos públicos e só então publicar a versão aprovada.
6. Verificar propriedade no Search Console e enviar o sitemap da versão publicada.

Não houve compra, campanha, envio de mensagem a terceiros, pagamento de etiqueta ou cobrança de assinatura nesta operação.
