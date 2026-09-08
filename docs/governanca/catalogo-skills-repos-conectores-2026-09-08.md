# Catálogo consolidado de skills, repositórios e conectores — COWBOY

Data: 08/09/2026  
Base técnica preservada: HTML/CSS/JavaScript estático, funções serverless em Node.js nativo e Vercel.

## Índice

1. [Resumo executivo](#resumo-executivo)
2. [Estados usados](#estados-usados)
3. [Plano de adoção](#plano-de-adoção)
4. [Catálogo por frente](#catálogo-por-frente)
5. [Combinação recomendada](#combinação-recomendada)
6. [Próximos passos](#próximos-passos)
7. [Relatórios de origem](#relatórios-de-origem)

## Resumo executivo

A stack atual é suficiente para reconstruir a página; nenhuma das opções pesquisadas exige migração para React ou troca de hospedagem. O conjunto mais coerente é usar `design-prompts-ia` + `imagegen` para explorar a linguagem visual, escolher **uma** voz de criação de interface (`frontend-design` como candidato-base ou Impeccable como alternativa/refinamento), levar o layout aprovado ao Figma e revisar o resultado com `web-design-guidelines`.

Para segurança, a base recomendada combina `security-best-practices` e `security-threat-model` com OWASP ASVS/WSTG; Gitleaks verifica segredos e Semgrep cobre padrões perigosos em JavaScript/Node. Playwright, Lighthouse e axe-core formam o núcleo de QA funcional, desempenho e acessibilidade. Scanner nenhum, isoladamente, comprova que o site está seguro ou acessível.

GitHub e Figma já têm ferramentas expostas nesta sessão, mas isso não prova autenticação ou permissão no recurso. Vercel também está exposto e continua sendo a plataforma correta, porém o estado operacional observado é 403/token inválido e precisa ser reparado pelo fluxo oficial. Canva é complementar para ativos; Cloudflare só entra se surgir um requisito concreto que a camada Vercel não atenda; Codex Security é um piloto opcional condicionado a elegibilidade e acesso.

Esta consolidação não instalou skill, pacote ou plugin; não executou scanner; não mudou permissões; não acessou segredo; não publicou o site.

## Estados usados

| Estado | Significado neste documento |
|---|---|
| **Disponível** | Skill ou ferramenta aparece no ambiente da sessão. Ainda pode exigir conta, autenticação ou permissão no recurso. |
| **Disponível com bloqueio** | Ferramenta aparece, mas há evidência operacional atual de falha de acesso. |
| **Catalogado** | Produto consta na lista de plugins recomendados, sem ferramenta correspondente exposta. |
| **Candidato** | Recurso oficial localizado em fonte primária, mas ausente do ambiente ou do PATH verificado. |
| **Referência** | Padrão ou guia usado para critérios; não é ferramenta executável. |

O gerenciador de plugins presente expõe apenas consulta de permissões/dependências, alteração de permissões e remoção. Como `search_plugins`, `suggest_plugins` e `tool_search/search_tools` não estão disponíveis, o catálogo é uma seleção fundamentada, não uma enumeração exaustiva do marketplace.

## Plano de adoção

| Faixa | Recurso | Estado real | Papel | Decisão |
|---|---|---|---|---|
| P1 | `design-prompts-ia` + `imagegen` | Disponível | Briefing, direção de arte e imagens de referência | Usar para comparar 2–3 direções visuais e produzir os assets aprovados |
| P1 | [`frontend-design`](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Candidato | Direção e implementação visual em HTML/CSS/JS | Candidato-base para a reconstrução; revisar a versão antes de adotar |
| Alternativa | [Impeccable](https://github.com/pbakaus/impeccable) | Candidato | Crítica, acabamento, tipografia e layout | Usar como alternativa ao `frontend-design` ou refinamento pontual; não empilhar as duas diretivas no mesmo ciclo |
| P1 | [Figma MCP](https://developers.figma.com/docs/figma-mcp-server/) | Disponível; autenticação não verificada | Layout editável, assets, variáveis, screenshots e design-to-code | Usar como ponte de design quando houver arquivo/frame definido |
| P1 | [`web-design-guidelines`](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines) | Candidato | Revisão de interface, foco, formulários, animação, imagens e UX | Aplicar depois do primeiro rascunho; não substitui direção de arte |
| P1 | [`security-best-practices`](https://github.com/openai/skills/blob/main/skills/.curated/security-best-practices/SKILL.md) + [`security-threat-model`](https://github.com/openai/skills/blob/main/skills/.curated/security-threat-model/SKILL.md) | Candidato | Revisão de JavaScript/Node e modelo de ameaças baseado no repositório | Aplicar antes de scanners e ligar achados a arquivos/fluxos reais |
| P1 | [Gitleaks](https://github.com/gitleaks/gitleaks) + [Semgrep CE](https://github.com/semgrep/semgrep) | Candidato; comandos não encontrados no PATH observado | Segredos em arquivos/histórico e análise estática JavaScript/Node | Adotar de forma delimitada, fixando versão e sanitizando relatórios |
| P1 | [Playwright](https://github.com/microsoft/playwright-mcp) + [Lighthouse](https://github.com/GoogleChrome/lighthouse) + [axe-core](https://github.com/dequelabs/axe-core) | Candidatos; Playwright/Lighthouse não encontrados no PATH; axe-core não verificado | Fluxos E2E, desempenho/boas práticas/SEO e acessibilidade automatizada | Preferir Playwright CLI + testes versionados; usar MCP somente quando o loop precisar de estado |
| P1 operacional | [GitHub MCP Server](https://github.com/github/github-mcp-server) | Disponível; autenticação/repo não verificados | Contexto do repo, PRs, Actions e sinais de segurança | Começar com toolsets mínimos e somente leitura |
| P2 operacional | [Vercel MCP](https://vercel.com/docs/agent-resources/vercel-mcp) | Disponível com bloqueio 403/token inválido | Deployments, logs, documentação e analytics da plataforma atual | Manter Vercel; reparar OAuth oficial antes de operar |
| P2 opcional | [Codex Security](https://help.openai.com/en/articles/20001107-codex-security) | Catalogado | Threat model, validação de vulnerabilidades e patches revisáveis | Piloto apenas se plano e repositório forem elegíveis |
| Complementar | [Canva MCP](https://www.canva.dev/docs/mcp/) | Catalogado | Criativos, brand kit, assets e exportação | Usar quando agregar ao fluxo Figma/imagegen; não usar para arquitetura ou código |
| Condicional | [Cloudflare MCP](https://github.com/cloudflare/mcp) | Catalogado | DNS, CDN, WAF, Workers e observabilidade Cloudflare | Avaliar só diante de requisito concreto; Vercel já fornece hospedagem e firewall |
| Alternativa de plataforma | Sites | Disponível; acesso a site não verificado | Construção e hospedagem integrada | Não adotar no ciclo atual para evitar uma segunda plataforma |

## Catálogo por frente

### Design e construção da página

- **Disponíveis:** `design-prompts-ia`, `imagegen`, `canvas-design`, as skills Figma de geração/design-to-code e as ferramentas Figma expostas. `canvas-design` é mais adequado a moodboards/peças do que à landing viva.
- **Candidato-base:** [`frontend-design`](https://github.com/anthropics/skills/tree/main/skills/frontend-design), compatível com HTML/CSS/JS e licenciado em Apache-2.0 no diretório oficial da skill.
- **Alternativa/refinamento:** [Impeccable](https://github.com/pbakaus/impeccable), Apache-2.0. Sua instalação pode adicionar skills, hooks e contexto; revisar esses efeitos antes de adotar.
- **Revisão:** [`web-design-guidelines`](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines), no repositório MIT da Vercel Labs. Entra após existir uma proposta visual.
- **Complementos condicionais:** [Motion](https://github.com/motiondivision/motion) para poucos momentos de destaque com `prefers-reduced-motion`; [Lucide](https://lucide.dev/guide/lucide) para ícones consistentes. Ambos agregam dependência e só devem entrar se a direção aprovada precisar deles.
- **Fora da rota principal:** `shadcn/ui` e migração para React não resolvem por si a identidade visual e ampliariam a stack sem necessidade atual.

### Segurança de código e entrega

- **Skills candidatas:** [`security-best-practices`](https://github.com/openai/skills/blob/main/skills/.curated/security-best-practices/SKILL.md) para frontend JavaScript e servidor; [`security-threat-model`](https://github.com/openai/skills/blob/main/skills/.curated/security-threat-model/SKILL.md) para ativos, fronteiras e caminhos de abuso. [`security-ownership-map`](https://github.com/openai/skills/blob/main/skills/.curated/security-ownership-map/SKILL.md) fica para quando o histórico e o número de mantenedores justificarem.
- **Referências:** [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) para critérios verificáveis e [OWASP WSTG](https://owasp.org/www-project-web-security-testing-guide/) para roteiros de teste. Usar IDs e versões; checar alguns itens não autoriza declarar conformidade integral.
- **P1 local:** [Gitleaks CLI](https://github.com/gitleaks/gitleaks) para segredos e [Semgrep CE](https://github.com/semgrep/semgrep) para padrões perigosos. Semgrep CE anuncia suporte nativo ao Windows desde 2025; WSL/Docker são opções, não requisitos universais. Licenças das regras devem ser verificadas separadamente do motor.
- **P2 em ambiente próprio:** [ZAP Baseline](https://www.zaproxy.org/docs/docker/baseline-scan/) somente contra local/preview delimitado, excluindo Cartpanda, Melhor Envio e terceiros. Mesmo passivo, o spider gera tráfego.
- **Condicional:** [Trivy](https://github.com/aquasecurity/trivy) ganha valor quando houver dependências, lockfiles ou artefatos relevantes. O pacote atual não declara dependencies/devDependencies.
- **Aprofundamento:** [Trail of Bits skills](https://github.com/trailofbits/skills) pode apoiar contexto de auditoria e revisão de diferenças quando houver achado concreto; não é necessário carregar os módulos alheios à stack.

### QA funcional, visual, desempenho e acessibilidade

- **Playwright:** o [repositório oficial do MCP](https://github.com/microsoft/playwright-mcp) informa que coding agents podem se beneficiar de CLI + skills. Esse caminho produz testes reproduzíveis e economiza contexto; MCP fica para navegação interativa com estado. Perfis isolados evitam reaproveitar cookies/sessões.
- **Lighthouse:** [projeto oficial](https://github.com/GoogleChrome/lighthouse) para performance, acessibilidade, boas práticas e SEO. A pontuação é sinal técnico, não medida de conversão.
- **axe-core:** [projeto oficial](https://github.com/dequelabs/axe-core) para regras automatizadas de acessibilidade. Não é scanner de segurança e não substitui teste manual de teclado, leitura e compreensão.
- **Guard do navegador:** a automação não deve contornar o guard já observado. Se o ambiente bloquear captura ou navegação, registrar a limitação e usar teste local autorizado ou evidência de build.

### Conectores e contas

- **Figma:** 33 ferramentas estão expostas, mas OAuth, seat e acesso ao arquivo não foram comprovados. O servidor oficial restringe acesso ao que a conta já pode ver/editar e aplica [limites por plano e seat](https://developers.figma.com/docs/figma-mcp-server/rate-limits-access/).
- **GitHub:** 89 ferramentas estão expostas; escopos e acesso ao repositório não foram testados. O servidor oficial oferece [modo somente leitura e toolsets](https://github.com/github/github-mcp-server/blob/main/docs/server-configuration.md). Ferramenta visível pode falhar quando a API aplicar permissões de PAT fine-grained ou GitHub App.
- **Vercel:** 24 ferramentas estão expostas, mas o estado atual é bloqueado. O MCP oficial usa OAuth em `https://mcp.vercel.com` e dá ao cliente o alcance do usuário conectado. Está em beta em todos os planos; isso não comprova gratuidade de consumo.
- **Canva:** está catalogado, sem ferramenta exposta. O MCP oficial usa `https://mcp.canva.com/mcp`, exige login individual e, para integração própria, allowlist/análise. A documentação informa conta de qualquer plano como pré-requisito, sem garantir todos os recursos em todos os planos.
- **Cloudflare:** está catalogado, sem ferramenta exposta. Há servidor amplo e servidores por domínio; alguns recursos exigem plano pago de Workers. Para o COWBOY, só faz sentido com requisito explícito de Cloudflare.
- **Codex Security:** está catalogado, sem ferramenta exposta. A OpenAI o documenta como research preview para ChatGPT Enterprise, Edu, Business e Pro, conectado a repositórios GitHub e com patches para revisão humana, sem modificação automática.

Custos não confirmados nas fontes oficiais consultadas são tratados como **não verificados**. Licença open source não implica ausência de custo de conta, execução, hospedagem ou serviço associado.

## Combinação recomendada

```text
briefing e referências
  └─ design-prompts-ia + imagegen
       └─ frontend-design OU Impeccable
            └─ Figma (layout/assets aprovados)
                 └─ implementação HTML/CSS/JS
                      ├─ web-design-guidelines
                      ├─ security-best-practices + threat model
                      ├─ Gitleaks + Semgrep
                      └─ Playwright + Lighthouse + axe-core
                           └─ preview/deploy Vercel após reparar OAuth
```

Canva pode alimentar o ramo de assets. Codex Security pode aprofundar a revisão do repositório. Cloudflare permanece fora do fluxo até existir demanda de infraestrutura específica.

## Próximos passos

1. Fechar o briefing e escolher uma das direções de criação: `frontend-design` como base ou Impeccable como alternativa/refinamento.
2. Produzir 2–3 referências com as skills já disponíveis e registrar a direção escolhida antes de tocar na página.
3. Confirmar um arquivo/frame Figma e verificar uma leitura inofensiva; só então classificar Figma como autenticado para esse recurso.
4. Definir critérios ASVS/WSTG aplicáveis e um threat model curto para checkout, frete, scripts externos e configuração de entrega.
5. Avaliar e versionar Gitleaks, Semgrep, Playwright, Lighthouse e axe-core; instalar apenas o conjunto aprovado para o ciclo, após revisar licença e comandos da versão exata.
6. Executar QA e scanners somente em repositório/local/preview próprios, com relatórios sanitizados e terceiros fora do escopo de crawling.
7. Reparar o OAuth Vercel no fluxo oficial e verificar o time/projeto antes de qualquer operação de deploy ou leitura autenticada.
8. Considerar Canva, Codex Security ou Cloudflare apenas quando o caso de uso e a conta necessária estiverem definidos.

## Relatórios de origem

- [Pesquisa de design](./pesquisa-design-skills-2026-09-08.md)
- [Pesquisa de segurança](./pesquisa-seguranca-2026-09-08.md)
- [Pesquisa de conectores](./pesquisa-conectores-2026-09-08.md)
