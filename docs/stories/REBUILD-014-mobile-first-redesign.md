# REBUILD-014 — Redesign V3 mobile first

Status: Em implementação — refinamento a partir da identidade histórica indicada pelo proprietário em 08/09/2026.

## Estado da revisão

A montagem mobile-first rejeitada foi preservada em `.local/mobile-redesign-rejected/`. Ela não é a base do refinamento atual.

A referência de venda anterior está disponível somente para comparação em `http://127.0.0.1:4174/`. A origem é `loja.html` do commit `d4c726d9d2ae53c0394dfc74f4060dcb86a84472`; a cópia local em `.local/historico-cowboy-d4c726d/loja.html` tem o mesmo blob Git (`9fd7b66bf18d87d35098e3d7c140670549c3f2c9`). A story `REBUILD-009-preview-historico.md` descreve o isolamento dessa prévia.

O proprietário definiu essa referência como base visual do refinamento: paleta escura e dourada, galeria de produto, tipografia Oswald/Inter e densidade de e-commerce. Não serão reintroduzidos os textos médicos, avaliações, garantia, urgência, rastreadores ou destinos de checkout históricos. O visualizador 360 permanece removido da V3.

## Objetivo

Substituir a apresentação visual da V3 por uma página de vendas profissional pensada primeiro para telas de 320 a 430 px. A nova versão preserva os fatos do produto, os dois vídeos reais e todos os contratos de checkout, frete e atribuição.

## Escopo

- Remover o visualizador 360, seus controles, importações e links da V3, preservando os arquivos fonte isolados fora da nova página.
- Reconstruir HTML e CSS da V3 a partir da identidade de `loja.html@d4c726d`, mantendo funcionamento em desktop.
- Manter a compra apenas no bloco final e os valores: 1 frasco R$ 54,76; 2 frascos R$ 84,76; 4 frascos R$ 169,52.
- Manter os dois vídeos reais de relatos e as legendas automáticas existentes.
- Preservar os contratos `/api/config`, `/api/frete`, `/api/checkout`, UTM e estados de falha do JavaScript comercial.

## Fora do escopo

- Alterar `index.html`, `loja.html`, `cowboy-360.html`, APIs ou preços.
- Usar o 360, imagens geradas como evidência de produto, alegações médicas ou novos depoimentos.
- Publicar, fazer push ou mudar integrações externas.

## Critérios de aceitação

- [ ] Não há visualizador, script, import ou link 360 em `cowboy-v3.html` e seus assets V3 públicos.
- [ ] A página é legível e sem overflow entre 320 e 430 px; o primeiro viewport explica produto e navegação natural.
- [ ] Os dois vídeos reais continuam reproduzíveis, com poster e legenda automática.
- [ ] Compra aparece somente no bloco final e mantém preços, kits, frete, checkout e UTM.
- [ ] Desktop continua funcional sem alterar a direção mobile-first.
- [ ] Build, lint e QA visual dirigida passam; há capturas mobile da página, hero, vídeos e oferta.

## Baseline

- Rollback da V3 antes deste redesign: `.local/mobile-redesign-baseline/`.
- Evidência visual direta da referência histórica: `.local/revisao-mobile/terra-original4174-hero390.png`, `.local/revisao-mobile/terra-original4174-full390.png` e `.local/revisao-mobile/terra-original4174-evidence.json` (HTTP 200, imagens locais carregadas e largura do documento igual a 390 px).

## File List

- `docs/stories/REBUILD-014-mobile-first-redesign.md`
- `.local/mobile-redesign-baseline/` — cópia de rollback anterior ao redesign.
- `.local/mobile-redesign-rejected/` — cópia preservada da montagem rejeitada.
- `cowboy-v3.html`, `assets/css/cowboy-v3.css`, `assets/js/cowboy-v3.js` — montagem congelada, sem aceite visual.
- `cowboy-mobile-preview.html`, `assets/js/cowboy-mobile-preview.js` — prévia local da montagem congelada.
