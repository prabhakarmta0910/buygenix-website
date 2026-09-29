// Server-rendered company page: /company/<slug> (rewritten here by vercel.json).
// Search engines get the full title, description, canonical, structured data and
// company content in the first HTML response. js/directory.js then renders the
// interactive version (inquiry popup, buttons) on top of the same data.
const fs = require('fs');
const path = require('path');
const { rpc, esc, SITE } = require('./_supabase');

let TEMPLATE = null;
async function template(host) {
  if (TEMPLATE) return TEMPLATE;
  try { TEMPLATE = fs.readFileSync(path.join(process.cwd(), 'company.html'), 'utf8'); }
  catch (e) { const r = await fetch(`https://${host}/company`); TEMPLATE = await r.text(); }
  return TEMPLATE;
}

const inr = n => '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });
function price(p) {
  if (p.price == null && p.price_max == null) return 'Price on request';
  const lo = p.price != null ? inr(p.price) : '', hi = p.price_max != null && p.price_max !== p.price ? inr(p.price_max) : '';
  return (lo && hi ? `${lo} – ${hi}` : lo || hi) + (p.unit ? ` / ${p.unit}` : '');
}
const place = c => [c.city, c.state, c.country].filter(Boolean).join(', ') || 'India';

function head(t, c, url) {
  const first = (c.products[0] && c.products[0].name) || c.product_tags[0] || 'products';
  const title = `${c.company_name}, ${c.city || c.country || 'India'} | ${c.business_type || 'Supplier'} of ${first} | BuyGenix`;
  const desc = (c.tagline ? `${c.tagline}. ` : '') + (c.about || `${c.company_name} is a ${c.business_type || 'supplier'} based in ${place(c)}.`);
  const flat = desc.replace(/\s+/g, ' ').trim();
  const d = flat.length <= 158 ? flat : flat.slice(0, 157).replace(/\s+\S*$/, '') + '…';
  const img = c.logo_url || (c.products.find(p => p.image_url) || {}).image_url || `${SITE}/assets/og-default.jpg`;
  const ld = {
    '@context': 'https://schema.org', '@type': 'Organization', name: c.company_name, url, description: d,
    logo: c.logo_url || undefined, foundingDate: c.year_established ? String(c.year_established) : undefined,
    address: { '@type': 'PostalAddress', addressLocality: c.city || undefined, addressRegion: c.state || undefined, addressCountry: c.country || 'IN' },
    makesOffer: c.products.slice(0, 20).map(p => ({ '@type': 'Offer', itemOffered: { '@type': 'Product', name: p.name, image: p.image_url || undefined, category: p.category || undefined },
      priceSpecification: p.price != null ? { '@type': 'PriceSpecification', price: String(p.price), maxPrice: p.price_max != null ? String(p.price_max) : undefined, priceCurrency: 'INR' } : undefined })),
  };
  const crumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
    { '@type': 'ListItem', position: 2, name: 'Suppliers', item: `${SITE}/search?type=companies` },
    { '@type': 'ListItem', position: 3, name: c.company_name, item: url }] };
  const tags = `<title>${esc(title)}</title>
<meta name="description" content="${esc(d)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="profile">
<meta property="og:site_name" content="BuyGenix Solutions">
<meta property="og:title" content="${esc(c.company_name)} | BuyGenix">
<meta property="og:description" content="${esc(d)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(img)}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
<script type="application/ld+json">${JSON.stringify(crumbs).replace(/</g, '\\u003c')}</script>`;
  return t
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/, '')
    .replace(/<meta name="robots"[^>]*>/, '')
    .replace(/<link rel="canonical"[^>]*>/, '')
    .replace('</head>', tags + '\n</head>');
}

// Plain, crawlable version of the page; directory.js replaces it with the interactive one.
function body(c) {
  const facts = [['Business type', c.business_type], ['Established', c.year_established], ['Team size', c.employees], ['Location', place(c)]].filter(x => x[1]);
  return `<article class="dr-card cp-sec">
  <h1>${esc(c.company_name)}</h1>
  <p class="dr-loc">${esc(place(c))}${c.business_type ? ' · ' + esc(c.business_type) : ''}</p>
  ${c.tagline ? `<p class="dr-tagline">${esc(c.tagline)}</p>` : ''}
  ${c.about ? `<h2>About ${esc(c.company_name)}</h2><p class="cp-about">${esc(c.about)}</p>` : ''}
  ${c.products.length ? `<h2>Products</h2><ul>${c.products.map(p => `<li id="p-${esc(p.id)}"><strong>${esc(p.name)}</strong> · ${esc(price(p))}${p.min_order ? ` · MOQ ${esc(p.min_order)}` : ''}${p.description ? ` · ${esc(p.description)}` : ''}</li>`).join('')}</ul>` : ''}
  ${facts.length ? `<h2>Company facts</h2><ul>${facts.map(([k, v]) => `<li>${esc(k)}: ${esc(v)}</li>`).join('')}</ul>` : ''}
  ${(c.export_markets || []).length ? `<h2>Export markets</h2><p>${c.export_markets.map(esc).join(', ')}</p>` : ''}
  ${(c.certifications || []).length ? `<h2>Certifications</h2><p>${c.certifications.map(esc).join(', ')}</p>` : ''}
  <p><a href="/search?type=companies">Browse more suppliers</a> · <a href="/#post-requirement">Post your requirement</a></p>
</article>`;
}

module.exports = async (req, res) => {
  const slug = String((req.query && req.query.slug) || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 80);
  const host = req.headers.host || 'www.buygenixsolutions.com';
  let t = await template(host);
  let c = null;
  try { if (slug) c = await rpc('public_company', { p_slug: slug }); } catch (e) { c = null; }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (!c) {
    res.statusCode = 404;
    res.setHeader('Cache-Control', 'public, s-maxage=60');
    return res.end(t.replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, follow">'));
  }
  c.products = c.products || []; c.product_tags = c.product_tags || [];
  const url = `${SITE}/company/${encodeURIComponent(c.slug)}`;
  t = head(t, c, url).replace(/<div id="cpRoot">[\s\S]*?<\/div><\/main>/, `<div id="cpRoot">${body(c)}</div></main>`);
  res.statusCode = 200;
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400');
  res.end(t);
};
