# Pesquisa curta — copy, oferta e implementação da COWBOY NOVA

Data: 08/09/2026. Escopo: página estática HTML/CSS/JavaScript com backend Node existente; nenhuma migração de stack ou execução de código de terceiros.

## Seleção

| Recurso | Estado real | Uso na NOVA |
|---|---|---|
| [Marketing Skills](https://github.com/coreyhaines31/marketingskills) | Repositório público MIT. `copywriting` 2.0.2 e `cro` 2.0.0 foram revisadas e vendorizadas com commit fixado. | Clareza do hero, sequência de argumentos, prova e objeções. São heurísticas; impacto em conversão precisa ser medido. |
| [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines) | Fonte primária pública MIT; a skill `web-design-guidelines` já está disponível localmente. | Revisão de foco, formulários, imagens, desempenho e mensagens de erro. |
| [OpenAI Skills — security-best-practices](https://github.com/openai/skills/tree/main/skills/.curated/security-best-practices) | Skill oficial já disponível localmente. | Revisar JavaScript/Node e preservar allowlists, validação de entrada, CSP e ausência de segredos. |
| [OpenAI Skills — security-threat-model](https://github.com/openai/skills/tree/main/skills/.curated/security-threat-model) | Skill oficial já disponível localmente. | Usar somente se o fluxo comercial ou as fronteiras de confiança mudarem; não é necessário para ajustes visuais isolados. |

`page-cro` é nome antigo: desde a versão 2 do Marketing Skills, page CRO e form CRO foram consolidadas em `cro`. Foram copiados somente Markdown e licença, sem CLI, hooks ou scripts:

- `skills/marketingskills-copywriting/`
- `skills/marketingskills-cro/`

## Aplicação responsável

1. O hero deve explicar com uma mensagem principal o que o produto é e por que o leitor deve continuar. Benefícios devem permanecer nos limites sustentados pelo rótulo e pelas fontes regulatórias.
2. Os dois vídeos reais entram logo após o hero como experiências pessoais identificadas. Não transformar relato em eficácia geral; não criar avaliação, recompra, urgência, cura de disfunção erétil ou garantia de 30 dias sem documento.
3. Cada seção avança um argumento: contexto e posicionamento, produto/composição, confiança, FAQ e oferta final. Objeções são tratadas com informação verificável e transparência. A oferta e qualquer variação de copy permanecem hipóteses até haver medição válida.

### Diretrizes de oferta

A skill [`offers` 1.0.1](https://github.com/coreyhaines31/marketingskills/blob/5b2c0007766c6a1cf1d53fd8fc73e979e0821022/skills/offers/SKILL.md) foi lida no mesmo commit, sem ser instalada ou copiada como terceira skill.

1. Descrever a oferta em linguagem literal: quantidade de frascos, total, preço unitário e próximo passo. O valor pode ser explicado pela comparação verificável entre kits e pela simplicidade do uso; não depende de prometer cura ou um resultado íntimo.
2. Aumentar confiança com o que existe: fotos do produto, dois relatos reais tratados como experiências individuais, composição do rótulo, informação de frete antes do pagamento e atendimento. Bônus, “valor de R$ X” e prova estatística só entram quando houver objeto e fonte reais.
3. Garantia, escassez e urgência são componentes condicionais. Sem política documentada de reembolso, estoque ou prazo verdadeiro, devem ser omitidos. Não usar refund de 30 dias, contagem regressiva ou medo como substitutos de valor.

Números de conversão e exemplos genéricos presentes nas skills upstream não foram adotados como fatos deste produto.

As skills vendorizadas são material de referência do projeto. Elas não foram instaladas globalmente e não têm autoridade sobre instruções do proprietário, políticas, evidência do produto ou código do repositório.

## Mapa Figma

O conector Figma estava exposto, a consulta `whoami` comprovou uma conta autenticada com um único plano e a criação do FigJam foi concluída. O mapa editável registra a sequência aprovada, sem impor layout ou adicionar alegações: [COWBOY Conversão — Narrativa da Página](https://www.figma.com/board/pSBCvyoAeDBS27KGVBwtb4?utm_source=other&utm_content=edit_in_figjam&oai_id=v1%2FEvQ7sx5q3BPpeLbYawssGlnpG0HyMrN47mDuiVZJjg9rJCIB7wcJdT&request_id=f7d675e6-8720-4ae4-97d1-39579ba4977c).
