// Tells Bing (and other IndexNow engines such as Yandex) about new or changed pages.
// ChatGPT search and Copilot rely on Bing's index, so this speeds up AI visibility too.
// Usage: node scripts/indexnow.js            -> every URL in the three sitemaps
//        node scripts/indexnow.js /path ...  -> just these paths
const fs = require('fs');
const path = require('path');
const SITE = 'https://www.buygenixsolutions.com';
const keyFile = fs.readdirSync(path.join(__dirname, '..')).find(f => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error('IndexNow key file missing in the site root');
const key = keyFile.slice(0, 32);

async function sitemapUrls() {
  const out = [];
  for (const s of ['sitemap.xml', 'sitemap-companies.xml', 'sitemap-buyers.xml']) {
    const xml = await (await fetch(`${SITE}/${s}`)).text();
    out.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(/&amp;/g, '&')));
  }
  return [...new Set(out)];
}

(async () => {
  const args = process.argv.slice(2);
  const urls = args.length ? args.map(p => SITE + (p.startsWith('/') ? p : '/' + p)) : await sitemapUrls();
  for (let i = 0; i < urls.length; i += 10000) {
    const r = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: 'www.buygenixsolutions.com', key, keyLocation: `${SITE}/${keyFile}`, urlList: urls.slice(i, i + 10000) }),
    });
    console.log(`IndexNow: ${Math.min(urls.length - i, 10000)} URLs -> HTTP ${r.status}`);
  }
})();
