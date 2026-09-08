# Revisão visual — candidato isolado de conversão

08/09/2026 · REBUILD-015 · `cowboy-conversao.html`.

Rodada manual inicial identificou recorte dos rostos do casal e da tampa do frasco, destaque excessivo do aviso clínico, hero comprido e seletor de kits sem distribuição correta. Após handoff, Astra ajustou somente `assets/css/cowboy-conversao.css`; Terra manteve HTML/JS/build, corrigiu a duplicação do preço e separou os formulários.

Conferência final em 390 × 844 após correção de UTF-8 no HTML: hero 740 px, primeiro vídeo na posição 993 px da página; produto e CTA aparecem na primeira tela. Aviso clínico continua legível como parágrafo, sem card. Imagem do casal conserva rostos e mãos. Fotos dos kits usam 64 × 64 px, preços e quantidades têm colunas explícitas, e não há overflow horizontal (documento 390 px), recursos de imagem ausentes ou pageerrors. O campo de frete e o botão final mantêm acabamento e foco visível. O scroll de captura respeitou a margem do cabeçalho, sem foco artificial no skip link.

Evidências finais do mesmo build com DOM validado e texto lido nas capturas:
- `.local/revisao-conversao/astra-finish-390-hero.png`
- `.local/revisao-conversao/astra-finish-390-kit.png`
- `.local/revisao-conversao/astra-finish-390.json`

CSS congelado para QA funcional independente. Esta revisão verifica composição e legibilidade do candidato; não comprova aumento de conversão, eficácia do produto ou aprovação estética final do proprietário. Os vídeos mantêm enquadramento registrado pelos clientes, inclusive a área de teto no primeiro relato; não houve preenchimento ou criação de imagem de cliente.

P0 de codificação identificado e resolvido por Terra: acentos, separadores, prefixo anterior ao doctype e aspas de abertura dos dois relatos. A guarda de DOM final passou sem sequências de mojibake ou U+FFFD, com Conheça/não corretos. Hero e oferta foram recapturados somente depois dessa validação. As capturas anteriores de relatos/intimidade/full documentam o encaixe visual, não são a evidência final de integridade textual.

