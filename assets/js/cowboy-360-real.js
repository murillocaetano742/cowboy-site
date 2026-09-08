const MAX_PRELOADS = 3;
const MAX_DECODED_FRAMES = 10;

function normalizeManifest(value) {
  if (!value || typeof value !== 'object' || !Array.isArray(value.frames) || value.frames.length < 2) return null;
  const frames = value.frames.map((frame, index) => ({
    index: Number(frame?.index),
    src: typeof frame?.src === 'string' ? frame.src : '',
    angleDegreesApprox: Number(frame?.angleDegreesApprox),
    timeSeconds: Number(frame?.timeSeconds),
    expectedIndex: index,
  }));
  if (frames.some((frame) => !frame.src || frame.index !== frame.expectedIndex || !Number.isFinite(frame.angleDegreesApprox) || !Number.isFinite(frame.timeSeconds))) return null;
  const homeIndex = Number.isInteger(value.homeIndex) && value.homeIndex >= 0 && value.homeIndex < frames.length ? value.homeIndex : 0;
  if (typeof value.poster !== 'string' || value.poster !== frames[homeIndex].src) return null;
  const width = Number(value.width);
  const height = Number(value.height);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) return null;
  return { width, height, homeIndex, frames };
}

function start() {
  const root = document.querySelector('[data-photo-360]');
  const image = root?.querySelector('[data-photo-frame]');
  const status = root?.querySelector('[data-photo-status]');
  if (!root || !image) return;
  const fallback = root.dataset.photoFallback || '/imagens/v3/referencias-reais/IMG_1410.jpeg';
  const setStatus = (message) => { if (status) status.textContent = message; };
  const showFallback = (message) => {
    root.dataset.photo360State = 'fallback';
    if (image.getAttribute('src') !== fallback) image.src = fallback;
    image.alt = 'Foto original do frasco COWBOY Energia';
    setStatus(message);
  };
  image.addEventListener('error', () => showFallback('Não foi possível carregar uma foto da sequência. A foto original permanece disponível.'));
  const manifestPath = root.dataset.manifest;
  if (!manifestPath) { showFallback('A sequência de fotos não está disponível. A foto original permanece visível.'); return; }
  const initialize = () => fetch(manifestPath, { credentials: 'same-origin' })
    .then((response) => (response.ok ? response.json() : null))
    .then((value) => {
      const manifest = normalizeManifest(value);
      if (!manifest) { showFallback('A sequência de fotos não está disponível. A foto original permanece visível.'); return; }
      runViewer(root, image, setStatus, showFallback, manifest);
    })
    .catch(() => showFallback('A sequência de fotos não está disponível. A foto original permanece visível.'));
  if (root.dataset.photoLazy !== 'true' || !('IntersectionObserver' in window)) { initialize(); return; }
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    initialize();
  }, { rootMargin: '250px 0px' });
  observer.observe(root);
}

function runViewer(root, image, setStatus, showFallback, manifest) {
  const normalizeIndex = (index) => ((index % manifest.frames.length) + manifest.frames.length) % manifest.frames.length;
  const frameAt = (index) => manifest.frames[normalizeIndex(index)];
  const cache = new Map();
  const queue = [];
  let activeLoads = 0;
  let displayedIndex = manifest.homeIndex;
  let requestedIndex = manifest.homeIndex;
  let pointer = null;
  let pendingDelta = 0;

  const touch = (src) => {
    const item = cache.get(src);
    if (!item) return;
    cache.delete(src);
    cache.set(src, item);
  };
  const trimCache = () => {
    for (const [src, item] of cache) {
      if (cache.size <= MAX_DECODED_FRAMES) return;
      if (item.state !== 'loaded' || src === frameAt(displayedIndex).src || src === frameAt(requestedIndex).src) continue;
      cache.delete(src);
    }
  };
  const drainQueue = () => {
    queue.sort((left, right) => right.priority - left.priority);
    while (activeLoads < MAX_PRELOADS && queue.length) {
      const item = queue.shift();
      if (!item || item.state !== 'queued') continue;
      item.state = 'loading';
      activeLoads += 1;
      const source = new Image();
      item.image = source;
      source.decoding = 'async';
      source.onload = () => {
        activeLoads -= 1;
        item.state = 'loaded';
        touch(item.src);
        trimCache();
        item.resolve(true);
        drainQueue();
      };
      source.onerror = () => {
        activeLoads -= 1;
        cache.delete(item.src);
        item.resolve(false);
        drainQueue();
      };
      source.src = item.src;
    }
  };
  const queueFrame = (index, priority, purpose) => {
    const frame = frameAt(index);
    const existing = cache.get(frame.src);
    if (existing) {
      if (existing.state === 'queued' && priority > existing.priority) existing.priority = priority;
      if (purpose === 'requested') existing.purpose = 'requested';
      touch(frame.src);
      return existing.promise;
    }
    let resolve;
    const item = {
      src: frame.src,
      priority,
      purpose,
      state: 'queued',
      image: null,
      promise: new Promise((done) => { resolve = done; }),
      resolve,
    };
    cache.set(item.src, item);
    queue.push(item);
    drainQueue();
    return item.promise;
  };
  const discardObsoleteQueuedFrames = (targetIndex, keepSrc) => {
    const nearby = new Set([frameAt(targetIndex - 2).src, frameAt(targetIndex - 1).src, frameAt(targetIndex + 1).src, frameAt(targetIndex + 2).src]);
    for (let position = queue.length - 1; position >= 0; position -= 1) {
      const item = queue[position];
      const obsoleteRequested = item.purpose === 'requested' && item.src !== keepSrc;
      const obsoleteNeighbor = item.purpose === 'neighbor' && !nearby.has(item.src);
      if (!obsoleteRequested && !obsoleteNeighbor) continue;
      queue.splice(position, 1);
      cache.delete(item.src);
      item.state = 'discarded';
      item.resolve(false);
    }
  };
  const preloadNeighbors = (index) => {
    for (let distance = 1; distance <= 2; distance += 1) {
      queueFrame(index - distance, 40 - distance, 'neighbor');
      queueFrame(index + distance, 40 - distance, 'neighbor');
    }
  };
  const requestFrame = (index, initial = false, focus = false) => {
    requestedIndex = normalizeIndex(index);
    const requested = frameAt(requestedIndex);
    discardObsoleteQueuedFrames(requestedIndex, requested.src);
    return queueFrame(requestedIndex, 100, 'requested').then((loaded) => {
      if (frameAt(requestedIndex).src !== requested.src) return false;
      if (!loaded) {
        if (initial) showFallback('Não foi possível carregar a foto frontal da sequência. A foto original permanece disponível.');
        else setStatus('Esta foto não carregou. A última imagem real continua visível; use os controles para tentar outra vez.');
        return false;
      }
      displayedIndex = requestedIndex;
      image.src = requested.src;
      image.width = manifest.width;
      image.height = manifest.height;
      image.alt = `Foto real do frasco COWBOY Energia, posição ${displayedIndex + 1} de ${manifest.frames.length}`;
      preloadNeighbors(displayedIndex);
      if (focus) image.focus();
      root.dataset.photo360State = 'ready';
      setStatus('Fotos reais prontas. Arraste horizontalmente ou use as setas para observar o frasco.');
      return true;
    });
  };
  const step = (amount, focus = false) => requestFrame(requestedIndex + amount, false, focus);
  const reset = () => requestFrame(manifest.homeIndex, false, true);

  image.tabIndex = 0;
  image.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
    if (event.key === 'Home') { event.preventDefault(); reset(); }
  });
  image.addEventListener('pointerdown', (event) => { pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, captured: false }; });
  image.addEventListener('pointermove', (event) => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    if (!pointer.captured) {
      if (Math.abs(dx) < 8 || Math.abs(dx) <= Math.abs(dy)) return;
      pointer.captured = true;
      image.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    pendingDelta += dx;
    pointer.x = event.clientX;
    const steps = Math.trunc(pendingDelta / 15);
    if (steps !== 0) { step(-steps); pendingDelta -= steps * 15; }
  });
  const releasePointer = (event) => {
    if (!pointer || pointer.id !== event.pointerId) return;
    if (pointer.captured && image.hasPointerCapture(event.pointerId)) image.releasePointerCapture(event.pointerId);
    pointer = null;
    pendingDelta = 0;
  };
  image.addEventListener('pointerup', releasePointer);
  image.addEventListener('pointercancel', releasePointer);
  root.querySelector('[data-photo-left]')?.addEventListener('click', () => step(-1, true));
  root.querySelector('[data-photo-right]')?.addEventListener('click', () => step(1, true));
  root.querySelector('[data-photo-reset]')?.addEventListener('click', reset);
  requestFrame(manifest.homeIndex, true);
}

start();
