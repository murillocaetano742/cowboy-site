# RELEASE-017 — Publicar atualização dos kits e verificar integrações

Status: Em validação.

## Objetivo

Publicar os seis commits posteriores ao PR #1, incluindo kit de 3 frascos e fotos dos quatro kits, corrigindo o pacote Vercel e preservando as correções de produção. Relatar as pendências verificadas das integrações.

## Critérios de aceitação

- [x] Confirmar branch, commits e falha de preview no GitHub.
- [x] Conciliar a atualização com `main` sem retirar a correção dos controles mobile.
- [x] Incluir todas as fotos exigidas pelo build no pacote enviado à Vercel.
- [x] Executar build, verificação do pacote, lint e testes aplicáveis.
- [ ] Obter preview com sucesso antes do merge de produção.
- [ ] Publicar pelo fluxo GitHub/Vercel e verificar domínio, imagens e redirecionamentos.
- [ ] Documentar estado real de Cartpanda, Melhor Envio, Google, Pixel e UTMify.

## Evidências iniciais

- PR #1 já integrado; atualização em `d96a8103210ae2ef05686c7efa256b73d626e1aa`.
- Produção anterior: `651ee257676d3691febc16bcf148dc5cdeb081f6`, check Vercel `success`.
- Preview de `d96a810`: `failure`, deployment `dpl_7fK35ew42bcMwszS5mLtvXsM9NV3`.
- `.vercelignore` exclui `imagens/kits/`, mas o build exige as quatro imagens dessa pasta. Logs privados retornam 403; a causa no pacote foi identificada por inspeção e será confirmada pelo novo preview.
- API Cartpanda respondeu 200; kit 3 custa R$ 127,14, variante 212751381, porém `requires_shipping=0`.
- `check:build`: 38 arquivos públicos e referências locais validados; lint: 30 arquivos JavaScript; `npm test`: 26/26. Typecheck não se aplica: projeto JavaScript sem script TypeScript.

## File List

- `.vercelignore`
- `assets/css/cowboy-nova.css` (conciliação das correções de produção)
- `docs/stories/RELEASE-017-kits-e-integracoes.md`
