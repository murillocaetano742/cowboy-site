# Revisão visual mobile — rodada 1

**Atualização posterior: proprietário rejeitou esta direção. Lote cosmético cancelado; o parecer abaixo é histórico e não autoriza continuidade.**

08/09/2026. REBUILD-014; revisão independente da implementação em `cowboy-v3.html`, guiada manualmente por frontend-design e Impeccable. O engine Impeccable não estava instalado; não se trata de execução automatizada de critique. Capturas próprias feitas em 390 × 844, 360 × 800 e 1440 × 1000.

## Parecer

A reconstrução já altera a arquitetura e a leitura: header curto, títulos condensados, hero de produto central, contraste preto/branco, fórmula agrupada, vídeos associados aos próprios relatos e oferta com um seletor. Os botões têm área clara e rótulos de ação. O público masculino é reconhecível pela embalagem e pelos clientes/relatos, embora o hero precise fortalecer o produto visualmente para não ficar apenas em uma frase genérica sobre energia.

Ainda há quatro problemas de composição que merecem uma correção conjunta antes da entrega. Não é necessário mudar novamente a identidade nem abrir nova rodada de conceitos.

| Prioridade | Evidência | Correção dirigida |
|---|---|---|
| Alta | Hero em390: H1 limitado a212px/8ch quebra em3linhas, altura172px; frase poderia ocupar2linhas nos350px disponíveis. Frasco tem cerca de275px de altura na imagem, cercado por espaço lateral. | Liberar a largura do título para “Seu dia pede” / “energia.”; usar parte da altura economizada para ampliar a imagem, mantendo ponta/base inteiras e CTA ainda perto da primeira tela. Não alargar a garrafa artificialmente. |
| Alta | Vídeo1 dedica mais da metade do quadro ao teto; rosto fica muito baixo, junto dos controles. | Preparar um preview fiel com foco no rosto/frasco e área de play clara. Preservar a reprodução original; não preencher partes do rosto que a fonte não contém. |
| Média | Bloco confiança começa com uma fotografia de escritório ocupando aproximadamente520px antes do título. A cena documental volta a dominar a apresentação, contrariando a direção revisada. | Fazer a copy liderar e oferecer a foto real por consulta compacta, miniatura ou expansão. Não substituir evidência por selo nem abrir um novo carrossel. |
| Média | Nota “Experiências individuais…” aparece no limite esquerdo x=0, enquanto conteúdo usa margem20px. | Restaurar centralização/margens de `.v3-wrap` na nota; a regra de margin da classe específica a sobrescreveu. |

## Evidências e limites

Capturas: `.local/revisao-mobile/astra-rodada1-mobile390-hero.png`, `formula.png`, `relatos.png`, `trust.png`, `offer.png`, com o mesmo prefixo; panorama `astra-rodada1-mobile390-full.png`; comparativo secundário `astra-rodada1-desktop-hero.png`. Métricas em `astra-rodada1.json`.

Não foram encontrados overflow textual ou de documento nas três larguras, erros de JavaScript ou elementos360. Em390, CTA editorial ocupa y738–792, dentro da primeira tela844; em360, y698–752, dentro de800. Esses resultados funcionais não substituem o julgamento visual.

Algumas capturas por elemento de seções longas mostram o conhecido artefato de composição do link de salto fora da viewport; o panorama e as capturas normais não apresentam esse estado visível. Não foi classificado como regressão visual da página.

Fórmula, preço e seletor estão claros. O argumento econômico aparece somente na oferta final. A frase de função da B6 é atribuída ao nutriente e não promete resultado sexual. Os vídeos são os clientes existentes, sem novas identidades ou prova inventada.

Lote enviado ao coordenador e frontend. Próxima revisão será limitada às correções consolidadas, sem nova rodada ampla de gosto. Aprovação final do proprietário permanece pendente.

