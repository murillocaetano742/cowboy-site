# Revisão visual — COWBOY Energia v2

Parecer desta rodada: **revisão estática concluída; aceite visual pendente**.

## Capacidade disponível

Em 8 de setembro de 2026, a seleção suportada para `http://127.0.0.1:4173/` respondeu `No browser is available`. A tentativa foi única. Não houve uso de desktop, troca para outro mecanismo, Playwright externo ou repetição após o mesmo bloqueio. Essa limitação impede afirmar que o layout foi aprovado visualmente.

## Revisão estática executada

Foram lidos `index.html`, `loja.html`, `privacidade.html`, `termos.html`, `assets/css/cowboy.css` e `assets/js/cowboy-store.js`, além da story da página e do relatório independente anterior.

O HTML apresenta viewport responsivo, um único `h1`, regiões `header`, `nav`, `main` e `footer`, link para pular ao conteúdo na vitrine, rótulos de formulário, grupos de kits com controles de rádio nativos, estados dinâmicos com `aria-live`, foco visível global, imagens com dimensões e textos alternativos, redução de movimento e conteúdo comercial coerente com os preços aprovados. Não foi encontrada largura fixa global, uso de `100vw`, posicionamento lateral fixo ou mídia sem `max-width` que determine overflow nas larguras alvo.

## Achados corrigidos

| ID | Antes | Depois | Impacto esperado |
|---|---|---|---|
| RV-01 | `.picture-frame` não zerava a margem nativa de `<figure>`. | `margin: 0` no componente. | As imagens de um e dois frascos ocupam a largura prevista pelo grid, com presença maior no mobile e no desktop. |
| RV-02 | Botões `disabled` preservavam cursor e aparência de ação. | Opacidade reduzida, cursor `not-allowed` e sem transformação. | O estado indisponível fica perceptível sem depender apenas do atributo HTML. |
| RV-03 | O email longo do SAC não tinha regra explícita de quebra. | `overflow-wrap: anywhere` em links `mailto:`. | Evita overflow em telas estreitas e durante ampliação. |

As correções são localizadas em CSS e não alteram produto, preços, claims, checkout, frete ou dados pessoais.

## Verificação local após as correções

| Comando | Resultado | Limite |
|---|---|---|
| `npm.cmd run build` | 14 arquivos no pacote público. | Compilação local; não publica. |
| `npm.cmd run lint` | Sintaxe de 20 arquivos aprovada. | O gate declara que não executa ESLint ou TypeScript. |
| `npm.cmd test` | 21/21 testes aprovados. | Testes funcionais e de contrato; não renderizam o navegador. |
| `npm.cmd run check:build` | Allowlist, referências locais e isolamento da saída Vercel aprovados. | Não testa layout visual. |

O CSS fonte e sua cópia no build têm SHA-256 `17A201603B2E914C1F8D0265C7FAA935DD2B95250D2FBDC798BAD422C13763C2`.

## Protocolo visual pendente

Executar no site local sem abrir destinos externos de checkout:

| Cenário | Verificações | Situação |
|---|---|---|
| 360 × 800 | Primeira dobra, legibilidade da oferta, nav, cards, imagens, CEP, tabela, FAQ, email e ausência de rolagem lateral. | Pendente de navegador |
| 390 × 844 | Mesmos pontos e presença do frasco/kit sem margens indevidas. | Pendente de navegador |
| 768 × 1024 | Transição dos grids no breakpoint de 700 px, cards em três colunas, checkout e composição. | Pendente de navegador |
| Desktop ≥ 1280 px | Limite de 1120 px, hierarquia da primeira dobra, alinhamentos, imagens e rodapé. | Pendente de navegador |
| Teclado | Ativar “Pular para o conteúdo”, percorrer links, radios com setas, checkout, CEP, botão, FAQ e links legais; confirmar foco visível e ordem lógica. | Pendente de navegador |
| Zoom/reflow | Testar 200% e 400% até largura equivalente a 320 CSS px; confirmar quebra do email, tabela legível e ausência de conteúdo cortado. | Pendente de navegador |
| Estados | CEP inválido, frete indisponível, checkout indisponível, botão desativado e link do SAC, sem seguir checkout externo. | Pendente de navegador |

## Critério de aceite

O aceite visual só pode mudar para `pass` após evidência real do navegador em todos os cenários acima. Capturas isoladas não substituem o percurso por teclado, a verificação de zoom nem os estados dinâmicos. A revisão futura deve registrar data, viewport, resultado por cenário e qualquer correção subsequente.
