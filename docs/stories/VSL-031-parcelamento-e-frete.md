# VSL-031 — Parcelamento em destaque e frete por kit

Status: frete configurado e checkouts homologados em 16/09/2026; publicação da PR #15 autorizada.

## Solicitação

O proprietário pediu destacar o valor das parcelas nos cards e reiterou frete pago somente no avulso, com frete grátis nos kits de 2 e 3. A autorização permite mudar HTML/CSS dos preços nos cards; preservar demais conteúdos, imagens, scripts e oferta sempre visível.

## Critérios e progresso

- [x] Reconfirmar no checkout os valores de 12 parcelas e juros: 12× R$ 8,30 / R$ 16,08 / R$ 20,77 antes de frete.
- [x] Destacar parcelas nos três cards, com preço à vista secundário, juros claros e frete do avulso informado.
- [x] Configurar na Cartpanda frete gratuito apenas nas variantes 211742746 e 212751381 e manter pago na 211742450: perfil 822059, zona Brasil e taxa R$ 0; perfil pago 818748 restrito ao avulso.
- [x] Conferir limites de quantidade na conta sem alterar preços ou parcelamento contratado: avulso máximo 3; kits 2/3 máximo 1 de cada kit. Limite por produto, sem garantia agregada em carrinho misto.
- [x] Validar os três checkouts com CEP, sem criar pedido nem pagamento: kits 2/3 gratuitos; avulso pago; kit 3 também conferido em Manaus/AM.
- [x] Validar visual em 320/390/1440 px, sem overflow nem erros locais; build, lint, 47 testes e seis E2E aprovados.
- [x] Disponibilizar PR e Preview após os seis E2E: PR #15 em rascunho, deployment Preview READY.
- [ ] Publicar por @devops a partir da main atual e conferir domínio público.

## Dependências

O proprietário confirmou o login Cartpanda. O perfil foi configurado pelo painel autenticado e root homologou os três checkouts públicos, liberando merge e publicação. A API de produtos já foi usada na VSL-030 para corrigir preços. Parcelamento: 12× R$ 8,30 / R$ 16,08 / R$ 20,77 com juros, antes do frete do avulso. Não transformar esses valores em promessa de parcelamento sem juros.

## File List

- `docs/stories/VSL-031-parcelamento-e-frete.md`
- `cowboy-nova.html` (preços nos cards e apresentação do frete pago no avulso)
- `assets/css/cowboy-nova.css` (hierarquia dos preços)
- `docs/integracoes/parcelamento-frete-vsl-2026-09-16.md`

## Evidência de checkout

Em 16/09/2026, antes do ajuste, consulta no navegador confirmou os três preços à vista e 12 parcelas com juros. No kit de 2, adicionar o CEP público 01001-000 ofereceu PAC de R$ 34,78, total à vista R$ 189,58 e 12× R$ 19,70. Essa evidência motivou manter a nova apresentação em Preview até configurar e homologar o perfil.

Pesquisa na documentação oficial confirmou que Shipping Rate v3 cadastra serviços externos por callback; não fornece contrato para perfis nativos por variante ou taxa fixa. Após o login, root configurou pelo painel o perfil **822059 — COWBOY — Frete grátis kits 2 e 3**, exclusivamente para esses dois kits; zona **1419583**, Brasil **27/27 estados**; taxa **117409**, **R$ 0**, faixa de peso **0–100000 g**, `hide_paid_if_has_free=1`. Foi mantida a origem logística existente **581233**, Goiânia/GO. O perfil pago **818748** ficou somente com o avulso: zona **1408068**, Brasil **27/27 estados**, taxa **40904 — Melhor Envio Calculado**, `isFree=0`, `hide_paid_if_has_free=0`.

Homologação pública após salvar: kit 2 em São Paulo/SP (CEP 01001-000), somente Frete grátis R$ 0, à vista R$ 154,80 e 12× R$ 16,08; kit 3 no mesmo CEP, Frete grátis R$ 0, à vista R$ 199,90 e 12× R$ 20,77. Kit 3 em Manaus/AM (CEP 69005-010) também ofereceu frete grátis sem alterar o total. Avulso em São Paulo/SP: PAC R$ 34,03 e SEDEX R$ 71,40; com PAC, total à vista R$ 113,93 e 12× R$ 11,84. Antes do frete, manteve R$ 79,90 / 12× R$ 8,30. Nenhum pedido ou pagamento foi finalizado. A releitura dos perfis confirmou um produto no perfil pago e dois produtos/uma zona no gratuito.

Revisão visual: parcelas com tipografia de 28–32 px, valor à vista de 13,44 px, juros e totais legíveis. O frete pago do avulso ganhou ícone neutro e perdeu o risco que sugeria benefício indisponível. Evidência privada em `.local/vsl-031/viewport-{320,390,1440}.png`; root inspecionou as três capturas. Nenhum JavaScript ou imagem foi alterado.

## Preview

- [PR #15, em rascunho](https://github.com/murillocaetano742/cowboy-site/pull/15), commit `7352c5022f80be9784dcd24bb93fbb2e1a07cef4`.
- [Prévia na seção dos kits](https://cowboy-site-kwqhv79m3-murillo-digital.vercel.app/#kit), deployment `dpl_WsnEVxe3riXwof3CCMo4xUzTLs9Q`, target Preview, status READY.
- Checks Vercel e Vercel Preview Comments aprovados. A consulta HTTP sem sessão retornou 302 para SSO Vercel; proteção preservada. A validação remota de HTML/CSS/checkout não foi declarada concluída por esse acesso.
- Homologação pública do frete concluída; root autorizou liberar o rascunho e publicar após checks. Os limites de quantidade seguem como conferência separada, sem bloquear a apresentação das parcelas.

## Verificação local após configurar o perfil

Limites: o avulso estava sem limite e foi configurado com máximo de três unidades, com persistência relida no painel. Root validou no checkout público fresco a sequência 1→2→3; a tentativa de quarta unidade retornou para três após resposta do servidor e aviso de carrinho atualizado. Os kits de 2 e 3 já tinham máximo de uma unidade de cada kit e foram preservados. Não se afirma limite agregado de três frascos em carrinho misto. Nenhum dado pessoal, pedido ou pagamento foi enviado; preços e estoque permaneceram inalterados.

Kit legado de quatro frascos, produto **29750543**: a ação de torná-lo indisponível foi salva; a releitura mostrou **Loja online 0 / Checkout 1**. Portanto, a desativação ficou parcial e o checkout legado continua ativo. O formulário do kit não foi salvo porque recompunha o preço de maneira divergente. O fluxo atual do site oferece somente 1–3 frascos; root autorizou publicar a apresentação das parcelas sem aguardar a investigação separada desse checkout legado.

Executados apenas os comandos solicitados: `npm run check:commerce` confirmou os três checkouts e retornou exit 1 pela configuração ausente do Melhor Envio no ambiente local; esse resultado não verifica o perfil Cartpanda. `node tests/qa/checkout-local.js`, com servidor local em 4173, passou **3/3**: HTTP 302, variantes corretas, atribuição preservada, destinos externos não seguidos. O servidor próprio foi encerrado. Os 47 testes e seis E2E anteriores não foram repetidos, pois HTML/CSS/JS permaneceram inalterados nesta etapa.
