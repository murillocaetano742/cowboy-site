# REBUILD-011 — Página COWBOY Energia V3

Status: Página local e modelo com atlas fotográfico de 360° implementados e conferidos. Aprovação visual do proprietário e publicação/validações externas pendentes. A story permanece aberta.

## Objetivo

Construir a página autorizada pelo proprietário com apresentação do produto, fórmula documentada e relatos reais. A compra aparece somente no bloco final. A primeira prévia V3 orienta a recuperação visual solicitada pelo proprietário; preços, simulações e políticas antigas não são restaurados por associação.

## Direção de trabalho e correção solicitada

Referência histórica: `loja.html` no commit `d4c726d`. Base preta/âmbar, couro e produto em destaque. Mapa/copy em `docs/criacao/v3/mapa-e-copy.md`.

Após comparar as prévias, o proprietário preferiu a aparência da primeira prévia V3. O frontend restaurou Georgia no display/logo e a pilha de corpo anterior, preservando os ajustes funcionais. O QA comparativo do hero foi concluído em 1440/390: recupera o desenho tipográfico inicial; no celular, mantém título e navegação sem cortes. Isso registra correspondência técnica à referência, não aprovação visual final do proprietário.

A apresentação 3D usa referências reais da embalagem. A foto original IMG_1410 foi localizada e confirmada. Posteriormente, o vídeo original fornecido pelo proprietário mostrou uma volta completa; seu atlas fotográfico agora cobre frente, painel nutricional e verso, sem redigitar a impressão. A foto permanece como fallback.

## Critérios de aceitação

- [x] Registrar mapa de seções, copy e limites factuais antes da implementação.
- [x] Implementar sequência: hero → frasco 3D/360 → fórmula → diferenciais concretos → relatos → produto/clareza → FAQ → compra → rodapé.
- [x] Exibir compra exclusivamente no bloco final, sem barra fixa de compra ou atalhos de hero/menu para oferta.
- [x] Permitir navegação e rolagem normais; CTAs anteriores apenas editoriais, sem exigir assistir aos vídeos.
- [x] Entregar visualizador 3D com interação por ponteiro, botões e teclado, apresentado com os limites reais da reconstrução.
- [x] Reconstruir e conferir frente, painel nutricional e verso do frasco com quadros reais do vídeo 360, preservando a impressão observada e documentando limites de nitidez/perspectiva.
- [x] Preservar a foto original como fallback em falha do módulo 3D ou da textura frontal; respeitar movimento reduzido.
- [x] Exibir os seis componentes e quantidades conforme a porção declarada de 12 gotas/1 mL; não inferir dose geral de 24 gotas nem duração dos kits.
- [x] Produzir, inspecionar, otimizar e integrar as duas imagens editoriais do produto. Não confundi-las com as fotografias originais usadas no 3D.
- [x] Exibir dois relatos reais e fotos extraídas desses mesmos vídeos, com áudio e originais preservados; identificar legendas automáticas.
- [x] Não criar estrelas, nomes, compra verificada, contadores, resultados universais ou política de reembolso não adotada.
- [x] Reaproveitar checkout/frete, preços 1/2/4 de R$ 54,76/R$ 84,76/R$ 169,52 e atribuição. Fluxos de frontend conferidos com mocks locais; isso não comprova operação externa de cobrança/frete.
- [x] Conferir celular/desktop, teclado, legibilidade, tamanho dos textos, mídia, fallback e comportamento de compra final.
- [x] Executar gates locais aplicáveis e registrar evidências reais.
- [ ] Obter aprovação visual final do proprietário para a página e a apresentação do produto.
- [ ] Concluir publicação e validações externas no escopo autorizado, conforme acesso disponível e coordenação.

## Evidências e pendências concretas

A frente original é `imagens/v3/referencias-reais/IMG_1410.jpeg`, cópia idêntica da foto encontrada em Downloads e confirmada como foto 1 do chat. O setor frontal inicial de 110° foi substituído por atlas contínuo feito somente com quadros do vídeo original. Frente, painel nutricional, emenda e verso foram inspecionados no modelo; não há tabela redigitada ou textura gerada. A geometria é aproximada e não se apresenta como digitalização metrológica.

O checkpoint dirigido confirmou rotação, arraste, teclado e reset com hash idêntico após estabilização em desktop/celular. Falha do módulo e falha da textura preservam a original carregada com mensagem correspondente. O ajuste de dois títulos móveis após restauração de Georgia foi revalidado: documento com 390 px de largura e nenhum transbordamento de texto.

A frente de QA técnico registrou 22/22 testes, sintaxe de 27 arquivos, build e verificação da allowlist/referências aprovados. Após os últimos ajustes dirigidos, o frontend informou novamente lint e check:build aprovados. Detalhes e alcance em `docs/qa/revisao-v3-funcional-seguranca.md`; revisão visual em `docs/criacao/v3/revisao-visual.md`.

Pendentes separados: (1) decisão visual final do proprietário; (2) publicação e validação externa. A cobertura das vistas reais foi concluída pelo vídeo original, sem depender das quatro fotos individuais não localizadas. O acesso de preview remoto Vercel retornou 403 no checkpoint técnico. A compra real não foi efetuada pelo QA. A integração local já autorizada não depende de nova aprovação estética para correções técnicas necessárias.

## Responsabilidades

- Conteúdo, arte e referências fotográficas: `audio_depoimentos`.
- Frontend e visualizador: `videos_clientes`.
- Integrações, ferramentas e QA técnico: `pesquisa_conectores`, sob coordenação do agente raiz.
- Revisão visual: conteúdo/arte, independente da implementação.
- Direção comercial e aprovação visual: proprietário.
- Coordenação e publicação: agente raiz, respeitando autorização e acessos.

## File List

- `docs/stories/REBUILD-011-pagina-v3.md`
- `docs/criacao/v3/mapa-e-copy.md`
- `docs/criacao/v3/direcao-de-arte-e-assets.md`
- `docs/criacao/v3/revisao-visual.md`
- `docs/criacao/v3/comparacao-primeira-previa.md`
- `docs/criacao/v3/produto-real-referencias-3d.md`
- `docs/criacao/v3/video-360-e-atlas.md`
- `cowboy-v3.html`
- `assets/css/cowboy-v3.css`
- `assets/js/cowboy-v3.js`
- `assets/js/cowboy-v3-3d.js`
- `assets/vendor/three-0.185.1/`
- `assets/fonts/v3/` (fontes locais disponíveis; Georgia restaurada na página)
- `imagens/v3/cowboy-hero-western.png` e `.webp`
- `imagens/v3/cowboy-detalhe-couro.png` e `.webp`
- `imagens/v3/cliente-relato-1.jpg` e `cliente-relato-2.jpg`
- `imagens/v3/cowboy-rotulo-frontal.png` e `.webp` (arte gerada separada, não usada como textura real)
- `imagens/v3/referencias-reais/IMG_1410.jpeg`
- `imagens/v3/referencias-reais/frente-recorte-IMG_1410.png`
- `imagens/v3/referencias-reais/frente-setor-cilindrico-IMG_1410.png`, `.webp` e `.json`
- `imagens/v3/referencias-reais/rotulo-360-video.png`, `.webp` e `.json`
- `imagens/v3/referencias-reais/video-frente.jpg`, `video-nutricional.jpg` e `video-verso.jpg`
- `.local/produto-real-360/` (original preservado, quadros e scripts de montagem; fora do build público)
- `scripts/build-site.js`
- `scripts/check-build.js`
- `scripts/serve-site.js`
- `package.json` e `package-lock.json`
- `docs/governanca/instalacao-skills-v3.md`
- `docs/governanca/registro-conectores-v3.md`
- `docs/qa/revisao-v3-funcional-seguranca.md`
- `.local/revisao-v3/` (scripts, capturas e resultados locais; inclui `real-aceite.json`, `qa-frete-seguranca.json`, retificação fotográfica e comparação Georgia)

Os arquivos paralelos `cowboy-360*` e `docs/qa/360/*` não fazem parte das evidências desta story.

## Encerramento do checkpoint técnico

Encaixe final do topo do rótulo conferido em `atlas-encaixe-final-desktop.png`; legenda de origem corrigida. O requisito de vistas completas foi atendido pelo vídeo 360 original enviado pelo proprietário, substituindo a necessidade das quatro fotografias individuais ausentes. Atlas feito somente de quadros do vídeo; IMG_1410 mantida para proporções e fallback. QA dirigido encerrado. Restam avaliação visual do proprietário e publicação/validações externas, não falta de arquivos de referência.
