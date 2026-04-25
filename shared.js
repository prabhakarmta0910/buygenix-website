/* shared.js v3 — light theme background + nav helpers */

function initBgCanvas(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, t = 0;
  const nodes = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Create floating nodes
  for (let i = 0; i < 18; i++) {
    nodes.push({
      x: Math.random() * 1400,
      y: Math.random() * 900,
      r: 60 + Math.random() * 120,
      hue: Math.random() > 0.5 ? 210 : 270, // blue or purple
      speed: 0.0003 + Math.random() * 0.0004,
      phase: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 0.15,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(21,101,192,0.04)';
    ctx.lineWidth = 1;
    const gs = 80;
    for (let x = 0; x < W; x += gs) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += gs) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Floating gradient orbs
    nodes.forEach(n => {
      const nx = (n.x + n.drift * t) % W;
      const ny = n.y + Math.sin(t * n.speed * 1000 + n.phase) * 40;
      const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.r);
      grad.addColorStop(0, `hsla(${n.hue},80%,62%,0.12)`);
      grad.addColorStop(1, `hsla(${n.hue},80%,62%,0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(nx, ny, n.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Connecting lines between close nodes
    ctx.strokeStyle = 'rgba(21,101,192,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 220) {
          ctx.globalAlpha = (1 - dist / 220) * 0.3;
          ctx.beginPath();
          ctx.moveTo((nodes[i].x + nodes[i].drift * t) % W, nodes[i].y);
          ctx.lineTo((nodes[j].x + nodes[j].drift * t) % W, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    t += 0.5;
    requestAnimationFrame(draw);
  }
  draw();
}

function initNav() {
  // Active link
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === current) a.classList.add('active');
  });
  // Scroll effect
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
  });
}

// 3D card tilt on mouse move
function init3DTilt() {
  document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 12;
      el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-4px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

// Scroll reveal
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    obs.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const bgId = document.getElementById('bg-mini') ? 'bg-mini' :
               document.getElementById('bg-canvas') ? 'bg-canvas' : null;
  if (bgId) initBgCanvas(bgId);
  initNav();
  init3DTilt();
  initReveal();
});
