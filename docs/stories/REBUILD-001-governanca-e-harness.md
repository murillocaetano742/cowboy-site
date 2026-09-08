# REBUILD-001 — Governança e harness da reconstrução COWBOY Energia

Status: Concluída — governança local

## Solicitação

Organizar a reconstrução da oferta e da página COWBOY Energia com execução paralela por agentes, supervisão do CEO, rastreabilidade local e um painel de acompanhamento somente de leitura. O prazo operacional informado é 08/09/2026 às 08:00, horário de São Paulo.

## Critérios de aceitação

- [x] Registrar escopo, fatos confirmados, conflitos e dependências externas sem inventar conclusões.
- [x] Definir mapa de papéis, modelos, skills, ownership e independência de revisão.
- [x] Criar contratos de trabalho com entregáveis, evidência e definition of done.
- [x] Criar ledger local com timestamps reais e estados discretos, sem percentuais estimados.
- [x] Disponibilizar comando CLI para validar e consultar o ledger.
- [x] Criar painel inline que apenas apresenta um snapshot e pede atualização ao host.
- [x] Integrar os handoffs locais já disponíveis de produto/criação e integrações ao ledger.
- [x] Registrar a revisão independente da implementação e o aceite final do CEO como gates pendentes da REBUILD-002.
- [x] Consolidar a retomada de 08/09: API e HTTP local confirmados, três correções CSS aceitas somente no escopo estático, integrações externas e experiência visual ainda pendentes.
- [x] Registrar dez criativos não localizados, inventário dos quatro vídeos antigos e ausência de prova social autêntica; sem simular atividade live.

## Escopo e limites

Esta story implementa governança, contratos, observabilidade e documentação. Não implementa página, checkout, APIs, imagens, publicação, campanha nem configuração em contas externas. O painel não controla agentes e não consulta a rede. O ledger diferencia trabalho observado na sessão nativa atual de uma automação persistente, que não foi instalada.

Fatos de produto registrados para orientar os contratos: frasco de 30 ml; rótulo com porção de 12 gotas (1 ml), 30 porções, uso de 12 gotas ao dia, grupo populacional a partir de 19 anos, declaração de que não é medicamento e consumo após abertura em até 60 dias. Também existe relato do proprietário de recomendação de 24 gotas ao dia pela médica responsável. A divergência não está reconciliada; 24 gotas não deve ser publicada como orientação genérica nem usada para calcular duração de kits sem instrução formal vinculada ao produto.

## Dependências externas

- Cartpanda autenticada com catálogo atualizado; resumo público, quantidade e frete ainda dependem de homologação. Proposta de limite do avulso não aplicada.
- Credenciais, contrato, origem de postagem e regras da Melhor Envio.
- Workspace, token/identificação e convenção de eventos da UTMify.
- Propriedade de domínio, Search Console, GA4 e demais identificadores Google.
- Documentação formal que reconcilie dose, rendimento e alegações permitidas.
- Depoimentos reais, consentimentos e autorização de uso; prova social sintética é proibida.

## File List

- `docs/stories/REBUILD-001-governanca-e-harness.md`
- `docs/governanca/README.md`
- `docs/governanca/plano-de-acao.md`
- `docs/governanca/contratos-de-tarefa.md`
- `docs/governanca/status-ledger.json`
- `docs/governanca/entrega-local.md`
- `docs/governanca/plano-10-criativos.md`
- `docs/governanca/autonomia-e-permissoes.md`
- `scripts/harness-status.ps1`
- `docs/auditorias/2026-09-07/relatorio-cowboy.html` — aviso de estado atual, preservando o diagnóstico original.
- Painel temporário fora do repo: `C:/Users/User/AppData/Local/Temp/codex-cowboy-governanca-harness/cowboy-execution-status.html`.

## Verificação

Validador CLI deve permanecer aprovado após cada atualização do ledger. O painel usa snapshot embutido, não acessa rede e não inicia/controla agentes. Revisões da implementação/API/build e do CSS estático foram entregues; inspeção visual real e homologação externa permanecem pendentes. O CEO aceitou somente os escopos locais comprovados. O mandato comercial continua válido; o bloqueio atual é do runtime, antes da captura/login, distinto de falta de autorização.
