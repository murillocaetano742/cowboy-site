# Plano de ação — reconstrução COWBOY Energia

## Objetivo e prazo

Entregar até 08/09/2026 às 08:00 BRT a versão mais completa e verificável que as dependências disponíveis permitirem, separando `repo_ready`, `browser_ready`, `account_ready` e `production_ready`. O prazo não converte credenciais ausentes, documentação médica pendente ou validações externas em estados concluídos.

## Verdade comercial congelada para implementação

| Quantidade | Total | Valor por frasco |
| ---: | ---: | ---: |
| 1 | R$ 54,76 | R$ 54,76 |
| 2 | R$ 84,76 | R$ 42,38 |
| 3 | R$ 127,14 | R$ 42,38 |
| 4 | R$ 169,52 | R$ 42,38 |

O frete será calculado e exibido a partir da integração escolhida quando os dados reais estiverem disponíveis. Não anunciar frete grátis, prazo ou serviço antes do retorno verificável. Parcelamento depende das condições ativas da Cartpanda.

## Mapa de execução — snapshot 08/09/2026 00:20:16 BRT

| Frente | Papel / modelo | Estado no snapshot | Ownership | Reviewer |
| --- | --- | --- | --- | --- |
| Coordenação | CEO/root — modelo/esforço do host não consultáveis | trabalhando na sessão nativa | integração de decisões e aceite | QA independente |
| Governança inicial | `governanca_harness` — Sol high | entrega concluída | contratos, ledger e CLI | CEO/root |
| Consolidação da retomada | `devops_contas` — host não confirmado | único worker consolidando | documentos e painel de evidências | CEO/root |
| Produto e criação | worker — Astra high | concluído e aprovado visualmente por QA | estratégia de oferta, copy, direção de arte e ativos autorizados | QA independente |
| Integrações comerciais | worker — Terra high | entrega local concluída e revisada | Cartpanda, Melhor Envio, UTMify e Google no escopo local | QA independente |
| Desenvolvimento | `frontend_vendas` — Terra high | concluído; 6/6 testes DOM/HTML aprovados | implementação e integração final da página | QA independente |
| QA | `qa_independente` — Astra high | revisão local concluída; parecer conditional para lançamento | revisão somente leitura, testes e findings | CEO aceitou DoD local |
| Operação e DevOps | `devops_contas` — modelo/esforço do host não consultáveis | build local e catálogo Cartpanda entregues; homologação externa bloqueada | contas, build e publicação autorizada após QA | QA + CEO |
| Autonomia suportada | `configuracao_autonomia` — Sol high | diagnóstico local somente leitura concluído | configuração documentada sem alterar segurança | CEO/root |
| Ajustes de CSS | `revisao_visual` — host não confirmado | três correções e verificações locais entregues | CSS; inspeção visual real pendente | revisão independente |
| Revisão independente CSS | `criativos_e_prova` — host não confirmado | entregue; conditional para visual real | revisão estática, sem rerodar testes ou GUI | CEO aceitou escopo estático |
| Inventário dos criativos | `criativos_e_prova` — host não confirmado | quatro vídeos antigos inspecionados; dez criativos não localizados | inventário, claims visuais e origem | CEO/root |

O host informou limite de três workers simultâneos além do root. Neste snapshot, o CEO coordena e somente `devops_contas` consolida os documentos. Os demais workers entregaram seus escopos delimitados. Isso não conclui o aceite visual real, a análise dos dez criativos ausentes, a prova social autêntica ou a homologação externa. O painel registra esse instante, sem monitoramento live ou daemon.

Handoffs locais observados: fatos e copy; três famílias de assets em PNG/WebP aprovadas visualmente por QA; página e endpoints revisados; suíte consolidada 21/21, HTTP local 25/25 e redirecionamentos Cartpanda locais 3/3 aprovados sem seguir o destino; build isolado com 14 arquivos e lint de sintaxe aprovados. O CEO aceitou o DoD local com parecer `conditional` para lançamento. Esses resultados não equivalem a navegador real, compra ou homologação externa.

Na retomada, a suíte 21/21 e o build foram registrados após três correções de CSS. A revisão independente posterior encontrou os mesmos bytes no CSS de origem e em `dist`, sem regressão objetiva no escopo estático; não executou testes novamente. O CEO aceitou essas correções estáticas, preservando como pendentes a experiência renderizada e o lançamento. Fontes: `docs/qa/visual-v2.md` e `docs/qa/revisao-css-independente-2026-09-08.md`.

Inputs operacionais confirmados pelo proprietário: slug Cartpanda `cowboy-energia`; credencial Cartpanda fornecida fora do repositório e que não deve ser copiada para documentação/logs; CEP de origem 74475-239; pacote pronto para kits de até quatro frascos com 23 × 8 × 8 cm e 0,5 kg; frasco individual com 0,06 kg. O proprietário autorizou uso do computador e sessões existentes para configurar os serviços. Esses inputs permitem execução, mas os estados `account_ready` e `production_ready` exigem teste real e QA.

## Skills e mecanismos roteados

| Necessidade | Skill/mecanismo | Aplicação planejada |
| --- | --- | --- |
| Coordenação | `codex-ceo` | contratos, delegação, gates, síntese e aceite sem autoaprovação |
| Painel no chat | `visualize` | snapshot inline somente de leitura, sem rede ou controle do harness |
| Ativos raster | `imagegen` + `design-prompts-ia` | imagens do produto fiéis ao rótulo e direção visual; revisão humana de fidelidade |
| Layout e página | `sites-building` ou implementação local existente | estrutura responsiva e componentes da página conforme a arquitetura do repo |
| Pesquisa oficial | `deep-research` | políticas e documentação primária quando uma decisão depender de informação atual |
| Navegador | `agent-browser-verify` / `verification` | fluxo completo, responsividade, links, checkout e eventos em ambiente autorizado |
| Qualidade | `quality-governance-manager` | revisão independente de claims, privacidade, evidência, regressões e readiness |

Essas skills foram mapeadas a capacidades existentes; o mapa não afirma que todas já foram executadas. Nenhum plugin foi instalado. Conectores externos continuam nos estados `catalogado`, `autenticado`, `testado` e `aprovado` de forma separada.

## Caminho crítico restante

1. Recuperar acesso suportado às páginas já autorizadas quando o runtime conseguir determinar a URL; nenhuma nova tentativa equivalente nesta rodada.
2. Validar o resumo público Cartpanda e a regra de quantidade. O SKU avulso tem flags 0/0; a proposta de limite 1 está documentada e **não foi aplicada**. Não presumir desconto para duas unidades do SKU avulso.
3. Homologar frete com pacote único, identificação empresarial real, UTMify e Google nas contas corretas. Contratos locais não substituem a configuração real.
4. Inspecionar a página renderizada em celular, desktop, teclado e zoom; seguir o roteiro pendente de REBUILD-006.
5. Receber/localizar os dez criativos e prova social autêntica com autorização de publicação. Os quatro vídeos antigos não substituem esse material; a análise local está autorizada, mas a transcrição ainda depende de capacidade técnica.
6. Publicar preview no projeto Vercel existente quando houver acesso válido, obter QA e então executar publicação dentro da autorização já concedida.
7. CEO registra o aceite com evidência. Prazo ou autorização não convertem um gate técnico pendente em aprovação de qualidade.

As frentes independentes podem retomar em paralelo quando seus dados ou canais estiverem disponíveis. Nesta rodada, nenhuma conta ou GUI está em operação; só a consolidação local continua. `production_ready` exige conciliação final.

## Gates de decisão

| Gate | Evidência mínima | Falha que bloqueia avanço |
| --- | --- | --- |
| G0 — verdade comercial | tabela de preços e regra de quantidade única | totais divergentes entre página e checkout |
| G1 — produto/claims | rótulo legível, fatos separados de relatos e copy revisada | promessa terapêutica, dose conflitante ou rendimento inventado |
| G2 — prova social | origem, consentimento, versão publicada e eventual redação | depoimento ou print fabricado/sem autorização |
| G3 — código local | build/validação, links resilientes e sem segredo | erro de execução ou compra dependente de efeito opcional |
| G4 — integrações | testes de CEP, checkout, eventos e retorno com IDs de teste | só existir snippet/configuração sem execução verificável |
| G5 — experiência | celular, teclado, zoom, desempenho e conteúdo legal | bloqueio de compra, ilegibilidade ou divergência material |
| G6 — aceite | relatório QA separado e decisão do CEO | autorrevisão ou evidência ausente |

## Conteúdo e prova autêntica

1. Solicitar relatos de compradores reais por roteiro neutro, sem sugerir cura ou resultado específico.
2. Registrar identidade mínima necessária, pedido elegível, data, canal, texto original e consentimento de uso.
3. Redigir dados pessoais em screenshots; preservar o conteúdo essencial e marcar edições visuais.
4. Enviar a versão final para aprovação do titular antes de publicar.
5. Guardar referência de origem e consentimento fora do material público, com acesso restrito.
6. Retirar o depoimento quando a autorização for revogada ou a origem não puder ser comprovada.

Enquanto esse material não existir, usar elementos verificáveis: fotos fiéis do frasco, composição legível, totais claros, meios de pagamento reais, cálculo de frete real, identificação do fornecedor, políticas e atendimento verdadeiro.

## Critérios de parada e escalonamento

- Parar qualquer claim, dose ou duração que conflite com o rótulo até reconciliação formal.
- Não repetir testes externos após duas falhas equivalentes sem nova hipótese ou correção.
- Escalar somente dados ou acessos realmente ausentes, consentimento do titular, documento do responsável técnico ou ação fora do escopo autorizado, como novo gasto. Construção, configuração das contas e publicação já foram autorizadas; não pedir confirmação comercial repetida. Controles obrigatórios do ambiente não podem ser autoaprovados ou contornados.
- Entregar `repo_ready` com blockers se contas externas não puderem ser validadas no prazo; não chamar esse estado de site 100% em produção.

## Infraestrutura observada

O projeto Vercel existente é `cowboy-site`, no escopo `murillo-digital`. Permanecem os registros de conector HTTP 403 e Vercel CLI 59.11.7 com token inválido; nenhum deploy. Na retomada, o proprietário reautorizou operar as contas abertas. A janela “Vercel - Google Chrome” foi localizada, mas Computer Use parou **antes da captura e da inspeção de login** por não determinar a URL com confiança. Esse é um bloqueio do runtime, distinto de falta de autorização comercial ou de login. O Browser não forneceu instância. Não houve contorno nem repetição nesta consolidação.

A Cartpanda recebeu PUT e releitura GET dos produtos 29750488/29750542/29750543, com variantes 211742450/211742746/211742749 e totais R$54,76/R$84,76/R$169,52. O novo GET às 00:03 BRT confirmou HTTP 200. O checkpoint também registra `/api/config` local HTTP 200, checkout local configurado e frete indisponível. URLs reais permanecem em `.env.local` ignorado; redirects locais 3/3 não seguiram o destino. Resumo público Cartpanda retornou desafio 403, sem homologação. Melhor Envio, UTMify, Google e cadastro empresarial completo continuam sem dados/contexto suficientes nos canais disponíveis. Fonte: `docs/integracoes/checkpoint-2026-09-08.md`.
