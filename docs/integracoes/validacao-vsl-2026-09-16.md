# Validação local da integração VSL — 16/09/2026

Story: `docs/stories/VSL-030-integracao-pagina-publicada.md`. Execução em Windows/PowerShell, workspace `C:\Users\User\Downloads\VS_CODE`.

## Resultados

| Verificação | Resultado | Alcance |
| --- | --- | --- |
| `npm test` | 47/47 passaram na execução final | 36 testes anteriores + 11 da exportação de atividade; após revisão independente e correção de zero monetário. |
| `npm run lint` | Passou; 42 arquivos na execução após ajuste da spec | Gate de sintaxe JavaScript; não executa ESLint nem TypeScript. |
| `npm run check:build` | Passou; 60 arquivos | Allowlist exata, referências locais e isolamento do build público. Executado após habilitar WhatsApp. |
| `npm run check:commerce` | Exit 1 | Os três links de checkout estão configurados. Faltam `MELHOR_ENVIO_TOKEN`, `MELHOR_ENVIO_USER_AGENT` e `MELHOR_ENVIO_ENV` válido. |
| `node tests/qa/checkout-local.js` | 3/3 passaram | HTTP 302 para variantes 211742450, 211742746 e 212751381, atribuição preservada, campo `email` descartado e cache `no-store`. Destinos externos não foram abertos. |
| E2E original, com DNS externo bloqueado | 5/6 passaram | Única falha: erro de console do loader UTMify externo bloqueado; detalhes abaixo. |
| E2E após correção do isolamento | 6/6 passaram em 1,7 min | Spec original com ajuste do harness descrito abaixo; execução concluída às 17:08 BRT. |
| Links WhatsApp | 2/2 passaram | Visíveis, número `5511970842160`, `wa.me` e textos próprios corretamente codificados. Nenhuma mensagem enviada. |
| Eventos VSL locais | Passaram | 5 chamadas GA4 + 5 Meta capturadas por stubs locais. Sem envio externo. |

O gate `check:commerce` testa disponibilidade de configuração local. Ele não consulta preços, fretes ou parcelas no Cartpanda; os dados comerciais exigem evidência externa separada.

## E2E e isolamento de rastreadores

Servidores locais foram iniciados em `127.0.0.1:4180` para E2E e `127.0.0.1:4173` para o teste de redirecionamento. Não havia listener nessas portas antes desta execução.

A primeira execução usou uma configuração temporária derivada de `playwright.config.js`, adicionando bloqueio DNS para domínios externos. Foram aprovados galeria/vídeo, seleção de kit, acessibilidade e capturas mobile/desktop. O primeiro teste falhou exclusivamente em `expect(errors).toEqual([])` por `net::ERR_NAME_NOT_RESOLVED` no recurso `https://cdn.utmify.com.br/scripts/utms/latest.js`. A largura mobile medida foi 390 px, sem overflow. O relatório axe retornou `[]`.

Com autorização do agente responsável, `tests/e2e/cowboy-nova.spec.js` recebeu um ajuste de harness: função `isolateTracking(context)` bloqueia HTTPS por regex e serve fixtures JavaScript vazias para Pixel, GA4 e o loader UTMify. O helper também é aplicado ao contexto separado da captura desktop. A coleta e as asserções de erros da página permanecem integrais; nenhum erro local foi filtrado. HTML, CSS e JavaScript da página não foram alterados por este ajuste.

Comando de repetição (configuração normal do repositório; saídas temporárias evitam substituir capturas anteriores):

```powershell
$env:E2E_BASE='http://127.0.0.1:4180'
$env:E2E_OUT=Join-Path $env:TEMP 'cowboy-vsl-030-qa-20260916/captures-fixed'
npx playwright test tests/e2e/cowboy-nova.spec.js --output (Join-Path $env:TEMP 'cowboy-vsl-030-qa-20260916/results-fixed')
```

## WhatsApp, vídeo e limites da evidência

Os dois links exibem `https://wa.me/5511970842160` com a query `text` igual ao respectivo `data-whatsapp-text`. Os blocos deixaram de estar ocultos. A verificação não abriu o WhatsApp.

Em navegador local com tráfego externo interceptado, funções substitutas de `gtag` e `fbq` capturaram `vsl_start`, `vsl_progress` com percentuais 25/50/75 e `vsl_complete` com 100. Eventos repetidos de play, progresso e ended não duplicaram essas chamadas. Os argumentos iniciais são `event` para GA4 e `trackCustom` para Meta. Isso comprova o despacho pelo código; não comprova recebimento ou configuração no GA4/Meta.

`data-vsl-gate="off"` permanece e não há blocos com `data-locked`. Prazo permanece `2026-09-30T23:59:59-03:00` e estoque continua vazio. Nenhum prazo ou estoque foi inventado.

## Preservação da página (SHA-256)

| Arquivo | Antes | Depois |
| --- | --- | --- |
| `cowboy-nova.html` | `4bf9cbf46593bb934abd961cc62f6e1b8c201edc9ee0426cf645ffb13082cc4a` | `de7d37cee98e516a8050fa79e775d4722836c5b049d41e2bb2472d2a4027972c` |
| `assets/css/cowboy-nova.css` | `cd595ef2e840ec8dcf1fc3f43424140350dd66ff88de540bdbde6f141e0f81b2` | Igual |
| `assets/js/cowboy-nova.js` | `1a02d9bc709199825ebcb7dca4a275601199daeffb8a8fffa78600beddd27756` | Igual |

O HTML mudou exclusivamente no atributo do body: `data-whatsapp=""` → `data-whatsapp="5511970842160"`, conforme número fornecido pelo proprietário durante a execução. Reverter somente essa substituição em memória reproduziu exatamente o hash anterior do HTML. Não houve outras alterações nesse arquivo desde o início desta auditoria.

## Revisão independente da exportação de atividade

Foram revisados `scripts/cartpanda-sync-activity.js`, `tests/integrations/activity.test.js` e o contrato operacional em `atividade-cartpanda.md`. Não restaram achados bloqueadores no código examinado.

A lista privada de IDs autorizados é obrigatória para publicação; pagamento por si só não permite exibir o cliente. Testes conhecidos, flags e marcadores de teste, cancelamentos, reembolsos e chargebacks prevalecem sobre a autorização. O feed recebe somente primeiro nome, cidade/UF, kit e data verificável; IDs e demais dados dos pedidos não são publicados nem registrados no resumo de execução.

As requisições usam origem e loja fixas, sem seguir redirects ou links de paginação recebidos. O exportador confere identidade da loja, total, número de páginas e duplicidade de IDs antes de escrever. A substituição atômica preserva relatos; conteúdo igual não é regravado. Falhas de API, exportação parcial e fuso não verificado de candidato autorizado mantêm o arquivo anterior.

Um achado funcional foi corrigido pelo autor: `total_refunded="0.00"` era interpretado como reembolso, omitindo um pedido potencialmente elegível. A versão revisada aceita zero decimal explícito e rejeita valores não zero, negativos ou malformados. O novo teste cobre representações válidas e inválidas; `npm test` final aprovou 47/47.

Limitações permanecem explícitas: não há sincronização agendada ativa; o feed estático exige exportação, build e deploy. Execuções recorrentes devem ser configuradas sem sobreposição. Autorizações individuais e fuso dos timestamps sem offset dependem de confirmação operacional; não foram presumidos nesta revisão.
