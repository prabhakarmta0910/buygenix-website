/* ═══════════════════════════════════════════════════════════
   BuyGenix Solutions — Shared JS v4.0
   Handles: Navbar, Scroll Reveal, Counters, Canvas BG,
            Supabase config, Toast, Auth helpers
═══════════════════════════════════════════════════════════ */

const BGX_SUPABASE_URL  = 'https://qzaeshegpdoknsiuvidr.supabase.co';
const BGX_SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6YWVzaGVncGRva25zaXV2aWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NjIzMzcsImV4cCI6MjA5MzQzODMzN30.3TOujIaRbZPkvL_hewvJEONcOwApOIRQA5EjTdihW-s';

/* ── Supabase client ── */
function getSB() {
  if (window._bgxSB) return window._bgxSB;
  if (window.supabase && window.supabase.createClient) {
    window._bgxSB = window.supabase.createClient(BGX_SUPABASE_URL, BGX_SUPABASE_ANON);
  }
  return window._bgxSB || null;
}

/* ── NAVBAR ── */
(function() {
  const nb = document.querySelector('.navbar');
  if (!nb) return;

  /* Scroll class + hide/show on scroll direction */
  nb.style.transition = 'background 0.3s, box-shadow 0.3s, transform 0.35s ease';
  let lastScrollY = window.pageYOffset;

  window.addEventListener('scroll', function() {
    const y = window.pageYOffset;
    nb.classList.toggle('scrolled', y > 20);
    if (y > lastScrollY && y > 100) {
      nb.style.transform = 'translateY(-100%)';
    } else if (y < lastScrollY) {
      nb.style.transform = 'translateY(0)';
    }
    lastScrollY = y <= 0 ? 0 : y;
  }, { passive: true });

  /* Active link — match current filename */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('?')[0];
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* Burger */
  const burger  = document.getElementById('navBurger');
  const mobileN = document.getElementById('mobileNav');
  if (burger && mobileN) {
    burger.addEventListener('click', () => {
      const open = mobileN.classList.toggle('open');
      burger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileN.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileN.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* Search dropdown */
  const dropBtn  = document.getElementById('navSearchDrop');
  const dropMenu = document.getElementById('navSearchMenu');
  const dropLabel= document.getElementById('navSearchLabel');
  if (dropBtn && dropMenu) {
    dropBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      dropMenu.classList.toggle('open');
    });
    dropMenu.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function(e) {
        e.preventDefault();
        dropMenu.querySelectorAll('a').forEach(function(x){ x.classList.remove('active'); });
        a.classList.add('active');
        dropLabel.textContent = a.getAttribute('data-val');
        dropMenu.classList.remove('open');
      });
    });
    document.addEventListener('click', function() {
      dropMenu.classList.remove('open');
    });
  }
})();

/* ── SCROLL REVEAL ── */
(function() {
  const all = document.querySelectorAll('.reveal, .reveal-stagger');
  if (!all.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  all.forEach(el => io.observe(el));
})();

/* ── COUNTERS ── */
function animCounter(el, target, dur) {
  dur = dur || 2000;
  const suf = el.dataset.suffix || '';
  const pre = el.dataset.prefix || '';
  const dec = parseInt(el.dataset.decimals || 0);
  let start = null;
  (function step(ts) {
    if (!start) start = ts;
    const prog = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    el.textContent = pre + (dec ? (target * ease).toFixed(dec) : Math.floor(target * ease)) + suf;
    if (prog < 1) requestAnimationFrame(step);
  })(performance.now());
}
(function() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = '1';
        animCounter(e.target, parseFloat(e.target.dataset.count));
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  els.forEach(c => io.observe(c));
})();

/* ── PARTICLE CANVAS ── */
(function() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  for (let i = 0; i < 55; i++) {
    pts.push({ x: Math.random()*1920, y: Math.random()*1080, dx: (Math.random()-.5)*.35, dy: (Math.random()-.5)*.35, r: Math.random()*1.8+.4, a: Math.random()*.5+.1 });
  }
  (function draw() {
    ctx.clearRect(0,0,W,H);
    pts.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x<0) p.x=W; if (p.x>W) p.x=0;
      if (p.y<0) p.y=H; if (p.y>H) p.y=0;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(30,95,168,${p.a})`; ctx.fill();
    });
    for (let i=0;i<pts.length;i++) for (let j=i+1;j<pts.length;j++) {
      const d = Math.hypot(pts[i].x-pts[j].x, pts[i].y-pts[j].y);
      if (d<130) {
        ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
        ctx.strokeStyle = `rgba(30,95,168,${.1*(1-d/130)})`; ctx.lineWidth=.5; ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  })();
})();

/* ── TOAST ── */
window.BGX_Toast = function(msg, type, dur) {
  type = type || 'info'; dur = dur || 3500;
  const t = document.createElement('div');
  const colors = { success:'#10B981', error:'#EF4444', info:'#1E5FA8', warning:'#F59E0B' };
  t.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);background:${colors[type]||colors.info};color:white;padding:12px 24px;border-radius:10px;font-size:13.5px;font-weight:600;font-family:'Space Grotesk',sans-serif;z-index:9999;box-shadow:0 8px 28px rgba(0,0,0,0.18);transition:transform 0.3s,opacity 0.3s;opacity:0;max-width:90vw;text-align:center;pointer-events:none;`;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.style.transform='translateX(-50%) translateY(0)'; t.style.opacity='1'; });
  setTimeout(() => { t.style.transform='translateX(-50%) translateY(60px)'; t.style.opacity='0'; setTimeout(()=>t.remove(),350); }, dur);
};

/* ── SUPABASE SUBMIT HELPER ── */
window.BGX_Submit = async function(data, table) {
  const sb = getSB();
  if (!sb) return false;
  const { error } = await sb.from(table).insert([data]);
  return !error;
};

/* ── AUTH ── */
window.BGX_Auth = {
  async session() { const sb=getSB(); if(!sb) return null; const {data}=await sb.auth.getSession(); return data.session; },
  async signOut() { const sb=getSB(); if(sb) await sb.auth.signOut(); window.location.href='login.html'; },
  async require(to) {
    to = to || 'login.html';
    const s = await this.session();
    if (!s) window.location.href = to;
    return s;
  }
};

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
