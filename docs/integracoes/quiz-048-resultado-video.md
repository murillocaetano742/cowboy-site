# QUIZ-048 — Medição do resultado e da continuidade na v5

Atualização de `v5-etapas`, sem nova variante, rota ou dimensão. `quiz_id=cowboy_v5_etapas`; capa `/quiz/v5-etapas/`, questionário `/quiz/v5-etapas/quiz/`. Complementa o [contrato QUIZ-047](quiz-047-etapas.md); as alterações atuais do resultado e da VSL estão no [plano QUIZ-048](../research/quiz-048-result-video-plan.md).

## Resultado

A pergunta 3 da v5 registra `symptom_intensity`, substituindo apenas nessa variante o impacto na confiança. Seus valores fechados e a lista de respostas ficam somente na memória React. A etapa 18 mostra a intensidade autodeclarada, sem executar o cálculo antigo de gravidade. Nenhum valor, faixa, texto, condição de saúde ou pontuação integra eventos, URL, histórico, cookies ou storage.

Continuam 14 eventos ordinais possíveis de resposta e uma conclusão na etapa 18. A troca da pergunta não cria nova dimensão nem muda a allowlist de ordinais. As etapas 19–21 não são respostas nem outras conclusões.

## Vídeo e botões

As quatro telas finais continuam gerando visitas técnicas por `page_view`, `quiz_step_view` e `quiz_journey_view`, com identificadores fixos de tela. Resultado, depoimentos e kits conservam suas impressões por visibilidade real. O visual restaurado não antecipa eventos de oferta.

O botão flutuante 19 “Escolher meu kit” leva aos depoimentos e mantém `quiz_journey_action` com `cta_location=presentation_continue`. Ele não emite `begin_checkout`. O botão 20 segue para a oferta; somente o link comercial da etapa 21 inicia checkout, conforme a seleção atual.

A liberação do botão pelo término do vídeo é estado local de interface. Ela não equivale a cobertura assistida. Buscar o final pode liberar o botão sem gerar `vsl_complete`; esse evento mantém a exigência de `ended` com pelo menos 99% de cobertura reproduzida. Quartis, pausa, visibilidade, som, erro e bloqueio de autoplay mantêm seus eventos e deduplicação existentes. O fallback de mídia não cria conclusão artificial.

## Continuidade e limites

VSL e depoimentos pausam fora de suas etapas; retornar não desfaz uma pausa manual nem reinicia autoplay. Histórico guarda somente IDs fixos de navegação. Recarregar reinicia o quiz, sem recuperar respostas. A seleção de kit permanece somente na memória e é refletida no link real do rodapé.

Conservar GPC/opt-out, sanitização anterior aos SDKs, atribuição permitida, linker e callback limitado. Os testes interceptam fornecedores e checkout, sem compras ou leads reais. Não comprovam recebimento de todos os eventos em relatórios externos. O bloqueio Meta e a homologação de `Purchase` continuam pendências externas; `begin_checkout` não comprova uma compra.

O servidor CLI local entrega mídia sem suporte a Range. Para verificar busca e término nativos da VSL, o harness local entrega os mesmos bytes do MP4 com resposta 206; não substitui o vídeo nem injeta `ended`. O smoke de produção deve usar a mídia pública e confirmar o suporte real a Range.

Resultados efetivamente verificados e deploy: [story QUIZ-048](../stories/QUIZ-048-resultado-video-v5.md).
