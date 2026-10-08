/* BuyGenix member tools: document pack, quotation maker, buyer replies, demand tracker.
   Live: Supabase session + active membership (my_lead_quota().active).
   Preview: ?demo=1 on a local host only, with sample data and browser storage. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var DEMO = LOCAL && /[?&]demo=1\b/.test(location.search);
  var sb = null, client = null, profile = null, products = [];
  var CO_KEY = 'bgx_mt_company_v1';

  /* ---------- helpers ---------- */
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function num(v) { var n = parseFloat(v); return isFinite(n) ? n : 0; }
  function money(cur, n) { return cur + ' ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function qty(n) { return n.toLocaleString('en-US', { maximumFractionDigits: 3 }); }
  function fmtDate(s) { if (!s) return ''; var d = new Date(s + 'T00:00:00'); return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
  function addDays(s, n) { if (!s || !(n > 0)) return ''; var d = new Date(s + 'T00:00:00'); d.setDate(d.getDate() + n); return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
  function today() { return new Date().toISOString().slice(0, 10); }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function status(id, msg, kind) { var s = $(id); s.textContent = msg || ''; s.className = 'mt-status' + (kind ? ' ' + kind : ''); if (msg && kind === 'ok') setTimeout(function () { if (s.textContent === msg) s.textContent = ''; }, 3500); }
  function track(tool, action) { if (window.gtag) gtag('event', 'tool_use', { tool: tool, action: action }); }
  function lines(arr) { return arr.filter(function (x) { return x != null && String(x).trim() !== ''; }).join('\n'); }

  /* ---------- storage: Supabase table in live mode, browser storage in preview ---------- */
  var store = {
    list: function (tool) {
      if (DEMO) return Promise.resolve(lsGet('bgx_mt_demo_' + tool, []));
      return sb.from('member_tool_docs').select('id,title,updated_at,data').eq('tool', tool).order('updated_at', { ascending: false }).limit(100)
        .then(function (r) { if (r.error) throw r.error; return r.data || []; });
    },
    save: function (tool, id, title, data) {
      if (DEMO) {
        var all = lsGet('bgx_mt_demo_' + tool, []), now = new Date().toISOString();
        if (id) all = all.filter(function (x) { return x.id !== id; }); else id = 'demo-' + Date.now();
        all.unshift({ id: id, title: title, updated_at: now, data: data }); lsSet('bgx_mt_demo_' + tool, all);
        return Promise.resolve({ id: id });
      }
      var row = { tool: tool, title: title, data: data, updated_at: new Date().toISOString() };
      var q = id ? sb.from('member_tool_docs').update(row).eq('id', id).select('id').single() : sb.from('member_tool_docs').insert(row).select('id').single();
      return q.then(function (r) { if (r.error) throw r.error; return r.data; });
    },
    del: function (tool, id) {
      if (DEMO) { lsSet('bgx_mt_demo_' + tool, lsGet('bgx_mt_demo_' + tool, []).filter(function (x) { return x.id !== id; })); return Promise.resolve(); }
      return sb.from('member_tool_docs').delete().eq('id', id).then(function (r) { if (r.error) throw r.error; });
    }
  };

  /* ---------- gate ---------- */
  function showGate(kind) {
    $('mtLoading').hidden = true;
    var g = $('mtGate'); g.hidden = false; g.textContent = '';
    var box = el('div', 'mt-gate');
    if (kind === 'login') {
      box.appendChild(el('h2', '', 'Log in to use member tools'));
      box.appendChild(el('p', '', 'Member tools are part of your BuyGenix membership. Log in with the email or mobile number you registered with.'));
    } else {
      box.appendChild(el('h2', '', 'Member tools come with every BuyGenix plan'));
      box.appendChild(el('p', '', 'Your account does not have an active membership right now. These tools are included with every plan, along with monthly buyer leads and a Relationship Manager.'));
    }
    var ul = el('ul');
    [['Export document pack', 'Proforma, commercial invoice, packing list and certificate of origin draft from one entry.'],
     ['Quotation maker', 'Branded quotations from your saved price sheet, ready as PDF.'],
     ['Buyer replies', 'Professional replies for first contact, follow-ups, samples, price requests and orders.'],
     ['Demand tracker', 'Which countries are asking for your product, and the six-month trend.']].forEach(function (t) {
      var li = el('li'); li.appendChild(el('b', '', t[0])); li.appendChild(document.createTextNode(t[1])); ul.appendChild(li);
    });
    box.appendChild(ul);
    var row = el('div', 'lp-cta-row');
    var a1 = el('a', 'lp-btn pri', kind === 'login' ? 'Log in' : 'View membership plans'); a1.href = kind === 'login' ? '/login' : '/membership';
    var a2 = el('a', 'lp-btn out', kind === 'login' ? 'View membership plans' : 'Talk to our team'); a2.href = kind === 'login' ? '/membership' : '/contact';
    row.appendChild(a1); row.appendChild(a2); box.appendChild(row); g.appendChild(box);
  }

  function boot() {
    if (DEMO) { profile = DEMO_PROFILE; products = DEMO_PRODUCTS; return start(); }
    if (!window.supabase || typeof BGX_SUPABASE_URL === 'undefined') return showGate('login');
    sb = window.supabase.createClient(BGX_SUPABASE_URL, BGX_SUPABASE_ANON);
    sb.auth.getSession().then(function (r) {
      if (!r.data || !r.data.session) return showGate('login');
      var uid = r.data.session.user.id;
      return sb.rpc('my_lead_quota').then(function (q) {
        var row = q.data && q.data[0];
        if (!row || !row.active) return showGate('member');
        return sb.from('clients').select('id,name,business_name,email,phone,gstin').eq('auth_user_id', uid).maybeSingle().then(function (c) {
          client = c.data || null;
          if (!client) return start();
          return Promise.all([
            sb.from('company_profiles').select('*').eq('client_id', client.id).maybeSingle().then(function (p) { profile = p.data || null; }, function () {}),
            sb.from('company_products').select('name,unit,price,min_order').eq('client_id', client.id).order('sort').then(function (p) { products = p.data || []; }, function () {})
          ]).then(start);
        });
      });
    }).catch(function () { showGate('login'); });
  }

  /* ---------- company details (shared by all tools) ---------- */
  var CO = ['coName', 'coContact', 'coAddr', 'coIec', 'coGst', 'coEmail', 'coPhone', 'coBank'];
  function co() { var o = {}; CO.forEach(function (k) { o[k] = $(k).value.trim(); }); o.logo = profile && profile.logo_url || ''; return o; }
  function initCompany() {
    var p = profile || {}, c = client || {};
    var addr = lines([p.address, [p.city, p.state, p.pincode].filter(Boolean).join(', '), p.country || (p.address ? 'India' : '')]);
    var def = { coName: p.company_name || c.business_name || c.name || '', coContact: p.contact_person || c.name || '', coAddr: addr, coIec: p.iec || '', coGst: p.gstin || c.gstin || '',
                coEmail: p.email || c.email || '', coPhone: p.phone || c.phone || '', coBank: '' };
    var saved = lsGet(CO_KEY, {});
    CO.forEach(function (k) { $(k).value = saved[k] != null && saved[k] !== '' ? saved[k] : def[k]; });
    if (p.logo_url) { $('coLogo').src = p.logo_url; $('coLogo').hidden = false; $('coLogoNote').textContent = 'Your logo from Company Profile.'; }
    $('coTitle').textContent = $('coName').value ? $('coName').value : 'Your company details';
    if (!$('coName').value) $('mtCompany').open = true;
    $('mtCompany').addEventListener('input', function () { var o = {}; CO.forEach(function (k) { o[k] = $(k).value; }); lsSet(CO_KEY, o); $('coTitle').textContent = $('coName').value || 'Your company details'; renderDoc(); renderQuote(); renderReply(); });
  }

  /* ---------- shared paper pieces ---------- */
  function paperTop(paper, title, meta, sub) {
    var c = co(); paper.textContent = '';
    var top = el('div', 'inv-top'), brand = el('div', 'inv-brand');
    if (c.logo) { var im = el('img'); im.src = c.logo; im.alt = ''; brand.appendChild(im); }
    var m = el('div', 'inv-meta'); meta.forEach(function (x) { if (x[1]) { var d = el('div'); d.appendChild(document.createTextNode(x[0] + ' ')); d.appendChild(el('b', '', x[1])); m.appendChild(d); } });
    top.appendChild(brand); top.appendChild(m); paper.appendChild(top);
    var t = el('div', 'inv-title'); if (sub) t.appendChild(el('div', 'inv-draft', sub)); t.appendChild(el('h3', '', title)); t.appendChild(el('div', 'nm', c.coName || 'Your company name')); paper.appendChild(t);
  }
  function party(label, nameText, body) { var d = el('div'); d.appendChild(el('b', '', label)); if (nameText) d.appendChild(el('p', 'nm', nameText)); d.appendChild(el('p', '', body || '')); return d; }
  function terms(paper, list) { var t = el('div', 'inv-terms'); list.forEach(function (x) { var d = el('div'); d.appendChild(el('b', '', x[0])); d.appendChild(el('span', '', x[1] || '-')); t.appendChild(d); }); paper.appendChild(t); }
  function table(paper, head, rows, rightFrom) {
    var w = el('div', 'tl-scroll'), tb = el('table', 'inv-table'), th = el('thead'), tr = el('tr');
    head.forEach(function (h, i) { var c = el('th', i >= rightFrom ? 'r' : '', h); tr.appendChild(c); }); th.appendChild(tr); tb.appendChild(th);
    var body = el('tbody');
    if (!rows.length) { var r0 = el('tr'), td0 = el('td', 'inv-empty', 'Add your products on the left'); td0.colSpan = head.length; r0.appendChild(td0); body.appendChild(r0); }
    rows.forEach(function (r) { var trr = el('tr'); r.forEach(function (c, i) { trr.appendChild(el('td', i >= rightFrom ? 'r' : '', c)); }); body.appendChild(trr); });
    tb.appendChild(body); w.appendChild(tb); paper.appendChild(w);
  }
  function sums(paper, rows) { var s = el('div', 'inv-sum'); rows.forEach(function (r, i) { if (r == null) return; var d = el('div', i === rows.length - 1 ? 'tot' : ''); d.appendChild(el('span', '', r[0])); d.appendChild(el('span', '', r[1])); s.appendChild(d); }); paper.appendChild(s); }
  function foot(paper, left, signFor) {
    var f = el('div', 'inv-foot'), l = el('div');
    left.forEach(function (x) { if (!x[1]) return; var b = el('b', '', x[0]); if (l.childNodes.length) b.style.marginTop = '10px'; l.appendChild(b); l.appendChild(el('p', '', x[1])); });
    var s = el('div', 'inv-sign'); s.appendChild(el('div', '', 'For ' + (signFor || 'your company'))); s.appendChild(el('div', 'ln', 'Authorised signatory'));
    f.appendChild(l); f.appendChild(s); paper.appendChild(f);
  }
  function printPaper(id) { var p = $(id); p.classList.add('mt-print'); window.print(); setTimeout(function () { p.classList.remove('mt-print'); }, 500); }

  /* ---------- rows editor ---------- */
  function rowsEditor(tbodyId, cols, onChange) {
    var tb = $(tbodyId);
    function add(d) {
      d = d || {}; var tr = el('tr');
      cols.forEach(function (c) { var td = el('td'), i = el('input'); i.dataset.k = c.k; if (c.num) { i.type = 'number'; i.min = '0'; i.step = 'any'; } if (c.cls) i.className = c.cls; if (c.ph) i.placeholder = c.ph; i.value = d[c.k] != null ? d[c.k] : ''; td.appendChild(i); tr.appendChild(td); });
      var td = el('td'), x = el('button', 'del', '×'); x.type = 'button'; x.setAttribute('aria-label', 'Remove row');
      x.onclick = function () { tr.remove(); if (!tb.children.length) add(); onChange(); }; td.appendChild(x); tr.appendChild(td);
      tb.appendChild(tr); return tr;
    }
    function get() { return Array.prototype.map.call(tb.children, function (tr) { var o = {}; tr.querySelectorAll('input').forEach(function (i) { o[i.dataset.k] = i.value.trim(); }); return o; }); }
    function set(list) { tb.textContent = ''; (list && list.length ? list : [{}]).forEach(add); }
    tb.addEventListener('input', onChange);
    return { add: add, get: get, set: set };
  }
  function filled(r) { return Object.keys(r).some(function (k) { return r[k] !== ''; }); }

  /* ---------- saved lists ---------- */
  function savedList(tool, selId, onOpen, getCurrent, onNew, statusId) {
    var cache = [], currentId = null;
    function refresh(selectId) {
      return store.list(tool).then(function (list) {
        cache = list; var s = $(selId), first = s.options[0].text; s.textContent = ''; s.appendChild(new Option(first, ''));
        list.forEach(function (x) { s.appendChild(new Option((x.title || 'Untitled') + '  ·  ' + new Date(x.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }), x.id)); });
        if (selectId) s.value = selectId;
      }).catch(function () { status(statusId, 'Could not load saved items.', 'err'); });
    }
    return {
      refresh: refresh,
      open: function () { var id = $(selId).value, x = cache.filter(function (c) { return c.id === id; })[0]; if (!x) return; currentId = x.id; onOpen(x.data || {}); status(statusId, 'Opened "' + (x.title || 'Untitled') + '".', 'ok'); },
      del: function () { var id = $(selId).value; if (!id) return; if (!confirm('Delete this saved item? This cannot be undone.')) return; store.del(tool, id).then(function () { if (currentId === id) currentId = null; refresh(); status(statusId, 'Deleted.', 'ok'); }).catch(function () { status(statusId, 'Could not delete. Try again.', 'err'); }); },
      save: function () { var cur = getCurrent(); status(statusId, 'Saving...'); store.save(tool, currentId, cur.title, cur.data).then(function (r) { currentId = r.id; refresh(r.id); status(statusId, 'Saved to your account.', 'ok'); track(tool, 'save'); }).catch(function () { status(statusId, 'Could not save. Check your connection and try again.', 'err'); }); },
      reset: function () { currentId = null; $(selId).value = ''; onNew(); }
    };
  }

  /* ================= DOCUMENT PACK ================= */
  var DF = ['buyName', 'buyAddr', 'notify', 'no', 'date', 'po', 'cur', 'inco', 'place', 'pol', 'pod', 'dest', 'mode', 'vessel', 'marks', 'pay', 'del', 'freight', 'ins', 'pkgType', 'notes'];
  var doc = 'pi', dRows, dSaved;
  function dGet() { var o = {}; DF.forEach(function (k) { o[k] = $('d_' + k).value.trim(); }); o.items = dRows.get().filter(filled); return o; }
  function dSet(o) { DF.forEach(function (k) { var e = $('d_' + k); e.value = o[k] != null ? o[k] : (k === 'cur' ? 'USD' : k === 'inco' ? 'FOB' : k === 'mode' ? 'Sea' : k === 'pkgType' ? 'Cartons' : k === 'date' ? today() : ''); }); dRows.set(o.items); renderDoc(); }
  function renderDoc() {
    if (!dRows) return;
    var v = dGet(), c = co(), p = $('dPaper'), cur = v.cur, inco = v.inco + (v.place ? ' ' + v.place : '');
    var exp = lines([c.coAddr, c.coIec && 'IEC: ' + c.coIec, c.coGst && 'GSTIN: ' + c.coGst, c.coEmail, c.coPhone]);
    var sub = 0, pk = 0, net = 0, gr = 0;
    v.items.forEach(function (r) { sub += num(r.qty) * num(r.price); pk += num(r.pkgs); net += num(r.net); gr += num(r.gross); });
    var fr = num(v.freight), ins = num(v.ins), total = sub + fr + ins;
    if (doc === 'pi' || doc === 'ci') {
      paperTop(p, doc === 'pi' ? 'PROFORMA INVOICE' : 'COMMERCIAL INVOICE', [['No.', v.no || '-'], ['Date:', fmtDate(v.date) || '-'], ['Buyer ref.:', v.po]]);
      var parties = el('div', 'inv-parties'); parties.appendChild(party('Exporter', '', exp)); parties.appendChild(party('Consignee', v.buyName || 'Buyer company name', v.buyAddr)); p.appendChild(parties);
      terms(p, [['Incoterm', inco], ['Port of loading', v.pol], ['Port of discharge', v.pod], ['Country of origin', 'India'], ['Final destination', v.dest], doc === 'pi' ? ['Delivery', v.del] : ['Transport', v.mode + (v.vessel ? ', ' + v.vessel : '')], ['Payment terms', v.pay]]);
      table(p, ['#', 'Description', 'HS code', 'Qty', 'Unit price', 'Amount'], v.items.map(function (r, i) { return [String(i + 1), r.desc, r.hs, r.qty ? qty(num(r.qty)) + ' ' + r.unit : '', r.price ? money(cur, num(r.price)) : '', money(cur, num(r.qty) * num(r.price))]; }), 3);
      sums(p, [['Subtotal', money(cur, sub)], fr ? ['Freight', money(cur, fr)] : null, ins ? ['Insurance', money(cur, ins)] : null, ['Total ' + inco, money(cur, total)]]);
      foot(p, [['Bank details', c.coBank], ['Notes', v.notes], doc === 'ci' && v.notify ? ['Notify party', v.notify] : ['', '']], c.coName);
      if (doc === 'ci') p.appendChild(el('p', 'inv-decl', 'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.'));
    } else if (doc === 'pl') {
      paperTop(p, 'PACKING LIST', [['Invoice no.', v.no || '-'], ['Date:', fmtDate(v.date) || '-'], ['Buyer ref.:', v.po]]);
      var pp = el('div', 'inv-parties'); pp.appendChild(party('Exporter', '', exp)); pp.appendChild(party('Consignee', v.buyName || 'Buyer company name', v.buyAddr)); p.appendChild(pp);
      terms(p, [['Port of loading', v.pol], ['Port of discharge', v.pod], ['Final destination', v.dest], ['Transport', v.mode + (v.vessel ? ', ' + v.vessel : '')], ['Marks and numbers', v.marks], ['Package type', v.pkgType]]);
      table(p, ['#', 'Description', 'Packages', 'Qty', 'Net kg', 'Gross kg'], v.items.map(function (r, i) { return [String(i + 1), r.desc, r.pkgs ? qty(num(r.pkgs)) : '', r.qty ? qty(num(r.qty)) + ' ' + r.unit : '', r.net ? qty(num(r.net)) : '', r.gross ? qty(num(r.gross)) : '']; }), 2);
      sums(p, [['Total packages', qty(pk) + ' ' + (v.pkgType || '').toLowerCase()], ['Total net weight', qty(net) + ' kg'], ['Total gross weight', qty(gr) + ' kg']]);
      foot(p, [['Notes', v.notes]], c.coName);
    } else {
      paperTop(p, 'CERTIFICATE OF ORIGIN', [['Invoice no.', v.no || '-'], ['Date:', fmtDate(v.date) || '-']], 'DRAFT FOR APPLICATION');
      var cp = el('div', 'inv-parties'); cp.appendChild(party('1. Exporter', c.coName, exp)); cp.appendChild(party('2. Consignee', v.buyName || 'Buyer company name', v.buyAddr)); p.appendChild(cp);
      terms(p, [['3. Transport and route', [v.mode, v.pol && 'from ' + v.pol, v.pod && 'to ' + v.pod].filter(Boolean).join(' ')], ['Vessel or flight', v.vessel], ['4. Country of origin', 'India'], ['Country of destination', v.dest], ['5. Invoice', [v.no, fmtDate(v.date)].filter(Boolean).join(', ')], ['Marks and numbers', v.marks]]);
      table(p, ['#', 'Packages and description of goods', 'HS code', 'Quantity', 'Gross kg'], v.items.map(function (r, i) { return [String(i + 1), [r.pkgs && qty(num(r.pkgs)) + ' ' + (v.pkgType || '').toLowerCase() + ' of', r.desc].filter(Boolean).join(' '), r.hs, r.qty ? qty(num(r.qty)) + ' ' + r.unit : '', r.gross ? qty(num(r.gross)) : '']; }), 3);
      p.appendChild(el('p', 'inv-decl', 'Declaration by the exporter: the undersigned declares that the above details are correct and that all the goods were produced in India.'));
      foot(p, [], c.coName);
      p.appendChild(el('p', 'inv-note', 'This is a draft to prepare your application. The certificate of origin is issued by the authorised agency, for example a chamber of commerce, an export promotion council or through the DGFT platform for preferential certificates.'));
    }
  }
  function initDocs() {
    dRows = rowsEditor('dItems', [{ k: 'desc', ph: 'Product and specification' }, { k: 'hs', cls: 'num', ph: '0904' }, { k: 'qty', num: 1, cls: 'num' }, { k: 'unit', cls: 'num', ph: 'kg' }, { k: 'price', num: 1, cls: 'num' }, { k: 'pkgs', num: 1, cls: 'num' }, { k: 'net', num: 1, cls: 'num' }, { k: 'gross', num: 1, cls: 'num' }], renderDoc);
    $('dForm').addEventListener('input', renderDoc); $('dForm').addEventListener('change', renderDoc);
    $('dAdd').onclick = function () { dRows.add(); };
    $('dSeg').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; doc = b.dataset.doc; this.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); }); renderDoc(); });
    dSaved = savedList('doc_pack', 'dSaved', dSet, function () { var v = dGet(); return { title: [v.no, v.buyName].filter(Boolean).join(' - ') || 'Document pack', data: v }; }, function () { dSet(DEMO ? DEMO_PACK : {}); }, 'dStatus');
    $('dLoad').onclick = dSaved.open; $('dDel').onclick = dSaved.del; $('dSave').onclick = dSaved.save; $('dNew').onclick = dSaved.reset;
    $('dPrint').onclick = function () { renderDoc(); track('doc_pack', 'pdf_' + doc); printPaper('dPaper'); };
    dSet(DEMO ? DEMO_PACK : {}); dSaved.refresh();
  }

  /* ================= QUOTATION MAKER ================= */
  var QF = ['buyName', 'buyCo', 'buyCountry', 'buyEmail', 'no', 'date', 'valid', 'cur', 'inco', 'place', 'pay', 'del', 'notes'];
  var qRows, sRows, qSaved, sheetId = null;
  function qGet() { var o = {}; QF.forEach(function (k) { o[k] = $('q_' + k).value.trim(); }); o.items = qRows.get().filter(filled); return o; }
  function qSet(o) { QF.forEach(function (k) { $('q_' + k).value = o[k] != null ? o[k] : (k === 'cur' ? 'USD' : k === 'inco' ? 'FOB' : k === 'valid' ? '15' : k === 'date' ? today() : ''); }); qRows.set(o.items); renderQuote(); }
  function fillPick() { var s = $('qPick'); s.textContent = ''; s.appendChild(new Option('Choose a product', '')); sRows.get().filter(function (r) { return r.name; }).forEach(function (r, i) { s.appendChild(new Option(r.name + (r.price ? '  ·  ' + r.price + (r.unit ? ' per ' + r.unit : '') : ''), String(i))); }); }
  function renderQuote() {
    if (!qRows) return;
    var v = qGet(), c = co(), p = $('qPaper'), cur = v.cur, inco = v.inco + (v.place ? ' ' + v.place : '');
    paperTop(p, 'QUOTATION', [['No.', v.no || '-'], ['Date:', fmtDate(v.date) || '-'], ['Valid until:', addDays(v.date, num(v.valid)) || '-']]);
    var pr = el('div', 'inv-parties');
    pr.appendChild(party('To', [v.buyName, v.buyCo].filter(Boolean).join(', ') || 'Buyer name and company', lines([v.buyCountry, v.buyEmail])));
    pr.appendChild(party('From', c.coName, lines([c.coAddr, c.coEmail, c.coPhone]))); p.appendChild(pr);
    terms(p, [['Incoterm', inco], ['Payment terms', v.pay], ['Delivery', v.del], ['Currency', cur], ['Country of origin', 'India'], ['Validity', v.valid ? v.valid + ' days' : '']]);
    var total = 0;
    table(p, ['#', 'Product and specification', 'Qty', 'Unit price', 'Amount'], v.items.map(function (r, i) { var a = num(r.qty) * num(r.price); total += a; return [String(i + 1), r.desc, r.qty ? qty(num(r.qty)) + ' ' + r.unit : '', r.price ? money(cur, num(r.price)) + (r.unit ? ' / ' + r.unit : '') : '', money(cur, a)]; }), 2);
    sums(p, [['Total ' + inco, money(cur, total)]]);
    foot(p, [['Notes', v.notes], ['Bank details', c.coBank], ['Contact', lines([c.coContact, c.coEmail, c.coPhone])]], c.coName);
  }
  function initQuote() {
    sRows = rowsEditor('sItems', [{ k: 'name', ph: 'Product' }, { k: 'unit', cls: 'num', ph: 'kg' }, { k: 'price', num: 1, cls: 'num' }, { k: 'moq', cls: 'num', ph: '1 MT' }], fillPick);
    qRows = rowsEditor('qItems', [{ k: 'desc', ph: 'Product and specification' }, { k: 'qty', num: 1, cls: 'num' }, { k: 'unit', cls: 'num', ph: 'kg' }, { k: 'price', num: 1, cls: 'num' }], renderQuote);
    $('qForm').addEventListener('input', renderQuote); $('qForm').addEventListener('change', function (e) { if (e.target.id !== 'qPick') renderQuote(); });
    $('qAdd').onclick = function () { qRows.add(); };
    $('qPick').onchange = function () {
      var i = this.value; if (i === '') return; var r = sRows.get().filter(function (x) { return x.name; })[+i];
      if (!qRows.get().some(filled)) $('qItems').textContent = '';
      qRows.add({ desc: r.name + (r.moq ? ' (MOQ ' + r.moq + ')' : ''), unit: r.unit, price: r.price, qty: '' }); this.value = ''; renderQuote();
    };
    $('sSave').onclick = function () {
      status('sStatus', 'Saving...');
      store.save('price_sheet', sheetId, 'Price sheet', { rows: sRows.get().filter(filled) }).then(function (r) { sheetId = r.id; status('sStatus', 'Price sheet saved.', 'ok'); track('price_sheet', 'save'); }).catch(function () { status('sStatus', 'Could not save. Try again.', 'err'); });
    };
    qSaved = savedList('quotation', 'qSaved', qSet, function () { var v = qGet(); return { title: [v.no, v.buyCo || v.buyName].filter(Boolean).join(' - ') || 'Quotation', data: v }; }, function () { qSet(DEMO ? DEMO_QUOTE : {}); }, 'qStatus');
    $('qLoad').onclick = qSaved.open; $('qDel').onclick = qSaved.del; $('qSave').onclick = qSaved.save; $('qNew').onclick = qSaved.reset;
    $('qPrint').onclick = function () { renderQuote(); track('quotation', 'pdf'); printPaper('qPaper'); };
    store.list('price_sheet').then(function (list) {
      if (list.length) { sheetId = list[0].id; sRows.set(list[0].data && list[0].data.rows); }
      else sRows.set(products.filter(function (x) { return x.name; }).map(function (x) { return { name: x.name, unit: x.unit || '', price: x.price != null ? x.price : '', moq: x.min_order || '' }; }));
      fillPick();
    }).catch(function () { sRows.set([]); fillPick(); });
    qSet(DEMO ? DEMO_QUOTE : {}); qSaved.refresh();
  }

  /* ================= BUYER REPLIES ================= */
  var scen = 'first', RF = ['buyer', 'product', 'qty', 'cur', 'price', 'unit', 'inco', 'port', 'days', 'valid', 'pay', 'extra', 'eta'];
  function rGet() { var o = {}; RF.forEach(function (k) { o[k] = $('r_' + k).value.trim(); }); return o; }
  function reply(v, c) {
    var hi = 'Dear ' + (v.buyer || 'Sir or Madam') + ',';
    var price = v.price ? v.cur + ' ' + v.price + ' per ' + (v.unit || 'unit') + ', ' + v.inco + (v.port ? ' ' + v.port : '') : '';
    var prod = v.product || 'the product';
    var sign = lines(['Best regards,', c.coContact, c.coName, c.coPhone, c.coEmail]);
    var offer = lines(['Product: ' + prod, v.qty && 'Quantity: ' + v.qty, price && 'Price: ' + price, v.pay && 'Payment terms: ' + v.pay, v.days && 'Delivery: ' + v.days + ' days from order confirmation', v.valid && 'Offer valid for: ' + v.valid + ' days']);
    var B = {
      first: [hi, 'Thank you for your requirement for ' + prod + (v.qty ? ' (' + v.qty + ')' : '') + '. We are ' + (c.coName || 'an exporter') + ' from India, and we can supply this product to your specification.', 'Our offer:\n' + offer, 'We can share product photos, specifications and certificates, and send a sample if needed. Please confirm your exact specification, packing and destination port so we can finalise the price.', sign],
      followup: [hi, 'I am following up on our offer for ' + prod + (v.qty ? ' (' + v.qty + ')' : '') + '.' + (price ? ' Our price is ' + price + '.' : ''), (v.valid ? 'The offer is valid for ' + v.valid + ' days. ' : '') + 'If you need a change in specification, packing or quantity, we are happy to revise the quotation.', 'Could you let me know if you would like to go ahead, or if you would prefer a sample first?', sign],
      sample: [hi, 'Thank you for your interest in ' + prod + '. We would be glad to send a sample for your approval.', lines(['Sample: ' + prod, v.extra && 'Terms: ' + v.extra, v.days && 'Dispatch: within ' + v.days + ' days']), 'Please share your full delivery address, contact number and any test or specification you will check, so we send the right sample.', price ? 'For your reference, our price for the order is ' + price + (v.qty ? ' for ' + v.qty : '') + '.' : '', sign],
      counter: [hi, 'Thank you for your reply on ' + prod + '. We have reviewed your target price carefully.', price ? 'Our best price' + (v.qty ? ' for ' + v.qty : '') + ' is ' + price + '. This keeps the quality and specification you asked for.' : 'We will share our best price after confirming the final specification.', 'For a larger quantity or a regular contract we can look at the price again. We can also suggest a different grade or packing if that helps you reach your target.', 'Please let me know how you would like to proceed.', sign],
      confirm: [hi, 'Thank you for your order. We confirm the following:', offer, 'We will send the proforma invoice for your approval' + (v.pay ? ' and the payment details' : '') + '. Production starts once the order is confirmed' + (/advance/i.test(v.pay) ? ' and the advance is received' : '') + '.', 'Please share the consignee details, notify party and any document requirements for your country.', sign],
      ship: [hi, 'Your shipment of ' + prod + (v.qty ? ' (' + v.qty + ')' : '') + ' has been dispatched.', lines([v.extra && 'Details: ' + v.extra, v.port && 'From: ' + v.port, v.eta && 'Expected arrival: ' + v.eta]), 'We will send copies of the commercial invoice, packing list, bill of lading and certificate of origin' + (v.pay ? ', and the balance payment details as per ' + v.pay : '') + '.', 'Please let me know if you need any other document for customs clearance.', sign]
    };
    return B[scen].filter(function (x) { return x && x.trim(); }).join('\n\n');
  }
  function renderReply() {
    if (!$('rOut')) return;
    var t = reply(rGet(), co()), o = $('rOut'); o.value = t; o.style.height = 'auto'; o.style.height = Math.max(420, o.scrollHeight + 4) + 'px';
    $('rWa').href = 'https://wa.me/?text=' + encodeURIComponent(t);
    $('rMail').href = 'mailto:?subject=' + encodeURIComponent((rGet().product || 'Your enquiry') + ' - ' + (co().coName || 'Quotation')) + '&body=' + encodeURIComponent(t);
  }
  function initReply() {
    $('rForm').addEventListener('input', renderReply); $('rForm').addEventListener('change', renderReply);
    $('rScen').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; scen = b.dataset.s; this.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); }); renderReply(); });
    $('rCopy').onclick = function () { var t = $('rOut').value; (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { status('rStatus', 'Copied.', 'ok'); }, function () { $('rOut').select(); document.execCommand('copy'); status('rStatus', 'Copied.', 'ok'); }); track('buyer_reply', 'copy_' + scen); };
    $('rWa').addEventListener('click', function () { track('buyer_reply', 'whatsapp_' + scen); });
    $('rMail').addEventListener('click', function () { track('buyer_reply', 'email_' + scen); });
    if (DEMO) { var d = DEMO_REPLY; Object.keys(d).forEach(function (k) { $('r_' + k).value = d[k]; }); }
    renderReply();
  }

  /* ================= DEMAND TRACKER ================= */
  var LV = { strong: 'Strong demand', steady: 'Steady demand', early: 'Early demand' };
  function demand(q) {
    if (DEMO) return Promise.resolve(demoDemand(q));
    return sb.rpc('member_product_demand', { p_product: q, p_days: 180 }).then(function (r) { if (r.error) throw r.error; return r.data; });
  }
  function renderDemand(d) {
    var out = $('dmOut'); out.textContent = '';
    if (!d || !d.found) { var e = el('div', 'mt-empty', 'No buyer requirements for "' + ((d && d.query) || '') + '" in the last six months. Try a shorter or more common name, for example "rice" instead of "1121 steam basmati".'); out.appendChild(e); return; }
    var g = el('div', 'mt-dem');
    var c1 = el('div', 'mt-card'), h = el('div'); h.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:4px';
    h.appendChild(el('h3', '', 'Where buyers are asking for ' + (d.product && d.product.name || d.query))); h.appendChild(el('span', 'mt-level ' + d.level, LV[d.level] || '')); c1.appendChild(h);
    c1.appendChild(el('p', '', 'Countries ranked by buyer requirements in the last six months. Bars are relative to the top country.'));
    var ul = el('ul', 'mt-bars');
    (d.countries || []).forEach(function (x) {
      var li = el('li'), a = el('a', '', x.name); a.href = x.slug ? '/buyers/country/' + x.slug : '#'; li.appendChild(a);
      var b = el('div', 'mt-bar'), i = el('i'); i.style.width = Math.max(4, x.score) + '%'; b.appendChild(i); li.appendChild(b);
      li.appendChild(el('span', 'lv ' + x.level, x.level)); ul.appendChild(li);
    });
    if (!(d.countries || []).length) c1.appendChild(el('p', '', 'Requirements found, but without a clear destination country yet.'));
    c1.appendChild(ul); g.appendChild(c1);
    var c2 = el('div', 'mt-card'); c2.appendChild(el('h3', '', 'Six-month trend')); c2.appendChild(el('p', '', 'Requirements per month, relative to the busiest month.'));
    var tr = el('div', 'mt-trend');
    (d.trend || []).forEach(function (m) { var col = el('div'), bar = el('i'); bar.style.height = Math.max(2, m.score) + '%'; bar.title = m.month; col.appendChild(bar); col.appendChild(el('span', '', m.month.split(' ')[0])); tr.appendChild(col); });
    c2.appendChild(tr);
    if ((d.related || []).length) { c2.appendChild(el('h3', '', 'Related products buyers ask for')).style.marginTop = '18px'; var ch = el('div', 'mt-chips'); d.related.forEach(function (r) { var b = el('button', '', r.name); b.type = 'button'; b.onclick = function () { $('dmQ').value = r.name; run(); }; ch.appendChild(b); }); c2.appendChild(ch); }
    var act = el('div', 'mt-paper-actions'); act.style.marginTop = '18px';
    var a1 = el('a', 'mt-btn pri', 'See live requirements'); a1.href = '/buy-lead-search?q=' + encodeURIComponent(d.product && d.product.name || d.query); act.appendChild(a1);
    c2.appendChild(act); g.appendChild(c2); out.appendChild(g);
  }
  function run() {
    var q = $('dmQ').value.trim(); if (q.length < 2) return;
    $('dmOut').textContent = ''; $('dmOut').appendChild(el('div', 'mt-empty', 'Looking up demand for "' + q + '"...'));
    demand(q).then(function (d) { renderDemand(d); track('demand_tracker', 'search'); }).catch(function () { $('dmOut').textContent = ''; $('dmOut').appendChild(el('div', 'mt-empty', 'Could not load demand right now. Please try again in a moment.')); });
  }
  function initDemand() {
    var mine = [];
    (profile && profile.products || []).concat(products.map(function (p) { return p.name; })).forEach(function (n) { n = String(n || '').trim(); if (n && mine.indexOf(n) < 0) mine.push(n); });
    var dl = $('dmList'), chips = $('dmMine');
    mine.slice(0, 12).forEach(function (n) { dl.appendChild(new Option(n)); var b = el('button', '', n); b.type = 'button'; b.onclick = function () { $('dmQ').value = n; run(); }; chips.appendChild(b); });
    $('dmForm').addEventListener('submit', run);
    var qp = new URLSearchParams(location.search).get('q'); if (qp) { $('dmQ').value = qp.slice(0, 80); run(); }
  }

  /* ---------- tabs ---------- */
  function initTabs() {
    var tabs = document.querySelectorAll('.mt-tabs button');
    function show(t) { tabs.forEach(function (b) { b.classList.toggle('on', b.dataset.tab === t); }); ['docs', 'quote', 'reply', 'demand'].forEach(function (k) { $('t-' + k).hidden = k !== t; }); try { history.replaceState(null, '', location.pathname + location.search + '#' + t); } catch (e) {} }
    tabs.forEach(function (b) { b.onclick = function () { show(b.dataset.tab); }; });
    var h = location.hash.slice(1); if (['docs', 'quote', 'reply', 'demand'].indexOf(h) >= 0) show(h);
  }

  function start() {
    $('mtLoading').hidden = true; $('mtApp').hidden = false; $('mtDemo').hidden = !DEMO;
    initTabs(); initCompany(); initDocs(); initQuote(); initReply(); initDemand();
  }

  /* ---------- preview data (local demo only) ---------- */
  var DEMO_PROFILE = { company_name: 'Sample Exports Pvt Ltd', contact_person: 'Export Sales Team', address: 'Plot 12, MIDC Area', city: 'Navi Mumbai', state: 'Maharashtra', pincode: '400701', country: 'India', iec: 'ABCDE1234F', gstin: '27ABCDE1234F1Z5', email: 'sales@sample-exports.com', phone: '+91 00000 00000', products: ['Red chilli', 'Turmeric', 'Basmati rice'], logo_url: '/assets/logo-full.png' };
  var DEMO_PRODUCTS = [{ name: 'Red chilli whole, S17 Teja', unit: 'kg', price: 2.85, min_order: '1 x 20 ft' }, { name: 'Turmeric finger, polished', unit: 'kg', price: 1.95, min_order: '5 MT' }, { name: 'Basmati rice 1121, steam', unit: 'MT', price: 1180, min_order: '1 x 20 ft' }];
  var DEMO_PACK = { buyName: 'Gulf Foods Trading LLC', buyAddr: 'Al Quoz Industrial Area\nDubai, United Arab Emirates', no: 'EXP-2026-014', date: today(), po: 'GFT-PO-552', cur: 'USD', inco: 'CIF', place: 'Jebel Ali', pol: 'Nhava Sheva, India', pod: 'Jebel Ali, UAE', dest: 'United Arab Emirates', mode: 'Sea', vessel: '', marks: 'GFT / DXB / 1-480', pay: '30% advance, 70% against copy of B/L', del: '25 days from advance', freight: '850', ins: '120', pkgType: 'Bags', notes: 'Packed in 25 kg PP bags. Phytosanitary certificate provided.',
    items: [{ desc: 'Red chilli whole, S17 Teja', hs: '0904', qty: '7000', unit: 'kg', price: '2.85', pkgs: '280', net: '7000', gross: '7140' }, { desc: 'Turmeric finger, polished', hs: '0910', qty: '5000', unit: 'kg', price: '1.95', pkgs: '200', net: '5000', gross: '5100' }] };
  var DEMO_QUOTE = { buyName: 'Mr Ahmed', buyCo: 'Gulf Foods Trading LLC', buyCountry: 'United Arab Emirates', no: 'Q-2026-031', date: today(), valid: '15', cur: 'USD', inco: 'FOB', place: 'Nhava Sheva', pay: '30% advance, 70% against copy of B/L', del: '25 days from order', notes: 'Prices for 25 kg PP bags. Sample available on request.',
    items: [{ desc: 'Red chilli whole, S17 Teja (MOQ 1 x 20 ft)', qty: '12000', unit: 'kg', price: '2.85' }] };
  var DEMO_REPLY = { buyer: 'Mr Ahmed', product: 'Red chilli whole, S17 Teja', qty: '2 x 40 ft containers', price: '2.85', unit: 'kg', port: 'Nhava Sheva', days: '25', valid: '15', pay: '30% advance' };
  function demoDemand(q) {
    var seed = 0; for (var i = 0; i < q.length; i++) seed = (seed * 31 + q.charCodeAt(i)) % 997;
    var C = [['UAE', 'uae'], ['Saudi Arabia', 'saudi-arabia'], ['UK', 'uk'], ['USA', 'usa'], ['Oman', 'oman'], ['Qatar', 'qatar'], ['Germany', 'germany'], ['Malaysia', 'malaysia']];
    var sc = [100, 74, 58, 46, 35, 27, 19, 12], mons = [], now = new Date();
    for (var m = 5; m >= 0; m--) { var dt = new Date(now.getFullYear(), now.getMonth() - m, 1); mons.push({ month: dt.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }), score: [42, 55, 48, 71, 86, 100][5 - m] }); }
    return { found: true, query: q, level: seed % 3 === 0 ? 'steady' : 'strong', product: { name: q.charAt(0).toUpperCase() + q.slice(1), slug: '' },
      countries: C.map(function (c, i) { var s = i === 0 ? 100 : Math.max(5, sc[i] - (seed % 7)); return { name: c[0], slug: c[1], score: s, level: s >= 66 ? 'high' : s >= 33 ? 'medium' : 'low' }; }),
      trend: mons, related: [{ name: 'Chilli powder' }, { name: 'Turmeric' }, { name: 'Coriander seeds' }, { name: 'Cumin seeds' }] };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
