'use strict';

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '.local', 'historico-cowboy-d4c726d');
const PORT = Number(process.env.HISTORIC_REVIEW_PORT || 4174);
const TYPES = Object.freeze({
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.mp4': 'video/mp4',
});
const REVIEW_CSP = "default-src 'self'; img-src 'self' data:; media-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'none'; connect-src 'none'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'";

function historicMarkup(source) {
  const withoutScripts = source
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<link\b[^>]*\bhref\s*=\s*["']https?:\/\/[^"']*["'][^>]*>/gi, '');
  const linksDisabled = withoutScripts.replace(/(<a\b[^>]*\bhref\s*=\s*["'])https?:\/\/[^"']*(["'][^>]*>)/gi, '$1#$2');
  const reviewStyle = '<style>#historical-review-banner{position:sticky;top:0;z-index:9999;padding:9px 16px;background:#14110d;color:#f5cf76;border-bottom:1px solid #c9943a;text-align:center;font:600 13px/1.3 system-ui,sans-serif;letter-spacing:.02em}#historical-review-banner strong{color:#fff3d5}</style>';
  const banner = '<div id="historical-review-banner" role="status"><strong>VERSÃO HISTÓRICA PARA REVISÃO VISUAL</strong> · Commit d4c726d (27/07/2026) · interações externas desativadas</div>';
  return linksDisabled
    .replace(/<head([^>]*)>/i, `<head$1>${reviewStyle}`)
    .replace(/<body([^>]*)>/i, `<body$1>${banner}`);
}

const server = http.createServer((request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Security-Policy', REVIEW_CSP);
  response.setHeader('X-Content-Type-Options', 'nosniff');
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.statusCode = 405;
    response.end('Method not allowed');
    return;
  }

  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, `http://127.0.0.1:${PORT}`).pathname); }
  catch { response.statusCode = 400; response.end('Invalid path'); return; }
  const relative = pathname === '/' ? 'loja.html' : pathname.replace(/^\/+/, '');
  if (!(relative === 'loja.html' || relative.startsWith('imagens/') || relative.startsWith('videos/'))) {
    response.statusCode = 404;
    response.end('Not found');
    return;
  }
  const absolute = path.resolve(ROOT, relative);
  if (!absolute.startsWith(`${ROOT}${path.sep}`) || !fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
    response.statusCode = 404;
    response.end('Not found');
    return;
  }
  const type = TYPES[path.extname(absolute).toLowerCase()];
  if (!type) { response.statusCode = 404; response.end('Not found'); return; }
  response.setHeader('Content-Type', type);
  if (request.method === 'HEAD') { response.end(); return; }
  if (relative === 'loja.html') { response.end(historicMarkup(fs.readFileSync(absolute, 'utf8'))); return; }
  fs.createReadStream(absolute).pipe(response);
});

server.listen(PORT, '127.0.0.1', () => console.log(`Historical review: http://127.0.0.1:${PORT}/ (isolated snapshot d4c726d)`));
