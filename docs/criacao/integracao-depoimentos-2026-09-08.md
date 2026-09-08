# Integração de depoimentos — 08/09/2026

A página inicial passou a exibir dois relatos de clientes em vídeo, com controles nativos, reprodução manual e carregamento sob demanda. Os arquivos públicos são os derivados revisados em `videos/clientes/`; os originais permanecem em `videos/`.

O servidor local entrega MP4 como `video/mp4`, capas JPG como `image/jpeg` e legendas VTT como `text/vtt`. Cada player oferece a faixa “Português (legendas automáticas)”, derivada de transcrição local e não apresentada como revisão humana. A configuração de envio mantém os originais em `videos/` fora do pacote e inclui somente `videos/clientes/`.
