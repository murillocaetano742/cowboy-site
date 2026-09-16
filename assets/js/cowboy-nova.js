(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var chapters = Array.prototype.slice.call(document.querySelectorAll('section[data-chapter]'));
  var lists = Array.prototype.slice.call(document.querySelectorAll('[data-chapter-list]'));
  var progress = document.querySelector('[data-progress]');
  var pill = document.querySelector('[data-pill]');
  var pillNum = document.querySelector('[data-pill-num]');
  var pillName = document.querySelector('[data-pill-name]');
  var pillOpen = document.querySelector('[data-pill-open]');
  var sheet = document.querySelector('[data-sheet]');
  var sheetClose = document.querySelector('[data-sheet-close]');
  var recap = document.querySelector('[data-recap]');
  var recapTitle = document.querySelector('[data-recap-title]');
  var recapList = document.querySelector('[data-recap-list]');
  var names = {};
  var seen = {};
  var active = null;
  var ticking = false;

  chapters.forEach(function (section, index) {
    names[section.dataset.chapter] = { index: index + 1, title: section.id };
  });
  lists.forEach(function (list) {
    Array.prototype.forEach.call(list.querySelectorAll('li[data-chapter]'), function (item) {
      var label = item.querySelector('span:last-child');
      if (label && names[item.dataset.chapter]) names[item.dataset.chapter].short = label.textContent;
    });
  });

  function markLists() {
    lists.forEach(function (list) {
      Array.prototype.forEach.call(list.querySelectorAll('li[data-chapter]'), function (item) {
        var key = item.dataset.chapter;
        if (key === active) item.setAttribute('data-active', ''); else item.removeAttribute('data-active');
        if (seen[key]) item.setAttribute('data-done', ''); else item.removeAttribute('data-done');
      });
    });
  }

  function updateRecap() {
    if (!recap || !recapList) return;
    var keys = Object.keys(names).filter(function (key) { return key !== 'kit'; });
    var done = keys.filter(function (key) { return seen[key]; });
    recapList.innerHTML = '';
    keys.forEach(function (key) {
      var item = document.createElement('li');
      var text = names[key].index + '. ' + (names[key].short || names[key].title);
      if (seen[key]) { item.setAttribute('data-recap-done', ''); item.textContent = text; }
      else { var link = document.createElement('a'); link.href = '#' + key; link.textContent = text; item.appendChild(link); }
      recapList.appendChild(item);
    });
    if (recapTitle) {
      recapTitle.textContent = done.length === keys.length
        ? 'Você conferiu os ' + keys.length + ' blocos. Boa escolha.'
        : 'Você já conferiu ' + done.length + ' de ' + keys.length + ' blocos. Faltam:';
    }
    recap.hidden = false;
  }

  function setActive(key) {
    if (!key || key === active) return;
    active = key;
    seen[key] = true;
    markLists();
    if (pillNum && names[key]) pillNum.textContent = String(names[key].index);
    if (pillName && names[key]) pillName.textContent = names[key].short || names[key].title;
    if (pill) pill.hidden = false;
    if (key === 'kit') updateRecap();
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0) + '%';
      var line = window.innerHeight * 0.45;
      var current = null;
      for (var i = 0; i < chapters.length; i += 1) {
        if (chapters[i].getBoundingClientRect().top <= line) current = chapters[i].dataset.chapter;
      }
      if (current) setActive(current);
      else if (pill) pill.hidden = true;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // Chapter sheet (mobile)
  function openSheet() { if (!sheet) return; sheet.hidden = false; if (pillOpen) pillOpen.setAttribute('aria-expanded', 'true'); var first = sheet.querySelector('a'); if (first) first.focus(); }
  function closeSheet(returnFocus) { if (!sheet) return; sheet.hidden = true; if (pillOpen) pillOpen.setAttribute('aria-expanded', 'false'); if (returnFocus && pillOpen) pillOpen.focus(); }
  if (pillOpen) pillOpen.addEventListener('click', function () { if (sheet && sheet.hidden) openSheet(); else closeSheet(true); });
  if (sheetClose) sheetClose.addEventListener('click', function () { closeSheet(true); });
  if (sheet) {
    sheet.addEventListener('click', function (event) { if (event.target.closest('a')) closeSheet(false); });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !sheet.hidden) closeSheet(true); });
  }

  // Gallery: scroll-snap track with dots and arrows
  var gallery = document.querySelector('[data-gallery]');
  if (gallery) {
    var track = gallery.querySelector('.track');
    var slides = Array.prototype.slice.call(track.querySelectorAll('.slide'));
    var dots = gallery.querySelector('[data-gallery-dots]');
    var prev = gallery.querySelector('[data-gallery-prev]');
    var next = gallery.querySelector('[data-gallery-next]');
    var current = 0;
    slides.forEach(function (slide, index) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Imagem ' + (index + 1) + ' de ' + slides.length);
      dot.addEventListener('click', function () { go(index); });
      dots.appendChild(dot);
    });
    function paint() {
      Array.prototype.forEach.call(dots.children, function (dot, index) {
        if (index === current) dot.setAttribute('aria-current', 'true'); else dot.removeAttribute('aria-current');
      });
    }
    function go(index) {
      current = Math.max(0, Math.min(slides.length - 1, index));
      var slide = slides[current];
      track.scrollTo({ left: slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
      paint();
    }
    var scrollTimer = null;
    track.addEventListener('scroll', function () {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(function () {
        var center = track.scrollLeft + track.clientWidth / 2;
        var best = 0, bestDistance = Infinity;
        slides.forEach(function (slide, index) {
          var distance = Math.abs(slide.offsetLeft + slide.clientWidth / 2 - center);
          if (distance < bestDistance) { bestDistance = distance; best = index; }
        });
        current = best;
        paint();
      }, 80);
    }, { passive: true });
    if (prev) prev.addEventListener('click', function () { go(current - 1); });
    if (next) next.addEventListener('click', function () { go(current + 1); });
    track.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight') { go(current + 1); event.preventDefault(); }
      if (event.key === 'ArrowLeft') { go(current - 1); event.preventDefault(); }
    });
    paint();
  }

  // Kits: hide options whose checkout is not configured yet (keeps at least the default kit visible).
  fetch('/api/config', { headers: { Accept: 'application/json' } }).then(function (r) { return r.ok ? r.json() : null; }).then(function (config) {
    if (!config || !Array.isArray(config.variants)) return;
    var available = {};
    config.variants.forEach(function (v) { available[v.quantity] = Boolean(v.checkoutAvailable); });
    var any = Object.keys(available).some(function (k) { return available[k]; });
    if (!any) return;
    Array.prototype.forEach.call(document.querySelectorAll('.kit'), function (kit) {
      var input = kit.querySelector('input[name="quantity"]');
      if (input && !available[Number(input.value)]) {
        if (input.checked) { var fallback = document.querySelector('input[name="quantity"][value="2"]'); if (fallback) { fallback.checked = true; fallback.dispatchEvent(new Event('change')); } }
        kit.setAttribute('data-unavailable', '');
        if (!kit.querySelector('.soon')) { var soon = document.createElement('span'); soon.className = 'soon'; soon.textContent = 'Disponível em breve'; (kit.querySelector('.kit-body') || kit).appendChild(soon); }
      }
    });
  }).catch(function () {});

  // VSL delayed reveal: when a real video is present, offer CTAs stay locked until the video reaches data-reveal-at
  // seconds (or ends). A 'skip' link appears after 45 s so warm traffic is never trapped. Without a video, nothing is locked.
  var vsl = document.querySelector('[data-vsl]');
  var vslVideo = vsl && vsl.querySelector('video[data-vsl-video]');
  var reveals = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  var skip = document.querySelector('[data-vsl-skip]');
  function unlock() { reveals.forEach(function (el) { el.removeAttribute('data-locked'); }); if (skip) skip.hidden = true; }
  var gateOn = Boolean(vsl && vslVideo && vsl.dataset.vslGate !== 'off');
  if (vsl && vslVideo && reveals.length && gateOn) {
    var at = Number(vsl.dataset.revealAt) || 0;
    reveals.forEach(function (el) { el.setAttribute('data-locked', ''); });
    var started = false;
    function showSkip() { if (skip && skip.hidden && reveals.some(function (el) { return el.hasAttribute('data-locked'); })) skip.hidden = false; }
    vslVideo.addEventListener('play', function () { if (!started) { started = true; window.setTimeout(showSkip, 45000); } });
    // Warm traffic that never presses play still gets a way to the offer after 60 s on the page.
    window.setTimeout(showSkip, 60000);
    vslVideo.addEventListener('timeupdate', function () { if (vslVideo.currentTime >= at) unlock(); });
    vslVideo.addEventListener('ended', unlock);
    if (skip) skip.addEventListener('click', unlock);
  }

  // Play overlay (independent of the gate): one tap starts the video with sound; native controls take over after that.
  if (vsl && vslVideo) {
    var frame = vslVideo.closest('.vsl-frame');
    var playButton = vsl.querySelector('[data-vsl-play]');
    function startVideo() {
      vslVideo.muted = false;
      var p = vslVideo.play();
      if (p && p.catch) p.catch(function () { vslVideo.muted = true; vslVideo.play().catch(function () {}); });
    }
    if (playButton) playButton.addEventListener('click', startVideo);
    vslVideo.addEventListener('play', function () { if (frame) frame.setAttribute('data-playing', ''); vslVideo.setAttribute('controls', ''); });
    vslVideo.addEventListener('ended', function () { if (frame) frame.removeAttribute('data-playing'); });
  }

  // Sticky CTA (16/09, decisão do proprietário): aparece só enquanto a seção de escolher o kit está na tela e o botão
  // principal de compra não está visível. É um submit do mesmo formulário, com o kit marcado.
  var sticky = document.querySelector('[data-sticky-cta]');
  var kitSection = document.getElementById('kit');
  var mainButton = document.querySelector('[data-checkout-button]');
  var stickyKit = sticky && sticky.querySelector('[data-sticky-kit]');
  if (sticky && kitSection && 'IntersectionObserver' in window) {
    var kitVisible = false, mainVisible = false;
    var kitLabels = { 1: '1 frasco · R$ 79,90', 2: '2 frascos · R$ 154,80 · frete grátis', 3: '3 frascos · R$ 199,90 · frete grátis' };
    function paintSticky() {
      var show = kitVisible && !mainVisible && !sticky.hasAttribute('data-locked') && !(mainButton && mainButton.disabled);
      sticky.hidden = !show;
      if (show) document.body.setAttribute('data-sticky', ''); else document.body.removeAttribute('data-sticky');
    }
    function paintStickyKit() {
      var checked = document.querySelector('[name="quantity"]:checked');
      if (stickyKit && checked && kitLabels[checked.value]) stickyKit.textContent = kitLabels[checked.value];
    }
    new IntersectionObserver(function (entries) { kitVisible = entries.some(function (e) { return e.isIntersecting; }); paintSticky(); }, { threshold: 0.02 }).observe(kitSection);
    if (mainButton) new IntersectionObserver(function (entries) { mainVisible = entries.some(function (e) { return e.isIntersecting; }); paintSticky(); }, { threshold: 0.4 }).observe(mainButton);
    Array.prototype.forEach.call(document.querySelectorAll('[name="quantity"]'), function (input) { input.addEventListener('change', paintStickyKit); });
    paintStickyKit();
    sticky.setAttribute('data-reveal', '');
    if (gateOn && vslVideo) { sticky.setAttribute('data-locked', ''); vslVideo.addEventListener('timeupdate', function () { if (vslVideo.currentTime >= (Number(vsl.dataset.revealAt) || 0)) { sticky.removeAttribute('data-locked'); paintSticky(); } }); vslVideo.addEventListener('ended', function () { sticky.removeAttribute('data-locked'); paintSticky(); }); if (skip) skip.addEventListener('click', function () { sticky.removeAttribute('data-locked'); paintSticky(); }); }
  }

  // VSL measurement: play and 25/50/75/100 % progress to GA4 (gtag) and Meta (fbq) when those loaders exist.
  if (vslVideo) {
    var marks = { 25: false, 50: false, 75: false, 100: false };
    function track(name, params) {
      try { if (typeof window.gtag === 'function') window.gtag('event', name, params || {}); } catch (e) {}
      try { if (typeof window.fbq === 'function') window.fbq('trackCustom', name, params || {}); } catch (e) {}
    }
    vslVideo.addEventListener('play', function () { if (!vslVideo.dataset.started) { vslVideo.dataset.started = '1'; track('vsl_start', { video_title: 'VSL Dr. Durval' }); } });
    vslVideo.addEventListener('timeupdate', function () {
      if (!vslVideo.duration) return;
      var pct = Math.floor((vslVideo.currentTime / vslVideo.duration) * 100);
      [25, 50, 75].forEach(function (m) { if (pct >= m && !marks[m]) { marks[m] = true; track('vsl_progress', { percent: m }); } });
    });
    vslVideo.addEventListener('ended', function () { if (!marks[100]) { marks[100] = true; track('vsl_complete', { percent: 100 }); } });
  }

  // WhatsApp: the number lives in <body data-whatsapp>. Empty number keeps every WhatsApp block hidden.
  var waNumber = (document.body.dataset.whatsapp || '').replace(/\D/g, '');
  if (waNumber) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-whatsapp]'), function (link) {
      link.href = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(link.dataset.whatsappText || 'Olá! Vi a página do COWBOY Energia.');
      link.target = '_blank'; link.rel = 'noopener';
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-whatsapp-block]'), function (block) { block.hidden = false; });
  }

  // Urgency: one real deadline set by the owner in data-deadline (ISO). Shows only while the deadline is in the future;
  // hides itself after it passes. No rolling dates. Optional data-stock shows a real remaining count.
  var urgency = document.querySelector('[data-urgency]');
  if (urgency) {
    var deadline = new Date(urgency.dataset.deadline || '');
    var echo = document.querySelector('[data-urgency-echo]');
    if (!isNaN(deadline.getTime()) && deadline.getTime() > Date.now()) {
      var months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
      var label = deadline.getDate() + ' de ' + months[deadline.getMonth()];
      Array.prototype.forEach.call(document.querySelectorAll('[data-deadline-text]'), function (el) { el.textContent = label; });
      var stock = parseInt(urgency.dataset.stock, 10);
      var stockNote = urgency.querySelector('[data-stock-note]');
      var stockCount = urgency.querySelector('[data-stock-count]');
      if (stockNote && stockCount && stock > 0) { stockCount.textContent = String(stock); stockNote.hidden = false; }
      var cells = {};
      Array.prototype.forEach.call(urgency.querySelectorAll('[data-cd]'), function (el) { cells[el.dataset.cd] = el; });
      function pad(n) { return (n < 10 ? '0' : '') + n; }
      function tick() {
        var left = deadline.getTime() - Date.now();
        if (left <= 0) { urgency.hidden = true; if (echo) echo.hidden = true; return; }
        var s = Math.floor(left / 1000);
        if (cells.d) cells.d.textContent = pad(Math.floor(s / 86400));
        if (cells.h) cells.h.textContent = pad(Math.floor((s % 86400) / 3600));
        if (cells.m) cells.m.textContent = pad(Math.floor((s % 3600) / 60));
        if (cells.s) cells.s.textContent = pad(s % 60);
        window.setTimeout(tick, 1000);
      }
      urgency.hidden = false;
      if (echo) echo.hidden = false;
      tick();
    }
  }

  // Activity notices: real orders and real customer relatos from assets/data/atividade.json. Nothing is generated.
  var toast = document.querySelector('[data-toast]');
  if (toast && window.fetch && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches && false)) {
    var toastTitle = toast.querySelector('[data-toast-title]');
    var toastText = toast.querySelector('[data-toast-text]');
    var toastMeta = toast.querySelector('[data-toast-meta]');
    var toastClose = toast.querySelector('[data-toast-close]');
    var dismissed = false;
    var hideTimer = null;
    if (toastClose) toastClose.addEventListener('click', function () { dismissed = true; toast.removeAttribute('data-show'); window.setTimeout(function () { toast.hidden = true; }, 350); });
    function relative(iso) {
      var t = new Date(iso).getTime();
      if (isNaN(t)) return '';
      var mins = Math.round((Date.now() - t) / 60000);
      if (mins < 1) return 'agora há pouco';
      if (mins < 60) return 'há ' + mins + ' min';
      var hours = Math.round(mins / 60);
      if (hours < 48) return 'há ' + hours + ' h';
      var d = new Date(t);
      return 'em ' + pad2(d.getDate()) + '/' + pad2(d.getMonth() + 1);
    }
    function pad2(n) { return (n < 10 ? '0' : '') + n; }
    function kitLabel(k) { k = Number(k); return k > 1 ? k + ' frascos' : '1 frasco'; }
    function show(item) {
      if (dismissed || document.hidden) return;
      if (vslVideo && !vslVideo.paused) return;
      toastTitle.textContent = item.title; toastText.textContent = item.text; toastMeta.textContent = item.meta;
      toast.hidden = false;
      window.requestAnimationFrame(function () { toast.setAttribute('data-show', ''); });
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(function () { toast.removeAttribute('data-show'); window.setTimeout(function () { if (!toast.hasAttribute('data-show')) toast.hidden = true; }, 350); }, 6500);
    }
    fetch('assets/data/atividade.json', { headers: { Accept: 'application/json' } }).then(function (r) { return r.ok ? r.json() : null; }).then(function (data) {
      if (!data) return;
      var queue = [];
      (data.pedidos || []).slice().sort(function (a, b) { return new Date(b.quando) - new Date(a.quando); }).slice(0, 12).forEach(function (p) {
        if (!p || !p.nome || !p.kit) return;
        queue.push({ title: p.nome + (p.cidade ? ', de ' + p.cidade : ''), text: 'garantiu o kit de ' + kitLabel(p.kit) + (p.quando ? ' ' + relative(p.quando) : ''), meta: 'Pedido real · nome como o cliente autorizou' });
      });
      (data.relatos || []).forEach(function (r) {
        if (!r || !r.nome || !r.texto) return;
        queue.push({ title: 'Cliente ' + r.nome, text: r.texto, meta: 'Relato real · nomes alterados para preservar a privacidade' });
      });
      if (!queue.length) return;
      var index = 0, shown = 0;
      function next() {
        if (dismissed || shown >= 6) return;
        show(queue[index % queue.length]); index += 1; shown += 1;
        window.setTimeout(next, 16000);
      }
      window.setTimeout(next, 9000);
    }).catch(function () {});
  }

  // Background parallax: each [data-bg] section moves its .bg-layer a little against the scroll (6 % desktop, 3 % mobile).
  var bgLayers = Array.prototype.slice.call(document.querySelectorAll('[data-bg] > .bg-layer'));
  if (bgLayers.length && !reduceMotion) {
    var bgTick = false;
    function paintBg() {
      bgTick = false;
      var vh = window.innerHeight;
      var factor = window.innerWidth < 640 ? 0.03 : 0.06;
      bgLayers.forEach(function (layer) {
        var rect = layer.parentNode.getBoundingClientRect();
        if (rect.bottom < -vh || rect.top > vh * 2) return;
        var offset = (rect.top + rect.height / 2 - vh / 2) * -factor;
        layer.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });
    }
    window.addEventListener('scroll', function () { if (!bgTick) { bgTick = true; window.requestAnimationFrame(paintBg); } }, { passive: true });
    window.addEventListener('resize', paintBg);
    paintBg();
  }

  // One authored moment: hero product settles into place on load.
  var heroArt = document.querySelector('.hero-art img');
  if (heroArt && !reduceMotion && 'animate' in heroArt) {
    heroArt.animate([{ opacity: 0, transform: 'translateY(14px) scale(1.03)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 1000, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' });
  }
})();
