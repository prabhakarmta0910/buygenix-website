/* ═══════════════════════════════════════════════════════════════
   BuyGenix Solutions — Shared Data Store v2.0
   Plans live from Supabase membership_plans table.
   All pages call BGX.loadPlans() on init before rendering.
═══════════════════════════════════════════════════════════════ */

window.BGX = window.BGX || {};

/* ── SUPABASE CONFIG ── */
const SUPABASE_URL  = 'https://qzaeshegpdoknsiuvidr.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6YWVzaGVncGRva25zaXV2aWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NjIzMzcsImV4cCI6MjA5MzQzODMzN30.3TOujIaRbZPkvL_hewvJEONcOwApOIRQA5EjTdihW-s';

function _getBGXSupabase() {
  if (window._bgxSupa) return window._bgxSupa;
  if (window.supabase && window.supabase.createClient) {
    window._bgxSupa = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    return window._bgxSupa;
  }
  return null;
}

/* ── COUNTRIES ── */
BGX.COUNTRIES = [
  "UAE","USA","Germany","UK","Australia","Japan","Singapore","Canada",
  "Saudi Arabia","Belgium","Egypt","Austria","France","Italy","Netherlands",
  "South Korea","China","Malaysia","Thailand","Indonesia","South Africa",
  "Kenya","Nigeria","Brazil","Mexico","Argentina","Turkey","Israel",
  "Qatar","Kuwait","Bahrain","Oman","Jordan","New Zealand","Spain",
  "Portugal","Sweden","Norway","Denmark","Finland","Poland","Czech Republic",
  "Hungary","Romania","Greece","Vietnam","Philippines","Bangladesh","Sri Lanka"
];

/* ── PRODUCT CATEGORIES ── */
BGX.CATEGORIES = {
  "Textiles & Fabrics": ["Cotton Fabric","Silk Fabric","Polyester Fabric","Woolen Fabric","Denim","Linen","Jute Fabric","Embroidered Fabric","Home Textiles","Technical Textiles"],
  "Spices & Condiments": ["Turmeric","Black Pepper","Cardamom","Cumin","Coriander","Red Chilli","Ginger","Cloves","Cinnamon","Nutmeg","Fenugreek","Star Anise"],
  "Rice & Grains": ["Basmati Rice","Non-Basmati Rice","Wheat","Maize","Sorghum","Millet","Quinoa","Oats","Barley","Broken Rice"],
  "Organic Food": ["Organic Turmeric","Organic Rice","Organic Wheat","Organic Pulses","Organic Tea","Organic Coffee","Organic Honey","Organic Coconut Oil","Organic Ghee"],
  "Handicrafts & Artware": ["Brass Handicrafts","Marble Handicrafts","Wooden Handicrafts","Ceramic Artware","Leather Goods","Jute Products","Block Print Items","Metal Sculptures","Terracotta"],
  "Garments & Apparel": ["Men's Shirts","Women's Kurtas","Kids Wear","Denim Jeans","Ethnic Wear","Sportswear","Nightwear","Uniforms","Fashion Accessories"],
  "Gems & Jewellery": ["Gold Jewellery","Silver Jewellery","Diamond Jewellery","Gemstones","Costume Jewellery","Handmade Jewellery"],
  "Chemicals & Pharma": ["Bulk Drugs","Formulations","Dyes","Pigments","Agro Chemicals","Specialty Chemicals","Cosmetic Ingredients"],
  "Engineering Goods": ["Auto Parts","Castings","Forgings","Pumps","Valves","Hand Tools","Fasteners","Electrical Equipment"],
  "Leather Products": ["Leather Shoes","Leather Bags","Leather Wallets","Leather Belts","Leather Jackets","Leather Gloves"],
  "Fresh Produce": ["Mangoes","Grapes","Pomegranates","Bananas","Onions","Potatoes","Tomatoes","Baby Corn","Okra","Bitter Gourd"],
  "Processed Food": ["Pickles","Chutneys","Sauces","Ready Meals","Frozen Food","Snacks","Beverages","Dairy Products"]
};

/* ── RELATIONSHIP MANAGERS ── */
BGX.RMS = [
  {id:"rm1", name:"Priya Mehra",    role:"Senior Export Consultant", phone:"+91 98181 87246", email:"priya@buygenixsolutions.com",    clients:["c1","c3"],  initials:"PM"},
  {id:"rm2", name:"Arjun Kapoor",   role:"Export Consultant",        phone:"+91 98182 11111", email:"arjun@buygenixsolutions.com",   clients:["c2","c5"],  initials:"AK"},
  {id:"rm3", name:"Divya Singh",    role:"Export Consultant",        phone:"+91 98183 22222", email:"divya@buygenixsolutions.com",   clients:["c4","c6"],  initials:"DS"},
  {id:"rm4", name:"Rohit Verma",    role:"Junior Consultant",        phone:"+91 98184 33333", email:"rohit@buygenixsolutions.com",   clients:[],           initials:"RV"},
  {id:"rm5", name:"Sneha Joshi",    role:"Junior Consultant",        phone:"+91 98185 44444", email:"sneha@buygenixsolutions.com",   clients:[],           initials:"SJ"},
];

/* ── CLIENTS ── */
BGX.CLIENTS = [
  {id:"c1", name:"Rajesh Sharma",  biz:"RS Textiles Pvt Ltd",     cat:"Textiles & Fabrics",       products:["Cotton Fabric","Silk Fabric"],   city:"Delhi",      state:"Delhi",      gstin:"07AABCS1234A1Z5", email:"rajesh@rstextiles.com",    phone:"+91 98765 43210", plan:"growth",       billing:"annual", limit:15,   used:12, renewal:"2026-01-15", status:"active",  rmId:"rm1", otp:"123456", joinDate:"2025-01-15"},
  {id:"c2", name:"Priya Verma",    biz:"Priya Spice Exports",     cat:"Spices & Condiments",      products:["Turmeric","Black Pepper","Cardamom"], city:"Mumbai",  state:"Maharashtra", gstin:"27AABCP5678B2Z3", email:"priya@priyaspice.com",     phone:"+91 98765 11111", plan:"professional", billing:"annual", limit:20,   used:18, renewal:"2026-03-01", status:"active",  rmId:"rm2", otp:"123456", joinDate:"2025-03-01"},
  {id:"c3", name:"Kiran Joshi",    biz:"Kiran Handicrafts",       cat:"Handicrafts & Artware",    products:["Brass Handicrafts","Marble Handicrafts"], city:"Jaipur",state:"Rajasthan",  gstin:"08AABCK9012C3Z1", email:"kiran@handicrafts.com",    phone:"+91 98765 22222", plan:"starter",      billing:"annual", limit:10,   used:8,  renewal:"2026-02-10", status:"active",  rmId:"rm1", otp:"123456", joinDate:"2025-02-10"},
  {id:"c4", name:"Suresh Patil",   biz:"Agro Fresh Exports Ltd",  cat:"Organic Food",             products:["Organic Turmeric","Organic Rice"], city:"Pune",    state:"Maharashtra", gstin:"27AABCS3456D4Z9", email:"suresh@agrofresh.com",     phone:"+91 98765 33333", plan:"growth",       billing:"annual", limit:15,   used:7,  renewal:"2026-01-20", status:"active",  rmId:"rm3", otp:"123456", joinDate:"2025-01-20"},
  {id:"c5", name:"Manish Kumar",   biz:"MK Garments & Co",        cat:"Garments & Apparel",       products:["Men's Shirts","Denim Jeans"],      city:"Surat",   state:"Gujarat",     gstin:"24AABCM7890E5Z7", email:"mk@mkgarments.com",         phone:"+91 98765 44444", plan:"starter",      billing:"annual", limit:10,   used:0,  renewal:"2025-10-01", status:"expired", rmId:"rm2", otp:"123456", joinDate:"2024-10-01"},
  {id:"c6", name:"Deepa Mehta",    biz:"Mehta Ceramics Exports",  cat:"Handicrafts & Artware",    products:["Ceramic Artware","Terracotta"],    city:"Ahmedabad",state:"Gujarat",     gstin:"24AABCD1122F6Z4", email:"deepa@mehtaceramics.com",   phone:"+91 98765 55555", plan:"growth",       billing:"annual", limit:15,   used:3,  renewal:"2026-04-01", status:"active",  rmId:"rm3", otp:"123456", joinDate:"2025-04-01"},
  {id:"c7", name:"Amit Singh",     biz:"Singh Rice Exports",      cat:"Rice & Grains",            products:["Basmati Rice","Non-Basmati Rice"], city:"Amritsar",state:"Punjab",      gstin:"03AABCA3344G7Z2", email:"amit@singhrice.com",        phone:"+91 98765 66666", plan:"growth",       billing:"annual", limit:15,   used:9,  renewal:"2026-02-01", status:"active",  rmId:"rm4", otp:"123456", joinDate:"2025-02-01"},
  {id:"c8", name:"Fatima Sheikh",  biz:"Sheikh Leather Works",    cat:"Leather Products",         products:["Leather Bags","Leather Shoes"],    city:"Kanpur",  state:"UP",          gstin:"09AABCF5566H8Z0", email:"fatima@sheikhleather.com",  phone:"+91 98765 77777", plan:"professional", billing:"annual", limit:20,   used:14, renewal:"2026-03-15", status:"active",  rmId:"rm5", otp:"123456", joinDate:"2025-03-15"},
];

/* ══════════════════════════════════════════════════════════════
   PLANS — Default fallback. Overwritten by BGX.loadPlans()
   from Supabase membership_plans table on every page load.
══════════════════════════════════════════════════════════════ */
BGX.PLANS = {
  starter: {
    id:'starter', key:'starter', label:'Starter Plan',
    best_for:'New businesses entering global trade',
    days:365, price_original:15000, price:13500, discount:0.10, savings:1500,
    indian_leads:10, intl_leads:0, lead_delivery:'WhatsApp & Email',
    website:true, catalogue:0, rm:true, promotion:'None',
    perf_report:false, seo:false, smo:false,
    gst_support:'Assistance', virtual_cards:1, email_support:true,
    iec:true, msme:true, fassai:'Assistance', strategy_call:false,
    cta:'Get Started', is_popular:false, is_enterprise:false,
    color:'#4A6A8A', sort_order:1, is_active:true
  },
  growth: {
    id:'growth', key:'growth', label:'Growth Plan',
    best_for:'Growing businesses expanding internationally',
    days:365, price_original:30000, price:27000, discount:0.10, savings:3000,
    indian_leads:15, intl_leads:10, lead_delivery:'WhatsApp & Email',
    website:true, catalogue:10, rm:true, promotion:'Quarterly',
    perf_report:false, seo:true, smo:false,
    gst_support:'Assistance', virtual_cards:1, email_support:true,
    iec:true, msme:true, fassai:true, strategy_call:false,
    cta:'Choose Growth', is_popular:true, is_enterprise:false,
    color:'#B8860B', sort_order:2, is_active:true
  },
  professional: {
    id:'professional', key:'professional', label:'Professional Plan',
    best_for:'Established businesses seeking consistent global leads',
    days:365, price_original:45000, price:40500, discount:0.10, savings:4500,
    indian_leads:20, intl_leads:15, lead_delivery:'WhatsApp & Email',
    website:true, catalogue:15, rm:true, promotion:'Monthly',
    perf_report:false, seo:true, smo:true,
    gst_support:'Assistance', virtual_cards:1, email_support:true,
    iec:true, msme:true, fassai:true, strategy_call:false,
    cta:'Get Started', is_popular:false, is_enterprise:false,
    color:'#1B3A5C', sort_order:3, is_active:true
  },
  enterprise: {
    id:'enterprise', key:'enterprise', label:'Enterprise Plan',
    best_for:'Large businesses needing maximum global reach',
    days:365, price_original:80000, price:72000, discount:0.10, savings:8000,
    indian_leads:-1, intl_leads:25, lead_delivery:'WhatsApp & Email',
    website:true, catalogue:20, rm:true, promotion:'Weekly',
    perf_report:true, seo:true, smo:true,
    gst_support:'Included', virtual_cards:5, email_support:true,
    iec:true, msme:true, fassai:true, strategy_call:true,
    cta:'Contact for Enterprise', is_popular:false, is_enterprise:true,
    color:'#0B1929', sort_order:4, is_active:true
  }
};

/* ── LOAD PLANS FROM SUPABASE ── */
BGX.loadPlans = async function() {
  try {
    const db = _getBGXSupabase();
    if (!db) { console.warn('BGX: Supabase SDK not loaded, using default plans'); return false; }
    const { data, error } = await db
      .from('membership_plans')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) { console.warn('BGX plans load error:', error.message); return false; }
    if (!data || data.length === 0) { console.warn('BGX: No active plans in DB, using defaults'); return false; }
    const newPlans = {};
    data.forEach(row => {
      const key = row.plan_key;
      newPlans[key] = {
        id:            row.id,
        key:           key,
        label:         row.label || key,
        best_for:      row.best_for || '',
        days:          row.days || 365,
        price_original:Number(row.price_original) || 0,
        price:         Number(row.price) || 0,
        discount:      Number(row.discount) || 0,
        savings:       Number(row.savings) || 0,
        indian_leads:  Number(row.indian_leads) || 0,
        intl_leads:    Number(row.intl_leads) || 0,
        lead_delivery: row.lead_delivery || 'WhatsApp & Email',
        website:       !!row.website,
        catalogue:     Number(row.catalogue) || 0,
        rm:            !!row.rm,
        promotion:     row.promotion || 'None',
        perf_report:   !!row.perf_report,
        seo:           !!row.seo,
        smo:           !!row.smo,
        gst_support:   row.gst_support || 'None',
        virtual_cards: Number(row.virtual_cards) || 1,
        email_support: !!row.email_support,
        iec:           !!row.iec,
        msme:          !!row.msme,
        fassai:        row.fassai,
        strategy_call: !!row.strategy_call,
        cta:           row.cta || 'Get Started',
        is_popular:    !!row.is_popular,
        is_enterprise: !!row.is_enterprise,
        color:         row.color || '#1B3A5C',
        sort_order:    Number(row.sort_order) || 99,
        is_active:     !!row.is_active
      };
    });
    BGX.PLANS = newPlans;
    console.log('✅ BGX Plans loaded from Supabase:', Object.keys(BGX.PLANS).length, 'active plans');
    return true;
  } catch(e) {
    console.warn('BGX: Plans fallback to defaults –', e.message);
    return false;
  }
};

/* ── PLAN HELPERS ── */
BGX.getPlan      = (key) => BGX.PLANS[key] || Object.values(BGX.PLANS)[0] || {};
BGX.getPlansList = ()    => Object.values(BGX.PLANS).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
BGX.fmtLeads     = (n)   => (n === -1 || n >= 9999) ? 'Unlimited' : String(n);
BGX.fmtPrice     = (n)   => '₹' + Number(n).toLocaleString('en-IN');
BGX.fmtFassai    = (v)   => v === true || v === 'Included' ? '✓ Included' : v === 'Assistance' ? 'Assistance' : '✗';

/* ── BUY LEADS ── */
BGX.LEADS = [
  {id:"L001",co:"Al Habtoor Trading LLC",   country:"UAE",         name:"Mohammed Al Rashid", email:"m.rashid@alhabtoor.ae",     phone:"+971 50 234 5678", cat:"Textiles & Fabrics",    product:"Cotton Fabric",      qty:"5,000 meters/month", q:"hot",  status:"unassigned", assignedTo:[], addedDate:"2025-04-10"},
  {id:"L002",co:"Gulf Fresh Foods FZCO",     country:"UAE",         name:"Ahmad Khalil",        email:"ahmad@gulffresh.ae",         phone:"+971 55 876 4321", cat:"Spices & Condiments",   product:"Turmeric,Cumin",     qty:"2 MT/month",         q:"hot",  status:"unassigned", assignedTo:[], addedDate:"2025-04-09"},
  {id:"L003",co:"Khaleej Handicrafts",       country:"UAE",         name:"Fatima Al Zaabi",     email:"fatima@khaleej.ae",          phone:"+971 50 111 2233", cat:"Handicrafts & Artware", product:"Brass Handicrafts",  qty:"500 pcs/month",      q:"warm", status:"assigned",   assignedTo:["c3"], addedDate:"2025-04-08"},
  {id:"L004",co:"Dubai Textile Mart",        country:"UAE",         name:"Rajan Nair",          email:"rajan@dubaitextile.ae",      phone:"+971 52 999 8877", cat:"Textiles & Fabrics",    product:"Silk Fabric",        qty:"3,000 meters/month", q:"warm", status:"assigned",   assignedTo:["c1"], addedDate:"2025-04-07"},
  {id:"L005",co:"Meridian Foods Inc",        country:"USA",         name:"Sarah Mitchell",      email:"sarah@meridianfoods.com",    phone:"+1 415 234 5678",  cat:"Rice & Grains",         product:"Basmati Rice",       qty:"20 MT/month",        q:"hot",  status:"assigned",   assignedTo:["c7"], addedDate:"2025-04-08"},
  {id:"L006",co:"American Spice House",      country:"USA",         name:"David Johnson",       email:"david@amerispice.com",       phone:"+1 212 876 5432",  cat:"Spices & Condiments",   product:"Black Pepper",       qty:"1 MT/month",         q:"warm", status:"unassigned", assignedTo:[], addedDate:"2025-04-07"},
  {id:"L007",co:"Whole Earth Organics LLC",  country:"USA",         name:"Jennifer Lee",        email:"jennifer@wholeearth.com",    phone:"+1 310 555 1234",  cat:"Organic Food",          product:"Organic Turmeric",   qty:"500 kg/month",       q:"hot",  status:"assigned",   assignedTo:["c4"], addedDate:"2025-04-06"},
  {id:"L008",co:"Brooklyn Leather Co",       country:"USA",         name:"Marcus Brown",        email:"marcus@brooklynleather.com", phone:"+1 718 234 9876",  cat:"Leather Products",      product:"Leather Bags",       qty:"200 pcs/month",      q:"warm", status:"assigned",   assignedTo:["c8"], addedDate:"2025-04-05"},
  {id:"L009",co:"Euro Fresh GmbH",           country:"Germany",     name:"Klaus Weber",         email:"k.weber@eurofresh.de",       phone:"+49 30 1234 5678", cat:"Organic Food",          product:"Organic Rice",       qty:"10 MT/month",        q:"new",  status:"unassigned", assignedTo:[], addedDate:"2025-04-10"},
  {id:"L010",co:"Berlin Textile Imports",    country:"Germany",     name:"Hans Müller",         email:"hans@berlintextile.de",      phone:"+49 89 9876 5432", cat:"Textiles & Fabrics",    product:"Cotton Fabric,Denim",qty:"8,000 meters/month", q:"hot",  status:"assigned",   assignedTo:["c1"], addedDate:"2025-04-09"},
  {id:"L011",co:"Deutsche Gewürz GmbH",      country:"Germany",     name:"Anna Schmidt",        email:"anna@deutschegewurz.de",     phone:"+49 40 5555 6666", cat:"Spices & Condiments",   product:"Turmeric,Ginger",    qty:"3 MT/month",         q:"warm", status:"unassigned", assignedTo:[], addedDate:"2025-04-08"},
  {id:"L012",co:"Sunrise Imports Ltd",       country:"UK",          name:"Oliver Smith",        email:"oliver@sunrise.co.uk",       phone:"+44 20 7123 4567", cat:"Textiles & Fabrics",    product:"Jute Fabric",        qty:"4,000 meters/month", q:"new",  status:"assigned",   assignedTo:["c1"], addedDate:"2025-04-07"},
  {id:"L013",co:"London Spice Traders",      country:"UK",          name:"Priya Patel",         email:"priya@londonspice.co.uk",    phone:"+44 121 456 7890", cat:"Spices & Condiments",   product:"Cardamom,Cinnamon",  qty:"500 kg/month",       q:"warm", status:"unassigned", assignedTo:[], addedDate:"2025-04-06"},
  {id:"L014",co:"Heritage Craft UK",         country:"UK",          name:"Elizabeth Brown",     email:"liz@heritagecraft.co.uk",    phone:"+44 161 987 6543", cat:"Handicrafts & Artware", product:"Wooden Handicrafts", qty:"300 pcs/month",      q:"hot",  status:"assigned",   assignedTo:["c3"], addedDate:"2025-04-05"},
  {id:"L025",co:"Gulf Traders LLC",          country:"Saudi Arabia",name:"Ahmad Al-Saud",       email:"ahmad@gulftraders.sa",       phone:"+966 55 123 4567", cat:"Garments & Apparel",    product:"Men's Shirts",       qty:"2,000 pcs/month",    q:"hot",  status:"assigned",   assignedTo:["c5"], addedDate:"2025-04-09"},
  {id:"L026",co:"Riyadh Rice Distributors",  country:"Saudi Arabia",name:"Khalid Bin Salman",   email:"khalid@riyadhrice.sa",       phone:"+966 50 987 6543", cat:"Rice & Grains",         product:"Basmati Rice",       qty:"50 MT/month",        q:"hot",  status:"assigned",   assignedTo:["c7"], addedDate:"2025-04-08"},
  {id:"L031",co:"Amsterdam Rice Trade BV",   country:"Netherlands", name:"Pieter Van Der Berg", email:"pieter@amsterdamrice.nl",    phone:"+31 20 123 4567",  cat:"Rice & Grains",         product:"Basmati Rice",       qty:"30 MT/month",        q:"hot",  status:"unassigned", assignedTo:[], addedDate:"2025-04-09"},
  {id:"L032",co:"Seoul Fashion Imports Co",  country:"South Korea", name:"Kim Ji-Young",        email:"kimjy@seoulfashion.kr",      phone:"+82 2 1234 5678",  cat:"Garments & Apparel",    product:"Women's Kurtas",     qty:"3,000 pcs/month",    q:"hot",  status:"unassigned", assignedTo:[], addedDate:"2025-04-10"},
  {id:"L035",co:"Milano Leather Imports SRL",country:"Italy",       name:"Marco Rossi",         email:"marco@milanoleather.it",     phone:"+39 02 1234 5678", cat:"Leather Products",      product:"Leather Bags",       qty:"500 pcs/month",      q:"hot",  status:"assigned",   assignedTo:["c8"], addedDate:"2025-04-09"},
  {id:"L040",co:"Nairobi Grain Imports Ltd", country:"Kenya",       name:"John Kamau",          email:"john@nairobigrain.co.ke",    phone:"+254 722 123 456", cat:"Rice & Grains",         product:"Basmati Rice,Wheat", qty:"25 MT/month",        q:"hot",  status:"unassigned", assignedTo:[], addedDate:"2025-04-10"},
];

/* ── MESSAGES ── */
BGX.MESSAGES = {
  c1:[{from:"rm",text:"Hello Rajesh! Your batch of 12 verified buyers is live. 3 leads remaining this month.",time:"10:30 AM",date:"Today"}],
  c2:[{from:"rm",text:"Hi Priya! Your Professional plan leads are ready. 18 used, 2 remaining.",time:"9:00 AM",date:"Today"}],
  c3:[{from:"rm",text:"Hello Kiran! You're running low — 2 leads remaining. Would you like to upgrade?",time:"11:00 AM",date:"Today"},{from:"client",text:"Yes please, what are my options?",time:"11:05 AM",date:"Today"}],
  c4:[{from:"rm",text:"Hi Suresh! Your organic food leads are performing well this month.",time:"Yesterday",date:"Yesterday"}],
  c5:[{from:"rm",text:"Hi Manish, your plan has expired. Shall we renew? WhatsApp us at +91 98181 87246.",time:"2 days ago",date:"2 days ago"}],
  c6:[{from:"rm",text:"Welcome to BuyGenix, Deepa! Your Growth plan is active. First lead batch assigned.",time:"Apr 1",date:"Apr 1"}],
  c7:[{from:"rm",text:"Hi Amit! 9 new rice buyer leads assigned from UAE, Saudi Arabia, Netherlands.",time:"Yesterday",date:"Yesterday"}],
  c8:[{from:"rm",text:"Hello Fatima! Your leather leads from Italy and USA are live.",time:"Today",date:"Today"}],
};

/* ── PURCHASE HISTORY ── */
BGX.PURCHASES = {
  c1:[{date:"Jan 15, 2025",plan:"Growth Plan — Annual",      qty:"15 Leads/mo",amount:"₹27,000",status:"active"},{date:"Dec 12, 2024",plan:"GST Registration",qty:"1 Filing",amount:"₹999",status:"done"}],
  c2:[{date:"Mar 01, 2025",plan:"Professional Plan — Annual",qty:"20 Leads/mo",amount:"₹40,500",status:"active"}],
  c3:[{date:"Feb 10, 2025",plan:"Starter Plan — Annual",     qty:"10 Leads/mo",amount:"₹13,500",status:"active"}],
  c4:[{date:"Jan 20, 2025",plan:"Growth Plan — Annual",      qty:"15 Leads/mo",amount:"₹27,000",status:"active"}],
  c5:[{date:"Oct 01, 2024",plan:"Starter Plan — Annual",     qty:"10 Leads/mo",amount:"₹13,500",status:"expired"}],
  c6:[{date:"Apr 01, 2025",plan:"Growth Plan — Annual",      qty:"15 Leads/mo",amount:"₹27,000",status:"active"}],
  c7:[{date:"Feb 01, 2025",plan:"Growth Plan — Annual",      qty:"15 Leads/mo",amount:"₹27,000",status:"active"}],
  c8:[{date:"Mar 15, 2025",plan:"Professional Plan — Annual",qty:"20 Leads/mo",amount:"₹40,500",status:"active"}],
};

/* ── TICKETS ── */
BGX.TICKETS = [
  {id:"#BGX-0042",clientId:"c1",client:"Rajesh Sharma",   type:"Missing Lead",   priority:"urgent",desc:"April batch missing 3 UAE contacts.",   date:"2h ago",    status:"open"},
  {id:"#BGX-0041",clientId:"c5",client:"MK Garments",     type:"Billing",        priority:"urgent",desc:"Duplicate charge on renewal invoice.",   date:"5h ago",    status:"open"},
  {id:"#BGX-0040",clientId:"c3",client:"Kiran Handicrafts",type:"Lead Quality",  priority:"high",  desc:"3 leads have wrong phone numbers.",      date:"Yesterday", status:"open"},
  {id:"#BGX-0039",clientId:"c4",client:"Agro Fresh Ltd",   type:"Upgrade Query", priority:"normal",desc:"Interested in moving to Professional.",  date:"2 days ago",status:"open"},
  {id:"#BGX-0038",clientId:"c2",client:"Priya Exports",    type:"RM Change",     priority:"normal",desc:"Request to change Relationship Manager.",date:"3 days ago",status:"resolved"},
];

/* ── REFERRALS ── */
BGX.REFERRALS = [
  {referrer:"Rajesh Sharma",referrerId:"c1",referred:"Mehta Ceramics",   plan:"Growth",       commission:"₹4,050",date:"Apr 2025",status:"pending"},
  {referrer:"Priya Verma",  referrerId:"c2",referred:"Kerala Spices Co", plan:"Professional", commission:"₹6,075",date:"Mar 2025",status:"paid"},
  {referrer:"Suresh Patil", referrerId:"c4",referred:"Punjab Agro",       plan:"Starter",      commission:"₹2,025",date:"Feb 2025",status:"paid"},
];

/* ── HELPER FUNCTIONS ── */
BGX.getClient         = (id)    => BGX.CLIENTS.find(c=>c.id===id);
BGX.getRM             = (id)    => BGX.RMS.find(r=>r.id===id);
BGX.getLeadsForClient = (cid)   => BGX.LEADS.filter(l=>l.assignedTo.includes(cid));
BGX.getUnassignedLeads= ()      => BGX.LEADS.filter(l=>l.status==='unassigned');
BGX.getClientByEmail  = (email) => BGX.CLIENTS.find(c=>c.email.toLowerCase()===email.toLowerCase());

BGX.assignLeads = function(leadIds, clientId) {
  leadIds.forEach(lid=>{
    const lead=BGX.LEADS.find(l=>l.id===lid);
    if(lead&&!lead.assignedTo.includes(clientId)){
      lead.assignedTo.push(clientId); lead.status='assigned';
      const client=BGX.getClient(clientId);
      if(client) client.used=Math.min(client.used+1,client.limit);
    }
  });
};

BGX.addMessage = function(clientId, from, text) {
  if(!BGX.MESSAGES[clientId]) BGX.MESSAGES[clientId]=[];
  const now=new Date();
  BGX.MESSAGES[clientId].push({from,text,time:now.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}),date:'Today'});
};

BGX.addClient = function(client) {
  client.id='c'+(BGX.CLIENTS.length+1); client.used=0; client.status='active';
  client.joinDate=new Date().toISOString().split('T')[0];
  BGX.CLIENTS.push(client);
  const plan=BGX.getPlan(client.plan);
  BGX.MESSAGES[client.id]=[{from:'rm',text:`Welcome to BuyGenix, ${client.name.split(' ')[0]}! Your ${plan.label} is now active.`,time:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}),date:'Today'}];
  BGX.PURCHASES[client.id]=[{date:new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}),plan:plan.label+' — Annual',qty:BGX.fmtLeads(plan.indian_leads)+' leads/mo',amount:BGX.fmtPrice(plan.price)+' (excl. GST)',status:'active'}];
  return client;
};

console.log('✅ BGX Data v2.0 loaded |', BGX.CLIENTS.length,'clients |', BGX.LEADS.length,'leads | Plans: Supabase-backed');
