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
        ? 'Você conferiu os ' + keys.length + ' capítulos. Boa escolha.'
        : 'Você já conferiu ' + done.length + ' de ' + keys.length + ' capítulos. Faltam:';
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
        kit.hidden = true;
      }
    });
  }).catch(function () {});

  // One authored moment: hero product settles into place on load.
  var heroArt = document.querySelector('.hero-art img');
  if (heroArt && !reduceMotion && 'animate' in heroArt) {
    heroArt.animate([{ opacity: 0, transform: 'translateY(14px) scale(1.03)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 1000, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' });
  }
})();
