# Protocolo de QA — viewer fotográfico 360 da V3

Data: 08/09/2026. Este protocolo cobre funcionamento, entrega de assets e privacidade. A avaliação estética do produto é uma etapa separada.

## Pré-condições

- O viewer usa apenas quadros derivados do vídeo real preservado em `.local/produto-real-360/original.mp4`.
- O produto visível é fotografia; não existe mesh que substitua o frasco.
- A sequência cobre uma volta progressiva sem inventar graus exatos.
- A mão observada no vídeo permanece nos quadros; não há preenchimento generativo.
- O MP4 bruto, HTML do WhatsApp, arquivos `.enc`, conversas, tokens e URLs assinadas não entram no diretório público.
- O manifesto registra ordem, dimensões, tamanho e origem dos frames, sem dados privados.

## Assets, carregamento e memória

- Inventariar 48–72 WebPs e comprovar soma `<= 6 MB` ou registrar a exceção com medição.
- Validar resposta HTTP `200`, `Content-Type: image/webp`, cache estático e dimensões consistentes de todos os frames.
- Priorizar o primeiro frame e vizinhos; os demais devem carregar progressivamente após interação ou tempo ocioso.
- Limitar preloads simultâneos a 2–3 para não competir com conteúdo principal.
- Manter um cache pequeno de imagens decodificadas, centrado no quadro atual e seus vizinhos, em vez de reter a sequência inteira. Entre 48 e 72 imagens RGBA de 720 × 1280 ocupariam aproximadamente 169–253 MiB só em pixels; o cache HTTP comprimido é uma camada diferente e não elimina esse custo de decodificação.
- Não embutir quadros como base64 nem criar cópias duplicadas da sequência em memória.
- Se a implementação usar `ImageBitmap`, chamar `close()` nos bitmaps descartados. Se usar `Image`, retirar referências aos elementos fora da janela ativa e reutilizar URLs estáticas; o comportamento exato de descarte pelo navegador deve ser medido, não presumido.
- Confirmar que erro em um frame intermediário não trava o controle: manter último quadro válido, tentar vizinho e expor fallback compreensível quando nenhum quadro puder ser exibido.

## Interação

- Arraste horizontal em ambos os sentidos percorre a sequência e envolve primeiro/último quadro sem salto abrupto.
- Clique sem arraste não inicia movimento acidental.
- `ArrowLeft` e `ArrowRight` avançam nos sentidos documentados; `Home` ou o botão de reset retorna exatamente ao quadro inicial.
- Controle recebe foco por teclado, preserva indicador de foco e tem nome acessível.
- Teclas não são capturadas quando o foco está em outro campo ou controle da página.
- Arraste horizontal no viewer não provoca seleção de texto ou imagem fantasma.
- Em tela touch, movimento horizontal controla o viewer; gesto predominantemente vertical continua rolando a página. O componente não deve bloquear toda a rolagem com `preventDefault()` indiscriminado.
- O viewer respeita `prefers-reduced-motion`: sem autorrotação e sem animação longa forçada.

## Reset, fallback e falhas

- Reset após teclado, mouse e touch produz o mesmo índice inicial.
- Com JavaScript desativado, uma fotografia original e texto alternativo continuam visíveis.
- Com suporte à imagem WebP ou com o primeiro frame bloqueado, uma fotografia fallback é exibida e o estado não fica preso em “carregando”.
- Com WebGL bloqueado, o viewer continua funcionando, pois a visualização fotográfica não depende de WebGL.
- Uma URL de frame devolvendo `404` não gera loop de requisições, exceção não tratada ou área vazia permanente.
- Falha de preload não remove quadros já carregados: o último frame real válido deve permanecer visível, sem branco nem substituição por imagem gerada.
- Alternar rapidamente o sentido do arraste não permite que resposta antiga de preload sobrescreva o índice mais recente. O frame exibido deve corresponder à intenção atual mesmo quando carregamentos terminam fora de ordem.
- Atrasar o carregamento do quadro inicial, pedir outro quadro e concluí-lo primeiro: a chegada tardia do inicial não pode substituir o quadro atual nem acionar fallback obsoleto.
- Se o quadro inicial falhar, avançar para um quadro disponível deve retirar o estado de fallback, restaurar o status `ready` e manter o novo quadro real visível.

## Layout móvel e desempenho

- Testar ao menos 1440 × 1000 e 390 × 844, além de largura estreita de 320 px.
- Documento e componente devem permanecer dentro do viewport, sem rolagem horizontal.
- O produto inteiro ou o recorte declarado permanece enquadrado; não cortar informação essencial por `object-fit` inesperado.
- Medir transferência inicial e total, número de requisições, tempo até o primeiro quadro e resposta do primeiro arraste em contexto local isolado.
- Registrar picos de memória em giro completo e inversões rápidas somente como observação comparativa local; não generalizar a todos os dispositivos. Inspecionar se a memória retorna a um patamar estável depois que quadros saem da janela ativa.
- Verificar ausência de erros e rejeições de Promise no console durante carregamento completo e interação rápida.

## Build e privacidade

- Executar os checks existentes de build e sintaxe.
- Comparar manifesto/allowlist com os frames presentes no `dist`; nenhum quadro necessário pode faltar e nenhum arquivo de trabalho deve entrar por glob amplo.
- Procurar no `dist` por extensões e referências privadas: `.mp4`, `.enc`, `WhatsApp Business.html`, `blob:`, `mediaKey`, caminhos absolutos de `Downloads` e URLs assinadas.
- Confirmar que o HTML e JavaScript público referenciam somente os WebPs derivados, a foto fallback e metadados sanitizados.
- Registrar contagem e bytes finais dos assets públicos.

## Resultado esperado

O aceite técnico exige todos os testes acima ou uma lista explícita de falhas. Ele comprova que a rotação fotográfica funciona e preserva a fonte publicada; não comprova, sozinho, realismo percebido, qualidade profissional ou aprovação estética.
