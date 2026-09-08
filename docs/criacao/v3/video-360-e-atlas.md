# Vídeo original e atlas fotográfico de 360°

Data: 08/09/2026. Referência fornecida pelo proprietário: `C:/Users/User/Downloads/WhatsApp Video 2026-09-08 at 11.19.27.mp4`.

## Fonte preservada e cobertura

Cópia integral em `.local/produto-real-360/original.mp4`. Original e cópia têm SHA-256 idêntico: `C3D1D0C181267230D04F720AE5842954C89EA18C17F15EEC7075362F7BCF279E`. Tamanho 12.016.566 bytes; duração 33,566667 s; H.264 Baseline, 30 fps médios, 1007 quadros; áudio AAC preservado no arquivo. A imagem codificada é 1280 × 720 com matriz de rotação de -90°; os quadros exibidos/extraídos são 720 × 1280.

A revisão seguiu o método visual da skill watch: amostragem temporal com FFmpeg, inspeção da sequência e ampliação de quadros relevantes. Não houve ASR, análise de áudio, upload ou uso de serviço externo. Foram extraídos 34 quadros a 1 fps e inspecionadas as duas folhas de contato, além dos quadros principais em resolução integral. A gravação cobre uma volta completa da embalagem e avança novamente até o painel nutricional.

| Intervalo aproximado | Vista |
|---|---|
| 0–3 s | Frente completa; mão ainda não oculta o bulbo em parte do trecho |
| 4–7 s | Transição da frente ao painel nutricional |
| 8–11 s | Painel nutricional e ingredientes |
| 12–16 s | Emenda entre painel nutricional e verso |
| 17–21 s | Verso com recomendações, informações de fabricação, contato e etiqueta/código de barras |
| 22–25 s | Transição do verso à frente |
| 26–28 s | Frente novamente, em enquadramento maior |
| 29–33 s | Nova passagem ao painel nutricional |

Os tempos são aproximados da sequência amostrada a 1 fps; a montagem é reproduzível pelos índices de quadros e comandos locais. Não se atribui precisão de frame ao segundo indicado na tabela.

## Arquivos finais

- `imagens/v3/referencias-reais/rotulo-360-video.png`: atlas 1537 × 512, 914.442 bytes.
- `imagens/v3/referencias-reais/rotulo-360-video.webp`: atlas otimizado, 175.952 bytes.
- `imagens/v3/referencias-reais/rotulo-360-video.json`: intervalos de UV e origem de cada painel.
- `imagens/v3/referencias-reais/video-frente.jpg`: quadro f028, por volta de 27 s.
- `imagens/v3/referencias-reais/video-nutricional.jpg`: quadro f010, por volta de 9 s.
- `imagens/v3/referencias-reais/video-verso.jpg`: quadro f020, por volta de 19 s.

A foto IMG_1410 continua preservada como referência adicional e fallback. Ela não foi misturada no atlas. Todas as regiões do atlas provêm de quadros do mesmo vídeo.

## Construção e UV

Os quadros foram retificados por projeção cilíndrica inversa aproximada, a partir do centro/raio aparente do corpo e das bordas do rótulo. A montagem usa recortes de painéis observados e uma faixa real da emenda escura; não desenha, completa ou corrige letras, números, logotipo, emblema, código de barras ou informações de lote.

| Região | Fonte amostrada | Colunas do atlas | Intervalo U | Centro U |
|---|---|---:|---:|---:|
| Frente | f028 | 0–476 | 0–0,30969 | 0,15485 |
| Nutricional | f010 | 476–905 | 0,30969–0,58881 | 0,44925 |
| Emenda escura real | f014 | 905–987 | 0,58881–0,64216 | — |
| Verso | f020 | 987–1537 | 0,64216–1 | 0,82108 |

Usar U=0…1 para uma volta completa do cilindro e V=0…1 na altura do rótulo. Alinhar o centro frontal U≈0,15485 à câmera no estado inicial. A ordem da impressão é frente → painel nutricional → emenda → verso → frente; existe apenas um conjunto de marca/emblema. O JSON preserva recortes e coordenadas exatas.

As costuras foram posicionadas fora das letras principais. Permanecem diferenças fotográficas de iluminação e perspectiva nas margens. A coordenação inspecionou o PNG preliminar e liberou a integração com esses limites, preferindo preservar a impressão real. Não houve normalização generativa nem aumento de nitidez por reconstrução. A nitidez do microtexto é limitada pela gravação e pela curvatura; o atlas não substitui o acesso às fotos de referência.

## Geometria confirmada pelo vídeo

No quadro frontal f002, a altura aparente é aproximadamente 961 px e o diâmetro do corpo 308 px, H/D≈3,12, coerente com a foto IMG_1410. O bulbo ocupa cerca de 22% da altura, com haste quase cilíndrica de largura≈0,35D e base alargada≈0,44D. Tampa e anel somam cerca de 22,5% da altura e largura≈0,70D. O ombro arredondado ocupa aproximadamente 12,5%; o corpo a partir do rótulo cerca de 43%. São proporções visuais sujeitas à perspectiva, não medidas físicas certificadas.

O frontend recebeu orientação para suavizar a curva do ombro e manter a borracha alongada, estrias, anel inferior e vidro escuro observados. A fidelidade final deve ser comparada aos quadros frontal/nutricional/verso após integração.

## Reprodutibilidade e estado

Material de trabalho local: `.local/produto-real-360/frames/`, `contact-1.jpg`, `contact-2.jpg`, `unroll.py`, `montar-atlas.py` e `uv/views.json`. A extração usa `ffmpeg -i original.mp4 -vf fps=1 -q:v 2 frames/f-%03d.jpg`, respeitando a rotação do arquivo.

O atlas foi entregue ao frontend após inspeção da coordenação. A conferência de integração no modelo ainda será registrada. Esta liberação técnica não significa aprovação visual final pelo proprietário nem publicação. O vídeo resolve a falta de cobertura das vistas; não é necessário apresentar as quatro fotografias ausentes como se tivessem sido localizadas.

## Conferência dirigida da integração do atlas

O atlas foi carregado com HTTP 200 e inspecionado no modelo em 1440 × 1000 e 390 × 844. Frente, painel nutricional e verso correspondem aos quadros de origem; textos aparecem na orientação correta, sem espelhamento e sem repetição da marca nas emendas. O frasco inteiro permanece enquadrado.

Botões de rotação, arraste e teclado mudam a vista. Reset estabilizado retorna hash exato à frente em ambos os tamanhos. Não ocorreram erros JavaScript e o documento ficou na largura do viewport, 1440/390. Ao bloquear o atlas WebP, a foto original IMG_1410 permanece carregada e visível, canvas oculto e mensagem de fallback.

Evidências: `.local/revisao-v3/atlas-final.json`, `atlas-final-{desktop,mobile}-{frente,nutricional,verso}.png` e `atlas-final-mobile-fallback.png`. A coordenação recebeu os caminhos para inspeção. A frente técnica confirmou build de 58 arquivos, atlas/foto/JS com MIME correto e ausência de HTML do WhatsApp, `.enc` ou MP4 bruto no diretório público.

Dois ajustes dirigidos foram repassados ao frontend: atualizar a legenda obsoleta que ainda dizia aguardar fotos e ajustar a posição de início do ombro para o rótulo não sobressair do corpo. A aprovação estética final do proprietário e a publicação permanecem separadas deste aceite técnico.

Conferência final encerrada: o encaixe do topo do rótulo foi corrigido e inspecionado em `atlas-encaixe-final-desktop.png`; legenda de origem atualizada. Frente/nutricional/verso e controles já passaram na execução dirigida anterior. Cobertura visual completa do rótulo atendida com o vídeo original. A avaliação estética do proprietário e publicação continuam pendentes; não há nova revisão estética ou reconstrução generativa nesta entrega.
