# Pesquisa de conectores e MCPs — COWBOY

Data da pesquisa: 2026-09-08  
Escopo técnico: site em HTML/CSS/JavaScript estático, com funções serverless em Node.js nativo e deploy já orientado à Vercel.

## Objetivo e limites

Esta pesquisa identifica conectores e servidores MCP que podem ajudar no design, na implementação, na revisão e na segurança do site sem exigir migração de stack. Foram consultadas somente fontes primárias dos fornecedores e os metadados de ferramentas e skills expostos na sessão.

Nenhum plugin foi instalado, nenhuma conta foi criada, nenhuma permissão foi alterada e nenhum repositório externo foi executado. Também não foram acessados `.env`, tokens ou credenciais. A ausência de `search_plugins`, `suggest_plugins` ou `tool_search/search_tools` nesta sessão impede consultar o diretório completo de plugins; por isso, a pesquisa é uma shortlist fundamentada, não um levantamento exaustivo do marketplace.

## Como interpretar o estado

- **Ferramenta exposta**: o nome e o schema da ferramenta estão presentes na sessão. Isso não prova login ativo, escopo suficiente ou acesso ao projeto correto.
- **Catalogado**: o produto aparece na lista de plugins recomendados fornecida ao início da sessão, mas não possui ferramenta correspondente exposta.
- **Candidato externo**: existe uma implementação oficial pública, porém ela não está conectada nesta sessão.
- **Autenticado/operacional**: exige evidência de uma chamada autenticada bem-sucedida para o recurso pretendido. Essa verificação não foi feita nesta pesquisa.

## Inventário observado na sessão

| Integração | Evidência local | Estado comprovado | O que não está comprovado |
|---|---:|---|---|
| Figma | 33 ferramentas `figma_*` e skills específicas de uso, design-to-code, biblioteca e Code Connect | Ferramentas expostas | Login, plano/seat, permissão no arquivo e limites disponíveis |
| GitHub | 89 ferramentas `github_*` | Ferramentas expostas | Conta autenticada, instalação selecionada e permissão no repositório COWBOY |
| Sites | 23 ferramentas `sites_*` e skills de construção/hospedagem | Ferramentas expostas | Site conectado, permissão de publicação e adequação à plataforma atual |
| Vercel | 24 ferramentas `vercel_*` e skills especializadas | Ferramentas expostas; tentativa operacional anterior registrou HTTP 403 e token da CLI inválido | Sessão OAuth válida e autorização no projeto/time correto |
| Plugin Management | 4 ferramentas: consultar permissões/dependências, alterar permissões e remover app | Capacidade administrativa parcial exposta | Busca/sugestão de plugins não está disponível |
| Canva | Entrada no catálogo recomendado | Catalogado, sem ferramenta exposta | Instalação, autenticação e permissões |
| Cloudflare | Entrada no catálogo recomendado | Catalogado, sem ferramenta exposta | Instalação, conta, zona e escopos de API |
| Codex Security | Entrada no catálogo recomendado | Catalogado, sem ferramenta exposta | Elegibilidade do plano, conexão GitHub e repositório habilitado |
| Playwright MCP | Repositório oficial localizado; nenhuma ferramenta dedicada exposta | Candidato externo | Instalação, browsers e funcionamento no ambiente |

A presença dos comandos de escrita de Figma, GitHub, Sites ou Vercel não autoriza seu uso. Para a próxima fase, a concessão deve seguir privilégio mínimo e separar leitura/revisão de qualquer mutação ou publicação.

## Shortlist priorizada

| Prioridade | Conector/MCP | Papel no site COWBOY | Estado nesta sessão | Pré-requisitos e limites | Custo oficialmente comprovado |
|---|---|---|---|---|---|
| P1 | Figma MCP | Design-to-code, leitura de layouts, assets, variáveis, screenshots e consistência entre design e implementação | 33 ferramentas expostas; autenticação não verificada | OAuth individual; acesso somente aos arquivos que a conta já pode ver/editar; limites dependem de plano e seat | A documentação confirma limites por plano/seat; não informa tarifa separada do MCP |
| P1 | GitHub MCP Server | Leitura do repositório, issues/PRs, Actions e ferramentas de code security/secret protection | 89 ferramentas expostas; autenticação e acesso ao repo não verificados | OAuth, GitHub App ou PAT; habilitar só toolsets e escopos necessários; usar modo somente leitura na pesquisa/revisão | Não foi localizado preço específico do MCP na fonte oficial consultada |
| P1 | Playwright MCP / Playwright CLI + skills | QA funcional, navegação, formulários, screenshots e inspeção via árvore de acessibilidade | MCP dedicado não exposto | Node/npm e browsers Playwright; perfil isolado para evitar reutilizar sessões; respeitar o guard já existente | Repositório oficial sob Apache-2.0; custos de infraestrutura não foram avaliados |
| P2 | Vercel MCP | Operar a plataforma já usada: projetos, deployments, logs, documentação e analytics | 24 ferramentas expostas, mas estado operacional atual bloqueado por 403/token inválido | OAuth para o time/projeto correto; a conexão recebe o mesmo alcance da conta Vercel autorizada | Oficialmente em beta e disponível em todos os planos; isso não implica consumo gratuito |
| P2 opcional | Codex Security | Threat model do repositório, busca e validação de vulnerabilidades e proposta de patches para revisão humana | Catalogado, não instalado | Conta elegível; conectar GitHub e habilitar explicitamente o repositório | Research preview para ChatGPT Enterprise, Edu, Business e Pro; preço incremental não informado |
| Complementar | Canva MCP | Criar/editar/exportar peças e administrar assets/brand kit; útil para criativos, não para a arquitetura do site | Catalogado, sem ferramenta exposta | Conta Canva; autenticação individual; integrações próprias precisam entrar na allowlist e passar pela análise da Canva | A documentação aceita conta de qualquer plano como pré-requisito; recursos específicos podem depender do plano |
| Condicional | Cloudflare MCP | Documentação, observabilidade, builds, WAF/CDN/DNS e demais serviços Cloudflare se uma camada Cloudflare entrar na arquitetura | Catalogado, sem ferramenta exposta | Conta Cloudflare e OAuth ou token com escopos mínimos; escolher servidor amplo ou por domínio | A documentação alerta que alguns recursos exigem plano pago de Workers; valor não informado |

### 1. Figma MCP — adotar como ponte principal de design

O servidor remoto oficial do Figma é a opção mais direta para transformar uma página aprovada em contexto estruturado para código. Ele oferece leitura de contexto de design, screenshots, assets, variáveis e Code Connect; a versão remota também permite escrita no canvas quando o fluxo e as skills apropriadas forem autorizados. A integração não exige React: o `label` de Code Connect aceita JavaScript, e assets/tokens podem ser usados no HTML/CSS atual.

O endpoint remoto oficial é `https://mcp.figma.com/mcp` e o fluxo usa OAuth. A Figma deixa claro que o MCP só alcança arquivos que o usuário autenticado já pode acessar. Os limites atuais variam fortemente por plano e seat: por exemplo, Starter View/Collab tem até 20 leituras por mês, enquanto seats Dev/Full chegam a cotas diárias conforme o plano. Fontes: [visão geral do Figma MCP](https://developers.figma.com/docs/figma-mcp-server/), [instalação do servidor remoto](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/) e [limites e acesso](https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/).

Recomendação operacional: começar em leitura com um link de frame específico e exportar apenas assets necessários. Ativar escrita no Figma e Code Connect somente quando o arquivo, o responsável e o escopo estiverem definidos.

### 2. GitHub MCP Server — adotar para rastreabilidade e gates

O servidor oficial do GitHub reúne repositórios, issues, pull requests, Actions, code quality, code security, Dependabot, secret protection e advisory data. Para o COWBOY, a melhor configuração inicial é pequena e somente leitura: `context`, `repos`, `pull_requests`, `actions`, `code_quality`, `code_security` e `secret_protection`, removendo toolsets sem uso. O servidor fornece modo `--read-only`, e o modo lockdown reduz conteúdo não confiável de repositórios públicos, embora a própria documentação avise que lockdown não é uma fronteira de autorização.

OAuth, GitHub App e PAT são suportados em cenários diferentes. A ferramenta visível no agente não garante que o token tenha escopo: tokens fine-grained e GitHub App podem deixar ferramentas aparentes e falhar somente quando a API aplica a permissão. Fontes: [repositório oficial e lista de toolsets](https://github.com/github/github-mcp-server), [configuração e modo somente leitura](https://github.com/github/github-mcp-server/blob/main/docs/server-configuration.md) e [filtragem por escopo](https://github.com/github/github-mcp-server/blob/main/docs/scope-filtering.md).

### 3. Playwright — adotar para QA, com CLI como padrão

O Playwright MCP oficial controla páginas a partir de snapshots estruturados de acessibilidade e cobre navegação, formulários, screenshots, rede e estado de armazenamento. Isso é valioso para validar o funil, links, responsividade e regressões do HTML estático em browsers reais.

O próprio README da Microsoft recomenda considerar Playwright CLI + skills para coding agents, reservando o MCP para loops interativos que precisam manter estado. Portanto, a adoção sugerida é CLI/testes versionados como caminho principal de QA e MCP como recurso opcional. Perfis persistentes guardam estado de login; no COWBOY, usar contexto isolado e sem credenciais é a opção adequada para páginas públicas. A ferramenta não deve ser usada para contornar o guard de navegador já observado. Fonte: [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp).

### 4. Vercel MCP — manter como integração da plataforma atual

Vercel já é a plataforma prevista no repositório, então seu MCP agrega operação sem migração: projetos, deployments, logs, documentação e dados de uso. O endpoint oficial é `https://mcp.vercel.com`, usa OAuth e está em beta em todos os planos. A Vercel avisa que o MCP recebe o mesmo alcance do usuário autenticado e recomenda confirmar o domínio oficial e usar consentimento explícito.

Nesta sessão, ferramentas Vercel estão expostas, mas a evidência operacional anterior é HTTP 403 e token inválido da CLI. Não se deve repetir chamadas nem tratar a conexão como válida até a autenticação e o acesso ao projeto serem restabelecidos pelo fluxo oficial. Fonte: [Vercel MCP oficial](https://vercel.com/docs/agent-resources/vercel-mcp) e [referência de ferramentas](https://vercel.com/docs/agent-resources/vercel-mcp/tools).

### 5. Codex Security — piloto opcional quando houver elegibilidade

Codex Security conecta diretamente a repositórios GitHub, cria um threat model específico do código, analisa o histórico, tenta validar achados em ambiente isolado e apresenta patches para revisão. A documentação afirma que ele não modifica o código automaticamente. Para esta base com funções serverless e integrações comerciais, pode complementar Gitleaks/Semgrep e revisão manual, mas depende de plano elegível e habilitação explícita do repositório.

No estado atual, aparece apenas no catálogo recomendado e não há ferramenta exposta. A pesquisa não comprova acesso ao produto. Fonte: [Codex Security — OpenAI Help Center](https://help.openai.com/en/articles/20001107-codex-security).

### 6. Canva MCP — complementar para ativos, não para código

O Canva possui MCP remoto oficial em `https://mcp.canva.com/mcp`, com geração e edição de designs, busca de arquivos, gestão de assets/brand kit, exportação e comentários. Ele pode acelerar banners e variações de criativos sem alterar a stack do site.

O uso pessoal em ferramentas populares passa por login individual; uma integração própria precisa registrar redirect URI, entrar na allowlist e aguardar análise. A documentação lista conta Canva de qualquer plano como pré-requisito, mas isso não prova disponibilidade de todos os recursos em todos os planos. Nesta sessão, Canva está apenas catalogado. Fontes: [documentação do Canva MCP](https://www.canva.dev/docs/mcp/) e [Canva Connect APIs](https://www.canva.dev/docs/connect/).

### 7. Cloudflare MCP — manter como opção condicional

Cloudflare oferece um MCP amplo (`https://mcp.cloudflare.com/mcp`) e servidores por domínio para documentação, bindings, builds, observabilidade, CASB e Radar. O uso faz sentido se o projeto adotar Cloudflare para DNS, proxy, WAF, observabilidade ou Workers. Adotá-lo agora duplicaria parte das capacidades já disponíveis na Vercel e aumentaria a superfície de conta e permissões.

Quando houver um caso concreto, preferir o servidor por domínio e token/OAuth com menor escopo possível. A documentação confirma que alguns recursos dependem de plano pago de Workers. Fontes: [Cloudflare MCP amplo](https://github.com/cloudflare/mcp) e [servidores MCP por domínio](https://github.com/cloudflare/mcp-server-cloudflare).

## Decisão recomendada para a stack atual

1. Usar Figma MCP em leitura como fonte do layout e dos assets quando a página for aprovada.
2. Usar GitHub MCP em modo somente leitura para contexto e revisão; habilitar escrita apenas para um fluxo de PR previamente autorizado.
3. Incorporar Playwright CLI/testes versionados ao QA e deixar o MCP opcional para exploração com estado.
4. Reparar o OAuth da Vercel pelo fluxo oficial antes de qualquer operação; manter Vercel como plataforma atual.
5. Avaliar Codex Security como piloto depois que o repositório e o plano elegível forem confirmados.
6. Usar Canva somente para peças e ativos que não sejam melhor atendidos pelo Figma/imagegen.
7. Considerar Cloudflare apenas diante de requisito claro de DNS/WAF/CDN/Workers que a configuração Vercel não resolva.

Sites permanece disponível como capacidade do ambiente, mas não entra na shortlist de adoção porque publicar por essa via criaria uma segunda plataforma. Pode servir como alternativa futura, mediante decisão explícita de arquitetura e verificação de acesso.

## Configuração técnica recomendada

A autorização prévia do proprietário continua válida para as ações já cobertas e não deve ser solicitada novamente. Autenticação, escopo e acesso ao recurso são requisitos técnicos de execução, não uma nova autorização comercial.

- Confirmar o responsável pela conta e o recurso exato: arquivo Figma, repositório GitHub ou projeto Vercel.
- Revisar permissões e preferir somente leitura quando o ciclo for de pesquisa ou revisão; conceder escrita quando ela for necessária ao trabalho já autorizado.
- Registrar a finalidade, os escopos, a validade e o responsável por revogar o acesso.
- Testar uma operação inofensiva de leitura e registrar a evidência; só então classificar a integração como autenticada/operacional.
- Não armazenar tokens no repositório. Para automação, usar o cofre de segredos da plataforma escolhida.
