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
  /* works for /about, about.html and / alike */
  const pageKey = s => (s.split('?')[0].split('#')[0].split('/').pop().replace(/\.html$/, '') || 'index');
  const path = pageKey(window.location.pathname);
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href && !href.startsWith('http') && pageKey(href) === path) a.classList.add('active');
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
        const inp = document.getElementById('navSearchInput');
        if (inp) inp.placeholder = { 'Companies': 'Search suppliers...', 'Buy & Leads': 'Search buy leads...' }[a.getAttribute('data-val')] || 'Search Product...';
      });
    });
    document.addEventListener('click', function() {
      dropMenu.classList.remove('open');
    });
  }

  /* ── Search button — was previously decorative (no click
     behavior at all). This only ADDS behavior to the existing
     button; nothing about its appearance, position, or markup
     changes. When "Buy & Leads" is the selected category, it
     routes to the new Buy Lead Search results page. The other two
     categories (Products/Services, Companies) are left exactly as
     they were — no new behavior added for those, since only Buy
     Lead Search was requested. */
  function wireSearchSubmit(inputId, labelId, dropdownEl) {
    const input = document.getElementById(inputId);
    const label = document.getElementById(labelId);
    if (!input || !dropdownEl) return;
    const btn = dropdownEl.querySelector('.nav-search-btn');
    function submit() {
      const category = label ? label.textContent.trim() : '';
      const term = input.value.trim();
      const q = term ? '&q=' + encodeURIComponent(term) : '';
      if (category === 'Buy & Leads') {
        window.location.href = '/buy-lead-search' + (term ? '?q=' + encodeURIComponent(term) : '');
      } else if (category === 'Companies') {
        window.location.href = '/search?type=companies' + q;
      } else {
        window.location.href = '/search?type=products' + q;
      }
    }
    if (btn) btn.addEventListener('click', submit);
    input.addEventListener('keydown', function(e) { if (e.key === 'Enter') submit(); });
  }
  wireSearchSubmit('navSearchInput', 'navSearchLabel', dropMenu ? dropMenu.closest('.nav-search') : document.querySelector('.nav-search'));
  const dropMenu2 = document.getElementById('navSearchMenu2');
  if (dropMenu2) wireSearchSubmit('navSearchInput2', 'navSearchLabel2', dropMenu2.closest('.nav-search'));
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
  async signOut() { const sb=getSB(); if(sb) await sb.auth.signOut(); window.location.href='/login'; },
  async require(to) {
    to = to || '/login';
    const s = await this.session();
    if (!s) window.location.href = to;
    return s;
  }
};

/* ── SIGNED-IN MEMBER: header shows the member and links to the dashboard ── */
(function() {
  let session = null, member = {};
  try {
    const raw = localStorage.getItem('sb-' + BGX_SUPABASE_URL.split('//')[1].split('.')[0] + '-auth-token');
    session = raw ? JSON.parse(raw) : null;
    member = JSON.parse(localStorage.getItem('bgx_member') || '{}') || {};
  } catch (e) { return; }
  if (!session || !session.refresh_token || !session.user) {
    try { localStorage.removeItem('bgx_member'); } catch (e) {}
    return;
  }
  const email = session.user.email || '';
  const name = member.name || (session.user.user_metadata || {}).full_name || email.split('@')[0] || 'Member';
  const first = name.split(/\s+/)[0];
  const initials = member.initials || name.split(/\s+/).map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const esc = v => String(v || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const css = document.createElement('style');
  css.textContent = `
.navbar.is-member{box-shadow:inset 0 -2px 0 #F0C84A;}
.nav-me{display:inline-flex !important;align-items:center;gap:8px;margin-left:6px !important;padding:4px 14px 4px 4px !important;border-radius:100px !important;background:rgba(240,200,74,.14) !important;border:1px solid rgba(240,200,74,.55) !important;color:#fff !important;font-weight:600 !important;}
.nav-me:hover{background:rgba(240,200,74,.24) !important;}
.nav-me::after{display:none !important;}
.nav-av{width:28px;height:28px;border-radius:50%;background:#F0C84A;color:#0B1929;display:inline-flex;align-items:center;justify-content:center;font-size:11.5px;font-weight:700;letter-spacing:.3px;flex-shrink:0;}
.nav-me small{display:block;font-size:10.5px;font-weight:500;color:rgba(255,255,255,.7);line-height:1.1;}
.nav-me b{display:block;font-weight:600;line-height:1.2;}
.nav-me-m{display:none;margin-left:auto;margin-right:10px;text-decoration:none;}
.m-me{display:flex;align-items:center;gap:12px;padding:14px 16px;margin-bottom:10px;border-radius:12px;background:rgba(240,200,74,.12);border:1px solid rgba(240,200,74,.4);color:#fff;font-size:13px;line-height:1.35;}
.m-me b{display:block;font-size:14.5px;}
.bgx-welcome{position:fixed;left:20px;bottom:24px;z-index:950;display:flex;align-items:center;gap:12px;max-width:calc(100vw - 110px);background:#0B1929;color:#fff;border:1px solid rgba(240,200,74,.5);border-radius:14px;padding:12px 14px;box-shadow:0 12px 30px rgba(11,25,41,.3);font-size:13.5px;line-height:1.4;transition:opacity .3s,transform .3s;}
.bgx-welcome.hide{opacity:0;transform:translateY(12px);pointer-events:none;}
.bgx-welcome a{color:#F0C84A;font-weight:600;text-decoration:none;white-space:nowrap;}
.bgx-welcome button{background:none;border:none;color:rgba(255,255,255,.6);font-size:18px;cursor:pointer;padding:0 2px;line-height:1;}
@media(max-width:1024px){.nav-me-m{display:inline-flex;}}`;
  document.head.appendChild(css);

  const nb = document.querySelector('.navbar');
  if (nb) nb.classList.add('is-member');

  /* desktop: "Client Login" becomes the member chip */
  document.querySelectorAll('.nav-links a[href="/login"]').forEach(a => {
    a.className = 'nav-me';
    a.href = '/client-portal';
    a.title = 'Signed in as ' + email;
    a.innerHTML = `<span class="nav-av">${esc(initials)}</span><span><small>Hi, ${esc(first)}</small><b>My Dashboard</b></span>`;
  });
  /* tablet/mobile: avatar next to the menu button */
  const burger = document.getElementById('navBurger');
  if (burger && !document.querySelector('.nav-me-m')) {
    const m = document.createElement('a');
    m.className = 'nav-me-m'; m.href = '/client-portal'; m.setAttribute('aria-label', 'My Dashboard');
    m.innerHTML = `<span class="nav-av">${esc(initials)}</span>`;
    burger.parentNode.insertBefore(m, burger);
  }
  const mob = document.getElementById('mobileNav');
  if (mob) {
    mob.querySelectorAll('a[href="/login"]').forEach(a => { a.href = '/client-portal'; a.textContent = 'My Dashboard →'; });
    const card = document.createElement('div');
    card.className = 'm-me';
    card.innerHTML = `<span class="nav-av">${esc(initials)}</span><span><b>${esc(name)}</b>${esc(member.plan ? member.plan + ' plan' : 'Signed in')}</span>`;
    mob.insertBefore(card, mob.firstChild);
  }

  /* once per visit: a short welcome with the two most useful links */
  let seen = false;
  try { seen = sessionStorage.getItem('bgx_welcomed') === '1'; sessionStorage.setItem('bgx_welcomed', '1'); } catch (e) {}
  if (!seen && !/buy-lead-search|login|portal/.test(location.pathname)) {
    const w = document.createElement('div');
    w.className = 'bgx-welcome'; w.setAttribute('role', 'status');
    w.innerHTML = `<span>Welcome back, <b>${esc(first)}</b>.</span><a href="/buy-lead-search">Buy leads</a><a href="/client-portal">Dashboard →</a><button type="button" aria-label="Close">&times;</button>`;
    document.body.appendChild(w);
    const close = () => { w.classList.add('hide'); setTimeout(() => w.remove(), 400); };
    w.querySelector('button').onclick = close;
    setTimeout(close, 8000);
  }
})();

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

/* ── ANALYTICS: key actions sent to GA4 ──
   whatsapp_click, phone_click, email_click, cta_click and search.
   Mark whatsapp_click, phone_click and generate_lead as key events in GA4. */
(function(){
  function send(name, params){ if (typeof gtag === 'function') gtag('event', name, params); }
  function where(el){
    if (el.closest('.navbar, .mobile-nav')) return 'header';
    if (el.closest('.footer')) return 'footer';
    if (el.classList.contains('wa-float')) return 'floating_button';
    return 'page';
  }
  document.addEventListener('click', function(e){
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    const label = (a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 80);
    const base = { link_url: href, link_text: label, placement: where(a) };
    if (/wa\.me|whatsapp\.com/i.test(href)) return send('whatsapp_click', base);
    if (/^tel:/i.test(href)) return send('phone_click', base);
    if (/^mailto:/i.test(href)) return send('email_click', base);
    if (/(^|\/)(membership|contact|login)(\.html)?([?#]|$)/.test(href)) {
      const target = href.replace(/^\//, '').split(/[.?#]/)[0];
      return send('cta_click', Object.assign(base, { cta_target: target }));
    }
  }, true);
  /* header search */
  document.querySelectorAll('.nav-search').forEach(function(box){
    const input = box.querySelector('.nav-search-input');
    const btn = box.querySelector('.nav-search-btn');
    const label = box.querySelector('[id^="navSearchLabel"]');
    if (!input) return;
    function track(){
      const term = input.value.trim();
      if (term) send('search', { search_term: term, search_category: label ? label.textContent.trim() : '' });
    }
    if (btn) btn.addEventListener('click', track);
    input.addEventListener('keydown', function(e){ if (e.key === 'Enter') track(); });
  });
})();
