# REBUILD-003 — Página comercial COWBOY Energia

Status: Pronta para revisão independente

## Objetivo

Reconstruir a vitrine comercial mobile-first do COWBOY Energia, unificando a mensagem de `/` e `/loja` e ligando a seleção de kits aos contratos locais de checkout e frete.

## Critérios de aceitação

- [x] Exibir oferta: 1 frasco por R$ 54,76; 2 por R$ 84,76; 4 por R$ 169,52; R$ 42,38 por frasco a partir de 2.
- [x] Não publicar dose diária de 24 gotas, rendimento dos kits, alegações terapêuticas, prazo/garantia/frete sem fonte ou prova social não autenticada.
- [x] Usar composição, advertências e público mínimo de 19 anos conforme fatos de produto documentados.
- [x] Oferecer seleção acessível de kits, CTA progressivo para `/api/checkout`, cotação de CEP por `/api/frete` e estados honestos de indisponibilidade.
- [x] Usar somente imagens finais de `imagens/v2`, com layout responsivo, sem bloqueio de cópia/contexto e com navegação por teclado.
- [x] Publicar metadados e dados estruturados coerentes, páginas legais atualizadas, robots e sitemap sem token ou identificador inventado.
- [x] Validar localmente a sintaxe, referências e contratos de página antes da revisão independente.

## Dependências abertas

- URLs reais dos kits Cartpanda e confirmação em ambiente de teste.
- Credenciais, CEP de origem e dimensões homologadas para Melhor Envio.
- Documento técnico que reconcilie a orientação individual relatada de 24 gotas com o rótulo.
- Identificação jurídica do vendedor/distribuidor, política comercial aplicável e prova social consentida.

## Fonte de alegação nutricional publicada

- A única alegação de função publicada é: “A vitamina B6 auxilia no metabolismo energético.” A frase foi aprovada para a porção declarada de 3 mg e deve permanecer literal, sem transferir o efeito para a fórmula, desempenho ou função sexual. Referência indicada para a decisão: [IN nº 28/2018 da Anvisa, Anexos III e V](https://anvisalegis.datalegis.net/action/ActionDatalegis.php?acao=abrirTextoAto&cod_menu=1686&cod_modulo=135&link=S&numeroAto=00000028&orgao=DC%2FANVISA%2FMS&seqAto=000&tipo=INM&valorAno=2018).

## File List

- `index.html`
- `loja.html`
- `assets/css/cowboy.css`
- `assets/js/cowboy-store.js`
- `privacidade.html`
- `termos.html`
- `robots.txt`
- `sitemap.xml`
- `docs/stories/REBUILD-003-pagina.md`

## Verificação

- `node --check assets/js/cowboy-store.js` passou.
- Checagem estática de preços, rotas, conteúdo vedado, imagens e sitemap passou.
- `npm.cmd test` passou com 11 de 11 testes de integração após a correção do contrato de embalagem única.
- A revisão de front posterior removeu o banner de consentimento sem rastreadores, preservou UTMs permitidas no formulário de checkout e em `/loja`, cancelou cotações antigas ao trocar kit/CEP e mostra produtos + frete a partir da cotação retornada.
