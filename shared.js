/* ═══════════════════════════════════════════════════════════════
   BuyGenix Solutions — shared.js  v3.0
   Injects: real logo SVG · burger · counters · tilt · bg dots
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── LOGO SVG — matches the uploaded logo exactly ── */
  var LOGO_SVG = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lg1" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#2563EB"/>
        <stop offset="100%" stop-color="#7C3AED"/>
      </linearGradient>
    </defs>
    <!-- Bold B shape -->
    <path d="M10 8 L10 40 L26 40 C33 40 38 36 38 30 C38 26 36 23 32 22 C35 21 37 18 37 14 C37 10 33 8 27 8 Z
             M17 14 L26 14 C28.5 14 30 15.5 30 17.5 C30 19.5 28.5 21 26 21 L17 21 Z
             M17 27 L27 27 C30 27 31.5 28.5 31.5 30.5 C31.5 32.5 30 34 27 34 L17 34 Z"
          fill="url(#lg1)"/>
    <!-- Arrow pointing up-right -->
    <path d="M30 6 L42 6 L42 18" stroke="url(#lg1)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M42 6 L28 20" stroke="url(#lg1)" stroke-width="3.5" stroke-linecap="round" fill="none"/>
  </svg>`;

  var LOGO_SVG_SM = `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lg2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#2563EB"/>
        <stop offset="100%" stop-color="#7C3AED"/>
      </linearGradient>
    </defs>
    <path d="M10 8 L10 40 L26 40 C33 40 38 36 38 30 C38 26 36 23 32 22 C35 21 37 18 37 14 C37 10 33 8 27 8 Z
             M17 14 L26 14 C28.5 14 30 15.5 30 17.5 C30 19.5 28.5 21 26 21 L17 21 Z
             M17 27 L27 27 C30 27 31.5 28.5 31.5 30.5 C31.5 32.5 30 34 27 34 L17 34 Z"
          fill="url(#lg2)"/>
    <path d="M30 6 L42 6 L42 18" stroke="url(#lg2)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M42 6 L28 20" stroke="url(#lg2)" stroke-width="3.5" stroke-linecap="round" fill="none"/>
  </svg>`;

  /* ── INJECT LOGO SVG into .logo-svg-wrap ── */
  document.querySelectorAll('.logo-svg-wrap').forEach(function (wrap) {
    wrap.innerHTML = LOGO_SVG;
    // Also add text block if not present and parent is .logo
    var logo = wrap.closest('.logo');
    if (logo && !logo.querySelector('.logo-brand')) {
      var textDiv = document.createElement('div');
      textDiv.className = 'logo-text';
      textDiv.innerHTML = '<span class="logo-brand">Buygenix</span><span class="logo-sub">Solutions</span>';
      // Remove old tagline if present
      var oldTag = logo.querySelector('.logo-tagline');
      if (oldTag) oldTag.style.display = 'none';
      logo.appendChild(textDiv);
    }
  });

  /* ── INJECT LOGO into footer ── */
  document.querySelectorAll('.logo-svg-wrap-footer').forEach(function (wrap) {
    wrap.innerHTML = LOGO_SVG_SM;
    var parent = wrap.parentElement;
    if (parent && !parent.querySelector('.footer-brand-name')) {
      var name = document.createElement('span');
      name.className = 'footer-brand-name';
      name.textContent = 'Buygenix Solutions';
      parent.appendChild(name);
    }
  });

  /* ── BURGER MENU ── */
  var burger  = document.querySelector('.nav-burger');
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
        ? '0 4px 28px rgba(0,0,0,0.40)'
        : '0 2px 20px rgba(0,0,0,0.30)';
    }, { passive: true });
  }

  /* ── ANIMATED COUNTERS ── */
  function animateCounter(el) {
    var target   = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix   = el.getAttribute('data-suffix') || '';
    var prefix   = el.getAttribute('data-prefix') || '';
    var duration = 1800;
    var start    = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
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
      var r  = card.getBoundingClientRect();
      var dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      var dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      card.style.transform = 'perspective(700px) rotateY(' + (dx * 3.5) + 'deg) rotateX(' + (-dy * 3.5) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function () { card.style.transform = ''; });
  });

  /* ── BG CANVAS — blue/purple dots ── */
  var canvas = document.getElementById('bg-canvas');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d'), W, H, dots = [];
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    for (var i = 0; i < 40; i++) {
      dots.push({
        x: Math.random() * 2000, y: Math.random() * 1200,
        r: Math.random() * 1.2 + 0.4,
        vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
        hue: Math.random() > 0.5 ? '37,99,235' : '124,58,237'
      });
    }
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(function (d) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + d.hue + ',0.5)'; ctx.fill();
      });
      requestAnimationFrame(draw);
    })();
  }

  /* ── ALWAYS REVEAL ── */
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(function (el) {
    el.style.opacity = '1'; el.style.transform = 'none'; el.style.visibility = 'visible';
  });

  /* ── HIDE PAGE OVERLAY ── */
  var ov = document.querySelector('.page-overlay');
  if (ov) { ov.style.display = 'none'; ov.style.opacity = '0'; }

  /* ── WINDOW LOAD — final reveal fix ── */
  window.addEventListener('load', function () {
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(function (el) {
      el.style.opacity = '1'; el.style.transform = 'none'; el.style.visibility = 'visible';
    });
  });

})();
