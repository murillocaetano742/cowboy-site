# REBUILD-008 — Depoimentos de clientes

Status: Concluída; legendas ficam como melhoria opcional até existir VTT fiel.

## Objetivo

Adicionar à página do COWBOY Energia uma seção de depoimentos para os dois vídeos locais que o proprietário declarou serem de clientes reais, preservando os originais e sem repetir os elementos gráficos não aprovados do material legado.

## Critérios de aceitação

- [x] Exibir dois vídeos responsivos na seção “Depoimentos de clientes”, com controles nativos, sem autoplay e carregamento sob demanda.
- [x] Usar versões públicas que não contenham o selo visual da Anvisa nem o texto “+ 22.000 pacientes curados”.
- [x] Não inventar nomes, falas, compra verificada, notas ou resultados além do que aparecer no vídeo final revisado.
- [x] Preservar `videos/depoimento-1.mp4` e `videos/depoimento-2.mp4` como arquivos originais locais.
- [x] Incluir somente os arquivos de vídeo aprovados na allowlist de build público.
- [x] Validar o build e as referências locais depois de ligar as versões revisadas.

## Decisões de escopo

- O proprietário confirmou que os dois vídeos são de clientes reais. Essa declaração substitui a pendência anterior de procedência declarada para esta publicação.
- A revisão de áudio e a edição/crop dos elementos gráficos são pré-requisitos para expor os MP4 publicamente.
- A página apresentará os vídeos como depoimentos de clientes, sem atribuir nomes ou transcrever conteúdo antes da revisão integral do áudio.

## File List

- `docs/stories/REBUILD-008-depoimentos-de-clientes.md`
- `index.html`
- `assets/css/cowboy.css`
- `scripts/build-site.js`
- `scripts/check-build.js`
- `scripts/serve-site.js`
- `.vercelignore`
- `videos/clientes/depoimento-1.mp4`
- `videos/clientes/depoimento-1.jpg`
- `videos/clientes/depoimento-1.vtt`
- `videos/clientes/depoimento-2.mp4`
- `videos/clientes/depoimento-2.jpg`
- `videos/clientes/depoimento-2.vtt`
- `docs/criacao/edicao-depoimentos-2026-09-08.md`
- `docs/criacao/integracao-depoimentos-2026-09-08.md`
- `tests/qa/frontend-flow.test.js`

## Verificação

- As capas dos dois derivados foram inspecionadas localmente após os cortes.
- `npm.cmd run check:build` passou: 18 arquivos na allowlist e todas as referências locais resolvidas.
- `npm.cmd test` passou: 22 testes, incluindo os controles e as referências dos dois vídeos.
- Em `http://127.0.0.1:4173/#depoimentos`, a página e os seis derivados responderam HTTP 200; MP4 recebeu `video/mp4`, JPG recebeu `image/jpeg` e VTT recebeu `text/vtt; charset=utf-8`.
- `.vercelignore` exclui os originais de `videos/` e inclui somente `videos/clientes/` para que o build publicado tenha os derivados referenciados.
- Os dois players oferecem a faixa opcional “Português (legendas automáticas)”. A identificação preserva o limite da transcrição local e não a apresenta como revisão humana.
