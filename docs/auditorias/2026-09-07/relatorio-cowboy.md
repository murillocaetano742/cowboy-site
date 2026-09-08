# COWBOY Energia — Auditoria da página, produto e oferta

**Data:** 7 de setembro de 2026 · **Projeto:** VS_CODE · **Marca declarada:** Nutrilhealth

**Objetivo:** preparar uma oferta e uma página mais convincentes antes do teste dos 10 criativos informado pelo proprietário. Diretriz incorporada durante a auditoria: comunicação comercial muito agressiva, no posicionamento que o proprietário chama de “nicho black”.

## 1. Parecer executivo

**A estrutura atual precisa de correções antes de receber investimento de teste.** Há uma identidade visual consistente e uma loja com kits e compra direta, mas a apresentação mistura suplemento com tratamento médico, apresenta sinais de demanda simulados, diverge sobre rendimento e condições comerciais e não demonstra uma mensuração completa das vendas.

O maior gargalo identificável nesta auditoria é a **coerência entre o que se promete, o que se comprova e o que se entrega**. Não é possível afirmar que esse seja o maior gargalo real de conversão: faltam visitas, vendas, custos, reembolsos e dados de atendimento. Os problemas de implementação, entretanto, são observáveis nos arquivos.

**Recomendação comercial:** usar a estrutura de compra direta da loja como ponto de partida, construir a mensagem com uma vantagem concreta e revisar todos os benefícios à luz do rótulo. A oferta já contém um argumento forte: **2 frascos custam apenas R$ 20 a mais que 1 frasco**. Isso pode sustentar uma comunicação direta e incisiva sem inventar resultados.

| Dimensão | Parecer | Consequência prática |
| --- | --- | --- |
| Identidade visual | Base aproveitável | Preservar reconhecimento da marca; simplificar a apresentação do produto |
| Produto e rendimento | Não validados; informações conflitantes | Não fechar promessa, dosagem comercial ou duração de kits ainda |
| Promessas | Revisão crítica | Alegações terapêuticas atravessam texto, imagens referenciadas, metadados e depoimentos |
| Oferta | Comparação comercial pouco clara | Mostrar custo total e explicar a vantagem real de cada kit |
| Credibilidade | Problemas confirmados | Remover simulações de compras, estoque e prazo |
| Compra | Dependência frágil de JavaScript | Corrigir links e validar os três checkouts |
| Mensuração | Parcial no código; operação não verificada | Não classificar os criativos por vendas antes de conciliar os eventos com pedidos |
| Conversão atual | Desconhecida | Não há base para prometer um percentual de aumento |

## 2. Fontes e limites da auditoria

Foram lidos integralmente os textos comerciais, scripts e configurações relevantes de `index.html`, `loja.html`, `privacidade.html`, `termos.html`, `vercel.json`, `robots.txt`, `sitemap.xml` e `.gitignore`. O CSS foi inspecionado nos componentes e regras responsivas relevantes. O inventário automatizado está em [inventario.json](inventario.json).

Foram vistas as imagens `Cowboy_imagem_1.png`, `WhatsApp Image 2026-07-17 at 11.50.20.jpeg`, `kit-4-frascos.jpg`, `modo-de-uso.jpg` e `formula-ingredientes.jpg`. A ferramenta não conseguiu exibir `10xMaisPotente.png`; a análise dessa alegação se baseia no nome, no texto alternativo e na referência do HTML. A biblioteca de imagens reconheceu o arquivo como PNG de 2048 × 2048; a falha de exibição da ferramenta não prova defeito do arquivo.

**Não houve navegação visual efetiva da página.** O navegador integrado não apresentou nenhuma instância disponível. A ferramenta de pesquisa não conseguiu obter o conteúdo do domínio principal e de `/loja`; as três URLs Payt também não puderam ser abertas. Isso não prova que o site ou os checkouts estejam fora do ar. Não foram verificados preço final em produção, cálculo por CEP, aprovação de pagamentos, layout renderizado, eventos no gerenciador ou Core Web Vitals.

Os dois vídeos de depoimentos referenciados pela loja e dois MP4 na raiz foram inventariados, mas não assistidos nem transcritos. Os 10 criativos mencionados não foram identificados como um conjunto inequívoco no projeto. Os MP4 da raiz podem ser materiais de origem, mas essa relação não foi confirmada.

**Convenções:** “confirmado” significa observado no arquivo local; “declarado” significa afirmação da página, sem validação do negócio; “hipótese” significa recomendação a testar; “pendente” significa evidência ainda necessária. Ausência de comprovante na pasta não prova inexistência desse comprovante fora dela. A versão local não foi comparada com a versão publicada.

## 3. Inventário do projeto e funil atual

| Item | Informação encontrada | Papel atual |
| --- | --- | --- |
| `index.html` | Cerca de 2.408 palavras de texto do corpo; 13 seções; 3 imagens | Página longa que conduz ao WhatsApp |
| `loja.html` | Cerca de 1.311 palavras; 7 seções; 2 vídeos; 3 opções de kit | Página de compra direta para Payt |
| `privacidade.html` | Política atualizada em 25/07/2026; cita Meta, Google e Cartpanda | Informação sobre dados e terceiros |
| `termos.html` | Diz que o produto não é medicamento; cita Cartpanda e CDC | Condições gerais, sem detalhamento da garantia comercial de 30 dias |
| `vercel.json` | URLs sem extensão; rewrite de `/loja`; cabeçalhos de segurança | Site estático hospedável na Vercel |
| `robots.txt` e `sitemap.xml` | Permitem indexação; sitemap inclui raiz e loja | Descoberta em mecanismos de busca |
| `imagens/` | Fotos/montagens de frascos, kits, composição, uso, garantia e entrega | Material comercial e versões originais/otimizadas |
| `videos/` | Dois MP4 e duas capas de depoimentos | Prova social declarada pela loja |
| `DPJABA.mp4` e `DPTHIAGO.mp4` | Aproximadamente 31,08 MB e 29,44 MB; não referenciados no HTML | Materiais locais não usados diretamente pela página |
| Aplicação | Sem `package.json`, backend, testes ou documentação do produto encontrados | Site simples; checkout e operação vivem fora do repositório |

Os números de palavras são aproximações por análise do HTML, incluindo conteúdos de acordeões. Não medem leitura nem atenção do visitante.

**Caminhos efetivamente descritos no código:**

| Entrada | Sequência | Observação |
| --- | --- | --- |
| Página inicial | CTA do topo → seção CTA → seção WhatsApp → conversa externa | São necessárias três ativações de CTA nesse percurso; nenhuma compra direta é oferecida na raiz |
| Loja | Kit de 1, 2 ou 4 → link Payt correspondente | Caminho comercial mais curto; preços finais externos não verificados |
| Barra fixa da loja | Comprar → kit de 4 | Sempre aponta para 4 frascos; não representa a última intenção do visitante |

A página inicial não contém link para a loja. A loja contém link para o “site institucional”. Assim, quem entra pela raiz pode não descobrir a compra direta. Uma experiência comercial única deve alinhar os destinos, as condições e o vocabulário.

## 4. O que sabemos sobre o produto

| Campo | Declaração encontrada | Verificação necessária |
| --- | --- | --- |
| Nome | COWBOY Energia | Conferir nome exato no rótulo e documento de regularização |
| Categoria | Suplemento alimentar em gotas | O restante da página o apresenta repetidamente como tratamento |
| Apresentação | Frasco de 30 ml | A frente das imagens mostra 30 ml; falta o rótulo completo |
| Marca/empresa | Nutrilhealth | Falta identificar claramente fabricante, titular da regularização e vendedor |
| Composição anunciada | L-Arginina, Taurina, Zinco, Boro, Feno-grego e Vitamina B6 | Não há tabela quantitativa, formas químicas, padronização do extrato ou lista completa de ingredientes |
| Administração anunciada | Sublingual; 12 gotas pela manhã e 12 à noite | Confirmar instrução oficial do fabricante; a auditoria não valida nem recomenda essa dose |
| Rendimento | Raiz: 600 gotas; loja: 15 dias por frasco | São incompatíveis com 24 gotas/dia se os 600 forem corretos |
| Público | Texto dirigido a homens 50+; rodapé da loja indica maiores de 18 | Público de marketing inferido da copy, sem dados de compradores |
| Regularização | “Notificado na ANVISA”, com referência à RDC 243/2018 | Número e situação não apresentados; a norma citada isoladamente não comprova a situação do produto |
| Entrega | Brasil inteiro, embalagem discreta e rastreio | Confirmar abrangência, embalagem real, custo e prazo |
| Atendimento | WhatsApp; raiz promete especialista/doutor e resposta em até 1 hora, segunda a sábado | Confirmar identidade, qualificação profissional, horários e capacidade de atendimento |

**Rendimento:** 600 ÷ 24 = **25 dias**, e não 15. Com essas mesmas premissas, 2 frascos dariam 50 dias e 4 dariam 100. Não substituir as durações publicadas por esses valores sem conferir o rótulo, a dose e o rendimento do gotejador: a conta apenas demonstra o conflito.

A loja chama 4 frascos de “protocolo completo”, com aproximadamente 60 dias, mas apresenta uma evolução até 90 dias. A raiz afirma que não vende frasco avulso e que fazê-lo seria antiético; a loja vende exatamente essa opção. Resolver o conflito retirando a narrativa de protocolo terapêutico e apresentando quantidades e rendimento reais.

Para fechar a nova promessa são necessários: rótulo de todos os lados, tabela nutricional, porção, advertências, alergênicos, fabricante, dados de regularização e correspondência entre produto físico e imagens. Para alegações nutricionais, conferir também ingredientes, quantidades e condições de uso autorizadas. Estudos de um ingrediente não validam automaticamente a eficácia da fórmula comercial ou de sua dose.

## 5. Auditoria das promessas e da confiança

A Anvisa orienta expressamente que suplementos não podem anunciar melhora do desempenho sexual e outras alegações terapêuticas. A descrição atual entra diretamente nessa área. Avisos no rodapé não resolvem o conteúdo da promessa principal. [Anvisa — propaganda de suplementos](https://www.gov.br/anvisa/pt-br/assuntos/alimentos/suplementos-alimentares/cuidado-com-a-propaganda-enganosa/)

| Alegação ou recurso | Evidência local | Diagnóstico e ação |
| --- | --- | --- |
| Tratar disfunção erétil e ejaculação precoce | Raiz: título, hero, ingredientes, FAQ e JSON-LD; loja: título e descrição | Remover a apresentação terapêutica da comunicação do suplemento; revisar todos os locais, inclusive SEO |
| Atacar a causa, restaurar função erétil e equilibrar hormônios | `index.html:948`, `index.html:1097`, `loja.html:504` | Não há estudo do produto ou dose que sustente os resultados; não manter como promessa comercial |
| “94% relatam melhora” | `index.html:961` | Falta estudo, amostra, pergunta, período e método; retirar até haver documentação, sem presumir que ela exista |
| 52%, 1 em 3, 74% e 29% | Blocos de problema, zinco e boro da raiz | Números sem referências rastreáveis; não extrapolar estatísticas para resultados do produto |
| “10x Mais Potente” | `index.html:1410` e texto alternativo | Comparador, medida e evidência ausentes; remover a alegação também do material visual |
| Gotas aproveitam quase 100% e superam cápsulas | `loja.html:512` e quadro comparativo | Via sublingual e biodisponibilidade não são demonstradas pelo simples formato líquido; retirar percentuais e superioridade |
| Analogias com antibiótico e dipirona | `index.html:1350`, `loja.html:512` | Criam uma aparência de tratamento e equivalência farmacológica que o material não sustenta |
| Resultado em 7, 30, 60 e 90 dias | Cronogramas de ambas as páginas | Apresentam evolução previsível de saúde sem prova da fórmula; remover cronograma de efeitos |
| Reduzir ou eliminar medicamentos | Depoimento e FAQ da raiz | Retirar esse apelo comercial; não orientar mudança de tratamento pelo marketing |
| Em geral sem contraindicações com medicação | FAQ das duas páginas | Falta base para liberar compatibilidade; encaminhar avaliação individual a profissional de saúde |
| Doutor/especialista | `index.html:1587` | Não há identificação profissional; usar “equipe de atendimento” se a operação for comercial |
| 812 avaliações e nota 4,9 | `loja.html:86`, `loja.html:335`, seção de avaliações | Sem base auditável no projeto; raiz informa nota 5 e 6 avaliações no schema; reconciliar fontes |
| “Compra verificada” e “Mais vendido” | Avaliações e kit de 4 | Exigem pedidos e critérios de verificação; não manter selo só por estética |
| Compras recentes | `loja.html:669` | Simulação confirmada: lista fixa, seleção aleatória e minutos inventados; remover |
| Estoque baixo | `loja.html:642` | Quantidade aleatória de 30 a 42, reduzida por timer, sem fonte de estoque; remover ou integrar estoque real |
| Oferta acaba em 10 minutos | `loja.html:627` | Contador reinicia automaticamente; não representa encerramento da oferta; remover ou usar prazo real |

A raiz reduz a explicação dos problemas sexuais a deficiências nutricionais e diz que raramente são psicológicos. Essa simplificação não corresponde à diversidade de causas descrita pelo NIDDK, que inclui fatores vasculares, neurológicos, hormonais, medicamentosos, emocionais e de estilo de vida. [NIDDK — causas da disfunção erétil](https://www.niddk.nih.gov/health-information/urologic-diseases/erectile-dysfunction/symptoms-causes)

Os depoimentos em texto têm nomes, idades, profissões e histórias clínicas, mas seus arquivos de origem e autorizações não estão no repositório. Isso é **prova não verificada**, diferente dos popups, cuja simulação está explícita no código. Mesmo um relato autêntico precisa ser revisto quanto à alegação que a publicidade transmite.

Não foi confirmado que o produto seja regular ou irregular. É necessário consultar o número e a identidade corretos; a orientação atual da Anvisa explica a consulta e também contempla a transição regulatória. Não se deve inferir irregularidade apenas pela ausência de um número na página, nem tratar notificação como aprovação de eficácia. [Anvisa — como verificar regularização](https://www.gov.br/anvisa/pt-br/assuntos/alimentos/suplementos-alimentares/como-saber-se-um-suplemento-alimentar-e-autorizado)

**Aplicação da diretriz “black”:** aumentar a clareza da vantagem, a intensidade da abertura, a relevância visual e a objetividade do CTA. A classificação de nicho não é comprovação de benefício nem justificativa para inventar demanda. A nova página deve sustentar a mensagem mesmo quando o comprador confere rótulo, preço, avaliações e atendimento.

## 6. Auditoria comercial e matemática da oferta

Valores abaixo são os declarados no código da loja, sem validação no checkout.

| Kit | Produto | Frete anunciado | Total à vista calculado | Por frasco, sem frete | Por frasco, com frete |
| --- | --- | --- | --- | --- | --- |
| 1 frasco | R$ 89,90 | R$ 25,00 | **R$ 114,90** | R$ 89,90 | R$ 114,90 |
| 2 frascos | R$ 109,90 | R$ 25,00 | **R$ 134,90** | R$ 54,95 | R$ 67,45 |
| 4 frascos | R$ 219,92 | R$ 25,00 | **R$ 244,92** | R$ 54,98 | R$ 61,23 |

**Achados comerciais:**

- Passar de 1 para 2 frascos acrescenta somente R$ 20 ao pedido, dobrando a quantidade. É o argumento comercial mais evidente da tabela atual.
- O kit de 4 não tem o menor preço unitário do produto: custa R$ 0,03 a mais por frasco que o de 2. Com o mesmo frete de R$ 25, ele tem o menor custo por frasco entregue. A distinção deve ficar clara.
- Comparando um pedido de 4 com dois pedidos separados de 2, e cobrando R$ 25 de frete em cada pedido separado, a economia total é R$ 24,88. Isso depende dessa condição de frete, não é uma economia universal.
- A faixa “-40% HOJE” não corresponde exatamente a todos os kits: descontos calculados contra os preços riscados são 40,03%, 38,88% e 38,89%. Melhor mostrar economias específicas e comprovar o preço de referência.
- O valor riscado do kit de 4 é R$ 359,90; quatro unidades ao preço atual de R$ 89,90 somariam R$ 359,60. O preço de referência pode ter outra origem, mas ela não está explicada.
- Os totais finais não aparecem reunidos nos cards. Mostrar produto, frete e total antes da saída para o checkout reduz surpresa.
- “Até 12x” aparece no topo, e “com juros” só fica explícito no FAQ. Conferir parcelas realmente disponíveis, juros e total parcelado; não criar simulações sem a tabela real.

**Condições entre páginas:** a raiz contém R$ 97 e frete gratuito no JSON-LD, embora não exponha um preço de compra no corpo. A loja anuncia preços a partir de R$ 89,90 e frete de R$ 25. A raiz informa devolução de 7 dias no schema e a loja promete garantia comercial de 30 dias. Os dois prazos podem coexistir se distinguirem direitos legais e garantia adicional; hoje a relação e as condições não estão explicadas.

A garantia comercial promete 100% do dinheiro de volta após 30 dias de experiência. Faltam marco inicial, canal de solicitação, prazo de resposta/estorno, condições, tratamento do frete e procedimento de devolução. Ela também é apresentada antes de um cronograma que promete resultados até 90 dias. Resolver a expectativa antes de usar a garantia como argumento central.

## 7. Proposta de oferta e copy com maior força comercial

**Proposta para validação, não alteração de preço publicada.** Enquanto faltarem custos e documentação, manter os valores como referência e usar vantagens que já resultam da comparação. Não acrescentar descontos, bônus com valor inventado, frete grátis ou garantia mais longa sem capacidade econômica para honrá-los.

| Componente | Direção recomendada |
| --- | --- |
| Categoria e produto | COWBOY Energia, suplemento alimentar em gotas, 30 ml por frasco; confirmar embalagem real |
| Promessa comercial | Escolha simples, quantidade explícita, comparação objetiva e condições transparentes |
| Benefício nutricional | A definir apenas após rótulo, doses e alegações permitidas; não substituir cura por sinônimo disfarçado |
| Kit de entrada | 1 frasco; mostrar custo total e rendimento validado |
| Kit principal para testar | 2 frascos; argumento “o dobro por R$ 20 a mais” |
| Kit maior | 4 frascos; enfatizar menor custo por frasco entregue sob a condição de frete vigente |
| Prova | Produto real, rótulo legível, identidade verificável, avaliações rastreáveis e entrega demonstrada |
| Redução de risco | Garantia existente, apenas após formalizar regras e atendimento |
| CTA principal | “Comprar kit de 2 frascos”; atualizar quando outro kit for selecionado |
| Apoio | “Tirar dúvidas sobre a compra”, com horário e canal reais |

**Primeira dobra sugerida — hipótese A, oferta direta:**

> COWBOY Energia · Suplemento alimentar em gotas
>
> **LEVE 2 FRASCOS POR APENAS R$ 20 A MAIS QUE 1.**
>
> Kit com 2 frascos de 30 ml por R$ 109,90 + R$ 25 de frete. Total à vista: R$ 134,90.
>
> **Comprar kit de 2 frascos**
>
> Compare os kits e consulte a composição e as condições de compra.

Esse texto deriva dos valores locais e depende da confirmação de que continuam válidos no checkout. Não deve entrar no ar antes dessa conferência. A comparação deve identificar explicitamente o kit de 1 frasco a R$ 89,90 e a condição de frete igual.

**Hipótese B, valor do kit maior:**

> **4 FRASCOS. MENOR CUSTO POR FRASCO COM O FRETE INCLUÍDO NA CONTA.**
>
> R$ 219,92 + R$ 25 de frete. Total: R$ 244,92 — equivalente a R$ 61,23 por frasco entregue.
>
> **Comprar kit de 4 frascos**

A comparação é restrita aos três kits e ao frete anunciado. Não chamar o kit de “mais vendido” sem dados. O destaque visual entre 2 e 4 frascos é uma hipótese a testar por margem por visitante e CPA, e não só por ticket médio.

**Tom e persuasão:** frases curtas, números legíveis, demonstração do produto, perguntas comerciais respondidas e CTA específico. Retirar frases como “homens voltarem a ser homens”, que associam valor pessoal ao desempenho sexual. A força da mensagem pode vir da vantagem de compra, sem humilhação do público.

**Objeções que a nova página precisa resolver:** o que contém e em que quantidade; quem fabrica e vende; quanto rende; como usar conforme rótulo; qual o total entregue; prazo para o CEP; como funciona a devolução; o que o atendimento consegue resolver. Não inventar consulta médica ou “guia personalizado” se não forem serviços reais e adequadamente prestados.

## 8. Página recomendada e experiência de compra

**Direção:** aproveitar `/loja` como base da experiência comercial. A URL final dos anúncios depende da escolha do proprietário. Alinhar a raiz à mesma verdade de produto e oferta, inclusive metadados.

| Ordem | Bloco | Conteúdo necessário e objetivo |
| --- | --- | --- |
| 1 | Produto e oferta principal | Nome, categoria, imagem real, quantidade, comparação clara, total e CTA visíveis cedo no celular |
| 2 | Escolha de kit | 1, 2 e 4 frascos; preço unitário consistente, total, rendimento confirmado e seleção inequívoca |
| 3 | O que será entregue | Fotos da embalagem, volume, lacre, lista do conteúdo do pedido e eventual material adicional real |
| 4 | Composição e uso | Rótulo completo ampliável, tabela, porção, advertências e alegações autorizadas aplicáveis |
| 5 | Evidência de confiança | Identidade do fornecedor, regularização verificável, avaliações documentadas e demonstração de entrega |
| 6 | Entrega, atendimento e garantia | Prazos, frete, rastreio, discrição comprovada, horários e procedimento de devolução |
| 7 | FAQ comercial | Respostas objetivas às dúvidas anteriores; saúde individual encaminhada a profissional |
| 8 | Retomada da oferta | Mesmo kit selecionado, preço e condições; nenhuma nova promessa no final |
| 9 | Rodapé | Vendedor, identificação fiscal, endereços/contatos, privacidade e termos funcionais |

O site atual usa preto, dourado e tipografia Oswald/Inter. É uma base visual reconhecível, mas os materiais vistos privilegiam brilho, reflexos, partículas e cenários ilustrados. Introduzir fotos fiéis do frasco e rótulo para equilibrar apresentação e prova. As imagens de composição não substituem uma tabela nutricional: minerais, sementes e raízes ilustrados podem sugerir uma composição que precisa ser conferida.

Na frente de algumas imagens aparece texto de “colorido artificialmente”, com repetição/pequenas variações visuais. Conferir a arte oficial antes de afirmar que o produto é inteiramente natural. Os arquivos vistos não permitem ler um rótulo traseiro completo nem validar os ingredientes.

**Prioridades de usabilidade identificadas pelo código:**

- No celular, a raiz move o frasco para antes do texto e mantém grande espaçamento superior. A loja também coloca galeria antes da buybox. Hipótese: a oferta demora a aparecer. Reorganizar a primeira dobra e validar em 360, 390, 412 e 768 px; não há medição visual nesta auditoria.
- Cards de oferta conservam três colunas no celular; preço, imagem e texto podem competir por espaço. Simplificar para quantidade/preço e linha de detalhe, com CTA amplo.
- FAQ usa `div` clicável sem botão, estado expandido ou navegação por teclado. Galeria usa imagens com `onclick`. Substituir por controles semânticos e foco visível.
- O bloqueio de seleção, cópia, impressão e menu de contexto impede ações úteis, inclusive guardar condições. Retirar essa interferência.
- A barra fixa sempre vende 4 frascos; deve refletir uma seleção explícita ou dizer claramente que é uma oferta específica.
- Popups de vendas ocupam espaço fixo próximo à barra de compra. Remover a simulação também simplifica o celular.
- Respeitar preferência por movimento reduzido e testar zoom de 200%, navegação por teclado, legibilidade de frete e informações legais.

## 9. Auditoria técnica, carregamento e SEO

| Achado confirmado no código | Efeito provável / ação |
| --- | --- |
| Quatro links de rodapé da raiz usam `href="#"` | Privacidade, termos e contatos não abrem o destino correto; apontar aos arquivos/canais existentes |
| O manipulador de âncoras executa `querySelector('#')` para esses links | Seletor inválido gera exceção no clique; proteger âncora vazia e corrigir links |
| Os quatro CTAs de kit começam com `href="#"` | Sem JS funcional, não levam à compra; escrever URLs reais no próprio HTML |
| O script de contador acessa `localStorage` sem proteção antes de configurar links | Se esse acesso lançar erro, o restante do mesmo script, incluindo ligação dos checkouts, não executa; desacoplar compra de efeitos e armazenamento |
| Sem `loading="lazy"` nas imagens | Imagens inferiores não têm adiamento explícito; aplicar carregamento tardio apenas fora do topo |
| Imagens comerciais sem dimensões HTML explícitas | Reservar proporções para reduzir deslocamentos; medir efeito real em produção |
| Raiz referencia 9.940.349 bytes de imagens únicas | Aproximadamente 9,94 MB em arquivos locais; banner de 7,51 MB representa cerca de 75,5% desse total |
| Loja referencia 1.887.678 bytes de imagens/capas únicas | Aproximadamente 1,89 MB; há otimização JPEG útil, mas sem carregamento tardio |
| Vídeos com `preload="none"`, `controls`, `playsinline` | Boa base para evitar baixar tudo antes da reprodução; faltam legendas no HTML |
| Fontes externas e imagens com animação/filtros | Avaliar custo no dispositivo; não há evidência medida de lentidão da fonte ou animação |
| JSON-LD de produto e FAQ contém promessas/preços divergentes | Sincronizar dados públicos com a oferta real e remover resultados não documentados |
| FAQ no schema da raiz não corresponde às perguntas visíveis | Alinhar conteúdo estruturado ao que a pessoa consegue ler |
| Sem backend ou fonte única de oferta | Preços, garantias e provas estão repetidos; consolidar configuração comercial para evitar divergências |

A soma em bytes **não é medição de transferência, velocidade ou PageSpeed**; cache, compressão e comportamento do navegador não foram medidos. Todos os caminhos locais de mídia referenciados no HTML foram encontrados. Isso não confirma a publicação desses arquivos na Vercel.

O projeto já possui `lang="pt-BR"`, viewport, um H1 em cada página, canonical, metadados sociais e cabeçalhos como HSTS, proteção contra interpretação de MIME e política de referência. Esses itens são aproveitáveis, mas a configuração local não comprova que os cabeçalhos estejam ativos em produção.

Metas técnicas para validar posteriormente: LCP até 2,5 s, INP até 200 ms e CLS até 0,1 no percentil 75. São referências de experiência, não resultados obtidos nesta auditoria. [Google/web.dev — Core Web Vitals](https://web.dev/articles/defining-core-web-vitals-thresholds)

Evitar uma migração de framework só para reorganizar essa página. O HTML estático pode atender ao objetivo com uma fonte comercial consistente, mídia otimizada, controles acessíveis e links resilientes.

## 10. Mensuração, atribuição e privacidade

| Item | Situação encontrada | Ação |
| --- | --- | --- |
| Pixel Meta na raiz | Não encontrado nos scripts locais | Se a raiz receber tráfego, definir e validar medição apropriada ao funil |
| Pixel Meta na loja | Inicialização, PageView, ViewContent e AddToCart presentes | Confirmar conta, recepção, permissões e semântica em ambiente de teste |
| Google Analytics | `G-XXXXXXXXXX` é placeholder | Configurar ID real ou retirar script inutilizado |
| Clique de compra | Registrado como AddToCart, embora leve diretamente ao checkout | Distinguir clique de saída e início real do checkout; não chamar clique de compra aprovada |
| ViewContent | Usa SKU genérico de 30 ml com valor de R$ 109,90 | Alinhar o objeto visto ao kit ou não atribuir valor arbitrário a um produto genérico |
| UTMs e outros IDs | URL final é composta da base Payt mais `event_id` | Não há encaminhamento explícito das UTMs; validar integração e suporte do checkout |
| Identificador de usuário | UUID local e `_fbc` criados no código | Não confundir existência de identificador com correspondência validada entre domínios |
| `_fbc` | Só criado se ainda não existir | Um clique posterior pode não atualizar a atribuição como esperado; conferir fluxo suportado |
| Compra/Purchase e CAPI | Não demonstrados; comentário remete a Cartpanda, mas links são Payt | Confirmar integração real e conciliar pedidos aprovados |
| Consentimento | Pixel e identificadores iniciam antes de qualquer escolha de preferência no código | Mapear bases legais e implementar controle adequado por finalidade |

Anexar `event_id` ao checkout não prova deduplicação ou CAPI. Também não há prova de que a Payt leia esse parâmetro. O código não transmite explicitamente UTMs, `gclid` ou o identificador local ao checkout; outras integrações externas podem existir, mas não foram observadas. O acesso de leitura realizado nesta auditoria não incluiu cookies ou identificadores reais de visitantes.

**Contrato de medição recomendado:** uma sessão de origem identificável; evento de escolha/clique por kit; início efetivo no checkout; pedido aprovado com ID único, moeda e valor; reembolso e cancelamento conciliados. No GA4, usar os eventos de e-commerce de acordo com a ação real e incluir `transaction_id` em compras. [Google Analytics — e-commerce](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)

Para Meta, confirmar os eventos permitidos e as restrições aplicáveis à conta/categoria antes de implementar. A página oficial de políticas consultada retornou limitação de acesso; **não houve validação das regras atuais de elegibilidade da conta**. Não contornar restrições de mensuração mudando nomes para disfarçar saúde ou enviando informações sensíveis em parâmetros, UTMs ou URLs.

**Privacidade:** a política diz que não coleta dados pessoais diretamente, mas descreve cookies e navegação e omite a explicação do identificador persistente criado pela loja. Cita Cartpanda, enquanto os links são Payt. Deve identificar o responsável, os terceiros reais, finalidades, retenção e formas de exercer direitos. A ANPD recomenda opção fácil para rejeitar cookies não necessários e mecanismos de gerenciamento; a base legal deve ser definida por finalidade. [ANPD — orientação sobre cookies](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf)

## 11. Fornecedor, garantia e atendimento

Nos quatro HTML não foram encontrados CNPJ/CPF do fornecedor, endereço físico nem contato eletrônico claramente identificado além do WhatsApp. O nome Nutrilhealth, isoladamente, não esclarece quem fabrica, quem vende e quem responde pela garantia. A legislação de comércio eletrônico prevê identificação do fornecedor, contatos, características essenciais e condições completas da oferta. [Decreto 7.962/2013 — arts. 2º, 4º e 5º](https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/decreto/d7962.htm)

Preparar uma política operacional que responda: quando começa a garantia; quem recebe o pedido; qual documentação comercial basta; quem orienta a devolução; como é confirmado o atendimento; como e em quanto tempo ocorre o estorno. Conferir o tratamento das despesas e os direitos aplicáveis com responsável jurídico. Não usar a garantia adicional para restringir direitos legais.

Substituir referências antigas a Cartpanda após confirmar o processador real. Definir a função do WhatsApp: dúvidas sobre produto/compra, acompanhamento e pós-venda. Se não houver atendimento médico, retirar “Doutor”. Se houver, identificar corretamente o serviço e a qualificação e revisar a comunicação profissional.

## 12. Plano para os 10 criativos

**Estado:** 10 peças informadas pelo proprietário; arquivos individuais, canais, duração, promessas e destinos não confirmados. A [matriz-10-criativos.csv](matriz-10-criativos.csv) contém C01 a C10 como posições de inventário, todas pendentes. Não são classificações das peças existentes.

**Antes do teste:** registrar arquivo/versão, primeiro gancho, promessa literal, prova usada, oferta, CTA, destino, formato e autorização de uso de imagem/voz. Assistir cada vídeo inteiro: promessa pode estar na fala, legenda, tela final ou imagem, mesmo que não apareça no texto do anúncio. Comparar essas informações com a página e o checkout.

**Ângulos possíveis para classificar ou adaptar as peças, sem afirmar que já existem:**

| Ângulo | Mensagem possível, sujeita à validação | Prova necessária |
| --- | --- | --- |
| Comparação de kits | 2 frascos por R$ 20 a mais que 1 | Preço ativo e mesma condição de frete |
| Economia entregue | Menor custo por frasco no pedido de 4 | Cálculo visível e frete aplicável |
| Demonstração do produto | Mostrar exatamente o frasco e a apresentação | Produto físico e rótulo fiel |
| Transparência da fórmula | Composição legível e porção clara | Tabela e rótulo oficiais |
| Experiência de compra | Embalagem discreta, rastreio e atendimento | Operação real e demonstração autorizada |

Nenhum desses ângulos valida uma promessa de desempenho sexual. Se os criativos atuais dependerem dessa promessa, precisam de revisão substancial antes de servir de teste da nova oferta.

**Desenho recomendado:**

1. Corrigir os problemas críticos e estabelecer uma versão base da página, oferta e medição.
2. Fazer triagem das 10 peças por clareza, prova, congruência e qualidade técnica. Isso é avaliação editorial, não previsão de CPA.
3. Definir verba total, perda máxima aceitável, período, evento, CPA máximo e critérios de decisão antes de ativar campanhas.
4. Testar criativos mantendo página, preço e condições estáveis. Quando os recursos permitirem, usar comparação controlada. A entrega otimizada comum distribui verba de forma desigual e não é um A/B puro.
5. Se a verba não sustentar 10 peças, trabalhar com lotes menores. Comparações entre lotes em datas diferentes serão direcionais, sujeitas a sazonalidade e leilão; não declarar vencedor causal entre períodos diferentes.
6. Escolher candidatos por compras aprovadas, CPA e margem. CTR e retenção ajudam a diagnosticar o gancho, mas não substituem venda.
7. Depois de selecionar criativos promissores, testar destaque do kit de 2 versus 4 com preços estáveis; só depois testar nova condição comercial ou estrutura maior.

**Não recomendo fixar orçamento diário agora:** faltam custo do produto, taxas, logística, tributação, comissão, reembolso e verba disponível. Tampouco há uma taxa de conversão conhecida para calcular amostra.

**Ficha obrigatória de cada experimento:** hipótese; controle e variação; métrica primária; baseline; melhoria mínima relevante; amostra/janela; limite de gasto; guardrails; decisão prevista. Não encerrar no primeiro dia favorável. Janela de leitura deve cobrir comportamento semanal e atraso de conversão relevante; uma semana isolada não garante conclusão.

## 13. Métricas de negócio e critérios de decisão

| Métrica | Definição operacional |
| --- | --- |
| Conversão da página | Pedidos aprovados atribuíveis ÷ sessões elegíveis da página, na mesma janela e regra de atribuição |
| Taxa de saída para checkout | Sessões que clicam para checkout ÷ sessões elegíveis; evitar contagem de cliques repetidos como pessoas |
| Conversão do checkout | Pedidos aprovados ÷ sessões que iniciam checkout, conciliando os domínios |
| CPA de mídia | Gasto de mídia ÷ pedidos aprovados atribuídos |
| Receita por sessão | Receita definida e conciliada ÷ sessões elegíveis |
| Margem por sessão | Contribuição após custos variáveis e mídia ÷ sessões elegíveis |
| Reembolso/cancelamento | Pedidos e valores devolvidos/cancelados, por coorte de compra |
| Qualidade do atendimento | Tempo de resposta, motivos de dúvida, reclamações e resolução |

**CPA de equilíbrio = receita efetivamente recebida por pedido − todos os custos variáveis esperados desse pedido antes da mídia.** Incluir produto, frete efetivo, embalagem, taxas, tributos, comissões, logística de devolução e perdas/reembolsos, evitando contar a mesma dedução duas vezes. O CPA alvo precisa ser menor que o equilíbrio para preservar margem desejada.

O kit que mais converte não é automaticamente o que mais contribui para o resultado. Comparar também mix, margem, reembolso e suporte. Sem esses dados, escolher o kit de 2 como principal é uma **hipótese comercial fundamentada na comparação de preços**, não uma oferta validada.

Para calcular amostra, primeiro medir um baseline confiável e definir a menor diferença que justificaria a mudança. Não foi calculada significância, projeção de ROAS ou aumento esperado de conversão nesta auditoria.

## 14. Backlog priorizado para a próxima implementação

**P0:** resolver antes de investir em novos testes. **P1:** construir a versão base de conversão. **P2:** otimizar com evidência. Responsáveis abaixo são funções sugeridas, não pessoas já designadas.

| Prioridade | Trabalho | Responsável sugerido | Critério de pronto |
| --- | --- | --- | --- |
| P0 | Confirmar rótulo, composição, rendimento e regularização | Proprietário + fabricante/responsável técnico | Documentação vinculada ao produto exato; divergência 15/25 dias resolvida |
| P0 | Reescrever promessas em página, SEO, FAQ, imagens e vídeos | Copy + responsável técnico | Nenhuma alegação terapêutica ou superioridade não sustentada no suplemento |
| P0 | Remover compras, estoque e prazo simulados | Desenvolvimento | Nenhum dado de demanda criado por lista/timer/aleatoriedade |
| P0 | Verificar avaliações e selos | Proprietário + atendimento | Origem e autorização documentadas ou elemento retirado |
| P0 | Conferir três checkouts, preços, fretes e garantia | Operação + QA | Oferta da página corresponde ao checkout em todos os kits |
| P0 | Tornar compra independente de efeitos e armazenamento | Desenvolvimento | Links reais no HTML; falha de scripts opcionais não bloqueia compra |
| P0 | Fechar mensuração mínima e privacidade | Analytics + responsável por dados | Evento permitido, atribuição e compra aprovada conciliados sem duplicidade |
| P0 | Identificar fornecedor e formalizar condições | Proprietário + responsável jurídico | Dados e políticas claros, coerentes e acessíveis |
| P1 | Consolidar experiência comercial raiz/loja | Copy + desenvolvimento | Mesma oferta, categoria, condições e contatos |
| P1 | Montar primeira dobra e seleção de kits | Design + desenvolvimento | Oferta legível cedo, total claro, CTA correspondente ao kit |
| P1 | Otimizar mídia e acessibilidade | Desenvolvimento + QA | Imagens adequadas, controles por teclado, zoom e celular verificados |
| P1 | Auditar os 10 criativos integralmente | Criação + mídia | Matriz preenchida e congruência verificada com página/checkout |
| P1 | Calcular margem e aprovar ficha de teste | Financeiro + mídia | CPA máximo, verba, janela e parada definidos |
| P2 | Testar kit destacado, copy e disposição | Mídia + analytics | Resultado documentado com incerteza e guardrails |

**Ordem de execução sugerida:** documentação e verdade comercial → correções críticas → página base → verificação em celular e checkout → conciliação de eventos → teste de criativos → experimentos de oferta. Cada etapa depende de sua evidência; não foi prometido prazo fixo sem conhecer as respostas do fabricante e do proprietário.

## 15. Pendências que destravam a reconstrução

- URL que receberá tráfego e localização dos 10 criativos.
- Rótulo completo, dose, rendimento, fabricante e comprovação de regularização aplicável.
- Preços efetivos, regras de frete, parcelamento e política operacional da garantia.
- Custos variáveis por kit, verba disponível e histórico de pedidos/reembolsos.
- Documentos de avaliações e depoimentos; confirmação de quem atende no WhatsApp.
- Acesso operacional a navegação de teste, checkout, analytics e eventos, pelos canais oficiais apropriados.

As duas perguntas de levantamento foram apresentadas durante a auditoria. Até a finalização deste documento, a informação adicional recebida foi a preferência por agressividade comercial; os dados acima continuam pendentes.

## 16. Entrega e verificação

Relatório baseado em evidências locais, cálculo de kits e consulta a fontes primárias. O inventário validou a presença dos arquivos de mídia referenciados e registrou estrutura e peso. Passaram na conferência sintática 8 scripts JavaScript e 3 blocos JSON-LD. Essa conferência não executa a página nem confirma seu comportamento no navegador.

O documento HTML contém 16 seções e 13 tabelas. Foram conferidos os links locais e as âncoras do relatório, a codificação dos arquivos e as 10 linhas de criativos com 17 colunas. O Git não indicou mudanças nos arquivos de produção existentes.

**Nenhum arquivo de produção foi alterado, nenhuma publicação ou campanha foi realizada e nenhuma compra foi enviada.** A mudança feita no workspace é a documentação desta auditoria, seus anexos e o registro da story AUD-001. O próximo trabalho é a implementação das correções priorizadas, orientada pelos dados comerciais e do produto que ainda precisam ser confirmados.
