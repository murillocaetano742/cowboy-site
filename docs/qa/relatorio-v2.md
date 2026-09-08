# Revisão independente — COWBOY Energia v2

Parecer final local: **conditional para lançamento**. Os achados funcionais do frontend e o P2 de entrada da API foram corrigidos e revalidados. A suíte passou **21/21**, o contrato HTTP local passou **25/25**, os três redirecionamentos Cartpanda passaram **3/3** sem seguir seus destinos, e o build público contém somente os 14 arquivos permitidos. Os eixos do pacote foram padronizados. Permanecem identificação completa do vendedor, homologação externa e revisão visual no navegador. Esta revisão não aprova o produto sanitariamente nem confirma funcionamento de pagamento ou integrações externas.

Revisor: agente `qa_independente`, diferente dos autores da implementação e das imagens. Escopo: fluxo comercial, contratos de API, oferta, cópia, privacidade, acessibilidade e recursos estáticos. A revisão aplica os critérios da skill `quality-governance-manager`; não representa certificação de uma organização legada que não está instalada neste repositório.

## Evidência já executada

- `npm.cmd test`: **11/11 passaram**, em 07/09/2026 BRT. Os testes usam respostas simuladas de fornecedor; não são cotação real nem teste Cartpanda.
- `node --test tests/qa/api-boundaries.test.js`: **1 passou e 2 falharam** na primeira execução. As falhas reproduzem QA-01 abaixo. Kit de três frascos mantém um único pacote de 0,5 kg e seguro de R$ 127,14.
- Inspeção visual com `view_image` de `cowboy-hero.webp`, `cowboy-packshot.webp` e `cowboy-kit-2.webp`: quantidade de frascos, conta-gotas preto, identidade preta/dourada e volume de 30 mL coerentes. Sem defeito material visível. São recriações com IA, não fotografia documental do rótulo; microtexto não deve fundamentar informação de uso.
- Leitura de `api/`, `config/`, página, CSS, JS, políticas, sitemap, robots e fatos de produto. Preços coerentes: 1 × R$ 54,76; 2 × R$ 42,38 = R$ 84,76; 3 = R$ 127,14; 4 = R$ 169,52.
- Nenhuma publicação, pagamento, etiqueta de transporte ou envio de mensagem a terceiros foi realizado pelo QA.

## Achados iniciais encaminhados aos autores

| ID | Prioridade | Evidência/reprodução | Correção verificável | Situação |
|---|---|---|---|---|
| QA-01 | P2 | Versão inicial: `api/frete.js`, `requestBodyIsAcceptable`, sem Content-Length aceitava `{postalCode: 'x'.repeat(5000)+'01001000', quantity:2}`; `parseBrazilianPostalCode` eliminava texto arbitrário. | Medir o corpo real e restringir formato/tamanho antes de normalizar. | Resolvido pelo autor; testes independentes passaram na rodada final. |
| QA-02 | P2 | `assets/css/cowboy.css`: status de erro/sucesso quase brancos no cartão claro de frete. Contraste aproximado de 1,09:1 e 1,07:1. Texto pequeno dourado sobre papel: 3,44:1; badge claro sobre dourado: 3,69:1. | Cores específicas por superfície e contraste mínimo adequado para texto pequeno. Validar CSS final e, quando disponível, visualização real. | Encaminhado ao frontend. |
| QA-03 | P2 | `index.html`: input de CEP sem atributo `type`, enquanto o CSS seleciona apenas `input[type='text']`; o controle não recebe sua regra de tamanho/padding. | Declarar tipo ou selecionar o controle de forma coerente. | Encaminhado ao frontend. |
| QA-04 | P1 comercial | `termos.html`: não explica meios de arrependimento/cancelamento; páginas não trazem nome empresarial e endereço físico do vendedor. | Explicar canal SAC e direito aplicável; obter identificação verdadeira do vendedor e publicar dados completos. Não inventar endereço ou razão social. | Parte editorial encaminhada; dados externos pendentes. |
| QA-05 | P1 atribuição | A versão inicial de `loja.html` usa meta refresh para `/#ofertas`, descartando UTMs recebidas por `/loja`. O JS inicial também recria CTA sem UTMs. | Preservar somente parâmetros de atribuição autorizados no percurso landing → kit → checkout; validar casos reais de anúncio em ambas as entradas. | Frontend/devops em correção. |

O fluxo inicial também apresentava ausência de compra correta sem JS, mensagem de frete indisponível apagada após `/api/config`, respostas de frete antigas após troca de kit e ausência de total produto + frete. O CEO já encaminhou esses itens ao autor antes desta revisão; devem ser reavaliados na versão estável. `aria-disabled` com `pointer-events:none` bloqueia mouse, mas não resolve sozinho ativação por teclado.

## Oferta, copy e evidência

A oferta de segundo frasco por R$ 30 adicionais tem aritmética correta e oferece uma razão concreta para escolher duas unidades. Repetir somente “clareza”, “composição disponível” e preço em quase todas as seções deixa a proposta de valor pouco desenvolvida. Isso é uma hipótese editorial, não uma promessa de ganho de conversão. A comparação futura deve medir compra concluída e receita por visitante, mantendo preço, entrega e origem do tráfego comparáveis.

Foi encontrada no índice atualizado do **AnvisaLegis**, IN 28/2018, Anexo V, a alegação “A vitamina B6 auxilia no metabolismo energético”, condicionada ao mínimo do Anexo III. A tabela indexada mostra mínimo adulto de 0,26 mg e máximo de 98,60 mg; os 3 mg declarados por porção do rótulo estão dentro desses números. Para zinco, mínimo adulto de 1,65 mg e máximo de 29,59 mg, comparados a 1,7 mg no rótulo. **Limitação:** a abertura direta do texto consolidado devolveu erro do banco do fornecedor durante a auditoria; esses dados vieram do índice da fonte oficial capturado no mês anterior, incluindo alterações de 2026. É um caminho para copy nutricional específica condicionado à conformidade da formulação, não certificação do produto nem evidência de efeito sexual. [IN 28/2018 — AnvisaLegis](https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&cod_menu=1686&cod_modulo=135&link=S&numeroAto=00000028&orgao=DC%2FANVISA%2FMS&seqAto=000&tipo=INM&valorAno=2018).

Não há comprovação de depoimentos, WhatsApp, compras verificadas, resultado em prazo, cura de disfunção erétil ou ejaculação precoce. A ausência de depoimentos inventados está correta. A orientação de 24 gotas continua relatada pelo usuário e pendente de reconciliação; não deve virar dose pública universal ou cálculo de duração dos kits.

## Fontes e limites

- O Decreto 7.962 exige identificação do fornecedor, endereço e informações comerciais e meios claros de arrependimento; a falta desses dados foi classificada como pendência de lançamento, distinguindo fatos do vendedor ainda desconhecidos de texto que pode ser corrigido. [Planalto, arts. 2 e 5](https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/decreto/d7962.htm).
- A documentação Melhor Envio confirma dados unitários, multiplicação de valor segurado por quantidade e preferência por preço/prazo personalizados. Um produto “kit já embalado” de quantidade 1 evita multiplicar 0,5 kg e seguro pelo número de frascos. A resposta real e as transportadoras disponíveis precisam de homologação. [Cálculo de Fretes — Melhor Envio](https://docs.melhorenvio.com.br/reference/calculo-de-fretes-por-produtos).
- Sem teste visual de navegador, checkout real, cotação autenticada, eventos UTMify, Search Console, domínio publicado ou Core Web Vitals medidos. A operação do desktop pertence ao agente de contas e está limitada pelo runtime; QA não tentou contornar esse bloqueio.

## Revalidação da versão final

`node --test tests/qa/frontend-flow.test.js`: **6/6 passaram** após as correções. Evidência limitada a simulação DOM e estrutura HTML:

1. Atribuição permitida do anúncio chega ao formulário sem email/diagnóstico arbitrário.
2. Indisponibilidade mantém mensagem de frete após troca do kit, impede envio de compra e oferece SAC.
3. Resposta atrasada do kit anterior não contamina o kit atual; não reabilita seu botão enquanto outra consulta está pendente.
4. Alterar CEP invalida resultados; erro de fornecedor permite nova tentativa; total produto + frete correto nos casos exercitados.
5. Formulário HTML GET envia os kits 1, 2 e 4 sem depender de JS.
6. `/loja` encaminha somente atribuição permitida à página principal.

QA-02 resolvido no CSS final: erro 7,26:1; sucesso 6,40:1; dourado sobre papel 6,44:1 e badge 6,91:1, calculados a partir das cores e composição aproximada do fundo claro. QA-03 resolvido pelo seletor/controle de entrada final. QA-05 resolvido para navegação com script, conforme testes 1 e 6. A compra sem JS funciona, mas a captura de atribuição depende de script.

As políticas finais removem a alegação de consentimento armazenado e o texto interno de pendências. Privacidade passa a descrever os parâmetros de origem que acompanham o checkout. Termos contém canal SAC e meio para exercer arrependimento. **QA-04 parcialmente resolvido:** razão social e endereço físico verdadeiros do vendedor ainda precisam ser obtidos para abertura comercial. A operação real de atendimento/devolução não foi testada.

A função nutricional específica B6 foi incorporada junto à tabela, com texto literal e sem converter a alegação em efeito da fórmula inteira ou efeito sexual. Não há dose pública universal de 24 gotas nem depoimentos inventados na versão examinada.

**QA-01 resolvido na rodada final de API:** validação estrita aceita somente CEP textual de 8 dígitos ou formato `00000-000`; a medição efetiva em bytes do JSON impede ultrapassar 1 KB mesmo sem Content-Length. Os dois testes antes falhos passaram. Não houve evidência de exploração ou vazamento; o achado era validação insuficiente do contrato de entrada.

O build local foi revisado na rodada complementar abaixo. Resolução de imports no runtime Vercel publicado, integrações autenticadas e renderização de navegador permanecem fora da evidência obtida. Não há alegação de E2E com fornecedor real ou Core Web Vitals nesta revisão.

### Digests dos arquivos revisados (SHA-256)

| Arquivo | Digest |
|---|---|
| `index.html` | `E158D5B8967E08D0DAC88ED29683E2317693962EA1067AABD2ED89AF6063A528` |
| `loja.html` | `02D59893EB47233A913FC324BE5DF63D1B20D0945C98B197DA7C13FBB512446D` |
| `privacidade.html` | `8694BDF197089D99A0F49B2FA4B5B1BBF574FF7314EAE6A997063AE1EB3B8A88` |
| `termos.html` | `DE24CAB29B2A5ADEEC1D147D90B100AF71BEFE434FC0E6D318DCFB00355D40D5` |
| `assets/css/cowboy.css` | `08AD9107C9B07A102754F7B8F79A3933C3590897CF3E23709EE8C36CCE51D87A` |
| `assets/js/cowboy-store.js` | `8DD689D3C684CCDE6E04557A1D8E39E0ECE7649EF0E43CB37B58368B97BF058E` |
| `api/frete.js` | `DF27226F439152F815A583E3589BD81C912A83986607E0DCC0CE38BF01FAAB24` |
| `api/checkout.js` | `708D014CFF88A2A6046B657BFE39F5E26946B65F4A8ADD2527AF2BB2B7B0E841` |
| `api/config.js` | `8F1ACD2287C9A09663B578B189D8EEFDF6E7E36DB4D96AD375E7329FAA6C8EFB` |
| `config/commerce.js` | `2C4C4035816FB462E09A8B02C77F810A6AC4ACB7149F03006F3F2A90F80EE1CA` |
| `config/logistics.js` | `CA673955E93F3105F66E08FCFBC47840E5D1809C9869FC642FC18179BCCC824A` |
| `imagens/v2/cowboy-hero.webp` | `8363E00B210F84FA4B8753D78D2592D70CA87ED926087939B1D55D6CA34A7DDD` |
| `imagens/v2/cowboy-packshot.webp` | `F0E2C03904544D5D17361212A206E035F884BA992EC02762BA635E095FD7AF8A` |
| `imagens/v2/cowboy-kit-2.webp` | `979A8BB35673EA8AC62821578C4DB2862F3437406A7DE7533F4E886890FD0B22` |

## Rodada complementar — API e build local

O agente de implementação corrigiu o limite do corpo e o formato do CEP. A navegação direta de checkout agora recebe página HTML de erro com volta aos kits e SAC; clientes JSON continuam recebendo resposta estruturada. Os textos HTML são constantes, sem interpolação da entrada do visitante. `Cache-Control: no-store` permanece nos handlers.

Foi identificado durante a revisão do novo servidor local que ele entregava corpo textual aos handlers, embora a API espere objeto JSON. O autor corrigiu `scripts/serve-site.js` antes da rodada HTTP. O teste subsequente demonstrou CEP inválido com 400 e CEP válido com 503 de configuração, sem confundir erro do servidor com falha de fornecedor.

### Comandos e resultados executados pelo QA

| Comando | Resultado | Limite |
|---|---|---|
| `node --test tests/qa/api-boundaries.test.js tests/qa/frontend-flow.test.js` | 9/9 passaram | Contratos de API e DOM simulado. |
| `npm.cmd test` | 21/21 passaram: 12 integração + 9 QA | Fornecedor simulado nos testes. |
| `npm.cmd run check:build` | Passou: 14 arquivos públicos, referências locais e `outputDirectory=dist` | Não executa empacotamento Vercel remoto. |
| `npm.cmd run lint` | Sintaxe de 17 arquivos passou | O script informa explicitamente que não faz ESLint ou TypeScript. |
| `node tests/qa/http-smoke.js http://127.0.0.1:4173` | 25/25 respostas HTTP esperadas | HTTP real em loopback, sem credenciais de frete ou links de checkout ativos. |

As 25 requisições cobriram: páginas e recursos públicos 200; `/docs/qa/relatorio-v2.md`, `/config/commerce.js`, `/.env`, `/.env.local`, `/package.json`, `/api/checkout.js` e duas tentativas de traversal 404; configuração pública com preços corretos e disponibilidade falsa; CEP textual inválido 400; CEP válido com integração ausente 503; checkout inválido HTML 400; checkout sem configuração HTML 503 com links funcionais de retorno/contato; checkout API JSON 503.

Inspeção do build confirma lista explícita de páginas/CSS/JS/imagens, sem cópia recursiva da raiz para o diretório público. `.vercelignore` exclui documentação, auditorias, testes, credenciais e arquivos locais do upload. `vercel.json` declara `dist` como saída e inclui `config/**` nas funções. Os aliases `#commerce`, `#logistics` e `#api/*` funcionaram no Node local e nos handlers exercitados por HTTP; isso não prova o empacotamento remoto sem deployment de teste.

### Digests finais que substituem a rodada anterior

| Arquivo | SHA-256 |
|---|---|
| `api/frete.js` | `2AC344CF7405FE808138EED267CB9FAC4B6C099E0210AE80964169310B417EE0` |
| `api/checkout.js` | `9A1B2D423A6500A94080294EBB0E07526FEB8719DCF1272492D38C5B8878F32A` |
| `config/commerce.js` | `2AFC7B4780F5C9131F4C21691F0F3A547843E71B64066B746AD760F5CE3D6C6D` |
| `scripts/build-site.js` | `53788CAFCEFC37E6A3637FF0A1932423DA21B94819981DD2D6E678B108DEEB08` |
| `scripts/serve-site.js` | `BC331DF0B03EDD966EBE5C08DB6D4F363E4DE66126AD4CFA0E930324891FB155` |
| `vercel.json` | `EFDFE119F13D2DB46AF40F7FDA87078E16FAD22F3D952F4663EA922EC9EC4CCC` |
| `.vercelignore` | `CAD9420A943A7EB9903074F3C8C7ADD0DDC0A9150A10B284B767BD13E489E946` |
| `package.json` | `1D460A0ADD78467FF4EFE4BDD6AE6C0058C97BFB925A90B6E65DF93C67283FFF` |

Nenhum novo achado funcional P0/P1/P2 ficou aberto no código local revisado. A pendência comercial QA-04 (identificação completa do vendedor) e a homologação externa impedem elevar o parecer global para `pass`. O servidor de revisão atende somente loopback; não é site público. O QA não publicou, não criou pedido, não efetuou pagamento e não afirmou que as integrações reais estão funcionando.

### Ressalvas após o snapshot

O operador começou a configurar Cartpanda após o teste de respostas 503. `tests/qa/http-smoke.js` foi ajustado para ler a disponibilidade atual: quando há checkout configurado espera 302 HTTPS e não segue o redirecionamento; quando frete está configurado pula a cotação válida para não chamar um provedor real nessa rotina. O argumento opcional `--expect-unconfigured` exige explicitamente o snapshot antigo. Assim, a evidência de 25 respostas acima não deve ser confundida com teste dos novos links de compra.

O CEO apontou divergência de eixos entre ledger e `config/logistics.js`: a configuração examinada usava altura23/comprimento8/largura8. Recomenda-se padronizar **comprimento23/largura8/altura8** em código, testes, ledger e Cartpanda, preservando as medidas reais confirmadas. A documentação ME distingue os eixos e não foi obtida evidência de normalização universal pelas transportadoras; a equivalência geométrica não prova equivalência operacional. Esse alinhamento deve ser conferido antes da cotação real, sem aumentar dimensões para satisfazer uma transportadora.

## Último aceite exclusivamente local — links Cartpanda configurados

Esta seção substitui as pendências de redirecionamento local e eixos do snapshot anterior. Por instrução explícita do usuário/CEO, a rodada usou somente arquivos do workspace e HTTP em `127.0.0.1:4173`. Não houve acesso externo, GUI, browser, downloads, escalonamento de permissão, criação de pedido ou pagamento.

- `config/logistics.js` agora declara **lengthCm23, widthCm8, heightCm8, weightKg0.5**, origem74475239 e peso unitário0.06. A suíte existente verifica o payload com os eixos corrigidos. SHA-256 final: `EB980DB779C09E66A9A1C87390914F033A7A2E11F88DCC082E565B6701F84F6C`.
- `npm.cmd test`: **21/21 passaram** novamente.
- `node tests/qa/http-smoke.js http://127.0.0.1:4173`: **25/25 passaram** com configuração atual; checkout válido302, checkout inválido400, frete sem Melhor Envio503, CEP inválido400, páginas/recursos200, arquivos internos/traversal404.
- `node tests/qa/checkout-local.js`: **3/3 passaram**, conforme tabela abaixo. O teste usa `redirect: 'manual'`, verifica HTTPS e host, variante, UTMs e `Cache-Control: no-store`. Um parâmetro arbitrário `email` foi descartado. O valor de `Location` foi inspecionado localmente; nenhum destino foi aberto.

| Kit | Resposta local | Host do destino | Variante esperada | UTMs |
|---|---|---|---|---|
| 1 frasco | 302 | `cowboy-energia.mycartpanda.com` | `211742450` | Preservadas |
| 2 frascos | 302 | `cowboy-energia.mycartpanda.com` | `211742746` | Preservadas |
| 4 frascos | 302 | `cowboy-energia.mycartpanda.com` | `211742749` | Preservadas |

Os digests de API, commerce, servidor local, build, vercel.json e package.json permaneceram iguais aos registrados na rodada complementar; somente o digest de logística acima substitui o anterior. Credenciais não foram lidas, copiadas ao relatório ou expostas pelo QA.

**Conclusão do aceite local:** nenhum achado de código P0/P1/P2 aberto no escopo revalidado. O projeto serve a vitrine localmente e produz os redirecionamentos esperados. O parecer de lançamento continua `conditional`: 302 não confirma página Cartpanda carregada, preço na tela final, pagamento, cotação real, UTMify, Search Console ou publicação Vercel. Identificação completa do vendedor e revisão visual também permanecem pendentes.
