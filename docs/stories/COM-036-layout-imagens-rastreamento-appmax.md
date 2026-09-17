# COM-036 — Layout, imagens e rastreamento do checkout Appmax

Status: preview aprovado; publicação e ativação externa pendentes · 17/09/2026

## Pedido e escopo

Melhorar a apresentação do AppCheckout com a identidade COWBOY e imagens reais dos três kits, conferir a legibilidade em celular e demonstrar o funcionamento de Meta, UTMify e GA4. Preservar as condições comerciais já aprovadas. As mudanças externas e qualquer publicação seguem a coordenação do root; preparar e testar o resultado antes de publicar.

Base: `ee4a91e0af822da73b13ee99f5c0f54e8fa7cedc`, merge do PR #19. Worktree isolado `.local/appmax-036-checkout`, branch `fix/appmax-036-checkout`. O workspace principal e o fechamento local da COM-035 são preservados.

## Critérios de aceite

- [x] Preparar identidade e imagens reais aprovadas para os três kits, identificando corretamente 1, 2 e 3 frascos no preview.
- [x] Conferir legibilidade, proporções das imagens e usabilidade do checkout em celular e desktop, incluindo campos e botão de finalização.
- [x] Preservar preços à vista, fretes e parcelamento conforme a tabela abaixo; conferir as condições no checkout com o tema em preview.
- [x] Documentar os sinais de Meta, UTMify e GA4 com evidência observada, distinguindo configuração, envio e recebimento. Não fabricar Purchase nem atribuir a um teste uma compra inexistente.
- [x] Registrar limitações que dependam de um pagamento real autorizado, sem declarar homologação de compra apenas pela presença de scripts.
- [x] Executar as verificações pertinentes às alterações realizadas e registrar resultados e artefatos fora do build público.
- [ ] Publicar os assets após os gates e o GO do root, verificando READY, domínio e conteúdo público.
- [ ] Ativar o registro visual externo separado no Appmax após os assets responderem HTTP 200; verificar a instalação nativa com `--live`, sem injeção local.

## Condições comerciais a preservar

| Frascos | Kit Appmax | Produto à vista | Frete | 12 parcelas com frete |
| --- | --- | --- | --- | --- |
| 1 | 38251476 | R$ 79,90 | R$ 26,75 | R$ 11,54 |
| 2 | 38251410 | R$ 154,80 | Grátis | R$ 16,75 |
| 3 | 38251519 | R$ 199,90 | Grátis | R$ 21,64 |

No avulso, 12x R$ 8,65 refere-se somente ao produto; o total à vista incluindo frete é R$ 106,65. Os demais valores e regras permanecem conforme a COM-035.

## Coordenação e dependências

- Root coordena a proposta visual, a operação externa autorizada e a liberação de publicação.
- Hubble e Lovelace usam este worktree para suas frentes e mantêm seus arquivos separados; a File List deve ser atualizada quando houver novos artefatos.
- @devops prepara a story/worktree e executa eventual commit, PR e publicação após liberação, sem incluir alterações concorrentes do workspace principal.
- Referências da implantação anterior: `docs/stories/COM-035-migracao-appmax.md` e `docs/integracoes/appmax-tracking-2026-09-17.md`. A COM-035 deixou a confirmação de uma compra real e seus eventos como pendência explícita.
- URLs de webhook, tokens, dados pessoais e credenciais ficam fora do repositório e das evidências públicas.
- Documentação isolada não exige um novo deploy de produção.

## Validação

O tema é restrito ao host `cowboyenergia.carrinho.app` e aos três caminhos AppCheckout aprovados. A VSL não carrega os novos assets e não foi alterada. O build inclui apenas os dois arquivos novos de apresentação.

As fotos são os WebP reais já públicos de `imagens/v5/kit-1.webp`, `kit-2.webp` e `kit-3.webp`. O script só substitui uma imagem nativa vazia ou o placeholder CloudFront exato observado, sem `srcset`; uma imagem nativa válida é preservada. Não houve upload nativo: a tentativa pelo Chrome foi impedida pela permissão de arquivo.

As duas fontes próprias retornaram HTTP 200 com `Access-Control-Allow-Origin: *` já existente, e carregaram no checkout em todos os cenários. Não foi necessário alterar os headers ou o `vercel.json`.

Gates concluídos em 17/09/2026:

- `npm test`: 49/49.
- `npm run lint`: 46 arquivos.
- `npm run build` e `npm run check:build`: 62 arquivos, allowlist e isolamento aprovados.
- `npm run check:commerce`: três links Appmax e fretes 2675/0/0 aprovados.
- `npx playwright test tests/e2e/cowboy-appmax.spec.js`: 3/3, incluindo isolamento por host/caminho, formulário preservado e prioridade de fundo/foco sobre o CSS nativo.
- Typecheck: não aplicável; o projeto não tem esse script.
- `node tests/qa/appmax-checkout-preview.js`: 6/6 no checkout público, três kits em 375 e 1440 px; conclusão às 18h43min54s BRT. Preços, frete, parcelas, actions/methods dos formulários, controles, mensagens de erro e estados nativos preservados. Cartão, Pix e Boleto acessíveis por Tab/Enter. Nenhum overflow horizontal ou erro JavaScript observado; fontes e fotos carregadas. As capturas aguardam a transição nativa terminar, sem alterar opacidade ou bloqueios de pagamento.

Artefatos locais em `.local/com-036-qa/`: `preview-results.json` e capturas `kit-{1,2,3}-{mobile,desktop}-{full,summary,payment}.png`. A QA bloqueia rastreadores e mutações, não preenche dados e não submete pedido; somente as duas consultas nativas observadas de preço Pix/Boleto são permitidas. O modo `--live` verifica a instalação real e respostas HTTP dos assets, sem substituir respostas por arquivos locais ou inserir scripts.

O root aprovou as capturas corrigidas do kit 2 em celular/desktop e liberou a publicação após ler o resultado 6/6. A ativação externa será feita em registro visual próprio, separado do registro de rastreamento **8426**. Rollback visual: desativar somente o novo registro; preservar o 8426.

O relatório `docs/integracoes/rastreamento-appmax-com-036.md` registra três pares PageView/ViewContent com envio informado pela UTMify sem erro e os loaders GA4/Meta presentes. A leitura agregada do Meta não correlacionou essas visitas; recebimento GA4, IC de acesso direto e uma nova Purchase Appmax permanecem explicitamente sem comprovação. Nenhuma compra ou Purchase foi fabricada.

## File List

- `docs/stories/COM-036-layout-imagens-rastreamento-appmax.md`
- `scripts/build-site.js`
- `assets/css/cowboy-appmax.css`
- `assets/js/cowboy-appmax.js`
- `tests/qa/appmax-checkout-preview.js`
- `tests/e2e/cowboy-appmax.spec.js`
- `docs/integracoes/rastreamento-appmax-com-036.md`
