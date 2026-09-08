# REBUILD-016 — Publicação aprovada de Cowboy Nova

Status: Correções restritas validadas; aguardando atualização da PR e novo preview antes de merge/deploy.

## Objetivo

Publicar a versão aprovada pelo proprietário, correspondente a `cowboy-nova.html` na prévia local e à PR #1 do repositório `murillocaetano742/cowboy-site`, sem incorporar os candidatos paralelos ou conteúdo fora do pacote público.

## Critérios

- [x] Confirmar a origem e o commit da PR #1 em relação à prévia aprovada e ao workspace.
- [ ] Confirmar projeto, domínio, runtime e integrações configuradas no Vercel sem expor segredos.
- [x] Preparar artefato isolado a partir da versão aprovada, preservando trabalho concorrente local.
- [x] Executar checks de build, sintaxe e integrações aplicáveis ao artefato aprovado.
- [x] Reportar a comparação e o plano de deploy à coordenação antes de merge ou deploy.
- [ ] Publicar somente após a comparação interna registrada e verificar a URL resultante.

## File List

- `docs/stories/REBUILD-016-publicacao-aprovada.md`

## Registro inicial

- A PR #1 está aberta, é mergeable e parte de `d4c726d`; o head aprovado é `89adad3d08167231d190890f43c6738241795b35` em `feat/pagina-nova`.
- A comparação normalizada de quebras de linha confirmou que `cowboy-nova.html`, CSS, JS, build, ignore, Vercel, termos, robots e sitemap de `89adad3` correspondem ao workspace/previsão local aprovada. O checkout isolado está em `.local/rebuild-016-pr1`.
- Repositório local em `main`, no commit `d4c726d`, contém alterações concorrentes não versionadas; ele não será usado como origem de publicação.
- `vercel.json` define build estático com funções `api/*.js` e rewrite `/nova` para `cowboy-nova.html`.
- O check Vercel atual da PR falhou; a exclusão de ativos necessários em `.vercelignore` é uma hipótese técnica a ser revalidada no novo check, não uma causa confirmada.
- Produção atual: `https://cowboyenergiamasculina.com.br/` respondeu 200 em 8 de setembro de 2026 e permanece como referência de rollback até a promoção.

## Ajustes restritos preparados

- O build público passa a entregar apenas COWBOY Nova, suas páginas legais, ativos declarados e vídeos; `index.html` no output é a cópia da página aprovada e `/nova` é mantido como alias.
- `/loja` e `/loja.html` redirecionam para `/`, preservando referências existentes sem reativar a página antiga.
- Meta robots da página aprovada passa a `index,follow`; o canonical permanece na raiz, que entrega a mesma página aprovada.
- Termos passam a descrever a garantia comercial aprovada de 30 dias contados do recebimento, o valor coberto, o SAC e a coexistência do direito legal de arrependimento. A redação evita prazos operacionais, frete de devolução ou condições não confirmadas.
- Referências primárias consultadas: [CDC, art. 49 e 50](https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm) e [Decreto 7.962/2013](https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/decreto/d7962.htm).

## Verificação do checkout isolado

- `npm.cmd run build`: passou, com 37 arquivos públicos na allowlist.
- `npm.cmd run lint`: passou, com sintaxe JavaScript verificada.
- `npm.cmd run check:build`: passou, incluindo isolamento do output e referências locais.
- `npm.cmd test`: passou, 24 testes de integração e QA; cobre kits, frete falhando fechado, checkout/UTM, páginas de entrada e vídeos.
- Verificação adicional confirmou `index.html` no output e texto público em UTF-8, sem caracteres de substituição.

## File List do patch técnico

- `.env.example`
- `.vercelignore`
- `api/checkout.js`
- `assets/css/cowboy-nova.css`
- `config/commerce.js`
- `cowboy-nova.html`
- `privacidade.html`
- `scripts/build-site.js`
- `scripts/check-build.js`
- `termos.html`
- `tests/integrations/commerce.test.js`
- `vercel.json`
