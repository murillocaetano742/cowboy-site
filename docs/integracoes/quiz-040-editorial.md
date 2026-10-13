# QUIZ-040 — Capa, progresso e rastreamento da v3

## Jornada publicada em rota independente

- Capa: `/quiz/v3-editorial/`.
- Questionário: `/quiz/v3-editorial/quiz/`.
- Identificador analítico: `cowboy_v3_editorial`.
- As versões `/quiz/v1-direto/` e `/quiz/v2-vsl/`, a homepage e o atalho `/quiz` para v1 permanecem disponíveis.

A capa usa apresentação editorial própria, com identificação de conteúdo publicitário COWBOY, imagem ilustrativa existente e CTA antes da imagem no celular. Não atribui o texto a jornal, jornalista, pesquisa ou instituição externa.

O fluxo inclui 14 perguntas em 18 etapas: objetivo, percepção atual, urgência, explicação, idade, peso, preocupação, frequência, nova pergunta de tempo, transição/depoimentos, sobrepeso, medicamentos, cirurgia, condições, percepção da parceira, receio, processamento e resultado/oferta. O progresso mostra a etapa atual, incluindo transições; ao voltar, o indicador recua e as respostas anteriores continuam selecionadas.

A interpretação adotada para a pergunta de tempo é “Há quanto tempo você percebe essa dificuldade?”, após frequência. A consulta opcional ao proprietário não teve resposta antes da implementação. Alternativas: menos de 1 mês, 1 a 6 meses, 6 meses a 1 ano, mais de 1 ano e não perceber dificuldade hoje. Seu ID é `problem_duration`, distinto do campo legado `duration` de medicamentos. A nova resposta não entra na pontuação legada nem é enviada a rastreadores.

A opção 4 aplica o botão “Ver kits e valores” junto à VSL, com rolagem e foco nos kits, respeitando preferência de movimento reduzido. Frete, envio discreto e garantia de 30 dias aparecem perto da compra, mantendo condições da oferta existente. Preços, destinos de checkout, mídia e cálculo legado não mudam nesta entrega.

## Mapa de eventos GA4

Todos os eventos incluem `quiz_id`. Campos textuais abaixo são enumerações fixas; não contêm perguntas, respostas ou resultado clínico.

| Momento | Evento | Informação controlada |
| --- | --- | --- |
| Abertura de cada documento | `page_view`, `landing_view` | `page_kind`: cover ou quiz; URL sanitizada, título neutro e origem do referrer |
| Seção da capa visível a 25% | `quiz_cover_section_view` | `section_id`: intro, how_it_works ou footer |
| CTA da capa | `quiz_cover_cta` | `cta_location`: hero ou footer |
| Primeira resposta | `quiz_start` | Uma vez por documento |
| Etapa exibida | `quiz_step_view` | `step_index`: 1–18, uma vez por etapa |
| Resposta confirmada | `quiz_answer` | Apenas número da etapa, uma vez por etapa de resposta |
| Voltar | `quiz_back` | Etapas de origem/destino e contador numérico |
| Revisitar etapa | `quiz_step_revisit` | Número da etapa e contador de visitas |
| Chegada à oferta | `quiz_complete` | Conclusão do fluxo |
| Resultado visível a 25% | `quiz_result_view` | Sem conteúdo ou classificação do resultado |
| VSL visível a 50% | `vsl_visible` | `video_id`: cowboy_vsl |
| Reprodução efetiva | `vsl_start` | `video_id` fixo; evento playing |
| Cobertura assistida | `vsl_progress`, `vsl_complete` | 25/50/75/100, calculados por trechos reproduzidos; avanço manual não cria conclusão |
| Som e pausa | `vsl_unmute`, `vsl_mute`, `vsl_pause` | ID fixo e contador numérico da interação |
| Falhas do vídeo | `vsl_error`, `vsl_autoplay_blocked` | ID fixo, uma vez por tipo; sem mensagens livres de erro |
| Botão junto à VSL | `quiz_view_kits` | Uma vez por documento |
| Kits visíveis a 25% | `view_item` | Produto, quantidade do kit selecionado, valor e BRL |
| Troca de kit | `select_item` | Kit e valor, uma vez por kit |
| Clique para checkout | `begin_checkout` | Kit e valor, uma vez por kit, com callback e fallback independente |
| Privacidade e termos da capa/oferta | `quiz_content_link` | `link_id` e `link_location`, valores fixos |

`page_view` automático permanece desabilitado (`send_page_view: false`). A navegação capa → quiz é por documento completo, preservando atribuição permitida e criando contexto de página próprio. Cada CTA oferece até 700 ms para o callback do SDK, com fallback independente de 800 ms; ausência, erro ou bloqueio do SDK não aprisiona a navegação. O callback não confirma recebimento pelo fornecedor. Links com modificadores preservam comportamento nativo.

A VSL mantém autoplay sem som quando 50% visível, uma tentativa por montagem e respeito à pausa manual. `vsl_start` automático não representa intenção de assistir; analisar também `vsl_unmute`, cobertura reproduzida e avanço até kits/checkout.

## Configuração efetiva do Google Analytics

Em 13/10/2026, foram criadas e confirmadas na interface autenticada da propriedade GA4 553376813 (Cowboy1), todas com escopo Evento:

| Nome | Parâmetro |
| --- | --- |
| Página do funil | `page_kind` |
| Posição do botão | `cta_location` |
| Seção do funil | `section_id` |
| Link de conteúdo | `link_id` |
| Local do link | `link_location` |

Foram preservadas Etapa do quiz (`step_index`), Progresso da VSL (`percent`) e Quiz COWBOY (`quiz_id`). A tabela final apresentou oito dimensões. Medição existente: `G-VYR2542XCN`. Configurar dimensões e testar payload local não comprova processamento de cada evento em produção.

## Privacidade e atribuição

Respostas permanecem em memória na aba. Não se enviam idade, peso, condições de saúde, opções selecionadas, gravidade ou texto livre. Eventos customizados de navegação e vídeo vão ao GA4; Meta mantém somente eventos comerciais neutros já existentes. Inspeção automática de campos/botões e correspondência avançada permanecem desativadas.

URLs usam allowlist de atribuição. Parâmetros arbitrários e fragmentos são removidos antes de carregar fornecedores. UTMs e identificadores de clique permitidos acompanham capa → quiz → checkout. O linker Google é gerado no clique, sem reutilizar `_gl` armazenado. GPC e opt-out impedem a instrumentação; o quiz e os links continuam funcionais.

## Bloqueio externo Meta reconfirmado

Consulta somente de leitura em 13/10/2026 no conjunto de dados `1006075098894986`, portfólio `383730844330268`:

- Fonte `cowboyenergiamasculina.com.br`: categoria **Conteúdo inadequado**.
- Estado: **Análise rejeitada**.
- Detalhes oficiais: fonte bloqueada, sem permissão para compartilhar dados; decisão em **10/10/2026 às 13:44**, conforme horário mostrado pelo painel.
- “Pedir análise” desabilitado; o painel informa nova análise apenas 30 dias após o último pedido.
- Diagnóstico ativo adicional: eventos CAPI sem `event_source_url` bloqueados em razão da categoria restrita.

Nenhuma revisão, alteração de categoria, permissão ou substituição de Pixel foi feita. A implementação de eventos não contorna essa restrição. Uma chamada local `fbq` não é comprovante de recebimento no Meta.

Purchase via Appmax/UTMify permanece dependente de homologação com pedido real aprovado e da situação da fonte. Esta entrega não cria pedido, pagamento ou Purchase artificial. A homologação de filas/transporte isolado deve ser distinguida do recebimento processado pelos fornecedores.

## Verificação

Gates de código, exportação, evidências mobile/desktop, QA independente e publicação são registrados em `docs/stories/QUIZ-040-entrada-progresso-tracking.md`. Testes novos: `tests/e2e/cowboy-quiz-editorial.spec.js`; regressão VSL anterior preservada. Capturas e relatórios locais não integram o pacote público.
