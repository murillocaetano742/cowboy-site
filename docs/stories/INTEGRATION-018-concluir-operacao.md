# INTEGRATION-018 — Concluir checkout, frete e rastreamento

Status: Em execução.

## Solicitação

Concluir as pendências da publicação RELEASE-017: Cartpanda, Melhor Envio, Vercel, Pixel Meta, UTMify e Google.

## Critérios

- [x] Corrigir e reler o cadastro físico do kit de 3 frascos, preservando preço, variante e oferta.
- [ ] Conferir integração e cotação de frete no checkout Cartpanda.
- [ ] Restabelecer acesso às configurações do projeto Vercel.
- [ ] Configurar IDs reais do Pixel/Google e recebimento de eventos UTMify.
- [ ] Homologar checkout e rastreamento com pedido de teste.
- [ ] Relatar somente resultados comprovados e dependências restantes.

## File List

- `docs/stories/INTEGRATION-018-concluir-operacao.md`
- `.local/cartpanda-integration-018.cjs` (operação privada, excluída do Git)
- `assets/js/cowboy-pixel.js`
- `cowboy-nova.html`
- `scripts/build-site.js`
- `privacidade.html`
- `tests/integrations/meta-pixel.test.js`

## Acessos

- Cartpanda: token existente permite leitura de produtos; atualização será feita somente no contrato oficial.
- Vercel: CLI desconectada; login oficial por código de dispositivo iniciado.
- Navegador: nenhuma superfície disponível para este runtime.
- IDs públicos Pixel/GA4/GTM e conta UTMify solicitados ao proprietário.

## Evidências de execução

- 09/09/2026 02:23:59 UTC (08/09 23:23 Brasília): variante 212751381 reconciliada com `requires_shipping=1`, peso 0,5 kg, 23×8×8 cm e preço R$ 127,14. Identidade, preço, estoque, regras de quantidade e link comparados ao snapshot anterior.
- A primeira chamada PUT somente com campos físicos zerou o preço da variante. Detectado na releitura em 02:23:27 UTC; restauração e reconciliação concluídas em 02:23:59 UTC. Script corrigido para incluir o preço existente em toda atualização física. Snapshots privados antes/depois/conciliação preservados em `.local/cartpanda-integration-018-*`.
- `GET /api/v3/cowboy-energia/shipping_rates` respondeu 200 com lista vazia. Isso não comprova o estado de todas as integrações nativas no painel.
- Pedidos consultados pelo endpoint oficial para 08/09–09/09/2026: resposta 200, total 0, página única. Nenhum pedido retornado no período abrangendo a ocorrência.
- Proprietário confirmou Pixel Meta `1006075098894986`. Script implementado para PageView e ViewContent, sem disparar compra na vitrine; checkout e compra permanecem responsabilidade da configuração Cartpanda. Global Privacy Control impede o carregamento; script repetido não duplica eventos.
