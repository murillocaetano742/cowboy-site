# CTA-028 — Botão de compra limitado à seleção dos produtos

Status: implementação e validação local concluídas; publicação em andamento.

## Solicitação

O proprietário pediu em 09/09/2026: texto do flutuante “Continuar para a compra”; mostrar ao rolar até os produtos, sem exigir clique prévio; ocultar ao sair da seleção de quantidades; não exibir menu mobile junto do botão de compra. Preservar estrutura, design e versões anteriores conforme autorização de atualização vigente.

## Critérios

- [x] Mostrar o botão somente enquanto a grade de seleção de kits estiver na tela, inclusive na chegada por rolagem e no retorno à área.
- [x] Usar o texto “Continuar para a compra” no flutuante e manter o botão original e todo o conteúdo existente.
- [x] Ocultar o menu mobile enquanto o flutuante estiver visível; restaurá-lo fora desse intervalo.
- [x] Manter quantidade, disponibilidade e UTMs no mesmo formulário de checkout; adaptar identificação da UTMify para ambos os botões.
- [x] Preservar HTML/CSS/JS das versões 1.0 e 1.1, com rotas acessíveis e tag `v1.1-before-cta-028`.
- [x] Verificar limites de rolagem, retorno, mobile/desktop, teclado, quatro kits e indisponibilidade; executar gates do projeto.
- [ ] Publicar via @devops após validação e conferir produção.

## Baseline

- Main: `6d0eaf35c7d4dbc383cff98422db139660fd12a1` (PR #8).
- Worktree: `.local/cta-028`; branch `feat/cta-contextual-v1-2`.

## Verificação

- 32 testes de integração/QA aprovados; lint de 38 arquivos JS; check:build de 49 arquivos aprovados. Projeto não possui script TypeScript.
- 15 cenários E2E da versão 1.2 e 12 da 1.1 validados em Chrome isolado, 390×844 e 1440×900. Uma asserção de preservação foi ajustada para rolar completamente além dos produtos em telas altas; os dois cenários afetados passaram novamente.
- Limites superior/inferior, retorno por rolagem, seleção por teclado, redimensionamento, indisponibilidade, quatro kits, UTMs e retorno do menu verificados. SDKs externos bloqueados somente nos testes locais; nenhum pedido simulado enviado.
- Capturas `.local/cta-028-evidence/products-390.png`, `after-products-390.png` e `products-1440.png` conferidas visualmente.
- Nova regra UTMify salva e reaberta: COWBOY `6aa16d0bee215350c09b5b31`, InitiateCheckout habilitado, **Contém URL → `/api/checkout`**. O SDK oficial observa o submit do formulário e reconhece seu action; essa regra atende as três versões e os dois textos sem adicionar eventos manuais. Purchase permanece apenas vendas aprovadas, valor da venda; Lead/AddToCart desabilitados.
- HTML 1.2 deriva da versão 1.1 substituindo somente os dois caminhos dos assets específicos e o texto do botão flutuante. CSS/JS/HTML anteriores intactos.

## File List

- `cowboy-v1-2.html`
- `assets/css/cowboy-floating-checkout-v1-2.css`
- `assets/js/cowboy-floating-checkout-v1-2.js`
- `scripts/build-site.js`
- `package.json`
- `package-lock.json`
- `tests/e2e/cowboy-contextual-checkout.spec.js`
- `docs/stories/CTA-028-botao-contextual-v1-2.md`
