# Realismo do produto: opções e viabilidade local

Data: 08/09/2026. Escopo: comparação técnica limitada para a apresentação visual do produto COWBOY a partir do vídeo e das fotos já fornecidos. Nenhuma ferramenta foi instalada e nenhum modelo ou página foi alterado nesta pesquisa.

## Conclusão operacional

Há duas soluções tecnicamente possíveis, com promessas diferentes:

1. **Rotação fotográfica por quadros reais**: preserva os pixels e a aparência observada no vídeo. Foi escolhida pelo proprietário por representar o produto real, embora continue sendo uma sequência 2D, sem câmera livre, paralaxe ou vistas verticais.
2. **Protótipo Three.js/PBR calibrado**: mantém rotação tridimensional, luz e volume. É um modelo manual baseado em referências, não um escaneamento. Esse caminho foi encerrado após a preferência explícita pelo produto fotografado real.

A fotogrametria, NeRF ou Gaussian Splatting com o vídeo atual são experimentais. A mão cobre o bulbo durante quase toda a volta, o objeto gira diante de fundo estático e detalhado, há reflexos fortes e existe apenas uma faixa de elevação. Esses limites não podem ser removidos sem ocultar, compor ou sintetizar informação.

O caminho escolhido é um viewer fotográfico que percorre quadros reais da volta. A mão presente na gravação será preservada, como já informado ao proprietário, em vez de reconstruir pixels ocultos. A avaliação de funcionamento não deve ser apresentada como prova de acabamento profissional.

## O que o material atual sustenta

O vídeo preservado em `.local/produto-real-360/original.mp4` tem 33,57 s, 1007 quadros, 30 fps e imagem exibida em 720 × 1280. A volta completa mostra frente, painel nutricional, emenda e verso. A extração e a procedência estão registradas em `docs/criacao/v3/video-360-e-atlas.md`.

A inspeção de 34 quadros amostrados a 1 fps indica:

- corpo aproximadamente centralizado, mas com mudanças de escala, posição e inclinação;
- velocidade angular não uniforme: intervalos iguais no tempo não correspondem a passos iguais em graus;
- fundo com muitos detalhes e iluminação/reflexos variáveis;
- dedos segurando o bulbo desde aproximadamente 3 s durante quase todo o restante da volta;
- impressão real visível nos quatro lados, com microtexto limitado pela resolução, curvatura e compressão.

Assim, o vídeo sustenta uma rotação fotográfica do **corpo e do rótulo**. Uma volta limpa e transparente do frasco inteiro exigiria composição do topo a partir de uma foto/quadro desobstruído, ou uma nova captura. A composição precisa ser descrita como tratamento fotográfico; pixels ocultos pela mão não podem ser recuperados como fato.

## Comparação das opções

| Opção | Fidelidade ao material real | Viabilidade com o acervo atual | Custo no navegador | Limite principal | Decisão |
|---|---|---|---|---|---|
| Photo-spin com quadros reais | Alta para os ângulos capturados | Alta; a gravação cobre uma volta e a mão permanece visível | Baixo a médio, controlável por carregamento progressivo | É 2D e a mão oculta o topo | **Escolhido pelo proprietário** |
| Three.js com geometria calibrada, PBR e textura fotográfica | Média a alta, conforme a calibração | Alta; Three.js já está versionado localmente | Médio; um canvas WebGL e texturas | Continua sendo reconstrução manual | Encerrado para esta entrega |
| Meshroom/AliceVision ou COLMAP | Potencialmente alta com captura adequada | Baixa e experimental com este vídeo | Processamento pesado fora do navegador; malha final pode ser otimizada | Fundo estático, reflexos, oclusão e uma elevação | Reavaliar após nova captura |
| Nerfstudio/NeRF ou Gaussian Splatting | Boa reprodução de vistas treinadas em fonte adequada | Baixa neste conjunto e na cadeia local atual | Treinamento e artefatos web mais pesados | Ferramentas ausentes; Windows é menos testado; captura insuficiente | Não priorizar |
| Reconstrução generativa de uma imagem | Aparência plausível, sem garantia factual | Tecnicamente possível por serviços/modelos externos | Variável | Inventa superfícies não observadas | Inadequada para alegar produto real |

## Referência técnica do candidato PBR encerrado

A implementação isolada deve manter a geometria mensurada a partir das referências e separar materiais de borracha, plástico, vidro e papel. O [`MeshPhysicalMaterial`](https://threejs.org/docs/pages/MeshPhysicalMaterial.html) oferece propriedades físicas como clearcoat e transmissão, com custo por pixel maior que materiais mais simples; a documentação recomenda um mapa de ambiente para melhores resultados.

O [`PMREMGenerator`](https://threejs.org/docs/pages/PMREMGenerator.html) pode gerar um mapa de radiância pré-filtrado a partir de uma cena local. Isso permite iluminar o frasco com planos geométricos que simulam softboxes, sem imagem HDR externa ou serviço remoto. A configuração melhora reflexos e leitura de volume, mas não corrige proporções, textura ou materiais incorretos.

Os critérios abaixo ficam como referência histórica; o candidato não seguirá para QA nesta entrega:

- carregar sob demanda e oferecer fallback estático quando WebGL ou textura falhar;
- manter rotação por ponteiro, botões e teclado, com foco visível e estado de reset previsível;
- não causar rolagem horizontal em desktop ou celular;
- evitar URLs externas, credenciais e inclusão do vídeo bruto no build público;
- medir erros de console, tamanho transferido e tempo de carregamento local;
- registrar a inspeção funcional separadamente da comparação visual conduzida com as imagens reais.

## Alternativa fotográfica 360

Uma rotação fotográfica usa uma lista ou sprite de quadros e troca a imagem conforme arraste, teclado ou botões. Ela preserva fotografia real, mas deve ser identificada como **“visualização 360 por fotografias”**, não como modelo 3D.

O projeto [`Cloudimage 360 View`](https://github.com/scaleflex/cloudimage-360-view) é MIT e aceita sequências/listas de imagens, carregamento progressivo, controles e mais de uma linha de vistas. Ele pode ser versionado localmente. Para esta página estática, uma implementação curta com `<img>` e JavaScript também é suficiente e evita uma dependência nova. O `SpinViewer` do [`@egjs/view360`](https://github.com/naver/egjs-view360/wiki/SpinViewer-3-User-Guide) confirma o padrão de sprite para rotação, mas não deve ser escolhido para código novo porque o próprio projeto registra sua [descontinuação na versão 4](https://github.com/naver/egjs-view360/issues/401). Seu guia também alerta que o ângulo interno não equivale necessariamente ao ângulo físico do produto.

Pipeline factual proposto:

1. Usar FFmpeg para extrair a volta mais limpa em resolução original.
2. Selecionar manualmente, ou por correspondência de marcos do rótulo, uma sequência de ângulos progressivos. A recomendação inicial é testar 24–36 vistas; este número é uma decisão de engenharia, não uma propriedade garantida da fonte.
3. Alinhar cada quadro pelo eixo e pela largura aparente do corpo. A estabilização deve corrigir translação, escala e pequena inclinação, sem deformar texto.
4. Segmentar o corpo/rótulo e revisar bordas quadro a quadro. A máscara não recupera o bulbo oculto pelos dedos.
5. Publicar WebP/AVIF com quadro inicial prioritário e demais quadros carregados progressivamente; manter a imagem original como fallback.
6. Testar avanço/retrocesso, teclado, primeiro/último quadro, carregamento parcial, toque, largura do viewport e `prefers-reduced-motion`.

Como a rotação não é uniforme, amostragem constante por tempo geraria saltos de ângulo. A ordem deve ser estabelecida por marcos visuais e o controle deve operar por índice de quadro. Não se deve exibir graduação em graus sem calibração explícita.

Há três tratamentos possíveis para fundo e mão:

- **mais conservador:** recortar a rotação abaixo dos dedos e manter uma fotografia estática do produto inteiro ao lado;
- **composição documentada:** usar o topo desobstruído de um quadro inicial ou foto original, aplicando a mesma peça sobre os quadros após alinhamento; isso é composição fotográfica e pode apresentar pequenas mudanças de luz;
- **melhor fonte:** refazer a captura com produto apoiado, fundo liso, câmera/exposição/foco travados, luz difusa, passo angular constante e vistas adicionais acima e abaixo.

O [`rembg`](https://github.com/danielgatis/rembg) é MIT, processa lotes e aceita quadros de vídeo via FFmpeg, mas opera imagem a imagem e pode produzir tremulação de contorno. O [`SAM 2`](https://github.com/facebookresearch/sam2) é Apache-2.0 e propaga máscaras em vídeo a partir de prompts, sendo mais apropriado para consistência temporal. Nenhum dos dois está instalado localmente; ambos apenas criam máscaras e não revelam áreas cobertas pela mão. Para fundo realmente uniforme, os filtros oficiais do [FFmpeg](https://ffmpeg.org/ffmpeg-filters.html) incluem chroma key, despill, perspectiva e estabilização, mas o fundo deste vídeo não é uma tela cromática limpa.

## Fotogrametria: possível como experimento, inadequada como promessa

O [Meshroom](https://github.com/alicevision/Meshroom) é uma aplicação open source MPL-2.0 sobre AliceVision. Seu [guia de captura](https://meshroom-manual.readthedocs.io/en/latest/capturing/capturing.html) recomenda evitar sombras, reflexos e transparência; o objeto deve ocupar boa parte da imagem. O tutorial específico de [turntable](https://meshroom-manual.readthedocs.io/en/latest/tutorials/turntable/turntable.html) explica que o fundo estático interfere na reconstrução e orienta usar máscaras ou preferir a câmera em movimento ao redor do objeto.

O [COLMAP](https://github.com/colmap/colmap) é BSD e implementa Structure-from-Motion e Multi-View Stereo. A [documentação oficial](https://colmap.github.io/faq.html) informa que a correspondência se beneficia de sobreposição, textura e iluminação semelhante, e permite máscaras para excluir áreas durante a extração de características. Essas condições ajudam a explicar o risco deste vídeo: o rótulo oferece textura, mas o vidro escuro/reflexivo, a mão, o fundo estático e a única elevação prejudicam uma malha completa e limpa.

Um teste futuro poderia extrair e mascarar quadros, executar reconstrução local e medir cobertura, furos e erros de textura. Isso não justifica prometer resultado profissional antes do teste. A melhor entrada é uma nova sessão multiângulo controlada.

O [Nerfstudio](https://docs.nerf.studio/quickstart/installation.html) é uma opção open source para campos neurais e técnicas relacionadas. Seu fluxo de [dados próprios](https://docs.nerf.studio/quickstart/custom_dataset.html) aceita vídeo, mas requer COLMAP para estimar poses. A documentação recomenda CUDA/PyTorch e observa que Windows é menos testado, com Linux recomendado. “360 data” nessa documentação refere-se a câmera equiretangular; não descreve um objeto girando diante de uma câmera fixa.

## Capacidade local comprovada

| Recurso | Estado em 08/09/2026 | Uso possível |
|---|---|---|
| FFmpeg/FFprobe 8.1.2 | Disponível no PATH | Extrair, recortar, alinhar, transcodificar e inspecionar quadros |
| Filtros FFmpeg | `chromakey`, `despill`, `perspective`, `remap`, `vidstabdetect` e `vidstabtransform` presentes | Pré-processamento, sujeito à qualidade da fonte |
| Python 3.12.14 do runtime Codex | Disponível; NumPy e Pillow presentes | Seleção e montagem simples de quadros |
| OpenCV, rembg, SAM 2, PyTorch | Não encontrados no runtime Python consultado | Exigiriam instalação; não realizada |
| ImageMagick | Não encontrado no PATH | Dispensável para o protótipo |
| Three.js 0.185.1 | Módulos estáticos versionados em `assets/vendor/three-0.185.1/` | Protótipo WebGL/PBR sem CDN |
| GPU NVIDIA RTX 5070 Ti, 16 GB | Detectada localmente | Capacidade física para experimentos, sem garantir compatibilidade da cadeia |

As skills locais de design ajudam a apresentação, interação e acessibilidade; `watch` ajuda a inspecionar/extrair vídeo. Não há skill instalada que faça fotogrametria ou segmentação temporal. `imagegen` é geração visual e não deve ser usada como evidência de escaneamento ou para preencher superfícies não observadas.

## Decisão e ponto de parada

Será avaliado o viewer fotográfico de quadros reais, inicialmente isolado. A QA técnica cobre carregamento progressivo, controles, teclado, arraste sem acionar a rolagem da página, reset, fallback, erro de asset, dimensões móveis, desempenho local e privacidade do build. Também verificará que os frames publicados provêm da fonte atual e que nenhum mesh substitui o objeto fotografado. Aprovação funcional não equivale a aprovação estética.

O PBR foi encerrado por decisão explícita do proprietário. Meshroom/COLMAP e Nerfstudio ficam como experimentos para uma eventual nova captura controlada, sem adoção automática. A pesquisa foi encerrada nesse conjunto porque ele cobre os caminhos materialmente diferentes sem instalar ferramentas ou iniciar uma reconstrução pesada.
