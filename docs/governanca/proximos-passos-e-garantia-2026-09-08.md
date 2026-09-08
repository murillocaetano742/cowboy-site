# Próximos passos e proposta de garantia — COWBOY Energia

Data: 08/09/2026. Documento de trabalho; nenhuma minuta abaixo foi publicada ou adotada como política da loja.

## Direção do trabalho

O proprietário quer decidir a identidade visual e o texto comercial. Antes de outra implementação estética, a equipe deve recuperar a página anterior como referência e apresentar mudanças concretas por bloco. A escolha da direção comercial pertence ao proprietário. As APIs, os cálculos, os links de checkout, os vídeos e a estrutura de rastreamento já construídos podem ser reaproveitados.

A preocupação expressa com garantia é transmitir confiança em uma boa compra e na qualidade do produto. Uma garantia de sete dias não responde, por si só, a esse objetivo. A proposta deve mostrar o que a loja entrega, como confere o produto e como resolve problemas reais.

## Estado confirmado e referências

- Produto: COWBOY Energia, suplemento alimentar em gotas, frasco de 30 mL. Os fatos foram transcritos das fotografias do rótulo; isso não equivale a laudo laboratorial.
- Porção declarada: 12 gotas/1 mL. Composição registrada por porção: taurina 50 mg, arginina 50 mg, feno-grego 300 mg, vitamina B6 3 mg, zinco 1,7 mg e boro 1,1 mg. A indicação de 24 gotas relatada pelo proprietário ainda precisa ser conciliada com o rótulo antes de virar orientação geral ou duração dos kits.
- Oferta implementada e confirmada no catálogo Cartpanda: 1 frasco por R$ 54,76; 2 por R$ 84,76; 4 por R$ 169,52. A partir de dois, o preço pretendido é R$ 42,38 por frasco. Falta confirmar a regra quando o comprador altera a quantidade no checkout.
- Logística informada: origem 74475-239; pacote de 23 × 8 × 8 cm e 0,5 kg para até quatro frascos. Cotação e cobrança reais ainda precisam ser conciliadas.
- Os dois vídeos já estão incluídos na página local. O proprietário declarou que são clientes que tiveram resultados; essa declaração substituiu a pendência anterior de procedência declarada. Não permanece uma exigência documental genérica para impedir essa inclusão.
- Os derivados preservam integralmente as trilhas de áudio, comprovado por hashes iguais aos originais; os arquivos originais permanecem intactos. Os elementos gráficos com selo e estatística foram retirados. Os players oferecem legendas automáticas, identificadas como tais.
- O fechamento informado da inclusão registra 22 testes aprovados e build com 20 arquivos. O marco intermediário da story ainda menciona 18 arquivos, anterior ao fechamento com as duas legendas. Esses resultados são locais; não comprovam pagamento, entrega ou publicação em produção.
- Não há comprovação de publicação da nova versão em produção. A disponibilidade contínua do servidor local também não é garantida.

Referências: `docs/produto/product-facts.json`, `docs/integracoes/checkpoint-2026-09-08.md`, `docs/stories/REBUILD-008-depoimentos-de-clientes.md` e `.local/revisao-depoimentos/revisao-audio.md`. Documentos antigos que ainda chamam os vídeos de pendentes devem ser lidos à luz da declaração e da entrega posterior acima.

## Ordem de conclusão

Os nomes abaixo indicam funções de execução e revisão, sem afirmar que exista uma operação autônoma permanente ativa.

| Ordem | Entrega | Executa / revisa | Condição concreta de conclusão | Dependência |
|---|---|---|---|---|
| 1 | Recuperar a referência anterior e alinhar direção | Desenvolvimento recupera; coordenação apresenta; proprietário decide | Primeira dobra e tom de venda escolhidos a partir de uma prévia concreta, com mudanças desejadas registradas | Decisão comercial/visual do proprietário; recuperação dos arquivos já autorizada |
| 2 | Definir o compromisso de qualidade e atendimento | Coordenação redige; proprietário define o compromisso; operação confirma capacidade de cumpri-lo | Texto escolhido com condições, canal, responsável e procedimento preenchidos | Decisão comercial; não há política nova presumida |
| 3 | Completar dados objetivos do vendedor e do produto | Operação reúne; revisão técnica confere | Identificação e contato corretos; orientação de uso reconciliada caso seja publicada; sem duração de kit inferida | Dados verdadeiros do proprietário/responsável; leitura já autorizada |
| 4 | Adaptar a página por blocos | Desenvolvimento implementa; revisão visual verifica; proprietário orienta a direção | Blocos correspondem à direção escolhida; vídeos, preços e botões preservados e legíveis no celular | Decisões 1–2; execução técnica já autorizada |
| 5 | Fechar kits e total no checkout | Operação de contas configura; QA verifica | Quantidade selecionada entrega o número correto de frascos e preço; alteração de quantidade não quebra a oferta | Acesso Cartpanda já autorizado; decidir regra comercial apenas se houver mudança da oferta |
| 6 | Concluir frete real | Operação de contas configura Melhor Envio; desenvolvimento ajusta contrato se necessário; QA confere | Cotações reais para CEPs de teste; embalagem e total iguais na página e no checkout | Acesso/credenciais oficiais já autorizados; etapa 5 |
| 7 | Conciliar compra e rastreamento | Operação e desenvolvimento integram; QA acompanha | Pedido de teste identificado; estado do pagamento, valor, frete e origem conciliados; evento de compra sem duplicidade | Etapas 5–6; acesso UTMify já autorizado; usar ambiente de teste quando disponível |
| 8 | Revisar e publicar a versão final | QA verifica; DevOps publica; proprietário já orientou os blocos | Celular e desktop conferidos; links e mídias íntegros; preview revisado; domínio final responde e fluxo comercial funciona | Acesso Vercel/domínio já autorizado; etapas 3–7 |
| 9 | Concluir presença no Google | Operação configura; QA confere | Propriedade verificada, sitemap da versão publicada enviado e medição com identificadores reais testada | Acesso Google já autorizado; etapa 8 para sitemap definitivo |
| 10 | Validar criativos e iniciar medição comercial | Criação organiza; tráfego revisa oferta/destino; proprietário orienta tom | Dez arquivos corretos identificados; anúncio e página coerentes; plano de medição de conversão, custo e margem pronto | Materiais ainda não localizados; direção comercial definida; gasto/campanhas dependem do escopo e orçamento efetivamente autorizados |

Enquanto o proprietário orienta os blocos, a equipe pode continuar diagnóstico de acesso, conferência dos contratos de API, correções técnicas e preparação dos testes já autorizados. Um bloqueio de ferramenta ou credencial deve ser apresentado com a ação exata necessária; ele não cria uma nova exigência de autorização comercial. A publicação continua dentro do escopo autorizado, depois de concluída a direção visual pedida pelo proprietário e a verificação técnica.

## Como orientar a página sem refazer tudo

1. **Primeira dobra:** apresentar uma única prévia baseada na referência anterior, com imagem, título, argumento central e botão. O proprietário aponta o que preservar e o que mudar. Só então aplicar essa direção ao restante.
2. **Oferta:** mostrar kits, preços, economia e frete. Conferir clareza da escolha e coerência do argumento “seu segundo frasco por R$ 30 a mais”.
3. **Prova e garantia:** mostrar os dois depoimentos e a minuta escolhida no contexto real da página. O proprietário define o tom e o compromisso comercial que consegue cumprir.
4. **Restante:** ajustar composição, uso, perguntas frequentes, atendimento e rodapé para a mesma identidade; concluir leitura e navegação no celular.

A revisão pede decisões de aparência e posicionamento. Ajustes de responsividade, acessibilidade, carregamento, cálculo, integração e erros continuam sendo executados dentro da autorização existente. Registrar decisões em poucas linhas na story é suficiente; não instalar outro painel ou sistema de governança.

## Três minutas comerciais para o proprietário escolher

### MINUTA 1 — Segurança de compra

**SEU PEDIDO TEM O NOSSO COMPROMISSO.**

“Kit escolhido, valor total conferido e pedido acompanhado até a entrega. Precisou de suporte? A equipe COWBOY responde pelo seu atendimento.”

**O que precisa estar funcionando antes de publicar:** total de produto e frete exibido corretamente; confirmação do pedido; acesso ao acompanhamento; canal real de atendimento com responsável. Preencher canal e horário. A minuta não afirma proteção infalível contra fraude nem aprovação garantida do pagamento.

### MINUTA 2 — Compromisso de qualidade

**COMPROMISSO COWBOY DE QUALIDADE.**

“A nossa responsabilidade acompanha cada frasco: integridade, lote e validade conferidos antes do envio. Seu pedido chegou avariado ou diferente do que comprou? A COWBOY assume a solução com [troca ou outra medida definida pelo proprietário].”

**Condições a decidir e executar:** instituir de fato a conferência antes do despacho; definir canal para ocorrências, prazo de resposta, procedimento de substituição ou outra solução e responsabilidade pelos custos. A conferência operacional pode ser registrada por pedido. Não apresentar essa rotina como certificação, laudo ou prova de eficácia. Não publicar a frase “conferimos” antes de a rotina existir.

### MINUTA 3 — Satisfação comercial opcional

**EXPERIMENTE COM GARANTIA DE SATISFAÇÃO.**

“Compre COWBOY com uma garantia de satisfação: se não ficar satisfeito, você conta com [solução escolhida] dentro de [prazo definido], conforme as condições da garantia.”

**Título e texto são uma proposta opcional para escolha do proprietário.** Só podem ser publicados se ele decidir oferecer essa garantia e preencher as condições. A pergunta sobre compromisso de qualidade/respaldo ou satisfação adicional ainda aguarda resposta; nenhuma opção foi adotada pela coordenação.

**Campos que permanecem em aberto:** solução oferecida; prazo e marco inicial; elegibilidade de frasco aberto; limite por pedido; fretes; canal; prazo de resposta e forma de execução. Escolher condições viáveis e publicar a política completa antes de anunciar essa garantia. Não existe aqui uma promessa adotada de reembolso, resultado, prazo de uso ou satisfação universal. A garantia opcional não deve ser apresentada como substituta dos direitos aplicáveis à compra.

## Distinção prática para a escolha

- **Segurança de compra** vem de preço claro, checkout funcionando, confirmação, acompanhamento e atendimento acessível.
- **Qualidade verificável** vem de dados corretos do produto e rotinas reais de conservação, conferência, embalagem e tratamento de ocorrências.
- **Satisfação opcional** é uma condição comercial adicional que o proprietário pode assumir, com custo e operação definidos.

A proposta inicial mais simples é combinar as minutas 1 e 2 depois de cumprir seus requisitos. A minuta 3 fica como escolha comercial, sem transformá-la automaticamente em promessa de devolução ou de resultado sexual. Relatos pessoais dos clientes permanecem apresentados como depoimentos individuais.

