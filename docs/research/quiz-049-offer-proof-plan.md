# QUIZ-049 — Oferta e depoimentos conforme as referências

Contrato de 14/10/2026. Atualizar somente a v5 existente, mantendo as oito rotas, as versões anteriores e a sequência 18 resultado → 19 VSL → 20 depoimentos → 21 oferta. O proprietário forneceu três screenshots: kits às 10:47:15, carrossel/selos às 10:49:13 e apresentação dos depoimentos às 10:51:32.

## Direção visual

Reproduzir a organização compacta do seletor legado: três cartões verticais com miniatura à esquerda, quantidade e badge no topo, descrição, frete, economia e preço diário à direita. Fundo branco, seleção com vermelho e preenchimento claro, bordas arredondadas. Usar a tipografia existente Oswald nos destaques e Manrope no corpo, com vermelho `#bd171d`/`#8f1117`, branco, rosa claro `#fff3f3` e verde `#1f7a45` na economia. Não acrescentar identidade visual ou mídia nova.

A etapa 21 conserva redline de intensidade declarada, apresentação, composição e o acesso aos kits. No lugar dos cartões atuais, usar o layout de referência; abaixo, manter o parcelamento destacado. Em seguida, inserir carrossel de produto e quatro selos: Checkout Seguro, Teste de 30 Dias, Envio Discreto e Frete Grátis 2+ Frascos. Depois permanecem garantia, dúvidas e rodapé. O checkout continua sendo uma única ação flutuante, vinculada ao kit selecionado.

O carrossel reutiliza `kit-2.webp`, `caixa-discreta.webp`, `casal-cumplicidade.webp` e `kit-3.webp`. Navegação manual por controles e toque, acessível por teclado, sem temporizador automático. Legendas descrevem produto, embalagem, garantia e valores; não prometer resultado sexual. O teste de 30 dias permanece ligado às condições de garantia existentes.

## Preços e economia

Preservar os preços comerciais: 3 frascos R$ 199,90, 2 frascos R$ 154,80 e 1 frasco R$ 79,90, com frete de R$ 26,75 apenas no kit de 1. Parcelas, total com juros, preços diários, atribuição e checkout não mudam.

Os valores de economia legados mostrados na referência não correspondem aos preços atuais. Na v5, comparar somente o valor dos produtos ao preço de R$ 79,90 por frasco avulso: `3 × 79,90 − 199,90 = 39,80` e `2 × 79,90 − 154,80 = 5,00`. Explicitar essa base, sem incluir frete na economia. O proprietário foi informado desse ajuste. Não alterar os dados legados usados por v1–v4.

O badge do kit de 3 indica “Melhor preço”; o de 2 mantém “Teste completo”. A quantidade selecionada não é prescrição derivada do resultado. O link flutuante informa o kit atual e conserva o handler, linker e callback limitado existentes.

## Depoimentos

Na etapa 20, substituir a abertura pela referência enviada:

- Cinco estrelas decorativas e “4,8 de 1.836 AVALIAÇÕES.”
- “+38 MIL HOMENS JÁ ESCOLHERAM O COWBOY”.
- “Dois gravaram o próprio vídeo. Outros mandaram a foto com o frasco na mão.”

Usar `RATING`, `REVIEWS` e `CUSTOMERS` de `quiz-offer-data.ts`, já declarados pelo proprietário em 05/10/2026 e reafirmados pela referência atual. Esta entrega não representa uma auditoria independente dos números. Não adicionar estatísticas, depoimentos ou avaliações. Preservar os dois vídeos e as seis fotos, além da pausa ao sair da etapa. A v4 conserva sua abertura anterior.

## Medição, validação e publicação

Manter os eventos existentes de visita, exposição real dos depoimentos e kits, seleção de kit e início de checkout. O carrossel é conteúdo da oferta; não deve gerar seleção de kit, compra ou respostas. Os valores pessoais continuam somente em memória. Não alterar SDKs, consentimento, GPC, opt-out, sanitização, links científicos ou fluxo da VSL.

Reutilizar os testes pertinentes para conferir três kits, preços, frete, economia, parcelamento, carrossel por teclado/toque, selos, abertura dos depoimentos, botões fixos, zoom, mobile e desktop. Conservar verificações das versões anteriores e fazer smoke público com coleta/checkout isolados. Publicação por @devops após GO root/QA, com rollback 048 preservado e encerramento do servidor 4419.

Status e evidências: [story QUIZ-049](../stories/QUIZ-049-oferta-depoimentos-v5.md).
