# REBUILD-015 — Narrativa de conversão em COWBOY Nova

Status: Implementação e QA concluídos — candidato isolado em revisão.

## Objetivo

Preparar o candidato isolado `cowboy-conversao.html` para abrir com valor e orientação, colocar os dois relatos reais logo após o hero e conduzir para composição, informação de saúde, valor verificável, dúvidas e compra final. A promoção para `cowboy-nova.html` depende de revisão, pois o arquivo alvo mudou por autoria externa durante o planejamento.

## Critérios

- [x] Hero usa a copy aprovada e uma ação editorial; não há CTA de compra nem barreira de leitura.
- [x] Os dois vídeos reais aparecem imediatamente após o hero, com controles, posters e legendas automáticas.
- [x] O contexto sobre intimidade é aspiracional e deixa claro que suplemento alimentar não trata disfunção erétil.
- [x] Não há garantia, urgência, contagem, avaliações, promessa de resultado, dose não confirmada ou alegação terapêutica.
- [x] Compra continua somente no bloco final, com kits 1/2/4, preços atuais, CEP, checkout, frete e UTM preservados.
- [x] A página não inclui 360 e continua responsiva em 320, 390, 430 e desktop.
- [x] Build, lint, check de output e QA dirigida passam.

## Baseline

- `.local/rebuild-015-baseline/` contém cópias de `cowboy-nova.html`, `assets/css/cowboy-nova.css` e `assets/js/cowboy-nova.js` antes da alteração.

## File List

- `docs/stories/REBUILD-015-narrativa-conversao.md`
- `cowboy-conversao.html`, `assets/css/cowboy-conversao.css`, `assets/js/cowboy-conversao.js` — cópia isolada do baseline para implementação sem conflito.
- `cowboy-conversao-mobile.html` — prévia isolada do candidato.
- `scripts/build-site.js` — allowlist incremental do candidato, sua prévia e imagem editorial.
- `imagens/nova/casal-cumplicidade.webp` — imagem ilustrativa do bloco de intimidade; origem registrada em `docs/criacao/nova/imagem-editorial-origem.md`.
- `.local/rebuild-015-qa/preview-retest.json` — preview: 320/390/430 exatos, CSS1Compat, zero U+FFFD, alvos de toque >=44px e reduced motion.
- `docs/qa/rebuild-015-cowboy-conversao.md` — relatório da QA dirigida do candidato isolado.

## Verificação

- `npm.cmd run build`, `npm.cmd run lint` e `npm.cmd run check:build` passaram no candidato.
- QA dirigida confirmou seleção de kit, frete disponível/indisponível, checkout, UTM, imagens lazy e ausência de 360.
- O candidato permanece isolado em `cowboy-conversao.html`; não substitui `cowboy-nova.html`, não foi publicado e não registra aceite estético do proprietário.
