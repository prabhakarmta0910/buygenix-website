/* ═══════════════════════════════════════════════════
   BuyGenix Solutions — Shared JS v2.0
   Canvas background, 3D tilt, scroll reveal, nav helpers
═══════════════════════════════════════════════════ */

/* ── LIGHT CANVAS BACKGROUND ── */
function initCanvas(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, t = 0, nodes = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    nodes = [];
    const count = Math.floor((W * H) / 18000);
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2.5 + 1,
        opacity: Math.random() * 0.4 + 0.1
      });
    }
  }

  resize();
  window.addEventListener('resize', resize);

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    // Sky gradient — very light
    const sky = ctx.createLinearGradient(0, 0, W, H);
    sky.addColorStop(0, 'rgba(232,240,252,0.6)');
    sky.addColorStop(0.5, 'rgba(220,234,250,0.4)');
    sky.addColorStop(1, 'rgba(210,228,248,0.5)');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Floating orbs
    const orbs = [
      { cx: W * 0.15, cy: H * 0.2, r: Math.min(W, H) * 0.22, c: 'rgba(180,210,240,0.18)' },
      { cx: W * 0.85, cy: H * 0.35, r: Math.min(W, H) * 0.18, c: 'rgba(200,224,248,0.14)' },
      { cx: W * 0.5 + Math.sin(t * 0.3) * 60, cy: H * 0.7, r: Math.min(W, H) * 0.25, c: 'rgba(212,160,23,0.06)' },
      { cx: W * 0.05, cy: H * 0.75, r: Math.min(W, H) * 0.15, c: 'rgba(180,210,240,0.12)' }
    ];
    orbs.forEach(o => {
      const g = ctx.createRadialGradient(o.cx, o.cy, 0, o.cx, o.cy, o.r);
      g.addColorStop(0, o.c);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(o.cx + Math.sin(t * 0.2) * 20, o.cy + Math.cos(t * 0.15) * 15, o.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Nodes
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      ctx.globalAlpha = n.opacity * (0.7 + Math.sin(t + n.x) * 0.3);
      ctx.fillStyle = 'rgba(11,25,41,0.35)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Connections
    ctx.strokeStyle = 'rgba(11,25,41,0.06)';
    ctx.lineWidth = 0.8;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.globalAlpha = (1 - dist / 130) * 0.12;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    // Gold accent lines — subtle diagonal
    ctx.save();
    ctx.globalAlpha = 0.04;
    for (let i = 0; i < 6; i++) {
      const x = (W / 5) * i + Math.sin(t * 0.1 + i) * 20;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + H * 0.5, H);
      ctx.strokeStyle = '#B8860B';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();

    t += 0.008;
    requestAnimationFrame(drawFrame);
  }
  drawFrame();
}

/* ── 3D CARD TILT ── */
function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateZ(6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
    });
  });
}

/* ── SCROLL REVEAL ── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
}

/* ── COUNTER ANIMATION ── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const isDecimal = target % 1 !== 0;
        let current = 0;
        const duration = 1600;
        const startTime = performance.now();
        function tick(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          current = target * ease;
          el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
}

/* ── NAV SCROLL EFFECT ── */
function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Active link
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === current) a.classList.add('active');
  });

  // Mobile burger
  const burger = document.querySelector('.nav-burger');
  const mobileNav = document.querySelector('.mobile-nav-overlay');
  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const spans = burger.querySelectorAll('span');
      mobileNav.classList.contains('open')
        ? (spans[0].style.transform = 'rotate(45deg) translate(5px,5px)',
           spans[1].style.opacity = '0',
           spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)')
        : (spans[0].style.transform = '', spans[1].style.opacity = '', spans[2].style.transform = '');
    });
    // Active in mobile
    document.querySelectorAll('.mobile-nav-overlay a').forEach(a => {
      if (a.getAttribute('href') === current) a.style.color = 'var(--gold)';
    });
  }
}

/* ── LOGO SVG INLINE ── */
const LOGO_SVG = `<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" style="height:44px;width:auto">
  <defs>
    <linearGradient id="bG" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#0B1929"/>
      <stop offset="55%" style="stop-color:#1B3A5C"/>
      <stop offset="100%" style="stop-color:#B8860B"/>
    </linearGradient>
    <linearGradient id="aG" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#0B1929"/>
      <stop offset="100%" style="stop-color:#B8860B"/>
    </linearGradient>
  </defs>
  <g transform="translate(95,60)">
    <path d="M 12 108 C -10 70,-10 30,20 8" fill="none" stroke="url(#aG)" stroke-width="5" stroke-linecap="round"/>
    <path d="M 20 8 L 48 0 L 36 26" fill="#B8860B"/>
    <text x="0" y="105" font-family="Arial Black,Arial,sans-serif" font-size="108" font-weight="900" fill="url(#bG)">B</text>
  </g>
  <text x="168" y="155" font-family="Arial,Helvetica,sans-serif" font-size="96" font-weight="700" fill="url(#bG)">uygenix</text>
  <text x="380" y="205" font-family="Arial,Helvetica,sans-serif" font-size="44" font-weight="400" fill="#4A6A8A" letter-spacing="1">Solutions</text>
</svg>`;

function injectLogos() {
  document.querySelectorAll('.logo-svg-wrap').forEach(el => {
    el.innerHTML = LOGO_SVG;
  });
}

/* ── FOOTER LOGO (navy version) ── */
const LOGO_SVG_WHITE = `<svg viewBox="0 0 680 280" xmlns="http://www.w3.org/2000/svg" style="height:44px;width:auto">
  <defs>
    <linearGradient id="bGW" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FFFFFF"/>
      <stop offset="100%" style="stop-color:#F0D080"/>
    </linearGradient>
    <linearGradient id="aGW" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FFFFFF"/>
      <stop offset="100%" style="stop-color:#D4A017"/>
    </linearGradient>
  </defs>
  <g transform="translate(95,60)">
    <path d="M 12 108 C -10 70,-10 30,20 8" fill="none" stroke="url(#aGW)" stroke-width="5" stroke-linecap="round"/>
    <path d="M 20 8 L 48 0 L 36 26" fill="#D4A017"/>
    <text x="0" y="105" font-family="Arial Black,Arial,sans-serif" font-size="108" font-weight="900" fill="url(#bGW)">B</text>
  </g>
  <text x="168" y="155" font-family="Arial,Helvetica,sans-serif" font-size="96" font-weight="700" fill="url(#bGW)">uygenix</text>
  <text x="380" y="205" font-family="Arial,Helvetica,sans-serif" font-size="44" font-weight="400" fill="rgba(255,255,255,0.6)" letter-spacing="1">Solutions</text>
</svg>`;

function injectFooterLogos() {
  document.querySelectorAll('.logo-svg-wrap-footer').forEach(el => {
    el.innerHTML = LOGO_SVG_WHITE;
  });
}

/* ── INIT ALL ── */
document.addEventListener('DOMContentLoaded', () => {
  initCanvas('bg-canvas');
  initNav();
  initTilt();
  initScrollReveal();
  initCounters();
  injectLogos();
  injectFooterLogos();
});
