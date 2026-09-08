# Fontes self-hosted da página V3

Origem oficial: `google/fonts`, commit `5e35378e6bda803962ee6fd257e444a7d459660d` (04/09/2026). Os arquivos foram baixados diretamente de `raw.githubusercontent.com/google/fonts/<commit>/ofl/...`, sem CDN e sem executar scripts.

| Arquivo local | Arquivo de origem | Peso/uso | SHA-256 |
|---|---|---|---|
| `rye-regular.ttf` | `ofl/rye/Rye-Regular.ttf` | Rye 400; marca/H1 | `B7EDEE5E615AE1B6B07E9D030C1309152BF3672A0E8A2A46293E273730F5ADBA` |
| `barlow-regular.ttf` | `ofl/barlow/Barlow-Regular.ttf` | Barlow 400; corpo | `95AA02C7C43096E0DD44D787BA6216864A67157E402ADAB59B35572E0C1577EA` |
| `barlow-semibold.ttf` | `ofl/barlow/Barlow-SemiBold.ttf` | Barlow 600 | `86577CB32F8ABE3673DB53CA0F4221E6856751A4F6730C867E00F720F8BB1FC5` |
| `barlow-bold.ttf` | `ofl/barlow/Barlow-Bold.ttf` | Barlow 700 | `84E6A4D61E7C3E21F3C50EA6A4F7E5303A3467864C038BE6EA3759BAB8D547F9` |
| `barlow-condensed-semibold.ttf` | `ofl/barlowcondensed/BarlowCondensed-SemiBold.ttf` | Barlow Condensed 600; headings | `7B619D14BC2327509A9EF32B0890F709626F7ECC9FF61191C2A4314C5499D2D9` |
| `barlow-condensed-bold.ttf` | `ofl/barlowcondensed/BarlowCondensed-Bold.ttf` | Barlow Condensed 700; headings | `E476562EC9C1E16CF16475895B511F08C804F438CC9A9F80A44EA50A0EEB5B65` |

Licenças:

- `OFL-Rye.txt`: SIL Open Font License 1.1 para Rye, com Reserved Font Name `Rye`.
- `OFL-Barlow.txt`: SIL Open Font License 1.1 para Barlow e Barlow Condensed.

O repositório oficial contém arquivos estáticos dessas famílias. Essa foi a seleção usada na iteração anterior da V3.

## Fontes exatas da referência original

Em 08/09/2026, a referência visual escolhida passou a exigir **Oswald + Inter**, sem substituir Inter por Barlow. A origem foi o repositório oficial [`google/fonts`](https://github.com/google/fonts), fixado no commit `baa2e5561af8a4873b058859dcfe158bdd033942`.

| Arquivo local | Arquivo de origem no commit fixo | Eixos/uso | SHA-256 |
|---|---|---|---|
| `oswald-variable.ttf` | `ofl/oswald/Oswald[wght].ttf` | Oswald variável `wght`; cópia oficial integral de referência | `5B38C246E255A12F5712D640D56BCCED0472466FC68983D2D0410EC0457C2817` |
| `inter-variable.ttf` | `ofl/inter/Inter[opsz,wght].ttf` | Inter normal; `opsz` 14–32, `wght` 100–900 | `29160A80FF49DDCAB2C97711247E08B1FAB27A484A329CE8B813D820DC559031` |
| `inter-latin-wght-normal.woff2` | CSS oficial Google Fonts para `Inter:wght@100..900`, subset `latin`, versão web `v20` | Inter normal `wght` 100–900; arquivo preferido para a página | `3100E775E8616CD2611BEECFA23A4263D7037586789B43F035236A2E6FBD4C62` |
| `OFL-Oswald.txt` | `ofl/oswald/OFL.txt` | SIL Open Font License 1.1 | `0FD731A904B729A4E02EAF5E8EBD06783EDD9ABE400E8882760160230675B652` |
| `OFL-Inter.txt` | `ofl/inter/OFL.txt` | SIL Open Font License 1.1 | `5B9321A4298CFEB6B34354164A1C3AFC3DB114569984C502B9B35D988FD58C57` |

O projeto já continha `../oswald-latin-wght-normal.woff2`, com 28.488 bytes e SHA-256 `BD73278EE0C50041B91B4C03D1229E35B501637F46B6409E7DA2D3A758446EA5`. Sua licença Oswald/OFL já consta em `../LICENSES.txt`. Para a página, esse WOFF2 latino é preferível ao TTF integral por ser muito menor; o TTF permanece como cópia oficial verificável. O Inter não foi encontrado no projeto, nas fontes instaladas do Windows nem nos diretórios de runtime consultados antes desta inclusão.

Como FontTools/Brotli não estavam presentes no runtime, não foi criado um subset próprio. Em vez disso, consultou-se uma única vez o CSS oficial `https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap` com user agent Chrome e baixou-se diretamente o WOFF2 `latin` indicado por ele. Esse arquivo tem 48.256 bytes, inclui Latin/Latin-1 e pontuação usada em português e mantém a fonte original entregue pelo Google Fonts. O bloco local pronto para integração está em `inter-latin-font-face.css`.

Os arquivos foram baixados diretamente de `raw.githubusercontent.com/google/fonts/<commit>/ofl/...`; nenhum script ou hook do repositório foi executado. Os binários TTF começam com a assinatura `00010000`, e o Oswald WOFF2 existente começa com `wOF2` (`774F4632`).
