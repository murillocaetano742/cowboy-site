# Pesquisa de skills e recursos de design — COWBOY

Data: 08/09/2026  
Escopo: pesquisa para decidir a próxima identidade visual. Nenhuma skill, dependência, conta, publicação ou arquivo de página foi instalado ou alterado.

## Conclusão para a decisão

O projeto atual é HTML, CSS e JavaScript estático com APIs Node. A melhor sequência é definir a direção visual e revisar um rascunho antes de adicionar qualquer biblioteca. Não há ganho automático em migrar para React. Toda skill adotada deve respeitar a referência anterior e as decisões do proprietário, sem substituir a direção já escolhida por padrões genéricos.

A combinação mais útil é: direção de arte local (`design-prompts-ia` e `imagegen`) → uma única skill de criação ou crítica (`Impeccable` **ou** `frontend-design`) → revisão por `web-design-guidelines`. `Motion` e `Lucide` entram apenas se a identidade escolhida pedir movimento ou ícones consistentes.

## Shortlist — 8 recursos

| Recurso | Tipo e URL | O que resolve | Compatibilidade com COWBOY | Licença verificada | Limite relevante |
| --- | --- | --- | --- | --- | --- |
| `design-prompts-ia` + `imagegen` instalados | Skills locais; [image generation da OpenAI](https://platform.openai.com/docs/guides/image-generation) | Define briefing, paleta, composição e produz referências/variações de imagem para decidir a linguagem visual. | Direto: gera referências, não exige framework. | Não é pacote OSS a copiar; as skills locais não declaram uma licença de redistribuição própria. O uso deve seguir os termos da ferramenta. | Imagem e prompt não substituem estrutura, acessibilidade ou implementação HTML/CSS. Texto dentro de imagem precisa de revisão. |
| [Impeccable](https://github.com/pbakaus/impeccable) | Skill/repositório para agentes | Oferece `critique`, `polish`, `bolder`, `quieter`, `typeset`, `layout` e revisão de UI; é o candidato mais ligado à queixa de design genérico. | Compatível com HTML/CSS/JS local; não exige React. | Apache-2.0, declarado no repositório. | A instalação pode adicionar skills, hooks e arquivos de contexto no projeto. Instalação fora do escopo desta pesquisa; revisar hooks e arquivos que o instalador altera antes de adotar. |
| [Anthropic `frontend-design`](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Skill/repositório | Guia uma direção estética marcante, tipografia, cor, composição e motion para interfaces de produção. | A própria skill cita HTML/CSS/JS entre os destinos possíveis; pode orientar uma landing estática. | Apache-2.0 no [arquivo da skill](https://github.com/anthropics/skills/blob/main/skills/frontend-design/LICENSE.txt). | É orientação de criação, não auditoria. Usar como alternativa ao Impeccable, não como uma segunda voz obrigatória sobre o mesmo redesign. |
| [Vercel `web-design-guidelines`](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines) | Skill/repositório | Audita UI por regras de acessibilidade, foco, formulários, animação, imagens, performance e UX. | Compatível com HTML/CSS/JS; entra depois de existir uma direção e um rascunho. | MIT no [repositório oficial](https://github.com/vercel-labs/agent-skills). As regras-base também são MIT no [repositório de diretrizes](https://github.com/vercel-labs/web-interface-guidelines/blob/main/LICENSE). | É auditoria, não direção de arte. Pode melhorar qualidade técnica sem decidir a identidade da marca. |
| [UI/UX Pro Max Skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Skill/repositório | Apoia escolha de paleta, tipografia e padrões de landing page. | Útil como apoio de decisão em HTML/CSS; não exige React por si só. | MIT no [LICENSE oficial](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/LICENSE). | Pode induzir padrões de landing repetidos; usar como referência complementar, sem deixar que substitua a referência visual do proprietário. |
| [Motion](https://github.com/motiondivision/motion) | Biblioteca JavaScript | Animações de entrada, hover e transições usando JavaScript e APIs nativas do navegador. | A documentação e o repositório suportam JavaScript, além de React e Vue; cabível sem migração. | MIT no [LICENSE do pacote](https://github.com/motiondivision/motion/blob/main/packages/motion/LICENSE.md). | Adiciona dependência e peso. Usar somente para 1–2 momentos de destaque e respeitar `prefers-reduced-motion`; não é uma solução de identidade visual. |
| [Lucide](https://lucide.dev/guide/lucide) | Biblioteca de ícones | Ícones consistentes para frete, atendimento, composição e controles, sem desenhar símbolos improvisados. | Possui pacote para JavaScript vanilla; pode ser usado em página estática após uma decisão de integração. | ISC para a biblioteca e MIT para os ícones Feather indicados no [LICENSE oficial](https://github.com/lucide-icons/lucide/blob/main/LICENSE). | Não inclui logotipos de marcas e exige atenção à atribuição/licenças se os arquivos ou biblioteca forem redistribuídos. |
| [Lighthouse](https://github.com/GoogleChrome/lighthouse) | Ferramenta de QA | Mede desempenho, acessibilidade, boas práticas e SEO depois que houver uma página candidata. | Funciona com a página estática e não exige migração. | Apache-2.0 no [LICENSE oficial](https://github.com/GoogleChrome/lighthouse/blob/main/LICENSE). | É verificação técnica; não mede conversão nem prova que a estética escolhida vende mais. |

## Skills já disponíveis no ambiente

| Recurso local | Papel na próxima etapa | Decisão de uso agora |
| --- | --- | --- |
| `imagegen` | Produção ou edição de imagens de referência. | Adequado quando houver um briefing visual aprovado. |
| `design-prompts-ia` | Direção de arte e prompts editoriais para imagens. | Adequado para comparar 2–3 linguagens visuais sem tocar na página. |
| `canvas-design` | Produz artes em PNG/PDF; é mais apropriado para moodboards e peças isoladas do que para a landing viva. | Não é a primeira escolha para implementar a página. |
| Figma (`figma-generate-design`, `figma-design-to-code`) | Pode criar uma composição editável ou traduzir um arquivo Figma aprovado para o stack atual. | Útil se a decisão pedir uma aprovação visual antes de codificar; requer acesso e contexto Figma. |
| `sites-building` / `sites-hosting` | Constrói e hospeda sites; é voltado ao ciclo completo de site. | Não priorizado: já existe fluxo Vercel e a direção visual está em revisão. |
| Vercel (`verification`, `agent-browser-verify`) | Verifica fluxos e a experiência já implementada. | Usar depois de uma versão candidata, não para decidir a direção visual. |

## O que ficou fora da shortlist

- `shadcn/ui`: é excelente em projetos React, mas acrescentaria um ecossistema que não é necessário para a landing HTML/CSS/JS atual.
- `motionone/motion`: foi priorizado o repositório oficial atual [Motion](https://github.com/motiondivision/motion), que documenta suporte a JavaScript, React e Vue.
- Nenhuma instalação foi testada. Em especial, Impeccable descreve hooks e arquivos de projeto; hooks podem exigir confirmação técnica do host conforme documentação; não foram instalados nesta pesquisa.

## Fontes primárias consultadas

- [Anthropic — `frontend-design`](https://github.com/anthropics/skills/tree/main/skills/frontend-design) e [licença](https://github.com/anthropics/skills/blob/main/skills/frontend-design/LICENSE.txt).
- [Vercel Agent Skills](https://github.com/vercel-labs/agent-skills) e [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines).
- [Impeccable](https://github.com/pbakaus/impeccable).
- [UI/UX Pro Max Skill — licença](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/main/LICENSE).
- [Motion — repositório](https://github.com/motiondivision/motion), [licença](https://github.com/motiondivision/motion/blob/main/packages/motion/LICENSE.md) e [documentação JavaScript](https://motion.dev/docs/quick-start).
- [Lucide para JavaScript](https://lucide.dev/guide/lucide) e [licença](https://github.com/lucide-icons/lucide/blob/main/LICENSE).
- [Lighthouse — licença](https://github.com/GoogleChrome/lighthouse/blob/main/LICENSE).
