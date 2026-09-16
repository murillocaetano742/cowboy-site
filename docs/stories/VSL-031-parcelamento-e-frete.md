# VSL-031 — Parcelamento em destaque e frete por kit

Status: em execução em 16/09/2026.

## Solicitação

O proprietário pediu destacar o valor das parcelas nos cards e reiterou frete pago somente no avulso, com frete grátis nos kits de 2 e 3. A autorização permite mudar HTML/CSS dos preços nos cards; preservar demais conteúdos, imagens, scripts e oferta sempre visível.

## Critérios e progresso

- [x] Reconfirmar no checkout os valores de 12 parcelas e juros: 12× R$ 8,30 / R$ 16,08 / R$ 20,77 antes de frete.
- [x] Destacar parcelas nos três cards, com preço à vista secundário, juros claros e frete do avulso informado.
- [ ] Configurar na Cartpanda frete gratuito apenas nas variantes 211742746 e 212751381 e manter pago na 211742450.
- [ ] Conferir limites de quantidade na conta sem alterar preços ou parcelamento contratado.
- [ ] Validar os três checkouts com CEP, sem criar pedido nem pagamento.
- [x] Validar visual em 320/390/1440 px, sem overflow nem erros locais; build, lint, 47 testes e seis E2E aprovados.
- [ ] Disponibilizar PR e Preview após os seis E2E.
- [ ] Publicar por @devops a partir da main atual e conferir domínio público.

## Dependências

Sessão administrativa Cartpanda ainda na tela de login. Proprietário solicitado a entrar; API de produtos já foi usada na VSL-030 para corrigir preços. Parcelamento observado na VSL-030: 12× R$ 8,30 / R$ 16,08 / R$ 20,77 com juros, antes do frete. Não transformar esses valores em promessa de parcelamento sem juros.

## File List

- `docs/stories/VSL-031-parcelamento-e-frete.md`
- `cowboy-nova.html` (preços nos cards e apresentação do frete pago no avulso)
- `assets/css/cowboy-nova.css` (hierarquia dos preços)
- `docs/integracoes/parcelamento-frete-vsl-2026-09-16.md`

## Evidência de checkout

Em 16/09/2026, consulta no navegador confirmou os três preços à vista e 12 parcelas com juros. No kit de 2, adicionar o CEP público 01001-000 ofereceu PAC de R$ 34,78, total à vista R$ 189,58 e 12× R$ 19,70. Portanto o frete gratuito ainda não está configurado e a nova apresentação será preparada em Preview, aguardando correção do perfil antes da publicação em produção.

Pesquisa na documentação oficial confirmou que Shipping Rate v3 cadastra serviços externos por callback; não fornece contrato para perfis nativos por variante ou taxa fixa. O ajuste adequado é Admin > Frete > Criar Novo Perfil, selecionando apenas as variantes de 2 e 3. A sessão administrativa está no login, solicitado ao proprietário.

Revisão visual: parcelas com tipografia de 28–32 px, valor à vista de 13,44 px, juros e totais legíveis. O frete pago do avulso ganhou ícone neutro e perdeu o risco que sugeria benefício indisponível. Evidência privada em `.local/vsl-031/viewport-{320,390,1440}.png`; root inspecionou as três capturas. Nenhum JavaScript ou imagem foi alterado.
