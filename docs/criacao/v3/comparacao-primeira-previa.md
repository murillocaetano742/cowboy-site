# Comparação do hero — primeira prévia e estado atual

Data: 08/09/2026. Análise somente de capturas locais de `http://127.0.0.1:4173/cowboy-v3.html`. Nenhuma mudança de frontend realizada nesta comparação.

## Evidência

- Primeira prévia: `.local/revisao-v3/rodada1-desktop-hero.png` e `rodada1-mobile-hero.png`.
- Estado atual: `.local/revisao-v3/comparacao-atual-desktop-hero.png` e `comparacao-atual-mobile-hero.png`, recapturadas após a pausa.
- A rodada 2 intermediária também permanece disponível; ela ainda posicionava a foto mobile depois de todo o texto. A captura atual já tem a foto entre o apoio e o descritivo, portanto não confundir as duas.

## Diferenças objetivas

| Elemento | Primeira prévia | Estado atual |
|---|---|---|
| Nome grande desktop | Serifas clássicas, sólidas, Georgia, massas largas e poucos ornamentos | Rye western ornamental, recortes internos e terminais decorativos |
| Apoio e marca do cabeçalho | Apoio serifado; marca simples, consistente com H1 | Apoio Barlow condensado sem serifa; marca Rye ornamental |
| Linguagem percebida | Mais editorial e sóbria | Western mais literal e decorativo; mudança de caráter apesar da mesma paleta |
| Fotografia desktop | Frasco inteiro à direita sobre couro/madeira | Mesma arte, enquadramento semelhante; pequenos deslocamentos por altura do texto |
| Fundo desktop | Máscara escura retangular perceptível atrás do texto | Máscara retangular removida, transição mais contínua; mantém área escura para leitura |
| Mobile: composição | Texto sobre fotografia do frasco | Texto em área sólida; fotografia em faixa própria após o apoio |
| Mobile: legibilidade | Título cortado à direita, descrição transbordando, imagem escurecida pelo texto | Título dentro da largura, textos separados da imagem, frasco claro e inteiro |
| Mobile: cabeçalho | Marca e três links comprimidos, links em coluna à direita | Marca acima e três links em linha abaixo |
| Mobile: sequência da dobra | Nome, apoio, descritivo e frasco sobrepostos na mesma imagem | Nome/apoio, foto, depois descritivo; a fotografia passa a interromper o bloco textual |
| Copy | COWBOY ENERGIA / PERSONALIDADE FORTE. FÓRMULA EM GOTAS. | Conteúdo principal mantido; mudança central é tipografia e disposição |

A reação do proprietário é compatível com uma mudança real de identidade visual entre as versões. O principal fator visível no desktop é a troca de Georgia por Rye/Barlow. No celular, a separação entre texto e fotografia também altera significativamente a composição. A comparação não permite atribuir a insatisfação a outra URL, cache ou trabalho externo.

## Recuperação possível, sujeita à direção do proprietário

Recuperar a família e o desenho tipográfico da primeira prévia no H1, apoio e marca do cabeçalho. Preservar os ajustes funcionais de largura, navegação, quebra de e-mail, estabilidade do 3D, fallback, mídia e oferta final. A versão mobile original não deve ser copiada literalmente, pois a evidência mostra cortes e sobreposições; a adaptação precisa conservar a identidade inicial dentro de uma largura legível.

A textura frontal adicional está concluída como asset representativo. A coordenação pausou sua aplicação e a nova linha de copy sobre B6. Não foram feitas novas alterações estéticas por este agente. Aprovação funcional não equivale à aprovação da direção visual pelo proprietário.

## Restauração conferida

Após a decisão da coordenação, o frontend restaurou Georgia no H1, apoio e marca. Capturas independentes: `.local/revisao-v3/restauro-georgia-desktop-hero.png` e `restauro-georgia-mobile-hero.png`. O desktop recuperou o desenho tipográfico da primeira prévia; o celular conserva as correções de largura, navegação e separação da imagem. Os arquivos `comparacao-atual-*` foram recapturados pelo script durante essa conferência e agora também contêm Georgia; a evidência anterior de Rye permanece em `rodada2-*` e nas imagens exibidas na revisão. Nenhuma mudança de frontend foi feita pela subagente.
