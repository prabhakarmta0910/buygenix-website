/* ═══════════════════════════════════════
   BuyGenix Solutions — shared.js  ORIGINAL v2.0
═══════════════════════════════════════ */
(function () {
  'use strict';

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

  /* ── NAV SCROLL SHADOW ── */
  var nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.style.boxShadow = window.scrollY > 20
        ? '0 4px 30px rgba(11,33,64,0.28)'
        : '0 2px 24px rgba(11,33,64,0.18)';
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
      card.style.transform = 'perspective(800px) rotateY(' + (dx * 4) + 'deg) rotateX(' + (-dy * 4) + 'deg) translateY(-4px)';
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
    for (var i = 0; i < 50; i++) {
      dots.push({ x: Math.random() * 2000, y: Math.random() * 1200,
                  r: Math.random() * 1.5 + 0.5,
                  vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25 });
    }
    (function draw() {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(function (d) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(184,134,11,0.4)'; ctx.fill();
      });
      requestAnimationFrame(draw);
    })();
  }

  /* ── ALWAYS REVEAL ── */
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(function (el) {
    el.style.opacity    = '1';
    el.style.transform  = 'none';
    el.style.visibility = 'visible';
  });

  /* ── HIDE OVERLAY ── */
  var ov = document.querySelector('.page-overlay');
  if (ov) { ov.style.display = 'none'; ov.style.opacity = '0'; }

})();
