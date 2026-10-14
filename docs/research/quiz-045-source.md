# QUIZ-045 — Fontes das telas editoriais do quiz

## Etapa 10: pesquisa genética

[Bright et al., Multi-ancestry investigation of the genomics of erectile dysfunction, Nature Communications 16, 11602 (2025)](https://www.nature.com/articles/s41467-025-66723-7).

Publicação: 24/11/2025. DOI: `10.1038/s41467-025-66723-7`. Conferência do artigo original e revisão independente em 13/10/2026.

A metanálise genética reuniu 1.038.509 participantes e identificou associações com disfunção erétil. Não foi ensaio clínico de tratamento, não testou suplementos e não demonstrou cura nem duração de relação sexual. A quantidade representa participantes de pesquisa, não clientes ou homens tratados.

## Etapa 4: medicamentos e automedicação

Fontes primárias conferidas em 13/10/2026:

- [Notícia da Anvisa sobre uso indiscriminado de medicamentos para disfunção erétil](https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2025/anvisa-emite-alerta-sobre-uso-indiscriminado-de-medicamentos-para-disfuncao-eretil/), publicada em 05/09/2025. O recorte usa o título real e resume o alerta sobre uso recreativo e fora das indicações médicas. Não atribui uma nova reportagem a um jornal nem reproduz identidade visual governamental.
- [Bula do Cialis disponibilizada pela Lilly no DailyMed](https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=bcd8f8ab-81a2-4891-83db-24a0b0e25895), atualizada em 03/06/2026, revisão 03/2026. Cialis contém tadalafila, indicada para disfunção erétil. A associação com nitratos é contraindicada pelo risco de hipotensão. Cefaleia, dispepsia e dor nas costas estão entre os efeitos comuns.

A tela informa riscos do uso sem orientação e conserva o contexto terapêutico: esses medicamentos podem tratar disfunção erétil quando indicados. Não afirma que são ineficazes, não inventa mortes e não apresenta suplemento como substituto mais seguro. A nota orienta a não interromper ou trocar o tratamento por conta própria. Não há dose recomendada, avaliação clínica individual ou orientação baseada nas respostas do quiz.

### Imagens de identificação

Fotografias de embalagens brasileiras, baixadas sem alterar rótulos e convertidas para WebP de 600 × 600 pixels. São referências visuais, não indicação de dose, publicidade de farmácia ou prova de reação adversa. O aviso na tela esclarece que Cialis contém tadalafila.

| Arquivo em `public/sites/cowboy/` | Origem da fotografia | Bytes | SHA-256 |
|---|---|---|---|
| `tadalafila-ems-reference.webp` | [Domifarma: tadalafila EMS](https://www.domifarma.com.br/tadalafila-20mg-c-1-cpr-p118126-p93596) — [arquivo original](https://d1jgmae0hcnr1i.cloudfront.net/Custom/Content/Products/93/59/93596_tadalafila-20mg-c-1-cpr-p118126_z1_638289143880207566.png) | 21.498 | `98287932fab0f8735bb627dccdf9934ccbbc5e4abfdaf7bbce8cb1e8c84e0aea` |
| `cialis-reference.webp` | [Santa Lúcia: Cialis](https://www.santaluciadrogarias.com.br/cialis-20mg-1-cprs/p) — [arquivo original](https://santaluciadrogaria.vtexassets.com/arquivos/ids/160210-800-auto?aspect=true&height=auto&v=637638057191370000&width=800) | 21.766 | `12a5f31647fe20a62e088cbe5f04b4d43f6468929d834618898ac2b540af35af` |

As imagens são servidas pelo próprio site; nenhuma requisição para a farmácia é feita durante o quiz. Sem geração por IA ou imagem de doença/morte atribuída a esses medicamentos.

## Aplicação editorial e ordem do funil

A etapa 10 da v3 usa um jornal digital em HTML/CSS com texto acessível, data, link direto para a fonte e identificação publicitária. Não reproduz o nome, a identidade visual, as figuras ou o texto integral de um veículo jornalístico. Não apresenta o artigo como validação do COWBOY nem como diagnóstico do participante do quiz.

A etapa 4 deixa de antecipar frascos do COWBOY e prova social. A apresentação comercial permanece na etapa 18. Nela, o bloco de prova social já existente (dois vídeos e seis fotos) aparece uma única vez, depois da VSL e antes dos kits. Não foi recuperado o percentual de 92% da antiga etapa 4. Os números já existentes da oferta não foram alterados. Identificação da empresa, consentimento e transparência publicitária são preservados.

As telas 4 e 10 aguardam o usuário continuar; não avançam automaticamente durante a leitura. Na etapa 18, o botão da VSL ainda permite ir diretamente aos kits, com rolagem e foco. A impressão da oferta continua dependendo da visibilidade dos kits, não da prova social.

## Rastreamento e links externos

Os cliques nas fontes usam os identificadores fixos `medicine_alert`, `medicine_leaflet` ou `research_paper`, sempre com `link_location=quiz`, no evento existente `quiz_content_link`. Há validação de combinações, deduplicação e os controles de GPC/opt-out existentes. Os eventos personalizados não enviam respostas, condição clínica, texto livre ou URL; não geram evento Meta.

Todas as fontes recebem a classe global `quiz-research-source`, excluída da decoração UTMify pelo atributo `data-utmify-ignore-classes` no carregamento do SDK. Assim, os links oficiais permanecem exatos, sem identificadores de campanha. O parâmetro público e fixo `setid` do DailyMed identifica apenas a bula. O checkout mantém sua decoração e atribuição habituais.

A medição aprimorada do Google pode também registrar seu evento automático `click` com URL pública, domínio e classe do link. Isso representa navegação de conteúdo, não resposta de saúde; os testes isolam fornecedores e não enviam tráfego de QA aos serviços reais.

As versões v1 e v2 mantêm suas telas, ordem e autoavanço anteriores. Os recortes de jornal são interfaces textuais responsivas e acessíveis, não capturas fabricadas de veículos de comunicação.
