# Diagnóstico de fidelidade — frasco COWBOY

Data: 08/09/2026. Escopo limitado: comparar foto IMG_1410, vídeo original/quadros e `atlas-encaixe-final-desktop.png`. Nenhuma alteração de página, malha ou textura nesta análise. Testes de interação anteriores não comprovam realismo visual.

## Diagnóstico

O render mostra a impressão real sobre uma embalagem ainda simplificada. O atlas resolveu a origem e a cobertura do rótulo; não reconstruiu a aparência da borracha, do plástico, do vidro ou da iluminação. A rejeição visual é compatível com essas diferenças concretas.

| Área | Diferença observada | Consequência |
|---|---|---|
| Forma | H/D≈3,12 está próximo da referência, mas tampa/anel/borracha parecem peças geométricas separadas; faltam transições suaves e pequenos relevos observados | Silhueta geral reconhecível, acabamento de objeto artificial |
| Materiais | Borracha, tampa e anel compartilham o mesmo material no código; superfícies quase uniformes, estrias perfeitamente repetidas | Borracha e plástico não têm respostas visuais distintas; preto sem informação |
| Vidro | Reflexo pequeno/pontual no render; nas referências há reflexos amplos, ombro com gradações e contorno legível | O vidro parece plástico opaco sob um ponto de luz |
| Iluminação | Ambiente e luzes quentes tingem toda a embalagem; branco do painel nutricional fica amarelado | Perda de correspondência de cor com o produto fotografado |
| Contato com chão | Um disco marrom plano representa a base; não há `shadowMap` habilitado nem luz com sombra no código consultado | Apoio parece cenário de demonstração, sem sombra de contato convincente |
| UV | O atlas contém iluminação/reflexos já gravados nos quadros, mais iluminação adicional do render; emendas e retificação aproximada permanecem | Aparência de fotografia colada sobre uma malha, diferenças de brilho ao girar |
| Escala de apresentação | O frasco ocupa cerca de 160 px dos 701 px de largura do canvas desktop capturado | Detalhe real do rótulo se perde; aumentar a textura isoladamente não aumenta o produto na tela |

A correção não deve continuar como sucessão de pequenos ajustes sem referência. Primeiro é necessário escolher a forma de apresentação e comparar uma vista frontal em escala equivalente à fotografia.

## Critérios visuais propostos para o próximo protótipo

Estas são tolerâncias de trabalho propostas, não resultados já atingidos.

1. **Silhueta:** sobrepor fonte e protótipo na mesma altura/ângulo; H/D entre 3,06 e 3,18. Nos marcos de bulbo, tampa, ombro e base, diferença do contorno inferior a 2% da altura total. A medida física exata ainda não está disponível.
2. **Detalhes:** tampa com topo/anel e estrias legíveis; borracha alongada com base alargada; nenhuma interseção, degrau ou separação inexistente entre peças. Comparar frente e duas vistas de três quartos.
3. **Materiais e luz:** distinguir borracha, plástico e vidro na vista frontal sem depender da cor do rótulo. Usar iluminação de avaliação neutra primeiro; manter a tabela nutricional visualmente clara, próxima da fonte, antes de adicionar atmosfera da página.
4. **Impressão:** nenhum caractere ou emblema recriado, esticado de forma perceptível ou repetido nas emendas. Nome, volume e painel nutricional devem conservar proporção e orientação das referências.
5. **Apresentação:** frasco inteiro, sem recorte da ponta/base, ocupando 75–85% da altura útil. Oferecer aproximação/detalhe sem interpolação generativa; no tamanho normal, a marca precisa ser reconhecível.
6. **Aceite visual:** comparar lado a lado fonte e protótipo frontal/nutricional/verso, em escala equivalente. Só então levar ao proprietário. Interação sem erro, presença de três vistas e origem real da textura são verificações separadas.

## Fotogrametria com este vídeo

**Viabilidade: experimental e parcial; não é uma base segura para prometer um scan realista pronto.** O objeto gira em relação ao fundo estático; a mão encobre e toca o bulbo; câmera/enquadramento variam; vidro escuro e borracha têm brilho e poucas marcas estáveis. Há boa textura no rótulo, porém um único percurso quase horizontal e pouca informação de topo/base.

Objeto girando não inviabiliza fotogrametria por si só. O fluxo oficial da Agisoft para mesa giratória trata separadamente objeto e fundo com máscaras; sua orientação também favorece iluminação uniforme e não encobrir o objeto. Aqui seria necessário mascarar mão/fundo, rejeitar quadros desfocados e avaliar se os pontos reconstruídos pertencem ao frasco. Não foi executado um teste de reconstrução, portanto não há resultado de qualidade a anunciar. [Agisoft: fluxo de mesa giratória](https://agisoft.freshdesk.com/support/solutions/articles/31000163268-turntable-capturing-scenario-and-processing-workflow), [captura de objetos próximos](https://agisoft.freshdesk.com/support/solutions/articles/31000149340-close-range-objects-scanning).

O COLMAP recomenda boa textura, iluminação semelhante, evitar brilho especular e manter sobreposição entre vistas. Esses requisitos explicam por que o rótulo é o trecho mais promissor e vidro/borracha são os mais incertos neste material. Minha conclusão de viabilidade parcial é uma inferência dessas orientações com os quadros observados. [COLMAP: orientações de captura](https://colmap.github.io/tutorial.html#structure-from-motion).

## Estratégia recomendada

**Para máxima fidelidade imediata com o material existente:** preparar uma prova de visualizador fotográfico de 360°, com quadros reais ordenados por ângulo, eixo/base estabilizados e tamanho consistente. Cada posição mostra o próprio frasco fotografado; não depende de simular vidro e borracha. Isso é uma sequência interativa de fotografias, não uma malha 3D e não permite mudar livremente altura/ângulo da câmera. A recomendação precisa ser apresentada ao proprietário como escolha de abordagem, sem substituir silenciosamente o 3D pedido.

O vídeo atual permite essa prova, mas não oferece acabamento de catálogo sozinho: a mão cobre a ponta em boa parte da volta, há oscilação e objetos ao fundo. Recortar a mão também cortaria regiões reais do frasco. Não completar a ponta ou fabricar vistas encobertas. Uma captura dedicada, com objeto centralizado, giro sem mão visível, exposição/foco fixos e luz difusa, é o caminho mais direto para um 360° fotográfico bonito e fiel.

**Se o requisito continuar sendo uma malha 3D:** modelagem de produto calibrada à silhueta, materiais separados e iluminação de estúdio são mais previsíveis que apostar toda a entrega numa fotogrametria automática deste vídeo. Produzir primeiro uma única vista frontal convincente, comparada à fonte, antes de refazer UV/360. As fontes atuais orientam a forma e a impressão; detalhes encobertos continuam inferidos e devem ser tratados como reconstrução aproximada. Não prometer scan exato.
