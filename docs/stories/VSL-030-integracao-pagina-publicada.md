# VSL-030 — Integração da página VSL publicada

Status: código publicado pelo PR #14 em 16/09/2026; frete e limites por produto conferidos na VSL-031. Checkout legado de quatro frascos e ativação recorrente da atividade permanecem pendentes.

## Solicitação e limites

Integrar a oferta publicada de 1, 2 e 3 frascos ao Cartpanda, confirmar parcelamento, habilitar atividade apenas com pedidos reais e conferir os eventos de vídeo. Preservar copy, imagens, CSS/JS da página e `data-vsl-gate="off"`. WhatsApp, prazo e estoque dependem dos dados reais fornecidos pelo proprietário. Preservar as alterações locais pré-existentes.

## Critérios e progresso

- [x] Conferir código, credencial local e identidade da loja pela API autenticada.
- [x] Atualizar e reler os preços das variantes 211742450, 211742746 e 212751381: R$ 79,90, R$ 154,80 e R$ 199,90.
- [x] Conferir peso de 0,5 kg e embalagem 23 × 8 × 8 cm no kit de 3.
- [x] Configurar e verificar frete grátis nos kits de 2 e 3; manter frete pago no avulso. Concluído e homologado na [VSL-031](VSL-031-parcelamento-e-frete.md).
- [ ] Conferir limite de quantidade e descontinuação do kit de 4 no checkout.
- [x] Confirmar limite de parcelas e juros no checkout: até 12× com acréscimo; não inserir valores nos cards.
- [x] Implementar e testar exportação pela CLI de pedidos pagos reais para o contrato público de atividade, com autorização de publicação e exclusão de testes.
- [ ] Ativar exportação recorrente e publicação após confirmar fuso da API e configurar pedidos autorizados; nenhuma recorrência ativa nesta entrega.
- [x] Conferir eventos VSL localmente e nos painéis GA4/Meta: start/progress recebidos no GA4, complete/Meta ainda não confirmados.
- [x] Aplicar WhatsApp informado nesta sessão: 5511970842160; dois links locais validados.
- [ ] Atualizar prazo/estoque quando o proprietário informar os valores reais (não fornecidos).
- [x] Executar check:commerce, checkout-local, npm test e E2E da página nova; registrar limitações.
- [ ] Publicar e verificar o WhatsApp em produção a partir da main atual, preservando alterações locais paralelas.

## File List

- `docs/stories/VSL-030-integracao-pagina-publicada.md`
- `cowboy-nova.html` (somente `body data-whatsapp`)
- `package.json`
- `.env.example`
- `scripts/cartpanda-sync-vsl-offer.js`
- `scripts/cartpanda-sync-activity.js`
- `tests/integrations/activity.test.js`
- `tests/e2e/cowboy-nova.spec.js` (isolamento de rastreadores externos)
- `docs/integracoes/README.md`
- `docs/integracoes/integracao-vsl-2026-09-16.md`
- `docs/integracoes/atividade-cartpanda.md`
- `docs/integracoes/rastreamento-vsl-2026-09-16.md`
- `docs/integracoes/validacao-vsl-2026-09-16.md`

## Evidências

Consulta autenticada de produtos em 16/09/2026 retornou HTTP 200 para a loja `cowboy-energia`, confirmou os três IDs de variante e preços antigos de R$ 54,76 / R$ 84,76 / R$ 127,14. O kit de 4 continua cadastrado no provedor; não é roteado pela página atual.

Os três preços foram atualizados pela API e relidos com sucesso; checkout público também confirmou os valores. Peso do kit de 3 já era 0,5 kg. Frete ainda cobrado (R$ 16,98 para consulta do kit de 3 no CEP operacional) e perfil gratuito aguarda acesso administrativo. Parcelamento público até 12× tem acréscimo.

Validação inicial: 36 testes, 6 E2E, 3 redirecionamentos e 2 links WhatsApp aprovados. `check:commerce` confirma links, mas retorna exit 1 por ausência de configuração Melhor Envio; não comprova preço nem frete no provedor. E2E teve ajuste no isolamento de UTMify; CSS/JS da página permaneceram idênticos. Ver os relatórios da File List para limites de cada evidência.

Atividade: 11 testes adicionais aprovados, incluindo o tratamento de reembolso zero em formato decimal, consulta/exportação real `4 pedidos → 0 elegíveis`, sem alteração do feed. Duas compras operacionais foram excluídas pelo ID, outra por flag de teste e a restante por cancelamento. Nenhum nome de comprador foi publicado. A CLI exige confirmação do fuso para candidatos com datas sem offset e allowlist privada para publicação autorizada.
