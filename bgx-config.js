/* ═══════════════════════════════════════════════════════════
   BuyGenix Solutions — Complete Backend Config v3.0
   Include FIRST in every HTML page before any other script

   SETUP:
   1. Supabase → Settings → API → copy Project URL + anon key
   2. Replace the two values below
   3. NVIDIA AI: get free key from build.nvidia.com → replace below
   4. Done — all portals connect automatically
═══════════════════════════════════════════════════════════ */

/* ── YOUR CREDENTIALS ── */
const SUPABASE_URL      = 'https://qzaeshegpdoknsiuvidr.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'; /* replace with your actual key */

/* ── NVIDIA NIM AI (free tier) ──
   Get free API key: https://build.nvidia.com → sign up → API Keys
   Model: meta/llama-3.1-8b-instruct (free) */
const NVIDIA_API_KEY = 'YOUR_NVIDIA_API_KEY'; /* replace with your key from build.nvidia.com */
const NVIDIA_MODEL   = 'meta/llama-3.1-8b-instruct';
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

/* ════════════════════════════════════════
   PLAN DEFINITIONS
════════════════════════════════════════ */
window.PLANS = {
  none:         { label:'No Plan',          limit:0,     price:0,      pricePa:0,      color:'#7A9BBD' },
  starter:      { label:'Starter Plan',     limit:100,   price:4999,   pricePa:49999,  color:'#4A6A8A' },
  growth:       { label:'Growth Plan',      limit:500,   price:12999,  pricePa:129999, color:'#B8860B' },
  professional: { label:'Professional Plan',limit:2000,  price:24999,  pricePa:249999, color:'#1B3A5C' },
  enterprise:   { label:'Enterprise Plan',  limit:99999, price:0,      pricePa:0,      color:'#0B1929' },
};

/* ════════════════════════════════════════
   COUNTRIES
════════════════════════════════════════ */
window.COUNTRIES = [
  'UAE','USA','Germany','UK','Australia','Japan','Singapore','Canada',
  'Saudi Arabia','Belgium','Egypt','Austria','France','Italy','Netherlands',
  'South Korea','Malaysia','Thailand','Indonesia','South Africa','Kenya',
  'Nigeria','Brazil','Mexico','Turkey','Israel','Qatar','Kuwait','Bahrain',
  'Oman','Jordan','New Zealand','Spain','Portugal','Sweden','Norway',
  'Denmark','Finland','Poland','Czech Republic','Hungary','Romania',
  'Greece','Vietnam','Philippines','Bangladesh','Sri Lanka','Argentina',
  'Colombia','Peru','Chile','Morocco','Tanzania','Ghana','Pakistan',
  'Myanmar','Cambodia','Nepal','Sri Lanka','Rwanda','Uganda','Ethiopia'
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
   LOAD SUPABASE
════════════════════════════════════════ */
function _initSupabase() {
  if (window.supabase) {
    window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase connected');
    document.dispatchEvent(new Event('sbReady'));
    return;
  }
  const s = document.createElement('script');
  s.src = 'https://unpkg.com/@supabase/supabase-js@2';
  s.onload = () => {
    window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase connected');
    document.dispatchEvent(new Event('sbReady'));
  };
  s.onerror = () => {
    const s2 = document.createElement('script');
    s2.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    s2.onload = () => {
      window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('✅ Supabase connected (cdn fallback)');
      document.dispatchEvent(new Event('sbReady'));
    };
    document.head.appendChild(s2);
  };
  document.head.appendChild(s);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _initSupabase);
else _initSupabase();

/* ════════════════════════════════════════
   AI HELPER (NVIDIA NIM)
════════════════════════════════════════ */
window.AI = {
  async clientReply(client, userMsg) {
    if (!NVIDIA_API_KEY || NVIDIA_API_KEY === 'YOUR_NVIDIA_API_KEY') return null;
    try {
      const plan = PLANS[client.plan] || PLANS.none;
      const systemPrompt = `You are a helpful AI assistant for BuyGenix Solutions, India's B2B export platform.
Client: ${client.name} | Business: ${client.business_name||'—'} | Category: ${client.category||'—'}
Plan: ${plan.label} | Leads used: ${client.leads_used||0}/${client.lead_limit||0} | Renewal: ${client.renewal_date||'—'}
Be concise, professional, and helpful. Focus on export business, leads, and BuyGenix services.
For plan upgrades, direct to WhatsApp: +91 98181 87246.`;

      const res = await fetch(NVIDIA_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + NVIDIA_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: NVIDIA_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user',   content: userMsg }
          ],
          max_tokens: 512,
          temperature: 0.7,
        })
      });
      const data = await res.json();
      return data?.choices?.[0]?.message?.content || null;
    } catch(e) {
      console.warn('NVIDIA AI error:', e.message);
      return null;
    }
  }
};

/* ════════════════════════════════════════
   DB — ALL BACKEND FUNCTIONS
════════════════════════════════════════ */
window.DB = {

  /* ────────────────────────────────
     AUTH
  ──────────────────────────────── */
  async loginClient(email, otp) {
    try {
      const { data, error } = await sb
        .from('clients')
        .select('*')
        .ilike('email', email.trim())
        .eq('otp', otp.trim())
        .maybeSingle();
      if (error) return { success:false, error:'Database error: ' + error.message };
      if (!data)  return { success:false, error:'Invalid email or OTP. Please check and try again.' };
      if (data.plan_status === 'suspended') return { success:false, error:'Account suspended. Contact BuyGenix support.' };
      return { success:true, client:data };
    } catch(e) { return { success:false, error:'Connection error. Please try again.' }; }
  },

  async loginAdmin(username, password) {
    try {
      const { data, error } = await sb
        .from('admin_users')
        .select('*')
        .ilike('username', username.trim())
        .eq('password', password)
        .maybeSingle();
      if (error) return { success:false, error:'Database error: ' + error.message };
      if (!data)  return { success:false, error:'Invalid username or password.' };
      if (!data.is_active) return { success:false, error:'Account inactive. Contact admin.' };
      return { success:true, admin:data };
    } catch(e) { return { success:false, error:'Connection error. Please try again.' }; }
  },

  /* CLIENT SELF REGISTRATION */
  async registerClient({ name, business, email, phone, city, state, category }) {
    try {
      /* Check email not already registered */
      const { data: existing } = await sb.from('clients').select('id').ilike('email', email.trim()).maybeSingle();
      if (existing) return { success:false, error:'An account with this email already exists. Please log in.' };

      const otp = String(Math.floor(100000 + Math.random() * 900000));
      const { data, error } = await sb.from('clients').insert([{
        name: name.trim(),
        business_name: business.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        city: city.trim(),
        state: state.trim(),
        category,
        otp,
        plan: 'none',
        plan_status: 'pending',
        lead_limit: 0,
        leads_used: 0,
      }]).select().single();
      if (error) return { success:false, error: error.message };

      /* Auto-message from admin */
      await sb.from('messages').insert([{
        client_id: data.id,
        sender: 'rm',
        sender_name: 'BuyGenix Team',
        text: `Welcome to BuyGenix, ${name.split(' ')[0]}! 🎉 Your account is registered. Our team will review and activate your membership within 24 hours. Your login OTP is: ${otp}. For urgent queries, WhatsApp us at +91 98181 87246.`
      }]);

      console.log(`New registration: ${email} — OTP: ${otp}`);
      return { success:true, client:data, otp };
    } catch(e) { return { success:false, error:e.message }; }
  },

  /* ────────────────────────────────
     CLIENTS — FULL CRUD
  ──────────────────────────────── */
  async getClients() {
    try {
      const { data, error } = await sb.from('client_dashboard').select('*').order('join_date', { ascending:false });
      if (error) { console.error('getClients:', error.message); return []; }
      return data || [];
    } catch(e) { console.error('getClients:', e); return []; }
  },

  async getClient(id) {
    try {
      const { data, error } = await sb.from('client_dashboard').select('*').eq('id', id).maybeSingle();
      if (error) { console.error('getClient:', error.message); return null; }
      return data;
    } catch(e) { return null; }
  },

  async addClient(client) {
    try {
      const { data, error } = await sb.from('clients').insert([client]).select().single();
      if (error) return { success:false, error:error.message };
      /* Welcome message */
      await sb.from('messages').insert([{
        client_id: data.id, sender:'rm', sender_name:'BuyGenix Team',
        text: `Welcome to BuyGenix, ${client.name.split(' ')[0]}! Your account has been created. We'll activate your membership shortly. Login OTP: ${client.otp||'123456'}`
      }]);
      return { success:true, data };
    } catch(e) { return { success:false, error:e.message }; }
  },

  async updateClient(id, updates) {
    try {
      const { data, error } = await sb.from('clients').update(updates).eq('id', id).select().single();
      if (error) return { success:false, error:error.message };
      return { success:true, data };
    } catch(e) { return { success:false, error:e.message }; }
  },

  async deleteClient(id) {
    try {
      /* Delete related data first */
      await sb.from('lead_assignments').delete().eq('client_id', id);
      await sb.from('messages').delete().eq('client_id', id);
      await sb.from('tickets').delete().eq('client_id', id);
      await sb.from('purchases').delete().eq('client_id', id);
      await sb.from('referrals').delete().eq('referrer_id', id);
      const { error } = await sb.from('clients').delete().eq('id', id);
      if (error) return { success:false, error:error.message };
      return { success:true };
    } catch(e) { return { success:false, error:e.message }; }
  },

  async suspendClient(id, suspend=true) {
    return this.updateClient(id, { plan_status: suspend ? 'suspended' : 'active' });
  },

  /* ────────────────────────────────
     MEMBERSHIP — Admin assigns only
  ──────────────────────────────── */
  async assignMembership({ clientId, plan, billingCycle, assignedBy, rmId }) {
    try {
      const planInfo = PLANS[plan];
      if (!planInfo) return { success:false, error:'Invalid plan' };

      const renewalDate = new Date();
      renewalDate.setMonth(renewalDate.getMonth() + (billingCycle === 'annual' ? 12 : billingCycle === 'quarterly' ? 3 : 1));

      /* Record in membership_assignments */
      const { error: maErr } = await sb.from('membership_assignments').insert([{
        client_id: clientId, plan, billing_cycle: billingCycle,
        lead_limit: planInfo.limit, price: planInfo.price,
        assigned_by: assignedBy, status:'active',
        start_date: new Date().toISOString().split('T')[0],
        end_date: renewalDate.toISOString().split('T')[0],
      }]);
      if (maErr) return { success:false, error:maErr.message };

      /* Update client */
      const updates = {
        plan, billing_cycle: billingCycle,
        lead_limit: planInfo.limit, plan_status:'active',
        renewal_date: renewalDate.toISOString().split('T')[0],
        membership_assigned_by: assignedBy,
        membership_assigned_at: new Date().toISOString(),
      };
      if (rmId) updates.rm_id = rmId;
      const { error: cErr } = await sb.from('clients').update(updates).eq('id', clientId);
      if (cErr) return { success:false, error:cErr.message };

      /* Purchase record */
      await sb.from('purchases').insert([{
        client_id: clientId,
        description: `${planInfo.label} — ${billingCycle==='annual'?'Annual':billingCycle==='quarterly'?'Quarterly':'Monthly'}`,
        quantity: `${planInfo.limit >= 99999 ? 'Unlimited' : planInfo.limit} Leads`,
        amount: planInfo.price, status:'active',
      }]);

      return { success:true };
    } catch(e) { return { success:false, error:e.message }; }
  },

  /* Revoke membership */
  async revokeMembership(clientId) {
    return this.updateClient(clientId, { plan:'none', plan_status:'pending', lead_limit:0 });
  },

  /* ────────────────────────────────
     BUY LEADS — Full CRUD
  ──────────────────────────────── */
  async getLeadPool(filters = {}) {
    try {
      let q = sb.from('buy_leads').select('*').order('created_at', { ascending:false });
      if (filters.country)  q = q.eq('country', filters.country);
      if (filters.category) q = q.eq('category', filters.category);
      if (filters.status)   q = q.eq('status', filters.status);
      if (filters.quality)  q = q.eq('quality', filters.quality);
      if (filters.search)   q = q.ilike('company', `%${filters.search}%`);
      const { data, error } = await q;
      if (error) { console.error('getLeadPool:', error.message); return []; }
      return data || [];
    } catch(e) { return []; }
  },

  async addLead(lead) {
    try {
      const { data, error } = await sb.from('buy_leads').insert([{
        ...lead, status:'unassigned'
      }]).select().single();
      if (error) return { success:false, error:error.message };
      return { success:true, data };
    } catch(e) { return { success:false, error:e.message }; }
  },

  async updateLead(id, updates) {
    try {
      const { data, error } = await sb.from('buy_leads').update(updates).eq('id', id).select().single();
      if (error) return { success:false, error:error.message };
      return { success:true, data };
    } catch(e) { return { success:false, error:e.message }; }
  },

  async deleteLead(id) {
    try {
      /* Remove assignments first */
      await sb.from('lead_assignments').delete().eq('lead_id', id);
      const { error } = await sb.from('buy_leads').delete().eq('id', id);
      if (error) return { success:false, error:error.message };
      return { success:true };
    } catch(e) { return { success:false, error:e.message }; }
  },

  /* ────────────────────────────────
     LEAD ASSIGNMENT
     Admin assigns leads to clients
  ──────────────────────────────── */
  async assignLeads(leadIds, clientId, assignedBy) {
    try {
      /* Check client has enough balance */
      const { data: client } = await sb.from('clients').select('lead_limit,leads_used,plan_status').eq('id', clientId).single();
      if (!client) return { success:false, error:'Client not found.' };
      if (client.plan_status !== 'active') return { success:false, error:'Client membership is not active.' };
      const available = (client.lead_limit||0) - (client.leads_used||0);
      if (leadIds.length > available) return { success:false, error:`Only ${available} leads remaining in client's balance.` };

      /* Upsert assignments */
      const rows = leadIds.map(lid => ({ lead_id:lid, client_id:clientId, assigned_by:assignedBy }));
      const { error } = await sb.from('lead_assignments').upsert(rows, { onConflict:'lead_id,client_id' });
      if (error) return { success:false, error:error.message };

      /* Mark leads as assigned */
      await sb.from('buy_leads').update({ status:'assigned' }).in('id', leadIds);

      /* Increment leads_used */
      const { error: uErr } = await sb.from('clients')
        .update({ leads_used: (client.leads_used||0) + leadIds.length })
        .eq('id', clientId);
      if (uErr) return { success:false, error:uErr.message };

      return { success:true, count:leadIds.length };
    } catch(e) { return { success:false, error:e.message }; }
  },

  /* Remove specific lead from client */
  async unassignLead(leadId, clientId) {
    try {
      await sb.from('lead_assignments').delete().eq('lead_id', leadId).eq('client_id', clientId);
      /* Check if still assigned to anyone */
      const { data } = await sb.from('lead_assignments').select('id').eq('lead_id', leadId);
      if (!data || data.length === 0) {
        await sb.from('buy_leads').update({ status:'unassigned' }).eq('id', leadId);
      }
      /* Decrement leads_used */
      const { data: client } = await sb.from('clients').select('leads_used').eq('id', clientId).single();
      if (client && client.leads_used > 0) {
        await sb.from('clients').update({ leads_used: client.leads_used - 1 }).eq('id', clientId);
      }
      return { success:true };
    } catch(e) { return { success:false, error:e.message }; }
  },

  /* Get leads assigned to a client — with blur if inactive */
  async getClientLeads(clientId, planStatus) {
    try {
      const { data, error } = await sb
        .from('lead_assignments')
        .select(`lead_id, assigned_at, is_visible, buy_leads(id,company,country,contact_name,email,phone,category,product,quantity,quality,status)`)
        .eq('client_id', clientId)
        .eq('is_visible', true)
        .order('assigned_at', { ascending:false });
      if (error) { console.error('getClientLeads:', error.message); return []; }
      return (data||[]).map(row => {
        const l = row.buy_leads;
        if (!l) return null;
        if (planStatus !== 'active') {
          return { ...l, company:'██████ Corp', contact_name:'██████', email:'██████@████.com', phone:'+XX XXXX XXXX', _locked:true };
        }
        return { ...l, _locked:false };
      }).filter(Boolean);
    } catch(e) { return []; }
  },

  /* ────────────────────────────────
     MESSAGES / REALTIME CHAT
  ──────────────────────────────── */
  async getMessages(clientId) {
    try {
      const { data, error } = await sb.from('messages').select('*').eq('client_id', clientId).order('created_at', { ascending:true });
      if (error) { console.error('getMessages:', error.message); return []; }
      return data || [];
    } catch(e) { return []; }
  },

  async sendMessage(clientId, sender, senderName, text) {
    try {
      const { error } = await sb.from('messages').insert([{ client_id:clientId, sender, sender_name:senderName, text }]);
      if (error) { console.error('sendMessage:', error.message); return { success:false }; }
      return { success:true };
    } catch(e) { return { success:false }; }
  },

  async markMessagesRead(clientId) {
    try {
      await sb.from('messages').update({ is_read:true }).eq('client_id', clientId).neq('sender','client');
    } catch(e) {}
  },

  async deleteMessage(id) {
    try {
      await sb.from('messages').delete().eq('id', id);
      return { success:true };
    } catch(e) { return { success:false }; }
  },

  subscribeToMessages(clientId, callback) {
    return sb.channel('msgs-' + clientId)
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'messages', filter:`client_id=eq.${clientId}` }, p => callback(p.new))
      .subscribe();
  },

  /* ────────────────────────────────
     TICKETS — Full CRUD
  ──────────────────────────────── */
  async getTickets(filters = {}) {
    try {
      let q = sb.from('tickets').select('*, clients(name,business_name)').order('created_at', { ascending:false });
      if (filters.status)   q = q.eq('status', filters.status);
      if (filters.clientId) q = q.eq('client_id', filters.clientId);
      const { data, error } = await q;
      if (error) { console.error('getTickets:', error.message); return []; }
      return data || [];
    } catch(e) { return []; }
  },

  async submitTicket(clientId, type, priority, description) {
    try {
      const { data, error } = await sb.from('tickets').insert([{ client_id:clientId, type, priority, description }]).select().single();
      if (error) return { success:false, error:error.message };
      return { success:true, data };
    } catch(e) { return { success:false, error:e.message }; }
  },

  async updateTicket(id, updates) {
    try {
      const { error } = await sb.from('tickets').update(updates).eq('id', id);
      if (error) return { success:false, error:error.message };
      return { success:true };
    } catch(e) { return { success:false, error:e.message }; }
  },

  async resolveTicket(id) {
    return this.updateTicket(id, { status:'resolved', resolved_at:new Date().toISOString() });
  },

  async deleteTicket(id) {
    try {
      await sb.from('tickets').delete().eq('id', id);
      return { success:true };
    } catch(e) { return { success:false }; }
  },

  /* ────────────────────────────────
     ENQUIRIES
  ──────────────────────────────── */
  async submitEnquiry(enquiry) {
    try {
      const { data, error } = await sb.from('enquiries').insert([enquiry]).select().single();
      if (error) return { success:false, error:error.message };
      return { success:true, data };
    } catch(e) { return { success:false, error:e.message }; }
  },

  async getEnquiries() {
    try {
      const { data, error } = await sb.from('enquiries').select('*').order('created_at', { ascending:false });
      if (error) return [];
      return data || [];
    } catch(e) { return []; }
  },

  async updateEnquiry(id, updates) {
    try {
      const { error } = await sb.from('enquiries').update(updates).eq('id', id);
      return { success:!error };
    } catch(e) { return { success:false }; }
  },

  async deleteEnquiry(id) {
    try {
      await sb.from('enquiries').delete().eq('id', id);
      return { success:true };
    } catch(e) { return { success:false }; }
  },

  /* ────────────────────────────────
     RMs — Full CRUD
  ──────────────────────────────── */
  async getRMs() {
    try {
      const { data, error } = await sb.from('admin_users').select('*').in('role',['rm','admin','superadmin']).eq('is_active',true).order('name');
      if (error) return [];
      return data || [];
    } catch(e) { return []; }
  },

  async addRM(rm) {
    try {
      const initials = rm.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
      const { data, error } = await sb.from('admin_users').insert([{ ...rm, role:'rm', initials, is_active:true }]).select().single();
      if (error) return { success:false, error:error.message };
      return { success:true, data };
    } catch(e) { return { success:false, error:e.message }; }
  },

  async updateRM(id, updates) {
    try {
      const { error } = await sb.from('admin_users').update(updates).eq('id', id);
      if (error) return { success:false, error:error.message };
      return { success:true };
    } catch(e) { return { success:false, error:e.message }; }
  },

  async deleteRM(id) {
    try {
      /* Unassign from clients */
      await sb.from('clients').update({ rm_id:null }).eq('rm_id', id);
      const { error } = await sb.from('admin_users').delete().eq('id', id);
      if (error) return { success:false, error:error.message };
      return { success:true };
    } catch(e) { return { success:false, error:e.message }; }
  },

  async deactivateRM(id) {
    return this.updateRM(id, { is_active:false });
  },

  /* ────────────────────────────────
     ANALYTICS
  ──────────────────────────────── */
  async getAnalytics() {
    try {
      const [clients, leads, tickets, msgs] = await Promise.all([
        sb.from('clients').select('plan,plan_status,leads_used,lead_limit,billing_cycle'),
        sb.from('buy_leads').select('country,category,status,quality'),
        sb.from('tickets').select('status,priority'),
        sb.from('messages').select('client_id,is_read,sender').eq('is_read',false).eq('sender','client'),
      ]);
      return {
        clients: clients.data||[],
        leads:   leads.data||[],
        tickets: tickets.data||[],
        unread:  msgs.data||[],
      };
    } catch(e) { return { clients:[], leads:[], tickets:[], unread:[] }; }
  },

  /* ────────────────────────────────
     PURCHASES
  ──────────────────────────────── */
  async getPurchases(clientId) {
    try {
      const { data, error } = await sb.from('purchases').select('*').eq('client_id', clientId).order('created_at', { ascending:false });
      if (error) return [];
      return data || [];
    } catch(e) { return []; }
  },

  async getAllPurchases() {
    try {
      const { data, error } = await sb.from('purchases').select('*, clients(name,business_name)').order('created_at', { ascending:false });
      if (error) return [];
      return data || [];
    } catch(e) { return []; }
  },

  /* ────────────────────────────────
     REFERRALS
  ──────────────────────────────── */
  async getReferrals(clientId) {
    try {
      const { data, error } = await sb.from('referrals').select('*').eq('referrer_id', clientId).order('created_at', { ascending:false });
      if (error) return [];
      return data || [];
    } catch(e) { return []; }
  },

  async getAllReferrals() {
    try {
      const { data, error } = await sb.from('referrals').select('*').order('created_at', { ascending:false });
      if (error) return [];
      return data || [];
    } catch(e) { return []; }
  },

  async addReferral(referral) {
    try {
      const { data, error } = await sb.from('referrals').insert([referral]).select().single();
      if (error) return { success:false, error:error.message };
      return { success:true, data };
    } catch(e) { return { success:false, error:e.message }; }
  },

  async updateReferral(id, updates) {
    try {
      const { error } = await sb.from('referrals').update(updates).eq('id', id);
      return { success:!error };
    } catch(e) { return { success:false }; }
  },

  /* ────────────────────────────────
     MEMBERSHIP HISTORY
  ──────────────────────────────── */
  async getMembershipHistory(clientId) {
    try {
      const { data, error } = await sb.from('membership_assignments').select('*').eq('client_id', clientId).order('created_at', { ascending:false });
      if (error) return [];
      return data || [];
    } catch(e) { return []; }
  },

};

console.log('✅ BGX Config v3.0 loaded — DB, AI, Plans, Countries, Categories ready');
