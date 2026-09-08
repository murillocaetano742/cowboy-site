# Revisão funcional e de segurança — COWBOY V3

Data: 08/09/2026. Escopo: `cowboy-v3.html`, `assets/js/cowboy-v3.js`, `assets/js/cowboy-v3-3d.js`, APIs de configuração, frete e checkout, configuração Vercel e build público. Arquivos paralelos `cowboy-360*` e `docs/qa/360/*` não foram usados como evidência.

## Resultado

Os cenários funcionais dirigidos passaram após uma correção de concorrência no frete. Não foram identificadas vulnerabilidades críticas ou altas no escopo revisado. A inspeção seguiu a skill `security-best-practices` para JavaScript de frontend e servidor Node; nenhum scanner pesado foi instalado.

## QA funcional

Execução em Chrome headless isolado, contra `http://127.0.0.1:4173/cowboy-v3.html`, com `/api/config` e `/api/frete` interceptados por mocks locais. Nenhuma requisição a terceiro ocorreu.

- A compra usa um único formulário GET `/api/checkout`, dentro do bloco final, com quantidades 1, 2 e 4.
- Atribuição aceita somente as chaves previstas; um valor de 256 caracteres foi mantido, um de 257 foi descartado e campos arbitrários não foram propagados.
- Uma resposta atrasada do kit 2 foi abortada/ignorada depois da troca para o kit 4; a UI manteve apenas o total atual de R$ 189,52 no cenário simulado.
- A mudança de CEP limpou cotação e total anteriores. Erro posterior manteve “Frete: consulte o CEP” e reabilitou a tentativa.
- `shippingAvailable: false` desativou a consulta de frete e mostrou a mensagem de indisponibilidade.

O primeiro ensaio revelou que uma mudança de kit ou CEP durante a cotação deixava o botão de frete permanentemente desativado. A correção em `assets/js/cowboy-v3.js:63` restaura o estado do botão de acordo com `shippingAvailable`; os mesmos cenários passaram no rerun.

Evidências: `.local/revisao-v3/qa-frete-seguranca.cjs` e `.local/revisao-v3/qa-frete-seguranca.json`. A revisão de navegador já registrada em `docs/criacao/v3/revisao-visual.md` cobre desktop/celular, overflow, console, mídia, teclado, rotação/reset e fallback do 3D.

## Controles de segurança confirmados

- A renderização dinâmica usa `textContent`, `createElement` e `append`; não foram encontrados `innerHTML`, `document.write`, `eval` ou `new Function` no frontend V3.
- O checkout valida quantidade, exige HTTPS e restringe o destino a `*.mycartpanda.com` ou hostname customizado explicitamente permitido (`config/commerce.js:38-93`).
- A API de frete aceita somente contrato pequeno e campos permitidos, valida CEP e quantidade, fixa o host do fornecedor pelo ambiente e encerra a chamada após 6,5 segundos (`api/frete.js:6-7`, `api/frete.js:67-115`).
- O build usa allowlist explícita e o gate confirma que `docs`, `api`, `config`, `tests`, `scripts`, `node_modules` e arquivos ocultos não entram no diretório público.
- A árvore de produção não possui dependências npm; Playwright, axe e Lighthouse são apenas dependências de desenvolvimento.
- `vercel.json:21-25` declara HSTS, `nosniff`, proteção de frame, política de referrer e bloqueio de geolocalização, microfone e câmera.

## Melhorias residuais

### SEC-V3-001 — Baixa — CSP não declarada no repositório

Não há `Content-Security-Policy` em `vercel.json`. O risco atual é reduzido porque os scripts e assets da V3 são locais e não há conteúdo HTML fornecido por usuários, mas uma CSP de produção oferece defesa adicional contra futura introdução de sinks ou scripts. Recomenda-se validar primeiro em modo de relatório e depois adotar uma política compatível com módulos e mídias locais.

### SEC-V3-002 — Baixa e condicional — limitação de chamadas ao frete não é visível

O endpoint público de frete pode gerar chamadas ao fornecedor. O código limita corpo, formato e timeout, mas não há rate limit no repositório. A proteção pode existir no Vercel Firewall; não foi possível confirmá-la porque o conector retornou 403. Quando o acesso for restabelecido, convém verificar a regra efetiva e configurar limitação proporcional caso ela não exista.

## Gates executados

- `npm.cmd run lint`: 27 arquivos JavaScript com sintaxe válida.
- `npm.cmd test`: 22/22 testes passaram.
- `npm.cmd run build`: 56 arquivos gerados.
- `npm.cmd run check:build`: allowlist, referências locais e isolamento do output passaram.
- `npm.cmd ls --omit=dev --depth=0`: nenhuma dependência npm de produção.

O preview remoto não foi criado: a única verificação Vercel autorizada retornou 403. O preview local e as evidências acima permanecem revisáveis.

## Verificação final do atlas real

Após a integração do vídeo 360 fornecido pelo proprietário, `npm.cmd run check:build` gerou 58 arquivos e passou a allowlist exata, as referências locais e o isolamento do output. O `dist` contém `rotulo-360-video.webp` (175.952 bytes), `IMG_1410.jpeg`, o script 3D e a V3. Não contém o HTML exportado do WhatsApp, arquivos `.enc`, o MP4 original nem caminhos de `.local/produto-real-360`.

No servidor local, a V3 respondeu 200 `text/html; charset=utf-8`, o script 3D respondeu 200 `text/javascript; charset=utf-8`, o atlas respondeu 200 `image/webp` e a foto original respondeu 200 `image/jpeg`. A validação de frente, nutrição, verso, teclado, reset e fallback pertence à revisão visual dirigida. A legenda parcial permanece temporariamente até esse aceite e será atualizada pelo responsável pelo frontend.
