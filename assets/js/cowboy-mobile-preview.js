const device = document.querySelector('[data-device]');
const buttons = [...document.querySelectorAll('[data-width]')];

function setWidth(width) {
  if (!device) return;
  device.style.width = `${width}px`;
  buttons.forEach((button) => button.setAttribute('aria-pressed', String(Number(button.dataset.width) === width)));
}

buttons.forEach((button) => button.addEventListener('click', () => setWidth(Number(button.dataset.width))));
