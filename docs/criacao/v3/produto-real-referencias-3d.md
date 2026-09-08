# Produto real — referências e plano de textura 3D

Data: 08/09/2026. Escopo: localizar as cinco fotos enviadas pelo proprietário e preparar referências reais para reconstrução do frasco. Nenhuma nova arte gerada ou alteração de frontend nesta etapa.

## Original localizado e preservado

A foto `C:/Users/User/Downloads/IMG_1410.jpeg` foi inspecionada visualmente. A coordenação confirmou que corresponde à foto 1 enviada no chat: frasco sobre mesa, com canetas e monitor ao fundo.

- Cópia integral: `imagens/v3/referencias-reais/IMG_1410.jpeg`.
- Resolução: 1152 × 1536 px; 408.968 bytes.
- SHA-256 do original e da cópia, iguais: `00317BD22F8FF398A0EA8297F055C432DF5594D3ED624138020EC32544CF3980`.
- Recorte técnico: `imagens/v3/referencias-reais/frente-recorte-IMG_1410.png`, 322 × 493 px, 262.793 bytes. Coordenadas no original: x=462, y=846, largura=322, altura=493. Feito com FFmpeg, sem reescrever texto, emblema, cor ou logotipo. O recorte retém curvatura, reflexos e perspectiva da foto; não é um rótulo plano retificado.

## Vistas disponíveis

| Vista | Arquivo | O que se observa |
|---|---|---|
| Frontal, levemente girada | IMG_1410.jpeg | Nome COWBOY ENERGIA, emblema, suplemento alimentar em gotas, 30 mL, tampa, bulbo, ombro e base |
| Lateral direita parcial | Margem direita da mesma foto | Parte da tabela nutricional; insuficiente para reconstruir o painel inteiro |
| Lateral esquerda completa | Não localizada | Não reconstruir a impressão ausente |
| Traseira completa | Não localizada | Não substituir por um verso textual inventado ou por arte gerada |
| Outras vistas do chat | Arquivos não localizados | A subagente não recebeu visualmente essas imagens; não atribui medidas ou conteúdo a vistas que não inspecionou |

A busca limitada cobriu imagens do workspace/.local, inventário de Downloads/Pictures, arquivos IMG_14* e referências de nome próximo 1411–1414, além de nomes de arquivos compactados nessas pastas. Encontrou somente IMG_1410. Não foram acessadas sessões, credenciais ou históricos privados do Codex. Ausência nessa busca não prova inexistência em todo o computador; significa que as outras quatro originais não estão disponíveis nos caminhos verificados.

## Proporções visuais da foto real

Medidas aproximadas em pixels da fotografia, sujeitas à perspectiva. Não são medidas físicas em milímetros e não constituem uma digitalização metrológica. Use o diâmetro aparente do corpo como D=1 e altura total H≈3,11D.

| Parte | Coordenadas/medida aproximada | Proporção para modelagem |
|---|---|---|
| Embalagem completa | topo y≈213; base y≈1379; altura≈1166 px | H=1 |
| Corpo, largura máxima | x≈450–825; largura≈375 px | D≈0,322H |
| Bulbo de borracha | topo≈213 até transição≈452; altura≈239 px; largura≈154 px | altura≈0,205H; largura≈0,41D |
| Tampa estriada + anel inferior | y≈452–715; altura≈263 px; largura máxima≈261 px | altura≈0,226H; largura≈0,70D |
| Ombro/pequeno pescoço | y≈715–852; altura≈137 px | altura≈0,118H |
| Corpo do começo do rótulo até base | y≈852–1379; altura≈527 px | altura≈0,452H |
| Área frontal do rótulo | y≈846–1339; altura≈493 px no recorte | altura≈0,423H; ocupa a maior parte da região cilíndrica |

O bulbo é alongado, com trecho quase cilíndrico e extremidade arredondada, alargando discretamente na base; não tem formato de ovo apoiado no gargalo. A tampa tem estrias verticais finas e anel inferior mais largo. O vidro aparece muito escuro, com reflexos locais; não usar laranja translúcido forte como cor predominante. O ombro é arredondado e liga o corpo largo ao pescoço estreito; a base tem pequeno arredondamento.

## Plano de UV/projeção para o frontend

1. Reconstruir geometria de revolução pela silhueta da foto real. Conferir altura/diâmetro e as transições listadas. Aplicar escala uniforme e enquadrar o frasco inteiro, incluindo bulbo e base.
2. Preservar as fotografias originais e manter registro de cada recorte, dimensão e orientação. A frente técnica entregue pode servir à calibração imediata; não usar `cowboy-rotulo-frontal.webp` gerado por IA como impressão do produto real.
3. Para a frente, preferir projeção fotográfica sobre o setor cilíndrico observado, calibrando centro do corpo e ângulo da câmera. Um recorte frontal não deve ser simplesmente esticado por toda a circunferência: isso repetiria o nome e inventaria laterais.
4. Se optar por desfazer a curvatura, mapear as amostras da foto pela relação cilíndrica x≈cx+r·sin(θ−θcamera), limitada aos ângulos realmente observados. Estimar cx/r pela silhueta; ajustar a inclinação das bordas superior/inferior do rótulo antes da projeção. Essa calibração continua aproximada a partir de uma foto com perspectiva.
5. Quando as demais originais estiverem disponíveis, identificar os mesmos marcos nas sobreposições: bordo do rótulo, nome, início/fim da tabela e emendas. Montar atlas por setores reais com costuras nas margens de menor informação. Suavizar somente exposição nas emendas; não reescrever caracteres, completar números ou sintetizar impressão ausente.
6. Até existirem vistas traseiras/laterais suficientes, conservar a limitação explícita. Um verso com dados redigitados pode ser útil como ficha técnica separada, mas não deve ser apresentado como textura fiel da embalagem fotografada. Não afirmar reprodução completa de todos os lados com uma única foto.
7. Conferir frente/laterais/verso contra as respectivas originais, com capturas do modelo no mesmo ângulo e escala aproximada. Manter testes já feitos de arraste, setas, reset, fallback e ausência de cortes no celular.

## Referências excluídas desta reconstrução fiel

`imagens/v2/rotulo-3d.jpg` é arquivo local não rastreado pelo Git; não foi localizado registro que comprove origem documental. Inspeção mostra uma frente comercial central e preenchimento lateral estendido. Portanto não foi usado como original do proprietário. `cowboy-bottle.jpg.png`, `Cowboy_imagem_1.png` e a composição WhatsApp de 17/07 são imagens comerciais e também não substituem as cinco fotos reais.

A arte `imagens/v3/cowboy-rotulo-frontal.*` produzida anteriormente permanece separada e não deve ser usada nesta reconstrução fiel. Os arquivos reais desta etapa estão apenas em `imagens/v3/referencias-reais/`.

## Setor frontal preparado para UV — entrega ao frontend

Arquivos adicionais: `imagens/v3/referencias-reais/frente-setor-cilindrico-IMG_1410.png`, `.webp` e `.json`. Saída 360 × 488 px, exclusivamente a partir de pixels da foto original. Script reprodutível: `.local/revisao-v3/retificar-frente-real.py`.

Foi aplicada projeção cilíndrica inversa aproximada: centro aparente x=637, raio=187 px, ângulos -60° a +50° da foto, intervalo total de 110°. As bordas foram alinhadas pela inclinação observada; interpolação bicúbica, sem preenchimento generativo, reescrita de letras ou emblema. Todos os parâmetros estão no JSON. A imagem foi inspecionada após transformação: nome, emblema e 30 mL reconhecíveis, com reflexos e textura fotográfica preservados.

**Aplicação:** mapear u=0…1 somente sobre um setor frontal de 110°; v=0…1 na altura do rótulo. As laterais/verso permanecem neutros provisoriamente. Não distribuir a textura por 360°, repetir frente no verso ou usar a antiga tabela procedural como fotografia. A coordenação determinou retirar os textos traseiros redigitados enquanto faltarem as originais.

A retificação é estimativa visual para modelagem, não reconstrução exata da câmera ou do rótulo plano. A original e o recorte sem retificação permanecem disponíveis para conferência.

## Atualização — cobertura completa obtida no vídeo

O proprietário forneceu posteriormente o MP4 original. A análise confirmou volta completa, e foi produzido atlas fotográfico somente com pixels do vídeo, com frente, nutricional e verso reais. A limitação de cobertura descrita no início deste documento foi superada por essa nova fonte; as quatro fotos individuais continuam sem arquivo localizado, mas não são necessárias para obter essas vistas do vídeo. Referência atual: `docs/criacao/v3/video-360-e-atlas.md` e `imagens/v3/referencias-reais/rotulo-360-video.*`. O atlas foi inspecionado pela coordenação e entregue ao frontend, ainda sujeito à conferência no modelo.
