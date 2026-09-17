# Handoff — sessão Claude Code (08/09 a 14/09/2026)

Este documento é o ponto de retomada. Ao reabrir a conversa, ler este arquivo primeiro. Ele resume o que foi decidido, o que foi feito, onde está cada coisa e o que falta.

## 1. Contexto do projeto

- Produto: **COWBOY Energia**, suplemento alimentar em gotas, frasco de 30 mL, 6 componentes (taurina 50 mg, arginina 50 mg, feno-grego 300 mg, vitamina B6 3 mg, zinco 1,7 mg, boro 1,1 mg por porção de 12 gotas / 1 mL; 30 porções por frasco). Fabricante no rótulo: BNT Farma, CNPJ 21.027.384/0001-06. Fatos em `docs/produto/product-facts.json`.
- Site: repositório `murillocaetano742/cowboy-site`, HTML/CSS/JS estático + funções em `api/` (checkout Cartpanda, frete Melhor Envio), deploy Vercel (projeto `cowboy-site`).
- **Dois agentes trabalham no mesmo workspace**: Claude Code e um Codex (extensão ChatGPT do VS Code). O proprietário quer as versões separadas. Claude usa o namespace `cowboy-nova` (página, CSS, JS, docs, testes). Codex tem `cowboy-v3*`, `cowboy-360-real*`, `cowboy-conversao*`, `cowboy-mobile-preview*`, `imagens/v3`, `imagens/mobile`. Nunca trocar de branch no diretório compartilhado; commits são feitos com índice temporário (`GIT_INDEX_FILE` + `git commit-tree`) e `git branch -f`.
- Servidor local de revisão da página do Claude: `PORT=4180 npm run dev` → `http://127.0.0.1:4180/cowboy-nova`. Codex usa 4173/4174.
- Branch e PR: `feat/pagina-nova`, PR #1 em https://github.com/murillocaetano742/cowboy-site/pull/1 (aberto, base `main`). O Codex também empurrou commits nessa branch ("prepare approved Cowboy Nova publication", "harden approved checkout attribution"): a `cowboy-nova.html` passou a ser a **raiz do site no build** (alias `index.html`), `robots` em `index,follow`, links públicos do Cartpanda gravados em `config/commerce.js`, script da UTMify na página.

## 2. Decisões do proprietário (Murillo)

1. Mundo visual = versão publicada: preto, dourado em degradê, Oswald em caixa alta com uma frase em dourado, cards com borda fina, botões dourados com brilho. Mobile primeiro. Sem 3D (foi feito e retirado).
2. Depoimentos no topo, em rolagem lateral, vídeos primeiro e fotos depois. Legendas "Cliente + primeiro nome" (pseudônimos declarados: "nomes alterados para preservar a privacidade").
3. Compra só no fim da página. Botão flutuante aparece depois da garantia.
4. Oferta e promessa agressivas. A promessa central é o **Teste de 30 dias**: "desistiu em 10 dias, devolvemos o valor dos produtos, sem justificativa; 30 dias para decidir". Frete de R$ 25 declarado na página (era a surpresa do checkout: 6 checkouts, 0 compras em 10/09).
5. Kit de 3 frascos criado no Cartpanda (produto 29892228, variante 212751381, R$ 127,14, checkout `https://cowboy-energia.mycartpanda.com/checkout/212751381:1`). **Peso do produto ficou 0 no Cartpanda; os outros têm 0,5 kg** (ajustar no painel).
6. Sem CNPJ do distribuidor na página (removido).
7. **VSL do Dr. Durval é a oferta real.** O site é o complemento: o vídeo vende, a página remove o risco. O site não repete o roteiro.
8. O proprietário assumiu por escrito a responsabilidade pelas frases de promessa que ele mesmo inserir. Claude mantém a linha de não escrever: alegação de tratar disfunção erétil/ejaculação precoce, percentuais ou minutos de efeito, "comprimido não funciona", médico garantindo resultado, "aprovado pela Anvisa", avaliações/estatísticas inventadas. Correções de fato no roteiro recebido: produto é **gotas** (não spray) e a fórmula tem **boro** (não maca).

## 3. Estado atual da página `cowboy-nova.html` (commit `febc4fc`, 11/09)

Estrutura de página de VSL (pesquisa em `docs/produto/copy-conversao-nova.md`, seção "Site como complemento da VSL"):

1. Hero sem distrações (sem menu/faixa): "Assista antes de decidir · 6 minutos" · título "O que ninguém te contou na farmácia. E o desafio de 30 dias do Dr. Durval." · player com poster (`imagens/v4/hero-varanda-720.webp`) e botão de play; o vídeo real entra como `<video data-vsl-video>` dentro de `[data-vsl]` · 3 linhas do que ele vai ver · botão "Quero meu teste de 30 dias" · frete R$ 25.
2. Transição "O vídeo mostra o caminho…".
3. `#prova`: 2 vídeos reais (`videos/clientes/`) + 6 fotos reais (`imagens/clientes/cliente-01..06.webp`, nomes Marcos, Ricardo, Fernando, Paulo, André, Sérgio) em rolagem lateral.
4. `#argumento`: versão escrita curta + composição recolhível + alegação da B6 (IN 28/2018).
5. `#doutor`: citação do Dr. Durval; foto, CRM e tempo de consultório pendentes de liberação.
6. `#kit`: kits 1/2/3/4 (R$ 54,76 / 84,76 / 127,14 / 169,52), kit de 2 "Teste completo", pilha de valor, frete R$ 25, botão "Quero meu teste de 30 dias". Fotos dos kits em `imagens/kits/kit-1..4.jpg` (geradas pelo Codex).
7. `#garantia`: selo 10 dias, 30 dias de teste, anti-garantia "Não é para você se…".
8. `#perguntas`: 8 objeções. 9. `#fim`: "Você tem duas opções agora".
- Revelação atrasada pronta: `[data-reveal]` trava até `data-reveal-at="290"` s do vídeo ou fim; link "Já assistiu?" após 45 s. Sem vídeo, nada trava.
- Imagens geradas pelo Codex via `codex exec` (comando: `codex.exe exec --approve-for-me -C <projeto> - < prompt.txt`): `imagens/v4/` (varanda, mesa de cabeceira, casal na cozinha, rotina) e `imagens/kits/`.
- QA: Playwright + axe 6/6 (`npm run test:e2e`, spec `tests/e2e/cowboy-nova.spec.js`), unitários 26/26, Lighthouse mobile 94/100/100/100, `check-build` corrigido para `srcset`. Relatórios em `docs/qa/nova/`.
- Meta Pixel **não** está instalado na página nova (só UTMify). A página de julho tinha o pixel 1006075098894986.

## 4. Documentos produzidos

- `docs/produto/copy-conversao-nova.md` — mapa de conversão, copy e histórico das versões da página.
- `docs/produto/oferta-e-promessa-2026-09-10.md` — diagnóstico do funil e a promessa "Teste de 30 dias" (autor: Codex).
- `docs/produto/roteiro-vsl-2026-09-10.md` e `.docx` — roteiro da VSL do Dr. Durval (versão dura, com "ESPAÇOS SEUS"). Também no Notion: https://app.notion.com/p/3d7691faccdc8127b816fe138d2b05e3. O proprietário depois mandou o roteiro dele (Bloqueio da Primeira Passagem, 6–7 min); ver seção 2, item 8.
- `docs/criacao/briefing-imagens-conversao.md`, `docs/criacao/PEDIDO-PARA-CODEX-imagens.md`.
- `docs/qa/nova/relatorio-qa-nova.md`, `docs/qa/nova/threat-model-nova.md`.
- `scripts/cartpanda-create-kit3.js` (não foi mais necessário; kit criado pelo proprietário).
- `docs/governanca/catalogo-skills-repos-conectores-2026-09-08.md` (pesquisa inicial).

## 5. Ferramentas e conectores

- Skills instaladas em `C:\Users\User\.claude\skills\`: frontend-design, impeccable, ui-ux-pro-max, web-design-guidelines, security-best-practices, security-threat-model. Playwright, Lighthouse, axe-core (devDependencies), Gitleaks 8.30, Semgrep 1.176.
- GitHub: `gh` autenticado; push funciona. Vercel CLI sem login (precisa `vercel login` no navegador). Figma: arquivo criado, mas plano Starter atingiu limite do MCP. Notion: funciona (página do roteiro). Codex: acionado por `codex exec` a partir do Claude.
- Ações que o classificador de permissões bloqueou nesta sessão: criar produto no Cartpanda pela API (o proprietário criou pelo painel).

## 6. Pendências (o que falta)

1. **Vídeo da VSL**: gravar; entregar MP4 9:16 até 25 MB + poster. Claude liga no player (`<video data-vsl-video>`), legendas, schema VideoObject, e ativa a revelação atrasada.
2. **Dr. Durval**: foto, CRM, tempo de consultório e liberação do advogado dele para aparecer.
3. **Termos**: condições da garantia (30 dias de teste, saída em 10, o que é devolvido, frasco aberto).
4. **Frete**: manter R$ 25 explícito ou embutir no preço (decisão do proprietário).
5. **Cartpanda**: peso do kit de 3 (0 → 0,5 kg, 23 × 8 × 8 cm).
6. **Meta Pixel** na página nova (decisão: instalar com o ID 1006075098894986 + eventos; atualizar política de privacidade).
7. **Merge do PR #1 em main** publica a página nova como raiz do site (o build já faz o alias). Antes: itens 3 e 6.
8. Melhor Envio (cotação de frete na página) continua indisponível; o checkout cobra R$ 25.

## 7. Como retomar

```
cd C:\Users\User\Downloads\VS_CODE
git fetch origin && git log --oneline -5 origin/feat/pagina-nova
npm run build && PORT=4180 npm run dev      # http://127.0.0.1:4180/cowboy-nova
npm test && npm run test:e2e
```

Antes de editar arquivos compartilhados (`scripts/build-site.js`, `config/commerce.js`, `vercel.json`, `tests/`), conferir se o Codex mexeu neles (`git diff` e `tasklist | grep codex`). Commits via índice temporário; push direto em `feat/pagina-nova`.

## 8. Atualização 14/09 (tarde)

- **Produção não tem a versão VSL.** O PR #1 foi mesclado em 08/09 (versão de conversão). Depois o Codex mesclou os PRs #2 a #10 em `main` (Pixel Meta, GA4, UTMify, `/nova`, versões `cowboy-v1-1.html` e `cowboy-v1-2.html`). Hoje a raiz do site é a **v1.2** do Codex; `cowboy-nova.html` fica em `/v1-0` e `/nova`. Os commits da versão VSL (843bca6 → fa86438) estão só em `feat/pagina-nova`, que diverge de `origin/main` em 37 commits. Para publicar a VSL: rebase da branch sobre `origin/main` (conflitos pequenos em `cowboy-nova.html` [2 scripts], `cowboy-nova.css` [bloco REBUILD-016] e `scripts/build-site.js` [aliases]) e novo PR. Não publicar antes do vídeo existir.
- **Auditoria de concorrentes** (Libidrol/GH Muscle e Fórmula Masculina 1000/Farmafine): `docs/produto/auditoria-concorrentes-2026-09-14.md`, textos integrais em `docs/produto/concorrentes/` (capturas de tela ficaram fora do repositório pelo tamanho), Notion: https://app.notion.com/p/3db691faccdc8120b64ee435923880a7. Plano priorizado com 21 ajustes; 9 sem dependência (itens 6, 10, 11, 15, 16, 17, 19, 20, 21).


## 9. Atualização 14/09 (fim do dia): auditoria aplicada, nova oferta, branch rebaseada

- **Branch `feat/pagina-nova` foi rebaseada sobre `origin/main`** (37 commits do Codex: Pixel Meta, GA4, UTMify, v1.1/v1.2). Conflito único no CSS resolvido mantendo os dois blocos. A página VSL agora carrega `cowboy-pixel.js` e `cowboy-google.js`. O Codex trabalha em worktrees dentro de `.local/` (ignorado), não na árvore principal.
- **Nova oferta (proprietário, 14/09):** 1 frasco R$ 79,90 + frete; 2 frascos R$ 154,80 frete grátis; 3 frascos R$ 199,90 frete grátis; kit de 4 descontinuado; máximo de 3 por pedido. Aplicada em `config/commerce.js` (variantes, `FREE_SHIPPING_FROM_QUANTITY = 2`, `MAX_CART_QUANTITY = 3`), `api/config.js` (`freeShipping`, `freeShippingFromQuantity`), `cowboy-store.js`, `termos.html`, `docs/produto/product-facts.json`, testes (36/36) e specs do Codex (loops 1–3).
- **PENDÊNCIA CRÍTICA ANTES DE PUBLICAR: Cartpanda ainda está com 54,76 / 84,76 / 127,14 e frete R$ 25.** Atualizar preços das variantes 211742450 (1), 211742746 (2), 212751381 (3) e frete grátis nos kits de 2 e 3; conferir parcelamento (a página diz "em até 12x no cartão" sem valor de parcela). Peso do kit de 3 continua 0 no painel.
- **Auditoria aplicada na página** (detalhe em `docs/produto/copy-conversao-nova.md`, rodada 14/09 tarde): números, mecanismo nomeado, composição em cards, "é para você / não é", kits com flags comparativas, urgência com prazo real (`data-deadline="2026-09-30T23:59:59-03:00"` em `#kit`; ajustar quando o lote mudar; some sozinho ao vencer), "Como chega", certificado de garantia + 3 passos, FAQ +5, WhatsApp (oculto até `<body data-whatsapp="55DDDNÚMERO">`), anti-marketplace, flutuante após a prova, eventos de vídeo, avisos de atividade (`assets/data/atividade.json`, só dados reais).
- **O que falta do proprietário:** número do WhatsApp; mensagens originais dos clientes para legendar as fotos; foto/CRM do Dr. Durval (poster do player + bloco de credenciais); confirmação de parcelamento e Pix no Cartpanda; se a embalagem é realmente sem identificação; pedidos reais para `atividade.json` (ou webhook); data real do lote em `data-deadline`; vídeo da VSL.
- **Publicar:** quando o vídeo existir, trocar em `scripts/build-site.js` o alias `index.html` de `cowboy-v1-2.html` para `cowboy-nova.html`, abrir PR de `feat/pagina-nova` para `main`. As páginas v1-1/v1-2 do Codex ainda mostram um card de kit 4 que o `/api/config` passará a marcar como indisponível; retirar ou aposentar essas páginas no mesmo PR.
- Servidor local de revisão: `PORT=4180 npm run dev` → http://127.0.0.1:4180/cowboy-nova. Se a porta estiver ocupada por um `node scripts/serve-site.js` antigo, encerrar antes (serve config velha).

- **14/09 (noite): promessa reescrita no nível dos concorrentes** (dor nomeada, garantia de resultado "não sentiu diferença em 10 dias, o dinheiro volta", "voltar a ser o homem que ela conheceu"); ver `docs/produto/copy-conversao-nova.md`. Três `<!-- ESPAÇO SEU -->` em comentário para o proprietário. Citação do Dr. Durval afirma "eu fiz o COWBOY": confirmar com ele antes de publicar.

- **14/09 (noite, 2):** proprietário mandou tirar a ressalva "não é medicamento, não promete cura" do bloco "não é para você" e qualquer frase que puxe o freio. Removidas: essa linha, "não representa promessa de resultado" (relatos), "sem alegação de função" (composição), "Imagem ilustrativa", "procure um médico" (FAQ). Fica só o texto legal obrigatório do rodapé. Regra daqui em diante: nenhuma ressalva no corpo da página.

- **14/09 (noite, 3): imagens v5 + fundos com paralaxe + kits sem corte.** Ver `docs/produto/auditoria-alinhamento-2026-09-14.md`. Regra do proprietário: nunca apagar a versão anterior; novas versões entram como atualização (v4 intacta, snapshot em `docs/versoes/`). Poster do player agora é consultório sem rosto até a foto/vídeo do Dr. Durval.

- **15/09: VSL real na página** (`videos/vsl/vsl-dr-durval-720.mp4`, poster `imagens/v5/vsl-poster-frame.webp`, `data-reveal-at="200"`). Ver `docs/produto/copy-conversao-nova.md` (15/09) para as três observações (cenas explícitas, "maca", identidade do médico). Original de 283 MB fica fora do repositório (Downloads).

- **16/09: VSL substituída** pelo arquivo `0915 (7)(1).mp4` (mesma duração e cortes, cenas explícitas trocadas por cenas de casal). Versão anterior guardada em `videos/vsl/vsl-dr-durval-720-v1-2026-09-15.mp4` (fora do build). Retiradas todas as menções a CRM/documentos do médico: fica só "Dr. Durval" e o vídeo. **Publicação:** `cowboy-nova.html` passou a ser a raiz (`index.html`) do build; v1.1/v1.2 saíram do build (arquivos mantidos; specs do Codex pulam quando `dist/v1-2.html` não existe). PR de `feat/pagina-nova` para `main` mesclado a pedido do proprietário. Pendências que seguem: preços/frete no Cartpanda (checkout ainda cobra 54,76/84,76/127,14 + R$ 25), WhatsApp, mensagens dos clientes, data real do lote; legenda "maca" no vídeo.

- **16/09 (2): kits sempre visíveis** (`data-vsl-gate="off"`; a trava da oferta pelo vídeo continua disponível com `"on"`). **Mobile sem vazamento horizontal**: tag do topo passou a quebrar linha, `overflow-x: clip` no html/body, card do kit com `minmax(0,1fr)` e selo de economia quebrando linha; medido em 320/360/375/390/412 px sem rolagem lateral. Pedido de integração para o Codex em `docs/governanca/PEDIDO-PARA-CODEX-integracao-2026-09-16.md`.

- **16/09 (3):** sem botão na primeira dobra (só a nota de frete); âncoras extras de argumento e "é para você" removidas; **botão flutuante virou submit do formulário e aparece só enquanto a seção do kit está na tela** (some quando o botão principal está visível); fallbacks `overflow-x: hidden` para Safari antigo. Medido em WebKit e Chromium, 320–430 px, sem vazamento; flutuante envia o kit marcado com as UTMs.

- **17/09: contador do lote acima dos kits** (`[data-stock-box]`, `data-stock-initial="446"`, `data-stock-since="2026-09-17"`): mostra as unidades restantes e desconta os frascos dos pedidos pagos reais do feed `assets/data/atividade.json` (exportador do Codex). Pedido de avisos de compra fictícios: recusado (publicidade enganosa, CDC art. 37; Meta reprova); os avisos continuam só com pedidos reais. Branch `feat/pagina-nova` avançada para a `main` do Codex (PRs #14–#16).

- **17/09 (2):** proprietário pediu reverter o contador do lote (PR #17) por eu não fazer avisos fictícios; página voltou à versão do PR #16 nesses três arquivos. Prazo da condição do lote alterado de 30/09 para **18/09/2026 03:00 BRT** (15 h a partir do pedido); o bloco some sozinho quando vence. Para religar a urgência depois, trocar `data-deadline` em `#kit`.
