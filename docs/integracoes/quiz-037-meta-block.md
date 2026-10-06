# QUIZ-037 — Bloqueio externo do Pixel Meta

Auditoria independente realizada em 06/10/2026 (UTC), durante a homologação isolada do quiz. Nenhum evento foi enviado ao Meta, Google, UTMify ou checkout de produção. Apenas os arquivos JavaScript públicos dos fornecedores foram obtidos por GET; todas as requisições de coleta do navegador foram respondidas localmente.

## Evidência do fornecedor

O arquivo público `https://connect.facebook.net/signals/config/1006075098894986`, solicitado com a versão e os módulos indicados pelo `fbevents.js` atual (`v=2.9.414`), contém:

```javascript
config.set("1006075098894986", "prohibitedPixels", {
  "lockWebpage": true,
  "blockReason": "source_category"
});
```

O SDK exibiu o aviso:

> [Meta pixel] 1006075098894986 is unavailable. Go to Events Manager to learn more.

Com a configuração correta, não houve erro JavaScript. O Pixel foi inicializado com `userData`, `userDataFormFields` e demais campos pessoais vazios, mas o SDK reteve PageView e ViewContent na fila e informou `eventCount: 0`. Nenhuma requisição `/tr` foi emitida. Isso evidencia uma restrição da fonte/categoria aplicada pelo próprio Meta, e não comprova entrega dos eventos de navegador.

Na conferência complementar do Gerenciador de Eventos, **Gerenciar categorias de fontes** apresentou `cowboyenergiamasculina.com.br` como **Conteúdo inadequado**. Em **Ver detalhes**, o painel declarou: **A fonte de dados está bloqueada e não pode compartilhar dados.** A ação **Pedir análise** estava disponível e não foi enviada nesta etapa. Essa evidência oficial abrange o compartilhamento de dados da fonte; o problema não deve ser descrito como restrito ao navegador.

A configuração atual consultada já não contém o bloco `automaticMatching`, coerente com sua desativação no painel. A configuração pública antiga obtida com versão incorreta não foi utilizada para concluir a auditoria; misturar versões do SDK e da configuração causa erro de módulos e não é evidência de defeito no site.

## Consequência e tratamento

- A implementação manual permanece pronta, com `autoConfig: false` antes do `init`, eventos comerciais neutros e sem respostas, idade, peso, condições de saúde ou gravidade.
- O bloqueio do fornecedor deve ser tratado no Gerenciador de Eventos pelo fluxo oficial de classificação/revisão. Esta entrega não cria outro Pixel nem contorna a restrição.
- A presença da chamada `fbq` na fila não é reportada como evento recebido. O teste Meta registra o impedimento externo explicitamente.
- O webhook Appmax → UTMify permanece separado e configurado para compras aprovadas. Essa configuração não supera o bloqueio da fonte no Meta nem comprova entrega pela API de Conversões. Recebimento de Purchase exige revisão da fonte e correlação com um pedido real aprovado; não foi homologado nesta QA.

## Reprodução isolada

Teste: `tests/e2e/cowboy-quiz-tracking.spec.js`. O servidor local utiliza `E2E_BASE` (padrão porta 4397). Fixtures ficam fora do Git em `.local/quiz-037-evidence/`.

As variáveis `GOOGLE_TAG_FIXTURE`, `UTM_TAG_FIXTURE`, `META_TAG_FIXTURE` e `META_CONFIG_FIXTURE` apontam para cópias locais dos scripts públicos. Quando necessário, `META_REFRESH_CONFIG=1` obtém somente o GET público de configuração com os parâmetros exatos solicitados pelo SDK. Todas as coletas, redirecionamentos externos e pedidos permanecem interceptados. Nunca substituir o diagnóstico de fonte bloqueada por uma alegação de envio bem-sucedido.

## Limite distinto da homologação GA4 na saída

O SDK Google real gerou o linker no clique, e o redirecionamento local preservou `_gl`, UTMs e `gbraid` até a URL Appmax correta. O `client_id` do linker corresponde ao cookie `_ga`; o identificador de sessão corresponde ao cookie `_ga_VYR2542XCN`. Os eventos de página e etapas anteriores foram observados no transporte interceptado, sem respostas ou dados de saúde.

O teste das filas comprova `begin_checkout` único para cada kit, moeda BRL e valores corretos. Testes próprios também comprovam a espera por callback, fallback independente de 800 ms, proteção contra duplo clique e funcionamento com o SDK bloqueado. Contudo, a captura de rede e de `fetch`/`sendBeacon` durante a navegação não demonstrou o flush do último batch contendo `begin_checkout`. A ausência nessa captura de unload permanece inconclusiva; ela não é apresentada como entrega comprovada nem como confirmação de defeito adicional no produto. O teste de linker inclui anotação `unconfirmed` para essa limitação.

Por orientação de coordenação, a implementação pode ser publicada com essa homologação explicitamente pendente. A conferência posterior do evento processado no GA4 deve acompanhar uma navegação real autorizada. Nenhum recebimento em produção ou Purchase é alegado com base em filas locais ou nos interceptadores.
