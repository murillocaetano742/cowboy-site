# Pesquisa de recursos de segurança — COWBOY Energia

Consulta: 08/09/2026. Escopo: segurança de código, segredos, dependências, endpoints Node.js, navegador e configuração de entrega. Esta é uma seleção técnica de recursos; não é uma auditoria concluída nem uma declaração de que o site está seguro.

**Recomendação:** começar com as skills `security-best-practices` e `security-threat-model`, requisitos selecionados do ASVS, revisão local de segredos com Gitleaks e análise JavaScript com Semgrep. Usar WSTG para transformar os riscos em testes e ZAP depois, em um ambiente próprio de teste. Trivy e o mapa de responsáveis entram conforme houver dependências e histórico relevantes. Não é necessário instalar todos os recursos.

## Contexto local usado na seleção

Foram lidos somente `package.json`, `vercel.json` e trechos de `api/checkout.js` e `api/frete.js`, além dos nomes dos endpoints existentes. Nenhum arquivo `.env` ou valor de segredo foi acessado.

A aplicação tem frontend HTML/CSS/JavaScript, funções Node.js e build estático em `dist`. O checkout redireciona a partir de quantidade validada e propaga atribuição filtrada; o frete chama um fornecedor pelo servidor com token em variável de ambiente. Existem limites de corpo e timeout no código de frete e cabeçalhos definidos em `vercel.json`. Esses controles observados orientam o escopo da futura revisão; sua efetividade completa não foi testada nesta pesquisa. O `package.json` lido não declara `dependencies` ou `devDependencies`, o que reduz a prioridade imediata de uma ferramenta dedicada a pacotes, sem eliminar riscos de runtime, build e serviços externos.

As prioridades abaixo são julgamento técnico para essa stack, não classificação dos fornecedores.

## Oito recursos avaliados

| Recurso | Licença confirmada | Cobertura útil | Limitação principal | Prioridade |
|---|---|---|---|---|
| 1. Coleção de segurança `openai/skills` | Apache-2.0 nos três pacotes consultados | Revisão de JavaScript; fronteiras navegador/servidor/fornecedor; responsáveis por código sensível | Skills orientam análise, não substituem comprovação técnica; mapa depende de histórico Git útil | Alta para boas práticas/modelo; baixa para mapa agora |
| 2. `trailofbits/skills` | CC-BY-SA-4.0 na coleção | Contexto de auditoria, revisão de diferenças, configurações inseguras, análise estática e validação de achados | Selecionar módulos; ferramentas e regras chamadas possuem licenças/dependências próprias | Média, para aprofundar achados concretos |
| 3. OWASP ASVS | CC-BY-SA-4.0 | Critérios verificáveis de segurança da aplicação | É referência de requisitos, não scanner nem certificado | Alta |
| 4. OWASP WSTG | CC-BY-SA-4.0 | Roteiros de teste web e validação manual | Exige escopo e interpretação; roteiro sem execução não prova proteção | Alta para preparar testes |
| 5. ZAP | Apache-2.0 no projeto principal | Análise de respostas HTTP e comportamento da aplicação em execução | Baseline não comprova ausência de falhas lógicas; crawler faz requisições | Média, após preview disponível |
| 6. Semgrep Community Edition | LGPL-2.1 no motor; regras com licenças separadas | Padrões perigosos em JavaScript/Node e regras próprias | CE tem limites entre funções/arquivos; exige triagem | Alta |
| 7. Gitleaks CLI | MIT; Action separada tem outros termos | Detecção de segredos em arquivos e histórico Git | Não encontra todo token nem confirma revogação; regras podem gerar ruído | Alta |
| 8. Trivy | Apache-2.0 no projeto | Vulnerabilidades conhecidas de pacotes, inventário, segredos e configurações suportadas | Não valida lógica de checkout; cobertura depende de artefatos e base de dados | Condicional/média |

### 1. OpenAI: nomes e licenças verificados

- **`security-best-practices`**: suporta JavaScript/TypeScript, Python e Go; inclui orientação para frontend JavaScript sem framework. É a opção mais direta para examinar o DOM, entradas e código Node atual. A correspondência com funções Node próprias deve ser conferida; não presumir Express ou React. [SKILL oficial](https://github.com/openai/skills/blob/main/skills/.curated/security-best-practices/SKILL.md), [licença Apache-2.0](https://github.com/openai/skills/blob/main/skills/.curated/security-best-practices/LICENSE.txt).
- **`security-threat-model`**: identifica ativos, entradas, fronteiras de confiança e caminhos de abuso com base no repositório. Aplicação proposta: token de frete, configuração dos destinos de checkout, integridade dos valores e consumo abusivo da API. A saída é um modelo argumentado, sujeito às premissas do ambiente, e não exploração comprovada. [SKILL oficial](https://github.com/openai/skills/blob/main/skills/.curated/security-threat-model/SKILL.md), [licença Apache-2.0](https://github.com/openai/skills/blob/main/skills/.curated/security-threat-model/LICENSE.txt).
- **`security-ownership-map`**: usa histórico Git para mapear pessoas, arquivos sensíveis e concentração de responsabilidade; requer Python e NetworkX. Ajuda se vários mantenedores passarem a alterar as integrações. Com histórico curto ou autoria concentrada, o benefício imediato é pequeno; não detecta vulnerabilidades por si só. [SKILL oficial](https://github.com/openai/skills/blob/main/skills/.curated/security-ownership-map/SKILL.md), [licença Apache-2.0](https://github.com/openai/skills/blob/main/skills/.curated/security-ownership-map/LICENSE.txt).

Os arquivos foram consultados como material da pesquisa, sem instalação ou ativação desses fluxos no projeto.

### 2. Trail of Bits

A coleção oficial lista `audit-context-building`, `differential-review`, `insecure-defaults`, `sharp-edges` e `static-analysis`; este último organiza CodeQL, Semgrep e SARIF. A seleção prática é contexto de auditoria mais revisão de diferenças nos endpoints, recorrendo à análise estática quando houver uma hipótese concreta. Módulos de contratos blockchain, Rust ou C/C++ não são prioridade desta stack. A licença da coleção é **CC-BY-SA-4.0**; não assumir que a mesma licença cobre cada ferramenta externa invocada. [Catálogo oficial](https://github.com/trailofbits/skills), [LICENSE](https://github.com/trailofbits/skills/blob/main/LICENSE).

### 3. OWASP ASVS

Usar para definir critérios de aceite proporcionais: validação de entradas e saídas, proteção de segredos, comunicação com fornecedores, tratamento de erros e configuração do frontend. Selecionar requisitos aplicáveis e registrar versão/identificador em cada evidência; não declarar conformidade com um nível inteiro por verificar poucos itens. É uma base de requisitos, sem resultado automático. [Projeto ASVS](https://owasp.org/www-project-application-security-verification-standard/), [licença CC-BY-SA-4.0](https://github.com/OWASP/ASVS/blob/master/LICENSE.md).

### 4. OWASP WSTG

Serve para organizar a execução posterior dos testes web, complementando os requisitos do ASVS. Para esta aplicação, priorizar entradas, redirecionamentos, configuração HTTP e comportamento do navegador. A página consultada apresenta 4.2 como release disponível e 5.0 em desenvolvimento; o próprio projeto orienta usar links e identificadores versionados. Selecionar a edição antes de produzir o roteiro. [Projeto WSTG](https://owasp.org/www-project-web-security-testing-guide/), [licença CC-BY-SA-4.0](https://github.com/OWASP/wstg/blob/master/LICENSE).

### 5. ZAP

O Baseline usa um spider e depois análise passiva, sem a fase de ataques ativos. Ainda assim, acessa URLs e gera tráfego. A proposta é executá-lo futuramente só em preview/local próprios, com origem permitida explícita e exclusão de redirecionamentos para Cartpanda, Melhor Envio ou outros terceiros. Ele ajuda a conferir respostas/cabeçalhos, mas não valida sozinho preço, autorização de operações ou integridade do fluxo comercial. [Baseline oficial](https://www.zaproxy.org/docs/docker/baseline-scan/), [licença Apache-2.0](https://github.com/zaproxy/zaproxy/blob/main/LICENSE), [notas de componentes](https://github.com/zaproxy/zaproxy/blob/main/LEGALNOTICE.md).

### 6. Semgrep

O motor CE analisa código localmente e é **LGPL-2.1**. A documentação separa essa licença das regras: as mantidas no repositório `semgrep-rules` usam **Semgrep Rules License v1.0**, com uso interno permitido e restrições para ofertas concorrentes; regras de terceiros herdam a licença de origem. Plataforma e extensões comerciais têm termos próprios. Para COWBOY, selecionar regras JavaScript/Node e fixar a versão, preferindo execução local com saída sanitizada. CE tem limitações para análise entre funções/arquivos; um relatório vazio não encerra a revisão das integrações. [Repositório](https://github.com/semgrep/semgrep), [licenciamento oficial detalhado](https://docs.semgrep.dev/licensing).

### 7. Gitleaks

O CLI procura chaves e tokens em arquivos e repositórios e possui licença **MIT**. A GitHub Action é um produto separado com licença própria; a opção inicial proposta é o CLI. O README consultado informa que novas funcionalidades não serão incorporadas e que futuras releases se concentram em correções de segurança. Continua adequado para uma revisão delimitada, registrando versão e regras. O trabalho futuro deve tratar achados com redação de valores e examinar o build público e o histórico autorizado; não copiar credenciais para o relatório nem presumir que um token detectado foi revogado. [Repositório/estado de manutenção](https://github.com/gitleaks/gitleaks), [licença CLI](https://github.com/gitleaks/gitleaks/blob/master/LICENSE), [licença da Action](https://github.com/gitleaks/gitleaks-action/blob/master/LICENSE.txt).

### 8. Trivy

Trivy cobre inventário, vulnerabilidades conhecidas, segredos e categorias de configuração suportadas. A cobertura Node inclui npm, Yarn, pnpm e Bun. É útil quando houver lockfiles/dependências para inventariar ou artefatos de build adicionais. Não presumir que sua cobertura de infraestrutura interprete toda a semântica de `vercel.json`. Para este pacote sem dependências declaradas, a revisão do runtime e do código próprio traz mais valor imediato. Base de vulnerabilidades, data e artefatos analisados precisam constar no relatório futuro. [Repositório](https://github.com/aquasecurity/trivy), [cobertura Node](https://trivy.dev/docs/latest/coverage/language/nodejs/), [licença Apache-2.0](https://github.com/aquasecurity/trivy/blob/main/LICENSE).

## Aplicação proposta ao projeto

Esta sequência é uma recomendação de trabalho posterior, não uma lista de ações executadas nesta pesquisa.

| Ordem | Verificação proposta | Evidência esperada |
|---|---|---|
| 1 | Delimitar frontend, build público, APIs, configuração e fornecedores; montar modelo de ameaças curto | Mapa de fluxos com arquivos reais, ativos e premissas; terceiros fora do escopo de scan |
| 2 | Revisar separação entre segredos do servidor e conteúdo público; aplicar Gitleaks em escopo autorizado | Relatório sanitizado com arquivos/histórico examinados e triagem dos achados |
| 3 | Revisar JavaScript/Node com boas práticas e Semgrep | Achados ligados a linhas, entrada controlável, impacto e teste de reprodução local |
| 4 | Examinar regras de quantidade/valor, destino do redirect, validação de CEP/corpo, timeout, erros e abuso de cotação | Testes locais com fornecedor simulado; ausência de acesso a destino arbitrário; comportamento esperado para entradas rejeitadas |
| 5 | Inventariar scripts externos, políticas de navegador e cabeçalhos entregues | Requisitos de CSP/cabeçalhos definidos conforme recursos usados e evidência HTTP no próprio preview |
| 6 | Conferir dependências/runtime existentes; aplicar Trivy se houver artefatos relevantes | Inventário com versões, data da base e justificativa de aplicabilidade de cada alerta |
| 7 | Executar roteiro WSTG e ZAP no ambiente próprio delimitado | URLs examinadas, alertas triados e confirmação de que nenhum domínio externo entrou na execução |
| 8 | Corrigir achados confirmados e repetir apenas testes afetados | Correção revisada, teste de regressão e registro de limitações remanescentes |

Questões como limitação de abuso da cotação, exposição de dados em erros e compatibilidade de CSP são pontos a investigar; esta pesquisa não os classificou como vulnerabilidades confirmadas. Cabeçalhos já presentes no arquivo também precisam ser verificados na resposta real do ambiente final.

## Critério para adotar um recurso

Antes de qualquer instalação futura, selecionar só o pacote necessário, conferir scripts/comandos e licença da versão exata e fixar uma versão ou commit. A saída de scanners precisa ser revisada por impacto real; quantidade de alertas ou ausência de alertas não mede isoladamente a segurança. As ferramentas devem ficar no trabalho de desenvolvimento, sem acrescentar peso ou elementos visuais à página.

**Resultado desta tarefa:** fontes primárias oficiais consultadas e documento produzido. Nenhuma skill instalada, nenhum scanner executado, nenhuma mudança de runtime, página, configuração, API, conta ou segredo. Não foi emitido selo ou atestado de segurança.

## Adequação ao Windows desta sessão

A coordenação informou que `Get-Command` não encontrou `gitleaks`, `semgrep`, `trivy`, `zap`, `playwright` ou `lighthouse` no PATH da sessão. Isso não demonstra ausência em outros diretórios, e esta pesquisa não procurou instalações fora do escopo nem instalou ferramentas.

Há uma atualização relevante: **Semgrep CE já anuncia suporte nativo ao Windows**, lançado em 2025. A documentação atual permite uso por Python/PowerShell; portanto, não é correto apresentar WSL ou Docker como requisito universal. WSL/Docker continuam opções de execução conforme a versão e o ambiente escolhidos. A compatibilidade da versão concreta deve ser verificada antes de instalar. [Anúncio oficial de novembro de 2025](https://semgrep.dev/blog/2025/semgrep-community-edition-fall-release-2025), [instruções oficiais CE para Windows](https://semgrep.dev/products/community-edition/).

O Baseline ZAP documentado nesta seleção é o script distribuído em imagens Docker. A disponibilidade de Docker não foi verificada; não foi proposta instalação automática nem mudança do ambiente atual. [Documentação do Baseline](https://www.zaproxy.org/docs/docker/baseline-scan/).
