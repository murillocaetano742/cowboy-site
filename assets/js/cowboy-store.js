(function () {
  'use strict';

  var shippingForm = document.querySelector('[data-shipping-form]');
  var shippingStatus = document.querySelector('[data-shipping-status]');
  var shippingResults = document.querySelector('[data-shipping-results]');
  var checkoutForm = document.querySelector('[data-checkout-form]');
  var checkoutButton = document.querySelector('[data-checkout-button]');
  var checkoutStatus = document.querySelector('[data-checkout-status]');
  var supportLink = document.querySelector('[data-support-link]');
  var selectedLabel = document.querySelector('[data-selected-kit]');
  var offers = document.querySelectorAll('[name="quantity"]');
  var checkoutAvailability = null;
  var shippingAvailable = true;
  var shippingRequest = null;
  var shippingRequestId = 0;
  var checkoutParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'src', 'sck', 'cid', 'gclid', 'fbclid'];
  var attributionStorageKey = 'cowboy_attribution';
  var productTotals = { 1: 5476, 2: 8476, 4: 16952 };

  function selectedQuantity() {
    var checked = document.querySelector('[name="quantity"]:checked');
    return checked ? Number(checked.value) : 2;
  }
  function setStatus(element, message, state) {
    if (!element) return;
    element.textContent = message;
    element.dataset.state = state || '';
  }
  function brlFromCents(cents) {
    return 'R$ ' + (cents / 100).toFixed(2).replace('.', ',');
  }
  function clearShippingResult() {
    shippingRequestId += 1;
    if (shippingRequest) shippingRequest.abort();
    shippingRequest = null;
    if (shippingResults) shippingResults.innerHTML = '';
    if (shippingForm) shippingForm.querySelector('button').disabled = !shippingAvailable;
  }
  function updateCheckoutAvailability() {
    if (!checkoutAvailability || !checkoutButton) return;
    var available = Boolean(checkoutAvailability[selectedQuantity()]);
    checkoutButton.disabled = !available;
    checkoutButton.setAttribute('aria-disabled', available ? 'false' : 'true');
    if (supportLink) supportLink.hidden = available;
    setStatus(checkoutStatus, available ? '' : 'A compra direta deste kit está indisponível no momento.', available ? '' : 'error');
  }
  function updateSelection() {
    var quantity = selectedQuantity();
    if (selectedLabel) selectedLabel.textContent = quantity + (quantity === 1 ? ' frasco selecionado' : ' frascos selecionados');
    clearShippingResult();
    if (shippingAvailable) setStatus(shippingStatus, '', '');
    updateCheckoutAvailability();
  }
  function preserveAttribution() {
    if (!checkoutForm) return;
    var source = new URLSearchParams(window.location.search);
    var stored = {};
    try { stored = JSON.parse(window.sessionStorage.getItem(attributionStorageKey) || '{}'); } catch (_) { stored = {}; }
    if (!stored || typeof stored !== 'object' || Array.isArray(stored)) stored = {};
    var accepted = {};
    checkoutParams.forEach(function (name) {
      var directValue = source.get(name);
      var value = directValue === null ? stored[name] : directValue;
      if (typeof value !== 'string' || value.length < 1 || value.length > 256) return;
      var input = document.createElement('input');
      input.type = 'hidden'; input.name = name; input.value = value;
      checkoutForm.appendChild(input);
      accepted[name] = value;
    });
    try { window.sessionStorage.setItem(attributionStorageKey, JSON.stringify(accepted)); } catch (_) { /* storage can be unavailable */ }
  }

  preserveAttribution();
  offers.forEach(function (offer) { offer.addEventListener('change', updateSelection); });
  if (shippingForm) shippingForm.querySelector('[name="postalCode"]').addEventListener('input', function () {
    clearShippingResult();
    if (shippingAvailable) setStatus(shippingStatus, '', '');
  });
  if (checkoutForm) checkoutForm.addEventListener('submit', function (event) {
    if (checkoutAvailability && !checkoutAvailability[selectedQuantity()]) {
      event.preventDefault();
      updateCheckoutAvailability();
      if (supportLink) supportLink.focus();
    }
  });
  updateSelection();

  fetch('/api/config', { headers: { Accept: 'application/json' } })
    .then(function (response) { if (!response.ok) throw new Error('config'); return response.json(); })
    .then(function (config) {
      shippingAvailable = Boolean(config.shippingAvailable);
      if (!shippingAvailable && shippingForm) {
        shippingForm.querySelector('button').disabled = true;
        setStatus(shippingStatus, 'A consulta de frete está indisponível no momento. O valor de entrega será informado antes do pagamento.', 'error');
      }
      checkoutAvailability = {};
      (config.variants || []).forEach(function (variant) { checkoutAvailability[variant.quantity] = Boolean(variant.checkoutAvailable); });
      updateCheckoutAvailability();
    })
    .catch(function () {
      setStatus(checkoutStatus, 'Não foi possível confirmar a disponibilidade agora. Tente continuar para verificar o kit.', '');
    });

  if (shippingForm) shippingForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var input = shippingForm.querySelector('[name="postalCode"]');
    var submit = shippingForm.querySelector('button');
    var postalCode = input.value.trim();
    if (!/^\d{5}-?\d{3}$/.test(postalCode)) {
      setStatus(shippingStatus, 'Informe um CEP com 8 números.', 'error'); input.focus(); return;
    }
    clearShippingResult();
    var requestId = shippingRequestId;
    var controller = new AbortController();
    shippingRequest = controller;
    submit.disabled = true;
    setStatus(shippingStatus, 'Consultando opções de entrega…', '');
    var quantity = selectedQuantity();
    fetch('/api/frete', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ postalCode: postalCode, quantity: quantity }), signal: controller.signal
    }).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (body) { return { ok: response.ok, body: body }; });
    }).then(function (result) {
      if (requestId !== shippingRequestId) return;
      if (!result.ok || !result.body.available || !Array.isArray(result.body.quotes) || !result.body.quotes.length) throw new Error('unavailable');
      setStatus(shippingStatus, 'Opções para o CEP informado. O frete final é confirmado no checkout.', 'success');
      result.body.quotes.forEach(function (quote) {
        var freightCents = Math.round(Number(quote.price) * 100);
        if (!Number.isFinite(freightCents) || freightCents < 0) return;
        var item = document.createElement('li');
        var service = [quote.company, quote.service].filter(Boolean).join(' · ') || 'Entrega';
        var days = Number.isFinite(quote.deliveryDays) ? ' · prazo estimado: ' + quote.deliveryDays + (quote.deliveryDays === 1 ? ' dia útil' : ' dias úteis') : '';
        item.textContent = service + ' — frete ' + brlFromCents(freightCents) + ' · produtos + frete ' + brlFromCents(productTotals[quantity] + freightCents) + days;
        shippingResults.appendChild(item);
      });
    }).catch(function (error) {
      if (error.name === 'AbortError' || requestId !== shippingRequestId) return;
      setStatus(shippingStatus, 'Não foi possível obter o frete para este CEP agora. Tente novamente mais tarde.', 'error');
    }).finally(function () {
      if (requestId === shippingRequestId) { shippingRequest = null; submit.disabled = false; }
    });
  });
})();
