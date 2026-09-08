# Revisão independente de CSS — COWBOY Energia

Data: 08/09/2026
Parecer: **conditional** — três correções estáticas adequadas; aceite visual em navegador continua pendente.

## Escopo e evidência

Esta revisão cobriu apenas `assets/css/cowboy.css`, sua cópia em `dist/assets/css/cowboy.css`, `docs/qa/visual-v2.md`, `docs/stories/REBUILD-006-revisao-visual.md`, o HTML que consome os seletores e o JavaScript que controla estados desativados. Não houve execução da suíte já registrada, navegação, GUI, publicação ou alteração de arquivo de produto.

O CSS de origem e a cópia em `dist` têm o mesmo SHA-256: `17A201603B2E914C1F8D0265C7FAA935DD2B95250D2FBDC798BAD422C13763C2`.

## Parecer por correção

| ID | Evidência estática | Parecer | Regressão objetiva encontrada |
| --- | --- | --- | --- |
| RV-01 — `.picture-frame { margin: 0; }` | Há dois usos em `index.html`, ambos em `figure.picture-frame`; não existe regra global para `figure`. O espaçamento entre os itens continua sob controle de `.proof-grid { gap: ... }`. | Adequada: remove a margem de agente do elemento certo, sem atingir outras figuras. | Não. |
| RV-02 — `.button:disabled` | A regra vem depois de `.button:hover`, portanto `transform: none` prevalece quando o botão está desativado. O runtime usa o atributo nativo `disabled` tanto para frete quanto para checkout e revela o SAC quando a compra direta não está disponível. | Adequada: cursor, opacidade e ausência de elevação comunicam indisponibilidade sem mudar o bloqueio funcional nativo. | Não. |
| RV-03 — `a[href^='mailto:'] { overflow-wrap: anywhere; }` | Há dois links `mailto:` em `index.html`, inclusive o endereço longo do SAC. O seletor não alcança links comuns, URLs de checkout, preço ou conteúdo de produto. | Adequada: permite quebra sob falta de espaço e preserva destino, texto e semântica do link. | Não. |

## Achados

Não há achado P0, P1 ou P2 de regressão objetiva no escopo estático revisado. O estado `aria-disabled` continua em regra própria e não substitui o atributo nativo `disabled` usado pelo JavaScript.

Permanece um gate P2 de evidência, não um defeito confirmado: sem navegador não é possível confirmar a largura efetiva dos cards, a quebra do e-mail, o cursor, o estado hover ou o reflow em 360 px, 390 px, 768 px, desktop e zoom. `visual-v2.md` e REBUILD-006 registram esse limite corretamente.

## Condição para aceite visual

O parecer pode mudar para `pass` quando a inspeção suportada em navegador registrar os cenários pendentes de viewport, teclado, zoom/reflow e estados indisponíveis. Esta revisão estática não equivale a esse aceite.
