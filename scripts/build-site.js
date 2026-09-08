'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'dist');
const PAGES = ['index.html', 'loja.html', 'cowboy-v3.html', 'cowboy-nova.html', 'cowboy-mobile-preview.html', 'privacidade.html', 'termos.html', 'robots.txt', 'sitemap.xml'];
const ASSETS = [
  // Página nova (cowboy-nova.html): estilos, scripts, fontes auto-hospedadas e imagens próprias.
  'assets/css/cowboy-nova.css',
  'assets/js/cowboy-nova.js',
  'assets/fonts/oswald-latin-wght-normal.woff2',
  'assets/fonts/manrope-latin-wght-normal.woff2',
  'assets/fonts/LICENSES.txt',
  'imagens/v2/cowboy-frasco-alpha.webp',
  'imagens/gotejador-macro.jpg',
  'imagens/formula-ingredientes.jpg',
  'imagens/entrega-discreta.jpg',
  'imagens/kit-4-frascos.jpg',
  'imagens/kit-1-frasco.jpg',
  'imagens/kit-2-frascos.jpg',
  'assets/css/cowboy.css',
  'assets/css/cowboy-v3.css',
  'assets/js/cowboy-store.js',
  'assets/js/cowboy-v3.js',
  'assets/js/cowboy-mobile-preview.js',
  'assets/fonts/v3/rye-regular.ttf',
  'assets/fonts/v3/barlow-regular.ttf',
  'assets/fonts/v3/barlow-semibold.ttf',
  'assets/fonts/v3/barlow-bold.ttf',
  'assets/fonts/v3/barlow-condensed-semibold.ttf',
  'assets/fonts/v3/barlow-condensed-bold.ttf',
  'assets/fonts/v3/inter-latin-wght-normal.woff2',
  'assets/fonts/v3/OFL-Rye.txt',
  'assets/fonts/v3/OFL-Barlow.txt',
  'assets/fonts/v3/OFL-Inter.txt',
  'imagens/v2/cowboy-hero.webp',
  'imagens/v2/cowboy-hero.png',
  'imagens/v2/cowboy-packshot.webp',
  'imagens/v2/cowboy-packshot.png',
  'imagens/v2/cowboy-kit-2.webp',
  'imagens/v2/cowboy-kit-2.png',
  'imagens/v3/cowboy-hero-western.webp',
  'imagens/v3/cowboy-hero-western.png',
  'imagens/v3/cowboy-detalhe-couro.webp',
  'imagens/v3/cowboy-detalhe-couro.png',
  'imagens/v3/cliente-relato-1.jpg',
  'imagens/v3/cliente-relato-2.jpg',
  'imagens/mobile/cowboy-estudio-foto-real.webp',
  'imagens/v3/referencias-reais/IMG_1410.jpeg',
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
  for (const relative of [...PAGES, ...ASSETS]) {
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
  console.log(`Public build: ${PAGES.length + ASSETS.length} files in dist/`);
}

if (require.main === module) buildSite();
module.exports = { buildSite, ROOT, OUTPUT, PAGES, ASSETS };
