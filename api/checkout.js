'use strict';

const { checkoutUrlFor, parseQuantity, safeAttribution } = require('#commerce');

function setNoStore(response) {
  response.setHeader('Cache-Control', 'no-store, max-age=0');
}

function json(response, statusCode, payload) {
  setNoStore(response);
  return response.status(statusCode).json(payload);
}

function acceptsHtml(request) {
  const accept = request.headers && request.headers.accept;
  return typeof accept === 'string' && accept.toLowerCase().includes('text/html');
}

function checkoutErrorPage(statusCode, title, message) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | COWBOY Energia</title><meta name="robots" content="noindex"><style>body{margin:0;background:#f7f2e9;color:#20150d;font:16px/1.5 Arial,sans-serif}.card{max-width:560px;margin:10vh auto;padding:32px;background:#fff;border-radius:12px;box-shadow:0 8px 28px #0002}a{color:#5d351b;font-weight:700}</style></head><body><main class="card"><p>COWBOY Energia</p><h1>${title}</h1><p>${message}</p><p><a href="/#ofertas">Voltar aos kits</a></p><p>Precisa de ajuda? <a href="mailto:contato@cowboyenergiamasculina.com.br">Falar com o SAC</a>.</p></main></body></html>`;
}

function checkoutError(request, response, statusCode, error) {
  if (!acceptsHtml(request)) return json(response, statusCode, { error });
  setNoStore(response);
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  const content = error === 'invalid_quantity'
    ? checkoutErrorPage(statusCode, 'Escolha um kit disponível', 'Selecione uma das opções de kit para continuar.')
    : checkoutErrorPage(statusCode, 'Pagamento indisponível agora', 'Tente novamente em alguns instantes ou fale com nosso atendimento.');
  return response.status(statusCode).send(content);
}

module.exports = (request, response) => {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return checkoutError(request, response, 405, 'method_not_allowed');
  }

  const quantity = parseQuantity(request.query.quantity);
  if (!quantity) return checkoutError(request, response, 400, 'invalid_quantity');

  const checkoutUrl = checkoutUrlFor(quantity);
  if (!checkoutUrl) {
    return checkoutError(request, response, 503, 'checkout_unavailable');
  }

  const attribution = safeAttribution(new URLSearchParams(request.url.split('?')[1] || ''));
  for (const [name, value] of attribution) checkoutUrl.searchParams.set(name, value);

  setNoStore(response);
  return response.redirect(302, checkoutUrl.toString());
};

module.exports.acceptsHtml = acceptsHtml;
