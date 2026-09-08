# Sequência fotográfica real de 360° — COWBOY

Data: 08/09/2026. Entrega de recursos para REBUILD-013. A direção foi alterada explicitamente pelo proprietário para mostrar o próprio frasco filmado. Esta sequência é fotografia interativa; não é malha 3D, escaneamento ou renderização PBR. O candidato de estúdio anterior não recebeu aceite de realismo e sua revisão foi interrompida por essa mudança de direção.

## Fonte e integridade

- Vídeo entregue pelo proprietário: `WhatsApp Video 2026-09-08 at 11.19.27.mp4`.
- Original preservado em `.local/produto-real-360/original.mp4`, sem alteração; SHA-256 `c3d1d0c181267230d04f720ae5842954c89ea18c17f15eec7075362f7bcf279e`.
- A sequência usa exclusivamente pixels desse vídeo. A foto real IMG_1410 é o fallback, não foi misturada aos quadros.
- Nenhuma geração de imagem, preenchimento de partes encobertas, remoção de mão ou substituição do rótulo. Fundo, reflexos e mão pertencem à gravação real.

## Arquivos e contrato

| Item | Entrega |
|---|---|
| Manifest final | `imagens/v3/360-real/manifest.json` |
| Quadros finais | `imagens/v3/360-real/frame-000.webp` até `frame-059.webp` |
| Dimensão | 480 × 900 px em todos os quadros |
| Quantidade | 60 quadros, índices consecutivos 0–59 |
| Peso total das imagens | 2.336.824 bytes; maior quadro: 43.762 bytes |
| Frente inicial | `homeIndex: 0`, `frame-000.webp` |
| Fallback | `/imagens/v3/referencias-reais/IMG_1410.jpeg` |
| Amostra intermediária | `amostra-manifest.json`: não necessário ao site final |

Cada entrada pública contém apenas `index`, `src`, `timeSeconds` e `angleDegreesApprox`. Pesos, hashes e transformações ficam no registro privado `.local/produto-real-360/sequence-private-manifest.json`, sem caminhos locais ou detalhes de processamento no manifest servido ao visitante. O manifest deve orientar a ordem; não é necessário inferir nomes nem buscar o MP4 original no site.

## Extração e enquadramento

Script reproduzível: `.local/produto-real-360/prepare-sequence.py`. FFmpeg extrai quadros da primeira volta, entre 1,00 s e 26,57 s, em posições de tempo compatíveis com os 30 fps da fonte. Os PNGs extraídos permanecem em `.local/produto-real-360/sequence-source/` para comparação.

A amostragem usa marcos manuais do rótulo: frente, aproximação do painel nutricional, passagem lateral, verso e retorno à frente. Os ângulos nominais 0–354°, em passos de 6°, são **estimativas**, interpoladas entre esses marcos; a gravação não contém medição de ângulo nem rotação uniforme. Não devem ser anunciados como graus exatos.

O enquadramento identifica a base escura e o eixo, aplica escala uniforme nos dois eixos e translação para o canvas fixo. O diâmetro é aproximado pelos quadros de referência. Não há deformação separada de largura/altura, retificação de texto, mudança de cor ou interpolação generativa. Pequenas margens escuras representam áreas fora da imagem original após a transformação; não completam fotografia. Bicúbica e WebP qualidade 86 são reamostragem/compressão convencionais.

## Conferência visual dos recursos

As 60 miniaturas foram inspecionadas em `.local/produto-real-360/sequence-all.jpg`; amostra anterior em `sequence-sample.jpg`. Frente, painel nutricional e verso correspondem à gravação, sem marca duplicada ou texto inventado. A base e o tamanho aparente ficaram próximos ao longo da sequência. O frasco inteiro é mantido sempre que a fonte o mostra; nas demais vistas, a mão continua encobrindo a parte superior exatamente como no vídeo.

O retorno do último quadro ao primeiro aproxima duas vistas frontais reais, mas **não é uma emenda invisível**: a mão presente no final desaparece na frente inicial limpa, e o fundo/ângulo da câmera variam. Não há dissolvência ou quadro inventado para mascarar essa diferença. Também permanecem pequenas oscilações de perspectiva, foco e centro porque a gravação foi feita à mão. A experiência deve ser apresentada como giro fotográfico real, sem prometer captura de estúdio.

## Integração e pendências

Recursos finais entregues ao frontend e à verificação de build. A inspeção final no visualizador depende do candidato `/cowboy-360-real.html`; este documento não atesta interação ou aprovação visual do proprietário antes dessa verificação. O MP4 bruto, HTML exportado do WhatsApp e arquivos `.enc` não pertencem ao pacote público.


## Checkpoint do visualizador isolado

A página `/cowboy-360-real.html` foi inspecionada em 1440 × 1000 e 390 × 844. Frente, nutricional e verso exibem as fotografias, com base e eixo próximos, sem corte adicional de região disponível do frasco. Comparação direta dos quadros 000, 015, 030, 045 e 059 com os PNGs extraídos registrada em `.local/produto-real-360/sequence-five-source-comparison.png`. O conteúdo corresponde; escala e recorte mudaram, sem reconstrução de partes.

Setas, teclado, Home, arraste e passagem 59 ↔ 0 funcionaram. Nenhum erro de JavaScript; larguras do documento iguais às larguras das duas viewports. A imagem usa `touch-action: pan-y`; rolagem por roda funcionou na página desktop. Na isolada mobile, todo o conteúdo coube na viewport e não havia área adicional para comprovar deslocamento; a conferência de rolagem será feita na seção da página longa.

Falha de manifest manteve a foto inicial. Falha de um quadro posterior manteve a última foto carregada. Foi reproduzida uma falha específica ao bloquear o próprio quadro inicial: imagem quebrada em vez da IMG_1410. Problema comunicado ao frontend para correção dirigida; este checkpoint não representa aceite desse cenário. Evidências: `.local/revisao-estudio/real360-qa.json` e capturas `real360-*.png`.

### Reteste dirigido após a correção do fallback

A correção foi confirmada na página isolada: bloquear `frame-000.webp` ou o manifest exibe a IMG_1410 carregada (`naturalWidth: 1152`), com mensagem correspondente. Bloquear um quadro posterior preserva a foto anterior e informa a falha. Setas, teclado, Home, arraste e passagem 59 ↔ 0 continuam funcionando; sem erro JS ou overflow nas duas larguras. O problema do checkpoint anterior está resolvido.

Até este reteste, `cowboy-v3.html` ainda continha o visualizador de malha anterior. Por isso, o aceite técnico da isolada não foi apresentado como integração já concluída. A conferência da seção `#frasco` permanece dependente dessa substituição pelo frontend.

## Encerramento técnico da integração

O frontend substituiu somente o visualizador da seção `#frasco` pela sequência real. A revisão independente confirmou frente, nutricional e verso dentro da página V3 em 1440 e 390 px, com o frasco completo quando disponível na fonte e sem overflow. A roda do mouse sobre o visualizador deslocou a página em 380 px nas duas larguras; não houve retenção de rolagem. Home voltou ao quadro frontal. Nenhum erro de JavaScript foi observado.

O cenário de falha do quadro inicial também passou na V3 e na isolada: ambas mantêm a IMG_1410 carregada como fallback. Evidência consolidada: `.local/revisao-estudio/integracao-real360-final.json`; capturas `integracao-real360-desktop-frente.png`, `integracao-real360-mobile-viewport.png` e vistas nutricional/verso no mesmo diretório. A captura por elemento da seção longa apresenta um artefato de composição do link de salto; a captura normal da viewport mobile foi feita separadamente e mostra o estado visível correto.

**Aceite técnico deste escopo:** sequência fotográfica real integrada e utilizável, com procedência e limites documentados. Isso não é aprovação estética final do proprietário nem comprovação de captura de estúdio. A mão, o fundo e a mudança entre o fim e o início pertencem à gravação e foram preservados conscientemente. Nenhuma nova alteração estética é proposta neste encerramento.
