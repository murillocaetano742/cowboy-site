# Rastreamento da VSL — verificação de 16/09/2026

**Resultado:** recebimento parcial comprovado no GA4; eventos VSL ainda não encontrados no Meta no período consultado. Auditoria de leitura, sem modificar a página ou configurações de rastreamento, sem emitir eventos de compra e sem reproduzir a VSL em produção.

## Evidências dos painéis

| Plataforma | Identificação e período | Resultado observado |
| --- | --- | --- |
| GA4 | Conta Cowboy Energia Masculina; propriedade Cowboy 1 (`553376813`); relatório Eventos, **Hoje — 16/09/2026** | `vsl_start`: **1 evento / 1 usuário**. `vsl_progress`: **1 evento / 1 usuário**. `vsl_complete` não constava entre os seis nomes de evento apresentados. |
| GA4 | Visão geral em tempo real, **últimos 30 minutos** da consulta | Havia tráfego, mas nenhum `vsl_*` listado naquele intervalo. Isso não contradiz os eventos já processados no relatório do dia. |
| Meta | PIXEL COWBOY (`1006075098894986`), empresa `383730844330268`; **Hoje — 16/09/2026**, fuso America/Sao_Paulo | Pesquisa `vsl`: **“Nenhum evento chamado ‘vsl’ encontrado.”** Sem esse filtro, PageView e Ver conteúdo apareciam com **4 eventos cada**, por API de Conversões. |

O fluxo Web **Cowboy Energia**, código `15744041628`, foi aberto no GA4: domínio `https://cowboyenergiamasculina.com.br/` e ID de medição **`G-VYR2542XCN`**, correspondente ao configurado no site. O detalhe de `vsl_progress` confirmou a contagem de um evento; **não foi validado qual percentual (25/50/75) corresponde ao evento recebido**.

Links para reconsulta autenticada:

- [GA4 — relatório de eventos](https://analytics.google.com/analytics/web/#/a407379979p553376813/reports/explorer?params=_u..nav%3Dmaui&ruid=top-events,business-objectives,examine-user-behavior&collectionId=business-objectives&r=top-events) — selecionar Hoje ou 16/09/2026.
- [GA4 — detalhe de vsl_progress em Hoje](https://analytics.google.com/analytics/web/#/a407379979p553376813/reports/dashboard?params=_u..nav%3Dmaui%26_u.dateOption%3Dtoday%26_u.comparisonOption%3Ddisabled%26_r..dimension-value%3D%7B%22dimension%22:%22eventName%22,%22value%22:%22vsl_progress%22%7D&collectionId=business-objectives&r=events-overview) — o período relativo muda conforme a data de acesso.
- [GA4 — fluxos de dados](https://analytics.google.com/analytics/web/#/a407379979p553376813/admin/streams/table?restoreUserState=true).
- [Meta — conjunto de dados em 16/09/2026](https://eventsmanager.facebook.com/events_manager2/list/dataset/1006075098894986/overview?business_id=383730844330268&date=2026-09-16_2026-09-16) — pesquisar `vsl`.

## Verificação do código e dos testes

- A raiz pública e os scripts `cowboy-nova.js`, `cowboy-google.js` e `cowboy-pixel.js` responderam HTTP 200. O `cowboy-nova.js` publicado contém `vsl_start`, `vsl_progress` e `vsl_complete`; o Google publicado configura `G-VYR2542XCN`.
- `cowboy-pixel.js` carrega o SDK UTMify, grupo **`6aa16d0bee215350c09b5b31`**. O [SDK público consultado](https://cdn.utmify.com.br/scripts/pixel/pixel.js) contém inicialização de `fbq` e carregamento de `fbevents.js`. Portanto, o wrapper local não instalar `fbq` diretamente **não comprova ausência do Pixel Meta**.
- `node --test tests/integrations/meta-pixel.test.js tests/integrations/google-analytics.test.js tests/integrations/google-linker.test.js`: **7 aprovados**.
- Execução isolada do bloco de medição de `assets/js/cowboy-nova.js`, com funções de captura em memória: confirmou cinco chamadas por destino — start, progress 25/50/75 e complete — e ausência de duplicação ao repetir os eventos do vídeo. **Nenhuma requisição externa** nessa verificação. Ela valida a lógica local, não a entrega aos provedores.
- `tests/e2e/cowboy-nova.spec.js` bloqueia os loaders Google/Pixel e requisições HTTPS; seus testes não comprovam recebimento de eventos pelos painéis.

## Limitações e próxima validação

A consulta comprova os nomes e contagens acima, sem atribuir origem a uma sessão específica ou validar todos os parâmetros. O relatório do dia pode estar incompleto; o painel Meta informa que eventos podem levar até 30 minutos para aparecer. Ausência no intervalo consultado não determina a causa.

Há um risco de temporização no código: se `gtag` ou `fbq` ainda não existir quando um marco ocorrer, a chamada daquele destino é ignorada e o marco fica registrado localmente como já disparado. O evento não é reenviado quando o SDK passa a existir. Esse comportamento foi reproduzido localmente para `fbq` tardio; **não foi demonstrado como causa da ausência no Meta**.

Falta homologar uma reprodução completa controlada, correlacionando start, os três percentuais e complete com recebimento no GA4 e Meta. Se a entrega Meta continuar ausente, conferir a inicialização do SDK e os eventos efetivamente enviados antes de definir correção. Qualquer alteração no JavaScript da página deve ser combinada com o proprietário, conforme o pedido de integração.
