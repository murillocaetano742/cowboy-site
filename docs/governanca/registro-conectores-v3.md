# Registro de conectores — COWBOY V3

Data da verificação: 08/09/2026.

Este registro distingue disponibilidade da ferramenta, autenticação da conta e acesso efetivo ao recurso. Uma ferramenta exposta ou um item no catálogo não comprova conexão nem permissão operacional.

| Conector | Ferramenta exposta | Autenticação/acesso comprovado | Uso nesta execução | Estado |
|---|---|---|---|---|
| GitHub | Sim | Repositório público `murillocaetano742/cowboy-site` lido com a conexão autenticada; o principal reportou acesso ao repositório | Leitura do repositório e das referências imutáveis usadas para skills e fontes | Operacional para leitura; nenhuma escrita, branch, commit ou push |
| Figma | Sim | `whoami` identificou uma conta conectada e um plano Starter/View | Criado o arquivo editável **COWBOY Energia — Direção V3** e o frame de direção com oito seções, paleta, tipografia e limites de copy | Artefato histórico da exploração, não direção final após o proprietário preferir a primeira prévia; screenshot não ocorreu porque a cota de chamadas do plano foi atingida |
| Vercel | Sim | A ferramenta respondeu, mas `get_project` para o projeto e time locais retornou HTTP 403 `INVALID_ARGUMENT` | Uma única verificação após o novo pedido | Acesso ao projeto não comprovado; sem nova tentativa e sem preview remoto |
| Cloudflare | Não | Não aplicável | Nenhum | Plugin aparece apenas no catálogo recomendado; não foi instalado nem conectado |
| Codex Security | Não | Não aplicável | Nenhum | Plugin aparece apenas no catálogo recomendado; não foi instalado nem conectado |
| Canva | Não usado | Não aplicável | Nenhum | Excluído expressamente pelo proprietário |

Artefato Figma histórico: [COWBOY Energia — Direção V3, frame 2:2](https://www.figma.com/design/Mkc1yKLZjwSLzLZ7erx0ba?node-id=2-2). Ele registra a exploração feita e não substitui a versão visual escolhida pelo proprietário.

## Limites e próximos passos técnicos

- O preview desta iteração permanece local até a autenticação e o acesso ao projeto Vercel serem restabelecidos pelo fluxo oficial. A autorização prévia do proprietário continua válida e não será solicitada novamente para ações já cobertas; requisitos técnicos de acesso não constituem nova autorização comercial.
- Cloudflare seria uma alternativa condicional de infraestrutura, e não uma segunda hospedagem obrigatória. Codex Security continua opcional conforme elegibilidade e acesso. Nenhum dos dois tem ferramenta callable nesta sessão.
- O diretório de plugins expõe apenas operações de permissões, dependências, atualização e remoção. Não há busca de catálogo callable. O mecanismo genérico de solicitação de instalação não foi usado porque nenhuma dessas instalações é necessária para entregar a V3 atual.
- A configuração técnica recomendada para futuras conexões é usar escopos proporcionais à operação necessária e verificar separadamente conta, recurso e permissão efetiva.
