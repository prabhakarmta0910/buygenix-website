/* ═══════════════════════════════════════════════════════════
   BuyGenix supplier directory
   - /search?type=products|companies&q=   product and company search
   - /company/<slug>                      public company page
   - inquiry popup shared by both (writes supplier_inquiries)
   Data comes from Supabase RPCs: search_products, search_companies,
   public_company, send_supplier_inquiry. Phone numbers are only
   returned for paid members; GSTIN / IEC numbers never leave the DB.
═══════════════════════════════════════════════════════════ */
(function () {
  const sb = () => getSB();
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const track = (n, p) => { if (typeof gtag === 'function') gtag('event', n, p || {}); };
  const inr = n => '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  const WA_BGX = '918796787594';

  function priceHTML(p) {
    if (p.price == null && p.price_max == null) return '<div class="dr-price req">Price on request</div>';
    const unit = p.unit ? ` <small>/ ${esc(p.unit)}</small>` : '';
    const lo = p.price != null ? inr(p.price) : '', hi = p.price_max != null && p.price_max !== p.price ? inr(p.price_max) : '';
    return `<div class="dr-price">${lo && hi ? lo + ' – ' + hi : lo || hi}${unit}</div>`;
  }
  function place(o) { return [o.city, o.state, o.country && o.country !== 'India' ? o.country : ''].filter(Boolean).join(', ') || (o.country || 'India'); }
  function logoHTML(o, cls) {
    const initial = esc((o.company_name || '?').trim().charAt(0).toUpperCase());
    return o.logo_url ? `<div class="dr-logo ${cls || ''}"><img src="${esc(o.logo_url)}" alt="${esc(o.company_name)} logo" loading="lazy"></div>` : `<div class="dr-logo ${cls || ''}">${initial}</div>`;
  }
  const TICK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  function badgesHTML(o) {
    return `<div class="dr-badges">${o.paid ? `<span class="dr-b pro">${TICK}Verified member</span>` : ''}${o.gst ? `<span class="dr-b ok">${TICK}GST</span>` : ''}${o.iec ? `<span class="dr-b ok">${TICK}IEC</span>` : ''}${o.member_years ? `<span class="dr-b">${o.member_years} yr${o.member_years > 1 ? 's' : ''} with BuyGenix</span>` : ''}</div>`;
  }
  function imgHTML(url, alt) { return url ? `<div class="dr-img"><img src="${esc(url)}" alt="${esc(alt)}" loading="lazy"></div>` : '<div class="dr-img">No photo yet</div>'; }
  function specsHTML(specs) {
    const s = (specs || []).filter(x => x && x.k && x.v);
    return s.length ? `<div class="dr-specs">${s.map(x => `<div><span>${esc(x.k)}</span><b>${esc(x.v)}</b></div>`).join('')}</div>` : '';
  }
  function contactBtns(o, product) {
    const wa = String(o.whatsapp || '').replace(/\D/g, ''), ph = String(o.phone || '').replace(/[^\d+]/g, '');
    const text = `Hello ${o.company_name}, I found you on BuyGenix and I am interested in ${product || 'your products'}.`;
    return (wa || ph) ? `<div class="row">${ph ? `<a class="dr-btn out" href="tel:${esc(ph)}" data-track="supplier_call">Call</a>` : ''}${wa ? `<a class="dr-btn wa" href="https://wa.me/${wa}?text=${encodeURIComponent(text)}" target="_blank" rel="noopener" data-track="supplier_whatsapp">WhatsApp</a>` : ''}</div>` : '';
  }
  const companyUrl = slug => '/company/' + encodeURIComponent(slug);

  /* ── inquiry popup ── */
  let iqCtx = null;
  function ensureModal() {
    if (document.getElementById('iqOv')) return;
    document.body.insertAdjacentHTML('beforeend', `
<div class="iq-ov" id="iqOv" role="dialog" aria-modal="true" aria-labelledby="iqTitle">
  <div class="iq-box">
    <div class="iq-hd"><div><h3 id="iqTitle">Send inquiry</h3><p id="iqSub"></p></div><button class="iq-x" type="button" id="iqClose" aria-label="Close">&times;</button></div>
    <form class="iq-form" id="iqForm" novalidate>
      <div class="iq-msg" id="iqMsg"></div>
      <div><label for="iqProduct">Product you need *</label><input id="iqProduct" maxlength="120" required></div>
      <div class="two"><div><label for="iqQty">Quantity</label><input id="iqQty" maxlength="60" placeholder="e.g. 5 MT, 1000 pcs"></div><div><label for="iqCountry">Your country</label><input id="iqCountry" maxlength="60" placeholder="e.g. United Kingdom"></div></div>
      <div class="two"><div><label for="iqName">Your name *</label><input id="iqName" maxlength="100" autocomplete="name" required></div><div><label for="iqPhone">Mobile / WhatsApp *</label><input id="iqPhone" type="tel" maxlength="20" autocomplete="tel" placeholder="+44 7700 900123" required></div></div>
      <div><label for="iqEmail">Email</label><input id="iqEmail" type="email" maxlength="150" autocomplete="email"></div>
      <div><label for="iqMsgTxt">Message</label><textarea id="iqMsgTxt" maxlength="1500" placeholder="Specifications, packing, delivery port, target price…"></textarea></div>
      <button class="dr-btn pri" type="submit" id="iqGo">Send inquiry</button>
      <p class="iq-note">Your details go only to this supplier and the BuyGenix team.</p>
    </form>
    <div class="iq-ok" id="iqOk"><div class="ic">✓</div><h4>Inquiry sent</h4><p id="iqOkTxt"></p><button class="dr-btn pri" type="button" id="iqDone" style="width:100%">Done</button></div>
  </div>
</div>`);
    const ov = document.getElementById('iqOv');
    const close = () => { ov.classList.remove('open'); document.body.style.overflow = ''; };
    document.getElementById('iqClose').onclick = close;
    document.getElementById('iqDone').onclick = close;
    ov.addEventListener('click', e => { if (e.target === ov) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && ov.classList.contains('open')) close(); });
    document.getElementById('iqForm').addEventListener('submit', submitInquiry);
    try { const saved = JSON.parse(localStorage.getItem('bgx_buyer') || '{}'); ['Name', 'Phone', 'Email', 'Country'].forEach(k => { if (saved[k]) document.getElementById('iq' + k).value = saved[k]; }); } catch (e) {}
  }
  function openInquiry(slug, companyName, product, productId) {
    ensureModal();
    iqCtx = { slug, productId: productId || null, companyName };
    document.getElementById('iqTitle').textContent = product ? 'Get best quote' : 'Send inquiry';
    document.getElementById('iqSub').textContent = 'To ' + companyName;
    document.getElementById('iqProduct').value = product || '';
    const m = document.getElementById('iqMsg'); m.className = 'iq-msg'; m.textContent = '';
    document.getElementById('iqForm').style.display = ''; document.getElementById('iqOk').classList.remove('show');
    document.getElementById('iqOv').classList.add('open'); document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById(product ? 'iqQty' : 'iqProduct').focus(), 40);
    track('supplier_inquiry_open', { supplier: slug, product: product || '' });
  }
  const IQ_ERR = { BAD_NAME: 'Please enter your name.', BAD_PHONE: 'Please enter a valid mobile number with country code.', BAD_EMAIL: 'Please check the email address.', BAD_PRODUCT: 'Please enter the product you need.', TOO_MANY: 'You have sent many inquiries today. Please try again tomorrow or WhatsApp us.', SUPPLIER_NOT_FOUND: 'This supplier is not available right now.' };
  async function submitInquiry(e) {
    e.preventDefault();
    const v = id => document.getElementById(id).value.trim(), m = document.getElementById('iqMsg'), btn = document.getElementById('iqGo');
    const d = { product: v('iqProduct'), qty: v('iqQty'), country: v('iqCountry'), name: v('iqName'), phone: v('iqPhone'), email: v('iqEmail'), msg: v('iqMsgTxt') };
    const err = t => { m.className = 'iq-msg err'; m.textContent = t; };
    if (d.product.length < 2) return err(IQ_ERR.BAD_PRODUCT);
    if (d.name.length < 2) return err(IQ_ERR.BAD_NAME);
    if (d.phone.replace(/\D/g, '').length < 7) return err(IQ_ERR.BAD_PHONE);
    btn.disabled = true; btn.textContent = 'Sending…';
    const { error } = await sb().rpc('send_supplier_inquiry', { p_slug: iqCtx.slug, p_product_id: iqCtx.productId, p_name: d.name, p_email: d.email, p_phone: d.phone, p_country: d.country, p_product: d.product, p_quantity: d.qty, p_message: d.msg });
    btn.disabled = false; btn.textContent = 'Send inquiry';
    if (error) { const code = Object.keys(IQ_ERR).find(k => String(error.message || '').includes(k)); return err(code ? IQ_ERR[code] : 'Could not send. Please try again.'); }
    try { localStorage.setItem('bgx_buyer', JSON.stringify({ Name: d.name, Phone: d.phone, Email: d.email, Country: d.country })); } catch (e) {}
    track('supplier_inquiry', { supplier: iqCtx.slug, product: d.product, country: d.country || '' });
    document.getElementById('iqForm').style.display = 'none';
    document.getElementById('iqOkTxt').textContent = `${iqCtx.companyName} has received your inquiry for ${d.product}. They will contact you on ${d.phone}.`;
    document.getElementById('iqOk').classList.add('show');
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-inquire]');
    if (b) { e.preventDefault(); openInquiry(b.dataset.inquire, b.dataset.company, b.dataset.product || '', b.dataset.productId || ''); return; }
    const t = e.target.closest('[data-track]');
    if (t) track(t.dataset.track, { supplier: (t.closest('[data-slug]') || {}).dataset?.slug || '' });
  });
  const inquireAttrs = (slug, company, product, id) => `data-inquire="${esc(slug)}" data-company="${esc(company)}"${product ? ` data-product="${esc(product)}"` : ''}${id ? ` data-product-id="${esc(id)}"` : ''}`;

  /* ── search page ── */
  function productCard(p) {
    return `<article class="dr-card dr-prod" data-slug="${esc(p.slug)}">
      ${imgHTML(p.image_url, p.name)}
      <div>
        <h3><a href="${companyUrl(p.slug)}#p-${esc(p.id)}">${esc(p.name)}</a></h3>
        ${priceHTML(p)}
        ${p.min_order ? `<div class="dr-moq">Minimum order: <b>${esc(p.min_order)}</b></div>` : ''}
        ${specsHTML(p.specs)}
        ${p.category ? `<div class="dr-chips"><span>${esc(p.category)}</span></div>` : ''}
      </div>
      <div class="dr-seller">
        <div class="dr-seller-top">${logoHTML(p)}<div><a href="${companyUrl(p.slug)}">${esc(p.company_name)}</a><div class="dr-loc">${esc(place(p))}${p.business_type ? ' · ' + esc(p.business_type) : ''}</div></div></div>
        ${badgesHTML(p)}
        <div class="dr-actions"><button class="dr-btn pri" type="button" ${inquireAttrs(p.slug, p.company_name, p.name, p.id)}>Get best quote</button>${contactBtns(p, p.name)}</div>
      </div>
    </article>`;
  }
  function companyCard(c) {
    const prods = (c.products || []).slice(0, 5);
    const thumbs = (c.images || []).slice(0, 3);
    return `<article class="dr-card dr-co" data-slug="${esc(c.slug)}">
      <div>
        <div class="dr-co-top">${logoHTML(c)}<div>
          <h3><a href="${companyUrl(c.slug)}">${esc(c.company_name)}</a></h3>
          <div class="dr-loc">${esc(place(c))}</div>
          ${badgesHTML(c)}
        </div></div>
        ${c.tagline ? `<p class="dr-tagline">${esc(c.tagline)}</p>` : ''}
        <div class="dr-facts">${c.business_type ? `<span>${esc(c.business_type)}</span>` : ''}${c.year_established ? `<span>Since ${esc(c.year_established)}</span>` : ''}${c.n_products ? `<span>${c.n_products} product${c.n_products > 1 ? 's' : ''} listed</span>` : ''}</div>
        ${prods.length ? `<div class="dr-chips">${prods.map(x => `<span>${esc(x)}</span>`).join('')}</div>` : ''}
      </div>
      <div class="dr-actions" style="align-content:start">
        ${thumbs.length ? `<div class="dr-thumbs">${thumbs.map(u => imgHTML(u, c.company_name)).join('')}</div>` : ''}
        <a class="dr-btn out" href="${companyUrl(c.slug)}">View company</a>
        <button class="dr-btn pri" type="button" ${inquireAttrs(c.slug, c.company_name, prods[0] || '', '')}>Send inquiry</button>
      </div>
    </article>`;
  }
  function initSearch(root) {
    const params = new URLSearchParams(location.search);
    const S = { type: params.get('type') === 'companies' ? 'companies' : 'products', q: (params.get('q') || '').trim(), rows: [], total: 0, busy: false };
    const $ = id => document.getElementById(id);
    function setUrl() { const u = new URL(location.href); u.searchParams.set('type', S.type); if (S.q) u.searchParams.set('q', S.q); else u.searchParams.delete('q'); history.replaceState({}, '', u); }
    function head() {
      const what = S.type === 'products' ? 'Products' : 'Suppliers';
      $('drTitle').textContent = S.q ? `${what} for “${S.q}”` : (S.type === 'products' ? 'Products from Indian suppliers' : 'Indian suppliers and exporters');
      $('drCount').textContent = S.total ? `${S.total.toLocaleString('en-IN')} ${S.type === 'products' ? 'product' : 'supplier'}${S.total > 1 ? 's' : ''} found` : '';
      document.querySelectorAll('.dr-tabs a').forEach(a => { a.classList.toggle('on', a.dataset.type === S.type); a.href = `/search?type=${a.dataset.type}${S.q ? '&q=' + encodeURIComponent(S.q) : ''}`; });
      const lbl = document.getElementById('navSearchLabel'), val = S.type === 'products' ? 'Products / Services' : 'Companies';
      if (lbl) { lbl.textContent = val; document.querySelectorAll('#navSearchMenu a').forEach(a => a.classList.toggle('active', a.dataset.val === val)); }
      const ni = document.getElementById('navSearchInput'); if (ni && !ni.value) ni.value = S.q;
      document.title = (S.q ? `${S.q} ${S.type === 'products' ? 'products' : 'suppliers'}` : (S.type === 'products' ? 'Products' : 'Suppliers')) + ' | BuyGenix';
    }
    function empty() {
      const q = S.q ? esc(S.q) : 'this';
      return `<div class="dr-card dr-empty"><h3>No ${S.type === 'products' ? 'products' : 'suppliers'} listed for ${S.q ? '“' + q + '”' : 'this search'} yet</h3>
        <p>Post your requirement and our team will find verified Indian suppliers for you. It is free and there is no membership needed.</p>
        <div class="row"><a class="dr-btn pri" href="/?product=${encodeURIComponent(S.q)}#post-requirement">Post your requirement</a><a class="dr-btn wa" href="https://wa.me/${WA_BGX}?text=${encodeURIComponent('Hello BuyGenix, I am looking for suppliers of ' + (S.q || 'a product') + '.')}" target="_blank" rel="noopener">WhatsApp us</a></div></div>`;
    }
    async function load(reset) {
      if (S.busy) return; S.busy = true;
      if (reset) { S.rows = []; $('drList').innerHTML = '<div class="dr-skel"></div><div class="dr-skel"></div><div class="dr-skel"></div>'; }
      $('drMore').style.display = 'none';
      const fn = S.type === 'products' ? 'search_products' : 'search_companies';
      const { data, error } = await sb().rpc(fn, { p_q: S.q || null, p_offset: S.rows.length });
      S.busy = false;
      if (error) { $('drList').innerHTML = '<div class="dr-card dr-empty"><h3>Search is unavailable</h3><p>Please try again in a moment.</p></div>'; return; }
      S.rows = S.rows.concat(data || []);
      S.total = data && data[0] ? Number(data[0].total) : (reset ? 0 : S.total);
      head();
      $('drList').innerHTML = S.rows.length ? S.rows.map(S.type === 'products' ? productCard : companyCard).join('') : empty();
      $('drMore').style.display = S.rows.length < S.total ? '' : 'none';
      if (reset) track('search', { search_term: S.q, search_category: S.type, results: S.total });
    }
    $('drForm').addEventListener('submit', e => { e.preventDefault(); S.q = $('drQ').value.trim(); setUrl(); load(true); });
    document.querySelectorAll('.dr-tabs a').forEach(a => a.addEventListener('click', e => { e.preventDefault(); S.type = a.dataset.type; setUrl(); load(true); }));
    $('drMore').addEventListener('click', () => load(false));
    $('drQ').value = S.q;
    head(); load(true);
  }

  /* ── company page ── */
  function initCompany(root) {
    const slug = decodeURIComponent((location.pathname.match(/\/company\/([^/?#]+)/) || [])[1] || new URLSearchParams(location.search).get('c') || '').toLowerCase();
    const box = document.getElementById('cpRoot');
    if (!slug) return notFound();
    (async () => {
      const { data: c, error } = await sb().rpc('public_company', { p_slug: slug });
      if (error || !c) return notFound();
      render(c);
      track('view_company', { supplier: c.slug, paid: !!c.paid });
    })();
    function notFound() {
      document.title = 'Supplier not found | BuyGenix';
      box.innerHTML = `<div class="dr-card dr-empty"><h3>This supplier page is not available</h3><p>The company may have removed its listing. Search other suppliers or post your requirement.</p><div class="row"><a class="dr-btn out" href="/search?type=companies">Browse suppliers</a><a class="dr-btn pri" href="/#post-requirement">Post your requirement</a></div></div>`;
    }
    function render(c) {
      const loc = place(c);
      const productsTitle = (c.products[0] && c.products[0].name) || (c.product_tags[0] || '');
      document.title = `${c.company_name}, ${c.city || c.country || 'India'} | ${c.business_type || 'Supplier'} of ${productsTitle || 'products'} | BuyGenix`;
      const desc = (c.tagline || c.about || `${c.company_name} is a ${c.business_type || 'supplier'} based in ${loc}.`).replace(/\s+/g, ' ').slice(0, 158);
      let md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', desc);
      const canon = document.querySelector('link[rel="canonical"]'); if (canon) canon.href = 'https://www.buygenixsolutions.com' + companyUrl(c.slug);
      const facts = [['Business type', c.business_type], ['Established', c.year_established], ['Team size', c.employees], ['Annual turnover', c.annual_turnover], ['Contact person', c.contact_person && (c.contact_person + (c.designation ? ', ' + c.designation : ''))], ['Location', loc]].filter(x => x[1]);
      const prods = c.products || [];
      const tags = (c.product_tags || []).filter(t => !prods.some(p => p.name.toLowerCase() === String(t).toLowerCase()));
      const inq = (p, id) => inquireAttrs(c.slug, c.company_name, p, id);
      box.dataset.slug = c.slug;
      box.innerHTML = `
      <div class="dr-card cp-hero">
        ${logoHTML(c)}
        <div><h1>${esc(c.company_name)}</h1><div class="dr-loc">${esc(loc)}${c.business_type ? ' · ' + esc(c.business_type) : ''}</div>${badgesHTML(c)}${c.tagline ? `<p class="dr-tagline">${esc(c.tagline)}</p>` : ''}</div>
        <div class="dr-actions"><button class="dr-btn pri" type="button" ${inq(productsTitle, '')}>Send inquiry</button>${contactBtns(c, productsTitle)}</div>
      </div>
      <div class="cp-grid">
        <div>
          ${prods.length ? `<section class="dr-card cp-sec"><h2>Products (${prods.length})</h2><div class="cp-prods">${prods.map(p => `
            <div class="cp-prod" id="p-${esc(p.id)}">${imgHTML(p.image_url, p.name)}<div class="cp-prod-b"><h3>${esc(p.name)}</h3>${priceHTML(p)}${p.min_order ? `<div class="dr-moq">MOQ: ${esc(p.min_order)}</div>` : ''}${p.description ? `<p class="cp-desc">${esc(p.description.slice(0, 140))}${p.description.length > 140 ? '…' : ''}</p>` : ''}${specsHTML((p.specs || []).slice(0, 3))}<button class="dr-btn pri" type="button" ${inq(p.name, p.id)}>Get best quote</button></div></div>`).join('')}</div></section>` : ''}
          ${c.about ? `<section class="dr-card cp-sec"><h2>About ${esc(c.company_name)}</h2><p class="cp-about">${esc(c.about)}</p></section>` : ''}
          ${facts.length ? `<section class="dr-card cp-sec"><h2>Company facts</h2><div class="cp-facts">${facts.map(([k, v]) => `<div><small>${esc(k)}</small><b>${esc(v)}</b></div>`).join('')}</div></section>` : ''}
          ${tags.length || (c.categories || []).length ? `<section class="dr-card cp-sec"><h2>Also deals in</h2><div class="dr-chips">${tags.concat(c.categories || []).map(t => `<a href="/search?type=products&q=${encodeURIComponent(t)}">${esc(t)}</a>`).join('')}</div></section>` : ''}
          ${(c.export_markets || []).length ? `<section class="dr-card cp-sec"><h2>Export markets</h2><div class="dr-chips">${c.export_markets.map(t => `<span>${esc(t)}</span>`).join('')}</div></section>` : ''}
          ${(c.certifications || []).length ? `<section class="dr-card cp-sec"><h2>Certifications</h2><div class="dr-chips">${c.certifications.map(t => `<span>${esc(t)}</span>`).join('')}</div></section>` : ''}
        </div>
        <aside class="cp-side">
          <section class="dr-card cp-sec"><h2>Contact ${esc(c.company_name)}</h2><div class="cp-contact">
            ${c.contact_person ? `<div><b>${esc(c.contact_person)}</b>${c.designation ? ', ' + esc(c.designation) : ''}</div>` : ''}
            <div>${esc([c.address, c.city, c.state, c.pincode].filter(Boolean).join(', ') || loc)}${c.country ? ', ' + esc(c.country) : ''}</div>
            ${c.website ? `<div><a href="${esc(/^https?:/i.test(c.website) ? c.website : 'https://' + c.website)}" target="_blank" rel="noopener nofollow">${esc(c.website.replace(/^https?:\/\//, ''))}</a></div>` : ''}
          </div>
          <div class="dr-actions" style="margin-top:14px"><button class="dr-btn pri" type="button" ${inq(productsTitle, '')}>Send inquiry</button>${contactBtns(c, productsTitle)}</div></section>
          <section class="dr-card cp-sec"><h2>Are you a supplier?</h2><p class="cp-desc">List your company and products on BuyGenix and get inquiries from buyers in India and abroad.</p><a class="dr-btn out" href="/login" style="width:100%">List your company</a></section>
        </aside>
      </div>`;
      const ld = { '@context': 'https://schema.org', '@type': 'Organization', name: c.company_name, url: 'https://www.buygenixsolutions.com' + companyUrl(c.slug),
        logo: c.logo_url || undefined, description: desc, foundingDate: c.year_established ? String(c.year_established) : undefined,
        address: { '@type': 'PostalAddress', addressLocality: c.city || undefined, addressRegion: c.state || undefined, addressCountry: c.country || 'IN' },
        makesOffer: prods.slice(0, 20).map(p => ({ '@type': 'Offer', itemOffered: { '@type': 'Product', name: p.name, image: p.image_url || undefined }, price: p.price != null ? String(p.price) : undefined, priceCurrency: p.price != null ? 'INR' : undefined })) };
      /* the server already sends Organization data for /company/<slug>; add it only if missing */
      if (![...document.querySelectorAll('script[type="application/ld+json"]')].some(x => /"Organization"/.test(x.textContent))) { const s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(ld); document.head.appendChild(s); }
      if (location.hash) { const el = document.getElementById(location.hash.slice(1)); if (el) setTimeout(() => el.scrollIntoView({ block: 'center' }), 100); }
    }
  }

  const page = document.body.dataset.page;
  if (page === 'search') initSearch();
  if (page === 'company') initCompany();
  window.BGX_Directory = { openInquiry };
})();
