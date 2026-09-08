# REBUILD-014 — Redesign V3 mobile first

Status: Implementação e QA concluídos — aguardando avaliação do proprietário.

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

- [x] Não há visualizador, script, import ou link 360 em `cowboy-v3.html` e seus assets V3 públicos.
- [x] A página é legível e sem overflow entre 320 e 430 px; o primeiro viewport explica produto e navegação natural.
- [x] Os dois vídeos reais continuam reproduzíveis, com poster e legenda automática.
- [x] Compra aparece somente no bloco final e mantém preços, kits, frete, checkout e UTM.
- [x] Desktop continua funcional sem alterar a direção mobile-first.
- [x] Build, lint e QA visual dirigida passam; há capturas mobile da página, hero, vídeos e oferta.

## Baseline

- Rollback da V3 antes deste redesign: `.local/mobile-redesign-baseline/`.
- Evidência visual direta da referência histórica: `.local/revisao-mobile/terra-original4174-hero390.png`, `.local/revisao-mobile/terra-original4174-full390.png` e `.local/revisao-mobile/terra-original4174-evidence.json` (HTTP 200, imagens locais carregadas e largura do documento igual a 390 px).

## File List

- `docs/stories/REBUILD-014-mobile-first-redesign.md`
- `.local/mobile-redesign-baseline/` — cópia de rollback anterior ao redesign.
- `.local/mobile-redesign-rejected/` — cópia preservada da montagem rejeitada.
- `cowboy-v3.html`, `assets/css/cowboy-v3.css`, `assets/js/cowboy-v3.js` — refinamento com galeria, copy atual e integrações comerciais preservadas; sem aceite visual do proprietário ainda.
- `cowboy-mobile-preview.html`, `assets/js/cowboy-mobile-preview.js` — prévia local funcional em 320, 390 e 430 px.
- `scripts/build-site.js` — allowlist da fonte Inter WOFF2 usada pela V3.
- `assets/fonts/v3/inter-latin-wght-normal.woff2`, `assets/fonts/v3/OFL-Inter.txt` — Inter local e licença.
- `.local/revisao-mobile/terra-refined-evidence.json` — checagem de 320, 390 e 1440 px; galeria, CTA final e ausência de 360.
- `.local/revisao-mobile/astra-original-finish-*` — capturas finais da direção visual em mobile, tablet e desktop.
- `.local/revisao-mobile-redesign/round-1/results.json` — QA funcional inicial: mídia, checkout, frete, UTM, fontes e ausência de requests 360/Three.
- `.local/revisao-mobile-redesign/round-1/targets-retest.json` — reteste dirigido: alvos de toque de 44 px, foco de 3 px, sem overflow e sem erros em 320, 390 e 430 px.

## Verificação final

- `npm.cmd run build` — passou (56 arquivos públicos).
- `npm.cmd run lint` — passou (28 arquivos JavaScript verificados).
- `npm.cmd run check:build` — passou (allowlist exata, referências locais e isolamento do output).
- `git diff --check` — passou; os avisos de fim de linha pertencem a arquivos preexistentes fora deste escopo.

Não foi executada a suíte de integração: os contratos de API, checkout, frete e UTM não foram alterados nesta etapa. A QA funcional dirigida cobriu os contratos preservados na página V3.
