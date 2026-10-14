# QUIZ-050 — Reprodução integral da VSL v5

Status: implementação, gates, QA visual/controles e reprodução integral real aprovados. GO root/QA concedido; release em andamento.

## Pedido e base

O proprietário pediu retirar o avanço da VSL e exigir assistir ao vídeo inteiro antes de prosseguir. Escopo exclusivo da etapa 19 da v5 existente: remover a interface de seek, oferecer controles acessíveis de pausa/retomada e som, impedir avanço e velocidade acima de 1 nos meios normais da interface e liberar a próxima etapa somente após término nativo e cobertura integral contínua do conteúdo.

Erros, autoplay bloqueado ou falha de mídia não liberam a sequência e não oferecem “continuar sem vídeo”; devem apresentar reproduzir/tentar novamente. Root coordena o contrato final; dev implementa a fonte, QA valida independentemente. Não transformar o bloqueio de interface em alegação de proteção contra adulteração por ferramentas de desenvolvedor.

Worktree reutilizada `.local/quiz-038-vsl`, branch `feat/quiz-050-vsl-completa`, base local `2a939fe5da3cf12af4dfe38f0c1e9cc5e76a383f`, árvore limpa antes da story. Fetch confirmou produção `b2f2976bf100c4674e78b37e8c69ba3a3a45f8f4`, sem commits remotos novos. Rollback 049 `dpl_4g3vPgdWqNy2heTT5KU1pZUyVjMc` confirmado READY, URL imutável `https://cowboy-site-i473gi97t-murillo-digital.vercel.app` e aliases canônicos ativos.

Permanecem oito rotas, mesma mídia, preços, checkout e SDKs. V1–v4 e demais etapas da v5 preservadas. Servidor QA previsto: 4419, encerrado na entrega anterior. Instruções AIOX e AGENTS do pacote já lidas; nenhuma Constitution/core local adicional encontrada, nenhum core protegido será alterado. Guia Next de static export aplicável ao build já conferido.

## Critérios de aceite

- [x] Alteração somente da etapa 19 v5; variantes anteriores e demais telas mantêm comportamento existente.
- [x] Interface não oferece scrubber/seek ou controle para acelerar; meios normais de avanço/velocidade acima de 1 não permitem saltar conteúdo.
- [x] Pausa/retomada e som são acessíveis por teclado, com estado e nomes claros; autoplay silencioso e gesto para som preservados.
- [x] Próxima etapa permanece indisponível até término nativo e cobertura integral contínua; seek ao final, lacunas, mudança de velocidade e eventos artificiais de término não bastam.
- [x] Pausa e buffering não inventam cobertura; retomada acompanha reprodução real, sem contagem por tempo de parede isoladamente.
- [x] Falha de mídia/autoplay bloqueado não libera o fluxo nem mostra “continuar sem vídeo”; reproduzir/tentar novamente permite recuperação.
- [x] Gate e eventos de conclusão usam evidências de reprodução real sem falsificar `vsl_complete`; privacidade, GPC/opt-out, deduplicação e atribuição preservados.
- [x] Nenhuma dependência, SDK, endpoint, mídia, preço ou URL comercial nova.
- [x] Lint, TypeScript, testes, build/check:build, QA de controles/gate/reprodução e regressões aprovados; oito rotas preservadas.
- [ ] Publicar após GO root/QA via PR, checks e merge exato; um deployment automático READY, smoke público e rollback preservado.

## Coordenação e progresso

@devops possui story, gates/build, servidor 4419 e Git/release exclusivamente. Dev possui produto/lib e testes unitários; QA possui E2E e inspeção; root define contrato e revisa. Sem push antes do GO root/QA. Sem alterações no workspace original, core protegido, anúncios, custos ou CRM. Meta/Purchase permanecem limites externos.

- [x] Confirmar base limpa, fetch e rollback READY.
- [x] Criar branch e story antes do código.
- [x] Consolidar File List e evidências de implementação/QA.
- [ ] Publicar, verificar, encerrar servidor e manter fechamento documental local.

Fonte consolidada: gate exige evento `ended` nativo/confiável, `video.ended`, velocidade 1x e cobertura contínua de `played`, com tolerância técnica total de 0,1 segundo compartilhada entre lacunas e cauda final. Avanço além da cobertura retorna à posição permitida. Antes do gate, a v5 não encaminha `ended` ao emissor de analytics; versões anteriores permanecem intactas. Controles acessíveis substituem os nativos somente na v5; falha oferece recarregar do início, sem liberar a próxima etapa.

Gates completos aprovados: sintaxe de 54 arquivos JavaScript + ESLint, TypeScript, 118 testes (57 site, 25 fluxo e 36 tracking), build/check:build com 152 arquivos públicos e oito HTML. Servidor 4419 disponibilizado para QA. Root revisou fonte/lib/escopo e documentação sem bloqueios; publicação aguarda QA de controles e MP4 integral real.

QA pode gerar uma fixture real de 12 segundos fora do Git, após criar `.local/quiz-050-fixtures/`:

```powershell
ffmpeg -hide_banner -loglevel error -y -i dist/videos/vsl/vsl-dr-durval-720.mp4 -t 12 -vf scale=180:320 -c:v libx264 -preset veryfast -crf 30 -c:a aac -b:a 32k -movflags +faststart .local/quiz-050-fixtures/control-12s.mp4
```

O uso exige `E2E_VSL_FIXTURE` explícita; caminho inexistente falha claramente. Sem a variável, os testes usam o original com timeout ampliado. O caso `@full-vsl`, habilitado por `E2E_FULL_VSL=1`, ignora a fixture e deve reproduzir o MP4 original integral em 1x, local e público, sem interceptar mídia nem substituir `play()`. A fixture não entra no build nem altera o CI implicitamente.

GO QA final: 34/34 regressões, dois casos adicionais de viewport e uma reprodução integral do MP4 original passaram. No original, duração 276,340998 s, `played=[[0,276.340998]]`, término nativo confiável, velocidade 1x, `readyState=4` e nenhum erro; tempo de parede 276,56 s. CTA apareceu somente ao fim; quartis 25/50/75 e conclusão única, percurso 20/21 e checkout interceptado aprovados. Nenhuma alteração de fonte foi solicitada após QA. Evidências em `test-results/quiz-050-full-local/` (JSON de reprodução integral e screenshots) e `test-results/quiz-050-visual/`. Root aprovou fonte/documentação e capturas em 375×667, 390, desktop 1440 e zoom 2, com controles acima do dock e legenda acessível, e concedeu GO de publicação. O MP4 público original será reproduzido integralmente após READY, antes do fechamento.

## File List

- `docs/stories/QUIZ-050-vsl-completa.md`
- `docs/research/quiz-050-vsl-complete-plan.md`
- `packages/cowboy-quiz/README.md`
- `packages/cowboy-quiz/scripts/check-flow.mjs`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-journey.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-vsl.module.css`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-vsl.tsx`
- `packages/cowboy-quiz/src/lib/vsl-completion.ts`
- `tests/e2e/cowboy-quiz-steps.spec.js`
