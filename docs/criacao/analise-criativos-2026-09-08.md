# Análise de mídia COWBOY Energia — 08/09/2026

## Resultado verificável

Os dez criativos informados não foram localizados como conjunto identificável no workspace. A busca local encontrou quatro MP4 relacionados ao COWBOY, mas nenhum tem ID C01–C10, metadados de campanha, destino, texto de anúncio ou autorização de uso que permita vinculá-lo a uma das dez posições.

| Arquivo | Evidência técnica local | Relação observável | Decisão editorial |
| --- | --- | --- | --- |
| `DPJABA.mp4` | 14,373 s; 1080 × 1920; H.264/AAC; 120 fps | Mesmo conteúdo visual amostrado e mesma duração de `videos/depoimento-1.mp4`, em outra codificação | Bloquear como criativo e prova social até origem, consentimento e claims serem comprovados. |
| `DPTHIAGO.mp4` | 13,305 s; 1080 × 1920; H.264/AAC; 120 fps | Mesmo conteúdo visual amostrado e mesma duração de `videos/depoimento-2.mp4`, em outra codificação | Bloquear como criativo e prova social até origem, consentimento e claims serem comprovados. |
| `videos/depoimento-1.mp4` | 14,373 s; 720 × 1280; H.264/AAC; 30 fps | Referência legada encontrada no inventário da antiga `loja.html`; não consta na página atual | Bloquear. |
| `videos/depoimento-2.mp4` | 13,305 s; 720 × 1280; H.264/AAC; 30 fps | Referência legada encontrada no inventário da antiga `loja.html`; não consta na página atual | Bloquear. |

`DPJABA.mp4` e `videos/depoimento-1.mp4` não têm o mesmo hash de arquivo; o mesmo vale para o segundo par. A conclusão de correspondência é somente visual e temporal: os quadros em 0, 3, 6, 9 e 12 segundos mostram a mesma pessoa, cenário e arte sobreposta em cada par. Não se afirma que sejam o mesmo arquivo de origem.

## Como a análise foi feita e seu limite

- Pesquisa de arquivos com `rg --files` em todo o workspace; foram encontradas as duas versões de cada vídeo e nenhum C01–C10.
- Busca adicional limitada a diretórios de primeiro nível de `Downloads` cujo nome continha `cowboy`, `criativ`, `energia`, `nutril` ou `bnt`; nenhum diretório correspondente foi encontrado. Não foram explorados diretórios de outros clientes ou dados pessoais.
- `ffprobe` confirmou vídeo e áudio AAC em todos os quatro arquivos. Quadros foram extraídos localmente com `ffmpeg` em cinco instantes de cada vídeo.
- Não há faixa de legenda e não foi encontrado transcritor local instalado (`whisper`, `faster_whisper`, `speech_recognition`, `torch` e `transformers` indisponíveis). Nenhum áudio foi enviado a serviço externo. Portanto, esta análise não atribui frases aos participantes nem inventa uma transcrição.

## O que é visível nos quatro vídeos

Em todos, uma pessoa fala para a câmera enquanto segura o frasco. A arte fixa contém cinco estrelas douradas, o título `DEPOIMENTO!`, um selo visual da Anvisa/Ministério da Saúde, uma fileira de frascos e o texto `+ 22.000 PACIENTES CURADOS`.

O material mostra pessoas reais diante da câmera, mas isso não prova que sejam clientes, que tenham comprado o produto, que autorizaram uso de imagem/voz, nem que a fala corresponda a uma experiência verdadeira. O nome de arquivo também não prova identidade. Sem transcrição, não é possível avaliar o conteúdo oral; ele deve ser revisado integralmente após existir autorização e uma transcrição fiel.

## Incompatibilidades observáveis

| Elemento visível | Estado de evidência | Consequência |
| --- | --- | --- |
| `+ 22.000 pacientes curados` | Não há estudo, definição de paciente, período ou fonte no workspace | Não publicar. É uma promessa de cura e uma estatística não sustentada. |
| Selo visual da Anvisa/Ministério da Saúde | `product-facts.json` registra que a situação atual não está confirmada e veda selo de aprovação | Não publicar nem reutilizar o selo. |
| Cinco estrelas e `DEPOIMENTO!` | Não há pedido auditável, autorização, relato literal ou identificação mínima consentida | Não classificar como avaliação ou compra verificada. |
| Pessoa falando e segurando o frasco | Origem, relação com a marca e direito de imagem/voz ausentes | Tratar como participante não verificado, nunca como cliente ou ator. |

Nenhum desses vídeos serve hoje como C01–C10, anúncio aprovado, prova social, CTA ou argumento de eficácia. A página atual não os referencia; isso é coerente com o bloqueio.

## Correspondência segura entre anúncio e página

Use somente peças que conduzam para informações já presentes em `/#ofertas` e `/#formula`. O anúncio deve reproduzir literalmente o que o destino pode demonstrar, sem prometer resultado, duração, tratamento, aprovação regulatória, frete gratuito, garantia, estoque ou avaliação.

| Ângulo reaproveitável | Gancho permitido para nova peça | Prova que pode aparecer | Correspondência de destino | Não acrescentar |
| --- | --- | --- | --- | --- |
| Oferta de 2 frascos | `2 frascos por R$ 84,76.` | Seleção de kits e preços visíveis | `/#ofertas`, kit de 2 já selecionado | Escassez, desconto fictício, frete fixo ou resultado. |
| Comparação de preço | `A partir de 2 frascos, R$ 42,38 por unidade.` | Tabela de kits | `/#ofertas` | Dizer que 4 custa menos por unidade que 2. |
| Produto e apresentação | `COWBOY Energia: suplemento alimentar em gotas, frasco de 30 mL.` | Frasco e rótulo documentado | `/#formula` | Linguagem de medicamento, tratamento ou cura. |
| Informação nutricional | `A vitamina B6 auxilia no metabolismo energético.` | A frase literal e a porção de 3 mg exibidas na página | `/#formula` | Transferir a função para desempenho sexual, hormônios ou toda a fórmula. |
| Clareza de compra | `Confira frete e total antes de pagar.` | Consulta por CEP e fluxo de checkout local | `/#ofertas` e seção de entrega | Prometer prazo, entrega discreta, frete grátis ou parcelamento sem homologação. |

Os arquivos de produto finais em `imagens/v2/` podem ilustrar esses ângulos conforme `assets-v2.json`; eles não comprovam rótulo, uso, entrega ou resultados. Preço e texto devem ficar em HTML/na plataforma de anúncio, nunca embutidos em imagem como se fossem condições permanentes.

## Coleta de prova real sem contato automatizado

Nenhuma mensagem foi enviada nesta tarefa. O atendimento pode operar a coleta manualmente no canal já autorizado, usando o roteiro e o registro mínimo de `prova-social-real.md`:

1. Localizar pedidos já concluídos e separar o identificador interno do cliente antes de qualquer contato.
2. Convidar para relatar atendimento, entrega e clareza da informação, sem induzir elogio, cura, desempenho sexual ou nota positiva.
3. Guardar o original e uma transcrição fiel em área restrita; remover telefone, endereço, pedido e dado de saúde que não seja necessário.
4. Obter consentimento específico antes de publicar, indicando canal, prazo, trecho, nome/foto/voz e possibilidade de retirada.
5. Conferir a correspondência com pedido antes de usar `compra verificada`; revisão editorial deve retirar claims de saúde não permitidos sem mudar o sentido do relato.
6. Só então preencher uma posição C01–C10 com arquivo, fala/transcrição, autorização, destino e versão aprovada.

## Dependências para fechar o lote de dez

- Os dez arquivos reais (ou uma planilha que mapeie C01–C10 a caminho, versão e canal).
- Transcrição fiel ou capacidade local de processamento de áudio disponível para revisar a fala dos MP4 existentes.
- Origem, consentimento de imagem/voz e vínculo de compra de qualquer depoimento.
- Cópia final do anúncio, CTA e URL de destino por peça.
- Evidência operacional de frete/checkout antes de alegar condições além de “calcule pelo CEP e revise o total”.
