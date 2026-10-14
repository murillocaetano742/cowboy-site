# QUIZ-048 — Ajuste do resultado e vídeo na v5

Status: implementação, gates, QA e revisão visual aprovados. GO root/QA concedido; release em andamento.

## Pedido e base

O proprietário pediu corrigir a v5 existente a partir do screenshot do resultado antigo. Não criar v6 nem novas rotas. Contrato final: na v5, a pergunta 3 passa a intensidade autodeclarada com cinco respostas — Nenhuma, Leve, Moderada, Alta e Muito alta (`none`, `light`, `moderate`, `high`, `very_high`). Na etapa 18, recuperar o visual antigo com imagem, gauge e lista, usando exclusivamente essa resposta, com rótulo “Intensidade que você relatou” e nota não diagnóstica. Não usar `caseResult`, pontuação calculada ou gravidade clínica.

Na 19, VSL compacta imediatamente visível, com autoplay silencioso por visibilidade. Root ofereceu pergunta assíncrona e anunciou ao proprietário a assunção de liberar o CTA flutuante “Escolher meu kit” após o término do vídeo. Em erro de vídeo, liberar com aviso. O CTA segue para depoimentos na 20, depois kits/garantias na 21; a etapa 21 usa checkout real do kit selecionado. Docks nas quatro etapas finais, além da etapa 4 existente. V4 permanece intacta.

Worktree reutilizada `.local/quiz-038-vsl`, branch `feat/quiz-048-v5-result-video`, base local `ce43c9cf6dbcb56d2d6f5f8457f078229f24f2d2`, árvore limpa antes da story. Fetch confirmou produção em `f9d506231e3f7d30ac60b4b0ff22235f368d623c`, sem commits remotos novos. Rollback 047 `dpl_8CvS4JQrE8SZn2LvpdJ1w7QTffKZ` confirmado READY, URL imutável `https://cowboy-site-nbmdovtwc-murillo-digital.vercel.app` e aliases canônicos ativos.

Permanecem oito entradas HTML públicas, com v5 em `/quiz/v5-etapas/` e `/quiz/v5-etapas/quiz/`. V1/v2/v3/v4, homepage, atalho `/quiz`, preços, checkout e mídia permanecem preservados. Servidor QA previsto: 4418.

## Critérios de aceite

- [x] Registrar regra final de disponibilidade do CTA19 antes de implementá-la: após terminar o vídeo; erro de mídia libera com aviso, conforme assunção anunciada por root.
- [x] Atualizar somente a v5 existente, sem nova variante ou rota, preservando versões anteriores.
- [x] Pergunta 3 somente da v5 oferece cinco níveis autodeclarados, incluindo Nenhuma. Etapa 18 recupera hierarquia visual, imagem, gauge e lista da referência, com rótulo “Intensidade que você relatou” e nota não diagnóstica. Resultado baseado somente nessa resposta, sem `caseResult` ou cálculo de gravidade.
- [x] Etapa 19 exibe a VSL imediatamente, autoplay muted/playsInline quando visível, ativação de som por gesto, pausa manual e fallback acessível.
- [x] CTA “Escolher meu kit” fica ausente até o término do vídeo ou erro de mídia com aviso; o dock apresenta status antes da liberação. Depois navega para 20 depoimentos, depois 21 oferta; não pula prova ou cria etapas extras.
- [x] CTA flutuante nas etapas 18–21 funciona por teclado e em mobile/desktop sem cobrir texto, controles ou links; etapa 4 existente preservada. Na 21, CTA executa checkout real do kit selecionado com a atribuição existente.
- [x] Manter 14 respostas, conclusão na 18 e progresso até 21, com voltar, foco, recarga e pausa de vídeos fora da própria etapa coerentes.
- [x] Tracking e atribuição continuam neutros; não enviar pontuação, respostas, faixa ou dados de saúde a fornecedores, URL, histórico persistente, cookies ou storage. Respeitar GPC/opt-out.
- [x] Aprovar lint, TypeScript, testes, build/check:build, E2E e revisão visual; oito rotas e versões anteriores sem regressão.
- [ ] Publicar somente após GO root/QA, via PR, checks e merge de SHA exato; único deployment automático READY, smoke público e rollback preservado.

## Coordenação e progresso

Root define contrato e revisa produto/documentação. Dev possui componentes/lib e testes unitários; QA possui E2E e inspeção independente. @devops possui story, gates/build, servidor 4418 e Git/release. Sem push antes do GO root/QA. Sem mudanças em core protegido, workspace original, anúncios, custos ou CRM. Meta/Purchase permanecem pendências externas.

- [x] Confirmar base limpa, fetch, produção e rollback READY.
- [x] Ler instruções do pacote e criar branch/story antes do código.
- [x] Consolidar implementação e File List.
- [x] Validar gates, QA, revisão visual e autorização de release.
- [ ] Publicar, verificar, encerrar servidor e manter fechamento documental local.

Fonte consolidada liberada pelo dev, mantendo variante e tracking `cowboy_v5_etapas`, eventos existentes e oito rotas. Lint de 54 arquivos JavaScript e ESLint, TypeScript e 114 testes passaram: 57 site, 21 fluxo e 36 tracking. Build/check:build aprovou 152 arquivos públicos e oito HTML. Servidor 4418 ativo para QA. Não houve mudança de SDK, handler do checkout, dependências ou infraestrutura.

Revisão root solicitou tornar o CTA19 realmente ausente antes da liberação, em vez de apenas desabilitado. O delta ficou restrito à condição JSX; lint, TypeScript e build/check:build passaram novamente. QA recebeu o novo artefato para validar ausência inicial e aparecimento após término/erro.

QA aprovou os 33 casos: 28 na rodada integral e cinco repetidos após ajustar o harness local para Range 206 com bytes reais do MP4 de dist. O servidor local serve vídeo chunked com HTTP 200, impedindo seek-to-end no Chromium; a limitação era do harness, sem mudança no app. Os cinco casos reexecutados validaram ended nativo e CTA ausente → presente, sem emitir conclusão de cobertura falsa. Cinco intensidades, autoplay sem rolagem, fallback, docks, teclado/zoom, histórico, 19 regressões legadas, SDK/linker/atribuição e privacidade passaram. Root aprovou fonte/documentação e capturas das etapas 18–21, incluindo o CTA19 liberado. Evidências em `test-results/quiz-048/`, `test-results/quiz-048-native-ended/` e `.local/quiz-048-final-captures/`. Coleta externa e checkout interceptados; sem compra. GO root/QA concedido para release.

## File List

- `docs/stories/QUIZ-048-resultado-video-v5.md`
- `docs/research/quiz-048-result-video-plan.md`
- `docs/integracoes/quiz-048-resultado-video.md`
- `packages/cowboy-quiz/README.md`
- `packages/cowboy-quiz/scripts/check-flow.mjs`
- `packages/cowboy-quiz/src/components/sites/bluue/Quiz.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/SpecialScreens.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-journey-offer.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-journey.module.css`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-journey.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-vsl.module.css`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-vsl.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-intensity-result.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-journey-dock.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/symptom-intensity.ts`
- `tests/e2e/cowboy-quiz-steps.spec.js`
