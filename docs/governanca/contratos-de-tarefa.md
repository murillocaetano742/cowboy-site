# Contratos de tarefa

Todos os contratos usam `company_id: cowboy-energia`, prazo `2026-09-08T08:00:00-03:00` e exigem evidência por caminho local, comando reproduzível ou registro de execução autorizado. Segredos e dados pessoais não entram nos outputs.

Pelo mandato vigente, o CEO/root coordena, delega, revisa e decide o aceite. Workers executam implementação, comandos, testes, contas e eventual deploy. A orquestração é da sessão nativa com três slots simultâneos; nenhum daemon ou organização persistente foi instalado.

## GOV-001 — Governança e observabilidade

- Executor: `governanca_harness` — Sol high.
- Objetivo: criar stories, plano, contratos, ledger, consulta CLI e painel somente de leitura.
- Fora de escopo: editar loja, APIs, imagens, publicar ou operar contas.
- Entregáveis: `docs/governanca/*`, `docs/stories/REBUILD-*`, `scripts/harness-status.ps1` e fragmento temporário.
- Definition of done: JSON válido; validador aprovado; status usa timestamps reais e evidências; painel sem `fetch` e sem controles de execução; distinção explícita entre sessão nativa e host persistente.
- Reviewer: CEO/root; revisão de conteúdo regulatório continua com QA independente na entrega geral.

## PROD-001 — Produto, oferta, copy e criação

- Executor: `produto_criacao` — Astra high.
- Objetivo: produzir arquitetura de oferta, copy forte dentro da verdade documentada, direção de arte e ativos profissionais.
- Inputs congelados: preços por quantidade; fotos fornecidas; fatos do rótulo; auditoria anterior; proibição de prova social falsa.
- Entregáveis: inventário factual, copy por seção, estrutura de kits, prompts/ativos com proveniência e plano de coleta de depoimentos reais.
- Definition of done: preços exatos; nenhum tratamento/cura; nenhuma dose de 24 gotas publicada sem documento reconciliado; rótulo visualmente fiel; claims e depoimentos rastreáveis; assets otimizáveis para web.
- Reviewer: QA independente, diferente do criador.

## INT-001 — Integrações comerciais e Google

- Executor: `integracoes_comerciais` — Terra high.
- Objetivo: definir e, quando autorizado no contrato do agente, preparar integração segura de Cartpanda, Melhor Envio, UTMify e Google.
- Entregáveis: matriz de configuração, contratos de dados/eventos, variáveis de ambiente esperadas, comportamento de erro, testes locais e lista de dependências externas.
- Definition of done local: nenhum segredo versionado; adaptadores toleram indisponibilidade; UTMs/eventos mantêm semântica; preço e frete não divergem; instruções de ativação são reproduzíveis.
- Definition of done externa: checkout de teste, CEPs, evento de compra/retorno, domínio e propriedades Google verificados em contas autorizadas. O estado externo não pode ser autoatestado pelo código.
- Reviewer: QA independente.

## DEV-001 — Implementação da página

- Executor: `frontend_vendas` — Terra high.
- Objetivo: reestruturar a página com copy, oferta, imagens e integrações aprovadas.
- Dependências: PROD-001 e INT-001 com inputs suficientes; conflito de claims/dose delimitado.
- Definition of done: página responsiva e acessível; HTML/JS resiliente; kit selecionado corresponde ao checkout; sem prova social ou urgência fabricada; políticas e identificação disponíveis; build/testes locais aprovados.
- Reviewer: QA independente.

## QA-001 — Revisão independente

- Executor: `qa_independente` — Astra high, em execução separada e sem autoria da implementação revisada.
- Objetivo: verificar a história completa do visitante até o limite permitido pelas contas de teste.
- Evidência: comandos e resultados, screenshots de teste quando úteis, URLs/IDs não secretos, matriz de claims, preços e eventos, findings por severidade.
- Definition of done: cada critério de REBUILD-002 recebe `pass`, `fail`, `blocked` ou `not_applicable` com evidência; P0/P1 resolvidos ou aceitos explicitamente; regressões materiais inexistentes.
- Autoridade: encontra e classifica; não publica nem certifica o próprio trabalho. CEO decide o aceite.

## DEVOPS-001 — Build e operação de contas

- Executor: `devops_contas`; modelo e esforço do host não são consultáveis.
- Objetivo: preparar build isolado, operar serviços por API/CLI e publicar somente após os gates.
- Limites atuais: nenhuma instância do Browser, Computer Use sem URL identificada, Vercel com token inválido e conector 403.
- Definition of done: pacote público verificado; autenticações reais; Cartpanda, Melhor Envio, UTMify e Google homologados; deploy no projeto existente com URL e rollback; nenhuma credencial em arquivo ou log.
- Reviewer: QA independente; aceite do CEO.

## LAUNCH-001 — Configuração externa e publicação

- Executor: papel autorizado conforme cada plataforma; push remoto segue autoridade exclusiva de `@devops` do AGENTS.md.
- Dependências: credenciais e propriedade legítimas, QA aprovado e decisão do CEO.
- Ações externas: ativar Cartpanda, Melhor Envio, UTMify, Search Console/GA4 e domínio; validar eventos e pedido de teste conforme autorização.
- Definition of done: configuração de conta comprovada, fluxo conciliado, rollback documentado e URL final verificada.
