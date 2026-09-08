'use strict';

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const { OUTPUT } = require(path.join(ROOT, 'scripts', 'build-site.js'));
const PORT = Number(process.env.PORT || 4173);
const HANDLERS = Object.freeze({
  '/api/config': require('#api/config'),
  '/api/checkout': require('#api/checkout'),
  '/api/frete': require('#api/frete'),
});
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.vtt': 'text/vtt; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };

function enhanceResponse(response) {
  response.status = (code) => { response.statusCode = code; return response; };
  response.json = (data) => { response.setHeader('Content-Type', 'application/json; charset=utf-8'); response.end(JSON.stringify(data)); return response; };
  response.send = (data) => { response.end(data); return response; };
  response.redirect = (code, destination) => { response.statusCode = code; response.setHeader('Location', destination); response.end(); return response; };
  return response;
}

const server = http.createServer(async (request, rawResponse) => {
  const response = enhanceResponse(rawResponse);
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Cache-Control', 'no-store');
  const url = new URL(request.url, `http://127.0.0.1:${PORT}`);
  const handler = HANDLERS[url.pathname];
  if (handler) {
    const chunks = [];
    let length = 0;
    for await (const chunk of request) {
      length += chunk.length;
      if (length > 4096) return response.status(413).json({ error: 'payload_too_large' });
      chunks.push(chunk);
    }
    request.query = {};
    for (const key of new Set(url.searchParams.keys())) {
      const values = url.searchParams.getAll(key);
      request.query[key] = values.length === 1 ? values[0] : values;
    }
    const body = Buffer.concat(chunks).toString('utf8');
    if (body && String(request.headers['content-type'] || '').split(';')[0].trim() === 'application/json') {
      try { request.body = JSON.parse(body); }
      catch { return response.status(400).json({ error: 'invalid_json' }); }
    } else {
      request.body = body || undefined;
    }
    try { await handler(request, response); }
    catch { if (!response.headersSent) response.status(500).json({ error: 'internal_error' }); else response.end(); }
    return;
  }
  if (!['GET', 'HEAD'].includes(request.method)) return response.status(405).send('Method not allowed');
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { return response.status(400).send('Invalid path'); }
  const filename = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  let absolute = path.resolve(OUTPUT, filename);
  if (!absolute.startsWith(`${OUTPUT}${path.sep}`)) return response.status(404).send('Not found');
  if (!path.extname(absolute)) absolute += '.html';
  if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) return response.status(404).send('Not found');
  response.setHeader('Content-Type', TYPES[path.extname(absolute)] || 'application/octet-stream');
  if (request.method === 'HEAD') return response.end();
  fs.createReadStream(absolute).pipe(response);
});

server.listen(PORT, '127.0.0.1', () => console.log(`Local review: http://127.0.0.1:${PORT} (dist/ + API handlers; external integrations require real configuration)`));
