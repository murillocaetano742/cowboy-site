# QUIZ-038 — versão adicional com VSL

## Pedido e rotas

Em 13/10/2026, o proprietário pediu uma nova versão do quiz com VSL, sem excluir a versão atual. A nova experiência coloca o vídeo na tela final, entre o resultado e a seleção dos kits.

| Experiência | Rota | Identificador GA4 |
| --- | --- | --- |
| Quiz atual, preservado | `/quiz/v1-direto/` | `cowboy_v1_direto` |
| Nova versão com VSL | `/quiz/v2-vsl/` | `cowboy_v2_vsl` |

O atalho `/quiz` continua levando à v1. A homepage VSL e os checkouts Appmax existentes permanecem nos mesmos endereços. As versões têm URLs independentes; não há distribuição aleatória de tráfego nem conclusão sobre qual converte melhor.

## Mídia reutilizada

- Vídeo: `/videos/vsl/vsl-dr-durval-720.mp4`, já publicado e presente na allowlist do site.
- Capa: `/imagens/v5/vsl-poster-frame.webp`, frame do próprio vídeo.
- Metadados conferidos: 276,34 segundos, 720 × 1280, H.264, áudio AAC, 30.576.839 bytes.
- SHA-256 do vídeo: `779329923EDD5F6119EC05F294AE49432EDA8A3564DAB309B2F741695EC1A0B6`.
- Proveniência: substituição registrada em `19815b5`, de 16/09/2026, pelo arquivo entregue pelo proprietário. A cópia com sufixo `v1-2026-09-15` é histórica e não é a mídia desta versão.
- A VSL possui legendas incorporadas à imagem; não há faixa VTT separada. Esta atualização não altera mídia, legendas, depoimentos, resultados, preços ou alegações da versão fornecida.

## Comportamento e mensuração

Player vertical responsivo, controles nativos e `playsInline`. A atualização [QUIZ-039](../stories/QUIZ-039-vsl-autoplay.md) usa `IntersectionObserver` para tentar iniciar a reprodução quando pelo menos 50% do player estiver visível. A primeira tentativa é sem som; o botão **Ativar som** habilita o áudio por gesto explícito. Sem atributo `autoplay`, `preload="none"` mantém a mídia sem download até essa entrada em tela ou uma ação manual anterior. Os kits e o checkout permanecem disponíveis sem obrigatoriedade de assistir.

A tentativa automática ocorre uma única vez por montagem. Depois de uma reprodução ou pausa manual, sair e voltar pela rolagem não reinicia o vídeo. Se `play()` for bloqueado, aparece **Reproduzir vídeo com som**, junto de uma instrução para tocar; os controles nativos continuam disponíveis. A falha da mídia mantém a mensagem própria de recuperação e o acesso aos kits. A escolha de iniciar sem som e liberar o áudio no clique segue as políticas documentadas de [Chrome](https://developer.chrome.com/blog/autoplay/) e [WebKit/iOS](https://webkit.org/blog/6784/new-video-policies-for-ios/).

GA4 continua na propriedade `553376813`, medição `G-VYR2542XCN`. O campo `quiz_id` diferencia as duas rotas desde a abertura. Os eventos de navegação e checkout existentes são preservados.

Em 13/10/2026, a listagem oficial de definições personalizadas confirmou `Quiz COWBOY` (`quiz_id`) e `Etapa do quiz` (`step_index`). Foi criada e confirmada também a dimensão de evento **Progresso da VSL**, parâmetro `percent`, para consultar os marcos de reprodução nos relatórios. Nenhum dado pessoal foi incluído nessa configuração. Esse registro de parâmetro não equivale à comprovação de recebimento de uma sessão real da nova versão.

| Evento adicional na v2 | Significado |
| --- | --- |
| `vsl_start` | Reprodução confirmada pelo evento `playing`, inclusive início automático sem som |
| `vsl_progress` | Cobertura reproduzida de 25%, 50% e 75%, sem repetição |
| `vsl_complete` | Fim da reprodução após cobertura praticamente integral |

Esses eventos medem reprodução, inclusive sem som; não comprovam atenção do visitante ou áudio ativado. Rejeitar a tentativa automática não dispara `vsl_start`. Não foram adicionados novos eventos nem parâmetros na QUIZ-039.

A nomenclatura acompanha os eventos já usados na homepage. Trata-se de instrumentação explícita do player HTML5: a [medição automática de vídeo do GA4](https://support.google.com/analytics/answer/9216061?hl=pt-BR) é descrita pelo Google para vídeos YouTube com suporte à API. Nenhum novo SDK é necessário.

Na v2, a cobertura usa os intervalos `played` do próprio navegador. Repetir um trecho não soma cobertura em dobro e arrastar a barra não fabrica os marcos intermediários. A conclusão exige o evento `ended` e cobertura integral com tolerância de 1% da duração (no mínimo 0,5 segundo). Esses critérios são mais estritos que medir apenas a posição atual do player; comparar relatórios da homepage levando essa diferença em conta.

Somente identificadores neutros e parâmetros de reprodução entram nos eventos. Respostas, perguntas, classificação do resultado e informações pessoais ou de saúde permanecem fora do rastreamento. As preferências GPC/opt-out e o fallback de navegação de checkout continuam aplicáveis.

O bloqueio de fonte Meta registrado em [QUIZ-037](quiz-037-meta-block.md) não é contornado por esta nova rota. Este trabalho não fabrica Purchase nem comprova nova compra aprovada.

## Validação e publicação

Gates locais aprovados: lint, TypeScript e 89 testes (53 do site, 13 do fluxo e 23 da instrumentação). O export final contém 119 arquivos na allowlist. Nenhuma dependência nova foi necessária.

A QA independente aprovou três cenários em navegador, com coleta externa e checkout interceptados:

- V1 e atalho `/quiz` preservados, sem player ou download da VSL. A homepage, conteúdo do quiz, reducer, URLs de checkout e mídia foram comparados com a base `59ca420` e permaneceram inalterados.
- V2 em 375 × 812: posição resultado → VSL → kits, sem overflow; reprodução do MP4 real com áudio/vídeo decodificados, `readyState=4`, 720 × 1280 e duração 276,34 s. Quartis e conclusão foram verificados separadamente com intervalos controlados, sem tratá-los como uma visualização real integral. Os três kits continuam acessíveis com SDK bloqueado.
- V2 em 390 × 844: falha controlada do MP4 mostra mensagem de recuperação sem impedir os kits; SDK Google real gera `_gl`, mantendo identificadores de cliente/sessão e UTMs até o redirecionamento Appmax; GPC suprime os scripts de rastreamento.

Foi corrigido durante a QA um limite de altura ausente: este pacote usa utilities CSS estáticas, portanto uma nova classe Tailwind arbitrária não gerava regra. O player usa agora CSS Module isolado, com `max-height: 70svh` e fallback `70vh`, sem alterar o CSS da v1. A inspeção visual final confirmou vídeo e legendas inteiros, controles visíveis e kits logo abaixo.

Evidências locais de QA: `test-results/cowboy-quiz-vsl-v2-mobile--9166a--checkout-com-SDK-bloqueado/v2-player-375.png` e `real-playback.json`. Os arquivos de teste são locais/ignorados; não contêm confirmação de recebimento de novos eventos em produção. Nenhum pedido, pagamento ou Purchase foi criado.

Publicação concluída pelo [PR #22](https://github.com/murillocaetano742/cowboy-site/pull/22), merge `b9de4a924a574d6d21d7f9f8c10339fb4ba4cf50`, em 13/10/2026. Deployment Git automático `dpl_BWrdNT4w7WRKBi3Fog5wXQ2cRPWm`, READY/Production, sem deploy manual adicional.

- [Nova versão com VSL](https://cowboyenergiamasculina.com.br/quiz/v2-vsl/).
- [Versão atual preservada](https://cowboyenergiamasculina.com.br/quiz/v1-direto/).

Às 13h15min35s UTC, ambas as rotas responderam HTTP 200 e corresponderam por SHA-256 ao conteúdo da implantação autenticada. O hash HTML da v2 é `2d0fdcc7db7ce14a8a3a1395ec129957890f6c8bcba557ed73f4b60dc7b9151c`. Os 14 assets referenciados responderam 200; a homepage não mudou; `/quiz` continua redirecionando para v1 com a query íntegra. A VSL respondeu 206 `video/mp4` com suporte ao Range solicitado e o poster manteve o hash do arquivo existente. A consulta de logs de erro da implantação na janela de 15 minutos retornou zero entradas.

Essa verificação comprova publicação, recursos e preservação das duas versões. Os eventos de vídeo foram validados na QA interceptada; não houve nova sessão completa de mensuração, pedido, pagamento ou Purchase em produção nesta entrega. Evidência privada `.local/quiz-038-final-http.json`; rollback para `dpl_7JQkBpnN9Ag1LyxWCjg8JHhCQ2G2`. O servidor de QA 4398 foi encerrado e suas evidências locais preservadas. O fechamento documental é local e não gera novo deploy.
