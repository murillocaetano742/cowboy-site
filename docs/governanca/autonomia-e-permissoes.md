# Autonomia e permissões do Codex

Data da verificação: 2026-09-07 (America/Sao_Paulo)

## Diagnóstico

Os diálogos **Allow once** são gerados pela camada de execução do Codex, não pelo agente nem pela governança comercial do projeto. A sessão ativa foi entregue pelo host com estes limites efetivos:

- sandbox `workspace-write`;
- escrita permitida em `C:\Users\User\Downloads\VS_CODE` e temporários autorizados;
- rede de comandos restrita;
- perfil de permissões `managed`;
- solicitações de escalonamento encaminhadas ao usuário.

Por isso, `node scripts/cartpanda-docs.js` pediu confirmação: o programa tenta acessar a internet, atravessando o limite de rede da sessão. A autorização dada pelo proprietário no chat define o escopo do trabalho, mas não substitui a decisão exigida pelo host para atravessar o sandbox. O agente CEO pode autorizar decisões de produto e distribuir tarefas; ele não recebe um mecanismo para clicar ou responder ao próprio pedido de permissão do host.

**Allow once** autoriza somente aquela execução. Uma regra persistente por prefixo, quando oferecida e escolhida pelo proprietário/revisor, cobre futuras execuções que correspondam exatamente ao prefixo salvo. Nesta sessão existe uma regra persistente para `node --env-file=.env.local scripts/cartpanda-read.js`, mas não há evidência de regra para `node scripts/cartpanda-docs.js`; por isso a segunda forma volta a pedir confirmação. A documentação recomenda regras estreitas, por exemplo para um comando de teste específico, em vez de liberar interpretadores inteiros.

## Evidência local

- Executável ativo: `c:\Users\User\.vscode\extensions\openai.chatgpt-26.901.22334-win32-x64\bin\windows-x86_64\codex.exe`.
- Versão: `codex-cli 0.153.0`.
- `codex --help` documenta `--approve-for-me` como o modo que encaminha pedidos de aprovação à revisão automática usando o sandbox `workspace-write`.
- O mesmo help documenta `--ask-for-approval on-request|never`; `never` apenas impede perguntas e devolve falhas ao agente, portanto não concede rede nem amplia o sandbox.
- `codex sandbox --help` documenta perfis nomeados e `--include-managed-config`, confirmando que requisitos gerenciados participam da resolução de permissões.
- A configuração de usuário `C:\Users\User\.codex\config.toml` não contém valor explícito, em nível superior, para `approval_policy`, `sandbox_mode`, `sandbox_permissions`, `permission_profile` ou `approve_for_me`. Logo, os limites observados não vêm de uma preferência simples encontrada nesse arquivo; são limites efetivos injetados pela sessão/host gerenciado.

## Caminho suportado para reduzir as interrupções

**Approve for me** foi verificado na documentação para o aplicativo ChatGPT desktop e como flag do CLI local (`codex --approve-for-me`). Não foi confirmado um controle equivalente na extensão VS Code usada nesta sessão; portanto, essa opção não é apresentada como caminho garantido para a tarefa IDE atual.

Para reduzir as interrupções, o proprietário ou administrador precisa configurar um mecanismo de Auto-review/Approve for me compatível com o cliente efetivamente usado e permitido pela política gerenciada. Quando disponível, esse mecanismo troca o revisor humano pelo revisor automático sem ampliar o sandbox. Se a política gerenciada não permitir, editar apenas `config.toml` não prevalece. Uma alteração de lançamento ou configuração também pode exigir uma nova sessão, pois não há evidência de que uma flag do CLI retroaja sobre a sessão já aberta na extensão VS Code. Auto-review ainda pode negar ações com risco, e prompts de Computer Use podem continuar aparecendo diretamente ao proprietário.

O agente não deve usar `--dangerously-bypass-approvals-and-sandbox`, alterar a política gerenciada, autoaprovar diálogos ou tentar contornar uma negativa. Essas ações não fazem parte da autoridade concedida ao CEO dentro desta sessão.

## Fontes oficiais OpenAI

- [Agent approvals & security](https://learn.chatgpt.com/docs/agent-approvals-security): o modo Auto permite trabalho no workspace, mas pede aprovação para rede e escrita externa; a tabela também documenta Auto-review e seus limites.
- [Auto-review](https://learn.chatgpt.com/docs/sandboxing/auto-review): troca o revisor, sem ampliar rede, raízes graváveis ou demais limites; também informa que prompts de Computer Use continuam diretamente com o usuário.
- [Configuration Reference](https://learn.chatgpt.com/docs/config-file/config-reference): define `approval_policy`, `approvals_reviewer`, `sandbox_mode`, rede do workspace e precedência de requisitos gerenciados.
- [Managed configuration](https://learn.chatgpt.com/docs/enterprise/managed-configuration): no Windows, requisitos podem vir de `%ProgramData%\OpenAI\Codex\requirements.toml` e de políticas em nuvem; camadas gerenciadas limitam as escolhas locais.

## Conclusão operacional para o CEO

Continuar usando ferramentas que já cabem no workspace e chamadas web nativas quando disponíveis. Para comandos externos, reutilizar somente prefixos já aprovados e estruturar novos scripts sob um prefixo estreito estável. Não emitir novos pedidos de escalonamento enquanto o proprietário estiver ausente. Registrar como bloqueio externo qualquer etapa que dependa de rede por comando, interface autenticada ou Computer Use até existir um mecanismo de revisão automática compatível com o cliente e permitido pela política, ou até a ação ser executável por uma ferramenta já autorizada. O CEO coordena o trabalho, mas não pode autoaprovar solicitações do host.
