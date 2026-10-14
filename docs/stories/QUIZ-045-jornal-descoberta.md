# QUIZ-045 — Jornal digital e produto somente no final

Status: concluída, publicada e verificada; fechamento documental local sem novo deploy.

## Pedido e base

O proprietário confirmou uma abordagem de jornal/notícia de descoberta na v3, com o produto apresentado somente ao final. Root e QA identificaram um estudo real publicado em Nature Communications em 24/11/2025, com mais de um milhão de participantes e foco na genética da disfunção erétil. O conteúdo deve se limitar à evidência do estudo, sem alegar cura, eficácia do produto, endosso científico à oferta ou tratamento em 40 minutos. Root mantém o registro da fonte e dos limites de interpretação.

Escopo inicial v3: substituir a etapa 4, que mostra 92% e frascos, por uma introdução neutra; substituir a caixa da etapa 10 por um jornal digital acessível com headline, resumo fiel, data, fonte e identificação publicitária. Remover o autoavanço de seis segundos nessa etapa para permitir leitura; continuidade por ação explícita. Frascos aparecem somente na etapa 18.

O proprietário ampliou o pedido durante a QA. Escopo definitivo da etapa 4: imagens reais brasileiras de tadalafila genérica/Cialis e headline “Tadala não é brincadeira.”, em apresentação de jornal crítico com aviso sobre uso sem orientação. Incluir recorte factual de alerta da Anvisa de 05/09/2025, link real e dois grupos de riscos descritos em bula: nitratos/pressão arterial e efeitos comuns. Preservar a informação sobre eficácia e não orientar interrupção de tratamento. Root prepara dois assets WebP e documentação da fonte; dev integra a tela e os links. Não incluir apresentação do produto nessa etapa.

Na etapa 18, mover o bloco EXISTENTE de prova social para depois da VSL e antes dos kits, mantendo uma única instância. V1/v2 continuam inalteradas. Não acrescentar a porcentagem de 92% não auditada. O jornal genético da etapa 10 permanece. IDs de links `medicine_alert` e `medicine_leaflet` são permitidos somente em `quiz` e usam a mesma classe de exclusão da decoração UTMify. Novos gates/build e QA são necessários após fonte e assets finais; publicação somente após GO renovado de root.

Worktree reutilizada `.local/quiz-038-vsl`, branch `feat/quiz-045-newspaper`, a partir de `d56b2fccd893545c5034dfa3e333a5b67feb09fd`. Fetch confirmou produção `56ba5bbf2b58abef3e17620fdfed480aeea30b69`, sem delta externo na árvore.

## Critérios de aceite

- [x] Etapa 4 da v3 apresenta imagens reais brasileiras de tadalafila/Cialis e headline “Tadala não é brincadeira.”, sem frascos COWBOY ou 92%.
- [x] Etapa 4 inclui alerta factual da Anvisa de 05/09/2025 e dois grupos de riscos de bula, sem negar eficácia, inventar riscos ou recomendar interrupção de tratamento.
- [x] Etapa 10 da v3 oferece jornal digital acessível, com estudo, data, fonte, autoria/identificação publicitária e limites fielmente descritos.
- [x] Etapa 10 aguarda ação explícita, sem autoavanço durante a leitura.
- [x] Links de fontes usam IDs fixos `research_paper`, `medicine_alert` e `medicine_leaflet` somente em `quiz`, sem respostas, dados sensíveis ou decoração de campanha, preservando opt-out e GPC.
- [x] Frascos COWBOY aparecem somente na etapa 18 da v3; preservar 18 etapas, 14 respostas, estados, progresso e eventos existentes.
- [x] Bloco existente de prova social é posicionado na etapa 18, após VSL e antes dos kits, em uma única instância, sem porcentagem não auditada.
- [x] V1/v2, VSL, preços, kits, checkout, atribuição e privacidade preservados.
- [x] Lint, TypeScript, testes, build/check:build e QA independente mobile/desktop aprovados.
- [x] GO root/QA, PR com SHA exato, deploy automático READY e verificação pública concluídos.

## Coordenação e publicação

Dev implementa o fluxo/UI/tracking estritamente dentro do escopo; root documenta a fonte e revisa o conteúdo; QA valida independentemente; @devops mantém story, gates/build e Git/publicação. Servidor de QA previsto em 4415. Sem novas dependências previstas.

Rollback confirmado READY: `dpl_FW1rEcQaCzL1rWvzevPxXdPdSAAm`, URL `https://cowboy-site-3vinlmc3u-murillo-digital.vercel.app`. Manter quatro rotas, capa, homepage e `/quiz` apontando para v1. Publicar pelo PR/merge e deploy automático único; fechamento documental local sem novo deploy. Limitações externas Meta/Purchase permanecem fora desta mudança.

## Implementação e gates

Componentes próprios de introdução e jornal foram adicionados para a v3. V1/v2 seguem os componentes originais, com seus timers anteriores. O jornal da v3 não possui timer e usa fonte em nova guia com `noopener noreferrer`, identificação publicitária, data e explicação do limite da pesquisa. O clique reutiliza `quiz_content_link` com somente `research_paper` e `quiz`, sem parâmetros de resposta ou nova conversão Meta. O consentimento inicial da v3 descreve a organização do resumo e a oferta ao final, sem antecipar indicação de kit.

Lint JavaScript de 52 arquivos e ESLint, TypeScript e 102 testes (55 site, 16 fluxo, 31 tracking) aprovados. Build/check:build aprovados com 130 arquivos, quatro entradas HTML e homepage preservada. `git diff --check` limpo. Artefato final em `http://127.0.0.1:4415` liberado à QA; nenhuma alteração de build, hosting ou dependência necessária.

A primeira QA identificou que o SDK UTMify decorava o link da fonte científica com identificadores de campanha. O anchor recebeu a classe exclusiva `quiz-research-source`, e o loader passou a informar `data-utmify-ignore-classes`, mecanismo confirmado no SDK real. O link de pesquisa deve permanecer exatamente na URL primária, sem query ou fragmento; checkout e demais links comerciais mantêm atribuição. Gates completos e build/check:build foram repetidos e aprovados após essa correção, antes da QA final.

A rodada anterior à ampliação da etapa 4/prova social passou 10 E2E em 38,5 segundos. O SDK real manteve a URL Nature exata após 6,5 segundos e clique por teclado; checkout preservou UTMs e `_gl`. Essa evidência valida a correção do link, mas não representa aprovação final do novo escopo ampliado.

O escopo ampliado final contém a tela de medicamentos, duas fotografias WebP reais documentadas (600×600 pixels; 21.498 e 21.766 bytes), links exatos Anvisa/DailyMed e prova social existente reposicionada somente na v3. Temporários das imagens foram removidos da área pública por root. Gates finais novamente aprovados: lint, TypeScript e 103 testes (55 site, 16 fluxo, 32 tracking), build/check:build com 132 arquivos e quatro entradas HTML. Servidor 4415 atualizado para a rodada final de QA, sem alteração de dependências ou hosting.

QA final aprovou 10/10 E2E em 43,7 segundos no último artefato. Com SDK real, as três fontes permaneceram exatas após 6,5 segundos e clique por teclado; IDs neutros, deduplicação, GPC/opt-out, etapas 4/10 manuais, 18 etapas/14 respostas, ausência de produtos COWBOY nas etapas 1–17, prova social única depois da VSL e antes dos kits, `view_item` somente pela visibilidade dos kits, CTA de rolagem/foco, três kits com UTMs/`_gl` e regressões v1/v2/VSL aprovados. Capturas 375/390/1440 sem overflow, inspecionadas pelo auditor e por root. Evidências locais em `test-results/quiz-045/`. Nenhuma coleta externa ou pedido foi realizado pela QA.

## Fechamento da publicação

- GO final de root e QA recebido para a QUIZ-045 existente. Nenhuma implementação ou arquivo da variante futura QUIZ-046 foi incluído.
- PR [#29](https://github.com/murillocaetano742/cowboy-site/pull/29), commit `5d2d1170cef4d805502026d307212eea0f22a761`, exatamente 13 arquivos previstos. Dois checks Vercel aprovados antes do merge do SHA exato.
- Produção `f8b977144e70e553dc8e94e67515cd653d0c1ab5`, merge em 14/10/2026 às 00:43:45 UTC (13/10, 21:43 em Brasília). Deploy automático `dpl_cFswBcb2TGMiYh4tbYsrw55owjVy`, status READY, sem publicação manual duplicada.
- Deployment imutável `https://cowboy-site-de1qt8eru-murillo-digital.vercel.app`; aliases canônicos com e sem `www` confirmados. [Capa preservada](https://cowboyenergiamasculina.com.br/quiz/v3-editorial/) e [questionário atualizado](https://cowboyenergiamasculina.com.br/quiz/v3-editorial/quiz/).
- Smoke público às 00:44:56 UTC: quatro rotas HTTP 200 com HTML idêntico ao deployment autenticado e 17 assets HTTP 200. Componentes de medicamentos/pesquisa, links primários, IDs fixos e exclusão UTMify confirmados nos bundles publicados. HTML v3 SHA-256 `c92badb3e9f650e0ed1970452f34d4ae1c152dc3fefec346d587570fc5f2dd8b`.
- As duas imagens de medicamentos respondem `image/webp` e mantêm os hashes documentados: tadalafila `98287932fab0f8735bb627dccdf9934ccbbc5e4abfdaf7bbce8cb1e8c84e0aea`; Cialis `12a5f31647fe20a62e088cbe5f04b4d43f6468929d834618898ac2b540af35af`. Capa e poster anteriores íntegros.
- Homepage preservada byte a byte após normalizar finais de linha; `/quiz` continua 307 para v1 com query preservada. V1/v2 permanecem acessíveis e sem wrapper da paleta v3. MP4 retornou 206 para `bytes=0-1023`, MIME `video/mp4`, total 30.576.839 bytes.
- Consulta de erros do deployment nos últimos 15 minutos: zero registros. Servidor 4415 encerrado e ausência de listener confirmada. Evidências QA, HTML/HTTP e logs preservadas localmente. A entrega não alega nova recepção externa Meta/Purchase.
- Rollback `dpl_FW1rEcQaCzL1rWvzevPxXdPdSAAm` preservado. Fechamento em commit documental local, sem push/redeploy.

## File List

- `docs/stories/QUIZ-045-jornal-descoberta.md`
- `docs/research/quiz-045-source.md`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-research.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-research.module.css`
- `packages/cowboy-quiz/src/components/sites/bluue/Quiz.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/SpecialScreens.tsx`
- `packages/cowboy-quiz/src/lib/quiz-tracking.ts`
- `packages/cowboy-quiz/scripts/check-tracking.mjs`
- `packages/cowboy-quiz/README.md`
- `tests/e2e/cowboy-quiz-editorial.spec.js`
- `packages/cowboy-quiz/src/components/sites/bluue/PreCheckout.tsx`
- `packages/cowboy-quiz/public/sites/cowboy/tadalafila-ems-reference.webp`
- `packages/cowboy-quiz/public/sites/cowboy/cialis-reference.webp`
