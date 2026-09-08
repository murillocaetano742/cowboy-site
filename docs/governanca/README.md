# Governança local — COWBOY Energia

Este diretório é a fonte local de coordenação da reconstrução. A CLI lê o ledger; o painel apenas mostra um snapshot. Nenhum arquivo daqui comprova publicação, execução em conta externa, compra, resultado comercial ou trabalho em segundo plano depois que a sessão nativa termina.

## Fonte da verdade

1. `status-ledger.json`: estado observado das frentes, dependências e evidências.
2. `contratos-de-tarefa.md`: limites, entregáveis e definição de pronto de cada papel.
3. `plano-de-acao.md`: sequência, caminho crítico, gates e handoffs.
4. Stories `REBUILD-*`: critérios de aceite e rastreio dos arquivos.
5. Saídas e testes de cada agente: evidência primária para atualizar o ledger.

O status usa valores discretos (`working`, `queued`, `blocked`, `waiting_review`, `complete`) e timestamps ISO 8601 com fuso. Não usa percentuais subjetivos. A atualização do ledger deve citar evidência existente; o painel não altera esse arquivo.

Esta governança é proporcional e local. Ela reutiliza a orquestração nativa realmente observada nesta sessão e não se declara certificada pelo harness organizacional legado, não instala servidores de assinatura e não fabrica receipts de provider/modelo.

Mandato atual do proprietário: o CEO/root coordena, delega, revisa e aceita; implementação, comandos, testes, operação de contas e deploy são executados por workers. A equipe nativa possui seis frentes mapeadas e capacidade observada de três workers simultâneos. Essa autorização não instala daemon, organização permanente ou execução fora do host nativo.

O mandato permanece válido para as tarefas já autorizadas até conclusão ou revogação e não exige novas confirmações comerciais rotineiras. Prompts obrigatórios do sandbox, rede ou provedor são controles do ambiente: agentes e CEO não podem autoaprová-los, desativá-los ou contorná-los. Eles devem ser registrados como limitação técnica quando impedirem uma ação.

## Limites de verdade e segurança

- O rótulo observado informa 12 gotas (1 ml) ao dia e diz para não exceder a recomendação da embalagem. A orientação de 24 gotas foi relatada pelo proprietário, mas ainda não foi conciliada por documento formal do responsável técnico. Não publicar 24 gotas como recomendação genérica, nem derivar duração de kits dessa dose.
- O produto é rotulado como suplemento alimentar e declara não ser medicamento. Copy, imagens, SEO, depoimentos e anúncios não devem dizer que cura ou resolve disfunção erétil ou ejaculação precoce sem base regulatória e evidência aplicável.
- Agressividade comercial pode vir de clareza, economia dos kits, redução de fricção, apresentação forte e prova autêntica. Urgência, vendas, estoque e avaliações não podem ser simulados.
- Depoimentos e prints de WhatsApp devem vir de clientes reais, com consentimento e registro de origem. Montagens fabricadas não entram no backlog de produção.
- Tokens, cookies, senhas, 2FA e dados pessoais desnecessários não entram no repositório nem no ledger.

## Operação CLI

```powershell
powershell -NoProfile -File .\scripts\harness-status.ps1
powershell -NoProfile -File .\scripts\harness-status.ps1 -Format Json
powershell -NoProfile -File .\scripts\harness-status.ps1 -Validate
```

O primeiro comando apresenta o snapshot em tabela; `-Format Json` emite o documento normalizado; `-Validate` verifica estrutura, estados permitidos, timestamps, dependências e cálculos da oferta. A CLI não inicia agentes e não escreve em serviços externos.

## Atualização do ledger

Uma transição exige `updated_at` real, `state`, `evidence` e, quando aplicável, `blockers`. `complete` só é válido com evidência verificável e definition of done cumprida. `working` na sessão atual descreve observação do host nativo naquele instante; não significa worker persistente. O CEO integra os resultados e o QA revisa a implementação em execução separada.
