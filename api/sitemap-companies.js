// /sitemap-companies.xml: every public supplier page, so new members get indexed
// without anyone editing sitemap.xml by hand.
const { rpc, esc, SITE } = require('./_supabase');

module.exports = async (req, res) => {
  let rows = [];
  try { rows = await rpc('list_public_companies', {}); } catch (e) { rows = []; }
  const urls = rows.map(r => `  <url>
    <loc>${esc(`${SITE}/company/${encodeURIComponent(r.slug)}`)}</loc>
    <lastmod>${String(r.updated_at || '').slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.end(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
};
