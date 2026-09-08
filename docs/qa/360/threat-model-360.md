# Threat model — site COWBOY Energia (página 360 + APIs)

Data: 08/09/2026. Método: skill `security-threat-model` (OpenAI), com evidência no repositório. Complementado por `security-best-practices` (referência `javascript-general-web-frontend-security.md`), Gitleaks 8.30.1 e Semgrep CE 1.176.1 (`p/javascript`, `p/nodejs`, `p/secrets`).

## Premissas (não confirmadas com o proprietário nesta rodada)

- Deploy na Vercel: páginas estáticas de `dist/` mais três funções serverless em `api/`. Exposto à internet, sem autenticação (loja pública).
- Único vendedor/único inquilino. Nenhum dado de cliente é armazenado pelo site: pagamento acontece no Cartpanda, frete é cotado no Melhor Envio.
- Segredos existem apenas em variáveis de ambiente (`.env.local` no dev, painel da Vercel em produção).

Se alguma premissa estiver errada (por exemplo, o site passar a guardar pedidos), o ranking abaixo muda.

## Sistema (evidência)

| Componente | Evidência | Papel |
| --- | --- | --- |
| Páginas estáticas (`index.html`, `cowboy-360.html`, `cowboy-v3.html`, políticas) | `scripts/build-site.js` copia somente a allowlist para `dist/` | Superfície pública; nenhum dado de usuário persistido |
| `api/config.js` | GET; expõe preços e flags de disponibilidade | Leitura pública, sem segredo |
| `api/checkout.js` | GET `?quantity=`; redireciona 302 para URL Cartpanda vinda de env; repassa só UTMs da allowlist (`safeAttribution`) | Fronteira site → Cartpanda |
| `api/frete.js` | POST JSON `{postalCode, quantity}`; chama Melhor Envio com `MELHOR_ENVIO_TOKEN` server-side; corpo limitado a 1 KB; timeout 6,5 s | Fronteira site → Melhor Envio; único ponto que usa segredo |
| Scripts do cliente (`assets/js/*.js`) | Sem `eval`, sem `innerHTML` com dado externo; resultados de frete inseridos via `textContent` | Renderização |
| Vendor (`assets/js/vendor/three.min.js` r128, MIT) | Auto-hospedado; carregado sob demanda | Dependência de terceiros no cliente |
| Fontes auto-hospedadas (`assets/fonts/`) | OFL 1.1 | Sem chamadas a Google Fonts (sem transferência de dados a terceiros) |

## Ativos

1. `MELHOR_ENVIO_TOKEN` e `CARTPANDA_API_TOKEN` (`.env.local`, apenas nomes verificados).
2. Integridade dos links de checkout (um redirecionamento adulterado desviaria pagamentos).
3. Integridade das páginas publicadas (defacement ou injeção de script).
4. Disponibilidade das funções `frete` e `checkout`.
5. Reputação/conformidade: claims publicados (não é segurança de software, mas é risco de negócio; tratado em `docs/produto/mapa-e-copy-360.md`).

## Fronteiras e entradas

- Navegador → páginas estáticas (sem entrada).
- Navegador → `/api/config` (sem parâmetros).
- Navegador → `/api/checkout?quantity=&utm_*` (query string).
- Navegador → `/api/frete` (JSON).
- `api/frete` → Melhor Envio (HTTPS, Bearer token).
- `api/checkout` → Cartpanda (302 para host `*.mycartpanda.com` ou allowlist explícita).
- Repositório → Vercel (build). Repositório público no GitHub (`murillocaetano742/cowboy-site`).

## Ameaças priorizadas

| # | Ameaça | Caminho | Controles existentes (evidência) | Prob. | Impacto | Prioridade | Recomendação |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Vazamento de token em commit | `.env.local` commitado por engano em repo público | `.gitignore` ignora `.env*`; Gitleaks no histórico: 0 achados; Gitleaks na árvore: 1 achado, exatamente `.env.local` (esperado, não versionado) | Baixa | Alto | Médio | Manter Gitleaks como gate pré-push; rotacionar tokens se algum dia aparecer no histórico |
| T2 | Abuso da cotação de frete (custo/limite da API do Melhor Envio) | POST repetido em `/api/frete` | Validação estrita de CEP e quantidade; corpo ≤ 1 KB; timeout; sem rate limit | Média | Médio | Médio | Rate limit por IP na Vercel (WAF/Firewall) ou cache curto por CEP+kit; alerta de consumo no Melhor Envio |
| T3 | Open redirect via checkout | `/api/checkout` redirecionando para host arbitrário | URL só vem de env; host precisa terminar em `.mycartpanda.com` ou constar em `CARTPANDA_CHECKOUT_ALLOWED_HOSTS`; UTMs limitadas a 256 chars e allowlist | Baixa | Alto | Baixo | Nenhuma ação; manter teste `tests/qa/checkout-local.js` |
| T4 | XSS refletido/armazenado | Resultados de frete ou UTMs renderizados | Frete via `textContent`; UTMs viram `input hidden` com `value` (sem HTML); página 360 não usa `innerHTML` com dado externo (só limpa listas) | Baixa | Alto | Baixo | Adicionar `Content-Security-Policy` em `vercel.json` (ver abaixo) como defesa em profundidade |
| T5 | Comprometimento de dependência de cliente | `three.min.js` alterado | Arquivo auto-hospedado e versionado (r128, hash no git após commit); sem CDN externo | Baixa | Médio | Baixo | Registrar SHA-256 do arquivo no relatório de QA; atualizar apenas por PR revisado |
| T6 | Exposição de arquivos internos | `docs/`, `config/`, `.env` servidos por engano | Build por allowlist explícita (`check-build.js`); smoke HTTP confere 404 para `/docs`, `/config`, `/.env` | Baixa | Médio | Baixo | Manter `check-build` no gate |
| T7 | Clickjacking / MIME sniffing | Página embutida em iframe hostil | `X-Frame-Options: SAMEORIGIN`, `nosniff`, HSTS, Referrer-Policy em `vercel.json` | Baixa | Baixo | Baixo | Complementar com `frame-ancestors` no CSP |

Não são capacidades do atacante neste modelo: acesso ao painel da Vercel, ao GitHub do proprietário ou às contas Cartpanda/Melhor Envio. Esses caminhos dependem de MFA e higiene de conta, fora do código.

## Resultado dos scanners (08/09/2026)

- **Gitleaks** `dir .`: 1 achado, regra `generic-api-key`, arquivo `.env.local` (não versionado). `git .`: 21 commits, 0 achados. Relatórios em `docs/qa/360/gitleaks*.json` (contêm trechos do segredo: **não versionar**; estão cobertos por `.gitignore`? Não. Ver ação abaixo).
- **Semgrep CE** `p/javascript` + `p/nodejs` + `p/secrets`, 105 regras, 109 arquivos (incluindo não rastreados): 0 achados.

## Ações recomendadas, em ordem

1. Não versionar `docs/qa/360/gitleaks.json` (contém o trecho do segredo). Adicionado ao `.gitignore` nesta entrega.
2. Adicionar CSP em `vercel.json`: `default-src 'self'; img-src 'self' data:; media-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self' ; frame-ancestors 'self'; base-uri 'self'; form-action 'self' https://*.mycartpanda.com`. Antes de ativar, confirmar se pixels de anúncio (Meta/GA4) voltarão à página; se sim, incluir seus hosts. Não ativado nesta entrega para não quebrar a decisão de medição pendente.
3. Rate limit em `/api/frete` (Vercel Firewall) quando o site for publicado.
4. Manter os três gates locais (lint, testes, `check:build`) mais Gitleaks e Semgrep antes de push.
