/* ═══════════════════════════════════════════════════════════
   BuyGenix Solutions — Supabase Config & Shared API
   Include this file in EVERY HTML page before any other script

   SETUP:
   1. Go to your Supabase project → Settings → API
   2. Copy "Project URL" → paste as SUPABASE_URL below
   3. Copy "anon public" key → paste as SUPABASE_ANON_KEY below
   4. Save. Done.
═══════════════════════════════════════════════════════════ */

/* ── YOUR SUPABASE CREDENTIALS ──
   Replace these two values with your own from supabase.com → Settings → API */
const SUPABASE_URL      = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_PUBLIC_KEY';

/* ── Load Supabase JS client from CDN ── */
const _sbScript = document.createElement('script');
_sbScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
_sbScript.onload = () => {
  window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('✅ Supabase connected');
  /* Fire custom event so pages know db is ready */
  document.dispatchEvent(new Event('sbReady'));
};
document.head.appendChild(_sbScript);

/* ════════════════════════════════════════
   PLAN DEFINITIONS (same across all pages)
════════════════════════════════════════ */
window.PLANS = {
  none:         { label:'No Plan',          limit:0,     price:0,      color:'#7A9BBD' },
  starter:      { label:'Starter Plan',     limit:100,   price:4999,   color:'#4A6A8A' },
  growth:       { label:'Growth Plan',      limit:500,   price:12999,  color:'#B8860B' },
  professional: { label:'Professional Plan',limit:2000,  price:24999,  color:'#1B3A5C' },
  enterprise:   { label:'Enterprise Plan',  limit:99999, price:0,      color:'#0B1929' },
};

/* ════════════════════════════════════════
   COUNTRIES (50+)
════════════════════════════════════════ */
window.COUNTRIES = [
  'UAE','USA','Germany','UK','Australia','Japan','Singapore','Canada',
  'Saudi Arabia','Belgium','Egypt','Austria','France','Italy','Netherlands',
  'South Korea','Malaysia','Thailand','Indonesia','South Africa','Kenya',
  'Nigeria','Brazil','Mexico','Turkey','Israel','Qatar','Kuwait','Bahrain',
  'Oman','Jordan','New Zealand','Spain','Portugal','Sweden','Norway',
  'Denmark','Finland','Poland','Czech Republic','Hungary','Romania',
  'Greece','Vietnam','Philippines','Bangladesh','Sri Lanka','Argentina',
  'Colombia','Peru','Chile','Morocco','Tanzania','Ghana','Ethiopia',
  'Pakistan','Myanmar','Cambodia','Laos','Nepal','Afghanistan'
];

/* ════════════════════════════════════════
   PRODUCT CATEGORIES
════════════════════════════════════════ */
window.CATEGORIES = {
  'Textiles & Fabrics':     ['Cotton Fabric','Silk Fabric','Polyester Fabric','Woolen Fabric','Denim','Linen','Jute Fabric','Embroidered Fabric','Home Textiles','Technical Textiles'],
  'Spices & Condiments':    ['Turmeric','Black Pepper','Cardamom','Cumin','Coriander','Red Chilli','Ginger','Cloves','Cinnamon','Nutmeg','Fenugreek','Star Anise'],
  'Rice & Grains':          ['Basmati Rice','Non-Basmati Rice','Wheat','Maize','Sorghum','Millet','Quinoa','Oats','Barley','Broken Rice'],
  'Organic Food':           ['Organic Turmeric','Organic Rice','Organic Wheat','Organic Pulses','Organic Tea','Organic Coffee','Organic Honey','Organic Coconut Oil','Organic Ghee'],
  'Handicrafts & Artware':  ['Brass Handicrafts','Marble Handicrafts','Wooden Handicrafts','Ceramic Artware','Leather Goods','Jute Products','Block Print Items','Metal Sculptures','Terracotta'],
  'Garments & Apparel':     ["Men's Shirts","Women's Kurtas","Kids Wear","Denim Jeans","Ethnic Wear","Sportswear","Nightwear","Uniforms","Fashion Accessories"],
  'Gems & Jewellery':       ['Gold Jewellery','Silver Jewellery','Diamond Jewellery','Gemstones','Costume Jewellery','Handmade Jewellery'],
  'Chemicals & Pharma':     ['Bulk Drugs','Formulations','Dyes','Pigments','Agro Chemicals','Specialty Chemicals','Cosmetic Ingredients'],
  'Engineering Goods':      ['Auto Parts','Castings','Forgings','Pumps','Valves','Hand Tools','Fasteners','Electrical Equipment'],
  'Leather Products':       ['Leather Shoes','Leather Bags','Leather Wallets','Leather Belts','Leather Jackets','Leather Gloves'],
  'Fresh Produce':          ['Mangoes','Grapes','Pomegranates','Bananas','Onions','Potatoes','Tomatoes','Baby Corn','Okra','Bitter Gourd'],
  'Processed Food':         ['Pickles','Chutneys','Sauces','Ready Meals','Frozen Food','Snacks','Beverages','Dairy Products'],
};

/* ════════════════════════════════════════
   SHARED DB HELPERS
   Usage: await DB.getClient(email)
════════════════════════════════════════ */
window.DB = {

  /* ── AUTH ── */
  async loginClient(email, otp) {
    try {
      const { data, error } = await sb
        .from('clients')
        .select('*')
        .ilike('email', email.trim())
        .eq('otp', otp.trim())
        .maybeSingle();
      if (error) return { success: false, error: 'Database error: ' + error.message };
      if (!data) return { success: false, error: 'Invalid email or OTP. Please check and try again.' };
      if (data.plan_status === 'expired')
        return { success: false, error: 'Your membership has expired. Please contact BuyGenix to renew.' };
      return { success: true, client: data };
    } catch(e) {
      return { success: false, error: 'Connection error. Please try again in a moment.' };
    }
  },

  async loginAdmin(username, password) {
    try {
      const { data, error } = await sb
        .from('admin_users')
        .select('*')
        .ilike('username', username.trim())
        .eq('password', password)
        .maybeSingle();
      if (error) return { success: false, error: 'Database error: ' + error.message };
      if (!data) return { success: false, error: 'Invalid username or password.' };
      if (!data.is_active) return { success: false, error: 'Account inactive. Contact admin.' };
      return { success: true, admin: data };
    } catch(e) {
      return { success: false, error: 'Connection error. Please try again.' };
    }
  },

  /* ── CLIENTS ── */
  async getClients() {
    const { data } = await sb
      .from('client_dashboard')
      .select('*')
      .order('join_date', { ascending: false });
    return data || [];
  },

  async getClient(id) {
    const { data } = await sb
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    return data;
  },

  async addClient(client) {
    const { data, error } = await sb.from('clients').insert([client]).select().single();
    return { data, error };
  },

  async updateClient(id, updates) {
    const { data, error } = await sb.from('clients').update(updates).eq('id', id).select().single();
    return { data, error };
  },

  /* ── MEMBERSHIP ASSIGNMENT ──
     Admin assigns a plan to a client.
     This is the ONLY way a client gets a plan — not self-service. */
  async assignMembership({ clientId, plan, billingCycle, assignedBy }) {
    const planInfo = PLANS[plan];
    if (!planInfo) return { error: 'Invalid plan' };

    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + (billingCycle === 'annual' ? 12 : 1));

    /* 1. Record in membership_assignments table */
    const { error: maErr } = await sb.from('membership_assignments').insert([{
      client_id: clientId,
      plan,
      billing_cycle: billingCycle,
      lead_limit: planInfo.limit,
      price: planInfo.price,
      assigned_by: assignedBy,
      start_date: new Date().toISOString().split('T')[0],
      end_date: renewalDate.toISOString().split('T')[0],
      status: 'active',
    }]);
    if (maErr) return { error: maErr.message };

    /* 2. Update client's plan fields */
    const { error: cErr } = await sb.from('clients').update({
      plan,
      billing_cycle: billingCycle,
      lead_limit: planInfo.limit,
      plan_status: 'active',
      renewal_date: renewalDate.toISOString().split('T')[0],
      membership_assigned_by: assignedBy,
      membership_assigned_at: new Date().toISOString(),
    }).eq('id', clientId);
    if (cErr) return { error: cErr.message };

    /* 3. Add to purchase history */
    await sb.from('purchases').insert([{
      client_id: clientId,
      description: `${planInfo.label} — ${billingCycle === 'annual' ? 'Annual' : 'Monthly'}`,
      quantity: `${planInfo.limit} Leads`,
      amount: planInfo.price,
      status: 'active',
    }]);

    return { success: true };
  },

  /* ── BUY LEADS ── */
  async getLeadPool(filters = {}) {
    let query = sb.from('buy_leads').select('*').order('created_at', { ascending: false });
    if (filters.country)  query = query.eq('country', filters.country);
    if (filters.category) query = query.eq('category', filters.category);
    if (filters.status)   query = query.eq('status', filters.status);
    if (filters.quality)  query = query.eq('quality', filters.quality);
    if (filters.search)   query = query.ilike('company', `%${filters.search}%`);
    const { data } = await query;
    return data || [];
  },

  async addLead(lead) {
    const { data, error } = await sb.from('buy_leads').insert([lead]).select().single();
    return { data, error };
  },

  /* ── LEAD ASSIGNMENT ──
     Admin assigns specific leads to a client.
     Client's leads_used count increments automatically. */
  async assignLeads(leadIds, clientId, assignedBy) {
    const rows = leadIds.map(lid => ({
      lead_id: lid,
      client_id: clientId,
      assigned_by: assignedBy,
    }));

    /* Insert assignments (ignore duplicates) */
    const { error } = await sb.from('lead_assignments').upsert(rows, { onConflict: 'lead_id,client_id' });
    if (error) return { error: error.message };

    /* Update lead status to 'assigned' */
    await sb.from('buy_leads').update({ status: 'assigned' }).in('id', leadIds);

    /* Increment client's leads_used */
    const { data: client } = await sb.from('clients').select('leads_used').eq('id', clientId).single();
    await sb.from('clients').update({ leads_used: (client?.leads_used || 0) + leadIds.length }).eq('id', clientId);

    return { success: true, count: leadIds.length };
  },

  /* ── CLIENT'S ASSIGNED LEADS ──
     Fetches leads assigned to one client.
     contact details only returned if plan is active. */
  async getClientLeads(clientId, planStatus) {
    const { data } = await sb
      .from('lead_assignments')
      .select(`
        lead_id,
        assigned_at,
        buy_leads (
          id, company, country, contact_name, email, phone,
          category, product, quantity, quality, status
        )
      `)
      .eq('client_id', clientId)
      .eq('is_visible', true)
      .order('assigned_at', { ascending: false });

    if (!data) return [];

    return data.map(row => {
      const lead = row.buy_leads;
      /* Blur contact details if plan not active */
      if (planStatus !== 'active') {
        return { ...lead, company:'██████ ██████', contact_name:'██████', email:'██████@██████.com', phone:'+XX XXXX XXXX', _locked: true };
      }
      return { ...lead, _locked: false };
    });
  },

  /* ── MESSAGES ── */
  async getMessages(clientId) {
    const { data } = await sb
      .from('messages')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: true });
    return data || [];
  },

  async sendMessage(clientId, sender, senderName, text) {
    const { error } = await sb.from('messages').insert([{
      client_id: clientId, sender, sender_name: senderName, text
    }]);
    return { error };
  },

  async markMessagesRead(clientId) {
    await sb.from('messages').update({ is_read: true }).eq('client_id', clientId).eq('sender', 'client');
  },

  /* ── TICKETS ── */
  async submitTicket(clientId, type, priority, description) {
    const { data, error } = await sb.from('tickets').insert([{
      client_id: clientId, type, priority, description
    }]).select().single();
    return { data, error };
  },

  async getTickets(filters = {}) {
    let q = sb.from('tickets').select('*, clients(name, business_name)').order('created_at', { ascending: false });
    if (filters.status) q = q.eq('status', filters.status);
    const { data } = await q;
    return data || [];
  },

  async resolveTicket(id) {
    await sb.from('tickets').update({ status:'resolved', resolved_at: new Date().toISOString() }).eq('id', id);
  },

  /* ── ENQUIRIES (from website contact form) ── */
  async submitEnquiry(enquiry) {
    const { data, error } = await sb.from('enquiries').insert([enquiry]).select().single();
    return { data, error };
  },

  async getEnquiries() {
    const { data } = await sb.from('enquiries').select('*').order('created_at', { ascending: false });
    return data || [];
  },

  /* ── ADMIN: RMs ── */
  async getRMs() {
    const { data } = await sb.from('admin_users').select('*').in('role', ['rm','admin','superadmin']).eq('is_active', true);
    return data || [];
  },

  async addRM(rm) {
    const { data, error } = await sb.from('admin_users').insert([{ ...rm, role:'rm' }]).select().single();
    return { data, error };
  },

  /* ── ANALYTICS ── */
  async getAnalytics() {
    const [clients, leads, tickets, messages] = await Promise.all([
      sb.from('clients').select('plan, plan_status, leads_used, lead_limit, billing_cycle'),
      sb.from('buy_leads').select('country, category, status, quality'),
      sb.from('tickets').select('status, priority'),
      sb.from('unread_message_counts').select('*'),
    ]);
    return {
      clients: clients.data || [],
      leads:   leads.data   || [],
      tickets: tickets.data || [],
      unread:  messages.data|| [],
    };
  },

  /* ── REALTIME SUBSCRIPTION ──
     Call this to get live chat updates */
  subscribeToMessages(clientId, callback) {
    return sb.channel('messages-' + clientId)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `client_id=eq.${clientId}`,
      }, payload => callback(payload.new))
      .subscribe();
  },

  /* ── PURCHASES / HISTORY ── */
  async getPurchases(clientId) {
    const { data } = await sb.from('purchases').select('*').eq('client_id', clientId).order('created_at', { ascending: false });
    return data || [];
  },

  /* ── REFERRALS ── */
  async getReferrals(clientId) {
    const { data } = await sb.from('referrals').select('*').eq('referrer_id', clientId).order('created_at', { ascending: false });
    return data || [];
  },

  async addReferral(referral) {
    const { data, error } = await sb.from('referrals').insert([referral]).select().single();
    return { data, error };
  },
};

console.log('✅ BGX Config loaded. DB helpers ready.');
