# REBUILD-011 — Página COWBOY Energia V3

Status: Em implementação. Direção e critérios registrados antes do frontend.

## Objetivo

Construir a nova página autorizada pelo proprietário com identidade western premium, apresentação interativa do produto, fórmula documentada e relatos reais. A compra aparece somente no bloco final; a experiência anterior serve de referência visual, sem restaurar preços, simulações ou políticas antigas.

## Direção aprovada para execução

Referência histórica: `loja.html` no commit `d4c726d`. Preto, âmbar, couro, títulos condensados e produto em destaque. Evitar aparência genérica de SaaS, predominância de marfim e grade repetitiva de cartões. Conteúdo pronto em `docs/criacao/v3/mapa-e-copy.md`.

## Critérios de aceitação

- [x] Registrar mapa de seções, copy e limites factuais antes da implementação.
- [ ] Implementar sequência: hero → frasco 3D/360 → fórmula → diferenciais concretos → relatos → produto/clareza → FAQ → compra → rodapé.
- [ ] Exibir compra exclusivamente no bloco final, sem barra fixa de compra ou atalhos de hero/menu para oferta.
- [ ] Permitir navegação e rolagem normais; CTAs anteriores apenas editoriais, sem exigir assistir aos vídeos.
- [ ] Entregar visualizador 3D geométrico representativo com interação por ponteiro e alternativa acessível; não apresentar como digitalização exata.
- [ ] Preservar fallback visual do produto e reduzir movimento conforme a preferência do dispositivo.
- [ ] Exibir os seis componentes e quantidades conforme a porção declarada de 12 gotas/1 mL; não inferir dose geral de 24 gotas nem duração dos kits.
- [x] Produzir duas imagens de produto/arte inspecionadas e otimizadas, com identidade de embalagem representativa e sem certificados fictícios; integração pelo frontend pendente.
- [ ] Exibir dois relatos reais e fotos extraídas desses mesmos vídeos, com áudio e originais preservados; identificar legendas automáticas.
- [ ] Não criar estrelas, nomes, compra verificada, contadores, resultados universais ou política de reembolso não adotada.
- [ ] Reaproveitar checkout/frete, preços 1/2/4 de R$ 54,76/R$ 84,76/R$ 169,52 e atribuição já implementados.
- [ ] Conferir celular/desktop, teclado, contraste, tamanho dos textos, mídia, fallback e comportamento de compra final.
- [ ] Executar checks aplicáveis e registrar evidências reais; publicação depende da coordenação no escopo autorizado.

## Responsabilidades

- Conteúdo e direção de arte: agente `audio_depoimentos` (Astra na divisão desta tarefa).
- Frontend e visualizador: agente `videos_clientes` (Terra).
- Coordenação, integrações e decisão de entrega/publicação: agente raiz.
- Revisão visual: conteúdo/arte após disponibilização do frontend, independente da implementação.

## File List

- `docs/stories/REBUILD-011-pagina-v3.md`
- `docs/criacao/v3/mapa-e-copy.md`
- `docs/criacao/v3/direcao-de-arte-e-assets.md`
- `imagens/v3/cowboy-hero-western.png` e `.webp`
- `imagens/v3/cowboy-detalhe-couro.png` e `.webp`
- `imagens/v3/cliente-relato-1.jpg` e `cliente-relato-2.jpg`
- Arquivos de frontend e validação: registrar após entrega do responsável.

