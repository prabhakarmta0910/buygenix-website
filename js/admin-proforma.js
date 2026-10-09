/* BuyGenix admin: proforma invoices for members (memberships and services).
   Seller details and bank details are saved once in admin_settings and can be edited any time.
   Each saved proforma gets the next number for the financial year: BGX/PI/2026-27/001.
   BGXAdminProforma.init({ sb, members, plans, demo }) is called when the panel opens. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var sb = null, DEMO = false, started = false, members = [], plans = [], currentId = null, cache = [];
  var SETTINGS_KEY = 'proforma_seller';
  var STATES = ['Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Outside India'];
  var SELLER_DEFAULT = { name: 'BuyGenix Solutions', addr: 'Delhi, India', state: 'Delhi', gstin: '', pan: '', email: 'Info@buygenixsolutions.com', phone: '+91 87967 87594', bank: '',
    terms: 'Membership starts on receipt of full payment and runs for 365 days from activation.\nPrices are in Indian rupees. GST is charged at 18%.\nThis is a proforma invoice, not a tax invoice. The tax invoice is issued after payment.' };
  var SF = ['name', 'addr', 'state', 'gstin', 'pan', 'email', 'phone', 'bank', 'terms'];
  var BF = ['name', 'contact', 'addr', 'state', 'gstin', 'email', 'phone'];

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function num(v) { var n = parseFloat(v); return isFinite(n) ? n : 0; }
  function r2(n) { return Math.round(n * 100) / 100; }
  function inr(n) { return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function today() { var d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
  function fmtDate(s) { if (!s) return ''; var d = new Date(s + 'T00:00:00'); return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
  function addDays(s, n) { if (!s || !(n > 0)) return ''; var d = new Date(s + 'T00:00:00'); d.setDate(d.getDate() + n); return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
  function lines(a) { return a.filter(function (x) { return x != null && String(x).trim() !== ''; }).join('\n'); }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function status(id, msg, kind) { var s = $(id); if (!s) return; s.textContent = msg || ''; s.className = 'mt-status' + (kind ? ' ' + kind : ''); if (msg && kind === 'ok') setTimeout(function () { if (s.textContent === msg) s.textContent = ''; }, 3500); }
  function fy(dateStr) { var d = dateStr ? new Date(dateStr + 'T00:00:00') : new Date(); var y = d.getMonth() >= 3 ? d.getFullYear() : d.getFullYear() - 1; return y + '-' + String((y + 1) % 100).padStart(2, '0'); }

  /* Amount in words, Indian system (crore, lakh, thousand) */
  var ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  var TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  function two(n) { return n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : ''); }
  function three(n) { var h = Math.floor(n / 100), r = n % 100; return (h ? ONES[h] + ' Hundred' + (r ? ' ' : '') : '') + (r ? two(r) : ''); }
  function words(amount) {
    var rupees = Math.floor(amount), paise = Math.round((amount - rupees) * 100);
    if (paise === 100) { rupees += 1; paise = 0; }
    function w(n) {
      if (n === 0) return 'Zero';
      var out = [], cr = Math.floor(n / 10000000); n %= 10000000;
      var lk = Math.floor(n / 100000); n %= 100000; var th = Math.floor(n / 1000); n %= 1000;
      if (cr) out.push(w(cr) + ' Crore'); if (lk) out.push(two(lk) + ' Lakh'); if (th) out.push(two(th) + ' Thousand'); if (n) out.push(three(n));
      return out.join(' ');
    }
    return 'Rupees ' + w(rupees) + (paise ? ' and ' + two(paise) + ' Paise' : '') + ' Only';
  }

  /* ---------- storage ---------- */
  var store = {
    getSettings: function () {
      if (DEMO) return Promise.resolve(lsGet('bgx_admin_demo_seller', null));
      return sb.from('admin_settings').select('value').eq('key', SETTINGS_KEY).maybeSingle().then(function (r) { if (r.error) throw r.error; return r.data ? r.data.value : null; });
    },
    saveSettings: function (v) {
      if (DEMO) { lsSet('bgx_admin_demo_seller', v); return Promise.resolve(); }
      return sb.from('admin_settings').upsert({ key: SETTINGS_KEY, value: v, updated_at: new Date().toISOString() }, { onConflict: 'key' }).then(function (r) { if (r.error) throw r.error; });
    },
    list: function () {
      if (DEMO) return Promise.resolve(lsGet('bgx_admin_demo_pi', []));
      return sb.from('admin_proformas').select('id,number,client_name,total,invoice_date,created_at,data').order('created_at', { ascending: false }).limit(200)
        .then(function (r) { if (r.error) throw r.error; return r.data || []; });
    },
    save: function (row) {
      if (DEMO) {
        var all = lsGet('bgx_admin_demo_pi', []);
        if (row.id) all = all.filter(function (x) { return x.id !== row.id; }); else row.id = 'demo-' + Date.now();
        if (all.some(function (x) { return x.number === row.number; })) return Promise.reject(new Error('duplicate'));
        row.created_at = new Date().toISOString(); all.unshift(row); lsSet('bgx_admin_demo_pi', all); return Promise.resolve({ id: row.id });
      }
      var id = row.id; delete row.id;
      var q = id ? sb.from('admin_proformas').update(row).eq('id', id).select('id').single() : sb.from('admin_proformas').insert(row).select('id').single();
      return q.then(function (r) { if (r.error) throw r.error; return r.data; });
    },
    del: function (id) {
      if (DEMO) { lsSet('bgx_admin_demo_pi', lsGet('bgx_admin_demo_pi', []).filter(function (x) { return x.id !== id; })); return Promise.resolve(); }
      return sb.from('admin_proformas').delete().eq('id', id).then(function (r) { if (r.error) throw r.error; });
    }
  };

  /* ---------- form helpers ---------- */
  function seller() { var o = {}; SF.forEach(function (k) { o[k] = $('ps_' + k).value.trim(); }); return o; }
  function setSeller(v) { v = v || {}; SF.forEach(function (k) { $('ps_' + k).value = v[k] != null ? v[k] : (SELLER_DEFAULT[k] || ''); }); $('psTitle').textContent = $('ps_name').value || 'Our details'; }
  function buyer() { var o = {}; BF.forEach(function (k) { o[k] = $('pb_' + k).value.trim(); }); return o; }
  function rows() { return Array.prototype.map.call($('piItems').children, function (tr) { var o = {}; tr.querySelectorAll('input').forEach(function (i) { o[i.dataset.k] = i.value.trim(); }); return o; }).filter(function (r) { return r.desc || r.rate; }); }
  function addRow(d) {
    d = d || {}; var tr = el('tr');
    [['desc', 'Item or service', ''], ['sac', 'SAC', 'num'], ['qty', '', 'num', 1], ['rate', '', 'num', 1]].forEach(function (c) {
      var td = el('td'), i = el('input'); i.dataset.k = c[0]; if (c[1]) i.placeholder = c[1]; if (c[2]) i.className = c[2]; if (c[3]) { i.type = 'number'; i.min = '0'; i.step = 'any'; }
      i.value = d[c[0]] != null ? d[c[0]] : (c[0] === 'qty' ? '1' : ''); td.appendChild(i); tr.appendChild(td);
    });
    var td = el('td'), x = el('button', 'del', '×'); x.type = 'button'; x.setAttribute('aria-label', 'Remove item');
    x.onclick = function () { tr.remove(); if (!$('piItems').children.length) addRow(); render(); }; td.appendChild(x); tr.appendChild(td);
    $('piItems').appendChild(tr);
  }
  function setRows(list) { $('piItems').textContent = ''; (list && list.length ? list : [{}]).forEach(addRow); }
  function gstMode(b, s) {
    var m = $('pi_gst').value; if (m !== 'auto') return m;
    if (!b.state || !s.state) return 'igst';
    if (b.state === 'Outside India') return 'none';
    return b.state === s.state ? 'cgst' : 'igst';
  }
  function calc() {
    var items = rows(), sub = 0;
    items.forEach(function (r) { r.amount = r2(num(r.qty) * num(r.rate)); sub += r.amount; });
    sub = r2(sub);
    var mode = gstMode(buyer(), seller()), cg = 0, sg = 0, ig = 0;
    if (mode === 'cgst') { cg = r2(sub * 0.09); sg = r2(sub * 0.09); } else if (mode === 'igst') { ig = r2(sub * 0.18); }
    var total = r2(sub + cg + sg + ig);
    return { items: items, sub: sub, mode: mode, cgst: cg, sgst: sg, igst: ig, total: total };
  }

  /* ---------- preview ---------- */
  function party(label, name, body) { var d = el('div'); d.appendChild(el('b', '', label)); if (name) d.appendChild(el('p', 'nm', name)); d.appendChild(el('p', '', body || '')); return d; }
  function render() {
    if (!started) return;
    var s = seller(), b = buyer(), c = calc(), p = $('piPaper'); p.textContent = '';
    $('psTitle').textContent = s.name || 'Our details';
    var top = el('div', 'inv-top'), brand = el('div', 'inv-brand'), im = el('img'); im.src = '/assets/logo-full.png'; im.alt = 'BuyGenix Solutions'; brand.appendChild(im);
    var meta = el('div', 'inv-meta');
    [['No.', $('pi_no').value.trim() || '-'], ['Date:', fmtDate($('pi_date').value) || '-'], ['Valid until:', addDays($('pi_date').value, num($('pi_valid').value))]].forEach(function (x) { if (!x[1]) return; var d = el('div'); d.appendChild(document.createTextNode(x[0] + ' ')); d.appendChild(el('b', '', x[1])); meta.appendChild(d); });
    top.appendChild(brand); top.appendChild(meta); p.appendChild(top);
    var t = el('div', 'inv-title'); t.appendChild(el('h3', '', 'PROFORMA INVOICE')); t.appendChild(el('div', 'nm', s.name)); p.appendChild(t);
    var pr = el('div', 'inv-parties');
    pr.appendChild(party('From', s.name, lines([s.addr, s.gstin && 'GSTIN: ' + s.gstin, s.pan && 'PAN: ' + s.pan, s.email, s.phone])));
    pr.appendChild(party('Bill to', b.name || 'Client name', lines([b.contact && b.contact !== b.name ? 'Attn: ' + b.contact : '', b.addr, b.state && b.state !== 'Outside India' && b.addr.indexOf(b.state) < 0 ? b.state : '', b.gstin && 'GSTIN: ' + b.gstin, b.email, b.phone])));
    p.appendChild(pr);
    var terms = el('div', 'inv-terms');
    [['Place of supply', b.state || '-'], ['GST', c.mode === 'cgst' ? 'CGST 9% + SGST 9%' : c.mode === 'igst' ? 'IGST 18%' : 'Not charged'], ['Payment due', $('pi_due').value.trim() || '-']].forEach(function (x) { var d = el('div'); d.appendChild(el('b', '', x[0])); d.appendChild(el('span', '', x[1])); terms.appendChild(d); });
    p.appendChild(terms);
    var w = el('div', 'tl-scroll'), tb = el('table', 'inv-table'), th = el('thead'), hr = el('tr');
    ['#', 'Description', 'SAC', 'Qty', 'Rate', 'Amount'].forEach(function (h, i) { hr.appendChild(el('th', i >= 3 ? 'r' : '', h)); }); th.appendChild(hr); tb.appendChild(th);
    var body = el('tbody');
    if (!c.items.length) { var r0 = el('tr'), td0 = el('td', 'inv-empty', 'Add an item on the left'); td0.colSpan = 6; r0.appendChild(td0); body.appendChild(r0); }
    c.items.forEach(function (r, i) { var tr = el('tr'); [String(i + 1), r.desc, r.sac, r.qty, r.rate ? inr(num(r.rate)) : '', inr(r.amount)].forEach(function (v, j) { tr.appendChild(el('td', j >= 3 ? 'r' : '', v)); }); body.appendChild(tr); });
    tb.appendChild(body); w.appendChild(tb); p.appendChild(w);
    var sm = el('div', 'inv-sum');
    [['Taxable value', inr(c.sub)], c.cgst ? ['CGST 9%', inr(c.cgst)] : null, c.sgst ? ['SGST 9%', inr(c.sgst)] : null, c.igst ? ['IGST 18%', inr(c.igst)] : null, ['Total', inr(c.total)]].forEach(function (x, i, a) { if (!x) return; var d = el('div', i === a.length - 1 ? 'tot' : ''); d.appendChild(el('span', '', x[0])); d.appendChild(el('span', '', x[1])); sm.appendChild(d); });
    p.appendChild(sm);
    p.appendChild(el('p', 'api-words', 'Amount in words: ' + words(c.total)));
    var f = el('div', 'inv-foot'), l = el('div');
    if (s.bank) { l.appendChild(el('b', '', 'Bank details')); l.appendChild(el('p', '', s.bank)); }
    var notes = $('pi_notes').value.trim();
    if (notes) { var b1 = el('b', '', 'Notes'); if (s.bank) b1.style.marginTop = '10px'; l.appendChild(b1); l.appendChild(el('p', '', notes)); }
    var sg = el('div', 'inv-sign'); sg.appendChild(el('div', '', 'For ' + (s.name || 'BuyGenix Solutions'))); sg.appendChild(el('div', 'ln', 'Authorised signatory'));
    f.appendChild(l); f.appendChild(sg); p.appendChild(f);
    if (s.terms) { var tm = el('div', 'inv-decl'); tm.appendChild(el('b', '', 'Terms')); tm.appendChild(el('p', '', s.terms)); p.appendChild(tm); }
    $('piBankWarn').hidden = !!s.bank;
  }

  /* ---------- numbering ---------- */
  function nextNumber(list) {
    var pre = 'BGX/PI/' + fy($('pi_date').value) + '/', max = 0;
    (list || cache).forEach(function (x) { if (x.number && x.number.indexOf(pre) === 0) { var n = parseInt(x.number.slice(pre.length), 10); if (n > max) max = n; } });
    return pre + String(max + 1).padStart(3, '0');
  }

  /* ---------- saved list ---------- */
  function drawList() {
    var box = $('piList'); box.textContent = '';
    var q = $('piSearch').value.trim().toLowerCase();
    var list = cache.filter(function (x) { return !q || (x.number + ' ' + (x.client_name || '')).toLowerCase().indexOf(q) >= 0; });
    if (!list.length) { box.appendChild(el('div', 'empty-row', cache.length ? 'No proforma matches your search.' : 'No proforma invoices yet. Your saved ones will appear here.')); return; }
    list.forEach(function (x) {
      var row = el('div', 'api-row'); if (x.id === currentId) row.classList.add('on');
      var a = el('div', 'api-c'); a.appendChild(el('b', '', x.number)); a.appendChild(el('span', '', fmtDate(x.invoice_date) || ''));
      var b = el('div', 'api-c'); b.appendChild(el('b', '', x.client_name || '-')); b.appendChild(el('span', '', inr(num(x.total))));
      var act = el('div', 'api-act');
      var o = el('button', 'mt-btn', 'Open'); o.type = 'button'; o.onclick = function () { open(x); };
      var d = el('button', 'mt-btn del', 'Delete'); d.type = 'button'; d.onclick = function () { if (!confirm('Delete proforma ' + x.number + '? This cannot be undone.')) return; store.del(x.id).then(function () { if (currentId === x.id) newPi(); return refresh(); }).then(function () { status('piStatus', 'Deleted.', 'ok'); }).catch(function () { status('piStatus', 'Could not delete. Try again.', 'err'); }); };
      act.appendChild(o); act.appendChild(d); row.appendChild(a); row.appendChild(b); row.appendChild(act); box.appendChild(row);
    });
  }
  function refresh() { return store.list().then(function (l) { cache = l; drawList(); if (!currentId) $('pi_no').value = nextNumber(); render(); }).catch(function () { status('piStatus', 'Could not load saved proformas.', 'err'); }); }
  function open(x) {
    var d = x.data || {}; currentId = x.id;
    $('pi_no').value = x.number; $('pi_date').value = d.date || x.invoice_date || today(); $('pi_valid').value = d.valid || '7'; $('pi_due').value = d.due || ''; $('pi_gst').value = d.gst || 'auto'; $('pi_notes').value = d.notes || ''; $('pi_member').value = d.client_id || '';
    BF.forEach(function (k) { $('pb_' + k).value = (d.buyer || {})[k] || ''; }); setRows(d.items); render(); drawList();
    $('piFormTop').scrollIntoView({ behavior: 'smooth', block: 'start' }); status('piStatus', 'Opened ' + x.number + '.', 'ok');
  }
  function newPi() {
    currentId = null; ['pi_due', 'pi_notes'].forEach(function (k) { $(k).value = ''; }); $('pi_date').value = today(); $('pi_valid').value = '7'; $('pi_gst').value = 'auto'; $('pi_member').value = '';
    BF.forEach(function (k) { $('pb_' + k).value = ''; }); setRows([]); $('pi_no').value = nextNumber(); render(); drawList();
  }
  function save() {
    var b = buyer(), c = calc(), no = $('pi_no').value.trim();
    if (!no) return status('piStatus', 'Add a proforma number.', 'err');
    if (!b.name) return status('piStatus', 'Add the client name.', 'err');
    if (!c.items.length) return status('piStatus', 'Add at least one item.', 'err');
    status('piStatus', 'Saving...');
    var row = { id: currentId, number: no, client_id: $('pi_member').value || null, client_name: b.name, total: c.total, invoice_date: $('pi_date').value || today(),
      data: { date: $('pi_date').value, valid: $('pi_valid').value, due: $('pi_due').value, gst: $('pi_gst').value, notes: $('pi_notes').value, client_id: $('pi_member').value || '', buyer: b, items: c.items.map(function (r) { return { desc: r.desc, sac: r.sac, qty: r.qty, rate: r.rate }; }), seller: seller(), totals: { sub: c.sub, cgst: c.cgst, sgst: c.sgst, igst: c.igst, total: c.total, mode: c.mode } } };
    if (row.client_id && !/^[0-9a-f-]{36}$/i.test(row.client_id)) row.client_id = null;
    store.save(row).then(function (r) { currentId = r.id; return refresh(); }).then(function () { status('piStatus', 'Saved as ' + no + '.', 'ok'); })
      .catch(function (e) { status('piStatus', /duplicate|unique/i.test(String(e && (e.message || e.code))) ? 'This number is already used. Change the number or press New.' : 'Could not save. Check your connection and try again.', 'err'); });
  }
  function printPi() {
    render();
    var p = $('piPaper'), w = null, title = 'Proforma ' + ($('pi_no').value.trim().replace(/\//g, '-') || '') + (buyer().name ? ' - ' + buyer().name : '');
    try { w = window.open('', '_blank'); } catch (e) { w = null; }
    if (!w) { alert('Allow pop-ups for this site to download the PDF.'); return; }
    var t = title.replace(/[<>&"]/g, '');
    w.document.open();
    w.document.write('<!doctype html><html lang="en"><head><meta charset="utf-8"><base href="' + location.origin + '/"><title>' + t + '</title>' +
      '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">' +
      '<link rel="stylesheet" href="css/tools.css?v=20261009a"><link rel="stylesheet" href="css/member-tools.css?v=20261009a"><link rel="stylesheet" href="css/admin-proforma.css?v=20261009a">' +
      '<style>@page{size:A4;margin:12mm}html,body{margin:0;background:#fff;font-family:Inter,system-ui,sans-serif}.mt-sheet{max-width:780px;margin:0 auto;padding:24px}@media print{.mt-sheet{padding:0;max-width:none}}</style>' +
      '</head><body><div class="mt-sheet">' + p.outerHTML.replace(/class="tl-paper"/, 'class="tl-paper mt-print"') + '</div>' +
      '<script>window.addEventListener("load",function(){setTimeout(function(){window.focus();window.print();},350)});<\/script></body></html>');
    w.document.close();
  }
  function fillMember() {
    var id = $('pi_member').value, m = members.filter(function (x) { return String(x.id) === id; })[0];
    if (!m) return;
    $('pb_name').value = m.business_name || m.name || ''; $('pb_contact').value = m.name || ''; $('pb_addr').value = lines([m.city, m.state && m.state !== m.city ? m.state : '']).replace(/\n/g, ', ');
    $('pb_state').value = STATES.indexOf(m.state) >= 0 ? m.state : ''; $('pb_gstin').value = m.gstin || ''; $('pb_email').value = m.email || ''; $('pb_phone').value = m.phone || '';
    var plan = plans.filter(function (p) { return String(p.name || '').toLowerCase() === String(m.plan || '').toLowerCase(); })[0];
    if (plan && !rows().length) setRows([{ desc: 'BuyGenix ' + plan.name + ' Membership (12 months)', qty: '1', rate: String(plan.price_monthly || '') }]);
    render();
  }

  function fillMembers() {
    var ms = $('pi_member'), keep = ms.value; ms.textContent = ''; ms.appendChild(new Option('Choose a member or fill in below', ''));
    members.slice().sort(function (a, b) { return String(a.business_name || a.name || '').localeCompare(String(b.business_name || b.name || '')); })
      .forEach(function (m) { ms.appendChild(new Option((m.business_name || m.name || 'Member') + (m.business_name && m.name ? ' - ' + m.name : '') + (m.plan ? ' (' + m.plan + ')' : ''), m.id)); });
    ms.value = keep;
  }
  function init() {
    var stSel = [$('ps_state'), $('pb_state')];
    stSel.forEach(function (s) { s.appendChild(new Option('Select state', '')); STATES.forEach(function (x) { s.appendChild(new Option(x, x)); }); });
    var ms = $('pi_member'); fillMembers();
    var pp = $('piPlan'); pp.appendChild(new Option('Add a membership plan', ''));
    plans.forEach(function (p, i) { pp.appendChild(new Option(p.name + ' - ' + inr(num(p.price_monthly)) + ' a year', String(i))); });
    pp.onchange = function () { var p = plans[+this.value]; if (!p) return; var cur = rows(); if (!cur.length) $('piItems').textContent = ''; addRow({ desc: 'BuyGenix ' + p.name + ' Membership (12 months)', qty: '1', rate: String(p.price_monthly || '') }); this.value = ''; render(); };
    $('piAdd').onclick = function () { addRow(); };
    ms.onchange = fillMember;
    $('ap-proforma').addEventListener('input', render); $('ap-proforma').addEventListener('change', function (e) { if (e.target.id === 'pi_date' && !currentId) $('pi_no').value = nextNumber(); render(); });
    $('piItems').addEventListener('input', render);
    $('piSave').onclick = save; $('piNew').onclick = newPi; $('piPrint').onclick = printPi; $('piSearch').oninput = drawList;
    $('psSave').onclick = function () { status('psStatus', 'Saving...'); store.saveSettings(seller()).then(function () { status('psStatus', 'Saved. Used on every new proforma.', 'ok'); }).catch(function () { status('psStatus', 'Could not save. Try again.', 'err'); }); };
    $('psReset').onclick = function () { if (confirm('Fill in the default BuyGenix details? Your bank details stay as they are.')) { var bank = $('ps_bank').value; setSeller(SELLER_DEFAULT); $('ps_bank').value = bank; render(); } };
    $('pi_date').value = today(); $('pi_valid').value = '7'; setRows([]);
    store.getSettings().then(function (v) { setSeller(v || SELLER_DEFAULT); if (!v || !v.bank) $('piSeller').open = true; render(); }).catch(function () { setSeller(SELLER_DEFAULT); render(); });
    refresh();
    if (DEMO) $('piDemo').hidden = false;
  }

  window.BGXAdminProforma = {
    init: function (o) {
      o = o || {};
      members = o.members || members; plans = o.plans || plans;
      if (started) { fillMembers(); return; }
      started = true; sb = o.sb || null; DEMO = !!(o.demo && LOCAL);
      init(); render();
    }
  };
})();
