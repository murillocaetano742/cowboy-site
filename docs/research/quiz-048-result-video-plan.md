# QUIZ-048 — Resultado visual, vídeo e continuidade da v5

Contrato de 14/10/2026, consolidado a partir do screenshot e da correção do proprietário sobre a referência da etapa 18. A implementação atualiza a v5 existente; v1–v4 e suas rotas permanecem disponíveis.

## Resultado e pergunta de origem

A referência é o resultado antigo: foto `gravidade.webp`, título destacado, medidor e lista. Recuperar essa hierarquia visual, sem recuperar o cálculo `caseResult`. Esse cálculo atribui “moderada” até a zero pontos e combina idade, medicamentos e condições de saúde sem uma medida clínica documentada. Apenas renomeá-lo como pontuação do quiz não resolve esse limite.

Na v5, a terceira pergunta passa a ser “Como você avalia a intensidade dessa dificuldade hoje?”. Cinco respostas: não percebo dificuldade hoje, leve, moderada, alta e muito alta. O resultado repete a escolha com o rótulo “Intensidade que você relatou” e a nota “É a sua percepção, não um diagnóstico médico.”. O medidor usa posições visuais fixas, sem cálculo de risco. O resumo relata respostas fornecidas, sem atribuir causa, recomendar tratamento ou prescrever kit. Uma resposta ausente ou inválida não recebe classificação inventada.

Essa substituição conserva 14 respostas e 21 etapas visuais. A v4 mantém sua pergunta e resultado de impacto na confiança. A oferta v5 retoma a intensidade declarada; a v4 mantém seu texto anterior. Todas as respostas continuam apenas na memória da aplicação.

## Sequência final e botões

| Etapa | Conteúdo | Botão flutuante e destino |
|---|---|---|
| 18 | Imagem, intensidade declarada, medidor e resumo factual | Assistir à apresentação → 19 |
| 19 | VSL existente, imediatamente visível | Escolher meu kit → 20; apoio “Próximo: depoimentos de clientes” |
| 20 | Dois vídeos e seis relatos existentes | Escolher meu kit → 21 |
| 21 | Oferta, seleção de kit, valores, garantia e dúvidas | Continuar com N frascos → checkout real do kit escolhido |

Root perguntou opcionalmente se o botão 19 deveria aparecer desde a entrada ou no fim do vídeo. Sem nova definição, comunicou a adoção do fim do vídeo. Não usar contagem regressiva: liberar pelo término da reprodução. Uma falha de mídia ou indisponibilidade do player oferece continuidade com aviso. O bloqueio de autoplay oferece reprodução manual. Depois de liberado, o botão permanece disponível ao voltar à etapa. A navegação até depoimentos não é um início de checkout.

O botão fixo da etapa 4 permanece. Nas etapas finais, evitar duas ações primárias iguais na mesma tela. Reservar a altura real do rodapé, incluindo área segura; conferir teclado, foco, zoom, links e controles. A etapa 21 conserva seleção, preços, frete, URL nativa, atribuição, linker e callback limitado do checkout. Seu botão deve mostrar claramente o kit selecionado.

## Reprodução

Compactar somente o cabeçalho v5 da etapa 19 e dimensionar o player pela janela móvel. Ao entrar, pelo menos 50% do vídeo deve estar visível, sem exigir rolagem. O autoplay continua silencioso, por visibilidade e uma única tentativa; não iniciar vídeo fora da tela. Som depende de gesto. Pausa manual e pausa ao sair continuam respeitadas. Os depoimentos não recebem autoplay.

Liberar o botão pelo término não significa registrar a VSL como assistida integralmente: buscar o final pode liberar a navegação, mas `vsl_complete` continua exigindo cobertura real de pelo menos 99%. Não enviar intensidade, respostas ou texto do resultado a fornecedores.

## Validação e release

Validar as cinco intensidades, dados ausentes, 14 respostas, 21 etapas, versões anteriores, histórico e recarga; vídeo real visível em 375×667, 375×812 e 390×844; término, erro, reprodução manual e retorno; botões flutuantes, três kits, teclado, zoom e privacidade. Manter as oito entradas públicas e os arquivos de mídia existentes. Nenhuma dependência, campanha, cadastro, compra de teste ou integração CRM nova.

Gates e publicação pertencem a @devops, após revisão root/QA. Publicar por PR e deployment automático, verificar produção e preservar rollback. Estado e evidências: [story QUIZ-048](../stories/QUIZ-048-resultado-video-v5.md).
