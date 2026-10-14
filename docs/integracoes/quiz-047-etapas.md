# QUIZ-047 — Medição das etapas finais

## Identidade e escopo

Variante `v5-etapas`, `quiz_id=cowboy_v5_etapas`, capa em `/quiz/v5-etapas/` e questionário em `/quiz/v5-etapas/quiz/`. Preserva as versões anteriores. O botão Continuar flutuante da etapa 4 é compartilhado somente por v4/v5; a divisão em quatro telas finais pertence somente à v5.

Referências: [plano anterior à implementação](../research/quiz-047-split-plan.md), [story e evidências](../stories/QUIZ-047-etapas-finais.md) e [contrato da v4](quiz-046-jornada.md).

## Etapas e eventos

| Momento | Medição | Limite |
|---|---|---|
| Capa e entrada no questionário | Eventos editoriais existentes | `page_kind=cover` ou `quiz` |
| Resposta a uma pergunta | `quiz_answer` | Apenas ordinal permitido; 14 respostas, sem seu conteúdo |
| Entrada na etapa 18 | `quiz_complete` | Uma conclusão por visita; as telas seguintes não são outras conclusões |
| Visita às etapas 18–21 | `page_view`, `quiz_journey_view`, `quiz_step_view` | `page_kind=result`, `presentation`, `testimonials` ou `offer`; ordinal de 18 a 21 |
| Avançar ou voltar nas telas finais | `quiz_journey_action` | `cta_location=result_continue`, `presentation_continue`, `testimonials_continue`, `offer_view_kits` ou `back`, com `page_kind` de origem permitido |
| Resultado exposto | `quiz_result_view` | Bloco do autorrelato realmente visível, sem intensidade no payload |
| Depoimentos expostos | `quiz_testimonials_view` | Bloco dos vídeos de clientes realmente visível; somente v5 e sem conteúdo pessoal |
| Kits expostos | `view_item` | Kits realmente visíveis, com dados comerciais e sem autorrelato |
| VSL | Eventos existentes de reprodução, pausa, som, erro e cobertura | Sem texto do resultado ou dados das respostas |
| Escolher kit e sair para checkout | `select_item`, `begin_checkout` | Apenas oferta comercial e atribuição permitida |

O `page_view` virtual acompanha a troca efetiva de tela; não depende de o título permanecer visível. A impressão de um bloco depende de pelo menos 25% de sua área visível. Nos depoimentos, observar o bloco dos vídeos, não a seção inteira de vídeos e seis fotos, que pode ser maior que a janela. Sem IntersectionObserver, a navegação funciona, mas essas impressões não são presumidas.

Os eventos de entrada e interação são deduplicados conforme a semântica existente. Voltar a uma tela pode gerar nova visita/revisita, mas não nova conclusão ou nova primeira impressão. O limite de etapas 21 é exclusivo da v5 e não amplia a lista de ordinais permitidos para respostas.

## Privacidade e continuidade

O resultado mantém o impacto autodeclarado da v4. Respostas, intensidade, gravidade, pontuação, condições de saúde e texto do resultado não são enviados a Google, Meta, UTMify ou CRM, nem gravados em URL, histórico, cookies ou storage. O histórico pode conter somente um ID fixo de tela; respostas e kit selecionado permanecem na memória.

Manter GPC e opt-out, sanitização da URL antes dos fornecedores e allowlists de atribuição. Os links científicos e médicos conservam a exclusão de decoração UTMify. O checkout conserva o linker Google, o kit selecionado e o callback com fallback limitado.

A VSL pausa fora da etapa 19; os vídeos de clientes pausam fora da etapa 20. Voltar não deve provocar novo autoplay ou som inesperado. Recarregar reinicia a sessão de respostas com o aviso existente. Falhas dos fornecedores ou dos vídeos não bloqueiam a continuidade.

## Verificação e limites externos

Os testes isolam coleta e checkout externos; demonstram eventos, payloads e navegação, sem criar compras ou provar recebimento dos novos eventos em relatórios dos fornecedores. A story registra quais testes e verificações públicas efetivamente passaram.

O bloqueio conhecido do Meta e a homologação de `Purchase` continuam pendências externas. `begin_checkout` não comprova compra. Nenhuma alteração de campanha, orçamento, cadastro obrigatório, disparo de mensagens ou nova integração de CRM integra esta entrega.
