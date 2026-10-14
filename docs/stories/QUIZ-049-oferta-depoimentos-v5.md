# QUIZ-049 — Oferta e depoimentos da v5

Status: fonte consolidada, gates e QA funcional/visual aprovados. GO root/QA concedido; release em andamento.

## Pedido e base

O proprietário pediu atualizar somente as etapas 20 e 21 da v5. Na oferta, manter redline, hero e composição; substituir os cards no lugar atual pela apresentação compacta da v3: kits na ordem 3/2/1, miniatura dos frascos, preço por dia, frete, economia e parcelamento. Inserir carrossel de quatro assets existentes e quatro selos depois dos kits, antes de garantia/FAQ/footer: Checkout Seguro, Teste 30 Dias, Envio Discreto e Frete Grátis 2+ frascos. Preservar um único CTA flutuante com checkout real, preços, URLs, atribuição, tracking e gate do vídeo na etapa 19.

Root identificou inconsistência nos valores legados de economia (64,80/30). Somente a v5 exibirá economia dos produtos de R$39,80/R$5,00, calculada contra o avulso de R$79,90, sem incluir frete e com nota explicativa. Preços, frete e parcelas permanecem iguais. Badges: “Melhor preço” no kit3, sem prescrição; “Teste completo” no kit2. Carrossel manual, respeitando redução de movimento; legenda do casal trata da garantia de 30 dias, sem promessa de resultado.

Na etapa 20, alterar cabeçalho/descrição para os dados enviados pelo proprietário, já presentes na v3: cinco estrelas, “4,8 de 1.836 AVALIAÇÕES.”, “+38 MIL HOMENS JÁ ESCOLHERAM O COWBOY” e “Dois gravaram o próprio vídeo. Outros mandaram a foto com o frasco na mão.” Não criar números, novos depoimentos ou alegações. Manter mídias existentes.

Worktree `.local/quiz-038-vsl`, branch `feat/quiz-049-v5-offer-proof`, base local `33ae3f67517bb37455999114e9e01f0b423eb153`, árvore limpa antes da story. Fetch confirmou produção `5c9d70ac47d22fcde060e6ae84372a20e4dc1c7c`, sem commits remotos novos. Rollback 048 `dpl_EvUqwYrRF4hE6rPHeNK3somocSGi` confirmado READY, URL imutável `https://cowboy-site-qfcy3u4q8-murillo-digital.vercel.app`, aliases canônicos ativos.

Oito rotas existentes; nenhum novo pacote, mídia, SDK ou endpoint. V1–v4, etapas 18–19 da v5, homepage e atalho `/quiz` preservados. QA em 4419.

## Critérios de aceite

- [x] Atualizar somente as etapas 20/21 da v5, preservando versões anteriores, resultado e gate/autoplay da VSL.
- [x] Depoimentos apresentam os textos e estrelas enviados, reutilizando dois vídeos e seis fotos existentes, sem números ou relatos inventados.
- [x] Cards compactos seguem referência v3 e ordem 3/2/1, mantendo sua posição na página; imagens, preço/dia, frete e parcelamento preservados. Economia R$39,80/R$5,00 somente dos produtos, comparada ao avulso R$79,90, com nota de exclusão do frete. Badges “Melhor preço”/“Teste completo”, sem kit prescrito.
- [x] Manter redline, hero e composição. Inserir carrossel manual de quatro mídias aprovadas depois dos kits e antes de garantia/FAQ/footer, com controles acessíveis, redução de movimento e legenda de garantia sem promessa de resultado.
- [x] Quatro selos solicitados presentes e coerentes com as condições comerciais existentes; sem acrescentar promessa clínica ou garantia irrestrita.
- [x] Um único CTA flutuante permanece ligado ao kit selecionado e preserva checkout, valores, UTMs/linker e callback/fallback existentes.
- [x] Seleção, foco, teclado, zoom e layout mobile/desktop funcionam sem overflow ou conteúdo ocultado; vídeos pausam fora da etapa.
- [x] Tracking permanece neutro, sem respostas/dados de saúde; GPC/opt-out e deduplicação preservados.
- [x] Lint, TypeScript, testes, build/check:build, E2E e revisão visual aprovados; oito rotas e regressões anteriores sem bloqueadores.
- [ ] Publicar somente após GO root/QA via PR, checks e merge de SHA exato; um deployment automático READY, smoke público e rollback preservado.

## Coordenação e progresso

Root define contrato e revisa produto/documentação. Dev possui componentes/lib e testes do pacote; QA possui E2E/inspeção independente. @devops possui story, gates/build, servidor 4419 e Git/release. Sem push antes do GO root/QA. Não alterar workspace original, core protegido, campanhas, custos ou CRM. Meta/Purchase continuam pendências externas.

- [x] Confirmar base limpa, fetch remoto e rollback READY.
- [x] Criar branch e story antes do código.
- [x] Consolidar implementação/File List e evidências de QA.
- [ ] Publicar, verificar, encerrar servidor e manter fechamento documental somente local.

Gates aprovados: sintaxe de 54 arquivos JavaScript + ESLint, TypeScript, 115 testes (57 site, 22 fluxo e 36 tracking), build/check:build com 152 arquivos públicos e oito HTML. Nenhuma alteração de rotas, dependências, SDKs ou handler de checkout. Servidor 4419 disponibilizado para 33 E2E e capturas 375/390/1440. Root revisou fonte/plano/README sem bloqueios adicionais; título de kits compacto, seleção explicitamente vermelha e quantidade no CTA foram aplicados somente à v5.

QA funcional: 33/33 E2E passaram em 1,9 minuto, incluindo 19 regressões legadas. A revisão visual encontrou a barra fixa cobrindo o título/primeiro card após o salto aos kits; o ajuste ficou restrito ao CSS v5, `scroll-margin-top: 104px`. Lint/TypeScript e build/check:build passaram novamente. No último artefato, o caso principal passou novamente (1/1, 24 segundos) e as capturas confirmaram título/card abaixo da barra, carrossel de quatro slides com teclado/rolagem, quatro selos e um checkout dinâmico. Capturas em `.local/quiz-049-final-captures/`; testes em `test-results/quiz-049/` e `test-results/quiz-049-final/`. GO QA final concedido; nenhum pedido/coleta externa foi realizado.

## File List

- `docs/stories/QUIZ-049-oferta-depoimentos-v5.md`
- `docs/research/quiz-049-offer-proof-plan.md`
- `packages/cowboy-quiz/README.md`
- `packages/cowboy-quiz/scripts/check-flow.mjs`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-journey.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-journey-offer.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-social-proof.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-commerce.module.css`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-product-gallery.tsx`
- `packages/cowboy-quiz/src/components/sites/bluue/quiz-product-savings.ts`
- `tests/e2e/cowboy-quiz-steps.spec.js`
