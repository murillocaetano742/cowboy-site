# AUD-001 — Auditoria da página e oferta COWBOY Energia

Status: Concluída — auditoria e documentação

## Solicitação

Auditar o projeto VS_CODE, documentar informações importantes sobre página, produto, oferta e promessas e preparar a melhoria do funil antes do teste de 10 criativos informado pelo proprietário.

## Critérios de aceitação

- [x] Inventariar páginas, materiais, oferta e caminhos de conversão nos arquivos locais.
- [x] Distinguir evidências do código, dados comerciais não confirmados e hipóteses.
- [x] Conferir orientação pública oficial sobre alegações de suplementos e comércio eletrônico.
- [x] Entregar relatório com prioridades, proposta de oferta e estrutura da página.
- [x] Preparar matriz dos 10 criativos e plano de mensuração/teste sem inventar resultados.
- [x] Conferir cálculos e referências locais dos entregáveis.

## Escopo e limites

Auditoria e documentação. Esta story não implementa a nova página nem publica alterações, campanhas ou mensagens. Não houve compra. Não existem arquivos locais da Constitution ou do framework AIOX na raiz inspecionada; aplicadas as instruções AGENTS.md fornecidas na conversa. O navegador da sessão não apresentou instâncias disponíveis. O acesso público via ferramenta de pesquisa à página e aos checkouts também não permitiu validar o fluxo em produção. Essas limitações serão explícitas no relatório.

## File List

- `docs/stories/AUD-001-auditoria-cowboy.md`
- `docs/auditorias/2026-09-07/relatorio-cowboy.md`
- `docs/auditorias/2026-09-07/relatorio-cowboy.html`
- `docs/auditorias/2026-09-07/inventario.json`
- `docs/auditorias/2026-09-07/matriz-10-criativos.csv`
- `docs/auditorias/2026-09-07/gerar-inventario.py`
- `docs/auditorias/2026-09-07/renderizar-relatorio.py`

## Verificação

Conferidos: presença de todas as mídias locais referenciadas; matemática dos três kits; sintaxe de 8 scripts JavaScript e 3 blocos JSON-LD; relatório HTML com 16 seções, 13 tabelas e 28 links; matriz CSV com 10 registros e 17 colunas; ausência de caracteres de substituição nos entregáveis; referências locais e âncoras do relatório válidas. `git diff --name-only` não apontou alteração em arquivos de produção; status mostra somente a nova documentação em `docs/`.

Não se aplicam npm lint/typecheck/test: projeto estático sem package.json, sem alteração de código de produção. Verificações de navegador, layout renderizado, checkout real, pagamentos e eventos de plataforma permanecem pendentes para a story de implementação; essa limitação não é interpretada como falha do site.

## Diretriz adicional incorporada

O proprietário informou que considera o produto de “nicho black” e deseja oferta e promessa muito agressivas. O relatório incorpora copy comercial mais direta, comparação objetiva dos kits e hipóteses de primeira dobra, mantendo explícitos os limites da documentação de produto e retirando da recomendação simulações de demanda e alegações terapêuticas para o suplemento.
