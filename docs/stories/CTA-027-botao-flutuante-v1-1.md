# CTA-027 — Atualização 1.1 com botão de compra flutuante

Status: implementação e verificação local concluídas; publicação em andamento.

## Solicitação

Em 09/09/2026 o proprietário pediu colocar “Quero começar minha rotina” flutuante quando a pessoa selecionar a quantidade de frascos, mantendo todos os detalhes, design e estrutura da página. Publicar como atualização e preservar a versão atual.

## Preservação

- Baseline em produção: `f21f0e767f16d74af172b3e5d3738aac82bd9720` (PR #7).
- Tag de preservação: `v1.0-before-cta-027`.
- `cowboy-nova.html`, CSS e JS atuais permanecem intactos. Nova página `cowboy-v1-1.html` usa os mesmos arquivos e acrescenta somente os recursos do CTA flutuante.
- Produção principal passa à versão 1.1. Versão anterior disponível em `/v1-0` e `/nova`; nova versão também acessível em `/v1-1`.

## Critérios

- [x] Manter conteúdo, imagens, vídeos, preços, kits, botão original, rastreamento e aparência existente.
- [x] Exibir CTA flutuante após seleção explícita de kit, inclusive clicar no kit de 2 já selecionado.
- [x] Usar o mesmo formulário para respeitar quantidade, UTMs, disponibilidade e checkout.
- [x] Ocultar flutuante quando o botão original estiver visível ou o kit indisponível; manter navegação por teclado e espaço para leitura.
- [x] Verificar celulares e desktop, quatro kits e ausência de regressão na versão anterior.
- [x] Executar testes, lint, build e check:build.
- [ ] Conferir preview, publicar atualização e reler produção e versão preservada.

## Verificação local

- 32 testes de integração/QA aprovados; sintaxe de 36 arquivos JS; build de 45 arquivos e check:build aprovados.
- 12 testes E2E aprovados em Chrome headless isolado, viewports 390×844 e 1440×900. Todos os quatro kits e suas UTMs chegaram ao endpoint esperado; seleção pelo teclado, kit indisponível, botão original e versão anterior verificados.
- SDKs externos bloqueados apenas nos testes locais: nenhum pedido ou evento de compra foi enviado por esses testes.
- Capturas em `.local/cta-027-evidence/floating-390.png` e `floating-1440.png`, conferidas visualmente.
- `cowboy-nova.html` conserva exatamente o blob Git do baseline: `b618198206937e72deca6609a43c2492017e2aef`. CSS e JS anteriores não foram alterados.
- Chromium empacotado não estava instalado; usado Chrome já instalado via `E2E_CHANNEL=chrome`, sem instalar navegador ou alterar perfil do usuário.

## File List

- `cowboy-v1-1.html`
- `assets/css/cowboy-floating-checkout.css`
- `assets/js/cowboy-floating-checkout.js`
- `scripts/build-site.js`
- `package.json`
- `package-lock.json`
- `tests/e2e/cowboy-floating-checkout.spec.js`
- `docs/stories/CTA-027-botao-flutuante-v1-1.md`
