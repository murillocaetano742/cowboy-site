# REBUILD-006 — Revisão visual da vitrine

Status: revisão estática concluída; inspeção visual em navegador pendente

## Objetivo

Validar a vitrine COWBOY Energia em navegador nos tamanhos 360, 390, 768 e desktop, cobrindo apresentação do produto, fluxo de kits, teclado, zoom e overflow.

## Critérios de aceitação

- [x] Ler a implementação final e o parecer independente anterior.
- [x] Verificar uma vez a disponibilidade do navegador pelo mecanismo suportado.
- [x] Revisar estaticamente layout responsivo, semântica, foco, controles, imagens e textos comerciais.
- [x] Corrigir defeitos estáticos objetivos encontrados no frontend.
- [x] Reexecutar as verificações locais afetadas pela mudança.
- [ ] Inspecionar visualmente a página em 360 px, 390 px, 768 px e desktop.
- [ ] Percorrer a página somente por teclado e confirmar ordem/foco visível.
- [ ] Confirmar reflow em zoom e ausência de overflow horizontal no navegador.
- [ ] Obter revisão independente das mudanças após a inspeção visual.

## Achados e correções

- `RV-01`: elementos `.picture-frame` são figuras e ainda recebiam as margens padrão do navegador. Isso reduzia a largura útil das imagens do produto, especialmente no mobile. O CSS agora zera a margem do componente.
- `RV-02`: botões desativados mantinham a aparência e o cursor de ação. O CSS agora mostra opacidade reduzida, cursor de indisponibilidade e remove a transformação de hover.
- `RV-03`: o endereço de email do SAC podia ultrapassar contêineres estreitos ou ampliados. Links `mailto:` agora podem quebrar em qualquer ponto quando faltar espaço.

## Limite da evidência

A conexão suportada respondeu `No browser is available` na única tentativa desta rodada. Conforme as regras do navegador e a coordenação entre agentes, não houve repetição, troca de backend, controle de desktop, Playwright externo ou outro contorno. Portanto, esta story não declara aprovação visual.

O protocolo reproduzível e a matriz de pendências estão em `docs/qa/visual-v2.md`.

## Verificação local

- `npm.cmd run build`: 14 arquivos no pacote público.
- `npm.cmd run lint`: sintaxe de 20 arquivos aprovada; este gate não executa ESLint ou TypeScript.
- `npm.cmd test`: 21/21 testes aprovados.
- `npm.cmd run check:build`: allowlist, referências locais e isolamento da saída Vercel aprovados.
- SHA-256 de `assets/css/cowboy.css` e da cópia em `dist`: `17A201603B2E914C1F8D0265C7FAA935DD2B95250D2FBDC798BAD422C13763C2`.

## File List

- `assets/css/cowboy.css`
- `dist/assets/css/cowboy.css`
- `docs/qa/visual-v2.md`
- `docs/stories/REBUILD-006-revisao-visual.md`
