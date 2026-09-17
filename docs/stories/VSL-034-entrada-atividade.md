# VSL-034 — Entrada no início e avisos de compras

Status: implementação validada; publicação pendente · 17/09/2026

## Pedido e escopo

O proprietário relata que o site abre na seleção de kits e pede notificações de clientes comprando no lugar dos avisos de envio de fotos. A mudança está autorizada somente para esses comportamentos. Preservar copy comercial, imagens, galeria, preços, parcelamento, checkout, rastreamento e VSL com gate desligado.

## Critérios de aceite

- [x] Abrir a página pela raiz ou por link antigo com `#kit` mostra o início; recarregar depois de chegar aos kits também começa no início.
- [x] Preservar os parâmetros de atribuição da URL e os saltos internos para os kits após a entrada.
- [x] Notificações usam somente pedidos reais elegíveis, até 12 mais recentes, sem reutilizar relatos/fotos nem repetir a mesma compra na visita.
- [x] Lista vazia não produz aviso; galeria e depoimentos permanecem disponíveis.
- [x] Excluir permanentemente também a compra operacional de teste #5 (ID 51980506), mesmo que autorizada por engano para publicação.
- [x] Validar comportamento no navegador com rastreadores isolados, testes de integração, lint e build.
- [ ] Publicar a correção e conferir os arquivos servidos no domínio.

## Evidência inicial

Reprodução em Chromium local antes da correção: raiz em `scrollY=0`; URL com `#kit` em `scrollY=6817`, permanecendo nessa posição ao recarregar. Não existe redirecionamento de servidor para `#kit`. Os links compartilhados de preview incluíam esse fragmento; o JavaScript da página não controlava a posição inicial nem a restauração da rolagem. O componente de avisos acrescentava `relatos` à fila depois dos pedidos e reciclava a fila até seis vezes.

Consulta Cartpanda somente leitura em 17/09/2026 às 10:27 BRT: cinco pedidos, zero elegíveis — três pagamentos operacionais de teste (#3, #4 e #5), outro pedido marcado como teste e um cancelado. O pedido #5 foi realizado pelo proprietário para verificar checkout e eventos Meta/UTMify. Nenhum comprador será inventado ou publicado a partir desses testes.

A exportação de pedidos permanece pelo CLI existente, sem agendamento. O feed vazio não equivale a uma integração contínua; primeira publicação depende de compra elegível, autorização de nome/cidade e data com fuso confirmado.

## Validação

- `npm test`: 47/47 aprovados.
- `npm run lint`: sintaxe de 43 arquivos aprovada; o projeto não possui script `typecheck`.
- `npm run check:build`: 60 arquivos; allowlist, referências locais e isolamento público aprovados.
- Script inline de entrada validado com `vm.Script`.
- Checkout local (porta 4188): três variantes corretas, UTMs preservadas, parâmetro pessoal descartado; sem seguir redirects externos.
- E2E completo: 12/12 aprovados (seis anteriores e seis regressões novas), exit 0 em 4,4 minutos, com rastreadores bloqueados e fixtures somente no navegador de teste. Cobertura inclui entrada pela raiz e fragmento, recarga com/sem hash, atribuição, CTA, compras únicas/limite de 12, datas inválidas/futuras, pausa por vídeo/aba oculta, tempo relativo atualizado e fechamento.
- Axe WCAG 2.1 AA e capturas mobile/desktop aprovados. Artefatos locais fora do build: `.local/vsl-034-qa/`.
- Revisão: diff restrito aos oito arquivos abaixo; galeria, preços, parcelamento, WhatsApp, pixel, GA4, UTMify e gate desligado preservados.

## File List

- `cowboy-nova.html`
- `assets/js/cowboy-nova.js`
- `assets/data/atividade.json`
- `scripts/cartpanda-sync-activity.js`
- `tests/integrations/activity.test.js`
- `tests/e2e/cowboy-nova.spec.js`
- `docs/integracoes/atividade-cartpanda.md`
- `docs/stories/VSL-034-entrada-atividade.md`
