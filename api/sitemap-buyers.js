// /sitemap-buyers.xml: every buyer page with enough live leads (or a supplier),
// so new categories and products get indexed as leads come in.
const { rpc, esc, SITE } = require('./_supabase');

module.exports = async (req, res) => {
  let rows = [];
  try { rows = await rpc('list_buyer_pages', {}); } catch (e) { rows = []; }
  const urls = [{ path: '', latest: new Date().toISOString() }].concat(rows).map(r => `  <url>
    <loc>${esc(`${SITE}/buyers${r.path ? '/' + r.path : ''}`)}</loc>
    <lastmod>${String(r.latest || '').slice(0, 10)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${r.path ? (r.path.includes('/') ? '0.6' : '0.7') : '0.8'}</priority>
  </url>`).join('\n');
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
};
