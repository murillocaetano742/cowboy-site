# Proveniência tipográfica — referência original da V3

Data: 08/09/2026.

## Decisão

A referência original usa Oswald para títulos e Inter para leitura/interface. Barlow não deve ser apresentado como substituto exato de Inter.

- **Oswald para web:** `assets/fonts/oswald-latin-wght-normal.woff2`, já existente, 28.488 bytes, SHA-256 `BD73278EE0C50041B91B4C03D1229E35B501637F46B6409E7DA2D3A758446EA5`.
- **Inter para web:** `assets/fonts/v3/inter-latin-wght-normal.woff2`, 48.256 bytes, SHA-256 `3100E775E8616CD2611BEECFA23A4263D7037586789B43F035236A2E6FBD4C62`.
- **Inter oficial integral de referência:** `assets/fonts/v3/inter-variable.ttf`, 876.576 bytes, SHA-256 `29160A80FF49DDCAB2C97711247E08B1FAB27A484A329CE8B813D820DC559031`.
- **Oswald oficial integral de referência:** `assets/fonts/v3/oswald-variable.ttf`, 172.088 bytes, SHA-256 `5B38C246E255A12F5712D640D56BCCED0472466FC68983D2D0410EC0457C2817`.

As cópias integrais TTF não precisam ser publicadas quando os WOFF2 latinos cobrirem os caracteres da página. O bloco `@font-face` local de Inter está pronto em `assets/fonts/v3/inter-latin-font-face.css`.

## Origem e licença

Os novos binários e licenças vieram do repositório oficial [google/fonts](https://github.com/google/fonts), commit `baa2e5561af8a4873b058859dcfe158bdd033942`, consultado e baixado em 08/09/2026:

- [Oswald variável](https://github.com/google/fonts/blob/baa2e5561af8a4873b058859dcfe158bdd033942/ofl/oswald/Oswald%5Bwght%5D.ttf)
- [Inter variável](https://github.com/google/fonts/blob/baa2e5561af8a4873b058859dcfe158bdd033942/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf)
- [OFL da Oswald](https://github.com/google/fonts/blob/baa2e5561af8a4873b058859dcfe158bdd033942/ofl/oswald/OFL.txt)
- [OFL da Inter](https://github.com/google/fonts/blob/baa2e5561af8a4873b058859dcfe158bdd033942/ofl/inter/OFL.txt)

Ambas usam SIL Open Font License 1.1. Os arquivos integrais estão em `assets/fonts/v3/OFL-Oswald.txt` e `assets/fonts/v3/OFL-Inter.txt`. A licença do Oswald WOFF2 já estava resumida em `assets/fonts/LICENSES.txt`.

Para reduzir o custo móvel sem instalar um subsetter, foi consultado uma única vez o endpoint oficial `https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap` com user agent Chrome. O CSS retornou o subset `latin` da Inter web `v20` em `https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2` e seu `unicode-range`. O WOFF2 e o intervalo foram copiados sem alteração para self-hosting; não existe dependência de CDN em runtime.

## Verificações

- busca no projeto antes da inclusão: Oswald WOFF2 encontrado; Inter ausente;
- busca por nome em `C:\Windows\Fonts`, fontes locais do usuário e runtimes Codex conhecidos: Inter e Oswald não encontrados como fontes instaladas;
- commit remoto obtido com `git ls-remote` antes do download;
- download direto dos quatro arquivos, sem clonar ou executar código do repositório;
- assinaturas binárias compatíveis: TTF `00010000`; WOFF2 `774F4632`;
- hashes e tamanhos registrados acima e em `assets/fonts/v3/README.md`.

## Integração esperada

Esta frente não alterou HTML, CSS ou allowlist do build. A implementação deve declarar `@font-face` local com `font-display: swap`, usar Oswald no eixo/peso observado na referência e Inter no corpo/interface. Após inclusão na allowlist, o QA deve confirmar HTTP 200, MIME de fonte, nome computado, ausência de download externo e ausência de mudança involuntária por fallback.
