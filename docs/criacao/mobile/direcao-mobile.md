# COWBOY — direção mobile e copy de conversão

**STATUS: DIREÇÃO REJEITADA PELO PROPRIETÁRIO. Documento histórico; não implementar novos ajustes com base nele. Ver diagnostico-original-vs-mobile.md.**

Data: 08/09/2026. Modo: Persuade. Substituição visual e editorial autorizada pelo proprietário; implementação code-led. Mobile é a composição principal, com expansão posterior para desktop. Este documento substitui a direção visual anterior para a página V3. Não altera fatos do produto, vídeos reais, preços ou integrações.

## Decisão de direção

**COWBOY como marca de produto que ocupa a tela:** a força vem da embalagem preta/dourada, da tipografia condensada e de uma sequência comercial curta. O visitante vê o produto, entende o que a fórmula entrega em termos nutricionais, ouve clientes, confere a compra e escolhe o kit.

O mundo visual é uma campanha contemporânea de embalagem masculina, com contraste preto/branco e ouro reservado à marca e às ações. Não é um catálogo de couro nem uma página de suplemento montada com selos. O rótulo já fornece o caráter COWBOY; a interface não precisa de tipografia caricatural western. O público é masculino, interessado em cuidado pessoal, presença e intimidade. A identidade aparece na embalagem, no tom direto e nos relatos desses homens; não transformar a página em catálogo genérico de multivitamínicos nem atribuir efeito sexual à vitamina B6.

A verdade visual rejeitada foi capturada em `.local/revisao-mobile/incumbente-hero390.png` e `incumbente-full390.png`: header alto, repetição de marca/títulos serifados, frases genéricas, produto deslocado à direita, primeira ação distante e sequência de blocos marrons semelhantes. **Trocar cores sem alterar composição e argumento não resolve isso.**

## Tokens e composição

| Papel | Definição |
|---|---|
| Preto da embalagem | `#090A0B`: hero, confiança, rodapé |
| Branco | `#FFFFFF`: fórmula, relatos, FAQ, oferta |
| Cinza mineral | `#ECEEEC`: superfície do resumo/seleção; não fundo creme |
| Ouro COWBOY | `#D4A341`: ação principal, marca e destaque comercial |
| Grafite | `#25282B`: texto sobre branco |
| Cinza de apoio | `#5B6267`: texto secundário em superfícies claras |

Títulos: **Barlow Condensed Bold**, local `assets/fonts/v3/barlow-condensed-bold.ttf`; hero 52–60 px em 390 px, entrelinha 0,98–1,04, tracking entre 0 e −0,02em. H2 34–40 px; não transformar toda seção em cartaz. Corpo: **Barlow Regular**, 16–18 px/1,45; botões e preços Barlow Semibold/Bold. Não usar Georgia, Rye, fonte serifada ou texto todo em caixa alta por padrão. O logotipo pode manter COWBOY em caixa alta como marca.

Margens mobile: 20 px em 390; 16 px em 360. Ritmo: 8/12/20/32/48/64 px. Separação de seção 56–64 px; agrupamentos internos próximos. Botões reais com 52–56 px de altura, preenchimento sólido, rótulo explícito e raio de 10–12 px. Links de navegação permanecem links; sem flechas Unicode como decoração em todas as ações. Sem sobreposição absoluta entre copy e produto.

A ousadia fica no hero de produto e na oferta. Os blocos intermediários favorecem leitura: fórmula em uma composição integrada, vídeos amplos, confiança com imagem e conteúdo concreto. Sem sobrancelhas/eyebrows, linhas finas ornamentais, números de seção ou seis cartões idênticos de ingredientes.

## Hero: primeiro celular, depois desktop

Header em uma linha de aproximadamente 56 px: COWBOY Energia + links discretos **Fórmula** e **Relatos**. Não há link de compra no topo.

```text
COWBOY Energia           Fórmula  Relatos

Seu dia pede
energia.

       [frasco inteiro, central]

COWBOY reúne seis componentes em gotas,
incluindo vitamina B6, que auxilia no
metabolismo energético.

[          Conhecer COWBOY          ]
Suplemento alimentar em gotas. 30 mL.
```

A primeira ação deve aparecer até aproximadamente a primeira tela de 390 × 844. Produto ocupa uma imagem de cerca de 320–360 px de altura, com ponta e base inteiras; não uma faixa paisagem com frasco pequeno no canto. Marca, headline e texto não competem por três níveis gigantes. Hero usa fluxo normal e altura ditada pelo conteúdo.

**Atualização final de asset:** usar `imagens/mobile/cowboy-estudio-foto-real.webp` (1024 × 1536, 108.488 bytes), edição de estúdio da foto real IMG_1410 autorizada para o hero e inspecionada. Frasco inteiro central, sem recorte da ponta/base. Origem e limites em `hero-origem-e-revisao.md`. Esta escolha substitui as opções temporárias abaixo, inclusive cowboy-bottle.jpg.png, rejeitada após revisão por erros no rótulo.

Não usar `cowboy-bottle.jpg.png` ou o recorte `cowboy-frasco-alpha.webp`: a revisão identificou, respectivamente, erros de rótulo e contorno serrilhado. A arte paisagem anterior foi superada pelo enquadramento vertical novo. A edição do hero não substitui a fotografia original como fonte de microtexto.

A foto real `imagens/v3/referencias-reais/IMG_1410.jpeg` serve para conferir o produto no bloco de confiança, podendo abrir por link/expansão. Não precisa dominar o bloco nem aparecer como grande captura de WhatsApp no hero. Nenhum 360, setas de giro, canvas ou drag de produto permanece na página; os recursos anteriores são preservados fora dessa experiência.

## Copy completa e sequência mobile

### 1. Abertura escolhida

**H1: Seu dia pede energia.**

**Apoio:** COWBOY reúne seis componentes em gotas, incluindo vitamina B6, que auxilia no metabolismo energético.

**CTA editorial:** Conhecer COWBOY → `#formula`.

**Identificação:** Suplemento alimentar em gotas. 30 mL.

Alternativas avaliadas e descartadas: “Mais presença na sua rotina” não explica o produto; “COWBOY. Para acompanhar o seu ritmo” fica na identidade sem argumento. A abertura escolhida relaciona uma necessidade cotidiana à função nutricional específica, sem prometer disposição imediata, resultado sexual ou efeito igual para todos.

### 2. Fórmula útil, sem aula ou promessas

**Título: Seis componentes. Saiba o que tem dentro.**

**Texto:** A vitamina B6 auxilia no metabolismo energético. Confira os componentes e as quantidades declaradas na fórmula COWBOY.

Apresentar em duas colunas alinhadas, nome e quantidade, dentro de um único painel branco: taurina **50 mg**; arginina **50 mg**; feno-grego **300 mg**; vitamina B6 **3 mg**; zinco **1,7 mg**; boro **1,1 mg**.

**Nota próxima:** Quantidades por porção declarada de 12 gotas (1 mL). Para usar, siga as orientações do rótulo.

**Fecho curto:** Apresentação líquida com conta-gotas, em frasco de 30 mL.

Sem bloco separado que repita “30 mL / gotas / seis componentes”. Não publicar kit como meses de uso. A frase B6 é a função reconhecida do nutriente, não certificação do produto; fonte primária será mantida no registro interno já conferido, sem atribuir função terapêutica aos demais ingredientes por analogia.

### 3. Prova humana

**Título: Homens que experimentaram contam.**

**Texto:** Clientes mostram o COWBOY e falam da própria experiência. Assista aos relatos.

Dois vídeos grandes, um abaixo do outro no celular, cada um associado a seu próprio frame e trecho. Não produzir quatro depoimentos aparentes duplicando foto e vídeo em cartões distintos.

- Vídeo 1: **“Tá só o ouro.”** Imagem `imagens/v3/cliente-relato-1.jpg`; mídia `videos/clientes/depoimento-1.mp4`.
- Vídeo 2: **“A mulher agradece mais ainda.”** Imagem `imagens/v3/cliente-relato-2.jpg`; mídia `videos/clientes/depoimento-2.mp4`.

**Identificação discreta:** Trecho do relato em vídeo.

**Nota do conjunto:** Experiências individuais. Resultados podem variar.

Manter legenda automática existente, controles nativos e áudio original. Rosto inteiro no poster, sem selo/estatística antiga, estrelas, nomes ou compra verificada inventados. Nada de autoplay ou bloquear avanço até assistir.

### 4. Confiança tangível

**Título: Você vê o produto. Sabe o que leva.**

**Texto:** O frasco real, a composição com quantidades e relatos de quem experimentou. Informações para escolher seu COWBOY com clareza.

Composição em preto: imagem editorial de embalagem em um bloco visual único, acesso claro à foto real para conferir e três fatos de compra, sem pequenos cartões:

**Produto identificado:** COWBOY Energia, suplemento alimentar em gotas, 30 mL.

**Composição aberta:** ingredientes e quantidades declarados no rótulo, apresentados nesta página.

**Contato da marca:** dúvidas sobre o produto podem ser enviadas para contato@cowboyenergiamasculina.com.br.

O email deve quebrar linha sem overflow; usar rótulo de ação **Falar com a COWBOY** ligado ao canal existente. Não transformar contato disponível em promessa de prazo de resposta. Não anunciar testes de lote, pureza, aprovação da Anvisa ou política de satisfação não existente. A confiança está nos elementos visíveis, não em um selo chamado garantia.

### 5. Dúvidas que destravam a escolha

**Título: Antes de escolher seu kit**

**Como usar o COWBOY?** Siga as orientações do rótulo. Se recebeu orientação individual diferente, confirme o uso com o profissional que acompanha você.

**Para quem é indicado?** O rótulo destina o produto a adultos a partir de 19 anos. Não deve ser consumido por gestantes, lactantes e crianças.

**Vou ter a mesma experiência dos vídeos?** Os relatos são pessoais. A experiência pode variar de pessoa para pessoa.

**Como vejo o frete e o total?** Selecione o kit e informe seu CEP no bloco de compra. O frete é calculado para o destino; confira o total antes de pagar.

Acordeão simples, toque amplo, primeira pergunta pode abrir por decisão do frontend. Não esconder preço, frete ou alertas essenciais em acordeão. Evitar repetir a lista de ingredientes no FAQ.

### 6. Oferta final: um argumento, uma compra

**Título: Seu segundo Cowboy por mais R$ 30.**

**Texto:** Leve 2 frascos por R$ 84,76. Você economiza R$ 24,76 em comparação com 2 frascos avulsos.

Seletor vertical único, com três opções radio, sem três cartões de marketing empilhados. Seleção de 2 frascos pode ser inicial por combinar com o argumento, sem selo “mais vendido”.

| Opção | Total | Apoio |
|---|---:|---|
| 1 frasco | R$ 54,76 | Para conhecer |
| 2 frascos | R$ 84,76 | R$ 42,38 por frasco |
| 4 frascos | R$ 169,52 | R$ 42,38 por frasco |

**Campo:** Seu CEP. **Ação:** Calcular frete.

Resumo próximo: **Produtos / Frete / Total**. Valores respondem ao kit e ao CEP, sem texto fixo que pareça total final antes de consultar o frete.

**Único CTA de compra:** Continuar para o pagamento.

**Apoio:** Confira os dados e as condições no checkout antes de concluir.

A oferta deve ser o bloco mais simples de operar: preço legível, opção selecionada evidente, campo e botão organizados para o polegar, estados de cálculo/erro próximos. Nenhum CTA ou atalho para compra em hero/menu/rodapé; sem compra fixa, urgência fictícia, frete grátis ou parcelamento presumido. Não vender o kit 4 como menor preço unitário que o 2.

### 7. Rodapé curto

COWBOY Energia. Suplemento alimentar em gotas. Links existentes de Termos, Privacidade e Atendimento. Alertas legíveis: **Este produto não é um medicamento. Não exceda a recomendação diária indicada na embalagem. Mantenha fora do alcance de crianças.** Identificação empresarial apenas se já sustentada no projeto.

## Contrato de execução e revisão

Conteúdo preservado: fatos de `docs/produto/product-facts.json`, depoimentos autorizados, preços 1/2/4 e checkout/frete existentes. A declaração do proprietário já substituiu a antiga pendência genérica de origem dos vídeos. Nenhuma nova aprovação é exigida para implementar o redesenho que ele autorizou.

Foram lidas frontend-design e Impeccable/new-work/craft-floor. O comando `impeccable context --target cowboy-v3.html` foi executado uma vez e falhou porque o engine não está instalado; o launcher existe. Não se anuncia fluxo automatizado completo. PRODUCT.md e DESIGN.md não estavam disponíveis. O contexto de produto vem dos registros e evidências existentes; este documento é o contrato de direção code-led, não uma simulação de votação de comps.

Após o frontend terminar: uma crítica visual mobile de página inteira e pontos de decisão, com conferência secundária desktop; um único lote de correções; uma confirmação final limitada aos problemas encontrados. Prioridades: o hero parece uma marca de produto, a primeira ação está próxima, a leitura tem ritmo e argumento, os vídeos estão bem enquadrados, a compra cabe na tela e é clara. Não declarar uma aprovação estética do proprietário com base apenas em testes funcionais.

## Fonte da função nutricional e limite de uso da alegação

A frase “A vitamina B6 auxilia no metabolismo energético” foi confirmada pelo agente de pesquisa em fonte primária da Anvisa e liberada pelo coordenador para esta copy. Referências: [IN 28/2018](https://bvs.saude.gov.br/bvs/saudelegis/anvisa/2018/int0028_26_07_2018.pdf) e [consulta oficial de ingredientes e condições](https://www.gov.br/anvisa/pt-br/assuntos/alimentos/suplementos-alimentares/consulte-a-lista-de-ingredientes-autorizados). O rótulo transcrito declara 3 mg de B6 na porção de 12 gotas/1 mL. O enquadramento vigente do produto e a divergência da recomendação diária continuam questões internas separadas; não converter esta fonte em “produto aprovado”, prova clínica da fórmula ou validação de uma dose diferente. A UI usa somente uma função específica da B6 e os fatos existentes. Não foi acrescentada uma segunda promessa sobre zinco para inflar o argumento.




