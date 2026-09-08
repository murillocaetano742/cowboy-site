# QA — página COWBOY Energia nova (`cowboy-nova.html`, conversão, mobile first)

Data: 08/09/2026. Servidor local `PORT=4180 npm run dev`, rota `http://127.0.0.1:4180/cowboy-nova` (na Vercel: `/nova`). Nenhum teste tocou Cartpanda ou Melhor Envio reais. Versão de conversão (08/09, tarde): gancho na dor, depoimentos no topo, agitação, virada, mecanismo, garantia de 30 dias com anti-garantia, oferta com preço por porção e pilha de valor, compra só no fim. Copy em `docs/produto/copy-conversao-nova.md`; briefing de imagens para o Codex em `docs/criacao/briefing-imagens-conversao.md`.

## Gates locais existentes

| Gate | Comando | Resultado |
| --- | --- | --- |
| Sintaxe JS | `npm run lint` | 28 arquivos, ok |
| Testes unitários/QA | `npm test` | 22/22 |
| Build por allowlist | `node scripts/check-build.js` | ok, 68 arquivos em `dist/` (inclui as páginas do Codex) |

## E2E real no navegador, mobile primeiro (Playwright 1.63 + Chromium, 390 × 844, DPR 2, toque)

`npm run test:e2e` (`tests/e2e/cowboy-nova.spec.js`): **6/6**.

1. Ordem de conversão verificada no HTML (relatos antes da agitação, garantia antes da oferta); nenhum `api/checkout` nem botão de compra antes da seção de kits; um único botão de compra; sem "cura", "resolve de uma vez", "resultado garantido", "22.000", estrelas, "avaliações", "estoque baixo", "24 gotas" ou "aprovado pela Anvisa" (a negação "não promete cura" é permitida); largura de rolagem = 390 px; sem erros de console.
2. Relatos em rolagem lateral logo após o gancho: 2 vídeos com `controls` e sem autoplay primeiro (ordem verificada "vvpppppp"), depois 6 fotos reais de clientes enviadas pelo proprietário (`imagens/clientes/`, redimensionadas a 1080 px, sem metadados EXIF, legendas por perfil e sem nomes inventados); pontos e setas navegam.
3. Trocar o kit atualiza o painel; recapitulação dos capítulos aparece; pill de capítulos abre a folha e Esc fecha; formulário GET para `/api/checkout` preservado.
4. axe-core (WCAG 2.1 A/AA): 0 violações.
5. Captura mobile completa.
6. Captura desktop 1440 px sem rolagem horizontal.

Defeitos encontrados e corrigidos nesta rodada: o e-mail do SAC forçava o grid dos cards a 400 px (página estourava para 421 px e o navegador móvel reduzia o zoom); lista de números com marcadores; pontos da galeria com área de toque de 9 px; título quebrando mal em 390 px; botão de pagamento em duas linhas.

Capturas em `docs/qa/nova/pagina-mobile.png` e `pagina-desktop.png` (locais, fora do git).

## Lighthouse 13.4 (Chrome headless)

| Perfil | Performance | Acessibilidade | Boas práticas | SEO |
| --- | --- | --- | --- | --- |
| Mobile (emulado) | 99 | 100 | 100 | 69 |
| Desktop | 100 | 100 | 100 | 69 |

Mobile: LCP 2,2 s, TBT 50 ms, CLS 0. Desktop: LCP 0,5 s, CLS 0. SEO 69 é o `noindex` intencional de revisão; ao promover para `index.html`, trocar para `index,follow`. bf-cache bloqueado só pelo `Cache-Control: no-store` do servidor local.

## Segurança

- Gitleaks 8.30.1: histórico 0 achados; árvore de trabalho 1 achado, exatamente `.env.local` (ignorado pelo git). Relatórios JSON ficam fora do git.
- Semgrep CE 1.176.1, `p/javascript` + `p/nodejs` + `p/secrets`, 146 arquivos incluindo não rastreados: 0 achados.
- Threat model em `docs/qa/nova/threat-model-nova.md`.
- Fontes auto-hospedadas (OFL 1.1): Oswald variável e Manrope variável. Sem Google Fonts, sem CDN, sem script de terceiros.

## Revisão de interface (Web Interface Guidelines, Vercel; craft floor do Impeccable)

Aplicadas: `text-wrap: balance` nos títulos; aspas curvas; `tabular-nums` em preços e tabela; `width`/`height` em todas as imagens; `loading="lazy"` abaixo da dobra e `fetchpriority="high"` no hero; `touch-action: manipulation`; áreas de toque ≥ 24 px (pontos da galeria, pill, folha); `prefers-reduced-motion` desliga a animação do hero e o deslize suave; `color-scheme: dark` e `theme-color`; `autocomplete="postal-code"`, `inputmode="numeric"`, `spellcheck="false"` no CEP; `scroll-margin-top` nas seções; foco visível dourado em todos os controles; ícones SVG em vez de emoji; seleção de texto, foco e barra de progresso no tema.

## Pendências de QA

- Homologar frete real e checkout no ambiente com credenciais (fora do escopo local).
- Confirmar no painel Cartpanda as formas de pagamento antes de listar "PIX, boleto ou cartão" na página.
- Teste em aparelho real (iOS Safari) para o `backdrop-filter` do cabeçalho e do pill.
