# Entrega local — COWBOY Energia

Snapshot: 08/09/2026 00:20:16 BRT. Página, APIs, imagens e build locais entregues em seus escopos; catálogo Cartpanda atualizado e relido. O CEO aceitou a implementação/testes locais e as três correções estáticas de CSS. Aceite visual real, dez criativos, prova social autêntica e homologações externas permanecem pendentes. Não houve publicação em produção.

| Camada | Evidência | Limite atual |
| --- | --- | --- |
| Código e serviço local | 21/21 testes após CSS; build de 14 arquivos; histórico 25/25 HTTP e 3/3 redirects; `/api/config` HTTP 200 no checkpoint da retomada | Não prova layout renderizado, disponibilidade contínua ou checkout externo |
| API real | GET Cartpanda HTTP 200 em 08/09/2026 00:03 BRT; produtos e preços confirmados | Resumo público e alteração de quantidade não homologados |
| Conta configurada | Títulos e preços dos kits 1/2/4 atualizados e relidos; URLs locais reais | Melhor Envio, UTMify, Google e identificação empresarial completa pendentes |
| Produção | Nenhum deploy realizado | Vercel sem acesso válido; fluxo externo e QA visual pendentes |

No instante do snapshot, o CEO coordena e apenas `devops_contas` consolida a governança. Os workers de CSS e revisão independente encerraram seus escopos. O painel não simula atividade contínua.

## Artefatos principais

- Página: `index.html`, `loja.html`, `assets/css/cowboy.css`, `assets/js/cowboy-store.js`.
- APIs: `api/config.js`, `api/checkout.js`, `api/frete.js`.
- Produto/copy: `docs/produto/product-facts.json`, `docs/produto/copy-v2.md`.
- Imagens: `imagens/v2/cowboy-hero.webp`, `cowboy-packshot.webp`, `cowboy-kit-2.webp` e fontes PNG.
- QA: `docs/qa/relatorio-v2.md`, `tests/qa/`.
- Retomada visual: `docs/qa/visual-v2.md` e `docs/qa/revisao-css-independente-2026-09-08.md`; três correções sem regressão estática objetiva. CSS de origem/dist idêntico; a revisão independente não rerodou testes nem GUI.
- Criativos: `docs/criacao/analise-criativos-2026-09-08.md` e matriz CSV; dez peças não localizadas, quatro vídeos antigos inspecionados com claims não sustentados e sem autorização de uso comprovada.
- Contas: `docs/integracoes/checkpoint-2026-09-08.md`, `operacao-contas.md` e `plano-limite-quantidade.md`; proposta de flags não aplicada.
- Governança: `docs/governanca/status-ledger.json`, plano, contratos e stories `REBUILD-*`.
- Autonomia: `docs/governanca/autonomia-e-permissoes.md`, diagnóstico somente leitura sem mudança de segurança.

## Comandos existentes

```powershell
npm.cmd test
node --test tests/qa/frontend-flow.test.js
node --test tests/qa/api-boundaries.test.js
npm.cmd run check:commerce
node scripts/build-site.js
node scripts/check-build.js
powershell -NoProfile -File .\scripts\harness-status.ps1 -Validate
powershell -NoProfile -File .\scripts\harness-status.ps1
```

Executar apenas os comandos aplicáveis ao estado atual; resultados passados não substituem uma nova rodada após alterações.

## Pendências acionáveis

1. Recuperar acesso suportado ao projeto Vercel existente `cowboy-site`. A janela foi localizada, mas o guard do Computer Use interrompeu antes de captura/login por falta de confiança na URL. Separadamente, CLI registrou token inválido e o conector 403. Nenhuma nova autorização comercial é necessária; nenhuma limitação técnica foi contornada.
2. Cartpanda confirmou produtos 29750488/29750542/29750543, variantes preservadas e preços corretos. Validar o resumo público e total com frete; desafio 403 não contornado. Flags do avulso observadas em 0/0, kits 2/4 em 1/1. A proposta para limitar o avulso está documentada, **não aplicada**, e depende da semântica oficial do controle. Não presumir desconto para duas unidades avulsas ou embalagem correta ao duplicar kits.
3. Homologar Melhor Envio com token oficial, CEP 74475-239 e pacote 23 × 8 × 8 cm/0,5 kg para kits até quatro.
4. Configurar UTMify e conciliar evento de pagamento aprovado por `order_id`/`transaction_id`, sem dados sensíveis em URL.
5. Verificar domínio, Search Console, sitemap e GA4 com identificadores reais e decisão de consentimento.
6. Executar navegador real quando houver instância/URL controlável; o runtime atual não forneceu uma.
7. Obter razão social e endereço físico verdadeiros do vendedor antes da abertura comercial.
8. Reconciliar formalmente 12 versus 24 gotas antes de qualquer publicação de dose ou duração.
9. Localizar/receber os dez criativos informados e seus destinos. Os quatro MP4 antigos não formam esse conjunto; seus claims visuais sem sustentação bloqueiam seu uso na nova página.
10. Receber prova social autêntica, origem e consentimento de publicação. A análise local já está autorizada; transcrição de áudio depende de capacidade técnica, não de nova autorização do proprietário.

O checkpoint da retomada registra o servidor `http://127.0.0.1:4173` respondendo HTTP 200. A sessão original é 58230; isso não garante que continue ativa depois desse registro. Se encerrar, executar `npm.cmd run build` e `npm.cmd run dev` no diretório do projeto e manter o processo aberto. Se a porta já estiver ocupada, preservar o servidor existente e verificar seu estado antes de iniciar outro. Não há daemon nem garantia de persistência.

A autorização de construir, configurar e publicar no escopo solicitado permanece válida. O impedimento atual é técnico: guard do runtime e credenciais/contexto externos indisponíveis pelos canais acessíveis. Esta consolidação alterou somente documentos e painel, sem nova rede, conta, GUI ou teste de produto. Nenhum segredo foi registrado. Nenhum deploy, compra, etiqueta, campanha ou mensagem externa foi concluído.
