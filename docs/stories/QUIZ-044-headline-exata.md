# QUIZ-044 — Manchete exata da capa

Status: headline publicada e verificada; imagem adicional não concluída por bloqueio da ferramenta, foto atual preservada.

## Pedido e base

Trocar o H1 da capa `/quiz/v3-editorial/` por: “Chega de broxar e de gozar rápido no momento em que sua mulher mais te quer firme.” Preservar metadata, subtítulo, CTA, questionário, tracking, integrações e demais versões. Ajuste responsivo somente se estritamente necessário e aprovado na QA.

Durante a validação da manchete, o proprietário também solicitou editar a imagem existente, mantendo a composição e o casal adulto em direções opostas, com homem de cueca e mulher de calcinha e sutiã. O imagegen bloqueou a solicitação na entrada (`HTTP 400`, `moderation_blocked`, categoria sexual); nenhuma imagem foi gerada. Não houve repetição nem tentativa de contorno. Root informou o usuário e definiu publicar a manchete mantendo a foto atual. O pedido adicional de imagem não foi concluído; nenhum asset ou registro de geração bem-sucedida é alegado.

Worktree reutilizada `.local/quiz-038-vsl`, branch `feat/quiz-044-headline`, a partir do fechamento local `daa039638d56851d711f381d009d9095bfe812b4`. Fetch confirmou produção `475f7d7a19f788ed01dc273e6f42d380208dad62`, sem alterações locais anteriores.

## Critérios de aceite

- [x] H1 corresponde exatamente à frase solicitada.
- [x] Imagem existente e todo o restante preservados; headline legível e sem overflow em mobile/desktop.
- [x] Lint, TypeScript, testes, build/check:build e QA independente aprovados.
- [x] GO root/QA, PR com SHA exato, deploy automático READY e verificação pública concluídos.

## Coordenação e publicação

Root edita a manchete, QA valida, @devops mantém story/gates/Git/publicação. Servidor de QA previsto em 4414. Rollback confirmado READY: `dpl_Fm7F5c6PzxQdfEumDi1doiwZUtwB`, URL `https://cowboy-site-rcwihhg9x-murillo-digital.vercel.app`. Manter quatro rotas e homepage; fechamento documental local sem novo deploy. Nenhuma nova configuração ou homologação externa está incluída.

## Validação

Diff funcional final restrito a uma inserção e uma remoção no H1 de `quiz-editorial.tsx`, com a frase exata solicitada. Nenhuma alteração em metadata, subtítulo, CTA, CSS, imagem, estrutura, handlers ou integrações. Lint JavaScript de 52 arquivos e ESLint, TypeScript, 100 testes (55 site, 16 fluxo, 29 tracking), build/check:build e `git diff --check` aprovados. Exportação com 131 arquivos e quatro entradas HTML. O artefato em 4414 corresponde à fonte final, sem necessidade de rebuild após a tentativa bloqueada de imagem.

QA independente aprovou 2/2 E2E em 1,6 segundo e inspeção em quatro viewports sem overflow. CTA totalmente acima da dobra inclusive em 375×667 pixels (borda inferior em 617 pixels). Root inspecionou 375×667 e 1440, aprovou o layout e concedeu GO final para publicar somente a manchete com foto existente. Capturas e evidência preservadas localmente em `test-results/quiz-044/`; nenhum arquivo de teste alterado nesta rodada.

## Fechamento da publicação

- PR [#28](https://github.com/murillocaetano742/cowboy-site/pull/28), commit de implementação `69b8b7dc02d62a459abd7a34cf137610749c6936`, apenas H1 e story. Dois checks Vercel aprovados antes do merge do SHA exato.
- Produção `56ba5bbf2b58abef3e17620fdfed480aeea30b69`, merge em 14/10/2026 às 00:05:20 UTC (13/10, 21:05 em Brasília). Deploy automático `dpl_FW1rEcQaCzL1rWvzevPxXdPdSAAm`, status READY, sem publicação manual duplicada.
- Deployment imutável `https://cowboy-site-3vinlmc3u-murillo-digital.vercel.app`; aliases canônicos com e sem `www` confirmados. [Capa publicada](https://cowboyenergiamasculina.com.br/quiz/v3-editorial/).
- Verificação pública às 00:06:28 UTC: quatro rotas HTTP 200 com HTML idêntico ao deployment autenticado e 16 assets HTTP 200. H1 exato, CTA, subtítulo, incentivo e metadata preservados conforme o escopo. HTML da capa SHA-256 `5bf6af3e564e9e709e8fccc2e4299cbc65e15d98d5aa707be1427568f1cc01d7`.
- Foto existente íntegra, SHA-256 `a561286dcab60ada67f98a3a3d9b5ab67fce120dc4d56de76ded655022cfec50`. O pedido adicional de imagem permanece NÃO CONCLUÍDO: geração bloqueada, sem novo asset ou tentativa de contorno.
- Bundles de tracking e fluxo/VSL mantêm os hashes das versões anteriores; paleta vermelha exclusiva da v3, homepage e poster preservados. `/quiz` continua 307 para v1 com query intacta. MP4 retornou 206 para `bytes=0-1023`, MIME `video/mp4` e tamanho total 30.576.839 bytes.
- Consulta de erros do deployment nos últimos 15 minutos: zero registros. Servidor 4414 encerrado e ausência de listener confirmada. Evidências de QA, HTTP e logs preservadas localmente.
- Rollback: `dpl_Fm7F5c6PzxQdfEumDi1doiwZUtwB`. Fechamento documental em commit local, sem push ou redeploy. Nenhuma nova homologação externa foi alegada.

## File List

- `docs/stories/QUIZ-044-headline-exata.md`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-editorial.tsx`
