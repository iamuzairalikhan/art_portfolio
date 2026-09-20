/* Uzair Ali Khan — portfolio behaviour
   Three things only: the drag-strip, the work viewer, and the masthead knowing
   whether it is sitting on paper or on twilight. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- images fade in as they decode, not on scroll ---- */
  function settle(img) { img.classList.add('is-in'); }
  Array.prototype.forEach.call(document.querySelectorAll('.fade-img'), function (img) {
    if (img.complete && img.naturalWidth) settle(img);
    else img.addEventListener('load', function () { settle(img); }, { once: true });
    img.addEventListener('error', function () { settle(img); }, { once: true });
  });

  /* ---- hero strip: drag to pan ---- */
  var strip = document.getElementById('strip');
  if (strip) {
    var down = false, startX = 0, startLeft = 0, moved = 0;
    strip.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;          // let the OS do touch
      down = true; moved = 0;
      startX = e.clientX; startLeft = strip.scrollLeft;
      strip.classList.add('is-dragging');
      strip.setPointerCapture(e.pointerId);
    });
    strip.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      strip.scrollLeft = startLeft - dx;
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (t) {
      strip.addEventListener(t, function () { down = false; strip.classList.remove('is-dragging'); });
    });
    strip.addEventListener('click', function (e) { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    strip.addEventListener('keydown', function (e) {
      var step = strip.clientWidth * 0.7;
      if (e.key === 'ArrowRight') { strip.scrollBy({ left: step, behavior: reduced ? 'auto' : 'smooth' }); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { strip.scrollBy({ left: -step, behavior: reduced ? 'auto' : 'smooth' }); e.preventDefault(); }
    });
  }

  /* ---- masthead: stuck state, and inverting over the dark rooms ---- */
  var mast = document.getElementById('masthead');
  var darkRooms = Array.prototype.slice.call(document.querySelectorAll('.room, .contact'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));

  function frame() {
    var h = mast.offsetHeight;
    mast.classList.toggle('is-stuck', window.scrollY > 8);
    var dark = darkRooms.some(function (el) {
      var r = el.getBoundingClientRect();
      return r.top <= h * 0.55 && r.bottom >= h * 0.55;
    });
    mast.classList.toggle('is-dark', dark);

    var current = null;
    sections.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top <= h + 120) current = s.id;
    });
    navLinks.forEach(function (a) {
      a.setAttribute('aria-current', a.getAttribute('href') === '#' + current ? 'true' : 'false');
    });
  }
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { frame(); ticking = false; });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();

  /* ---- work viewer ---- */
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-lb]'));
  var lb = document.getElementById('lb');
  if (!lb || !items.length) return;
  var lbImg = document.getElementById('lbImg'),
      lbTitle = document.getElementById('lbTitle'),
      lbMeta = document.getElementById('lbMeta'),
      lbN = document.getElementById('lbN'),
      idx = 0, opener = null;

  var token = 0;
  function show(i) {
    idx = (i + items.length) % items.length;
    var el = items[idx], img = el.querySelector('img');
    var thumb = img ? img.currentSrc || img.src : '';
    var full = el.getAttribute('data-full') || thumb;

    // show the thumbnail immediately, swap in the full size once it has decoded
    var mine = ++token;
    lbImg.src = thumb;
    lbImg.alt = img ? img.alt : '';
    if (full !== thumb) {
      var pre = new Image();
      pre.onload = function () { if (mine === token) lbImg.src = full; };
      pre.src = full;
    }
    lbTitle.textContent = el.getAttribute('data-title') || '';
    lbMeta.textContent = el.getAttribute('data-meta') || '';
    lbN.textContent = (idx + 1) + ' / ' + items.length;
  }
  function open(i, from) {
    opener = from || null;
    show(i);
    lb.hidden = false; lb.classList.add('is-open');
    document.body.classList.add('lb-open');
    document.getElementById('lbClose').focus();
  }
  function close() {
    lb.classList.remove('is-open'); lb.hidden = true;
    document.body.classList.remove('lb-open');
    lbImg.removeAttribute('src');
    if (opener) opener.focus();
  }

  items.forEach(function (el, i) {
    el.addEventListener('click', function () { open(i, el); });
  });
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', function () { show(idx - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { show(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb__stage')) close(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
    else if (e.key === 'Tab') {                       // keep focus inside
      var f = lb.querySelectorAll('button');
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    }
  });
})();
