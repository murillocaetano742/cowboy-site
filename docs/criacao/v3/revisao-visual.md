# Revisão visual independente — COWBOY V3

Data: 08/09/2026. Revisor: frente de conteúdo/arte, independente do frontend. URL exclusiva: `http://127.0.0.1:4173/cowboy-v3.html`.

## Método e escopo

Revisão manual orientada pelos critérios de Impeccable e UI/UX Pro Max, pelo mapa aprovado e pelo manifesto da marca. Não foi executado o launcher nem o workflow automatizado completo de critique. Capturas e inspeções DOM via Playwright já disponível no runtime, Chrome 152.0.7977.65 headless, contextos novos isolados, desktop 1440 × 1000 e celular 390 × 844. A execução acessou o preview local; não utilizou perfis autenticados, Canva ou compras reais.

Artefatos de revisão exclusivamente em `.local/revisao-v3/`. Não pertencem a esta revisão os arquivos paralelos `cowboy-360*` ou `docs/qa/360/*`.

## Resultado consolidado

A direção preta/âmbar/couro, o título western Rye e as chamadas condensadas Barlow distinguem a página de um template genérico. O produto aparece inteiro no hero, os blocos alternam composição e superfície, a fórmula é apresentada em linhas e os vídeos preservam identidade própria. O bloco de confiança tem título forte, fotografia e informações concretas; a oferta aparece somente no final.

A primeira rodada identificou crescimento contínuo do palco 3D, overflow no celular, sobreposição da imagem/copy e recorte excessivo do hero. O frontend corrigiu esses pontos. A segunda rodada apresentou zero elementos com overflow horizontal, zero erros JavaScript e zero respostas HTTP >=400 no percurso capturado.

A conferência dirigida corrigiu ainda a macro que retinha 1024 px de altura e o enquadramento da miniatura do primeiro cliente. Dimensões finais da macro: 546,8 × 364,5 no desktop; 350 × 233,3 no celular, mantendo 3:2. Os dois retratos carregam; o primeiro usa enquadramento inferior para preservar o rosto.

## Evidências verificadas

- Navegação anterior à oferta: apenas topo, frasco, fórmula e relatos. Um único formulário de checkout, dentro de `#escolher-kit`, com destino `/api/checkout`; sem atalho de compra no hero/menu ou barra fixa.
- Rolagem normal permanece disponível. Nenhum vídeo precisa ser assistido para prosseguir.
- Cada artigo de relato contém seu vídeo, foto real do mesmo cliente e frase curta associada; sem nomes inventados, estrelas ou compra verificada.
- Os dois vídeos reproduziram no navegador sem erro, com durações 14,372993 s e 13,305011 s. As tracks de legendas automáticas carregaram com 3 e 2 cues. A integridade completa do áudio já foi verificada anteriormente por comparação de AAC; não houve nova transcrição nesta revisão.
- No 3D, botões e arraste mudaram a imagem renderizada em desktop/celular. ArrowLeft também mudou; reset e Home recuperaram exatamente o hash da imagem frontal. Frente/verso completos capturados.
- Falha controlada de carregamento do módulo Three mostrou foto e mensagem de indisponibilidade, com canvas oculto, sem carregamento eterno.
- Preferência de movimento reduzido respeitada no estado testado. Controle do modelo acessível por teclado e alternativas de botão presentes. Avaliação visual de legibilidade e contraste feita nos pontos principais; isso não é certificação integral WCAG.
- Oferta apresenta os preços autorizados 1/2/4: R$ 54,76 / R$ 84,76 / R$ 169,52. Compra real, disponibilidade logística e resposta externa de pagamento pertencem à frente de integração; não foram simuladas como sucesso por esta revisão.

## Artefatos

- `rodada2-dom.json`: dimensões, links, mídia, respostas e erros do segundo percurso.
- `final-interacao.json`: resultado de rotação, teclado, reset, scroll e fallback.
- `aceite-dirigido.json`: macro, retratos, reprodução e legendas.
- `rodada2-{desktop,mobile}-hero.png`: cabeçalho e hero com fontes locais.
- `final-{desktop,mobile}-3d-{frente,verso}.png`: modelo antes do último refinamento material/textura.
- `aceite-{desktop,mobile}-{confianca,relatos,oferta}-viewport.png`: capturas de viewport real.
- `aceite-{desktop,mobile}-pagina.png`: página completa, com mídia lazy no estado alcançado durante a captura.

Algumas capturas por locator exibem o skip-link que fica fora da área visível. Foi verificado no DOM: sem foco, top = -80 px, bottom < 0. As capturas de viewport real confirmam que ele não aparece sobre o conteúdo no uso comum. Não foi tratado como defeito de navegação.

## Refinamento final solicitado pela coordenação

A versão funcional inicial do modelo ainda tinha aparência geométrica simples. Foram entregues textura frontal preta/dourada com emblema, representativa e inspecionada, e orientação ao frontend para refinar material escuro e formato do bulbo. Conferência final dirigida do modelo refinado será anexada após integração. A arte não é apresentada como rótulo documental; o verso usa a composição conhecida.

## Pausa de direção visual — atualização posterior

O proprietário rejeitou a direção estética atual e informou preferir a primeira prévia. A coordenação pausou novas alterações visuais e de copy. Os resultados funcionais acima continuam como evidência técnica; não significam aprovação estética do proprietário. A comparação em `comparacao-primeira-previa.md` registra a troca Georgia → Rye/Barlow e a reorganização mobile. Textura frontal e complemento B6 permanecem como entregas/propostas documentadas, sem nova autorização de aplicação após a pausa. A conferência de textura preparada em `.local/revisao-v3/conferencia-textura.cjs` não foi executada.

## Checkpoint do modelo com frente fotográfica real

Nova conferência dirigida após integração da IMG_1410: `.local/revisao-v3/real-aceite.json` e capturas `real-aceite-{desktop,mobile}-{frente,verso,reset}.png`. A textura frontal usa a foto original em setor limitado e o verso permanece neutro, sem antiga tabela redigitada. Silhueta/material foram aproximados da foto real; ombro ainda simplificado, não declarar réplica completa do produto.

Em desktop/celular, rotação por botão, arraste e teclado passaram. Baseline estabelecido após reset e estabilização: reset retornou hash exato em ambos. O resultado anterior `modelo-real-final.json` tinha `resetExact:false` ao comparar a primeira captura com o estado pós-reset; não prevalece sobre a comparação estabilizada. Sem erros JavaScript nessa execução.

Dois cenários de falha foram verificados: bloqueio do módulo Three e bloqueio da textura frontal WebP. Em ambos a foto original IMG_1410 permanece carregada/visível, canvas oculto e mensagem específica; evidências `real-aceite-fallback-modulo.png` e `real-aceite-fallback-textura.png`.

A mudança de fonte para Georgia revelou overflow de texto interno em dois H2 mobile, embora suas caixas estivessem dentro da largura. Medição por Range: fórmula chega a x433,375 e FAQ a x408,9375 com viewport390. Foi solicitado ajuste responsivo mínimo ao frontend, mantendo a tipografia. Não é falha do modelo; exige conferência dirigida após ajuste. Não foram reexecutados testes amplos.

Próxima evidência recebida do proprietário: arquivo HTML do WhatsApp associado a vídeo360. A frente de ferramentas localizará somente a mídia alvo; a revisão de quadros poderá fornecer as vistas que faltam, sem necessidade de inventar laterais/verso.

Correção dirigida dos dois H2 confirmada: após ajuste apenas de tamanho responsivo pelo frontend, `diagnostico-texto.cjs` retornou `width:390` e `textOverflow:[]`. Checkpoint funcional/visual do modelo frontal concluído; pendência de fidelidade completa continua vinculada às vistas reais restantes.

## Modelo com cobertura fotográfica completa do vídeo

A fonte MP4 posterior cobriu a volta inteira. O novo atlas contínuo substituiu o setor único e o verso neutro. A conferência dirigida em1440/390 confirmou frente, nutricional e verso reais, ordem correta, marca única, rotação/arraste/teclado/reset e fallback para IMG_1410. Zero erros JavaScript; largura do documento1440/390. Evidências mais recentes em `.local/revisao-v3/atlas-final.json` e capturas `atlas-final-*`; detalhes de fonte/UV em `video-360-e-atlas.md`.

Esse checkpoint supera a antiga pendência de cobertura de vistas descrita acima. Permanecem os limites de nitidez/perspectiva fotográfica e a aprovação visual final do proprietário. Foram solicitadas somente atualização da legenda de origem e adequação do encontro entre ombro e rótulo, sem redesign da página.

## Encerramento do QA dirigido

Confirmado somente o encaixe final entre corpo, ombro e rótulo após o ajuste: a parte cilíndrica alcança o topo da textura, eliminando a saliência observada. Captura inspecionada: `.local/revisao-v3/atlas-encaixe-final-desktop.png`. A legenda agora informa que o modelo foi reconstruído a partir de imagens reais do produto.

QA técnico dirigido encerrado. O requisito de cobertura frontal, nutricional e traseira foi atendido pelo vídeo original, substituindo a dependência das quatro fotos individuais não localizadas. Atlas: somente quadros do vídeo; foto IMG_1410: referência de proporções e fallback. Não há pendência de arquivos para essas vistas. Permanecem avaliação visual do proprietário e publicação/validações externas, conforme os acessos disponíveis.
