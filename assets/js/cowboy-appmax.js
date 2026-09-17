(function () {
  'use strict';

  // Presentation only, on the three AppCheckout links owned by this store.
  var location = window.location;
  var match = /^\/one-checkout\/ocmdf\/(38251476|38251410|38251519)\/?$/.exec(location.pathname);
  if (location.protocol !== 'https:' || location.hostname !== 'cowboyenergia.carrinho.app' || !match) return;

  var quantities = { '38251476': 1, '38251410': 2, '38251519': 3 };

  function initialize() {
    var body = document.body;
    if (!body || body.classList.contains('cowboy-appmax') || !document.getElementById('form-container')) return;

    if (!document.getElementById('cowboy-appmax-styles')) {
      var stylesheet = document.createElement('link');
      stylesheet.id = 'cowboy-appmax-styles';
      stylesheet.rel = 'stylesheet';
      stylesheet.href = 'https://cowboyenergiamasculina.com.br/assets/css/cowboy-appmax.css?v=20260917-1';
      document.head.appendChild(stylesheet);
    }

    var header = document.createElement('header');
    header.id = 'cowboy-appmax-header';
    var inner = document.createElement('div');
    inner.className = 'cowboy-appmax-header-inner';
    var brand = document.createElement('p');
    brand.className = 'cowboy-appmax-brand';
    brand.appendChild(document.createTextNode('COWBOY '));
    var energy = document.createElement('strong');
    energy.textContent = 'Energia';
    brand.appendChild(energy);
    var secure = document.createElement('p');
    secure.className = 'cowboy-appmax-secure';
    secure.textContent = 'Checkout seguro';
    inner.appendChild(brand);
    inner.appendChild(secure);
    header.appendChild(inner);
    body.insertBefore(header, body.firstChild);

    var support = document.createElement('aside');
    support.id = 'cowboy-appmax-support';
    support.setAttribute('aria-label', 'Suporte COWBOY');
    var supportText = document.createElement('p');
    supportText.textContent = 'Precisa de ajuda com seu pedido?';
    var supportLink = document.createElement('a');
    supportLink.href = 'https://wa.me/5511970842160';
    supportLink.target = '_blank';
    supportLink.rel = 'noopener noreferrer';
    supportLink.textContent = 'Fale com a COWBOY no WhatsApp';
    support.appendChild(supportText);
    support.appendChild(supportLink);
    var processorFooter = document.querySelector('body > .container-fluid > .footer');
    body.insertBefore(support, processorFooter ? processorFooter.parentNode : null);

    var image = document.querySelector('body > .container-fluid > .card.mt-4.mb-4 .card-body > .row > .col-md-4 > img');
    if (image) {
      var quantity = quantities[match[1]];
      var source = (image.getAttribute('src') || '').trim();
      var placeholder = !source || /^https:\/\/dhl6xem5lrcqr\.cloudfront\.net\/?$/.test(source);
      // Keep any valid merchant-uploaded image. Only the observed empty slot
      // receives an existing public product image; no new artwork is created.
      if (placeholder && !image.getAttribute('srcset')) {
        image.src = 'https://cowboyenergiamasculina.com.br/imagens/v5/kit-' + quantity + '.webp';
      }
      if (!image.getAttribute('alt')) image.alt = 'COWBOY Energia — ' + quantity + (quantity === 1 ? ' frasco' : ' frascos');
    }
    body.classList.add('cowboy-appmax');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
