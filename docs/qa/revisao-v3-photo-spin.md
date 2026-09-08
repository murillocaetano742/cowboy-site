# Revisão técnica — viewer fotográfico 360 da V3

Data: 08/09/2026. Escopo limitado ao viewer feito com quadros reais. A revisão visual independente foi conduzida em outra frente; este documento não usa funcionamento como prova de realismo ou acabamento profissional.

## Resultado

Os três cenários dirigidos passaram em Google Chrome headless, com contexto isolado, contra `http://127.0.0.1:4173`:

| Cenário | Evidência observada | Resultado |
|---|---|---|
| Quadro inicial obsoleto | `frame-000` foi mantido atrasado; `frame-001` carregou e deixou o viewer em `ready`. Quando `000` terminou, não substituiu o `src`, estado ou mensagem atuais. | Passou |
| Recuperação após falha inicial | As requisições de `frame-000` foram abortadas. Ao avançar, `frame-001` substituiu o fallback e restaurou `data-photo360-state="ready"` e a mensagem “Fotos reais prontas”. | Passou |
| Arraste nativo na V3 | O arraste horizontal mudou `frame-000` para `frame-008`; `draggable=false`, `user-select:none`, `-webkit-user-drag:none`, zero eventos `dragstart` e `scrollY` permaneceu 858. | Passou |

Não ocorreram erros de página nem erros de console inesperados. Durante o cenário V3 foram observadas 22 respostas de rede e nenhuma URL continha Three.js ou `cowboy-v3-3d`.

O teste reproduzível está em `.local/qa-photo360-directed.cjs`; o resultado estruturado está em `.local/revisao-v3/photo360-directed.json`.

## Build e origem dos assets

`npm.cmd run check:build` passou com allowlist exata e 117 arquivos no `dist`.

- 60 quadros públicos, de `frame-000.webp` a `frame-059.webp`;
- dimensões declaradas e conferidas: 480 × 900;
- soma dos quadros: 2.336.824 bytes, abaixo do teto de 6 MB;
- manifesto, contagem e soma de bytes coerentes;
- SHA-256 da fonte no manifesto de trabalho corresponde a `.local/produto-real-360/original.mp4`;
- processamento registrado como escala uniforme e translação, com mão/fundo reais preservados e sem pixels inventados;
- nenhum `amostra-manifest.json`, HTML do WhatsApp, `.enc` ou `original.mp4` no build;
- nenhuma referência pública a `mediaKey`, `blob:`, `.local/produto-real-360`, caminho absoluto de Downloads ou MP4 original;
- nenhuma referência ao módulo 3D rejeitado no HTML/JavaScript da V3.

O manifesto público foi sanitizado; hashes e transformações de trabalho permanecem locais. Vídeos de depoimentos que já pertencem ao site não foram classificados como o MP4 bruto do viewer.

## Limites conhecidos

- O processo antigo que já atendia a porta 4173 devolveu o manifesto com `Content-Type: application/octet-stream`. O código atual do servidor contém o mapeamento `.json` para `application/json`, mas esse processo não foi reiniciado porque sua linha de comando não pôde ser confirmada. A consulta escalada não chegou a executar. O viewer usa `response.json()`, a rotação funcionou e o MIME observado não foi tratado como falha funcional.
- O loop `59 → 0` contém uma mudança real de mão e fundo da gravação. Os testes confirmam navegação circular, mas não alegam emenda invisível ou ausência de salto visual.
- O código limita três carregamentos ativos e mantém até dez referências no cache JavaScript. Esta revisão não mediu o cache interno de imagens decodificadas do Chrome e não extrapola memória para outros dispositivos.
- A sequência preserva a mão existente no vídeo, conforme a decisão comunicada ao proprietário. Não houve remoção, composição generativa ou reconstrução de áreas ocultas.

## Checks executados

- `node .local/qa-photo360-directed.cjs`: passou nos três cenários.
- `npm.cmd run check:build`: passou; allowlist e referências locais conferidas.
- varredura dirigida do `dist`: 117 arquivos, 60 frames, zero arquivos privados/intermediários e zero referências do 3D rejeitado.
- `git diff --check` dos arquivos de pesquisa/protocolo: passou.

O aceite técnico do viewer real 360 está encerrado neste escopo. A avaliação estética e qualquer publicação permanecem em seus fluxos próprios.
