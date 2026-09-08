# REBUILD-004 — Operação das contas e publicação

Status: Trabalho local concluído; conta Cartpanda parcialmente configurada; homologação externa e publicação pendentes

## Resultado esperado

Disponibilizar um pacote público isolado, manter o projeto Vercel existente e ativar as integrações somente quando o acesso e os dados reais puderem ser verificados.

## Critérios de aceitação

- [x] Build por CLI reúne somente páginas e mídia publicáveis; relatórios, código de testes, segredos e arquivos internos ficam fora do diretório público.
- [x] APIs continuam sendo funções de servidor, com configuração privada (runtime Vercel ainda pendente).
- [x] Teste local verifica isolamento, referências, roteamento e pacote do build.
- [x] Cartpanda: produtos e preços reais conciliados por API e URLs retornadas pela conta registradas.
- [ ] Cartpanda: resumo público, pagamento de teste e total com frete homologados; leitura pública recebeu desafio 403.
- [ ] Melhor Envio: cotação real do pacote confirmado e alinhamento com checkout.
- [ ] UTMify: configuração real e evento de teste conciliado.
- [ ] Google: propriedade verificada e sitemap enviado com evidência.
- [ ] Publicação no projeto existente ocorre somente após QA; URL, estado e possibilidade de reversão registrados.
- [x] Falhas de acesso e limites de verificação registrados sem segredos.

## Regras da execução

O usuário autorizou a operação das contas e do computador. Não criar outro projeto para contornar falta de acesso. Não publicar integrações simuladas como operacionais. Não comprar etiquetas, campanhas, pedidos ou assinaturas.

## File List

- `docs/stories/REBUILD-004-operacao-e-publicacao.md`
- `docs/integracoes/operacao-contas.md`
- `docs/integracoes/README.md`
- `docs/integracoes/checkpoint-2026-09-08.md`
- `docs/integracoes/plano-limite-quantidade.md`
- `scripts/build-site.js`
- `scripts/check-build.js`
- `scripts/check-syntax.js`
- `scripts/serve-site.js`
- `scripts/cartpanda-docs.js`
- `scripts/cartpanda-read.js`
- `scripts/cartpanda-update-offer.js`
- `scripts/cartpanda-checkout-check.js`
- `package.json`
- `.gitignore`
- `.vercelignore`
- `vercel.json`

## Checkpoint

API Cartpanda validada e kits 1/2/4 atualizados com preços corretos, dimensões 23 × 8 × 8 cm e pacote de 0,5 kg. URLs configuradas apenas no ambiente privado local. Servidor local reiniciado na porta 4173. Nenhuma publicação remota ou transação paga foi feita. O usuário determinou o fim de novas solicitações de autorização do ambiente; investigação externa encerrada, sem contornar bloqueios.

## Retomada de 8 de setembro

Leitura de catálogo por comando já autorizado confirmou os preços e retornou nome comercial/país, mas não identificação fiscal. Flags de quantidade do avulso diferem dos kits e precisam de homologação. API local respondeu 200 na porta 4173. Após o usuário abrir os aplicativos, Computer Use listou a janela Vercel, mas voltou a interromper a captura por falta de confiança na URL atual; nenhuma ação de GUI foi realizada. Nenhuma nova mutação de conta ou repetição do comando de documentação ocorreu.
