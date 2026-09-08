# REBUILD-012 — Candidato de realismo do produto 3D

Status: Suspensa por decisão do proprietário.

> O candidato PBR permanece isolado em `cowboy-3d-estudio.html` para referência técnica e foi removido da allowlist de build. A direção escolhida passou a ser o visualizador fotográfico 360 da story REBUILD-013; este candidato não será integrado à V3.

## Objetivo

Construir uma prévia 3D isolada para avaliar se geometria, materiais PBR e iluminação de estúdio no Three.js local superam visualmente o visualizador atual. A avaliação não altera `cowboy-v3.html` nem o modelo já publicado na prévia V3.

## Escopo

- Criar `cowboy-3d-estudio.html` com CSS e módulo próprios.
- Usar somente Three.js local, atlas fotográfico real 360 e foto original já autorizados no workspace.
- Reconstruir corpo, ombro, base, tampa estriada, anéis, bulbo e rótulo por referência visual; não declarar escaneamento ou fotogrametria.
- Usar materiais distintos para vidro, borracha, plástico e rótulo, com ambiente PMREM local, sombra de contato e renderização sob demanda.
- Preservar arraste, teclado, reset, fallback e alternativa de foto original.
- Incluir a prévia e seus assets somente na allowlist de build depois de existirem.

## Fora do escopo

- Alterar `cowboy-v3.html`, `assets/js/cowboy-v3-3d.js`, checkout, copy comercial ou a página principal.
- Instalar Blender, dependências npm, HDR externo ou serviços pagos.
- Redigitar, gerar ou completar a impressão do rótulo: o atlas real do vídeo é a única fonte gráfica pública do rótulo.

## Critérios de aceitação

- [ ] URL isolada renderiza modelo WebGL ou fallback de foto sem erro.
- [ ] Frente, tabela nutricional e verso usam atlas real, sem espelhamento ou repetição da marca.
- [ ] Geometria e materiais diferenciam vidro escuro, borracha fosca e tampa plástica estriada.
- [x] Ambiente PMREM, tone mapping, exposição e sombra de contato são configurados explicitamente.
- [ ] Arraste, ArrowLeft/ArrowRight/Home e reset funcionam sem auto-rotação contínua.
- [ ] Capturas comparativas de frente, nutrição e verso ficam disponíveis para revisão.
- [x] Build allowlist, MIME e checks dirigidos passam.

## Decisões físicas e limites

- O corpo fechado usa uma curva de revolução com proporção de trabalho H/D próxima de 3,12, ombro contínuo e base arredondada. Bulbo, tampa, anel e rótulo são peças distintas para reproduzir as transições vistas na foto e no vídeo.
- A tampa é uma malha única de 72 estrias finas com modulação radial; o bulbo é tubular e tem flange de base. Não há elemento decorativo independente para simular essas peças.
- Materiais separados: vidro âmbar quase preto, borracha fosca, plástico acetinado e rótulo com o atlas do vídeo 360. O ambiente é gerado localmente com PMREM de softboxes geométricas; a sombra de contato usa PCF suave e o render ocorre sob demanda.
- O atlas é fonte fotográfica do rótulo, não mapa PBR completo. Forma, rugosidade e espessura interna continuam aproximações visuais; este estudo não é escaneamento, fotogrametria ou medição industrial.

## File List

- `docs/stories/REBUILD-012-realismo-produto-3d.md`
- `cowboy-3d-estudio.html`
- `assets/css/cowboy-3d-estudio.css`
- `assets/js/cowboy-3d-estudio.js`
- `scripts/build-site.js`
- `docs/criacao/v3/realismo-3d/plano-tecnico.md`
