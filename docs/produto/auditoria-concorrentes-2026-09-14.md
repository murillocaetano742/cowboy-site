# Auditoria de concorrentes e plano de ajustes da página COWBOY

Data: 14/09/2026. Base da comparação: `cowboy-nova.html` na versão VSL (branch `feat/pagina-nova`, commit fa86438). Páginas auditadas em celular (iPhone 13, 390 px) com Playwright; capturas e textos completos no scratchpad da sessão.

- Concorrente A: **Libidrol (GH Muscle)** — https://ghmuscle.com.br/libidrol
- Concorrente B: **Fórmula Masculina 1000 (Farmafine)** — https://libidomasculina.laboratoriofarmafine.com/

Decisão mantida: a nossa página continua sendo uma página de VSL com um médico falando. Os ajustes abaixo são no restante da estrutura.

## 1. Resumo executivo

1. Os dois concorrentes vendem o mesmo desejo com estratégias opostas. O Libidrol promete tudo (347 %, 4 horas, "melhor que Viagra") e vai ser derrubado cedo ou tarde. A Farmafine promete quase nada em texto ("pode auxiliar") e compensa com autoridade farmacêutica, prova em prints de WhatsApp, três planos e urgência de estoque.
2. A nossa página já está entre as duas: tom mais agressivo que a Farmafine, sem as alegações ilegais do Libidrol. Onde perdemos é em **densidade de prova, oferta apresentada como plano e atendimento**.
3. As oito lacunas que mais pesam, em ordem: (1) sem WhatsApp; (2) preço sem parcela e sem custo por dia; (3) frete de R$ 25 cobrado em todos os kits enquanto os dois concorrentes dão frete grátis no kit maior; (4) prova social sem texto (fotos com nome só); (5) sem bloco de entrega e discrição; (6) sem "é para você se…"; (7) composição escondida numa tabela recolhida; (8) urgência inexistente.
4. Nossa garantia (30 dias de teste, saída em 10) é a mais forte das três e está mal vendida: falta selo, passo a passo e termos publicados.
5. A VSL de médico é uma vantagem real. A Farmafine usa uma farmacêutica com CRF em vídeo logo abaixo da dobra; nenhum dos dois tem um médico. Precisamos entregar as credenciais (foto, CRM) para essa vantagem contar.

## 2. Ficha comparativa

| Tópico | Libidrol (GH Muscle) | Farmafine | COWBOY (nossa, versão VSL) |
|---|---|---|---|
| Produto | Gotas sublinguais, 12 gotas/dia, 30 doses | Cápsulas, 60 por frasco, 4 ativos | Gotas, 12 gotas/dia, 30 porções, 6 componentes |
| Primeira dobra | 5 frascos + H1 "máximo de performance sexual" + 4 promessas numéricas + botão verde | H1 "Você não está velho. Você só está cansado." + 5 checks + foto do frasco com composição | Tag "Assista antes de decidir" + H1 + player (poster) + 3 linhas + botão |
| Vídeo | Nenhum (iframe vazio) | YouTube vertical da farmacêutica, segunda seção | VSL do Dr. Durval no topo (aguardando arquivo) |
| Autoridade | Nenhuma pessoa; "laboratório GH Muscle" | Farmacêutica com CRF, AFE Anvisa, dois CNPJs, endereço | Dr. Durval (sem foto/CRM ainda) + BNT Farma com CNPJ |
| Prova social | 2 prints de WhatsApp + 5 avaliações com foto, nome e 5 estrelas | 6 prints de WhatsApp com nome e foto do frasco + widget avali.ar | 2 vídeos reais + 6 fotos reais com pseudônimo |
| Mecanismo | 7 cards "como atua" (ilegais) | 4 cards por ativo com mg | Tabela recolhida + alegação da B6 |
| Qualificação | "Para homens e mulheres que…" (8 + 5 itens) | "Indicado para" (4) e "Não é indicado para" (4) | Só "Não é para você se…" |
| Preços | 1: R$ 97,70 · 2: 187,30 · 3: 267,70 · 5: 387,30 | 1: R$ 127,90 · 2: 167,90 · 3: 229,90 | 1: R$ 54,76 · 2: 84,76 · 3: 127,14 · 4: 169,52 |
| Preço por unidade no kit grande | R$ 77,46 (5) | R$ 76,63 (3) | R$ 42,38 (2, 3 ou 4) |
| Ancoragem | "de R$ 299 por…" + 12x de R$ 10 + "R$ 3 por dia" | "de R$ 383,70" riscado + 12x de R$ 23,73 + "Economize R$ 153,80" | "Economize R$ 24,76" + R$ 1,41 por porção |
| Parcelamento exibido | Sim, 12x em destaque | Sim, 12x em destaque | Não |
| Frete | Grátis em todos | Grátis no kit de 3 (Sul/Sudeste); cliente paga nos outros | R$ 25 em todos, declarado |
| Garantia | "90 dias" no selo, "7 dias" no rodapé (contradição) | 7 dias, certificado com CNPJ, reembolso via WhatsApp em 24 h | 30 dias de teste, saída em 10, sem selo formal e sem termos |
| Urgência | "Promoção de lançamento, só este lote" | Barra "só hoje (data de hoje)", "restam 14", "máx. 3 por cliente" | Nenhuma além de "cada mês adiando custa mais" |
| Botões de compra | 8 botões "Quero Libidrol agora" ao longo da página | 9 botões + cabeçalho fixo | 1 checkout no fim + âncoras + botão flutuante após a garantia |
| WhatsApp | Sim, botão no fim e telefone | Sim, 4 pontos + "resposta em até 1 h" | Não (só e-mail do SAC) |
| Entrega e discrição | Bloco "Entrega do produto" com transportadora, prazo e rastreio | Bloco com rastreio, caixa lacrada sem identificação, SSL, "+300.000 pedidos" | Só a linha do frete |
| FAQ | 7 perguntas (uma delas "melhor que Viagra?") | 6 perguntas, respostas curtas e legais | 8 perguntas |
| Anti-falsificação | Bloco com marketplaces riscados | Não | Frase "só aqui" |
| Rastreamento | Nenhum detectado | Meta Pixel, Clarity, TikTok, YouTube | UTMify (Pixel Meta e GA4 só na versão publicada pelo Codex) |
| Compliance | Alto risco: percentuais, "4 horas", "liberado pela Anvisa", ataque a Viagra/Tadalafila | Conservadora: "pode auxiliar", "não é medicamento", RT farmacêutica | Dentro da linha: sem alegação de efeito, B6 pela IN 28/2018 |
| Altura em celular | ~19.300 px | ~21.500 px | ~18.300 px |

## 3. O funil de cada página (ordem das seções)

**Libidrol**: dobra com promessa e botão → 3 cards (novidade, transformação, sem efeitos colaterais) → "fórmula tecnológica" → para quem é (homens / mulheres) → "como atua" (7 cards) → bloco emocional + botão → prints de WhatsApp → 5 avaliações → "por que escolher" → selo 90 dias + botão → texto de ancoragem de preço → 4 kits (1, 3 "mais vendido", 2, 5 "mais barato") → "R$ 3 por dia" → "agora você tem uma decisão" → sobre a marca → anti-falsificação → entrega → segurança → FAQ → WhatsApp. Primeiro botão de compra a 750 px do topo; oferta a 11.200 px.

**Farmafine**: barra de urgência → dobra "você não está velho" + 5 checks + frasco com composição → vídeo da farmacêutica (CRF) → "prescrita por profissionais" com foto de receita manuscrita → 4 números (4 ativos, 1000 mg, 60 cápsulas, 100 % oral) → relatos (6 prints de WhatsApp) → widget de avaliações → 4 ativos com mg → foto do farmacêutico com o frasco → "é para você? / não é para você" → planos (1, 3 "mais escolhido", 2) com estoque e limite por cliente → logística e segurança → "+300.000 pedidos" → garantia com certificado → FAQ → WhatsApp → rodapé regulatório longo. Primeiro botão de compra a 3.400 px; planos a 10.350 px.

**COWBOY (nossa)**: dobra com VSL + 3 linhas + botão → transição → prova (2 vídeos + 6 fotos) → versão escrita curta + composição recolhida → citação do Dr. Durval → kits → o que vem no teste → garantia + anti-garantia → FAQ → fechamento com duas opções → rodapé. Oferta a ~9.000 px.

Leitura: as três páginas têm o mesmo esqueleto (promessa → prova → mecanismo → oferta → garantia → FAQ). A diferença está no que cada uma coloca dentro dos blocos. A nossa é a mais curta e a única com vídeo no topo; a Farmafine é a que mais "prova" (autoridade, prints, números, logística); o Libidrol é a que mais promete.

## 4. Auditoria tópico a tópico

Cada tópico traz: como está na nossa página, o que os concorrentes fazem, e o que ajustar. Prioridade: **P1** (mexe na conversão agora), **P2** (fortalece), **P3** (acabamento).

### 4.1 Primeira dobra

- **Nossa**: tag "Assista antes de decidir · 6 minutos", título "O que ninguém te contou na farmácia. E o desafio de 30 dias do Dr. Durval.", player com poster da varanda, 3 linhas, botão, frete.
- **Concorrentes**: os dois abrem com uma frase sobre o homem, não sobre o produto. A Farmafine ("Você não está velho. Você só está cansado.") é a melhor manchete das três: fala com quem tem 50+ sem prometer nada. O Libidrol abre com 5 frascos e números.
- **Ajustar (P1)**: trocar o poster do player por um frame do Dr. Durval de jaleco olhando para a câmera, com o botão de play sobre ele. Página de VSL com poster de paisagem esconde o principal ativo da página, que é o médico. Manter o título, mas testar uma variante no estilo da Farmafine: "Não é a idade. É o que ninguém te explicou. O Dr. Durval explica em 6 minutos." Colocar abaixo do player a linha de credencial "Dr. Durval · CRM 00000 · 25 anos de consultório" assim que os dados chegarem.
- **Ajustar (P2)**: as 3 linhas do que ele vai ver estão boas; acrescentar um selo pequeno de "Teste de 30 dias" ao lado do botão, como a Farmafine faz com os 5 checks.

### 4.2 VSL e vídeo (mantido)

- **Nossa**: VSL no topo, sem distração, revelação atrasada da oferta aos 290 s.
- **Concorrentes**: a Farmafine tem a farmacêutica em vídeo vertical do YouTube, com a legenda "CRF registrado — farmacêutica responsável pela fórmula" logo abaixo. É a nossa mesma ideia, feita com menos autoridade (farmacêutica) e menos peso (segunda seção, não a dobra).
- **Ajustar (P1)**: entregar o vídeo. Enquanto não existe, a dobra está com o texto "Vídeo em produção", o que derruba a conversão de qualquer tráfego pago que entre agora. Até o vídeo chegar, publicar com a versão de conversão (a que está na raiz do site hoje) e não com a versão VSL.
- **Ajustar (P2)**: hospedar o vídeo no próprio domínio ou em player sem marca (a Farmafine usa YouTube, que mostra vídeos relacionados e tira o homem da página). Legendas queimadas ou faixa de legendas, porque a maior parte assiste sem som.
- **Ajustar (P2)**: abaixo do player, uma frase de "quem é ele" (nome, CRM, cidade, tempo de consultório), como o card de CRF da Farmafine. Sem isso o médico é um nome.

### 4.3 Promessa e mecanismo

- **Nossa**: "o problema nunca foi você"; mecanismo fica na VSL ("Bloqueio da Primeira Passagem", roteiro do proprietário). Na página, só a composição.
- **Concorrentes**: o Libidrol dá nome ao que acontece ("vasodilatação", "aumento de testosterona") e promete resultado por item, tudo ilegal para suplemento. A Farmafine descreve cada ativo como "tradicionalmente associado a…" e fecha com "pode auxiliar".
- **Ajustar (P1)**: dar nome ao mecanismo na página, sem prometer efeito: um bloco "O que o Dr. Durval chama de Bloqueio da Primeira Passagem" com 3 linhas em tom de curiosidade ("por que ele diz que o que você tomou até hoje pode não ter chegado onde deveria") e o botão "Ver no vídeo" que rola para o topo. Isso cria a curiosidade que a página de VSL precisa e não afirma nada clinicamente.
- **Ajustar (P2)**: repetir a frase de posicionamento "Só aqui. Não está na farmácia." perto da oferta, como o Libidrol faz com o bloco de anti-falsificação.

### 4.4 Qualificação ("é para você / não é para você")

- **Nossa**: só o bloco "Não é para você se…" dentro da garantia.
- **Concorrentes**: a Farmafine tem os dois lados, lado a lado, com 4 itens cada. O Libidrol tem a lista "para homens que…" com 8 dores (ereção, ejaculação precoce, libido, confiança).
- **Ajustar (P1)**: criar o bloco "É para você se…" antes da oferta com 4 a 5 situações sem alegação: "você passou dos 50 e sente que a disposição não é mais a mesma", "já tentou alguma coisa e ficou na dúvida se o problema é você", "quer testar um produto com rótulo aberto, com o risco por conta de quem vende", "prefere resolver em silêncio, sem receita e sem fila de farmácia". Manter o "Não é para você se…" ao lado.

### 4.5 Prova social

- **Nossa**: 2 vídeos reais e 6 fotos reais em rolagem lateral, legenda só com o pseudônimo. Sem texto do cliente nas fotos.
- **Concorrentes**: a Farmafine mostra 6 conversas de WhatsApp completas (foto do frasco, "comprei 3 vezes", "chegou"), cada uma com nome e horário; depois um widget de avaliações. O Libidrol tem 2 prints e 5 cards com foto, nome e 5 estrelas (as fotos são de banco de imagem, pelo padrão).
- **Ajustar (P1)**: as fotos dos nossos 6 clientes precisam vir com a frase que o cliente mandou junto (a mensagem real do WhatsApp, recortada). Foto sem fala é um homem segurando um frasco; foto com "segundo frasco, chegou rápido" é prova. Se a mensagem original existir no WhatsApp da loja, usar o print real com o nome coberto, no formato que os dois concorrentes usam.
- **Ajustar (P1)**: número de pedidos ou de clientes atendidos, se for real e verificável ("mais de N pedidos entregues desde julho"). A Farmafine repete "+300.000 pedidos" duas vezes. Se não existir número honesto, não inventar.
- **Ajustar (P2)**: colocar 1 print de WhatsApp de recompra ("pedi de novo") perto da oferta, não só na galeria do topo. Prova de recompra é a mais forte para suplemento.
- **Não copiar**: as 5 estrelas com foto de banco do Libidrol.

### 4.6 Composição e "como funciona"

- **Nossa**: tabela recolhida dentro de `<details>` com mg e % VD, mais a alegação da B6.
- **Concorrentes**: a Farmafine mostra 4 cards, um por ativo, com mg em destaque e uma linha de origem ("raiz asiática tradicionalmente associada a…"). O frasco aparece com a tabela impressa no rótulo, em foto. O Libidrol lista 7 "ações".
- **Ajustar (P1)**: trocar a tabela recolhida por 6 cards visíveis, um por componente, com a quantidade grande e uma linha descritiva sem função clínica: "Taurina 50 mg · aminoácido", "Arginina 50 mg · aminoácido", "Feno-grego 300 mg · extrato da semente", "Vitamina B6 3 mg · 231 % do VD · auxilia no metabolismo energético (IN 28/2018)", "Zinco 1,7 mg · 15 % do VD", "Boro 1,1 mg · mineral". A tabela oficial continua recolhida abaixo para quem quiser conferir.
- **Ajustar (P2)**: foto real do rótulo do frasco com a tabela nutricional legível, como a Farmafine faz. "Rótulo aberto" precisa ser visto, não só dito.

### 4.7 Autoridade e responsabilidade técnica

- **Nossa**: citação do Dr. Durval (sem foto, sem CRM), BNT Farma com CNPJ no rodapé.
- **Concorrentes**: a Farmafine tem farmacêutica com CRF em vídeo e no card, foto de uma receita manuscrita ("prescrita por profissionais da saúde"), foto de um profissional de jaleco segurando o frasco, rodapé com AFE Anvisa, licença sanitária e dois CNPJs. O Libidrol não tem ninguém.
- **Ajustar (P1)**: bloco "Quem responde por isso" com foto do Dr. Durval, CRM, especialidade e tempo de consultório, mais "Fabricado por BNT Farma, CNPJ …, com registro de fabricante" e o número de autorização de funcionamento do fabricante, se estiver no rótulo. Depende da liberação do médico (pendência conhecida).
- **Ajustar (P2)**: foto real de um frasco na mão de alguém de jaleco. Sem receita manuscrita: médico não pode prescrever produto na propaganda (CFM 2.336/2023).

### 4.8 Oferta, preço e ancoragem

- **Nossa**: 4 kits com preço à vista, preço por porção, "Economize R$ X", kit de 2 marcado como "Teste completo", frete R$ 25 em todos, sem parcela.
- **Concorrentes**: os dois mostram "12x de R$ …" como número principal e o valor à vista embaixo. Os dois riscam um preço de referência. Os dois dão frete grátis no kit que querem vender. O Libidrol converte o preço em "R$ 3 por dia". A Farmafine ordena os planos 1 → 3 (destacado) → 2, para o kit de 3 ficar no meio visual.
- **Ajustar (P1)**: exibir a parcela em cada kit ("12x de R$ 7,06" no kit de 2, se o Cartpanda oferecer 12x; confirmar o número de parcelas e juros do checkout antes de imprimir). O homem de 55+ compra no cartão parcelado; sem a parcela, R$ 169,52 parece caro e R$ 14,13 por mês parece barato.
- **Ajustar (P1)**: frete grátis a partir do kit de 3 (ou embutir os R$ 25 no preço dos kits de 3 e 4). Hoje o kit de 3 custa R$ 152,14 com frete contra R$ 229,90 da Farmafine com frete grátis; a comparação é favorável, mas a palavra "frete grátis" no card vende mais do que "R$ 25 declarado". Decisão pendente do proprietário.
- **Ajustar (P1)**: trocar "R$ 1,41 por porção" por "R$ 1,41 por dia", que é a mesma conta com uma palavra que o cliente entende. Repetir "menos de R$ 1,50 por dia" na garantia.
- **Ajustar (P2)**: ancorar com um preço de referência **real**: "1 frasco sai a R$ 54,76; no kit, R$ 42,38" já é a âncora. Não inventar "de R$ 299".
- **Ajustar (P2)**: destacar o kit de 3 como "Mais escolhido" quando houver dados de venda que sustentem; enquanto não houver, manter o "Teste completo" no kit de 2, que é o que cobre os 30 dias.
- **Ajustar (P3)**: linha "Limite de 4 frascos por pedido" (verdade: `MAX_CART_QUANTITY = 4`). Escassez honesta que a Farmafine usa ("máximo 3 por pedido").

### 4.9 Garantia

- **Nossa**: selo "10 dias", "Use por 10 dias. Quer desistir? O dinheiro volta na hora.", 30 dias de teste, 3 selos, anti-garantia. Sem termos publicados.
- **Concorrentes**: a Farmafine tem 7 dias com "certificado de garantia" (selo com CNPJ do emissor), "reembolso integral, sem retenção", "processo via WhatsApp, resolução em 24 h". O Libidrol diz 90 dias no selo e 7 dias no rodapé, o que anula a credibilidade.
- **Ajustar (P1)**: publicar as condições nos Termos (o que é devolvido, frasco aberto, prazo de estorno, como pedir) e linkar do selo. Garantia sem regra escrita é promessa, não garantia.
- **Ajustar (P1)**: passo a passo em 3 linhas: "1. Mande uma mensagem no WhatsApp até o 10º dia. 2. Sem justificativa. 3. Estorno em até N dias úteis pelo mesmo meio de pagamento." Os concorrentes prometem prazo de resposta; nós não.
- **Ajustar (P2)**: transformar o selo em um "certificado" com nome da empresa e CNPJ, como o da Farmafine. Nosso prazo (30/10) é o maior das três páginas e deve aparecer no card de cada kit ("Teste de 30 dias incluso").

### 4.10 Urgência e escassez

- **Nossa**: nenhuma mecânica; só "cada mês adiando custa mais caro".
- **Concorrentes**: a Farmafine usa barra fixa "preço promocional somente hoje (data de hoje)", "restam 14 unidades", "oferta válida até (hoje)" e limite por cliente; a data muda todo dia, então é falsa. O Libidrol usa "promoção de lançamento, só este lote".
- **Ajustar (P1)**: urgência com base verdadeira: "condição do segundo frasco por R$ 30 válida para este lote" se for verdade, ou "estoque do lote atual: N kits" se o número for real e atualizado. Não usar contador de data automática nem "restam 14" fixo; além de ser prática abusiva (CDC art. 37), o público desconfia.
- **Ajustar (P2)**: prazo da garantia como urgência: "seus 30 dias começam quando o pedido chega" já existe; repetir no botão flutuante.

### 4.11 Botões e caminho até a compra

- **Nossa**: por decisão, checkout só no fim; âncoras "Ver os kits" no meio; botão flutuante aparece depois da garantia.
- **Concorrentes**: 8 e 9 botões, todos apontando para a seção de oferta (não para o checkout direto); a Farmafine ainda tem cabeçalho fixo.
- **Ajustar (P2)**: manter a decisão (um único formulário), mas os concorrentes mostram que botão-âncora a cada 2 telas não atrapalha: acrescentar âncora "Ver a oferta do vídeo" ao fim da composição e ao fim do bloco de qualificação. O botão flutuante pode aparecer depois da prova, não só depois da garantia, quando a VSL já estiver liberada (revelação atrasada respeita o vídeo).
- **Ajustar (P3)**: texto dos botões: os concorrentes variam ("Garantir meu desconto", "Quero minha vitalidade de volta"). O nosso repete "Quero meu teste de 30 dias" em todos, o que é bom para consistência; testar variação só no botão final ("Começar meu teste agora").

### 4.12 Atendimento e WhatsApp

- **Nossa**: e-mail do SAC. Nada de WhatsApp.
- **Concorrentes**: os dois têm WhatsApp com número, mensagem pré-preenchida e, na Farmafine, "resposta em até 1 hora" e "fale antes de decidir".
- **Ajustar (P1)**: botão de WhatsApp na FAQ e no rodapé ("Tem dúvida? Fala com a gente antes de comprar"), com mensagem pronta e horário de atendimento. O proprietário já vende por WhatsApp (funil X1); a página está escondendo o canal que mais converte para esse público. Não colocar botão flutuante de WhatsApp concorrendo com o botão de compra.

### 4.13 Entrega, discrição e segurança

- **Nossa**: só "Frete R$ 25 para todo o Brasil, total antes de pagar" e "checkout em ambiente seguro".
- **Concorrentes**: blocos inteiros: transportadora, prazo de entrega, rastreio por e-mail em 24 h, caixa lacrada sem identificação, pagamento por Pagar.me/Stone, SSL.
- **Ajustar (P1)**: bloco "Como chega" com 4 itens: prazo (dias úteis por região), rastreio por e-mail/WhatsApp, embalagem discreta sem identificação do conteúdo, pagamento pelo Cartpanda (cartão, Pix, boleto). Discrição é decisiva para esse produto e não aparece na nossa página.

### 4.14 FAQ

- **Nossa**: 8 perguntas, respostas boas.
- **Concorrentes**: 6 e 7 perguntas; a Farmafine responde "tem efeito imediato?" com "não, é uso contínuo", o que filtra reclamação. O Libidrol tem "melhor que Viagra?" (não copiar).
- **Ajustar (P2)**: acrescentar "Funciona no mesmo dia?" (resposta: é suplemento de uso diário, por isso o teste é de 30 dias), "O envio é discreto?", "Posso parcelar?", "Quem é o Dr. Durval?", "Posso comprar mais de 4?".

### 4.15 Anti-falsificação e "só aqui"

- **Nossa**: frase "Só aqui, nesta página".
- **Concorrentes**: o Libidrol tem um bloco com Mercado Livre, Magalu, Amazon, Shopee riscados.
- **Ajustar (P3)**: bloco curto "Não vendemos em marketplace nem em farmácia. Se viu em outro lugar, não é o COWBOY." Reforça exclusividade sem atacar ninguém.

### 4.16 Design e leitura em celular

- **Nossa**: preto e dourado, Oswald, cards com borda fina. Lighthouse celular 94/100/100/100.
- **Concorrentes**: o Libidrol é preto com verde neon, texto pequeno, 32 imagens, blocos longos de texto centralizado; parece página de anabolizante. A Farmafine é clara, branca e azul, tipografia grande, muito espaço; parece farmácia. Nenhum dos dois tem a identidade que a nossa tem.
- **Ajustar (P2)**: manter o visual. Aumentar o corpo do texto das legendas dos relatos e dos itens de check (a Farmafine usa 16–17 px, os nossos itens pequenos ficam em 13–14 px). Fotos dos kits nos cards ficaram menores que as dos concorrentes; dar mais altura ao card do kit de 2 e 3.
- **Ajustar (P3)**: seção de números como a Farmafine (4 ativos / 1000 mg / 60 cápsulas / 100 % oral) adaptada: "6 componentes · 12 gotas por dia · 30 porções · 0 cápsulas". É um bloco barato que resume o produto em uma tela.

### 4.17 Rastreamento e medição

- **Nossa (versão VSL na branch)**: UTMify. A versão publicada na raiz pelo Codex tem Pixel Meta, GA4 e UTMify.
- **Concorrentes**: a Farmafine carrega Pixel Meta, Microsoft Clarity (gravação de sessão), TikTok e YouTube. O Libidrol não carrega nada detectável.
- **Ajustar (P1)**: ao publicar a versão VSL, carregar os mesmos scripts da versão atual (`cowboy-pixel.js`, `cowboy-google.js`). Acrescentar eventos de vídeo (play, 25/50/75/100 %) para saber em que minuto a VSL perde o homem.
- **Ajustar (P2)**: Clarity ou equivalente por 30 dias para ver mapa de rolagem e onde param.

### 4.18 Compliance e risco

- **Libidrol**: alegações de tratamento ("inibe a ejaculação precoce", "ereções por 4 horas", "347 %"), comparação com medicamentos, "liberado pela Anvisa", garantia contraditória. Página com esse texto é rejeitada pelo Meta e pode ser autuada (RDC 243/2018 art. 17). Não é referência de copy para copiar; é referência de tom.
- **Farmafine**: modelo de página dentro da regra: "pode auxiliar", "não é medicamento", RT com CRF, rodapé com AFE e licença. Vende pela confiança, não pela promessa. Onde ela sai da linha é na urgência falsa (data de hoje).
- **Nossa**: dentro da linha nas alegações; sem urgência falsa; termos da garantia ainda não publicados (risco de reclamação no Procon/Reclame Aqui se alguém pedir e a regra não estiver escrita).

## 5. Plano priorizado

| # | Ajuste | Prioridade | Seção | Depende de |
|---|---|---|---|---|
| 1 | Botão de WhatsApp na FAQ e no rodapé, com mensagem pronta | P1 | 4.12 | Número e horário |
| 2 | Parcela "12x de R$ …" em cada kit | P1 | 4.8 | Confirmar parcelas do Cartpanda |
| 3 | Frete grátis a partir do kit de 3 ou frete embutido | P1 | 4.8 | Decisão do proprietário |
| 4 | Fotos dos clientes com a mensagem real (print ou citação) | P1 | 4.5 | Mensagens originais |
| 5 | Bloco "Como chega" (prazo, rastreio, embalagem discreta, pagamento) | P1 | 4.13 | Prazo por região |
| 6 | Bloco "É para você se…" ao lado do "Não é para você se…" | P1 | 4.4 | Nada |
| 7 | Composição em 6 cards visíveis + foto do rótulo | P1 | 4.6 | Foto do rótulo |
| 8 | Termos da garantia publicados + passo a passo com prazo de estorno | P1 | 4.9 | Regras do proprietário |
| 9 | Poster do player com o Dr. Durval + linha de CRM | P1 | 4.1 / 4.7 | Foto e CRM |
| 10 | Bloco "Bloqueio da Primeira Passagem" (curiosidade, sem alegação) | P1 | 4.3 | Nada |
| 11 | "R$ 1,41 por dia" no lugar de "por porção" | P1 | 4.8 | Nada |
| 12 | Urgência honesta (lote ou condição com prazo real) | P1 | 4.10 | Dado real |
| 13 | Pixel, GA4 e eventos de vídeo na versão VSL | P1 | 4.17 | Merge com main |
| 14 | Print de recompra perto da oferta + número real de pedidos | P2 | 4.5 | Dado real |
| 15 | Certificado de garantia com CNPJ; "Teste de 30 dias incluso" nos cards | P2 | 4.9 | Nada |
| 16 | Mais âncoras "Ver a oferta" e flutuante após a prova | P2 | 4.11 | Nada |
| 17 | FAQ: efeito imediato, discrição, parcelamento, quem é o médico | P2 | 4.14 | Nada |
| 18 | Vídeo em player próprio com legendas | P2 | 4.2 | Arquivo do vídeo |
| 19 | Bloco de números (6 componentes · 12 gotas · 30 porções) | P3 | 4.16 | Nada |
| 20 | Bloco anti-marketplace | P3 | 4.15 | Nada |
| 21 | Limite de 4 frascos por pedido como escassez honesta | P3 | 4.8 | Nada |

Itens sem dependência (6, 10, 11, 15, 16, 17, 19, 20, 21) podem entrar na página nesta semana. Os demais esperam o dado ou a decisão indicada.

## 6. O que não copiar

- Números de efeito (347 %, 4 horas, 5x mais tempo), "inibe a ejaculação precoce", "aumenta testosterona", "engrossa o membro".
- "Liberado pela Anvisa" e "sem efeitos colaterais, seguro para diabéticos e cardíacos".
- Comparação com Viagra ou Tadalafila.
- Avaliações com foto de banco de imagem e 5 estrelas.
- Contador de "oferta válida até hoje" que muda a data sozinho, "restam 14 unidades" fixo.
- Preço riscado inventado ("de R$ 299").
- Selo de 90 dias com regra de 7 dias no rodapé.

## 7. Fontes

- Texto integral das duas páginas (14/09/2026, celular 390 px) em `docs/produto/concorrentes/*.txt`; capturas de tela inteiras ficaram fora do repositório pelo tamanho (31 MB).
- Nossa página: `cowboy-nova.html` (commit fa86438) e captura `docs/qa/nova/pagina-mobile.png`.
- Regras citadas: RDC 243/2018 art. 17, IN 28/2018 (alegação da B6), CFM 2.336/2023, CDC art. 37.
