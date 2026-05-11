/* ═══════════════════════════════════════════════════════
   BuyGenix Solutions — Backend Config v4.0
   Include FIRST in every HTML page
   SETUP: Replace SUPABASE_URL and SUPABASE_ANON_KEY below
═══════════════════════════════════════════════════════ */

const SUPABASE_URL      = 'https://qzaeshegpdoknsiuvidr.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'; /* paste your anon key */

/* ── Load Supabase ── */
function _initSB() {
  if (window.supabase) {
    window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    document.dispatchEvent(new Event('sbReady'));
    return;
  }
  const s = document.createElement('script');
  s.src = 'https://unpkg.com/@supabase/supabase-js@2';
  s.onload = () => {
    window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase ready');
    document.dispatchEvent(new Event('sbReady'));
  };
  s.onerror = () => {
    const s2 = document.createElement('script');
    s2.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
    s2.onload = () => {
      window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('✅ Supabase ready (fallback)');
      document.dispatchEvent(new Event('sbReady'));
    };
    document.head.appendChild(s2);
  };
  document.head.appendChild(s);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _initSB);
else _initSB();

/* ════════════════════════════════
   STATIC PLAN DEFINITIONS (fallback)
════════════════════════════════ */
window.PLANS = {
  none:         { label:'No Plan',           limit:0,     price:0,      color:'#7A9BBD' },
  starter:      { label:'Starter Plan',      limit:100,   price:4999,   color:'#4A6A8A' },
  growth:       { label:'Growth Plan',       limit:500,   price:12999,  color:'#B8860B' },
  professional: { label:'Professional Plan', limit:2000,  price:24999,  color:'#1B3A5C' },
  enterprise:   { label:'Enterprise Plan',   limit:99999, price:0,      color:'#0B1929' },
};

/* ════════════════════════════════
   COUNTRIES
════════════════════════════════ */
window.COUNTRIES = [
  'UAE','USA','Germany','UK','Australia','Japan','Singapore','Canada',
  'Saudi Arabia','Belgium','Egypt','Austria','France','Italy','Netherlands',
  'South Korea','Malaysia','Thailand','Indonesia','South Africa','Kenya',
  'Nigeria','Brazil','Mexico','Turkey','Israel','Qatar','Kuwait','Bahrain',
  'Oman','Jordan','New Zealand','Spain','Portugal','Sweden','Norway',
  'Denmark','Finland','Poland','Czech Republic','Hungary','Romania',
  'Greece','Vietnam','Philippines','Bangladesh','Sri Lanka','Argentina',
  'Colombia','Peru','Chile','Morocco','Tanzania','Ghana','Pakistan',
  'Myanmar','Cambodia','Nepal','Rwanda','Uganda','Ethiopia','Russia','China'
];

/* ════════════════════════════════
   CATEGORIES
════════════════════════════════ */
window.CATEGORIES = {
  'Textiles & Fabrics':     ['Cotton Fabric','Silk Fabric','Polyester Fabric','Woolen Fabric','Denim','Linen','Jute Fabric','Embroidered Fabric','Home Textiles','Technical Textiles'],
  'Spices & Condiments':    ['Turmeric','Black Pepper','Cardamom','Cumin','Coriander','Red Chilli','Ginger','Cloves','Cinnamon','Nutmeg','Fenugreek','Star Anise'],
  'Rice & Grains':          ['Basmati Rice','Non-Basmati Rice','Wheat','Maize','Sorghum','Millet','Quinoa','Oats','Barley','Broken Rice'],
  'Organic Food':           ['Organic Turmeric','Organic Rice','Organic Wheat','Organic Pulses','Organic Tea','Organic Coffee','Organic Honey','Organic Coconut Oil','Organic Ghee'],
  'Handicrafts & Artware':  ['Brass Handicrafts','Marble Handicrafts','Wooden Handicrafts','Ceramic Artware','Jute Products','Block Print Items','Metal Sculptures','Terracotta'],
  'Garments & Apparel':     ["Men's Shirts","Women's Kurtas","Kids Wear","Denim Jeans","Ethnic Wear","Sportswear","Nightwear","Uniforms","Fashion Accessories"],
  'Gems & Jewellery':       ['Gold Jewellery','Silver Jewellery','Diamond Jewellery','Gemstones','Costume Jewellery','Handmade Jewellery'],
  'Chemicals & Pharma':     ['Bulk Drugs','Formulations','Dyes','Pigments','Agro Chemicals','Specialty Chemicals','Cosmetic Ingredients'],
  'Engineering Goods':      ['Auto Parts','Castings','Forgings','Pumps','Valves','Hand Tools','Fasteners','Electrical Equipment'],
  'Leather Products':       ['Leather Shoes','Leather Bags','Leather Wallets','Leather Belts','Leather Jackets','Leather Gloves'],
  'Fresh Produce':          ['Mangoes','Grapes','Pomegranates','Bananas','Onions','Potatoes','Tomatoes','Baby Corn','Okra','Bitter Gourd'],
  'Processed Food':         ['Pickles','Chutneys','Sauces','Ready Meals','Frozen Food','Snacks','Beverages','Dairy Products'],
};

/* ════════════════════════════════
   FAQ DATA — common client questions
════════════════════════════════ */
window.FAQ = [
  {
    q: 'How do I get leads assigned to my account?',
    a: 'After your membership is activated by BuyGenix admin, leads will be assigned to your account based on your product category and target countries. You can view all assigned leads in the "My Leads" section. Contact your RM or WhatsApp +91 98181 87246 to request specific leads.'
  },
  {
    q: 'Why are the contact details of leads blurred/hidden?',
    a: 'Lead contact details (company name, phone, email) are unlocked only when you have an active membership plan. If your plan is pending or expired, the details will appear blurred. Contact BuyGenix to activate your plan.'
  },
  {
    q: 'How many leads do I get per month?',
    a: 'Leads per month depend on your plan: Starter = 100 leads, Growth = 500 leads, Professional = 2,000 leads, Enterprise = Unlimited. Your current usage is visible on your Dashboard.'
  },
  {
    q: 'How do I upgrade my membership plan?',
    a: 'To upgrade, contact your Relationship Manager or WhatsApp BuyGenix at +91 98181 87246. Once confirmed, your plan will be upgraded and additional leads will be assigned immediately. There is no self-upgrade option — all plan changes are done by BuyGenix admin.'
  },
  {
    q: 'What is the difference between Hot, Warm, and New leads?',
    a: '🔥 Hot leads are buyers actively looking to purchase now and have high intent. ⚡ Warm leads have expressed interest but are still evaluating. 🆕 New leads are recently sourced buyers who match your category. Focus on Hot leads first for fastest results.'
  },
  {
    q: 'Can I export my leads to Excel or CSV?',
    a: 'Yes! Go to "My Leads" and click the CSV Download button. Only leads with active membership (unlocked leads) will be included in the export. Leads are exported with full details including contact name, phone, email, and product info.'
  },
  {
    q: 'How do I contact a buyer lead?',
    a: 'Click "Details →" on any lead in My Leads to open the full lead drawer. You will see WhatsApp and Email buttons for direct contact. Always introduce yourself as an Indian exporter and mention your product, quantity, and pricing in the first message for best results.'
  },
  {
    q: 'When does my membership renew?',
    a: 'Your renewal date is shown on your Dashboard under "Monthly Lead Usage" and in "My Plan". BuyGenix will contact you 7 days before renewal. For annual plans, renewal is once a year. WhatsApp +91 98181 87246 for renewal assistance.'
  },
  {
    q: 'How does the Refer & Earn programme work?',
    a: 'Share your unique referral link with other Indian exporters. When they join BuyGenix and activate a paid plan, you earn commission: Starter = ₹500, Growth = ₹2,000, Professional = ₹5,000, Enterprise = ₹10,000+. Commission is paid within 30 days of the referred client activating their plan.'
  },
  {
    q: 'What documents do I need to start exporting from India?',
    a: 'Key documents for Indian exporters: (1) IEC - Import Export Code from DGFT, (2) GST Registration, (3) RCMC - Registration cum Membership Certificate from your export promotion council, (4) Bank AD Code registration. BuyGenix can assist with GST registration — visit our GST page.'
  },
  {
    q: 'How do I raise a support ticket?',
    a: 'Go to "Raise Ticket" in the sidebar. Select the issue type and priority, describe your issue in detail (include lead IDs or dates if relevant), and submit. Our team responds within 24 working hours. For urgent issues, directly WhatsApp +91 98181 87246.'
  },
  {
    q: 'Who is my Relationship Manager (RM)?',
    a: 'Your RM details are shown on your Dashboard — including name, phone number, and email. Your RM is your dedicated point of contact for lead queries, plan questions, and export guidance. You can contact them directly via phone or WhatsApp.'
  },
  {
    q: 'Can I request leads from specific countries?',
    a: 'Yes! Contact your Relationship Manager with the specific countries and product categories you want. Your RM will coordinate with the BuyGenix team to source and assign matching leads. BuyGenix covers 50+ countries including UAE, USA, Germany, UK, Australia, and more.'
  },
  {
    q: 'What happens if a lead contact is incorrect or not responding?',
    a: 'Raise a support ticket under "Raise Ticket" → "Lead Quality / Missing Lead" with the lead details. BuyGenix will verify the lead and either update the contact information or replace the lead. Quality replacement is part of all active membership plans.'
  },
];

/* ════════════════════════════════
   DB — ALL FUNCTIONS
════════════════════════════════ */
window.DB = {

  /* ── AUTH ── */
  async loginClient(email, otp) {
    try {
      const { data, error } = await sb.from('clients').select('*').ilike('email', email.trim()).eq('otp', otp.trim()).maybeSingle();
      if (error) return { success:false, error:'Database error: ' + error.message };
      if (!data)  return { success:false, error:'Invalid email or OTP. Check and try again.' };
      if (data.plan_status === 'suspended') return { success:false, error:'Account suspended. Contact BuyGenix support.' };
      return { success:true, client:data };
    } catch(e) { return { success:false, error:'Connection error. Please try again.' }; }
  },

  async loginAdmin(username, password) {
    try {
      const { data, error } = await sb.from('admin_users').select('*').ilike('username', username.trim()).eq('password', password).maybeSingle();
      if (error) return { success:false, error:'Database error: ' + error.message };
      if (!data)  return { success:false, error:'Invalid username or password.' };
      if (!data.is_active) return { success:false, error:'Account inactive. Contact admin.' };
      return { success:true, admin:data };
    } catch(e) { return { success:false, error:'Connection error. Please try again.' }; }
  },

  async registerClient({ name, business, email, phone, city, state, category }) {
    try {
      const { data: ex } = await sb.from('clients').select('id').ilike('email', email.trim()).maybeSingle();
      if (ex) return { success:false, error:'This email is already registered. Please log in.' };
      const otp = String(Math.floor(100000 + Math.random() * 900000));
      const { data, error } = await sb.from('clients').insert([{
        name:name.trim(), business_name:business.trim(),
        email:email.toLowerCase().trim(), phone:phone.trim(),
        city:city.trim(), state:state.trim(), category,
        otp, plan:'none', plan_label:'No Plan',
        plan_status:'pending', lead_limit:0, leads_used:0,
      }]).select().single();
      if (error) return { success:false, error:error.message };
      console.log(`New client OTP: ${email} → ${otp}`);
      return { success:true, client:data, otp };
    } catch(e) { return { success:false, error:e.message }; }
  },

  /* ── MEMBERSHIP PLANS ── */
  async getMembershipPlans() {
    try {
      const { data } = await sb.from('membership_plans').select('*').eq('is_active', true).order('sort_order');
      return data || [];
    } catch(e) { return []; }
  },

  async addMembershipPlan(plan) {
    try {
      const { data, error } = await sb.from('membership_plans').insert([plan]).select().single();
      if (error) return { success:false, error:error.message };
      return { success:true, data };
    } catch(e) { return { success:false, error:e.message }; }
  },

  async updateMembershipPlan(id, updates) {
    try {
      const { error } = await sb.from('membership_plans').update(updates).eq('id', id);
      if (error) return { success:false, error:error.message };
      return { success:true };
    } catch(e) { return { success:false, error:e.message }; }
  },

  async deleteMembershipPlan(id) {
    try {
      await sb.from('membership_plans').update({ is_active:false }).eq('id', id);
      return { success:true };
    } catch(e) { return { success:false, error:e.message }; }
  },

  /* ── CLIENTS ── */
  async getClients() {
    try {
      const { data, error } = await sb.from('client_dashboard').select('*').order('join_date', { ascending:false });
      if (error) { console.error('getClients:', error.message); return []; }
      return data || [];
    } catch(e) { return []; }
  },

  async getClient(id) {
    try {
      const { data } = await sb.from('client_dashboard').select('*').eq('id', id).maybeSingle();
      return data;
    } catch(e) { return null; }
  },

  async addClient(client) {
    try {
      const { data, error } = await sb.from('clients').insert([client]).select().single();
      if (error) return { success:false, error:error.message };
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
      await sb.from('lead_assignments').delete().eq('client_id', id);
      await sb.from('tickets').delete().eq('client_id', id);
      await sb.from('purchases').delete().eq('client_id', id);
      await sb.from('referrals').delete().eq('referrer_id', id);
      await sb.from('membership_assignments').delete().eq('client_id', id);
      const { error } = await sb.from('clients').delete().eq('id', id);
      if (error) return { success:false, error:error.message };
      return { success:true };
    } catch(e) { return { success:false, error:e.message }; }
  },

  async suspendClient(id, suspend=true) {
    return this.updateClient(id, { plan_status: suspend ? 'suspended' : 'active' });
  },

  /* ── MEMBERSHIP ASSIGNMENT ── */
  async assignMembership({ clientId, planName, planLabel, leadLimit, priceMonthly, billingCycle, assignedBy, rmId, notes, renewalDate }) {
    try {
      const price = billingCycle === 'annual' ? Math.round(priceMonthly * 12 * 0.8) :
                    billingCycle === 'quarterly' ? Math.round(priceMonthly * 3 * 0.9) : priceMonthly;

      let endDate = renewalDate;
      if (!endDate) {
        const d = new Date();
        if (billingCycle === 'annual') d.setFullYear(d.getFullYear() + 1);
        else if (billingCycle === 'quarterly') d.setMonth(d.getMonth() + 3);
        else d.setMonth(d.getMonth() + 1);
        endDate = d.toISOString().split('T')[0];
      }

      /* Record */
      const { error: maErr } = await sb.from('membership_assignments').insert([{
        client_id:clientId, plan:planName, plan_label:planLabel,
        billing_cycle:billingCycle, lead_limit:leadLimit, price,
        assigned_by:assignedBy, status:'active',
        start_date: new Date().toISOString().split('T')[0],
        end_date: endDate, notes,
      }]);
      if (maErr) return { success:false, error:maErr.message };

      /* Update client */
      const updates = {
        plan:planName, plan_label:planLabel, billing_cycle:billingCycle,
        lead_limit:leadLimit, plan_status:'active', plan_price:price,
        renewal_date:endDate,
        membership_assigned_by:assignedBy,
        membership_assigned_at:new Date().toISOString(),
      };
      if (rmId) updates.rm_id = rmId;
      const { error:cErr } = await sb.from('clients').update(updates).eq('id', clientId);
      if (cErr) return { success:false, error:cErr.message };

      /* Purchase record */
      await sb.from('purchases').insert([{
        client_id:clientId,
        description:`${planLabel} — ${billingCycle==='annual'?'Annual':billingCycle==='quarterly'?'Quarterly':'Monthly'}`,
        quantity:`${leadLimit >= 99999?'Unlimited':leadLimit} Leads`,
        amount:price, status:'active',
      }]);

      return { success:true };
    } catch(e) { return { success:false, error:e.message }; }
  },

  async revokeMembership(clientId) {
    try {
      await sb.from('membership_assignments').update({ status:'revoked' }).eq('client_id', clientId).eq('status','active');
      return this.updateClient(clientId, { plan:'none', plan_label:'No Plan', plan_status:'pending', lead_limit:0, plan_price:0 });
    } catch(e) { return { success:false, error:e.message }; }
  },

  async getMembershipHistory(clientId) {
    try {
      const { data } = await sb.from('membership_assignments').select('*').eq('client_id', clientId).order('created_at', { ascending:false });
      return data || [];
    } catch(e) { return []; }
  },

  /* ── LEADS ── */
  async getLeadPool(filters={}) {
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
      const { data, error } = await sb.from('buy_leads').insert([{ ...lead, status:'unassigned' }]).select().single();
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
      await sb.from('lead_assignments').delete().eq('lead_id', id);
      const { error } = await sb.from('buy_leads').delete().eq('id', id);
      if (error) return { success:false, error:error.message };
      return { success:true };
    } catch(e) { return { success:false, error:e.message }; }
  },

  async assignLeads(leadIds, clientId, assignedBy) {
    try {
      const { data:client } = await sb.from('clients').select('lead_limit,leads_used,plan_status').eq('id', clientId).single();
      if (!client) return { success:false, error:'Client not found.' };
      if (client.plan_status !== 'active') return { success:false, error:'Client membership is not active. Assign a plan first.' };
      const available = (client.lead_limit||0) - (client.leads_used||0);
      if (leadIds.length > available) return { success:false, error:`Only ${available} leads remaining in client's balance. Select fewer leads.` };
      const rows = leadIds.map(lid => ({ lead_id:lid, client_id:clientId, assigned_by:assignedBy }));
      const { error } = await sb.from('lead_assignments').upsert(rows, { onConflict:'lead_id,client_id' });
      if (error) return { success:false, error:error.message };
      await sb.from('buy_leads').update({ status:'assigned' }).in('id', leadIds);
      await sb.from('clients').update({ leads_used:(client.leads_used||0) + leadIds.length }).eq('id', clientId);
      return { success:true, count:leadIds.length };
    } catch(e) { return { success:false, error:e.message }; }
  },

  async unassignLead(leadId, clientId) {
    try {
      await sb.from('lead_assignments').delete().eq('lead_id', leadId).eq('client_id', clientId);
      const { data:remaining } = await sb.from('lead_assignments').select('id').eq('lead_id', leadId);
      if (!remaining?.length) await sb.from('buy_leads').update({ status:'unassigned' }).eq('id', leadId);
      const { data:client } = await sb.from('clients').select('leads_used').eq('id', clientId).single();
      if (client && client.leads_used > 0) await sb.from('clients').update({ leads_used:client.leads_used - 1 }).eq('id', clientId);
      return { success:true };
    } catch(e) { return { success:false, error:e.message }; }
  },

  async getClientLeads(clientId, planStatus) {
    try {
      const { data, error } = await sb.from('lead_assignments')
        .select('lead_id,assigned_at,is_visible,buy_leads(id,company,country,contact_name,email,phone,category,product,quantity,quality,status)')
        .eq('client_id', clientId).eq('is_visible', true)
        .order('assigned_at', { ascending:false });
      if (error) { console.error('getClientLeads:', error.message); return []; }
      return (data||[]).map(row => {
        const l = row.buy_leads; if (!l) return null;
        if (planStatus !== 'active') return { ...l, company:'██████ Corp', contact_name:'██████', email:'██████@████.com', phone:'+XX XXXX XXXX', _locked:true };
        return { ...l, _locked:false };
      }).filter(Boolean);
    } catch(e) { return []; }
  },

  /* ── TICKETS ── */
  async getTickets(filters={}) {
    try {
      let q = sb.from('tickets').select('*,clients(name,business_name)').order('created_at', { ascending:false });
      if (filters.status)   q = q.eq('status', filters.status);
      if (filters.clientId) q = q.eq('client_id', filters.clientId);
      const { data } = await q;
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

  async resolveTicket(id) {
    try {
      await sb.from('tickets').update({ status:'resolved', resolved_at:new Date().toISOString() }).eq('id', id);
      return { success:true };
    } catch(e) { return { success:false }; }
  },

  async deleteTicket(id) {
    try { await sb.from('tickets').delete().eq('id', id); return { success:true }; }
    catch(e) { return { success:false }; }
  },

  async updateTicket(id, updates) {
    try { await sb.from('tickets').update(updates).eq('id', id); return { success:true }; }
    catch(e) { return { success:false }; }
  },

  /* ── ENQUIRIES ── */
  async submitEnquiry(e) {
    try {
      const { data, error } = await sb.from('enquiries').insert([e]).select().single();
      if (error) return { success:false, error:error.message };
      return { success:true, data };
    } catch(e) { return { success:false, error:e.message }; }
  },

  async getEnquiries() {
    try { const { data } = await sb.from('enquiries').select('*').order('created_at', { ascending:false }); return data||[]; }
    catch(e) { return []; }
  },

  async updateEnquiry(id, updates) {
    try { await sb.from('enquiries').update(updates).eq('id', id); return { success:true }; }
    catch(e) { return { success:false }; }
  },

  async deleteEnquiry(id) {
    try { await sb.from('enquiries').delete().eq('id', id); return { success:true }; }
    catch(e) { return { success:false }; }
  },

  /* ── RMs ── */
  async getRMs() {
    try {
      const { data } = await sb.from('admin_users').select('*').in('role',['rm','admin','superadmin']).eq('is_active',true).order('name');
      return data||[];
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
      await sb.from('clients').update({ rm_id:null }).eq('rm_id', id);
      await sb.from('admin_users').delete().eq('id', id);
      return { success:true };
    } catch(e) { return { success:false, error:e.message }; }
  },

  /* ── ANALYTICS ── */
  async getAnalytics() {
    try {
      const [clients, leads, tickets] = await Promise.all([
        sb.from('clients').select('plan,plan_label,plan_status,leads_used,lead_limit,billing_cycle,plan_price'),
        sb.from('buy_leads').select('country,category,status,quality'),
        sb.from('tickets').select('status,priority,client_id'),
      ]);
      return { clients:clients.data||[], leads:leads.data||[], tickets:tickets.data||[] };
    } catch(e) { return { clients:[], leads:[], tickets:[] }; }
  },

  /* ── PURCHASES ── */
  async getPurchases(clientId) {
    try {
      const { data } = await sb.from('purchases').select('*').eq('client_id', clientId).order('created_at', { ascending:false });
      return data||[];
    } catch(e) { return []; }
  },

  async getAllPurchases() {
    try {
      const { data } = await sb.from('purchases').select('*,clients(name,business_name)').order('created_at', { ascending:false });
      return data||[];
    } catch(e) { return []; }
  },

  /* ── REFERRALS ── */
  async getReferrals(clientId) {
    try {
      const { data } = await sb.from('referrals').select('*').eq('referrer_id', clientId).order('created_at', { ascending:false });
      return data||[];
    } catch(e) { return []; }
  },

  async getAllReferrals() {
    try { const { data } = await sb.from('referrals').select('*').order('created_at', { ascending:false }); return data||[]; }
    catch(e) { return []; }
  },

  async addReferral(r) {
    try {
      const { data, error } = await sb.from('referrals').insert([r]).select().single();
      if (error) return { success:false, error:error.message };
      return { success:true, data };
    } catch(e) { return { success:false, error:e.message }; }
  },

  async updateReferral(id, updates) {
    try { await sb.from('referrals').update(updates).eq('id', id); return { success:true }; }
    catch(e) { return { success:false }; }
  },
};

console.log('✅ BGX Config v4.0 loaded');
