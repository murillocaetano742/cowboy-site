# REBUILD-007 — Inventário de criativos e prova real

Status: Inventário local concluído; lote C01–C10, direitos e prova real pendentes do proprietário/operação

## Objetivo

Localizar e avaliar o material criativo COWBOY disponível, separar mídia observável de prova social válida e preparar a correspondência entre futuros anúncios e a página atual sem inventar resultados ou condições comerciais.

## Critérios de aceitação

- [x] Pesquisar o workspace e os diretórios nominais relevantes de Downloads sem acessar dados de outros clientes.
- [x] Inventariar os quatro MP4 COWBOY encontrados, incluindo duração, resolução, áudio e relação visual entre suas versões.
- [x] Registrar exatamente o que é visível e o limite de não haver transcrição local.
- [x] Bloquear os depoimentos legados por claims, origem e autorizações não comprovados.
- [x] Manter dez linhas C01–C10 como `NÃO LOCALIZADO`, sem atribuir os MP4 encontrados a identificadores inexistentes.
- [x] Definir ângulos reaproveitáveis que correspondem à oferta, produto e página documentados.
- [x] Preparar coleta de prova real para atendimento, sem enviar mensagens ou criar depoimentos.
- [ ] Receber e analisar os dez arquivos reais, cada um com versão, canal, copy, CTA e URL.
- [ ] Registrar direitos de imagem/voz, origem e autorização de cada pessoa que apareça em anúncio ou prova social.
- [ ] Conciliar frete, checkout e mensuração antes de ativar tráfego pago.

## Decisões

- `DPJABA.mp4`, `DPTHIAGO.mp4` e as cópias comprimidas em `videos/` não são automaticamente C01–C10. Os pares têm correspondência visual e temporal, mas não igualdade de hash nem vínculo de campanha.
- A moldura visível com selo da Anvisa, “+ 22.000 pacientes curados”, estrelas e “DEPOIMENTO!” é incompatível com a evidência disponível. Os quatro vídeos ficam bloqueados para página e mídia paga.
- O destino editorial padrão de futuras peças é `/#ofertas` para preço/kit e `/#formula` para apresentação/composição. Cada anúncio deve conservar a mesma promessa literal do destino.
- Não há gasto, orçamento, pedido aprovado, receita, reembolso ou vencedor registrado nesta story.

## File List

- `docs/stories/REBUILD-007-criativos-e-prova.md`
- `docs/criacao/analise-criativos-2026-09-08.md`
- `docs/criacao/matriz-criativos-cowboy-2026-09-08.csv`

## Verificação

- `rg --files` no workspace encontrou quatro MP4 relacionados e nenhum arquivo nomeado/mapeado como C01–C10.
- `ffprobe` confirmou streams de vídeo e áudio nos quatro arquivos; cinco quadros por vídeo foram extraídos localmente com `ffmpeg`.
- Não havia faixa de legendas ou mecanismo de transcrição local instalado. Nenhum áudio foi enviado a serviço externo.
