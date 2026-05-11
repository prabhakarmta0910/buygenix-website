/* ═══════════════════════════════════════════════════════════════
   BuyGenix Solutions — shared.js  FINAL v4
   Logo: exact replica of uploaded image (B + swoosh + arrow)
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════════
     LOGO SVG — exact replica of the Buygenix logo:
     • Bold rounded B letter
     • Swoosh/arc cutting through the B bottom-left
     • Arrow pointing top-right through the B
     • Blue (#2A5BD7) → Purple (#7B2FBE) gradient
  ══════════════════════════════════════════════════════════════ */
  var LOGO_SVG = '<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<linearGradient id="bgx-g1" x1="0%" y1="100%" x2="100%" y2="0%">' +
        '<stop offset="0%" stop-color="#2A5BD7"/>' +
        '<stop offset="100%" stop-color="#7B2FBE"/>' +
      '</linearGradient>' +
      '<linearGradient id="bgx-g2" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="#4C8AFF"/>' +
        '<stop offset="100%" stop-color="#7B2FBE"/>' +
      '</linearGradient>' +
    '</defs>' +
    /* Bold B shape — rounded, matching logo style */
    '<path d="M10 6 L10 50 L30 50 C39 50 45.5 45.5 45.5 38 C45.5 33.5 43 30 38.5 28.5 C42 27 44 23.5 44 19 C44 13 38.5 6 30 6 Z" fill="url(#bgx-g1)"/>' +
    '<path d="M17.5 13 L29 13 C32.5 13 35 15 35 18 C35 21 32.5 23 29 23 L17.5 23 Z" fill="white" opacity="0.92"/>' +
    '<path d="M17.5 30 L30 30 C34 30 36.5 32 36.5 35 C36.5 38 34 40 30 40 L17.5 40 Z" fill="white" opacity="0.92"/>' +
    /* Swoosh arc — curves from bottom-left through the B */
    '<path d="M6 42 C10 50 20 54 32 50 C42 47 48 40 50 30" stroke="url(#bgx-g2)" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.85"/>' +
    /* Arrow shaft — diagonal up-right */
    '<path d="M22 32 L40 8" stroke="url(#bgx-g2)" stroke-width="3.5" stroke-linecap="round" fill="none"/>' +
    /* Arrow head */
    '<path d="M32 6 L42 4 L44 14" stroke="url(#bgx-g2)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
  '</svg>';

  var LOGO_SVG_FOOTER = '<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
      '<linearGradient id="bgx-gf1" x1="0%" y1="100%" x2="100%" y2="0%">' +
        '<stop offset="0%" stop-color="#2A5BD7"/>' +
        '<stop offset="100%" stop-color="#7B2FBE"/>' +
      '</linearGradient>' +
      '<linearGradient id="bgx-gf2" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="#4C8AFF"/>' +
        '<stop offset="100%" stop-color="#7B2FBE"/>' +
      '</linearGradient>' +
    '</defs>' +
    '<path d="M10 6 L10 50 L30 50 C39 50 45.5 45.5 45.5 38 C45.5 33.5 43 30 38.5 28.5 C42 27 44 23.5 44 19 C44 13 38.5 6 30 6 Z" fill="url(#bgx-gf1)"/>' +
    '<path d="M17.5 13 L29 13 C32.5 13 35 15 35 18 C35 21 32.5 23 29 23 L17.5 23 Z" fill="white" opacity="0.92"/>' +
    '<path d="M17.5 30 L30 30 C34 30 36.5 32 36.5 35 C36.5 38 34 40 30 40 L17.5 40 Z" fill="white" opacity="0.92"/>' +
    '<path d="M6 42 C10 50 20 54 32 50 C42 47 48 40 50 30" stroke="url(#bgx-gf2)" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.85"/>' +
    '<path d="M22 32 L40 8" stroke="url(#bgx-gf2)" stroke-width="3.5" stroke-linecap="round" fill="none"/>' +
    '<path d="M32 6 L42 4 L44 14" stroke="url(#bgx-gf2)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
  '</svg>';

  /* ── INJECT NAV LOGO ── */
  document.querySelectorAll('.logo-svg-wrap').forEach(function (wrap) {
    wrap.innerHTML = LOGO_SVG;
    var logo = wrap.closest('.logo');
    if (!logo) return;
    /* Remove old tagline/text, add new structured text */
    var oldTag = logo.querySelector('.logo-tagline');
    if (oldTag) oldTag.style.display = 'none';
    if (!logo.querySelector('.logo-text')) {
      var textDiv = document.createElement('div');
      textDiv.className = 'logo-text';
      textDiv.innerHTML =
        '<span class="logo-brand">Buygenix</span>' +
        '<span class="logo-sub">Solutions</span>';
      logo.appendChild(textDiv);
    }
  });

  /* ── INJECT FOOTER LOGO ── */
  document.querySelectorAll('.logo-svg-wrap-footer').forEach(function (wrap) {
    wrap.innerHTML = LOGO_SVG_FOOTER;
    var parent = wrap.parentElement;
    if (parent && !parent.querySelector('.footer-brand-name')) {
      var span = document.createElement('span');
      span.className = 'footer-brand-name';
      span.textContent = 'Buygenix Solutions';
      parent.appendChild(span);
    }
  });

  /* ── BURGER ── */
  var burger = document.querySelector('.nav-burger');
  var overlay = document.querySelector('.mobile-nav-overlay');
  if (burger && overlay) {
    burger.addEventListener('click', function () {
      overlay.classList.toggle('open');
      document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
    });
    overlay.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── NAV SCROLL ── */
  var nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.style.boxShadow = window.scrollY > 20
        ? '0 4px 28px rgba(0,0,0,.40)' : '0 2px 18px rgba(0,0,0,.28)';
    }, { passive: true });
  }

  /* ── ANIMATED COUNTERS ── */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var start = null;
    var dur = 1800;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.floor(e * target).toLocaleString('en-IN') + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var cObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { animateCounter(e.target); cObs.unobserve(e.target); }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cObs.observe(el); });

  /* ── TILT CARDS ── */
  document.querySelectorAll('.tilt-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      var dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      card.style.transform = 'perspective(700px) rotateY(' + (dx * 3) + 'deg) rotateX(' + (-dy * 3) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function () { card.style.transform = ''; });
  });

  /* ── BG CANVAS ── */
  var canvas = document.getElementById('bg-canvas');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d'), W, H, dots = [];
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    var colours = ['42,91,215', '123,47,190', '76,138,255'];
    for (var i = 0; i < 38; i++) {
      dots.push({
        x: Math.random() * 2200, y: Math.random() * 1300,
        r: Math.random() * 1.2 + 0.4,
        vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18,
        c: colours[Math.floor(Math.random() * colours.length)]
      });
    }
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(function (d) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + d.c + ',.45)'; ctx.fill();
      });
      requestAnimationFrame(draw);
    })();
  }

  /* ── ALWAYS REVEAL ── */
  function reveal() {
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(function (el) {
      el.style.opacity = '1'; el.style.transform = 'none'; el.style.visibility = 'visible';
    });
    var ov = document.querySelector('.page-overlay');
    if (ov) { ov.style.display = 'none'; ov.style.opacity = '0'; }
  }
  reveal();
  window.addEventListener('load', reveal);

})();
