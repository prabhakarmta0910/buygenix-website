/* ═══════════════════════════════════════
   BuyGenix Solutions — shared.js v3.0
═══════════════════════════════════════ */

(function () {
  'use strict';

  /* ── NAV LOGO inject (if logo-svg-wrap present) ── */
  document.querySelectorAll('.logo').forEach(function (logo) {
    // Inject name span if not already a link
    if (!logo.querySelector('.logo-name')) {
      const nameSpan = document.createElement('span');
      nameSpan.className = 'logo-name';
      nameSpan.innerHTML = 'BuyGenix<span> Solutions</span>';
      const tag = logo.querySelector('.logo-tagline');
      if (tag) {
        tag.textContent = '';
        logo.insertBefore(nameSpan, tag);
      } else {
        logo.appendChild(nameSpan);
      }
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
    overlay.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── NAV SCROLL EFFECT ── */
  var nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.35)';
      } else {
        nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.25)';
      }
    }, { passive: true });
  }

  /* ── LOGO footer ── */
  document.querySelectorAll('.logo-svg-wrap-footer').forEach(function (wrap) {
    if (!wrap.nextElementSibling || !wrap.nextElementSibling.classList.contains('footer-brand-name')) {
      var name = document.createElement('div');
      name.className = 'footer-brand-name';
      name.innerHTML = 'BuyGenix<span> Solutions</span>';
      wrap.parentNode.insertBefore(name, wrap.nextSibling);
    }
  });

  /* ── ANIMATED COUNTERS ── */
  function animateCounter(el) {
    var target  = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix  = el.getAttribute('data-suffix') || '';
    var prefix  = el.getAttribute('data-prefix') || '';
    var duration = 1800;
    var start   = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased    = 1 - Math.pow(1 - progress, 3);
      var val      = Math.floor(eased * target);
      el.textContent = prefix + val.toLocaleString('en-IN') + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('[data-count]').forEach(function (el) {
    el.textContent = el.getAttribute('data-prefix') || '0';
    counterObserver.observe(el);
  });

  /* ── SUBTLE TILT ON CARDS ── */
  document.querySelectorAll('.tilt-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect   = card.getBoundingClientRect();
      var cx     = rect.left + rect.width / 2;
      var cy     = rect.top  + rect.height / 2;
      var dx     = (e.clientX - cx) / (rect.width  / 2);
      var dy     = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = 'perspective(800px) rotateY(' + (dx * 4) + 'deg) rotateX(' + (-dy * 4) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  /* ── BG CANVAS subtle particle dots ── */
  var canvas = document.getElementById('bg-canvas');
  if (canvas && canvas.getContext) {
    var ctx    = canvas.getContext('2d');
    var W, H, dots = [];
    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    for (var i = 0; i < 60; i++) {
      dots.push({ x: Math.random() * 2000, y: Math.random() * 1200, r: Math.random() * 1.5 + 0.5, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3 });
    }
    function drawBG() {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(function (d) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = W;
        if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H;
        if (d.y > H) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212,144,26,0.5)';
        ctx.fill();
      });
      requestAnimationFrame(drawBG);
    }
    drawBG();
  }

  /* ── REVEAL — always on ── */
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(function (el) {
    el.style.opacity    = '1';
    el.style.transform  = 'none';
    el.style.visibility = 'visible';
  });

})();
