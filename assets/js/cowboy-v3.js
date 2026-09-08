const PRICES = Object.freeze({ 1: 5476, 2: 8476, 4: 16952 });
const ATTRIBUTION_KEYS = Object.freeze(['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'src', 'sck', 'cid', 'gclid', 'fbclid']);

function formatBRL(cents) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

function initializeGallery() {
  const mainImage = document.querySelector('[data-v3-gallery-main]');
  const buttons = [...document.querySelectorAll('[data-v3-gallery]')];
  if (!mainImage || !buttons.length) return;

  buttons.forEach((button) => button.addEventListener('click', () => {
    const source = button.dataset.v3GallerySource;
    const alt = button.dataset.v3GalleryAlt;
    if (!source || !alt || source === mainImage.getAttribute('src')) return;
    const candidate = new Image();
    candidate.onload = () => {
      mainImage.src = source;
      mainImage.alt = alt;
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    };
    candidate.src = source;
  }));
}

function initializeCheckout() {
  const form = document.querySelector('[data-v3-checkout-form]');
  if (!form) return;
  const radios = [...form.querySelectorAll('input[name="quantity"]')];
  const selectedKit = form.querySelector('[data-v3-selected-kit]');
  const orderSummary = form.querySelector('[data-v3-order-summary]');
  const checkoutButton = form.querySelector('[data-v3-checkout-button]');
  const checkoutStatus = form.querySelector('[data-v3-checkout-status]');
  const supportLink = form.querySelector('[data-v3-support-link]');
  const postalCode = form.querySelector('[data-v3-postal-code]');
  const freightButton = form.querySelector('[data-v3-shipping-button]');
  const freightStatus = form.querySelector('[data-v3-shipping-status]');
  const freightResults = form.querySelector('[data-v3-shipping-results]');
  let configuredVariants = null;
  let shippingAvailable = true;
  let shippingRequest = null;
  let shippingRequestId = 0;
  let selectedFreightCents = null;

  function quantity() { return Number(radios.find((radio) => radio.checked)?.value || 2); }
  function renderOrderSummary(freightCents = null) {
    if (!orderSummary) return;
    const selected = quantity();
    const base = `Produtos: ${formatBRL(PRICES[selected])} · ${formatBRL(Math.round(PRICES[selected] / selected))} por frasco`;
    orderSummary.textContent = freightCents === null
      ? `${base} · Frete: consulte o CEP`
      : `${base} · Frete estimado: a partir de ${formatBRL(freightCents)} · Total estimado: ${formatBRL(PRICES[selected] + freightCents)}`;
  }
  function invalidateShipping(status = '') {
    shippingRequestId += 1;
    shippingRequest?.abort();
    shippingRequest = null;
    selectedFreightCents = null;
    if (freightButton) freightButton.disabled = !shippingAvailable;
    freightResults?.replaceChildren();
    if (freightStatus) freightStatus.textContent = status;
    renderOrderSummary();
  }
  function updateSelected() {
    const selected = quantity();
    radios.forEach((radio) => radio.closest('label')?.classList.toggle('is-selected', radio.checked));
    if (selectedKit) selectedKit.textContent = `${selected} ${selected === 1 ? 'frasco selecionado' : 'frascos selecionados'} · ${formatBRL(PRICES[selected])}`;
    invalidateShipping();
  }
  function attachAttribution() {
    const params = new URLSearchParams(window.location.search);
    ATTRIBUTION_KEYS.forEach((key) => {
      const value = params.get(key);
      if (!value || value.length > 256) return;
      const field = document.createElement('input');
      field.type = 'hidden';
      field.name = key;
      field.value = value;
      form.append(field);
    });
  }
  function selectedVariantAvailable() {
    if (!configuredVariants) return true;
    const variant = configuredVariants.find((item) => Number(item.quantity) === quantity());
    return Boolean(variant?.checkoutAvailable);
  }
  function showCheckoutUnavailable() {
    if (checkoutStatus) checkoutStatus.textContent = 'Este kit está indisponível no momento. Escolha outra opção ou fale com o atendimento.';
    if (supportLink) supportLink.hidden = false;
  }
  async function loadConfiguration() {
    try {
      const response = await fetch('/api/config', { headers: { Accept: 'application/json' } });
      if (!response.ok) return;
      const data = await response.json();
      configuredVariants = Array.isArray(data.variants) ? data.variants : null;
      shippingAvailable = Boolean(data.shippingAvailable);
      radios.forEach((radio) => {
        const variant = configuredVariants?.find((item) => Number(item.quantity) === Number(radio.value));
        radio.disabled = Boolean(variant && !variant.checkoutAvailable);
        radio.closest('label')?.classList.toggle('is-unavailable', radio.disabled);
      });
      if (!selectedVariantAvailable()) {
        const replacement = radios.find((radio) => !radio.disabled);
        if (replacement) replacement.checked = true;
      }
      updateSelected();
      if (!shippingAvailable) {
        freightButton.disabled = true;
        if (freightStatus) freightStatus.textContent = 'A consulta de frete está indisponível no momento. O valor de entrega será informado antes do pagamento.';
      }
    } catch { /* The regular GET form remains usable when configuration is unavailable. */ }
  }
  function renderFreight(data, requestedQuantity) {
    freightResults.replaceChildren();
    if (!data?.available || !Array.isArray(data.quotes) || !data.quotes.length) {
      freightStatus.textContent = 'Não foi possível encontrar opções de frete para este CEP.';
      return;
    }
    freightStatus.textContent = 'Opções estimadas para este CEP. O frete final é confirmado no checkout.';
    data.quotes.forEach((quote) => {
      const line = document.createElement('li');
      const name = document.createElement('span');
      const price = document.createElement('strong');
      const freightCents = Math.round(Number(quote.price || 0) * 100);
      name.textContent = `${quote.company} · ${quote.service}${quote.deliveryDays ? ` · ${quote.deliveryDays} dias úteis` : ''}`;
      if (!Number.isFinite(freightCents) || freightCents < 0) return;
      const service = [quote.company, quote.service].filter(Boolean).join(' · ') || 'Entrega';
      name.textContent = `${service}${Number.isFinite(Number(quote.deliveryDays)) ? ` · prazo estimado: ${quote.deliveryDays} ${Number(quote.deliveryDays) === 1 ? 'dia útil' : 'dias úteis'}` : ''}`;
      price.textContent = `${formatBRL(PRICES[requestedQuantity])} + ${formatBRL(freightCents)} = ${formatBRL(PRICES[requestedQuantity] + freightCents)}`;
      line.append(name, price);
      freightResults.append(line);
      if (selectedFreightCents === null) selectedFreightCents = freightCents;
    });
    if (orderSummary && selectedFreightCents !== null) {
      renderOrderSummary(selectedFreightCents);
    }
  }
  async function lookupFreight() {
    if (!shippingAvailable) return;
    const code = String(postalCode?.value || '').replace(/\D/g, '');
    if (code.length !== 8) { freightStatus.textContent = 'Informe um CEP com 8 números para consultar o frete.'; return; }
    invalidateShipping();
    const requestId = shippingRequestId;
    const requestedQuantity = quantity();
    const requestedCode = code;
    const controller = new AbortController();
    shippingRequest = controller;
    freightButton.disabled = true;
    freightStatus.textContent = 'Consultando frete…';
    try {
      const response = await fetch('/api/frete', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, signal: controller.signal,
        body: JSON.stringify({ postalCode: requestedCode, quantity: requestedQuantity }),
      });
      if (!response.ok) throw new Error('shipping_unavailable');
      const data = await response.json();
      if (requestId !== shippingRequestId || requestedQuantity !== quantity() || requestedCode !== String(postalCode?.value || '').replace(/\D/g, '')) return;
      renderFreight(data, requestedQuantity);
    } catch (error) {
      if (error.name !== 'AbortError' && requestId === shippingRequestId) freightStatus.textContent = 'Não foi possível consultar o frete agora. Tente novamente.';
    } finally {
      if (requestId === shippingRequestId) { shippingRequest = null; freightButton.disabled = false; }
    }
  }
  radios.forEach((radio) => radio.addEventListener('change', updateSelected));
  postalCode?.addEventListener('input', () => {
    postalCode.value = postalCode.value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');
    if (shippingAvailable) invalidateShipping();
  });
  freightButton?.addEventListener('click', lookupFreight);
  form.addEventListener('submit', (event) => {
    if (selectedVariantAvailable()) return;
    event.preventDefault();
    showCheckoutUnavailable();
  });
  attachAttribution();
  updateSelected();
  loadConfiguration();
}

initializeGallery();
initializeCheckout();
