# REBUILD-013 — Visualizador fotográfico 360 do produto

Status: Concluída — prévia local validada.

## Objetivo

Apresentar o frasco COWBOY por uma sequência interativa de imagens reais extraídas do vídeo 360 fornecido pelo proprietário. Cada posição mostra um quadro fotográfico do produto; não há malha, render 3D, preenchimento generativo ou reconstrução visual de partes ausentes.

## Escopo

- Criar a página isolada `cowboy-360-real.html` e seus CSS/JavaScript dedicados.
- Usar somente a sequência de quadros estabilizados entregue a partir do vídeo original preservado em `.local/`.
- Oferecer arraste horizontal, ArrowLeft/ArrowRight, Home e botão de retorno à frente, sem autoplay ou bloqueio da rolagem vertical.
- Carregar o quadro inicial primeiro e os demais de modo gradual, com fallback informativo se a sequência não carregar.
- Manter mão, reflexos, oclusões e demais elementos quando existirem no vídeo-fonte; não fabricar pixels do frasco.
- Depois da QA da rota isolada, substituir somente o visualizador do bloco `#frasco` da V3 pela mesma experiência fotográfica.

## Fora do escopo

- Alterar a copy, a tipografia, a compra, o frete ou os demais blocos da V3.
- Publicar o MP4 original, usar imagens geradas, usar modelo 3D ou completar vistas encobertas.
- Remover os arquivos do candidato PBR suspenso.

## Critérios de aceitação

- [x] A sequência pública usa apenas imagens derivadas do vídeo real, com manifesto que define ordem e frente inicial.
- [x] A URL isolada exibe o primeiro quadro sem depender de JavaScript e não tem espaços de ângulo sem imagem.
- [x] Arraste, setas, Home e reset percorrem a sequência sem autoplay, sem travar a rolagem vertical e com foco acessível.
- [x] Carregamento gradual preserva o quadro atual e indica falha sem mostrar arte fictícia.
- [x] QA comprova frente, painel nutricional e verso a partir das imagens reais, além de fallback, mobile e ausência de erros de JavaScript.
- [x] `#frasco` da V3 reutiliza a mesma sequência e o build allowlist continua restrito.

## Contrato de frames

O arquivo público é `/imagens/v3/360-real/manifest.json` e contém somente fotos derivadas do vídeo original:

```json
{
  "width": 480,
  "height": 900,
  "homeIndex": 0,
  "frames": [
    { "index": 0, "src": "/imagens/v3/360-real/frame-000.webp", "timeSeconds": 0, "angleDegreesApprox": 0 }
  ]
}
```

`frames` precisa estar em ordem circular contínua frente → painel nutricional → verso → frente; `index` é sequencial a partir de zero. `angleDegreesApprox` registra uma estimativa de navegação, sem alegar medição por encoder. O poster HTML definitivo será o `homeIndex` real. O fixture de validação fica exclusivamente em `.local/revisao-360-real/` e não entra no build.

## File List

- `docs/stories/REBUILD-013-visualizador-fotografico-360.md`
- `cowboy-360-real.html`
- `assets/css/cowboy-360-real.css`
- `assets/js/cowboy-360-real.js`
- `cowboy-v3.html`
- `assets/css/cowboy-v3.css`
- `assets/js/cowboy-v3.js`
- `scripts/build-site.js`
- `scripts/serve-site.js`
- `.vercelignore`
- `imagens/v3/360-real/manifest.json`
- `imagens/v3/360-real/frame-000.webp` a `imagens/v3/360-real/frame-059.webp`
- `.local/revisao-360-real/manifest.fixture.json` (somente validação local)

## Validação

- `npm.cmd run check:build`: passou com allowlist exata de 117 arquivos e isolamento do output.
- `npm.cmd run lint`: passou; 29 arquivos JavaScript analisados quanto à sintaxe.
- Navegador local em 1440 px e 390 px: frente, painel nutricional e verso; setas, arraste, Home, loop, foco e rolagem vertical passaram sem overflow ou erros de JavaScript.
- Falha forçada do manifesto ou do quadro frontal preserva `IMG_1410.jpeg`; falha de quadro intermediário preserva a fotografia anterior. Evidência e sequência factual: `docs/criacao/v3/360-real-sequencia-fotografica.md` e `.local/revisao-estudio/real360-qa.json`.
