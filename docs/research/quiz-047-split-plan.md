# QUIZ-047 — Comparação com quatro etapas finais

Plano de 14/10/2026, registrado antes da alteração das telas finais. O pedido é separar o conteúdo existente, sem substituir a última versão publicada.

## Referência e preservação

O proprietário mencionou a página final da etapa 18. Root perguntou se a referência era a página longa v3 ou a última v4. Após dar oportunidade de resposta e sem uma nova definição, anunciou a adoção da última v4 como base. A nova variante será `v5-etapas`, com capa em `/quiz/v5-etapas/` e questionário em `/quiz/v5-etapas/quiz/`.

V1, v2 e v3 permanecem iguais. A v4 conserva sua jornada de três telas finais; recebe somente a alteração solicitada do botão Continuar na etapa 4. A v5 recebe o mesmo botão e divide a jornada final em quatro etapas. Não redirecionar campanhas nem trocar o endereço da v4.

## Conteúdo e ordem

| Etapa v5 | Conteúdo reaproveitado | Continuidade |
|---|---|---|
| 1–17 | Perguntas e telas editoriais da v4 | Mesma sequência e mesmas respostas |
| 18 | Resultado da v4, fiel ao impacto declarado | Assistir à apresentação |
| 19 | VSL atual, controles e autoplay silencioso por visibilidade | Ver depoimentos |
| 20 | Dois vídeos, seis fotos e relatos já existentes na oferta v4 | Escolher meu kit |
| 21 | Oferta v4, com apresentação, composição, kits, valores, garantia e dúvidas; retirar somente o bloco de depoimentos | Checkout do kit escolhido |

São 14 respostas e 21 etapas visuais. O questionário termina na etapa 18; as três etapas seguintes são conteúdo e oferta, não perguntas adicionais. Barra, texto e atributos da tela devem mostrar os números reais. A v4 mantém a indicação 18/18 no resultado e sua navegação atual.

O resultado da v4 é um autorrelato de impacto na confiança, com quatro respostas, inclusive Nada. Reutilizar esse resultado sem inventar gravidade clínica ou recuperar os pesos antigos por idade, medicamentos e condições de saúde. Root comunicou esse limite ao proprietário. Também não acrescentar nota média, número de avaliações, percentuais ou novos depoimentos.

## Alteração visual mínima

Manter as fontes Oswald/Manrope, vermelho, branco e tela escura da VSL. Reaproveitar os componentes e o conteúdo aprovados; a mudança de interesse é a separação dos blocos. A etapa 20 deve ter título e botão próprios, com os vídeos e fotos existentes. A etapa 21 conserva a oferta e o acesso direto aos kits, sem repetir depoimentos.

Na etapa 4 de v4/v5, usar um único botão Continuar fixo na parte inferior da janela, alinhado à largura da tela. Reservar espaço no conteúdo, considerar `safe-area-inset-bottom` e manter foco visível. O último texto, as fontes e os links precisam continuar acessíveis no celular, com zoom e por teclado. O botão não exige leitura até o fim nem dispara avanço automático.

## Navegação e reprodução

Cada etapa final ocupa uma tela; somente a etapa atual fica visível. As respostas e a seleção de kit permanecem na memória da aplicação. O histórico pode conter apenas identificadores fixos de navegação. Voltar/avançar deve atualizar foco, progresso e tela; recarregar reinicia o quiz com o aviso já existente.

A VSL pausa ao sair da etapa 19 e respeita a pausa ao retornar. Os vídeos de clientes pausam ao sair da etapa 20 e não recebem autoplay. Falha ou bloqueio de vídeo permite continuar. O texto de ajuda da VSL deve indicar o próximo destino correto: depoimentos.

## Medição e avaliação

Usar `quiz_id=cowboy_v5_etapas`, sem misturar visitas com a v4. Medir a visita real a cada tela final, as transições, exposição real do resultado/depoimentos/kits, reprodução da VSL, escolha de kit e início de checkout. As respostas, impacto, gravidade e textos pessoais nunca integram eventos, URLs, armazenamento ou CRM.

Conservar `quiz_complete` na chegada à etapa 18 e as 14 respostas, sem contar as telas 19–21 como respostas ou novas conclusões. GPC, opt-out, allowlists, deduplicação e atribuição do checkout continuam obrigatórios.

A comparação será entre a jornada final da v4 e a divisão em quatro etapas da v5. Não afirmar melhora de conversão antes de medir abandono e início de checkout. Confirmação de compra continua dependente da homologação de Purchase; o bloqueio conhecido do Meta não é resolvido por esta alteração.

## Verificação e publicação

Cobrir quatro respostas de impacto, oito entradas públicas, versões anteriores, progresso, teclado, zoom, botão flutuante, telas móveis e desktop, histórico/recarga, pausa de todos os vídeos, falha de mídia, eventos neutros, opt-outs e três kits com atribuição. Publicar somente o artefato aprovado, via PR e deployment automático, preservando a versão anterior como rollback.

Evidências e status final: [story QUIZ-047](../stories/QUIZ-047-etapas-finais.md).
