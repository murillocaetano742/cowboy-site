# Edição local dos depoimentos — 08/09/2026

## Escopo e preservação

Os originais em `videos/depoimento-1.mp4` e `videos/depoimento-2.mp4` foram preservados sem alteração. Foram geradas cópias públicas em `videos/clientes/`, sem envio de mídia, uso de IA ou alteração da faixa de áudio.

## Cortes aplicados

| Origem | Derivado | Corte de vídeo | Dimensão final | Áudio | Resultado visual |
| --- | --- | --- | --- | --- | --- |
| `videos/depoimento-1.mp4` (720 × 1280) | `videos/clientes/depoimento-1.mp4` | `crop=424:754:172:276` | 424 × 754 | AAC copiado integralmente | Remove a faixa superior, o selo visível e a arte inferior com estrelas, frascos e estatística; mantém rosto e frasco. |
| `videos/depoimento-2.mp4` (720 × 1280) | `videos/clientes/depoimento-2.mp4` | `crop=503:894:60:136` | 502 × 894 | AAC copiado integralmente | Remove título/moldura superior e a arte inferior com selo, estrelas, frascos e estatística; mantém rosto e frasco. A largura final foi ajustada para número par pelo formato `yuv420p`. |

Os derivados usam H.264 (`yuv420p`, CRF 23, `faststart`) e preservam o áudio AAC original. As capas `videos/clientes/depoimento-1.jpg` e `videos/clientes/depoimento-2.jpg` foram extraídas aos 3 segundos dos respectivos derivados.

## Revisão visual

As capas derivadas foram inspecionadas localmente. Não exibem o selo visual, estrelas, moldura, frascos sobrepostos ou o texto “+ 22.000 pacientes curados”.

## Limites editoriais

O áudio foi preservado. A página deve apresentar os arquivos como experiências individuais, sem promover a fala de satisfação, prazo, “resultado 100%” ou melhora relatada como promessa, garantia ou estatística geral. Legendas só serão adicionadas quando a versão fiel em VTT estiver disponível.
