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
    var heading = section.querySelector('h2');
    names[section.dataset.chapter] = { index: index + 1, title: heading ? heading.textContent.replace(/\s+/g, ' ').trim() : section.id };
  });
  lists.forEach(function (list) {
    Array.prototype.forEach.call(list.querySelectorAll('li[data-chapter]'), function (item) {
      var label = item.querySelector('span:last-child');
      if (label) names[item.dataset.chapter] = names[item.dataset.chapter] || {};
      if (label) names[item.dataset.chapter].short = label.textContent;
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
      if (seen[key]) {
        item.setAttribute('data-recap-done', '');
        item.textContent = names[key].index + '. ' + (names[key].short || names[key].title);
      } else {
        var link = document.createElement('a');
        link.href = '#' + key;
        link.textContent = names[key].index + '. ' + (names[key].short || names[key].title);
        item.appendChild(link);
      }
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
      var line = window.innerHeight * 0.4;
      var current = null;
      for (var i = 0; i < chapters.length; i += 1) {
        var rect = chapters[i].getBoundingClientRect();
        if (rect.top <= line) current = chapters[i].dataset.chapter;
      }
      if (current) setActive(current);
      else if (pill && window.scrollY < 80) pill.hidden = true;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // Chapter sheet (mobile)
  function openSheet() {
    if (!sheet) return;
    sheet.hidden = false;
    if (pillOpen) pillOpen.setAttribute('aria-expanded', 'true');
    var first = sheet.querySelector('a');
    if (first) first.focus();
  }
  function closeSheet(returnFocus) {
    if (!sheet) return;
    sheet.hidden = true;
    if (pillOpen) pillOpen.setAttribute('aria-expanded', 'false');
    if (returnFocus && pillOpen) pillOpen.focus();
  }
  if (pillOpen) pillOpen.addEventListener('click', function () { if (sheet && sheet.hidden) openSheet(); else closeSheet(true); });
  if (sheetClose) sheetClose.addEventListener('click', function () { closeSheet(true); });
  if (sheet) {
    sheet.addEventListener('click', function (event) { if (event.target.closest('a')) closeSheet(false); });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !sheet.hidden) closeSheet(true); });
  }

  // Hero: single authored moment, once, unless the visitor prefers reduced motion.
  var heroArt = document.querySelector('.hero-art img');
  if (heroArt && !reduceMotion && 'animate' in heroArt) {
    heroArt.animate([{ opacity: 0, transform: 'scale(1.04)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 1100, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' });
  }
})();
