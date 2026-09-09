(function () {
  'use strict';

  var form = document.querySelector('[data-checkout-form]');
  var original = document.querySelector('[data-checkout-button]');
  var floating = document.querySelector('[data-floating-checkout]');
  var button = document.querySelector('[data-floating-checkout-button]');
  var sheet = document.querySelector('[data-sheet]');
  if (!form || !original || !floating || !button) return;

  var selectedByVisitor = false;
  var framePending = false;

  function update() {
    framePending = false;
    var rect = original.getBoundingClientRect();
    var originalVisible = rect.bottom > 0 && rect.top < window.innerHeight;
    var visible = selectedByVisitor && !original.disabled && !originalVisible && (!sheet || sheet.hidden);
    // Both buttons submit this same native form, including its current kit and UTMs.
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

  Array.prototype.forEach.call(form.querySelectorAll('input[name="quantity"]'), function (input) {
    function select() {
      if (input.disabled || !input.checked) return;
      selectedByVisitor = true;
      update();
    }
    input.addEventListener('change', select);
    // Clicking the already selected default kit is also an explicit choice.
    input.addEventListener('click', select);
  });
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  if ('MutationObserver' in window) {
    var observer = new MutationObserver(scheduleUpdate);
    observer.observe(original, { attributes: true, attributeFilter: ['disabled', 'aria-disabled'] });
    if (sheet) observer.observe(sheet, { attributes: true, attributeFilter: ['hidden'] });
  }
  update();
})();
