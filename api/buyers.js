// Server-rendered buyer pages, built from live buy leads and the product taxonomy:
//   /buyers                               all categories
//   /buyers/<category>                    e.g. /buyers/agriculture
//   /buyers/<category>/<sub-category>     e.g. /buyers/apparel-fashion/men-clothing
//   /buyers/<product>                     e.g. /buyers/mens-t-shirts
// Buyer contact details are never sent; the page links to the lead search to buy them.
const fs = require('fs');
const path = require('path');
const { rpc, esc, SITE } = require('./_supabase');

let TEMPLATE = null;
async function template(host) {
  if (TEMPLATE) return TEMPLATE;
  try { TEMPLATE = fs.readFileSync(path.join(process.cwd(), 'buyers-template.html'), 'utf8'); }
  catch (e) { const r = await fetch(`https://${host}/buyers-template`); TEMPLATE = await r.text(); }
  return TEMPLATE;
}

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmt = d => { const x = d && new Date(d); return x && !isNaN(x) ? `${x.getUTCDate()} ${MON[x.getUTCMonth()]} ${x.getUTCFullYear()}` : ''; };
const n = x => Number(x || 0).toLocaleString('en-IN');
const url = p => `${SITE}/buyers${p ? '/' + p : ''}`;
// "Mumbai, Maharashtra" -> "Mumbai", so a list of places reads cleanly in a sentence.
const listPlaces = (a, k) => { const x = [...new Set((a || []).map(p => String(p).split(',')[0].trim()))].slice(0, k); return x.length > 1 ? `${x.slice(0, -1).join(', ')} and ${x[x.length - 1]}` : (x[0] || ''); };

function head(t, { title, desc, canonical, index, ld }) {
  const tags = `<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="${index ? 'index, follow' : 'noindex, follow'}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="BuyGenix Solutions">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${SITE}/assets/og-default.jpg">
${ld.map(x => `<script type="application/ld+json">${JSON.stringify(x).replace(/</g, '\\u003c')}</script>`).join('\n')}`;
  return t.replace(/<title>[\s\S]*?<\/title>/, '').replace(/<meta name="description"[^>]*>/, '')
    .replace(/<meta name="robots"[^>]*>/, '').replace(/<link rel="canonical"[^>]*>/, '').replace('</head>', tags + '\n</head>');
}
const crumbsLd = items => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url })) });

function crumbsHtml(items) {
  return `<nav class="bx-crumbs" aria-label="Breadcrumb">${items.map((c, i) => i < items.length - 1 ? `<a href="${esc(c.url.replace(SITE, ''))}">${esc(c.name)}</a>` : `<span>${esc(c.name)}</span>`).join('<i>/</i>')}</nav>`;
}

const ICON = {
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  box: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>',
  cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
};
// A steady colour per name, so the same product or category always gets the same badge.
const HUES = [217, 152, 28, 262, 340, 190, 45, 5];
const hue = t => HUES[[...String(t)].reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length];
const badge = t => `<span class="bx-ico" style="--h:${hue(t)}">${esc(String(t).trim().charAt(0).toUpperCase())}</span>`;

function hero({ crumbs, title, intro, q, chips }) {
  return `<section class="bx-hero">
    ${crumbsHtml(crumbs)}
    <h1>${title}</h1>
    <p>${intro}</p>
    <form class="bx-find" action="/buy-lead-search" method="get" role="search">${ICON.search}<input name="q" value="${esc(q || '')}" placeholder="Search buyer requirements, e.g. basmati rice" aria-label="Search buyer requirements"><button type="submit">Search leads</button></form>
    ${chips && chips.length ? `<div class="bx-from"><span>Buyers from</span>${chips.map(p => `<em>${esc(p)}</em>`).join('')}</div>` : ''}
  </section>`;
}

function ctaHtml(name, side) {
  const q = encodeURIComponent(name);
  return `<div class="bx-cta${side ? ' bx-cta-side' : ''}">
    <div class="bx-cta-box sell"><b>Do you supply ${esc(name)}?</b><span>Unlock each buyer's name, mobile and email with a BuyGenix membership, and get your company listed for buyers.</span>
      <div class="row"><a class="dr-btn pri" href="/buy-lead-search?q=${q}">Contact these buyers</a><a class="dr-btn out" href="/membership">View plans</a></div></div>
    <div class="bx-cta-box buy"><b>Looking to buy ${esc(name)}?</b><span>Post your requirement free. Our team connects you with suitable Indian suppliers.</span>
      <div class="row"><a class="dr-btn pri" href="/?product=${q}#post-requirement">Post requirement</a><a class="dr-btn out" href="/search?type=products&amp;q=${q}">Browse suppliers</a></div></div>
  </div>`;
}

function indexPage(dir) {
  const cats = dir.filter(c => c.leads > 0).sort((a, b) => b.leads - a.leads).concat(dir.filter(c => !c.leads));
  const crumbs = [{ name: 'Home', url: SITE + '/' }, { name: 'Buyers & Importers', url: url('') }];
  const body = `${hero({ crumbs, title: 'Buyers &amp; Importers by Category',
    intro: 'Live buyer requirements from importers, wholesalers and bulk buyers in India and abroad. Pick a category to see what buyers want, how much, and where.' })}
  <div class="bx-cats">${cats.map(c => `
    <section class="bx-cat">
      <a class="bx-cat-hd" href="/buyers/${esc(c.slug)}">${badge(c.name)}<span><b>${esc(c.name)}</b><small>Buyers &amp; importers</small></span></a>
      <ul>${(c.subs || []).filter(s => s.leads > 0).slice(0, 6).map(s => `<li><a href="/buyers/${esc(c.slug)}/${esc(s.slug)}">${esc(s.name)}</a></li>`).join('') || '<li class="bx-muted">New requirements coming soon</li>'}</ul>
      <a class="bx-more" href="/buyers/${esc(c.slug)}">View all ${esc(c.name)} buyers &rarr;</a></section>`).join('')}</div>
  ${ctaHtml('products')}`;
  return {
    title: 'Buyers & Importers by Category | Buy Leads | BuyGenix',
    desc: 'Buyer requirements from importers and bulk buyers in India and abroad, across agriculture, apparel, food, handicrafts, packaging and more.',
    canonical: url(''), index: true, body, ld: [crumbsLd(crumbs)],
  };
}

function leadCard(l) {
  return `<article class="bx-lead">
    <div class="bx-lead-hd">${badge(l.product)}<div><h3>${esc(l.product)}</h3>${l.place ? `<span class="bx-loc">${ICON.pin}${esc(l.place)}</span>` : ''}</div></div>
    <dl class="bx-facts"><div><dt>${ICON.box}Quantity</dt><dd>${esc(l.quantity || 'On request')}</dd></div><div><dt>${ICON.cal}Posted</dt><dd>${fmt(l.date)}</dd></div></dl>
    <div class="bx-lock">${ICON.lock}<span>Name, mobile &amp; email unlock after purchase</span></div>
    <a class="dr-btn pri" href="/buy-lead-search?q=${encodeURIComponent(l.product)}">Contact buyer</a>
  </article>`;
}

function page(d) {
  const lvl = d.level, st = d.stats || {}, leads = d.leads || [], total = Number(st.leads || 0);
  const crumbs = [{ name: 'Home', url: SITE + '/' }, { name: 'Buyers', url: url('') }].concat((d.crumbs || []).map(c => ({ name: c.name, url: url(c.path) })));
  const places = st.places || [];
  const noun = d.name;
  const intro = total
    ? `Buyer requirements for ${esc(noun)} on BuyGenix${places.length ? `, from buyers in ${esc(listPlaces(places, 6))}` : ''}. See what they need and how much, then contact them directly.`
    : `No open buyer requirements for ${esc(noun)} right now. New requirements are added regularly; post yours or check related products below.`;
  const kids = d.children || [], rel = d.related || [], sup = d.suppliers || [];
  const childTitle = lvl === 'category' ? `Browse ${d.name} by sub-category` : `Browse ${d.name} products`;
  const pills = (arr, title) => arr.length ? `<section class="bx-sec"><h2>${esc(title)}</h2><div class="bx-pills">${arr.map(x => `<a href="/buyers/${esc(x.path)}"${x.leads ? '' : ' class="nil"'}>${esc(x.name)}</a>`).join('')}</div></section>` : '';
  const supHtml = sup.length ? `<section class="bx-sec"><h2>${esc(noun)} suppliers</h2><div class="bx-sups">${sup.slice(0, 8).map(s => `<a class="bx-sup" href="/company/${esc(s.slug)}">${s.logo_url ? `<img src="${esc(s.logo_url)}" alt="" loading="lazy">` : badge(s.company_name)}<span><b>${esc(s.company_name)}</b><small>${esc([s.city, s.state].filter(Boolean).join(', '))}${s.business_type ? ' · ' + esc(s.business_type) : ''}</small>${s.paid ? '<em>Verified member</em>' : ''}</span></a>`).join('')}</div></section>` : '';
  const body = `${hero({ crumbs, title: `${esc(d.name)} Buyers &amp; Importers`, intro, q: d.name,
    chips: places.slice(0, 8) })}
  ${pills(kids.filter(k => k.leads > 0).concat(kids.filter(k => !k.leads)).slice(0, 40), childTitle)}
  <div class="bx-grid">
    <div>
      ${leads.length ? `<h2 class="bx-h2">Latest ${esc(noun)} buyer requirements</h2><div class="bx-leads">${leads.map(leadCard).join('')}</div>${total > leads.length ? `<div class="bx-all"><a class="dr-btn out" href="/buy-lead-search?q=${encodeURIComponent(d.name)}">See all ${esc(noun)} buy leads &rarr;</a></div>` : ''}` : `<div class="dr-card dr-empty"><h3>No open requirements right now</h3><p>${intro}</p></div>`}
      ${pills(rel.filter(k => k.leads > 0).slice(0, 20), 'Related products')}
    </div>
    <aside class="bx-side">${supHtml}${ctaHtml(d.name, true)}</aside>
  </div>`;
  const index = total >= 3 || (lvl === 'product' && sup.length > 0);
  const desc = total
    ? `Buyer requirements for ${d.name}${places.length ? ` from ${listPlaces(places, 4)}` : ''}. See quantities and buyer locations, and contact ${d.name} buyers and importers on BuyGenix.`
    : `Find ${d.name} buyers and importers on BuyGenix. Post your requirement or list your company to get buyer inquiries.`;
  const ld = [crumbsLd(crumbs)];
  if (leads.length) ld.push({ '@context': 'https://schema.org', '@type': 'ItemList', name: `${d.name} buyer requirements`,
    itemListElement: leads.slice(0, 20).map((l, i) => ({ '@type': 'ListItem', position: i + 1, name: `${l.product}${l.quantity ? ' – ' + l.quantity : ''}${l.place ? ' – ' + l.place : ''}` })) });
  return { title: `${d.name} Buyers & Importers | Buy Leads | BuyGenix`, desc: desc.slice(0, 158), canonical: url(d.path), index, body, ld };
}

module.exports = async (req, res) => {
  const p = String((req.query && req.query.path) || '').toLowerCase().replace(/[^a-z0-9/-]/g, '').replace(/^\/+|\/+$/g, '').slice(0, 160);
  const host = req.headers.host || 'www.buygenixsolutions.com';
  let t = await template(host), view = null;
  try {
    if (!p) view = indexPage(await rpc('buyer_directory', {}));
    else { const d = await rpc('buyer_page', { p_path: p }); if (d) view = page(d); }
  } catch (e) { view = null; }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (!view) {
    res.statusCode = 404; res.setHeader('Cache-Control', 'public, s-maxage=60');
    return res.end(head(t, { title: 'Page not found | BuyGenix', desc: 'This buyer page is not available.', canonical: url(''), index: false, ld: [] })
      .replace(/<div id="bxRoot">[\s\S]*?<\/div><\/main>/, `<div id="bxRoot"><div class="dr-card dr-empty"><h3>This buyer page is not available</h3><p>Browse all buyer categories instead.</p><div class="row"><a class="dr-btn pri" href="/buyers">All buyer categories</a></div></div></div></main>`));
  }
  res.statusCode = 200;
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=86400');
  res.end(head(t, view).replace(/<div id="bxRoot">[\s\S]*?<\/div><\/main>/, `<div id="bxRoot">${view.body}</div></main>`));
};
