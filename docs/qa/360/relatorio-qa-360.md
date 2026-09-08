# QA — página COWBOY Energia 360 (`cowboy-360.html`)

Data: 08/09/2026. Servidor local `PORT=4180 npm run dev`, rota `http://127.0.0.1:4180/cowboy-360`. Nenhum teste tocou Cartpanda ou Melhor Envio reais.

## Gates locais existentes

| Gate | Comando | Resultado |
| --- | --- | --- |
| Sintaxe JS | `npm run lint` | 27 arquivos, ok |
| Testes unitários/QA | `npm test` | 22/22 |
| Build por allowlist | `node scripts/check-build.js` | ok, 56 arquivos em `dist/` (inclui páginas do Codex) |

## E2E real no navegador (Playwright 1.63 + Chromium)

`npm run test:e2e` (`tests/e2e/cowboy-360.spec.js`): **6/6**.

1. Sem erros de console; nenhum `api/checkout` ou "Continuar para o pagamento" antes do capítulo 9; um único botão de compra na página.
2. Modelo 3D carrega (`data-ready="true"`), status "pronto", botão de girar responde.
3. Trocar o kit atualiza o painel; recapitulação dos capítulos aparece; formulário GET para `/api/checkout` preservado.
4. axe-core (WCAG 2.1 A/AA): 0 violações após a correção de contraste no capítulo 9.
5. Captura desktop 1440 px sem rolagem horizontal.
6. Captura mobile 390 px sem rolagem horizontal.

Capturas em `docs/qa/360/pagina-desktop.png`, `pagina-mobile.png`, `modelo-3d.png` (locais, fora do git).

## Lighthouse 13.4 (Chrome headless)

| Perfil | Performance | Acessibilidade | Boas práticas | SEO |
| --- | --- | --- | --- | --- |
| Mobile (emulado) | 92 | 100 | 96 | 69 |
| Desktop | 100 | 100 | 96 | 69 |

Mobile: FCP 1,8 s, LCP 2,9 s, TBT 30 ms, CLS 0. Desktop: LCP 0,6 s, CLS 0,001.

- SEO 69 é intencional: a página está com `noindex` enquanto é revisão. Ao promover para `index.html`, trocar para `index,follow`.
- Boas práticas 96: aviso de `favicon.ico` 404 corrigido com favicon SVG inline; bf-cache bloqueado por `Cache-Control: no-store` do servidor local (não se aplica à Vercel).
- Aviso de nome acessível nos botões de girar corrigido (texto visível é o nome).

## Segurança

- Gitleaks 8.30.1: histórico (21 commits) 0 achados; árvore de trabalho 1 achado, exatamente `.env.local` (ignorado pelo git). Relatórios JSON ficam fora do git.
- Semgrep CE 1.176.1, `p/javascript` + `p/nodejs` + `p/secrets`, 105 regras, 109 arquivos incluindo não rastreados: 0 achados.
- Threat model em `docs/qa/360/threat-model-360.md`.
- Dependência de cliente auto-hospedada: `assets/js/vendor/three.min.js` r128 (MIT), SHA-256 `9274bbcec8d96168626c732b5d31c775aa8cfb7eaa0599bec0c175908a2c1ce2`.

## Revisão de interface (Web Interface Guidelines, Vercel)

Aplicadas na construção: `text-wrap: balance` nos títulos; aspas curvas e reticências tipográficas; `tabular-nums` em preços e tabela; `width`/`height` em todas as imagens; `loading="lazy"` abaixo da dobra e `fetchpriority="high"` no hero; `touch-action: manipulation`; `prefers-reduced-motion` desliga a animação do hero e o giro automático; `color-scheme: dark` e `theme-color`; `autocomplete="postal-code"`, `inputmode="numeric"`, `spellcheck="false"` no CEP; `scroll-margin-top` nos capítulos; foco visível em todos os controles; folha de capítulos fecha com Esc e devolve o foco.

## Pendências de QA

- Homologar frete real e checkout no ambiente com credenciais (fora do escopo local).
- Teste manual de leitor de tela no modelo 3D (o canvas tem `role="img"` e descrição; os botões dão a alternativa por teclado).
- Revisar o texto do modelo 3D no rótulo em telas Retina reais (a textura tem 2048 px de largura).
