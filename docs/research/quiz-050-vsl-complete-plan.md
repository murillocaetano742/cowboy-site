# QUIZ-050 — VSL integral antes dos depoimentos

Pedido de 14/10/2026: retirar a opção de avançar a VSL e exigir a reprodução completa. Atualizar somente a etapa 19 da v5 em uso, preservando v1–v4 e as etapas 18, 20 e 21 da v5. Não alterar vídeo, oferta, preços, depoimentos, checkout, SDKs ou rotas.

## Comportamento

- A v5 usa controles próprios de pausar/retomar e ativar/desativar som, operáveis por toque e teclado, com foco visível. Não apresenta barra de busca nem seletor de velocidade.
- O autoplay silencioso por visibilidade permanece. Uma pausa manual não é desfeita ao rolar a página. Sair da etapa pausa o vídeo.
- Uma tentativa de buscar um trecho ainda não reproduzido retorna ao limite de cobertura contínua já assistida. A reprodução usa velocidade normal. Os atributos que desabilitam controles nativos, Picture-in-Picture e reprodução remota complementam a validação de cobertura; não a substituem.
- O botão flutuante “Escolher meu kit” só aparece depois do término nativo e da cobertura integral do vídeo desde o início. O evento precisa ser confiável (`isTrusted`), o elemento precisa estar em `ended` e os intervalos reais em `played` devem cobrir a duração. A tolerância fixa total é de 0,1 segundo, somando início, lacunas e cauda; não se usa 1% da duração ou tolerância adicional por cada salto.
- Erro de mídia, formato não suportado ou autoplay bloqueado não liberam os depoimentos. A interface oferece reprodução manual ou nova tentativa, sem “Continuar sem o vídeo”.
- A proteção também vale para a função de avanço e para restauração do histórico. Depois de completar, voltar e avançar dentro da mesma sessão não exige assistir de novo. Recarregar continua reiniciando a sessão, sem novo armazenamento.

Esta é uma regra de navegação e reprodução no navegador, não uma comprovação de atenção humana nem uma proteção contra alguém que modifique deliberadamente o código pelo DevTools. Não criar login, licença de vídeo ou autorização de servidor fora do escopo.

## Medição e fontes técnicas

Manter nomes, parâmetros e deduplicação dos eventos existentes por cobertura real. Não enviar respostas, intensidade ou outros dados de saúde. Na v5, o handler só encaminha `ended` ao emissor analítico depois da aprovação estrita; fim sem cobertura ou evento sintético não gera `vsl_complete`. O helper analítico compartilhado e o comportamento das demais versões permanecem iguais.

A documentação do elemento [`video`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video) confirma que os controles nativos incluem busca. [`HTMLMediaElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) expõe `played`, `seeking` e `ended`; [`playbackRate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate) define 1 como velocidade normal. A solicitação de desabilitar [Picture-in-Picture](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/disablePictureInPicture) pode ser ignorada por configuração do navegador, por isso a interface não é a única defesa.

## Verificação e entrega

Testar salto ao final, evento de término sem cobertura, busca por teclado, alteração de velocidade, pausa/retomada, som, histórico, recarga e falha/retentativa. Conferir layout mobile e desktop, foco e alvos de toque. Regressões rápidas podem usar MP4 curto real somente no harness de testes; uma execução separada deve reproduzir integralmente o MP4 original em velocidade 1, sem trocar `play`, `played`, `ended` ou o arquivo servido. Repetir o percurso integral público antes do fechamento.

@devops executa gates/build e publicação após revisão root/QA, preservando rollback 049. O acompanhamento e a lista de arquivos ficam na [story QUIZ-050](../stories/QUIZ-050-vsl-completa.md).

## Reproduzir os testes de navegador

Na raiz do worktree, após build e servidor integrado em 4419, a fixture opcional é um trecho real de 12 segundos do próprio MP4. Ela fica em `.local`, não entra no build e não altera o produto. Requer `ffmpeg` disponível para sua geração:

```powershell
New-Item -ItemType Directory -Force -Path '.local/quiz-050-fixtures'
ffmpeg -hide_banner -loglevel error -y -i 'dist/videos/vsl/vsl-dr-durval-720.mp4' -t 12 -vf 'scale=180:320' -c:v libx264 -preset veryfast -crf 30 -c:a aac -b:a 32k -movflags +faststart '.local/quiz-050-fixtures/control-12s.mp4'
$env:E2E_BASE='http://127.0.0.1:4419'
$env:E2E_VSL_FIXTURE=(Resolve-Path '.local/quiz-050-fixtures/control-12s.mp4').Path
npx playwright test tests/e2e/cowboy-quiz-steps.spec.js tests/e2e/cowboy-quiz-journey.spec.js tests/e2e/cowboy-quiz-editorial.spec.js tests/e2e/cowboy-quiz-vsl.spec.js --grep-invert '@full-vsl' --workers=3 --output=test-results/quiz-050-controls
```

Os casos de SDK real também recebem `GOOGLE_TAG_FIXTURE` e `UTM_TAG_FIXTURE`, apontando para cópias locais dos scripts já auditados; coleta e checkout continuam interceptados. Sem essas variáveis, os casos dependentes ficam explicitamente ignorados. Nesta entrega foram fornecidas e verificadas. Se `E2E_VSL_FIXTURE` não for definida, as regressões usam o vídeo original, com timeout ampliado; caminho explícito inexistente gera erro claro.

Em processo separado, executar a comprovação integral, que sempre ignora a fixture e exclui o MP4 da interceptação:

```powershell
$env:E2E_BASE='http://127.0.0.1:4419'
$env:E2E_FULL_VSL='1'
npx playwright test tests/e2e/cowboy-quiz-steps.spec.js --grep '@full-vsl' --workers=1 --output=test-results/quiz-050-full-local
```

Para a validação publicada, repetir o último comando com `E2E_BASE=https://cowboyenergiamasculina.com.br` e outra pasta de saída. O caso verifica duração original de 276,341 segundos, velocidade 1, cobertura contínua, término nativo confiável, liberação do botão, marcos analíticos e continuação até oferta/checkout isolado. As amostras de progresso e o relatório final são gravados no diretório do teste.
