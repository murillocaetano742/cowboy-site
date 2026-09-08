# Briefing de imagens — página de conversão COWBOY Energia

Data: 08/09/2026. Para gerar com a ferramenta de imagem do Codex/ChatGPT (image_gen), como já foi feito com `imagens/v2/`. Cada item traz o uso na página, o prompt em inglês pronto para colar e o nome de arquivo esperado. Salvar em `imagens/v4/` como PNG e WebP (quality 88), 1536 × 1920 para verticais e 1536 × 1536 para quadradas. Depois de salvos, é só me avisar que eu ligo os arquivos na página e na allowlist do build.

Regras para todas: nenhuma pessoa apresentada como cliente, médico ou especialista; nada explícito; sem texto, selos, estrelas ou números dentro da imagem; sem "antes e depois"; sem imagem que sugira diagnóstico. Paleta: preto profundo, dourado quente nas altas luzes, pele com luz lateral.

## 1. Hero (gancho) — `hero-varanda.png`, vertical 4:5

Uso: primeira tela, ao lado do título "Você lembra de quando não precisava pensar nisso?".

```text
Cinematic editorial photograph, a Brazilian man around 52 years old seen from behind and slightly in profile, standing alone on an apartment balcony at dawn, elbows on the railing, looking at the city, quiet and pensive. Warm golden side light from the sunrise on his shoulder and jaw, the rest in deep shadow. Dark charcoal and black tones, subtle gold highlights, shallow depth of field. No product, no text, no logos. Photorealistic, 85 mm lens, vertical 4:5 composition with empty space on the left for typography.
```

## 2. Agitação — `mesa-de-cabeceira.png`, quadrada

Uso: bloco "O problema não é só na cama".

```text
Moody still-life photograph of a bedside table at night: a wristwatch, a wedding ring, a phone face down with the screen off, a glass of water. In the soft-focus background, one side of the bed is made and empty. Very dark room, a single warm lamp glow, gold highlights on metal. No people, no text. Photorealistic, square composition.
```

## 3. Virada — `casal-cozinha.png`, vertical 4:5

Uso: bloco "O homem que você quer voltar a ser já está aí".

```text
Warm candid photograph of a mature Brazilian couple in their early fifties in a kitchen at morning, she is laughing with a coffee cup, he is seen from behind with his hand on her shoulder, faces partially turned away. Golden morning light through a window, dark wood and black kitchen, gold highlights. Affectionate and confident, nothing explicit. No text, no product. Photorealistic, 50 mm lens, vertical 4:5.
```

## 4. Rotina — `rotina-manha.png`, quadrada

Uso: bloco "Por que em gotas" ou FAQ "Como uso".

```text
Product photograph of the COWBOY ENERGIA 30 ml black dropper bottle (use the provided packshot as exact identity reference: black ribbed cap, black rubber pipette, dark glass, black and antique-gold label) standing on a dark walnut nightstand next to a black analog wristwatch and a small glass of water, morning light from the left, a single golden drop forming at the tip of the dropper held just above the bottle. Deep black background, gold highlights, photorealistic, square composition. Keep the label exactly as in the reference. No text outside the label, no badges.
```

## 5. Garantia — não gerar

O selo de 30 dias é desenhado em SVG na própria página, com texto real, para não depender de imagem gerada com letras.

## 6. Oferta — já existe

`imagens/kit-1-frasco.jpg`, `imagens/kit-2-frascos.jpg`, `imagens/kit-4-frascos.jpg`.

## Enquanto as imagens não chegam

A página usa `imagens/kit-1-frasco.jpg` no hero e `imagens/homem-confiante.jpg` na virada (imagem de estilo de vida já existente, marcada como ilustrativa). Quando os quatro arquivos acima existirem em `imagens/v4/`, a troca é de um atributo por imagem.
