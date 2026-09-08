# QA dirigida — REBUILD-015 COWBOY Conversão

Data: 08/09/2026. Alvo isolado: `cowboy-conversao.html`, seus assets e `cowboy-conversao-mobile.html`. `cowboy-nova.html` não foi usado nesta rodada.

## Resultado da página principal

- 320, 390, 430 e 1440 px: largura do documento igual ao viewport, nenhum elemento fora da tela, zero erro de console/página, zero resposta local com erro e zero recurso 360/Three.js.
- Hero seguido imediatamente pelos dois relatos reais; não há formulário nem barreira de leitura no hero. Existe um formulário/CTA de checkout no bloco final.
- Três pilares de compromisso presentes; kit 2 comunica total de R$ 84,76 e R$ 42,38 por frasco sem duplicar o unitário no preço principal.
- Seleção 1/2/4: radio e texto mudam; `:has(input:checked)` aplica somente ao kit ativo borda dourada de 2 px, contra 1 px nos demais. A classe legada `.is-selected` não participa do CSS; o alerta inicial do harness foi falso positivo.
- `shippingAvailable=true`: um clique enviou exatamente um `POST /api/frete` com `{ postalCode: "12345-678", quantity: 4 }`, exibiu frete e total, e não disparou checkout. O CTA final enviou um único `GET /api/checkout` com `quantity=4`, `utm_source=qa` e `gclid=abc`; descartou chave não permitida e campanha com 257 caracteres.
- `shippingAvailable=false`: botão de frete desabilitado, mensagem de contingência visível, zero chamada de frete e checkout do kit ainda disponível.
- UTF-8 da página principal: zero U+FFFD, nenhum padrão de mojibake, `document.compatMode="CSS1Compat"`.
- As três imagens lazy foram trazidas à viewport e carregaram com dimensões reais: casal 1024×1536; fórmula e kit 2, 1254×1254.

Evidências: `.local/rebuild-015-qa/results.json`, `.local/rebuild-015-qa/retest.json` e capturas `conversao-{320,390,430,1440}-full.png`.

## Prévia móvel

Os controles produzem larguras internas exatas de 320, 390 e 430 px e têm área interativa de pelo menos 44 px. O primeiro build inspecionado continha sete U+FFFD no wrapper e texto visível corrompido em “Página/Conversão”; a correção ficou restrita a `cowboy-conversao-mobile.html`.

O reteste final passou: zero U+FFFD, `document.compatMode="CSS1Compat"`, título “Página COWBOY Conversão em largura móvel”, nenhum alvo abaixo de 44 px, regra `prefers-reduced-motion` presente e larguras internas exatas 320/390/430. Evidência: `.local/rebuild-015-qa/preview-retest.json`.

## Limites

A rodada valida funcionamento local e geometria dirigida; não mede taxa de conversão nem comprova eficácia comercial ou clínica. Os exemplos upstream das skills são heurísticas e não foram tratados como fatos do produto.
