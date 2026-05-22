/* ═══════════════════════════════════════════════════════════
   BuyGenix Solutions — Data Store v3.0
   Supabase-backed with local fallbacks
═══════════════════════════════════════════════════════════ */
window.BGX = window.BGX || {};

/* ── COUNTRIES ── */
BGX.COUNTRIES = [
  "UAE","USA","Germany","UK","Australia","Japan","Singapore","Canada",
  "Saudi Arabia","Belgium","Egypt","France","Italy","Netherlands",
  "South Korea","Malaysia","Thailand","Indonesia","South Africa",
  "Kenya","Nigeria","Brazil","Mexico","Turkey","Qatar","Kuwait",
  "Oman","Jordan","New Zealand","Spain","Portugal","Sweden","Norway",
  "Denmark","Finland","Poland","Czech Republic","Vietnam","Philippines",
  "Bangladesh","Sri Lanka","Israel","Austria","Greece","Romania"
];

/* ── PRODUCT CATEGORIES ── */
BGX.CATEGORIES = {
  "Textiles & Fabrics":     ["Cotton Fabric","Silk Fabric","Polyester Fabric","Woolen Fabric","Denim","Linen","Jute Fabric","Embroidered Fabric","Home Textiles","Technical Textiles"],
  "Spices & Condiments":    ["Turmeric","Black Pepper","Cardamom","Cumin","Coriander","Red Chilli","Ginger","Cloves","Cinnamon","Nutmeg","Fenugreek","Star Anise"],
  "Rice & Grains":          ["Basmati Rice","Non-Basmati Rice","Wheat","Maize","Sorghum","Millet","Oats","Barley","Broken Rice"],
  "Organic Food":           ["Organic Turmeric","Organic Rice","Organic Wheat","Organic Pulses","Organic Tea","Organic Coffee","Organic Honey","Organic Coconut Oil","Organic Ghee"],
  "Handicrafts & Artware":  ["Brass Handicrafts","Marble Handicrafts","Wooden Handicrafts","Ceramic Artware","Leather Goods","Jute Products","Block Print Items","Metal Sculptures","Terracotta"],
  "Garments & Apparel":     ["Men's Shirts","Women's Kurtas","Kids Wear","Denim Jeans","Ethnic Wear","Sportswear","Nightwear","Uniforms","Fashion Accessories"],
  "Gems & Jewellery":       ["Gold Jewellery","Silver Jewellery","Diamond Jewellery","Gemstones","Costume Jewellery","Handmade Jewellery"],
  "Chemicals & Pharma":     ["Bulk Drugs","Formulations","Dyes","Pigments","Agro Chemicals","Specialty Chemicals","Cosmetic Ingredients"],
  "Engineering Goods":      ["Auto Parts","Castings","Forgings","Pumps","Valves","Hand Tools","Fasteners","Electrical Equipment"],
  "Leather Products":       ["Leather Shoes","Leather Bags","Leather Wallets","Leather Belts","Leather Jackets","Leather Gloves"],
  "Fresh Produce":          ["Mangoes","Grapes","Pomegranates","Bananas","Onions","Potatoes","Baby Corn","Okra","Bitter Gourd"],
  "Processed Food":         ["Pickles","Chutneys","Sauces","Ready Meals","Frozen Food","Snacks","Beverages","Dairy Products"]
};

/* ── RELATIONSHIP MANAGERS ── */
BGX.RMS = [
  { id:"rm1", name:"Priya Mehra",   role:"Senior Export Consultant", phone:"+91 98181 87246", email:"priya@buygenixsolutions.com",   initials:"PM" },
  { id:"rm2", name:"Arjun Kapoor",  role:"Export Consultant",        phone:"+91 98182 11111", email:"arjun@buygenixsolutions.com",  initials:"AK" },
  { id:"rm3", name:"Divya Singh",   role:"Export Consultant",        phone:"+91 98183 22222", email:"divya@buygenixsolutions.com",  initials:"DS" },
  { id:"rm4", name:"Rohit Verma",   role:"Junior Consultant",        phone:"+91 98184 33333", email:"rohit@buygenixsolutions.com",  initials:"RV" },
  { id:"rm5", name:"Sneha Joshi",   role:"Junior Consultant",        phone:"+91 98185 44444", email:"sneha@buygenixsolutions.com",  initials:"SJ" }
];

/* ── MEMBERSHIP PLANS (local fallback — overwritten by Supabase) ── */
BGX.PLANS = {
  starter: {
    id:'starter', label:'Starter', badge:'', color:'#4A6A8A',
    price:13500, price_original:15000, savings:1500,
    best_for:'New businesses entering global trade',
    indian_leads:10, intl_leads:0,
    features:[
      '10 Indian buyer leads per year',
      'Dedicated Relationship Manager',
      'Product page on BuyGenix website',
      'Virtual Business Card (1)',
      'IEC & MSME registration assistance',
      'GST registration assistance',
      'WhatsApp & email lead delivery',
      'Email support'
    ],
    cta:'Get Started', is_popular:false, sort_order:1, is_active:true
  },
  growth: {
    id:'growth', label:'Growth', badge:'Most Popular', color:'#B8860B',
    price:27000, price_original:30000, savings:3000,
    best_for:'Growing businesses expanding internationally',
    indian_leads:15, intl_leads:10,
    features:[
      '15 Indian + 10 international buyer leads',
      'Dedicated Relationship Manager',
      'Product page + 10-product digital catalogue',
      'Virtual Business Card (1)',
      'IEC, MSME & FSSAI registration assistance',
      'GST registration assistance',
      'SEO optimisation for your product pages',
      'Quarterly social media promotion',
      'WhatsApp & email lead delivery',
      'Performance reports on request'
    ],
    cta:'Choose Growth', is_popular:true, sort_order:2, is_active:true
  },
  professional: {
    id:'professional', label:'Professional', badge:'Best Value', color:'#1E5FA8',
    price:45000, price_original:50000, savings:5000,
    best_for:'Established exporters seeking premium exposure',
    indian_leads:20, intl_leads:20,
    features:[
      '20 Indian + 20 international buyer leads',
      'Dedicated Senior Relationship Manager',
      'Full product catalogue (unlimited products)',
      'Virtual Business Card (3)',
      'All registrations: IEC, MSME, FSSAI, GST',
      'Full SEO + Social Media Optimisation',
      'Monthly social media promotion',
      'Monthly performance & analytics reports',
      'Priority WhatsApp support',
      'Quarterly export strategy consultation',
      '30-minute onboarding strategy call'
    ],
    cta:'Go Professional', is_popular:false, sort_order:3, is_active:true
  },
  enterprise: {
    id:'enterprise', label:'Enterprise', badge:'Custom', color:'#0B1929',
    price:0, price_original:0, savings:0,
    best_for:'Large exporters & trading houses',
    indian_leads:null, intl_leads:null,
    features:[
      'Unlimited buyer leads (all categories)',
      'Dedicated Account Manager team',
      'Full catalogue + website integration',
      'Unlimited virtual business cards',
      'All registrations included',
      'Custom SEO, SMO & content strategy',
      'Weekly performance reports',
      'Priority 24/7 WhatsApp support',
      'Monthly strategy consultation',
      'Custom CRM integration',
      'Co-branded marketing materials'
    ],
    cta:'Contact Us', is_popular:false, sort_order:4, is_active:true
  }
};

/* ── LOAD PLANS FROM SUPABASE ── */
BGX.loadPlans = async function() {
  try {
    const url = `${window.BGX_SUPABASE_URL||'https://qzaeshegpdoknsiuvidr.supabase.co'}/rest/v1/membership_plans?is_active=eq.true&order=sort_order`;
    const res = await fetch(url, {
      headers: {
        'apikey': window.BGX_SUPABASE_ANON || '',
        'Authorization': `Bearer ${window.BGX_SUPABASE_ANON || ''}`
      }
    });
    if (!res.ok) return;
    const rows = await res.json();
    if (rows && rows.length) {
      rows.forEach(row => {
        if (row.key && BGX.PLANS[row.key]) {
          Object.assign(BGX.PLANS[row.key], row);
        }
      });
    }
  } catch(e) { /* use local fallback */ }
};

/* ── COUNTRY FLAGS ── */
BGX.FLAGS = {
  "UAE":"🇦🇪","USA":"🇺🇸","Germany":"🇩🇪","UK":"🇬🇧","Australia":"🇦🇺",
  "Japan":"🇯🇵","Singapore":"🇸🇬","Canada":"🇨🇦","Saudi Arabia":"🇸🇦",
  "Belgium":"🇧🇪","Egypt":"🇪🇬","France":"🇫🇷","Italy":"🇮🇹",
  "Netherlands":"🇳🇱","South Korea":"🇰🇷","Malaysia":"🇲🇾",
  "Thailand":"🇹🇭","Indonesia":"🇮🇩","South Africa":"🇿🇦","Kenya":"🇰🇪",
  "Nigeria":"🇳🇬","Brazil":"🇧🇷","Mexico":"🇲🇽","Turkey":"🇹🇷",
  "Qatar":"🇶🇦","Kuwait":"🇰🇼","Oman":"🇴🇲","Jordan":"🇯🇴",
  "New Zealand":"🇳🇿","Spain":"🇪🇸","Portugal":"🇵🇹","Sweden":"🇸🇪",
  "Norway":"🇳🇴","Denmark":"🇩🇰","Finland":"🇫🇮","Poland":"🇵🇱",
  "Vietnam":"🇻🇳","Philippines":"🇵🇭","Bangladesh":"🇧🇩","Sri Lanka":"🇱🇰",
  "Israel":"🇮🇱","Austria":"🇦🇹","Greece":"🇬🇷","Romania":"🇷🇴","China":"🇨🇳"
};

/* ── SAMPLE BUYER LEADS (for display) ── */
BGX.SAMPLE_LEADS = [
  { flag:"🇩🇪", country:"Germany",       product:"Organic Turmeric",    qty:"5 MT/month",   status:"new" },
  { flag:"🇦🇪", country:"UAE",           product:"Basmati Rice",         qty:"10 MT/month",  status:"hot" },
  { flag:"🇺🇸", country:"USA",           product:"Cotton Fabric",        qty:"2,000 metres", status:"verified" },
  { flag:"🇬🇧", country:"UK",            product:"Brass Handicrafts",    qty:"500 units",    status:"new" },
  { flag:"🇸🇬", country:"Singapore",     product:"Black Pepper",         qty:"2 MT/month",   status:"hot" },
  { flag:"🇦🇺", country:"Australia",     product:"Leather Bags",         qty:"300 units",    status:"verified" },
  { flag:"🇯🇵", country:"Japan",         product:"Silk Fabric",          qty:"1,500 metres", status:"new" },
  { flag:"🇸🇦", country:"Saudi Arabia",  product:"Spice Blends",         qty:"3 MT/quarter", status:"hot" },
  { flag:"🇨🇦", country:"Canada",        product:"Organic Honey",        qty:"500 kg/month", status:"verified" },
  { flag:"🇫🇷", country:"France",        product:"Jute Products",        qty:"1,000 units",  status:"new" }
];
