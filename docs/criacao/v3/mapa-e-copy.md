# COWBOY Energia V3 — mapa e copy pronta

Data: 08/09/2026. Direção de implementação autorizada; documento interno. A sequência privilegia descoberta e confiança. Compra somente ao final, com rolagem livre e sem exigir interação anterior.

## Direção visual e regras de navegação

Preto quase absoluto `#0B0907`, carvão `#17120D`, âmbar `#C9943A`, dourado claro `#E8BF6A`, couro `#4B2D1D` e texto osso `#F4EBDD`. O osso é cor de texto, não fundo dominante. Títulos condensados fortes; corpo legível. Alternar hero cinematográfico, palco escuro do frasco, fórmula em linhas editoriais, faixa couro, relatos amplos e oferta final. Evitar todos os elementos dentro de cartões arredondados.

Menu: **O frasco · A fórmula · Relatos**. Nenhum item “Comprar”, “Kits” ou âncora para oferta no menu. Logo volta ao topo. Nenhuma barra de compra fixa. Links editoriais seguem âncoras normais. Sem scrolljack, trava de rolagem, temporizador ou autoplay sonoro.

## 01 — Hero: marca e produto

**Eyebrow:** SUPLEMENTO ALIMENTAR EM GOTAS · 30 mL

**H1:** COWBOY ENERGIA

**Headline de apoio:** PERSONALIDADE FORTE. FÓRMULA EM GOTAS.

**Texto:** Seis componentes em um único frasco. Conheça o COWBOY por dentro, veja cada detalhe e ouça quem já experimentou.

**CTA editorial:** Explorar o frasco → `#frasco`

**Linha de contexto:** 30 mL por frasco · Fórmula com 6 componentes · Relatos em vídeo

**Arte:** frasco grande e inteiro, embalagem frontal reconhecível, luz âmbar lateral e textura de couro/madeira escura. Texto HTML separado da fotografia para leitura e responsividade. Sem preços, ícone de carrinho, selo ou garantia no hero.

## 02 — Frasco 3D/360

**Eyebrow:** DE PERTO, EM CADA ÂNGULO

**H2:** CONHEÇA O SEU COWBOY.

**Texto:** Gire o frasco, aproxime os detalhes e conheça a apresentação de 30 mL com conta-gotas.

**Instrução curta:** Arraste para girar.

**Controles acessíveis:** Girar à esquerda · Girar à direita · Voltar à frente

**Legenda do modelo:** Visualização 3D representativa da embalagem.

**Link editorial:** Conhecer a fórmula → `#formula`

**Implementação:** representar forma, cor e identidade do frasco; fotografia é referência de aparência. Não inventar verso de rótulo técnico, número de lote, certificação ou dados ausentes. Fallback estático com descrição visível caso 3D não carregue. Movimento discreto, sem autoanimação permanente obrigatória.

## 03 — Fórmula

**Eyebrow:** O QUE TEM DENTRO

**H2:** SEIS COMPONENTES. UM COWBOY.

**Texto:** Confira a composição e as quantidades declaradas no rótulo.

| Linha | Nome visível | Quantidade |
|---|---|---:|
| 01 | Taurina | 50 mg |
| 02 | Arginina | 50 mg |
| 03 | Feno-grego | 300 mg |
| 04 | Vitamina B6 | 3 mg |
| 05 | Zinco | 1,7 mg |
| 06 | Boro | 1,1 mg |

**Nota imediatamente abaixo:** Quantidades por porção declarada de 12 gotas (1 mL).

**Direção:** seis linhas numeradas com tipografia generosa; não seis cartões com benefícios médicos. Destacar os valores sem gráficos percentuais inventados. Sem comparação de absorção, testosterona, circulação, cura ou desempenho sexual por ingrediente.

## 04 — Diferencial concreto

**Eyebrow:** PRATICIDADE NO FORMATO

**H2:** EM GOTAS. DO SEU JEITO DE VIVER.

**Texto:** Uma fórmula em apresentação líquida, com conta-gotas e frasco de 30 mL. O essencial para conhecer o produto está aqui: formato, composição e orientação de uso.

**Três pontos, em faixa/linhas:**

- **Conta-gotas:** apresentação que permite dosar em gotas, conforme a orientação do rótulo.
- **30 mL:** volume declarado em cada frasco.
- **6 componentes:** composição apresentada com as quantidades por porção.

**Link editorial:** Ouvir os relatos → `#relatos`

Não usar “mais rápido”, “mais potente”, “100% absorvido”, “exclusivo”, “sem efeitos colaterais” ou mecanismo médico sem fundamento. A força deste bloco está no produto concreto, não em superioridade inventada.

## 05 — Relatos reais

**Eyebrow:** QUEM EXPERIMENTOU, CONTA

**H2:** DÊ O PLAY. OUÇA DELES.

**Texto:** Dois clientes mostram o COWBOY e contam a própria experiência.

**Player 1:** `videos/clientes/depoimento-1.mp4` + VTT existente. **Player 2:** `videos/clientes/depoimento-2.mp4` + VTT existente. Controles nativos, sem autoplay, `preload=none` ou metadata conforme performance. Legendas: “Português (legendas automáticas)”.

**Foto/trecho 1:** frame real do vídeo 1; frase curta “Tá só o ouro.” — intervalo transcrito 00:12,680–00:14,180.

**Foto/trecho 2:** frame real do vídeo 2; frase curta “A mulher agradece mais ainda.” — trecho final do intervalo transcrito 00:06,060–00:12,900.

**Identificação sob cada foto/trecho:** Trecho do relato em vídeo.

**Nota discreta do conjunto:** Experiências individuais. Resultados podem variar.

As falas curtas provêm da transcrição automática local já revisada proporcionalmente, sem atribuir identidade ou condição médica. Não extrair “100%” para headline. As fotos são os mesmos participantes dos vídeos, sem geração de rostos, retoque de aparência ou conta extra de depoimentos. Sugerido usar frame/poster grande junto da citação e ação “Assistir ao relato” no próprio bloco, sem duplicar quatro depoimentos aparentes.

## 06 — Produto, rótulo e confiança

**Eyebrow:** COMPROMISSO COWBOY DE QUALIDADE

**H2:** CONFIANÇA EM CADA DETALHE.

**Texto:** O frasco à vista. A fórmula por dentro. Clientes contando a própria experiência. E um canal direto com a COWBOY para tirar suas dúvidas.

**Linhas objetivas:**

- **Produto:** suplemento alimentar em gotas.
- **Conteúdo:** frasco de 30 mL com conta-gotas.
- **Orientação:** siga as orientações do rótulo. Se recebeu orientação individual diferente, confirme com o profissional que acompanha você.
- **Atendimento:** contato@cowboyenergiamasculina.com.br.

**Texto técnico secundário, legível:** Destinado a adultos a partir de 19 anos, conforme o rótulo. Não exceda a recomendação diária indicada na embalagem. Não deve ser consumido por gestantes, lactantes e crianças. Mantenha fora do alcance de crianças. Este produto não é um medicamento.

**Arte:** bloco de confiança com peso visual: macro de frasco e couro em `imagens/v3/cowboy-detalhe-couro.webp`, título editorial grande e texto curto. Linhas de informação em segundo nível. Se disponível, fotografia documental do rótulo pode completar a consulta; a foto gerada não deve funcionar como prova do microtexto.

Não anunciar rotina de conferência de lote, laudo, pureza, certificação, política de satisfação, rastreio operacional ou troca garantida ainda não adotados. A confiança pública vem do que está disponível para conferir, dos relatos e da clareza do pedido.

## 07 — FAQ

**Eyebrow:** DIRETO AO PONTO

**H2:** SUAS DÚVIDAS, RESPONDIDAS.

**O que é o COWBOY Energia?** É um suplemento alimentar em gotas, em frasco de 30 mL. Sua composição reúne taurina, arginina, feno-grego, vitamina B6, zinco e boro.

**Como devo usar?** Siga as orientações do rótulo. Se recebeu orientação individual diferente, confirme o uso com o profissional que acompanha você.

**O que significam as quantidades da fórmula?** São as quantidades declaradas por porção de 12 gotas, equivalente a 1 mL. Essa informação permite conferir a tabela de composição do produto.

**Os relatos garantem o mesmo resultado para mim?** Os vídeos mostram experiências pessoais dos clientes. A experiência pode variar de pessoa para pessoa.

**Como consultar o frete?** No bloco de compra abaixo, selecione o kit e informe seu CEP. Confira o frete e o valor total antes de pagar.

**Como falar com a COWBOY?** Escreva para contato@cowboyenergiamasculina.com.br.

Usar acordeão sem esconder alertas de compra; nenhuma âncora para oferta dentro das respostas. A página segue normalmente até o bloco final.

## 08 — Compra final

**Eyebrow:** AGORA, ESCOLHA O SEU

**H2:** SEU COWBOY. SEU KIT.

**Argumento central:** Seu segundo frasco por R$ 30 a mais.

**Texto:** Compare as opções, consulte o frete pelo CEP e confira o total do pedido.

| Kit | Chamada | Total | Apoio |
|---|---|---:|---|
| 1 frasco | PARA CONHECER | R$ 54,76 | 30 mL |
| 2 frascos | LEVE O SEGUNDO POR + R$ 30 | R$ 84,76 | R$ 42,38 por frasco |
| 4 frascos | MAIS FRASCOS NO MESMO PEDIDO | R$ 169,52 | R$ 42,38 por frasco |

Seleção de kit, CEP, cálculo de frete, resumo produto + frete e **um CTA funcional “Continuar para o pagamento”**, dentro deste bloco. Textos alternativos por estado devem refletir a configuração existente. Não prometer frete grátis, prazo fixo, parcelamento ou meios de pagamento ainda não homologados. Não rotular 4 frascos como melhor preço unitário que 2, nem chamar qualquer kit de “mais vendido” sem dado.

**Apoio ao CTA:** Confira os dados e as condições no checkout antes de concluir.

## 09 — Rodapé

**Marca:** COWBOY ENERGIA

**Descrição:** Suplemento alimentar em gotas · 30 mL.

**Links:** Termos · Privacidade · Atendimento. URLs existentes válidas. Identificação empresarial somente com dados verdadeiros disponíveis.

Sem compra duplicada fora da seção final, simulações de vendas, contagem regressiva, bloqueio de copiar texto ou impedimento de navegação.

## Fontes e material

Fatos: `docs/produto/product-facts.json` (fotografias do rótulo; não laudo). Áudio: `.local/revisao-depoimentos/revisao-audio.md`. Vídeos: `videos/clientes/`; originais preservados em `videos/`. O proprietário confirmou os relatos reais e autorizou sua inclusão. Arquivos finais de arte e frames serão informados em `direcao-de-arte-e-assets.md` e ao frontend assim que concluídos.


## Complemento factual de copy — vitamina B6

Acrescentar junto da composição: **A vitamina B6 auxilia no metabolismo energético.** A frase descreve a função do nutriente, sem prometer efeito imediato, desempenho sexual, cura ou aprovação do produto.

Fonte primária conferida em 08/09/2026: [Anvisa, Nota Técnica 43/2025, página 11](https://www.gov.br/anvisa/pt-br/centraisdeconteudo/publicacoes/alimentos/manuais-guias-e-orientacoes/alegacoes_plenamente_reconhecidas_nota_tecnica_43.pdf/@@display-file/file), linha da vitamina B6. A tabela contém essa formulação reconhecida e referência mínima de 0,195 mg por porção para alimentos; o documento remete às regras específicas de suplementos. O registro local `docs/produto/product-facts.json` declara 3 mg por porção de 12 gotas/1 mL. Esta referência sustenta a função nutricional citada, não constitui certificação, laudo ou auditoria de regularização do COWBOY.
