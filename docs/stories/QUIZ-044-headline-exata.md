# QUIZ-044 — Manchete exata da capa

Status: headline implementada e aprovada por root/QA; publicação autorizada com a imagem atual preservada.

## Pedido e base

Trocar o H1 da capa `/quiz/v3-editorial/` por: “Chega de broxar e de gozar rápido no momento em que sua mulher mais te quer firme.” Preservar metadata, subtítulo, CTA, questionário, tracking, integrações e demais versões. Ajuste responsivo somente se estritamente necessário e aprovado na QA.

Durante a validação da manchete, o proprietário também solicitou editar a imagem existente, mantendo a composição e o casal adulto em direções opostas, com homem de cueca e mulher de calcinha e sutiã. O imagegen bloqueou a solicitação na entrada (`HTTP 400`, `moderation_blocked`, categoria sexual); nenhuma imagem foi gerada. Não houve repetição nem tentativa de contorno. Root informou o usuário e definiu publicar a manchete mantendo a foto atual. O pedido adicional de imagem não foi concluído; nenhum asset ou registro de geração bem-sucedida é alegado.

Worktree reutilizada `.local/quiz-038-vsl`, branch `feat/quiz-044-headline`, a partir do fechamento local `daa039638d56851d711f381d009d9095bfe812b4`. Fetch confirmou produção `475f7d7a19f788ed01dc273e6f42d380208dad62`, sem alterações locais anteriores.

## Critérios de aceite

- [x] H1 corresponde exatamente à frase solicitada.
- [x] Imagem existente e todo o restante preservados; headline legível e sem overflow em mobile/desktop.
- [x] Lint, TypeScript, testes, build/check:build e QA independente aprovados.
- [ ] GO root/QA, PR com SHA exato, deploy automático READY e verificação pública concluídos.

## Coordenação e publicação

Root edita a manchete, QA valida, @devops mantém story/gates/Git/publicação. Servidor de QA previsto em 4414. Rollback confirmado READY: `dpl_Fm7F5c6PzxQdfEumDi1doiwZUtwB`, URL `https://cowboy-site-rcwihhg9x-murillo-digital.vercel.app`. Manter quatro rotas e homepage; fechamento documental local sem novo deploy. Nenhuma nova configuração ou homologação externa está incluída.

## Validação

Diff funcional final restrito a uma inserção e uma remoção no H1 de `quiz-editorial.tsx`, com a frase exata solicitada. Nenhuma alteração em metadata, subtítulo, CTA, CSS, imagem, estrutura, handlers ou integrações. Lint JavaScript de 52 arquivos e ESLint, TypeScript, 100 testes (55 site, 16 fluxo, 29 tracking), build/check:build e `git diff --check` aprovados. Exportação com 131 arquivos e quatro entradas HTML. O artefato em 4414 corresponde à fonte final, sem necessidade de rebuild após a tentativa bloqueada de imagem.

QA independente aprovou 2/2 E2E em 1,6 segundo e inspeção em quatro viewports sem overflow. CTA totalmente acima da dobra inclusive em 375×667 pixels (borda inferior em 617 pixels). Root inspecionou 375×667 e 1440, aprovou o layout e concedeu GO final para publicar somente a manchete com foto existente. Capturas e evidência preservadas localmente em `test-results/quiz-044/`; nenhum arquivo de teste alterado nesta rodada.

## File List

- `docs/stories/QUIZ-044-headline-exata.md`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-editorial.tsx`
