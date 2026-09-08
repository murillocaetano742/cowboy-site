# Direção de arte e prompts — COWBOY Energia

Cliente COWBOY Energia · 07/09/2026. Skills aplicadas: imagegen, gestor-midias-360 (oferta) e design-prompts-ia. Ferramenta: image_gen integrada, sem CLI/API externa.

Conceito: produto reconhecível, presença editorial e oferta fácil de conferir. Emoção: confiança na compra. Ponto focal: frasco real. Paleta: carvão #171715, dourado discreto #C59A5C, marfim #F5F1E9. Texto de oferta permanece acessível em HTML; os assets são fotografias de produto sem copy promocional embutida.

O primeiro pedido de fundo transparente gerou RGB com padrão quadriculado incorporado; foi descartado para uso público e corrigido para fundo marfim pela própria ferramenta. Todos os finais são RGB 1254 × 1254, embora os prompts tenham solicitado 1536 × 1536. O arquivo é o resultado real medido, não a dimensão solicitada.

## Prompt principal: packshot

Referências: cinco fotografias reais anexadas pelo usuário, incluídas por `num_last_images_to_include: 5`.

```text
Use case: background-extraction / product-mockup. Edit the provided reference photographs of the REAL COWBOY ENERGIA 30 mL dropper bottle into one professional ecommerce packshot. All five user photographs depict the same product and are identity/packaging references; use the front-facing photo as the edit target. Isolate ONE bottle, completely preserve its exact bottle silhouette, black ribbed screw cap, black rubber pipette, dark glass, black and antique-gold label artwork with muscular arms and flame, brand lettering COWBOY ENERGIA, SUPLEMENTO ALIMENTAR EM GOTAS, 30ml and COLORIDO ARTIFICIALMENTE; keep the actual label design unchanged. Remove the desk, headphones, pens, background and camera reflections, gently clean incidental dust, improve commercial studio lighting and straight-on perspective. Actual transparent alpha background, centered full bottle with generous 12% clear margin, square canvas 1536 x 1536, photorealistic crisp product. Soft grounded contact shadow only. No people, no claims, no badges, no watermark, no additional label text, no added slogans, no invented ingredients or certifications. This is the product picture to sell the actual physical bottle, so fidelity of packaging has highest priority.
```

Correção do fundo, aplicada ao draft local visto:

```text
Precise background-only edit of this COWBOY ENERGIA 30ml product packshot. Keep the bottle completely unchanged: identical shape, label art, brand words, lettering, readable front label and lighting. Replace the entire gray-white checkerboard background with a perfectly clean SOLID warm ivory studio backdrop color #F5F1E9. The checkerboard must disappear completely. Ground bottle with a very subtle real studio contact shadow. Keep full bottle centered and uncropped. Square commercial catalogue photograph, no new text, no badges, no watermark, no props. This is a product ecommerce image, no transparency needed.
```

## Variação 1: hero na bancada

Referência local: `imagens/v2/cowboy-packshot.png`, derivação já vista e revisada.

```text
Use case: compositing / product-mockup. Create a premium photorealistic product hero photograph for the COWBOY ENERGIA website using the provided packshot as exact product identity reference. ONE identical black dropper bottle, black ribbed cap and black rubber pipette, dark glass, antique-gold-on-black original label, COWBOY ENERGIA, SUPLEMENTO ALIMENTAR EM GOTAS, 30ml, COLORIDO ARTIFICIALMENTE unchanged. Do not redraw or redesign the packaging. Bottle stands upright on a dark walnut tabletop, subtly textured charcoal studio backdrop, focused warm softbox illumination from upper left and restrained gold edge light to separate bottle from background, soft anchored contact shadow and physically coherent glass reflection. Quiet confident editorial commercial product photography, tactile real materials, no artificial HDR or magical glow. Square image 1536 x 1536, bottle centered with full cap and bottom visible, bottle occupies about70%height, generous clean space around. Palette charcoal #171715, walnut dark brown, muted gold #C59A5C. No people, no other products, no medicinal props, no ingredients scattered around, no added text, no badges, no efficacy claims, no watermark. Preserve front label text and emblem as exactly as possible, highest reference fidelity.
```

## Variação 2: kit de dois

Referência local: `imagens/v2/cowboy-packshot.png`.

```text
Use case: compositing / product-mockup. From the provided actual COWBOY ENERGIA 30ml bottle packshot, create a professional ecommerce photograph of a KIT OF EXACTLY TWO IDENTICAL BOTTLES. Duplicate the exact bottle identity and packaging faithfully, do not invent a new design. Two same-size full black dropper bottles stand side by side on a seamless warm ivory #F5F1E9 studio floor and matching backdrop, soft grounded shadows, balanced quiet composition, full cap and base visible, 12% clean margin, square 1536x1536 photograph. Both front labels face the camera and remain unobstructed. Preserve the black rubber pipettes and ribbed black caps, dark glass, original black and antique-gold printed label artwork with flame and arms, lettering COWBOY ENERGIA / SUPLEMENTO ALIMENTAR EM GOTAS / 30ml / COLORIDO ARTIFICIALMENTE, including label dimensions and proportions. Same-height bottles, one may be slightly behind for depth but not smaller packaging. Soft broad commercial studio keylight with realistic shadows and reflections. No people, no floating objects, no medicinal props, no text outside labels, no price, no badges, no benefit or potency claims, no watermark, no checkerboard, no transparency. Fine natural material textures, no plastic CGI appearance.
```

## QA e handoff

As três imagens foram vistas após geração: embalagem preta/dourada, volume e categoria presentes, ausência de elementos clínicos e kit com duas unidades. Imagens de apoio com IA não substituem a fotografia do rótulo como documento. Se a arte final mostrar diferença relevante do rótulo, corrigir por referência à arte oficial antes de publicação comercial.

Frontend pode gerar variantes de formato e resolução sem alterar a aparência; não baixar todos os PNGs originais na primeira dobra. Reservar dimensões 1:1, hero prioritário, restantes com lazy loading. Legendas ou texto alternativo não devem afirmar resultados. Não mostrar draft rejeitado nem arquivos internos de copy como conteúdo público.

Variantes WebP entregues, codificação apenas por Sharp instalado no runtime, quality 88, effort 6, sem redimensionar ou editar aparência. PNGs preservados. Packshot: 55.192 bytes; hero: 92.294 bytes; kit de dois: 95.642 bytes. Todas 1254 × 1254. A revisão visual da variante WebP do kit confirmou duas embalagens e legibilidade frontal preservada; a fonte documental segue sendo a fotografia real. Script reproduzível `encode-webp.cjs` tem dependência local explícita do runtime deste ambiente.

Handoff: CEO e frontend recebem `assets-v2.json`, `copy-v2.md`, `product-facts.json`; QA verifica congruência visual e comercial na página montada. Consumir preferencialmente `.webp` no site.
