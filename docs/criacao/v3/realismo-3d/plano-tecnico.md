# Plano técnico — frasco 3D com aparência de produto

Data: 08/09/2026. Esta é uma investigação local; não altera o visualizador atual nem instala ferramentas.

## Diagnóstico do visualizador atual

O módulo `assets/js/cowboy-v3-3d.js` resolve a interação, a cobertura fotográfica do rótulo e o fallback, mas sua geometria é feita em tempo real por `LatheGeometry`, cilindros e nervuras em caixa. Isso deixa sinais de maquete:

- corpo, tampa e bulbo usam materiais uniformes, sem mapas próprios de rugosidade, normal ou oclusão;
- os reflexos vêm de três luzes simples e de um disco no chão, sem ambiente de estúdio que reflita no vidro escuro;
- o vidro usa uma aproximação de `MeshPhysicalMaterial`, sem espessura, etiqueta em relevo, variações de acabamento ou microdefeitos observados nas fotos;
- a tampa estriada é repetição geométrica, útil para silhueta, mas não reproduz as estrias moldadas e o relevo real;
- o atlas do vídeo é evidência real do rótulo, mas não contém os mapas PBR do frasco.

O atlas 360 e as referências reais continuam sendo a fonte de aparência. Um novo modelo deve ser apresentado como reconstrução fotográfica, não como escaneamento 3D métrico.

## Inventário local

| Item | Estado | Consequência |
|---|---|---|
| Three.js 0.185.1 local | Disponível em `assets/vendor/three-0.185.1/` | Mantém visualizador, interação e fallback atuais. |
| Atlas real 360 | `imagens/v3/referencias-reais/rotulo-360-video.webp` | Pode ser a textura `baseColor` do rótulo. |
| Foto de referência | `imagens/v3/referencias-reais/IMG_1410.jpeg` | Confere silhueta, acabamento e fallback. |
| Vídeo 360 original | `.local/produto-real-360/original.mp4` | Fonte para validar geometria/material, não é asset público. |
| FFmpeg | Disponível localmente | Extrai quadros e referências; não modela ou renderiza PBR. |
| Blender | Não encontrado no `PATH` nem em `C:\Program Files\Blender Foundation` | Não há pipeline GLB/UV/render instalado hoje. |
| GLB/GLTF/HDR/EXR existentes | Não encontrados no workspace | Não há modelo PBR nem ambiente de estúdio pronto para reaproveitar. |

## Opção principal — Blender local → GLB PBR → Three.js

Usar Blender como ferramenta única de autoria offline e exportar um único `.glb` para o site. A página continua estática; o Three.js só carrega o ativo final de modo lazy.

1. Modelar corpo, ombro, base, anel, tampa e bulbo com curvas de perfil baseadas nas medidas do vídeo: altura/diâmetro aproximada de 3,12, bulbo ~22% da altura e tampa+anel ~22,5%.
2. Aplicar UV separado para vidro, rótulo e tampa. O atlas real do vídeo permanece no rótulo sem recriar caracteres ou completar painéis.
3. Criar materiais PBR distintos: vidro muito escuro com reflexo controlado, borracha preta fosca para o bulbo, plástico preto estriado e etiqueta com pequena diferença de relevo/roughness. Normal, roughness e AO devem ser derivados de geometria/fotografia somente quando a fonte permitir; não inventar microtexto.
4. Iluminar em estúdio neutro no Blender para conferência e exportar o GLB com os mapas necessários. O ambiente do site pode usar um mapa local compacto ou um ambiente PMREM derivado de uma cena de luzes locais.
5. No frontend, carregar o GLB com `GLTFLoader` local, manter os mesmos comandos de arraste, setas, Home e reset. O poster continua IMG_1410 e a falha de carregamento preserva esse fallback.

**Custo local e limites:** Blender não está instalado; a proposta exige somente esse instalador oficial e depois trabalho de modelagem/UV. Não requer serviço pago, conta externa ou geração de imagens. A fidelidade será fotográfica, não uma medição industrial: as referências não fornecem espessura interna nem dimensões em milímetros. Um GLB sem compressão pode aumentar o payload; a meta é limitar malha, usar texturas WebP/KTX2 somente se os codificadores locais forem disponibilizados e manter carregamento sob demanda.

## Alternativa sem Blender — aprimorar Three.js atual

Manter a geometria por código e trocar materiais/iluminação:

- gerar um ambiente de estúdio com `PMREMGenerator.fromScene`, sem HDR externo;
- usar `MeshPhysicalMaterial` com valores separados para vidro, plástico e borracha, mais luz de recorte suave;
- substituir caixas das estrias por malha de revolução com modulação radial e reduzir polígonos invisíveis;
- aplicar mapa de roughness/normal somente se produzido a partir de uma referência real verificável.

Essa alternativa tem baixo custo de payload e preserva a arquitetura atual. A diferença de acabamento depende da precisão da geometria, dos mapas e da iluminação, não do Three.js nem do fato de a malha ser procedural. Um GLB só melhora se esses insumos forem melhores. Esta rota permite chegar a um candidato de alto realismo sem trocar de renderer; a comparação fotográfica é que demonstrará o ganho.

## Alternativa de contingência — turntable pré-renderizado

Renderizar um vídeo/frames de uma volta em estúdio resolveria iluminação, mas perderia a rotação contínua pelo usuário, aumentaria mídia e faria o controle parecer uma simulação. Não é recomendada enquanto a exigência for 360 interativo.

## Recomendação e próxima execução isolada

Escolher primeiro um candidato **Three.js PBR local**. Blender e GLB continuam uma alternativa caso a comparação não demonstre melhoria suficiente. A prova isolada deve:

1. construir uma malha fechada com a silhueta medida e comparar frente/lateral/verso a quadros reais;
2. aplicar o atlas real e materiais PBR distintos, com ambiente PMREM local;
3. renderizar três capturas e só então decidir se há motivo técnico para produzir um ativo GLB offline;
4. validar tamanho, decodificação, fallback, mobile, rotação, reset e ausência de rede externa.

Critério de parada: se a comparação das três vistas não superar claramente o visualizador atual, manter o modelo atual e não substituir a página.

## Referências técnicas

- [Three.js — WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html): contexto WebGL, compilação assíncrona e métricas de renderização.
- [Three.js — PMREMGenerator](https://threejs.org/docs/pages/PMREMGenerator.html): ambiente pré-filtrado para materiais PBR e possibilidade de gerar ambiente a partir de uma cena local.
- [Three.js — GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html): carregamento de GLB e extensões de materiais glTF 2.0.

As referências descrevem capacidade técnica; não constituem garantia de realismo. A decisão visual permanece ancorada nas fotos e no vídeo reais do produto.
