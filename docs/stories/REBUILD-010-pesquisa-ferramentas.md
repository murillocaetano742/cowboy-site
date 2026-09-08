# REBUILD-010 — Pesquisa de ferramentas para página, design e segurança

Status: Concluída — pesquisas e catálogo consolidado prontos para decisão

## Objetivo

Pesquisar e priorizar skills, repositórios e conectores especializados para a reconstrução do site COWBOY, preservando HTML/CSS/JavaScript, funções Node e Vercel, sem instalar ferramentas nem operar contas externas durante a pesquisa.

## Critérios de aceitação

- [x] Levantar recursos de design com fonte primária, compatibilidade e licença verificada quando disponível.
- [x] Levantar recursos de segurança para código, segredos, endpoints, navegador e entrega, sem acessar `.env` ou executar scanners.
- [x] Levantar conectores/MCPs e separar ferramenta exposta, item catalogado, autenticação e permissão não comprovadas.
- [x] Registrar custos somente quando houver comprovação oficial e marcar os demais como não verificados.
- [x] Consolidar adoção em P1, P2, alternativa, complementar ou condicional, sem recomendar migração de stack.
- [x] Manter Canva e Cloudflare como opções condicionadas ao caso de uso; manter Codex Security condicionado a elegibilidade.
- [x] Não instalar plugin/skill/pacote, não alterar permissões e não publicar o site.

## Decisões

- `design-prompts-ia` + `imagegen` são a base já disponível para exploração visual.
- `frontend-design` é o candidato-base; Impeccable é alternativa/refinamento e não deve disputar o mesmo ciclo de direção.
- `web-design-guidelines` revisa uma proposta já criada.
- `security-best-practices`, `security-threat-model`, Gitleaks e Semgrep formam a primeira camada de segurança.
- Playwright CLI/testes versionados, Lighthouse e axe-core formam a primeira camada de QA.
- Figma e GitHub têm ferramentas expostas sem prova de autenticação no recurso; Vercel permanece a plataforma atual, com OAuth a reparar.

## File List

- `docs/stories/REBUILD-010-pesquisa-ferramentas.md`
- `docs/governanca/pesquisa-design-skills-2026-09-08.md`
- `docs/governanca/pesquisa-seguranca-2026-09-08.md`
- `docs/governanca/pesquisa-conectores-2026-09-08.md`
- `docs/governanca/catalogo-skills-repos-conectores-2026-09-08.md`

## Verificação

- Os três relatórios de origem existem e usam fontes primárias.
- O catálogo distingue recurso disponível, disponível com bloqueio, catalogado, candidato e referência.
- Nenhum recurso foi instalado ou executado como parte desta story.

