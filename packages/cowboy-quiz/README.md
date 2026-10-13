# COWBOY Energia: quiz

Quiz de entrada para o COWBOY Energia (suplemento alimentar em gotas), modelado sobre o quiz da Bluue (`bluue-quiz-codigo.zip`, 05/10/2026). Mantém o mesmo fluxo, telas e animações; mudou só o necessário para o produto. React, TypeScript e Next.js com exportação estática.

## Abrir localmente

Requer Node.js 24 ou superior.

```sh
npm ci
npm run build
npm run preview
```

Abra `http://localhost:3003/quiz/v1-direto/` (a página `/` também abre o quiz).

## Versões

- `/quiz/v1-direto/`: fluxo original, resultado seguido pelos kits; `quiz_id=cowboy_v1_direto`.
- `/quiz/v2-vsl/`: mesmo fluxo, com a VSL existente entre o resultado e os kits; `quiz_id=cowboy_v2_vsl`.
- `/quiz/v3-editorial/`: capa identificada como conteúdo publicitário, com acesso ao questionário em `/quiz/v3-editorial/quiz/`; ambas usam `quiz_id=cowboy_v3_editorial`.

A v1 continua sendo a variante padrão e não monta nem solicita a VSL. Na v2 e v3, o player usa controles nativos, `playsInline` e `preload="none"`. Ao ficar pelo menos 50% visível, tenta iniciar uma única vez, sem som. O botão “Ativar som” exige um gesto do visitante; se o navegador bloquear a reprodução, aparece “Reproduzir vídeo com som”. Rolar a página não desfaz uma pausa manual. Os kits continuam acessíveis sem assistir ao vídeo, inclusive se houver erro de mídia.

Na v3, são 14 perguntas em 18 etapas. A pergunta `problem_duration`, depois da frequência, registra há quanto tempo a dificuldade é percebida, somente em memória, sem alterar a pontuação ou as frases de gravidade. O progresso único indica a etapa atual de 1 a 18 em todas as telas; avança no fluxo e recua ao voltar. As escolhas anteriores e o peso ajustado reaparecem ao voltar. “Ver kits e valores” junto à VSL rola e move o foco para os kits. Frete do kit selecionado, envio discreto e garantia existente ficam próximos ao checkout. As versões v1 e v2 conservam suas 13 perguntas e 17 etapas.

O MP4 `/videos/vsl/vsl-dr-durval-720.mp4` e a capa `/imagens/v5/vsl-poster-frame.webp` pertencem ao site principal e não são duplicados no pacote. Para conferir a mídia localmente, use o build/servidor integrado da raiz; o preview isolado do pacote não contém esses dois recursos.

Os eventos adicionais são `vsl_start`, `vsl_progress` (25, 50 e 75) e `vsl_complete`, com `video_id=cowboy_vsl`. Os quartis medem a cobertura de trechos realmente reproduzidos (`video.played`), sem somar duas vezes o replay. Buscar o final não gera progresso artificial. A conclusão exige o evento `ended` e cobertura de pelo menos 99%, com tolerância mínima de 0,5 segundo para diferenças de temporização. Esses eventos vão somente ao GA4, são deduplicados por variante e respeitam GPC/opt-out; não enviam texto, URL do vídeo ou respostas.

## O que mudou em relação à Bluue

| Parte | Bluue | COWBOY |
|---|---|---|
| Visual | Azul e branco, Montserrat/Geist | Branco com dourado em todas as telas, Oswald + Manrope, logotipo em texto |
| Faixa etária | 18-29 / 30-39 / 40-49 / 50+ (fotos da Bluue) | Até 39 / 40-49 / 50-59 / 60+ (fotos novas geradas pelo Codex, gpt-6-astra) |
| Tela "89% dos clientes" | Número da Bluue, passa sozinha | 92% dos clientes COWBOY (número informado pelo proprietário em 05/10/2026), com 6 fotos de clientes segurando o frasco e botão Continuar (não passa sozinha) |
| Tela "Seguro / Discreto / Frete grátis" | Depoimentos da Bluue | "Sem receita / Discreto / 30 dias de teste" com imagem gerada: mãos abrindo caixa parda lisa com o frasco real dentro (rótulo colado do PNG verdadeiro) |
| Última pergunta | Relações por mês (doses) | Duas perguntas de dor: "Ela já percebeu?" e "Do que você tem mais medo?" |
| Topo da oferta | "Seu tratamento foi aprovado!" | Resultado: imagem forte, gravidade do caso (moderada / alta / muito alta) calculada pelas respostas, o que pesa no caso dele e o protocolo indicado (sempre 3 frascos) |
| Oferta | Planos ESSENCIAL/CONFIANÇA/PERFORMANCE, assinatura | Kits de 3, 2 e 1 frasco com os preços, parcelas e frete do site; valor por dia em destaque em cada kit; o de 3 vem marcado; sem assinatura |
| Prova social na oferta | Fotos da Bluue | Os 2 vídeos reais de clientes (com legenda) + carrossel de fotos de clientes |
| Botão de compra | Aviso "pagamento não conectado" | Checkout real: `cowboyenergiamasculina.com.br/api/checkout?quantity=N`, levando `utm_*`, `fbclid`, `src` etc. |
| FAQ, garantia, rodapé | Medicamento manipulado, CRM, farmácia | FAQ do site, garantia de 30 dias, fabricante e SAC do rótulo |
| Termo de consentimento | TCLE médico da Bluue | Nota curta sobre o uso das respostas + link da política de privacidade |
| Avaliações "4.8 de 1.285", "+40 mil homens" | Números da Bluue | 4,8 de 1.836 avaliações e +38 mil homens (informados pelo proprietário em 05/10/2026) |

Ficaram iguais: as três perguntas iniciais, preocupação, frequência, régua de peso, sobrepeso, medicação, cirurgia, condições de saúde e todas as animações.

**Sem interrupções:** na Bluue, remédio com nitrato, cirurgia no coração, AVC/infarto recentes, pressão acima de 16 por 9 e arritmia levavam à tela "Vamos parar por aqui?". Como o COWBOY é suplemento vendido sem receita, o proprietário decidiu (05/10/2026) que nada interrompe: essas perguntas de acompanhamento e a tela de parada foram retiradas, e as respostas de saúde (remédio, diabetes, pressão alta, AVC, infarto, arritmia, sobrepeso) passam a somar na gravidade do caso.

## Onde editar

- `src/components/sites/bluue/data.ts`: perguntas, opções e o cálculo da gravidade (`caseResult`: pontos por resposta, faixas e frases do resultado). Até 3 pontos = moderada, 4 a 8 = alta, 9 ou mais = muito alta.
- `src/components/sites/bluue/PreCheckout.tsx`: resultado, kits, preços, parcelas, banners, números de prova social (`RATING`, `REVIEWS`, `CUSTOMERS`), fotos de clientes, FAQ e garantia.
- `src/components/sites/bluue/checkout.ts`: link do checkout e parâmetros repassados.
- `src/components/sites/bluue/SpecialScreens.tsx`: telas animadas, depoimentos e nota de privacidade.
- `src/components/sites/bluue/quiz-vsl.tsx`: player da v2/v3, autoplay silencioso, gesto para som e mensagem de erro de mídia.
- `src/components/sites/bluue/quiz-editorial.tsx`: capa da v3; `quiz-flow.module.css` contém o progresso e os ajustes exclusivos do questionário v3.
- `src/lib/quiz-variant.ts` e `src/lib/vsl-playback.ts`: identidade das variantes e marcos de vídeo baseados na cobertura reproduzida.
- `src/app/cowboy.css`: cores, fontes e componentes do tema COWBOY (por cima do CSS original preservado em `source.css`).
- `public/sites/cowboy/`: imagens, fontes e `videos/` (depoimentos com capa e legenda, os mesmos do site). Originais das fotos geradas em `docs/criacao/originais/`; os pedidos feitos ao Codex em `docs/criacao/pedido-codex-*.md` (faixa etária, gravidade, sem receita).

Os nomes internos (`sites/bluue`, classes `bluue-*`) foram mantidos para não mexer no que não precisava; nada disso aparece para o visitante.

**Se os preços mudarem no site**, atualize `plans` em `PreCheckout.tsx` (valores à vista, parcela 12x com juros, total parcelado, frete do kit de 1).

## Checkout

O botão leva para `/api/checkout?quantity=N` no hostname de produção alternativo (`www` quando o quiz está no domínio principal; sem `www` no caminho inverso). Esse endpoint encaminha para o kit correspondente na Appmax. O salto entre hostnames permite que o Google gere `_gl` no clique. O link nativo já contém a atribuição e não é reescrito no clique, preservando a decoração Google/UTMify. Em desenvolvimento, `NEXT_PUBLIC_CHECKOUT_URL=/api/checkout` continua usando a API local.

No clique simples, a navegação espera o callback de `begin_checkout` (timeout Google de 700 ms), com fallback independente de 800 ms se o SDK estiver bloqueado. O destino é capturado após a propagação do clique, preservando o `_gl` recém-gerado e o kit escolhido. Ctrl/Cmd, Shift, Alt e links para outra aba mantêm a navegação nativa.

As respostas e o resultado ficam somente na memória da aba. A instrumentação recebe apenas o número ordinal da tela e o kit selecionado; não recebe respostas, saúde, idade, peso, gravidade, títulos das perguntas ou o objeto de estado.

## Rastreamento

- GA4 `G-VYR2542XCN`: `page_view`, `quiz_start`, `quiz_step_view`, `quiz_complete`, `view_item`, `select_item` e `begin_checkout`. Parâmetros personalizados: `quiz_id` da variante e `step_index` numérico de 1 a 17 (v1/v2) ou 18 (v3). O valor comercial corresponde ao kit inteiro, com `items[].quantity=1`, evitando arredondar o preço por frasco. `item_name` e `item_variant` identificam a oferta; não foi inventado um SKU.
- Meta `1006075098894986`: `PageView`, `ViewContent` e `InitiateCheckout`, enviados manualmente com `autoConfig=false` antes da inicialização. Não há correspondência avançada configurada pelo código nem captura de cliques por texto.
- UTMify: somente `scripts/utms/latest.js` para atribuição. O SDK de pixel UTMify, que inspeciona formulários e botões, não é carregado dentro do questionário. A integração existente do checkout/webhook continua responsável pelos eventos de compra; o quiz nunca emite `Purchase` nem `Lead`.

Somente a v3 acrescenta os eventos abaixo, com parâmetros fechados por tipos e validação de allowlist em runtime:

| Evento | Parâmetros adicionais e momento |
|---|---|
| `page_view`, `landing_view` | `page_kind=cover` ou `quiz`; navegação nativa entre as duas páginas |
| `quiz_cover_cta` | `cta_location=hero` ou `footer`; callback de 700 ms e fallback independente de 800 ms |
| `quiz_cover_section_view` | `section_id=intro`, `how_it_works` ou `footer`; seção realmente visível |
| `quiz_content_link` | `link_id=privacy` ou `terms`, `link_location=cover` ou `offer` |
| `quiz_answer` | `step_index` somente; uma ocorrência por etapa respondida, sem valor ou texto da resposta |
| `quiz_back` | `from_step_index`, `to_step_index`, `back_count`; clique válido para voltar |
| `quiz_step_revisit` | `step_index`, `visit_count`; retorno a uma etapa já vista, separado da primeira visualização |
| `quiz_result_view`, `view_item` | Resultado e kits, respectivamente, com pelo menos 25% de sua área visível; a chegada ao resultado não antecipa `view_item` |
| `quiz_view_kits` | Clique no CTA junto ao vídeo |
| `vsl_visible` | `video_id=cowboy_vsl`; vídeo pelo menos 50% visível |
| `vsl_unmute`, `vsl_mute`, `vsl_pause` | `video_id` e `interaction_count`; mudanças de audibilidade e pausas após reprodução |
| `vsl_error`, `vsl_autoplay_blocked` | `video_id`; únicos por visita, sem mensagem livre do erro |

Os marcos de vídeo existentes mantêm a cobertura efetivamente reproduzida. Novos eventos editoriais e de vídeo não criam eventos adicionais no Meta. A URL, os títulos e os dados de saúde não são parâmetros das interações. A visibilidade usa `IntersectionObserver`; sem suporte, os elementos e os CTAs funcionam, mas esses eventos não são inventados.

`src/instrumentation-client.ts` inicializa antes da hidratação, removendo parâmetros fora da allowlist e fragmentos da URL antes dos scripts externos. `cowboy_attribution` em `sessionStorage` guarda somente UTMs e identificadores de campanha permitidos. O `_gl` recebido pode ser consumido pelo Google na página atual, mas nunca é armazenado nem reutilizado no link de saída. O referrer enviado ao GA4 contém somente a origem.

GPC e `window['ga-disable-G-VYR2542XCN']=true`, quando definidos antes da inicialização, impedem todos os scripts de marketing e o armazenamento da atribuição. Eventos manuais consultam novamente esses sinais. Falhas de storage, bloqueadores e erros dos fornecedores não impedem a navegação ou o checkout. Marcos de funil, telas e cliques por kit são deduplicados durante a abertura da página, inclusive sob StrictMode e ao voltar telas. O recarregamento inicia uma nova visita.

## Verificar

```sh
npm run check
```

Roda ESLint, TypeScript, os testes do fluxo (incluindo a gravidade por resposta e o repasse de UTMs) e o build.

`node scripts/check-tracking.mjs` verifica inicialização única, variantes/entradas, limites de payload e enums, deduplicação/revisitas, preços, GPC, opt-out GA, storage restrito, sanitização pré-carregamento, cobertura do vídeo e troca do hostname de checkout com callback limitado. Os testes isolam os fornecedores e não geram conversões reais. A suíte E2E da raiz verifica mobile, visibilidade, mídia e navegação com SDKs interceptados.

## Publicar

`out/` é um site estático. Suba o conteúdo na raiz de uma hospedagem (ou em um projeto Vercel próprio) e acesse por HTTP/HTTPS, preservando as pastas `_next`, `sites` e `quiz`.
