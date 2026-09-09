# GA4-029 — Concluir rastreamento do checkout

Status: correção de continuidade validada localmente, pronta para publicação; homologação dos eventos nativos pendente com Cartpanda.

## Solicitação

O proprietário autorizou as correções da auditoria de eventos com “Pode seguir” e pediu continuidade autônoma. Preservar design, versões anteriores e GA4 `G-VYR2542XCN`.

## Critérios e progresso

- [x] Confirmar GA4 nativo ativo na Cartpanda (cadastro 228112), com SDK e comércio eletrônico habilitados.
- [x] Configurar no Analytics os domínios apex, www e cowboy-energia.mycartpanda.com.
- [x] Configurar o linker antes do GA4 e habilitar decoração do formulário GET no momento de envio.
- [x] Preservar `_gl` no redirecionamento `/api/checkout`, mantendo limites dos demais parâmetros e destinos autorizados.
- [x] Não armazenar o linker em sessionStorage, não gerar identificadores e não emitir eventos de compra manualmente.
- [x] Validar a correção com testes de redirecionamento e navegação com SDK oficial do Google, sem enviar eventos aos provedores.
- [ ] Verificar passagem em produção após deployment.
- [ ] Publicar versão 1.2.1 e preservar o commit anterior por tag/deployment.
- [ ] Confirmar `begin_checkout`, informações de envio/pagamento e `purchase` nativos, incluindo regra de aprovação Pix e deduplicação por transaction_id.

## Contexto técnico

O formulário GET aponta para `/api/checkout`. A função `safeAttribution` removia `_gl`. Além disso, a inspeção do SDK público do Google confirmou que o decorador de cross-domain ignora formulários cujo hostname coincide com o da página, mesmo quando incluído em `domains` e com `decorate_forms: true`.

O JavaScript mantém o fluxo validado da API, mas usa o outro hostname próprio (apex → www e www → apex) no primeiro salto, somente nos dois hosts de produção e no caminho `/api/checkout`. O redirecionamento Vercel www → apex foi consultado diretamente: HTTP 308, preservando a query inteira, inclusive `_gl`. O SDK passa a gerar o linker no envio; a API apenas o encaminha à Cartpanda, sem decodificar, persistir ou truncar. Limite separado de 2048 caracteres; UTMs continuam limitadas a 256 caracteres.

Risco operacional: um redirecionamento adicional em produção, dependente do hostname www e de sua regra canônica, ambos já existentes e verificados. Previews e desenvolvimento local conservam a action relativa. O GET original também funciona sem JavaScript.

Documentação primária: https://developers.google.com/tag-platform/devguides/cross-domain (consultada em 09/09/2026). O Google informa validade de dois minutos e configuração do linker antes de `js`/`config`.

O pedido #3 foi aprovado antes da instalação do GA4 no checkout. Esta correção não recupera retroativamente aquela conversão e não comprova resolução dos eventos nativos da Cartpanda. Suporte foi acionado e recebeu acesso limitado às configurações pertinentes; análise pendente.

## Validação

- `npm test`: 36 aprovados.
- `npm run lint`: sintaxe de 39 arquivos aprovada. Projeto JavaScript sem script `typecheck`.
- `npm run check:build`: build público de 49 arquivos, allowlist e referências aprovadas.
- E2E do CTA contextual: 15 aprovados em Chrome, celular e desktop, incluindo os quatro kits, UTMs, menu e versões anteriores.
- E2E Google linker: 2 aprovados, botão original no desktop e flutuante no celular. SDK público oficial gera `_gl` novo; o redirecionamento real da API local conserva o valor e seleciona o kit correto. A coleta de Analytics e todas as demais requisições externas são interceptadas com resposta local, sem enviar eventos de teste aos provedores.
- Teste do SDK usa cópia local obtida de `https://www.googletagmanager.com/gtag/js?id=G-VYR2542XCN` em 09/09/2026, SHA-256 `7D95641B49D68A19564FB93AE5A4CA66B8C9C023EAF064DC6C5F2292131541A5`. Não incluir a cópia no repositório. Para reproduzir, iniciar o servidor local, apontar `GOOGLE_TAG_FIXTURE` para essa cópia, configurar `E2E_BASE` e executar `npx playwright test tests/e2e/cowboy-google-linker.spec.js`. Sem fixture, os dois testes são explicitamente ignorados.
- A espera inicial do teste buscava somente o coletor google-analytics.com; o SDK atual usa também analytics.google.com. O critério foi corrigido para os dois coletores, e as verificações passaram.
- Revisão independente DevOps não encontrou erro bloqueante. Verificação pública pós-deploy pendente.

Sem alterações em HTML, CSS, preços, meios de pagamento ou campanhas.

## File List

- `assets/js/cowboy-google.js`
- `assets/js/cowboy-store.js`
- `config/commerce.js`
- `package.json`
- `package-lock.json`
- `tests/integrations/google-analytics.test.js`
- `tests/integrations/google-linker.test.js`
- `tests/qa/frontend-flow.test.js`
- `tests/e2e/cowboy-google-linker.spec.js`
- `docs/stories/GA4-029-concluir-rastreamento-checkout.md`
