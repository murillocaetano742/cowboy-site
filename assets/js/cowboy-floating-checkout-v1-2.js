(function () {
  'use strict';

  var form = document.querySelector('[data-checkout-form]');
  var kits = form && form.querySelector('.kits');
  var original = document.querySelector('[data-checkout-button]');
  var floating = document.querySelector('[data-floating-checkout]');
  var button = document.querySelector('[data-floating-checkout-button]');
  var sheet = document.querySelector('[data-sheet]');
  var header = document.querySelector('.header');
  if (!kits || !original || !floating || !button) return;

  var framePending = false;

  function update() {
    framePending = false;
    var rect = kits.getBoundingClientRect();
    var viewportTop = header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
    var kitsVisible = rect.bottom > viewportTop && rect.top < window.innerHeight;
    var visible = kitsVisible && !original.disabled && (!sheet || sheet.hidden);
    // The native form retains the selected kit, availability and attribution.
    button.disabled = original.disabled;
    if (original.hasAttribute('aria-disabled')) button.setAttribute('aria-disabled', original.getAttribute('aria-disabled'));
    else button.removeAttribute('aria-disabled');
    if (floating.hidden === visible) floating.hidden = !visible;
    if (visible) document.body.setAttribute('data-floating-checkout-visible', '');
    else document.body.removeAttribute('data-floating-checkout-visible');
  }

  function scheduleUpdate() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(update);
  }

  form.addEventListener('change', scheduleUpdate);
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('pageshow', scheduleUpdate);
  window.addEventListener('load', scheduleUpdate);
  if ('MutationObserver' in window) {
    var observer = new MutationObserver(scheduleUpdate);
    observer.observe(original, { attributes: true, attributeFilter: ['disabled', 'aria-disabled'] });
    if (sheet) observer.observe(sheet, { attributes: true, attributeFilter: ['hidden'] });
  }
  if ('ResizeObserver' in window) new ResizeObserver(scheduleUpdate).observe(kits);
  update();
})();
