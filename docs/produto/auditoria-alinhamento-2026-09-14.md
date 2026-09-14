# Auditoria de alinhamento da página (copy · funil · oferta · imagens · promessa) — 14/09/2026, noite

Pedido do proprietário: a página é um composto; tudo precisa contar a mesma história. As imagens ainda contavam a história antiga ("rotina tranquila, homem na varanda") enquanto a copy passou a contar "você foi bloqueado, um médico te desafia, 30 dias para voltar a ser o homem que ela conheceu". Além disso, os frascos apareciam cortados no seletor de kit.

## 1. A história que a página conta hoje (linha de promessa)

1. **Dor nomeada** (hero, argumento, "é para você"): ereção que não vem ou não fica, acabar antes da hora, vontade que sumiu, "ela parou de pedir".
2. **Diagnóstico** (mecanismo): não é a idade, é o Bloqueio da Primeira Passagem; por isso gotas, não cápsula.
3. **Autoridade** (Dr. Durval): médico que "não viu homem acabado" e assina o desafio.
4. **Prova** (galeria): homens reais com o frasco na mão, um no segundo frasco.
5. **Oferta** (kits): 30 dias para voltar a ser o homem que ela conheceu; frete grátis a partir de 2; melhor preço no 3.
6. **Risco zero** (garantia): não sentiu diferença em 10 dias, o dinheiro volta; 30 dias para ter certeza.
7. **Fechamento**: continuar fingindo cansaço ou deixar ela perceber a diferença.

## 2. Onde as imagens estavam desalinhadas

| Lugar | Imagem atual (v4) | Problema | Imagem nova (v5) |
|---|---|---|---|
| Poster do player (hero) | `hero-varanda` (homem de perfil olhando o pôr do sol) | Promete "um médico explica" e mostra um homem qualquer; o rosto de perfil vira um "quem é esse?" | `vsl-poster-consultorio`: consultório, médico de jaleco de costas, frasco na mesa. Diz "médico" sem inventar rosto. Sai quando a foto/vídeo real chegar. |
| Fundo do hero | preto liso com gradiente | Sem profundidade; a página parece "cartaz" | `fundo-hero-gotas` em opacidade baixa com paralaxe leve: gotas douradas no preto = produto e marca |
| Argumento ("Você foi bloqueado") | `rotina-manha` (frasco pingando, relógio, copo) | Imagem de rotina calma numa seção que fala de dor e bloqueio | `fundo-quarto-noite` como fundo (quarto escuro, um lado da cama intocado) + `rotina-manha` mantida só no bloco da composição, onde faz sentido (é a rotina de 12 gotas) |
| "É para você se…" | sem imagem | Bloco de texto seco; a promessa "o homem que ela conheceu" não tem rosto | `casal-varanda` (casal 55+, abraço, pôr do sol, rostos parciais) ao lado das listas |
| Dr. Durval | ícone genérico | Citação forte com avatar de app | `medico-maos-frasco` (mãos de jaleco com o frasco, sem rosto) até a foto real |
| Kits | `kits/kit-1..4` (frascos com fogo e reflexo, 1254²) | Quadrado 5,2 rem com `object-fit: cover` cortava conta-gotas e base; fogo compete com o dourado da página | `v5/kit-1..3` montados com o packshot real, frasco inteiro com margem, fundo preto/dourado; card com `object-fit: contain` e caixa maior |
| Fundo da oferta | preto liso | Seção mais longa da página sem respiro visual | `fundo-conta-gotas` (macro da gota) em opacidade baixa atrás dos kits, com paralaxe |
| "Como chega" | ícones | "Embalagem discreta" só dita | `caixa-discreta` (caixa parda sem identificação nas mãos, na porta) |
| Garantia | selo em SVG | Bloco já forte; fundo liso | `fundo-textura-couro` (couro escuro com luz dourada) atrás do certificado |
| Fechamento | sem imagem | Fim seco | `casal-varanda` reaproveitada em fundo escurecido |

## 3. Regras de uso das imagens (para manter o profissionalismo)

- Fundos entram sempre com opacidade entre 0,18 e 0,35, com um degradê preto por cima nas bordas, para o texto continuar legível e a página continuar preta.
- Paralaxe suave (translação de até 6% na rolagem) e flutuação lenta do frasco (4 s, 6 px) só quando o visitante não pede movimento reduzido; no celular a paralaxe é menor.
- Nenhuma imagem com texto, selo, estrela ou número; nenhuma pessoa apresentada como médico ou cliente com rosto reconhecível.
- Versões anteriores permanecem em `imagens/v4/` e a página anterior em `docs/versoes/cowboy-nova-2026-09-14-promessa-forte.html`.

## 4. Copy, funil e oferta: o que ainda não fecha

- **Vídeo**: a página inteira aponta para um vídeo que não existe. Enquanto ele não chega, o poster de consultório e as três linhas seguram, mas a conversão real só aparece com a VSL.
- **Dr. Durval**: a copy fala "eu fiz o COWBOY em gotas" e "coloco o meu nome no desafio". Precisa de foto, CRM e a confirmação dele; sem isso, o bloco de autoridade é um nome.
- **Prova**: as fotos dos clientes precisam da fala deles (mensagens originais). Foto muda sem legenda é a parte mais fraca da prova hoje, e é a parte que os dois concorrentes fazem melhor.
- **Oferta**: preços novos na página, preços antigos no Cartpanda. Enquanto não atualizar, o funil quebra no checkout.
- **Urgência**: prazo de 30/09 é um ponto de partida; precisa virar a data real do lote.
- **WhatsApp**: botões prontos, número faltando. Para esse público é o canal que fecha.
