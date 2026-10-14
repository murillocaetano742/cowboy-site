# QUIZ-046 — Versão paralela com resultado, apresentação e oferta

Plano de execução de 13/10/2026. Referência: jornada fornecida pelo proprietário; adaptar ao COWBOY, sem copiar exemplos de metabolismo, taxa de captura, quantidade de perguntas ou duração de vídeo.

## Decisão central

Criar uma v4 independente em `/quiz/v4-jornada/`, com a capa e o questionário em `/quiz/v4-jornada/quiz/`. Preservar v1, v2 e a v3 publicada em `f8b977144e70e553dc8e94e67515cd653d0c1ab5`.

Fluxo: anúncio → capa → perguntas e telas editoriais → resultado na etapa 18 → tela da VSL → página visual de oferta → checkout.

As três telas finais pertencem à mesma aplicação. Cada uma ocupa a página, tem título, foco, ação principal e navegação próprios; não são três blocos consecutivos no mesmo scroll. A continuidade não depende de recarregar a página ou de transportar respostas em URLs.

## Entrada e questionário

Reutilizar a entrada v3 e suas telas editoriais já revistas como base da experiência anterior ao resultado. Manter 14 perguntas e 18 etapas até a entrega do resultado nesta primeira versão. Isso mantém o escopo reconhecível e permite comparar a jornada final; a quantidade ideal de perguntas será avaliada com abandono real, não presumida a partir do exemplo.

A terceira pergunta da v4 passa a ser: **Quanto isso afeta sua confiança hoje?** Opções: **Nada**, **Um pouco**, **Bastante**, **Muito**. A resposta é um autorrelato, não uma medida clínica. V1/v2/v3 conservam a pergunta anterior.

O resultado da v4 não usa `caseResult`, pesos de idade, medicamentos, doenças ou uma classificação automática de gravidade. O código atual não fundamenta um diagnóstico clínico. O resultado espelha a intensidade declarada pelo visitante e reconhece inclusive a resposta Nada. Nenhuma classificação é inflada para vender.

## Tela 1 — Resultado, etapa 18

Objetivo: entregar o que o visitante respondeu e criar uma transição clara para a explicação.

- Composição nova, enxuta, com hierarquia forte em preto, branco e vermelho.
- Título: **Seu resultado está pronto.**
- Destaque: **Impacto na sua confiança: [resposta declarada].**
- Apoio curto e fiel à resposta, sem prognóstico ou diagnóstico.
- Nota: **Este resumo reflete suas respostas e não é um diagnóstico médico.**
- CTA principal: **Assistir à apresentação.**
- Sem foto do COWBOY, kits, preços, selo de gravidade clínica ou oferta aprovada.

Ao concluir as perguntas, a barra encerra em 18/18. As próximas telas passam a uma navegação de três fases — Resultado, Apresentação, Oferta — sem aparentar novas perguntas.

## Tela 2 — Apresentação

Objetivo: permitir uma decisão informada antes da oferta.

- Ambiente visual dedicado ao vídeo, com fundo escuro e controles acessíveis.
- Contexto curto que retoma o objetivo declarado, sem alegar que o vídeo foi produzido individualmente.
- Usar a VSL existente, com autoplay silencioso quando visível, ativação de som por gesto e respeito à pausa manual.
- CTA: **Ver kits e valores.** Acesso disponível também se o vídeo falhar ou for bloqueado.
- Navegação para voltar ao resultado, preservando a sessão.
- Não estabelecer contagem regressiva ou tempo arbitrário para liberar a oferta.

O HTML antigo cita 3:25 como início da oferta, mas não há transcrição atual confirmando esse trecho; o roteiro de setembro tem outros tempos e preços. Portanto, nenhum bloqueio de CTA será condicionado a essa marca nesta versão.

## Tela 3 — Oferta

Objetivo: retomar o contexto pessoal e apresentar uma proposta comercial clara.

Ordem visual:

1. Faixa de retomada: impacto que o visitante declarou, exibido de forma breve.
2. Headline comercial: **Teste o COWBOY por 30 dias. Decida pela sua experiência.**
3. Identificação como suplemento alimentar em gotas e condições da garantia acessíveis. A promessa é comercial, sem garantia de cura, ereção ou duração da relação.
4. Imagem real do produto e apresentação objetiva, com composição baseada no rótulo disponível.
5. Depoimentos e imagens existentes, sem novas estatísticas, depoimentos inventados ou associação do estudo genético à eficácia do produto.
6. Kits com preços atuais, total parcelado, frete e seleção clara. Nenhum kit aparece como prescrição personalizada.
7. CTA de checkout, garantia e dúvidas essenciais.

O topo da oferta também oferece **Ver kits e valores**, com rolagem e foco no bloco de escolha. Quem já decidiu não precisa atravessar todos os depoimentos; o clique é medido separadamente da visualização real dos kits.

Criar uma composição própria para a v4, reutilizando dados e mecanismos confiáveis de checkout. Preservar aparência e ordem das versões anteriores.

## Captura e recuperação

Primeira versão sem cadastro obrigatório entre o quiz e o resultado. Um gate acrescentaria fricção e exigiria nova operação de contato. Recuperação por e-mail ou WhatsApp fica como expansão separada, mediante opt-in específico e integração apropriada, sem enviar respostas íntimas ou classificação do participante a CRM e publicidade.

## Medição

`quiz_id` exclusivo da v4. Rastrear entrada, início, passos ordinais, conclusão, resultado, continuidade para vídeo, início e cobertura real de reprodução, passagem para oferta, visualização real dos kits, seleção e início do checkout.

Usar identificadores fixos de tela e ação. Respostas, impacto, pontuação, texto do resultado e condições pessoais ficam apenas na memória. Não persistir em URLs, `history.state`, armazenamento, cookies ou eventos. Preservar GPC, opt-out e atribuição do checkout.

Comparar abandono em resultado → apresentação → oferta → checkout. A comparação v3/v4 avalia a jornada completa: a mudança da pergunta de impacto e da apresentação final não permite atribuir eventual diferença exclusivamente à separação das telas. Compras aprovadas só entram como métrica conclusiva quando a integração Purchase estiver homologada; início de checkout é indicador intermediário. Não prometer aumento de conversão antes de medir.

## Retorno, recarga e qualidade

- Voltar entre as três telas preserva contexto e não duplica conversões; o vídeo retorna pausado.
- Recarregar perde o resumo em memória: reiniciar com mensagem clara, sem inventar resultado recuperado.
- Acesso e foco por teclado, leitura móvel em 375/390 pixels e desktop, imagens leves e ausência de overflow.
- Regressão completa de v1/v2/v3, preços, checkout, UTMs, links de fonte e VSL.
- Validar as quatro respostas de impacto, inclusive Nada; confirmar ausência de produto na tela de resultado.
- Publicar sob URL própria e preservar a URL atual. Não redirecionar campanhas ou alterar orçamento de anúncios nesta entrega.
