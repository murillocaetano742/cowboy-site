# REBUILD-002 — Readiness da entrega COWBOY Energia

Status: DoD local aceito — lançamento externo bloqueado

## Resultado esperado

Separar com clareza o que pode ficar pronto no repositório, o que precisa ser validado em navegador e o que depende de credenciais, contas ou decisões externas para entrar em produção.

## Critérios de aceitação

- [x] Oferta e copy implementadas com preços de R$ 54,76 para 1 frasco e R$ 42,38 por unidade a partir de 2.
- [x] A página não publica 24 gotas nem duração de kits enquanto a documentação não for reconciliada.
- [x] Três famílias de imagens receberam inspeção visual independente; são recriações com IA e o microtexto não serve como fonte de uso.
- [x] Nenhum depoimento ou print de WhatsApp sem origem/consentimento foi publicado.
- [ ] Página responsiva, acessível e sem sinais artificiais de vendas, estoque ou urgência.
- [ ] Cartpanda preparada no código e validada em conta de teste com produtos, preços e retorno.
- [ ] Melhor Envio preparada no código e validada com CEPs de teste, origem, dimensões/peso e credencial oficial.
- [ ] UTMify preparada e validada de ponta a ponta até pedido aprovado, sem expor dado sensível na URL.
- [ ] Google validado com domínio, Search Console, sitemap/robots, dados estruturados coerentes e identificadores reais.
- [x] QA independente concluiu API, build, HTTP local e redirects Cartpanda locais; navegador real, tracking e contas externas permanecem gates próprios.
- [x] CEO registrou aceite do DoD local com limitações; deploy/publicação permanecem pendentes.

## Estados de readiness

- `repo_ready`: artefato implementado e verificado localmente.
- `browser_ready`: fluxo executado em navegador contra ambiente de teste.
- `account_ready`: configuração confirmada em conta externa autorizada.
- `production_ready`: revisão independente aprovada e configuração externa conciliada.

Nenhum estado posterior é inferido a partir de um estado anterior. Código preparado não prova integração ativa, e credenciais presentes não provam eventos ou pedidos conciliados.

## Bloqueios externos conhecidos

- Cartpanda: slug `cowboy-energia` e credencial foram fornecidos fora do repositório; ainda faltam validação na conta, URLs/IDs de kits, ambiente de teste e webhook/eventos.
- Melhor Envio: CEP de origem 74475-239 e pacote até quatro frascos (23 × 8 × 8 cm, 0,5 kg) foram informados; ainda faltam token/conta, serviços aceitos, política de frete e teste. O frasco individual foi informado com 0,06 kg.
- UTMify: identificadores, token quando aplicável, nomenclatura de eventos e acesso para validar atribuição.
- Google: domínio/URL final, propriedade e acesso ao Search Console e GA4, ID de medição e decisão sobre consentimento.
- Produto: documento formal do responsável técnico que reconcilie rótulo, 12 gotas e o relato de 24 gotas.
- Prova social: material real e consentimento verificável das pessoas retratadas.

Critério específico de checkout: homologar a alteração de quantidade no resumo Cartpanda. Os links dos kits 1/2/4 estão corretos localmente, mas não há prova de que duas unidades do SKU avulso recebem automaticamente o preço unitário de R$42,38 nem de que múltiplos kits preservam embalagem e frete. Isso é uma pendência de teste, não um bug confirmado.

## Estado local observado em 07/09/2026 23:52 BRT

- Produto/criação: concluído; três assets aprovados visualmente por QA independente.
- Frontend: correções concluídas; 6/6 testes DOM/HTML aprovados. Não houve teste de navegador.
- Backend e build: suíte 21/21, HTTP local 25/25, três redirects locais 3/3 sem seguir destino, build com 14 arquivos e lint de sintaxe aprovados pelo QA.
- DevOps/contas: entrega local concluída. Vercel CLI com token inválido, conector 403, runtime visual indisponível e nenhum deploy; novas investigações externas foram suspensas.
- Cartpanda: PUT oficial seguido de GET confirmou produtos 29750488/29750542/29750543, variantes preservadas e totais R$54,76/R$84,76/R$169,52. URLs reais ficam no `.env.local` ignorado. O resumo público recebeu desafio 403; nenhuma compra foi feita.
- Melhor Envio, UTMify e Google continuam sem homologação.
- Melhor Envio, UTMify e Google: não homologados.

## File List

- `docs/stories/REBUILD-002-readiness-entrega.md`
