# COWBOY Energia — mapa da página e copy (versão 360)

Data: 08/09/2026. Arquivo da página: `cowboy-360.html` (rota local `/360`). Estilos em `assets/css/cowboy-360.css`, scripts em `assets/js/cowboy-360.js` (página) e `assets/js/cowboy-360-model.js` (frasco em 3D).

Este documento define **onde cada coisa fica na página, o que cada bloco precisa fazer com o visitante e a copy exata**. Toda frase tem uma base factual indicada. Fontes: `docs/produto/product-facts.json`, `docs/produto/copy-v2.md`, `docs/produto/evidencias-e-pendencias.md`, `docs/qa/relatorio-v2.md`, `config/commerce.js`, `config/logistics.js`.

## Estratégia da página

1. **Compra só no fim.** Nenhum botão de compra, preço em destaque ou link para o checkout aparece antes do capítulo final. O menu não tem "Comprar". O visitante precisa atravessar o produto inteiro para chegar ao kit.
2. **A página é uma leitura em capítulos.** Nove capítulos numerados, com uma trilha lateral que marca o que já foi lido. No celular, um indicador fixo mostra o capítulo atual. No fim, o bloco de compra mostra quais capítulos o visitante ainda não viu, com link direto. Isso mantém a pessoa no site e conduz para a decisão.
3. **Garantia de boa compra, não de devolução.** O capítulo "Compromisso COWBOY" entrega certeza por informação: rótulo aberto, origem identificada, preço na mesa, atendimento e o que **não** prometemos. O direito de arrependimento aparece apenas como fato legal, em segundo plano.
4. **Mecanismo de diferenciação = o formato.** "Seis componentes em uma única solução em gotas, medida a conta-gotas, em vidro escuro". Isso é verificável no produto e não atribui função sexual, hormonal ou de rapidez.
5. **Imagens.** Hero editorial (bancada escura), packshot em recorte com fundo transparente (novo, gerado do packshot v2), macro do conta-gotas, cena da fórmula, kit de 4 e entrega. Modelo 3D construído a partir das fotos do produto com o rótulo real mapeado.
6. **Prova social real.** Os dois vídeos de clientes, mais cartões com o frame do próprio vídeo e um trecho literal da transcrição automática. Nada inventado. Sem estrelas, notas, contadores ou "compra verificada".

## Claims proibidos (não aparecem em nenhum bloco)

Cura ou tratamento de disfunção erétil, ejaculação precoce, próstata ou diabetes; "100% natural"; "10x mais potente"; "aprovado pela Anvisa"; resultado garantido; efeito em X dias; dose de 24 gotas; duração dos kits; escassez ou compras recentes fabricadas; estatísticas ou avaliações sintéticas.

## Mapa e copy por bloco

### 0. Cabeçalho e barra de progresso

- **Função:** identidade e orientação. Sem CTA de compra.
- **Elementos:** marca, links para os capítulos, barra fina de progresso de leitura no topo.
- **Copy:** `COWBOY Energia` · links: `O frasco` · `A fórmula` · `Compromisso` · `Relatos` · `Perguntas`.

### Hero — abertura

- **Função:** apresentar o produto e avisar, de propósito, que a compra fica no fim.
- **Elementos:** foto editorial do frasco (bancada escura), título em Bebas Neue, declaração em itálico, link de rolagem.
- **Título:** `ENERGIA EM GOTAS. SEM SEGREDO NO RÓTULO.`
- **Declaração:** `Antes de escolher seu kit, conheça o frasco por inteiro: composição, porção, fabricante e modo de uso. Os botões de compra ficam no fim da página, de propósito.`
- **Link:** `Começar pelo frasco` → capítulo 1.
- **Faixa de fatos:** `30 mL por frasco` · `30 porções declaradas no rótulo` · `6 componentes por porção` · `Fabricado por BNT Farma`.
- **Base:** volume, porções, componentes e fabricante transcritos do rótulo (`product-facts.json`).

### Capítulo 1 — O frasco em 360°

- **Função:** o momento memorável da página. O visitante gira o frasco, olha de perto e ganha familiaridade com o objeto que vai receber.
- **Elementos:** modelo 3D interativo (arrastar, setas do teclado, botões girar), legenda de três pontos, aviso de representação.
- **Título:** `GIRE. APROXIME. CONFIRA.`
- **Texto:** `O frasco que chega na sua casa: vidro escuro, tampa com conta-gotas e o rótulo preto e dourado com tudo o que você precisa saber impresso nele.`
- **Pontos:** `Vidro escuro — protege o conteúdo da luz.` · `Conta-gotas — a porção do rótulo é medida em gotas: 12 gotas equivalem a 1 mL.` · `Rótulo — composição, advertências, lote e validade impressos na embalagem.`
- **Aviso:** `Modelo 3D ilustrativo, construído a partir das fotos do produto. O rótulo real é a referência.`
- **Base:** rótulo fotografado; "protege da luz" é propriedade genérica do vidro âmbar/escuro, sem alegação sobre o produto. Lote e validade são obrigatórios na rotulagem de suplementos.

### Capítulo 2 — Por que gotas (mecanismo COWBOY)

- **Função:** diferenciação verificável.
- **Título:** `SEIS COMPONENTES. UMA PORÇÃO. NENHUMA CÁPSULA.`
- **Texto:** `O COWBOY Energia reúne taurina, arginina, extrato de feno-grego, vitamina B6, zinco e boro em uma única solução líquida. Em vez de combinar potes diferentes, você mede uma porção com o conta-gotas e pronto.`
- **Três colunas:** `Medido no conta-gotas` (`A porção declarada é de 12 gotas. Sem partir comprimido, sem contar cápsulas.`) · `Uma solução, seis componentes` (`Aminoácidos, extrato vegetal, vitamina e minerais na mesma porção.`) · `Vidro escuro de 30 mL` (`Embalagem que protege o conteúdo da luz, com 30 porções declaradas.`)
- **Alegação permitida:** `A vitamina B6 auxilia no metabolismo energético.` com nota: `Alegação prevista na IN 28/2018 da Anvisa para a vitamina B6. Não se aplica aos demais componentes nem à fórmula como um todo.`
- **Foto:** macro do conta-gotas.
- **Base:** `relatorio-v2.md` valida a alegação de B6 (3 mg dentro dos limites). Nenhuma função é atribuída aos outros cinco componentes.

### Capítulo 3 — Composição

- **Função:** transparência total, em HTML acessível.
- **Título:** `O QUE TEM EM CADA PORÇÃO.`
- **Tabela:** porção de 1 mL (12 gotas). Taurina 50 mg · Arginina 50 mg · Feno-grego 300 mg · Vitamina B6 3 mg (231% VD) · Zinco 1,7 mg (15% VD) · Boro 1,1 mg. Cada linha abre um "o que é" descritivo (aminoácido, extrato de semente, vitamina, mineral), sem função.
- **Declarações:** `Não contém glúten.` · `Colorido artificialmente.` · `Indicado no rótulo para pessoas a partir de 19 anos.` · `Lista completa de ingredientes, conservantes e aditivos no rótulo.`
- **Base:** `product-facts.json`. A lista integral de aditivos não é reproduzida porque `evidencias-e-pendencias.md` pede conferência com a arte final.

### Capítulo 4 — Modo de uso

- **Título:** `COMO USAR, SEGUNDO O RÓTULO.`
- **Texto:** `Siga as orientações da embalagem. A porção declarada é de 12 gotas (1 mL). Se você recebeu uma orientação individual diferente, confirme o uso com o profissional que acompanha você.`
- **Fatos:** `Após aberto, consumir em até 60 dias.` · `Não exceder a recomendação diária indicada na embalagem.` · `Não deve ser consumido por gestantes, lactantes e crianças. Mantenha fora do alcance de crianças.` · `Este produto não é um medicamento.`
- **Base:** rótulo. A dose de 24 gotas e a duração dos kits continuam fora da página (pendência de reconciliação).

### Capítulo 5 — Compromisso COWBOY (garantia de boa compra)

- **Função:** o ponto mais forte. Certeza por informação, não promessa de resultado.
- **Título:** `VOCÊ COMPRA SABENDO EXATAMENTE O QUE ESTÁ LEVANDO.`
- **Quatro compromissos:**
  1. `Rótulo aberto` — `Composição, porção, advertências e fabricante estão nesta página e na embalagem. Nada fica escondido em letra miúda.`
  2. `Origem identificada` — `Fabricado por BNT Farma (CNPJ 21.027.384/0001-06) e distribuído pelo CNPJ 63.266.289/0001-05, como impresso no rótulo.`
  3. `Preço na mesa` — `O total dos produtos e o frete aparecem antes do pagamento. Sem assinatura, sem cobrança recorrente, sem taxa escondida.`
  4. `Atendimento que responde` — `Qualquer ocorrência com o pedido é tratada pelo SAC: contato@cowboyenergiamasculina.com.br. Compras pela internet têm direito de arrependimento em 7 dias, pelo Código de Defesa do Consumidor.`
- **O que não prometemos:** `Não prometemos resultado, prazo ou efeito. O COWBOY Energia é um suplemento alimentar, não um medicamento. Se você procura ajuda para sintomas persistentes, converse com um profissional de saúde.`
- **Base:** rótulo (CNPJs), fluxo de checkout (total e frete visíveis), CDC art. 49.
- **Linhas prontas, só após confirmação da operação (não publicadas):** `Lote e validade conferidos antes do envio.` · `Embalagem discreta, sem identificação do conteúdo.` · `Código de rastreio enviado após a postagem.` · Número de processo do rótulo, somente após consulta da situação atual na Anvisa.

### Capítulo 6 — Quem já usa

- **Título:** `DOIS CLIENTES, COM O FRASCO NA MÃO.`
- **Elementos:** dois vídeos (controles nativos, sem autoplay, legendas automáticas identificadas) e dois cartões de relato com o frame do próprio vídeo e trecho literal.
- **Trechos:** vídeo 1: `“Tem duas semanas que eu tô tomando. Tô top demais agora.”` · vídeo 2: `“Segundo frasco já que eu estou indo.”`
- **Nota:** `Trechos transcritos automaticamente dos vídeos, sem revisão por escuta. Experiências individuais, que não representam promessa de resultado.`
- **Base:** `videos/clientes/*.vtt` e `.local/revisao-depoimentos/revisao-audio.md`. Os trechos com "resultado 100%" e "mais eficaz na relação" ficaram fora do texto da página por serem alegações de desempenho sexual que a publicidade de suplementos não pode reproduzir; o áudio dos vídeos foi preservado por decisão do proprietário.

### Capítulo 7 — Entrega

- **Título:** `CALCULE O FRETE ANTES DE DECIDIR.`
- **Texto:** `Informe seu CEP e veja as opções de entrega para o kit selecionado. A consulta não reserva produto nem fecha pedido.`
- **Fatos:** `CEP de origem em Goiânia, GO.` · `Um único pacote para 1 a 4 frascos.` · `O frete final é confirmado no checkout.`
- **Base:** `config/logistics.js` (74475-239, pacote único de 23 × 8 × 8 cm). Se a cotação estiver indisponível, o script mostra a mensagem existente.

### Capítulo 8 — Perguntas

Perguntas de `copy-v2.md` mais duas novas: `Por que os botões de compra ficam só no fim?` (`Porque queremos que você conheça o produto inteiro antes de decidir. Composição, modo de uso e compromisso vêm primeiro.`) e `O modelo 3D é o frasco real?` (`É uma representação construída a partir das fotos do produto. O rótulo real, fotografado, é a referência para qualquer informação.`).

### Capítulo 9 — Escolha seu kit (único bloco com compra)

- **Título:** `AGORA SIM: ESCOLHA O SEU KIT.`
- **Argumento:** `Seu segundo frasco por R$ 30 a mais.`
- **Kits:** `1 frasco — R$ 54,76` · `2 frascos — R$ 84,76 (R$ 42,38 por frasco, economia de R$ 24,76)` · `4 frascos — R$ 169,52 (R$ 42,38 por frasco, economia de R$ 49,52)`. O de 2 vem selecionado com a marca `Em destaque`.
- **Recapitulação:** `Você já conferiu N de 8 capítulos.` com links para os não lidos.
- **CTA:** `Continuar para o pagamento`. Linha auxiliar: `Confira frete, forma de pagamento e total no checkout.`
- **Base:** `config/commerce.js` e catálogo Cartpanda confirmado em 08/09/2026.

### Rodapé

`Suplemento alimentar em gotas. Este produto não é um medicamento. Não exceder a recomendação diária de consumo indicada na embalagem.` · CNPJs do rótulo · SAC · Privacidade · Termos.

## Pendências que continuam fora da página

Razão social e endereço do vendedor; reconciliação de 12 versus 24 gotas; situação atual do processo na Anvisa; rotinas operacionais (conferência, embalagem discreta, rastreio); homologação do frete real e do checkout com quantidade alterada.
