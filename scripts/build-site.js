'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'dist');
// Version 1.2 is current; preserve both approved prior pages and their assets.
const PAGES = ['cowboy-nova.html', 'cowboy-v1-1.html', 'cowboy-v1-2.html', 'privacidade.html', 'termos.html', 'robots.txt', 'sitemap.xml'];
const OUTPUT_ALIASES = [
  { source: 'cowboy-v1-2.html', destination: 'index.html' },
  { source: 'cowboy-nova.html', destination: 'v1-0.html' },
  { source: 'cowboy-v1-1.html', destination: 'v1-1.html' },
  { source: 'cowboy-v1-2.html', destination: 'v1-2.html' },
];
const ASSETS = [
  // Página nova (cowboy-nova.html): estilos, scripts, fontes auto-hospedadas e imagens próprias.
  'assets/css/cowboy-nova.css',
  'assets/js/cowboy-nova.js',
  'assets/css/cowboy-floating-checkout.css',
  'assets/js/cowboy-floating-checkout.js',
  'assets/css/cowboy-floating-checkout-v1-2.css',
  'assets/js/cowboy-floating-checkout-v1-2.js',
  'assets/js/cowboy-pixel.js',
  'assets/js/cowboy-google.js',
  'assets/fonts/oswald-latin-wght-normal.woff2',
  'assets/fonts/manrope-latin-wght-normal.woff2',
  'assets/fonts/LICENSES.txt',
  'imagens/v2/cowboy-frasco-alpha.webp',
  'imagens/gotejador-macro.jpg',
  'imagens/formula-ingredientes.jpg',
  'imagens/entrega-discreta.jpg',
  'imagens/kits/kit-1.jpg',
  'imagens/kits/kit-2.jpg',
  'imagens/kits/kit-3.jpg',
  'imagens/kits/kit-4.jpg',
  'imagens/v4/hero-varanda.webp',
  'imagens/v4/mesa-de-cabeceira.webp',
  'imagens/v4/casal-cozinha.webp',
  'imagens/v4/rotina-manha.webp',
  'imagens/homem-confiante.jpg',
  'imagens/clientes/cliente-01.webp',
  'imagens/clientes/cliente-02.webp',
  'imagens/clientes/cliente-03.webp',
  'imagens/clientes/cliente-04.webp',
  'imagens/clientes/cliente-05.webp',
  'imagens/clientes/cliente-06.webp',
  'assets/css/cowboy.css',
  'assets/js/cowboy-store.js',
  'videos/clientes/depoimento-1.mp4',
  'videos/clientes/depoimento-1.jpg',
  'videos/clientes/depoimento-1.vtt',
  'videos/clientes/depoimento-2.mp4',
  'videos/clientes/depoimento-2.jpg',
  'videos/clientes/depoimento-2.vtt',
];

// Build an explicit allowlist. A new repository file is never public by default.
function buildSite() {
  if (path.dirname(OUTPUT) !== ROOT || path.basename(OUTPUT) !== 'dist') {
    throw new Error('Unsafe build output path');
  }
  for (const relative of [...PAGES, ...ASSETS, ...OUTPUT_ALIASES.map(({ source }) => source)]) {
    const source = path.join(ROOT, relative);
    if (!fs.statSync(source).isFile() || fs.lstatSync(source).isSymbolicLink()) {
      throw new Error(`Invalid public file: ${relative}`);
    }
  }
  if (fs.existsSync(OUTPUT) && fs.lstatSync(OUTPUT).isSymbolicLink()) {
    throw new Error('Build output must not be a symbolic link');
  }
  fs.rmSync(OUTPUT, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT, { recursive: true });
  for (const relative of [...PAGES, ...ASSETS]) {
    const destination = path.join(OUTPUT, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(ROOT, relative), destination);
  }
  for (const { source, destination } of OUTPUT_ALIASES) {
    fs.copyFileSync(path.join(ROOT, source), path.join(OUTPUT, destination));
  }
  console.log(`Public build: ${PAGES.length + ASSETS.length + OUTPUT_ALIASES.length} files in dist/`);
}

if (require.main === module) buildSite();
module.exports = { buildSite, ROOT, OUTPUT, PAGES, ASSETS, OUTPUT_ALIASES };
