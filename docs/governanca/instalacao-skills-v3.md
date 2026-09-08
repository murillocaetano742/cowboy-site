# Instalação de skills e dependências visuais — COWBOY V3

Data da verificação: 08/09/2026.

## Resultado

As seis skills selecionadas foram instaladas globalmente em `C:\Users\User\.codex\skills`. A instalação global foi autorizada pelo proprietário e feita com o helper oficial `skill-installer`, usando download de subárvore por referência imutável. O helper recusa destino existente, valida caminhos e presença de `SKILL.md`, copia somente a skill e apaga o diretório temporário. Nenhuma skill existente foi sobrescrita.

As skills instaladas ficam disponíveis para descoberta automática a partir do próximo turno. Seus arquivos já podem ser lidos neste turno.

| Skill | Origem e caminho | Ref fixada | SHA-256 de `SKILL.md` |
|---|---|---|---|
| `frontend-design` | [`anthropics/skills`, `skills/frontend-design`](https://github.com/anthropics/skills/tree/41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f/skills/frontend-design) | `41bbe19d1a1a7eaab5e7bb9050a417e5c6cffc8f` | `D91970639E9F5C37682AC7AB60094D35F1C7C1F38D731BD56396563AEE10C1D3` |
| `impeccable` | [`pbakaus/impeccable`, `.agents/skills/impeccable`](https://github.com/pbakaus/impeccable/tree/2bc2879276c1f321a53c4ca99d3371e411329b52/.agents/skills/impeccable) | `2bc2879276c1f321a53c4ca99d3371e411329b52` | `0C20E5619CE94704F8A86B64E26F350ADE0C6FB86B6B886C2881C01CAEC5A662` |
| `ui-ux-pro-max` | [`nextlevelbuilder/ui-ux-pro-max-skill`, `.claude/skills/ui-ux-pro-max`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/4aad0584d92131626b16d4ff4d77f0455385013c/.claude/skills/ui-ux-pro-max) | `4aad0584d92131626b16d4ff4d77f0455385013c` | `EA087C341BFB5B23195C7302027268EDE86DA802554C18A5C4896A6017B439F9` |
| `web-design-guidelines` | [`vercel-labs/agent-skills`, `skills/web-design-guidelines`](https://github.com/vercel-labs/agent-skills/tree/063bee94c3f4df8453406c830b0a7df0f2860278/skills/web-design-guidelines) | `063bee94c3f4df8453406c830b0a7df0f2860278` | `F4647CA866A3ACCF763777F83E7682954F0187CD6BEA7EEA0399796652414E8F` |
| `security-best-practices` | [`openai/skills`, `skills/.curated/security-best-practices`](https://github.com/openai/skills/tree/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/security-best-practices) | `49f948faa9258a0c61caceaf225e179651397431` | `7B3DAE1FFC5434D890F3C65C8F552AF52D0307FAB3B35DEC13013C9CA3844C4F` |
| `security-threat-model` | [`openai/skills`, `skills/.curated/security-threat-model`](https://github.com/openai/skills/tree/49f948faa9258a0c61caceaf225e179651397431/skills/.curated/security-threat-model) | `49f948faa9258a0c61caceaf225e179651397431` | `1283C0DD62A8104D9EDDA4583569B5D8510B4DDAA45120687C999250FD96BAD2` |

## Revisão de scripts e hooks

- O helper `install-skill-from-github.py` foi lido antes da execução. Ele não executa código da skill baixada.
- `frontend-design`, `web-design-guidelines`, `security-best-practices` e `security-threat-model` não trouxeram executáveis ou hooks ativos na subárvore instalada. `web-design-guidelines` orienta buscar a versão publicada das diretrizes quando for usada.
- `ui-ux-pro-max` inclui scripts Python de consulta a dados locais e persistência opcional de design system. O fluxo de consulta é local; persistência e `--force` podem escrever ou sobrescrever arquivos do projeto e não foram executados.
- `impeccable` inclui lançadores e documentação de hooks. O launcher Windows pode baixar um binário de release, validar o arquivo `.sha256` e executá-lo; a configuração de hooks pode criar manifests no projeto e exige ativação explícita no Codex. Nenhum launcher, instalador complementar ou hook foi executado ou ativado.
- Nenhum script pertencente às seis skills foi executado durante a instalação.

## Three.js versionado

O visualizador usa arquivos locais de [`three@0.185.1`](https://www.npmjs.com/package/three/v/0.185.1). O pacote oficial foi obtido com `npm pack --ignore-scripts`; nenhum lifecycle script foi executado. Não houve alteração de `package.json` por esta instalação.

- `assets/vendor/three-0.185.1/three.module.min.js` — SHA-256 `86BCEE248B64F44BCFC23C331AE74619061957D59CAB040171DCB6FB5900BEB6`
- `assets/vendor/three-0.185.1/three.core.min.js` — SHA-256 `05B2609338C76CD65DAF74F3AC515BC9A5045E1B3B33EDC07D8C9BD55250FA90`
- `assets/vendor/three-0.185.1/LICENSE` — SHA-256 `8B378EBE60E2FE500158CB0AC71CB5E8B7D92953C2ABCC63A0EB90499653B5BC`

O servidor local entrega os dois módulos com `Content-Type: text/javascript`.

## Fontes versionadas

As fontes da V3 vieram do repositório oficial [`google/fonts`](https://github.com/google/fonts/tree/5e35378e6bda803962ee6fd257e444a7d459660d), commit `5e35378e6bda803962ee6fd257e444a7d459660d`. Foram copiados apenas os arquivos estáticos usados, sem CDN ou scripts:

- `assets/fonts/v3/rye-regular.ttf`
- `assets/fonts/v3/barlow-regular.ttf`, `barlow-semibold.ttf` e `barlow-bold.ttf`
- `assets/fonts/v3/barlow-condensed-semibold.ttf` e `barlow-condensed-bold.ttf`
- `assets/fonts/v3/OFL-Rye.txt`, `OFL-Barlow.txt` e `README.md`

Os hashes, arquivos de origem e licenças SIL OFL 1.1 estão em `assets/fonts/v3/README.md`. O servidor local entrega os arquivos `.ttf` com `Content-Type: font/ttf`.

Após o proprietário preferir a primeira direção visual, Rye e Barlow foram retiradas da tipografia efetivamente aplicada: a versão comparável voltou a usar Georgia/serif no display e fontes de sistema no corpo. Os arquivos licenciados permanecem versionados como dependências disponíveis, sem definir a direção final da V3.

## Estado operacional local

O processo que ocupava a porta 4173 foi identificado pelo comando `node --env-file-if-exists=.env.local scripts/serve-site.js`, encerrado pelo PID confirmado e reiniciado oculto a partir deste repositório. Em 08/09/2026, `cowboy-v3.html`, Rye, Barlow e os dois módulos Three.js responderam HTTP 200. Arquivos concorrentes `cowboy-360` foram preservados e não fazem parte da evidência da V3.
