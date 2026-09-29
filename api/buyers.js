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

function indexPage(dir) {
  const total = dir.reduce((s, c) => s + Number(c.leads || 0), 0);
  const cats = dir.filter(c => c.leads > 0).concat(dir.filter(c => !c.leads));
  const body = `${crumbsHtml([{ name: 'Home', url: SITE + '/' }, { name: 'Buyers & Importers', url: url('') }])}
  <header class="bx-head"><h1>Buyers &amp; Importers by Category</h1>
    <p>${n(total)} buyer requirements from importers, wholesalers and bulk buyers in India and abroad, sorted by category. Pick a category to see what buyers want, how much, and where.</p></header>
  <div class="bx-cats">${cats.map(c => `
    <section class="dr-card bx-cat"><h2><a href="/buyers/${esc(c.slug)}">${esc(c.name)} buyers</a> <span>${n(c.leads)}</span></h2>
      <ul>${(c.subs || []).filter(s => s.leads > 0).slice(0, 8).map(s => `<li><a href="/buyers/${esc(c.slug)}/${esc(s.slug)}">${esc(s.name)}</a> <span>${n(s.leads)}</span></li>`).join('') || '<li class="bx-muted">New requirements coming soon</li>'}</ul>
      <a class="bx-more" href="/buyers/${esc(c.slug)}">All ${esc(c.name)} buyers &rarr;</a></section>`).join('')}</div>
  ${ctaHtml('products')}`;
  return {
    title: 'Buyers & Importers by Category | Buy Leads | BuyGenix',
    desc: `${n(total)} buyer requirements from importers and bulk buyers in India and abroad, across agriculture, apparel, food, handicrafts, packaging and more.`,
    canonical: url(''), index: true, body,
    ld: [crumbsLd([{ name: 'Home', url: SITE + '/' }, { name: 'Buyers & Importers', url: url('') }])],
  };
}

function ctaHtml(name) {
  const q = encodeURIComponent(name);
  return `<div class="bx-cta">
    <div class="dr-card bx-cta-box"><b>Do you supply ${esc(name)}?</b><span>See every buyer's full name, mobile and email with a BuyGenix membership, and get listed as a supplier.</span>
      <div class="row"><a class="dr-btn pri" href="/buy-lead-search?q=${q}">Contact these buyers</a><a class="dr-btn out" href="/membership">View plans</a></div></div>
    <div class="dr-card bx-cta-box"><b>Looking to buy ${esc(name)}?</b><span>Post your requirement free and our team connects you with suitable Indian suppliers.</span>
      <div class="row"><a class="dr-btn pri" href="/?product=${q}#post-requirement">Post your requirement</a><a class="dr-btn out" href="/search?type=products&amp;q=${q}">Browse suppliers</a></div></div>
  </div>`;
}

function page(d) {
  const lvl = d.level, st = d.stats || {}, leads = d.leads || [], total = Number(st.leads || 0);
  const items = [{ name: 'Home', url: SITE + '/' }, { name: 'Buyers', url: url('') }].concat((d.crumbs || []).map(c => ({ name: c.name, url: url(c.path) })));
  const places = (st.places || []);
  const noun = lvl === 'product' ? d.name : `${d.name}`;
  const intro = total
    ? `${n(total)} buyer requirement${total > 1 ? 's' : ''} for ${esc(noun)} on BuyGenix${places.length ? `, from buyers in ${esc(listPlaces(places, 6))}` : ''}. Latest requirement posted on ${fmt(st.latest)}.`
    : `No open buyer requirements for ${esc(noun)} right now. New requirements are added regularly; post yours or check related products below.`;
  const leadRows = leads.map(l => `<article class="dr-card bx-lead">
      <div><h3>${esc(l.product)}</h3><div class="bx-meta">${l.quantity ? `<span><b>Quantity:</b> ${esc(l.quantity)}</span>` : ''}${l.place ? `<span><b>Buyer location:</b> ${esc(l.place)}</span>` : ''}<span><b>Posted:</b> ${fmt(l.date)}</span></div></div>
      <a class="dr-btn pri" href="/buy-lead-search?q=${encodeURIComponent(l.product)}">Contact buyer</a></article>`).join('');
  const kids = (d.children || []), rel = (d.related || []), sup = (d.suppliers || []);
  const childTitle = lvl === 'category' ? `${d.name} sub-categories` : `${d.name} products`;
  const linkList = (arr, title) => arr.length ? `<section class="dr-card cp-sec"><h2>${esc(title)}</h2><ul class="bx-links">${arr.map(x => `<li><a href="/buyers/${esc(x.path)}">${esc(x.name)}</a>${x.leads ? ` <span>${n(x.leads)}</span>` : ''}</li>`).join('')}</ul></section>` : '';
  const supHtml = sup.length ? `<section class="dr-card cp-sec"><h2>${esc(noun)} suppliers on BuyGenix</h2><div class="bx-sups">${sup.slice(0, 12).map(s => `<a class="bx-sup" href="/company/${esc(s.slug)}"><b>${esc(s.company_name)}</b><span>${esc([s.city, s.state].filter(Boolean).join(', '))}${s.business_type ? ' · ' + esc(s.business_type) : ''}</span>${s.paid ? '<em>Verified member</em>' : ''}</a>`).join('')}</div></section>` : '';
  const body = `${crumbsHtml(items)}
  <header class="bx-head"><h1>${esc(d.name)} Buyers &amp; Importers</h1><p>${intro}</p>
    ${places.length ? `<div class="dr-chips">${places.slice(0, 10).map(p => `<span>${esc(p)}</span>`).join('')}</div>` : ''}</header>
  <div class="cp-grid">
    <div>
      ${leads.length ? `<h2 class="bx-h2">Latest ${esc(noun)} buyer requirements</h2>${leadRows}${total > leads.length ? `<p class="bx-muted">Showing the latest ${leads.length} of ${n(total)}. <a href="/buy-lead-search?q=${encodeURIComponent(d.name)}">See all ${esc(noun)} buy leads</a></p>` : ''}` : `<div class="dr-card dr-empty"><h3>No open requirements right now</h3><p>${intro}</p></div>`}
      ${linkList(kids.filter(k => k.leads > 0).concat(kids.filter(k => !k.leads)).slice(0, 40), childTitle)}
      ${linkList(rel.filter(k => k.leads > 0).slice(0, 20), 'Related products')}
    </div>
    <aside class="cp-side">${supHtml}${ctaHtml(d.name).replace('<div class="bx-cta">', '<div class="bx-cta bx-cta-side">')}</aside>
  </div>`;
  const index = total >= 3 || (lvl === 'product' && sup.length > 0);
  const desc = total
    ? `${n(total)} buyer requirements for ${d.name}${places.length ? ` from ${listPlaces(places, 4)}` : ''}. See quantities and buyer locations, and contact ${d.name} buyers and importers on BuyGenix.`
    : `Find ${d.name} buyers and importers on BuyGenix. Post your requirement or list your company to get buyer inquiries.`;
  const ld = [crumbsLd(items)];
  if (leads.length) ld.push({ '@context': 'https://schema.org', '@type': 'ItemList', name: `${d.name} buyer requirements`, numberOfItems: total,
    itemListElement: leads.slice(0, 20).map((l, i) => ({ '@type': 'ListItem', position: i + 1, name: `${l.product}${l.quantity ? ' – ' + l.quantity : ''}${l.place ? ' – ' + l.place : ''}` })) });
  return { title: `${d.name} Buyers & Importers${total ? ` | ${n(total)} Buy Leads` : ''} | BuyGenix`, desc: desc.slice(0, 158), canonical: url(d.path), index, body, ld };
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
