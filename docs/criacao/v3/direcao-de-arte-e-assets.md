# COWBOY Energia V3 — direção de arte e assets

Data: 08/09/2026. Ferramentas: imagegen nativo para as duas fotografias ilustrativas; FFmpeg já instalado para conversão PNG → WebP e extração prévia de frames. Sem Canva e sem upload dos vídeos a outro serviço.

## Direção de arte

**Conceito:** a presença de um produto western premium, fotografado com luz âmbar e materiais escuros que se pode reconhecer pelo tato.
**Emoção dominante:** confiança/presença.
**Ponto focal:** o próprio frasco, inteiro no hero e aproximado no detalhe.
**Paleta:** quase-preto #0B0907, couro #4B2D1D e âmbar #C9943A.
**Uso:** imagens sem copy sobreposta, integradas ao HTML acessível da página. Texto do produto permanece na embalagem; a copy da página é conteúdo HTML independente.
**Argumento:** mostrar produto e identidade com firmeza. Não criar prova médica, certificado ou selo.

Referência histórica de layout/tipografia: loja.html no commit d4c726d. A direção recupera preto/âmbar e títulos condensados; as fotos abaixo são novas.

## Manifesto dos arquivos

| Arquivo | Dimensões | Bytes | Fonte / uso |
|---|---:|---:|---|
| imagens/v3/cowboy-hero-western.webp | 1536 × 1024 | 113130 | Hero público; frasco inteiro à direita e área escura à esquerda |
| imagens/v3/cowboy-hero-western.png | 1536 × 1024 | 1963037 | Matriz PNG gerada; manter como fonte, não carregar no hero público |
| imagens/v3/cowboy-detalhe-couro.webp | 1536 × 1024 | 138740 | Detalhe público; tampa, vidro e label sobre couro; produto à esquerda |
| imagens/v3/cowboy-detalhe-couro.png | 1536 × 1024 | 2151299 | Matriz PNG gerada; manter como fonte |
| imagens/v3/cliente-relato-1.jpg | 424 × 754 | 15210 | Frame real a 14,1 s de videos/clientes/depoimento-1.mp4 |
| imagens/v3/cliente-relato-2.jpg | 502 × 894 | 26338 | Frame real a 6,6 s de videos/clientes/depoimento-2.mp4 |

Os frames foram copiados de .local/revisao-depoimentos/derivado-1-fim.jpg e derivado-2-meio.jpg, extraídos anteriormente por FFmpeg. Nenhuma alteração de rosto, geração de pessoa ou novo relato. São duas fotografias dos mesmos dois vídeos, não quatro clientes.

As duas gerações usaram imagens/v2/cowboy-packshot.png, visto antes da chamada, como **referência de aparência da embalagem**. Esse packshot já era uma recriação; não é fotografia documental do rótulo. As imagens V3 mantêm a identidade visual, mas não são fonte para transcrever microtexto ou medir geometria. Os dados da fórmula continuam vindo de docs/produto/product-facts.json.

Originais gerados preservados também em:
- C:/Users/User/.codex/generated_images/01a080fc-5179-7570-9904-b369440a1eca/exec-199e8ff3-6b07-462e-93bd-1f11135d232c.png
- C:/Users/User/.codex/generated_images/01a080fc-5179-7570-9904-b369440a1eca/exec-c6aa1910-315a-42d1-9499-c317bfc9e596.png

## Inspeção visual das imagens

Hero: frasco e conta-gotas inteiros, sombra ancorada, couro e madeira coerentes; marca legível como aparência; sem selo, preço, headline ou pessoa. Área esquerda permite composição com texto da página. Coordenação aprovou a imagem para implementação. No celular, ajustar o enquadramento de modo a não cortar a tampa nem colocar texto sobre o frasco.

Detalhe: ângulo e escala diferentes do hero; ranhuras da tampa, vidro e couro bem definidos; corpo naturalmente cortado na borda inferior por ser macro. Sem selo, pessoa ou alegação adicionada. Não usar como packshot completo nem tabela documental.

Frames: rosto e frasco visíveis; nenhum selo/estatística do material legado. Manter proporção ou recorte que preserve olhos, boca e produto, sem inventar características. Os vídeos possuem áudio idêntico ao original por comparação prévia dos hashes AAC.

## Copy dos frames

- Cliente/relato 1: “Tá só o ouro.”; frase extraída da transcrição automática local no intervalo 12,680–14,180 s.
- Cliente/relato 2: “A mulher agradece mais ainda.”; frase final do segmento automático 6,060–12,900 s.
- Identificação editorial para ambos: “Trecho do relato em vídeo.”
- O participante 2 diz “100%” em outro trecho; essa fala não deve virar headline ou taxa geral de eficácia.
- Legendas existentes são automáticas, identificadas no player. Não foram apresentadas como revisão humana por escuta.

## Assets para visualizador 3D

Não foi localizada arte plana oficial do rótulo entre os arquivos de imagem examinados. Disponíveis: referências de aparência em packshot/hero e dados textuais no JSON. Não fabricar verso, selo, lote, código regulatório ou tabela na textura 3D. Usar geometria/rotulagem representativa e exibir “Visualização 3D representativa da embalagem.” O frontend é responsável pela textura geométrica e fallback; esta entrega não declara digitalização ou fotogrametria do frasco real.

## Prompt principal — hero

Ferramenta: imagegen nativo; referência local vista: imagens/v2/cowboy-packshot.png.

```text
Use case: product-mockup / identity-preserving environmental edit.
Input image 1 is the existing COWBOY ENERGIA bottle reference and edit target. Preserve this exact bottle silhouette, dark amber glass, black rubber dropper, ribbed black cap, black label, warm gold COWBOY ENERGIA lettering and orange flexed-arm emblem. Do not redesign the label, do not add certification seals, do not invent microtext.
Create one landscape commercial product photograph, 3:2 aspect ratio, for a premium western brand landing-page hero.
Scene: the bottle stands firmly on a dark worn leather surface over a dark walnut workbench. Its complete body from dropper tip to base is visible, occupying the right 45% of the photograph, centered around x=70%; the left 45% is rich charcoal-black uncluttered negative space for HTML text outside the image. Full bottle should be large, 80% of image height, with comfortable margins.
Lighting: low-key photographic studio light, warm amber rim from rear right tracing the glass and cap, large softbox frontal fill that keeps the label recognizable; a faint soft amber light from the background. No beam effects, no fire in scene, no smoke clouds.
Camera: commercial medium-format still life, 90 mm lens, natural perspective, subtle grain, realistic dark leather grain with a few authentic wrinkles, controlled physically plausible reflections, soft grounded shadow. Palette almost-black #0B0907, tobacco leather #4B2D1D, antique amber #C9943A. Distinctive rugged premium western attitude, not cosmetics spa, not ivory stock photography, no neon/HDR.
Text: preserve only existing packaging text and visual hierarchy from input. No overlaid headline, no price, no CTA, no watermark, no extra objects, no people or hands. The packaging fine print is not an information panel. Deliver one finished image.
```

## Variação aplicada — macro de produto

Decisão distinta: close-up 3/4 em couro, frasco à esquerda, profundidade de campo menor e corte editorial do corpo.

```text
Use case: product-mockup / identity-preserving product detail.
Input image 1 is the packaging reference for the COWBOY ENERGIA bottle. Preserve the actual bottle shape, dark amber glass, black rubber dropper, black ribbed cap, black-and-gold label and orange arm emblem. This is an editorial photographic detail for the product-information section of a premium western landing page.
Create a landscape 3:2 photographic close-up from a gentle three-quarter angle. The closed black rubber dropper and finely ribbed cap are the focal points at upper-left-center, with the bottle shoulder and a partial recognizable COWBOY ENERGIA label beneath. It rests on dark tobacco leather, with the bottom/body naturally cropped by the frame. Do not create an open pipette or a drop in the air. Place the bottle detail predominantly in the left half. The right half contains softly defocused walnut/leather texture in deep charcoal and low amber light; no objects, no text overlay.
Physically plausible soft frontal key light reveals cap ribbing, narrow warm amber rim light catches glass shoulder; controlled highlights without blown gloss. Medium-format commercial macro, 100mm lens, shallow but intentional depth of field, subtle texture/grain, grounded shadow, warm muted blacks #0B0907 and tobacco #4B2D1D with restrained gold #C9943A. Rugged premium and tactile, not clinical or cosmetic.
Preserve existing label appearance, do not fabricate or alter label wording, no seal, no certification, no medical symbols, no people, no extra props, no smoke, no fire outside packaging emblem, no HDR, no watermark. The photograph is an illustration of packaging details, not a legible technical label document. One finished photograph.
```

## Segunda variação de direção — reserva, não gerada

```text
Use the same COWBOY ENERGIA packaging appearance reference. Create a portrait commercial still life of the complete closed bottle standing on a worn dark walnut surface. Camera frontal, slightly below shoulder height, 85 mm lens. The bottle is centered and fills 70 percent of the vertical frame. A single softbox above-left reveals the label and black ribbed cap; a thin warm amber rim from rear-right defines dark glass. Background is near-black with one softly defocused vertical leather seam. Restrained #0B0907, #4B2D1D and #C9943A palette. Physical grounded shadow, subtle photographic grain and authentic material texture. Preserve brand, shape and emblem, without inventing label text. No headline, price, seal, certificate, person, hand, fire, smoke, watermark or extra props. This is a packaging illustration, not a documentary label scan.
```

## Handoff

Frontend recebeu os dois WebP e dois JPG, o mapa/copy e a orientação de 3D representativo. Próxima etapa desta frente: revisão visual da página implementada em desktop e celular, depois que o preview estiver disponível. Não foi alterado HTML, CSS, JS, pacote, API ou conta por este agente.

