/* ═══════════════════════════════════════════════════════════════
   BuyGenix Solutions — Shared Data Store v1.0
   Single source of truth. Loaded by admin-portal.html AND client-portal.html
   In production: replace with Supabase / Firebase calls
═══════════════════════════════════════════════════════════════ */

window.BGX = window.BGX || {};

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

/* ── PRODUCT CATEGORIES & PRODUCTS ── */
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
  {id:"c1", name:"Rajesh Sharma",  biz:"RS Textiles Pvt Ltd",     cat:"Textiles & Fabrics",       products:["Cotton Fabric","Silk Fabric"],   city:"Delhi",     state:"Delhi",     gstin:"07AABCS1234A1Z5", email:"rajesh@rstextiles.com",    phone:"+91 98765 43210", plan:"growth",     billing:"monthly",  limit:500,  used:312, renewal:"2025-07-01", status:"active",   rmId:"rm1", otp:"123456", joinDate:"2025-01-15"},
  {id:"c2", name:"Priya Verma",    biz:"Priya Spice Exports",     cat:"Spices & Condiments",      products:["Turmeric","Black Pepper","Cardamom"], city:"Mumbai", state:"Maharashtra",gstin:"27AABCP5678B2Z3", email:"priya@priyaspice.com",     phone:"+91 98765 11111", plan:"professional",billing:"annual",  limit:2000, used:1840,renewal:"2026-03-01", status:"active",   rmId:"rm2", otp:"123456", joinDate:"2025-03-01"},
  {id:"c3", name:"Kiran Joshi",    biz:"Kiran Handicrafts",       cat:"Handicrafts & Artware",    products:["Brass Handicrafts","Marble Handicrafts"], city:"Jaipur",state:"Rajasthan",gstin:"08AABCK9012C3Z1", email:"kiran@handicrafts.com",    phone:"+91 98765 22222", plan:"starter",    billing:"monthly",  limit:100,  used:88,  renewal:"2025-05-01", status:"active",   rmId:"rm1", otp:"123456", joinDate:"2025-02-10"},
  {id:"c4", name:"Suresh Patil",   biz:"Agro Fresh Exports Ltd",  cat:"Organic Food",             products:["Organic Turmeric","Organic Rice"], city:"Pune",   state:"Maharashtra",gstin:"27AABCS3456D4Z9", email:"suresh@agrofresh.com",     phone:"+91 98765 33333", plan:"growth",     billing:"monthly",  limit:500,  used:201, renewal:"2025-08-01", status:"active",   rmId:"rm3", otp:"123456", joinDate:"2025-01-20"},
  {id:"c5", name:"Manish Kumar",   biz:"MK Garments & Co",        cat:"Garments & Apparel",       products:["Men's Shirts","Denim Jeans"],      city:"Surat",  state:"Gujarat",    gstin:"24AABCM7890E5Z7", email:"mk@mkgarments.com",         phone:"+91 98765 44444", plan:"starter",    billing:"monthly",  limit:100,  used:0,   renewal:"2025-04-01", status:"expired",  rmId:"rm2", otp:"123456", joinDate:"2024-10-01"},
  {id:"c6", name:"Deepa Mehta",    biz:"Mehta Ceramics Exports",  cat:"Handicrafts & Artware",    products:["Ceramic Artware","Terracotta"],    city:"Ahmedabad",state:"Gujarat",  gstin:"24AABCD1122F6Z4", email:"deepa@mehtaceramics.com",   phone:"+91 98765 55555", plan:"growth",     billing:"monthly",  limit:500,  used:44,  renewal:"2025-09-01", status:"active",   rmId:"rm3", otp:"123456", joinDate:"2025-04-01"},
  {id:"c7", name:"Amit Singh",     biz:"Singh Rice Exports",      cat:"Rice & Grains",            products:["Basmati Rice","Non-Basmati Rice"], city:"Amritsar",state:"Punjab",    gstin:"03AABCA3344G7Z2", email:"amit@singhrice.com",        phone:"+91 98765 66666", plan:"growth",     billing:"monthly",  limit:500,  used:156, renewal:"2025-06-01", status:"active",   rmId:"rm4", otp:"123456", joinDate:"2025-02-01"},
  {id:"c8", name:"Fatima Sheikh",  biz:"Sheikh Leather Works",    cat:"Leather Products",         products:["Leather Bags","Leather Shoes"],    city:"Kanpur",  state:"UP",         gstin:"09AABCF5566H8Z0", email:"fatima@sheikhleather.com",  phone:"+91 98765 77777", plan:"professional",billing:"monthly",  limit:2000, used:890, renewal:"2025-07-15", status:"active",   rmId:"rm5", otp:"123456", joinDate:"2025-03-15"},
];

/* ── PLANS ── */
BGX.PLANS = {
  starter:      {label:"Starter Plan",      limit:100,   price:4999,   pricePa:49999,   color:"#4A6A8A"},
  growth:       {label:"Growth Plan",       limit:500,   price:12999,  pricePa:129999,  color:"#B8860B"},
  professional: {label:"Professional Plan", limit:2000,  price:24999,  pricePa:249999,  color:"#1B3A5C"},
  enterprise:   {label:"Enterprise Plan",   limit:99999, price:0,      pricePa:0,       color:"#0B1929"},
};

/* ── BUY LEADS (BUYER DATABASE) ── */
BGX.LEADS = [
  // UAE
  {id:"L001",co:"Al Habtoor Trading LLC",     country:"UAE",         name:"Mohammed Al Rashid",  email:"m.rashid@alhabtoor.ae",       phone:"+971 50 234 5678", cat:"Textiles & Fabrics",     product:"Cotton Fabric",       qty:"5,000 meters/month",  q:"hot",  status:"unassigned", assignedTo:[], addedDate:"2025-04-10"},
  {id:"L002",co:"Gulf Fresh Foods FZCO",       country:"UAE",         name:"Ahmad Khalil",         email:"ahmad@gulffresh.ae",           phone:"+971 55 876 4321", cat:"Spices & Condiments",    product:"Turmeric,Cumin",      qty:"2 MT/month",          q:"hot",  status:"unassigned", assignedTo:[], addedDate:"2025-04-09"},
  {id:"L003",co:"Khaleej Handicrafts",         country:"UAE",         name:"Fatima Al Zaabi",      email:"fatima@khaleej.ae",            phone:"+971 50 111 2233", cat:"Handicrafts & Artware",  product:"Brass Handicrafts",   qty:"500 pcs/month",       q:"warm", status:"assigned",   assignedTo:["c3"], addedDate:"2025-04-08"},
  {id:"L004",co:"Dubai Textile Mart",          country:"UAE",         name:"Rajan Nair",           email:"rajan@dubaitextile.ae",        phone:"+971 52 999 8877", cat:"Textiles & Fabrics",     product:"Silk Fabric",         qty:"3,000 meters/month",  q:"warm", status:"assigned",   assignedTo:["c1"], addedDate:"2025-04-07"},
  // USA
  {id:"L005",co:"Meridian Foods Inc",          country:"USA",         name:"Sarah Mitchell",       email:"sarah@meridianfoods.com",      phone:"+1 415 234 5678",  cat:"Rice & Grains",          product:"Basmati Rice",        qty:"20 MT/month",         q:"hot",  status:"assigned",   assignedTo:["c7"], addedDate:"2025-04-08"},
  {id:"L006",co:"American Spice House",        country:"USA",         name:"David Johnson",        email:"david@amerispice.com",         phone:"+1 212 876 5432",  cat:"Spices & Condiments",    product:"Black Pepper,Cardamom",qty:"1 MT/month",         q:"warm", status:"unassigned", assignedTo:[], addedDate:"2025-04-07"},
  {id:"L007",co:"Whole Earth Organics LLC",    country:"USA",         name:"Jennifer Lee",         email:"jennifer@wholeearth.com",      phone:"+1 310 555 1234",  cat:"Organic Food",           product:"Organic Turmeric",    qty:"500 kg/month",        q:"hot",  status:"assigned",   assignedTo:["c4"], addedDate:"2025-04-06"},
  {id:"L008",co:"Brooklyn Leather Co",         country:"USA",         name:"Marcus Brown",         email:"marcus@brooklynleather.com",   phone:"+1 718 234 9876",  cat:"Leather Products",       product:"Leather Bags",        qty:"200 pcs/month",       q:"warm", status:"assigned",   assignedTo:["c8"], addedDate:"2025-04-05"},
  // Germany
  {id:"L009",co:"Euro Fresh GmbH",             country:"Germany",     name:"Klaus Weber",          email:"k.weber@eurofresh.de",         phone:"+49 30 1234 5678", cat:"Organic Food",           product:"Organic Rice",        qty:"10 MT/month",         q:"new",  status:"unassigned", assignedTo:[], addedDate:"2025-04-10"},
  {id:"L010",co:"Berlin Textile Imports",      country:"Germany",     name:"Hans Müller",          email:"hans@berlintextile.de",        phone:"+49 89 9876 5432", cat:"Textiles & Fabrics",     product:"Cotton Fabric,Denim", qty:"8,000 meters/month",  q:"hot",  status:"assigned",   assignedTo:["c1"], addedDate:"2025-04-09"},
  {id:"L011",co:"Deutsche Gewürz GmbH",        country:"Germany",     name:"Anna Schmidt",         email:"anna@deutschegewurz.de",       phone:"+49 40 5555 6666", cat:"Spices & Condiments",    product:"Turmeric,Ginger",     qty:"3 MT/month",          q:"warm", status:"unassigned", assignedTo:[], addedDate:"2025-04-08"},
  // UK
  {id:"L012",co:"Sunrise Imports Ltd",         country:"UK",          name:"Oliver Smith",         email:"oliver@sunrise.co.uk",         phone:"+44 20 7123 4567", cat:"Textiles & Fabrics",     product:"Jute Fabric",         qty:"4,000 meters/month",  q:"new",  status:"assigned",   assignedTo:["c1"], addedDate:"2025-04-07"},
  {id:"L013",co:"London Spice Traders",        country:"UK",          name:"Priya Patel",          email:"priya@londonspice.co.uk",      phone:"+44 121 456 7890", cat:"Spices & Condiments",    product:"Cardamom,Cinnamon",   qty:"500 kg/month",        q:"warm", status:"unassigned", assignedTo:[], addedDate:"2025-04-06"},
  {id:"L014",co:"Heritage Craft UK",           country:"UK",          name:"Elizabeth Brown",      email:"liz@heritagecraft.co.uk",      phone:"+44 161 987 6543", cat:"Handicrafts & Artware",  product:"Wooden Handicrafts",  qty:"300 pcs/month",       q:"hot",  status:"assigned",   assignedTo:["c3"], addedDate:"2025-04-05"},
  // Australia
  {id:"L015",co:"Pacific Agro Ltd",            country:"Australia",   name:"James Thornton",       email:"james@pacificagro.com.au",     phone:"+61 412 345 678",  cat:"Spices & Condiments",    product:"Turmeric,Cumin",      qty:"2 MT/month",          q:"warm", status:"assigned",   assignedTo:["c2"], addedDate:"2025-04-06"},
  {id:"L016",co:"Sydney Organic Foods",        country:"Australia",   name:"Rachel Green",         email:"rachel@sydneyorganic.com.au",  phone:"+61 423 456 789",  cat:"Organic Food",           product:"Organic Honey",       qty:"1,000 kg/month",      q:"hot",  status:"assigned",   assignedTo:["c4"], addedDate:"2025-04-05"},
  {id:"L017",co:"Melbourne Rice Imports",      country:"Australia",   name:"Tom Wilson",           email:"tom@melbournerice.com.au",     phone:"+61 434 567 890",  cat:"Rice & Grains",          product:"Basmati Rice",        qty:"15 MT/month",         q:"new",  status:"assigned",   assignedTo:["c7"], addedDate:"2025-04-04"},
  // Japan
  {id:"L018",co:"Nakamura Corp",               country:"Japan",       name:"Hiroshi Nakamura",     email:"h.n@nakamura.co.jp",           phone:"+81 3 1234 5678",  cat:"Handicrafts & Artware",  product:"Metal Sculptures",    qty:"100 pcs/month",       q:"conv", status:"converted",  assignedTo:["c3"], addedDate:"2025-03-20"},
  {id:"L019",co:"Tokyo Spice Import KK",       country:"Japan",       name:"Yuki Tanaka",          email:"yuki@tokyospice.co.jp",        phone:"+81 6 9876 5432",  cat:"Spices & Condiments",    product:"Turmeric,Black Pepper",qty:"1 MT/month",         q:"warm", status:"unassigned", assignedTo:[], addedDate:"2025-04-08"},
  {id:"L020",co:"Osaka Textile Trading",       country:"Japan",       name:"Kenji Yamamoto",       email:"kenji@osakatextile.co.jp",     phone:"+81 6 1111 2222",  cat:"Textiles & Fabrics",     product:"Silk Fabric",         qty:"2,000 meters/month",  q:"hot",  status:"assigned",   assignedTo:["c1"], addedDate:"2025-04-07"},
  // Singapore
  {id:"L021",co:"Fujian Imports Pte Ltd",      country:"Singapore",   name:"Lily Tan",             email:"lily@fujian.com.sg",           phone:"+65 9123 4567",    cat:"Organic Food",           product:"Organic Coconut Oil", qty:"500 kg/month",        q:"hot",  status:"assigned",   assignedTo:["c4"], addedDate:"2025-04-09"},
  {id:"L022",co:"Singapore Spice Hub",         country:"Singapore",   name:"Wei Chen",             email:"wei@sgspicehub.com.sg",        phone:"+65 8765 4321",    cat:"Spices & Condiments",    product:"Coriander,Cumin",     qty:"800 kg/month",        q:"warm", status:"unassigned", assignedTo:[], addedDate:"2025-04-08"},
  // Canada
  {id:"L023",co:"Alpha Wholesale Canada",      country:"Canada",      name:"Pierre Gagnon",        email:"pierre@alphawholesale.ca",     phone:"+1 514 234 5678",  cat:"Handicrafts & Artware",  product:"Terracotta,Block Print Items",qty:"400 pcs/month", q:"conv", status:"converted",  assignedTo:["c3"], addedDate:"2025-03-15"},
  {id:"L024",co:"Toronto Spice Market Inc",    country:"Canada",      name:"Anita Patel",          email:"anita@torontospice.ca",        phone:"+1 416 876 5432",  cat:"Spices & Condiments",    product:"Turmeric,Fenugreek",  qty:"1.5 MT/month",        q:"warm", status:"unassigned", assignedTo:[], addedDate:"2025-04-07"},
  // Saudi Arabia
  {id:"L025",co:"Gulf Traders LLC",            country:"Saudi Arabia",name:"Ahmad Al-Saud",        email:"ahmad@gulftraders.sa",         phone:"+966 55 123 4567", cat:"Garments & Apparel",     product:"Men's Shirts,Ethnic Wear",qty:"2,000 pcs/month",  q:"hot",  status:"assigned",   assignedTo:["c5"], addedDate:"2025-04-09"},
  {id:"L026",co:"Riyadh Rice Distributors",    country:"Saudi Arabia",name:"Khalid Bin Salman",    email:"khalid@riyadhrice.sa",         phone:"+966 50 987 6543", cat:"Rice & Grains",          product:"Basmati Rice",        qty:"50 MT/month",         q:"hot",  status:"assigned",   assignedTo:["c7"], addedDate:"2025-04-08"},
  {id:"L027",co:"Arabian Spice Co",            country:"Saudi Arabia",name:"Noor Al Rashid",       email:"noor@arabianspice.sa",         phone:"+966 54 555 6666", cat:"Spices & Condiments",    product:"Black Pepper,Cardamom",qty:"3 MT/month",         q:"warm", status:"unassigned", assignedTo:[], addedDate:"2025-04-07"},
  // Belgium
  {id:"L028",co:"Benelux Trading NV",          country:"Belgium",     name:"Jan De Bruyne",        email:"jan@benelux.be",               phone:"+32 2 123 4567",   cat:"Spices & Condiments",    product:"Turmeric,Coriander",  qty:"1 MT/month",          q:"warm", status:"assigned",   assignedTo:["c2"], addedDate:"2025-04-06"},
  // France
  {id:"L029",co:"Maison de Textile SARL",      country:"France",      name:"Claire Dubois",        email:"claire@maisontextile.fr",      phone:"+33 1 2345 6789",  cat:"Textiles & Fabrics",     product:"Embroidered Fabric",  qty:"2,000 meters/month",  q:"warm", status:"unassigned", assignedTo:[], addedDate:"2025-04-08"},
  {id:"L030",co:"Paris Organic Imports",       country:"France",      name:"Jean-Luc Martin",      email:"jl@parisorganic.fr",           phone:"+33 6 9876 5432",  cat:"Organic Food",           product:"Organic Ghee",        qty:"200 kg/month",        q:"new",  status:"unassigned", assignedTo:[], addedDate:"2025-04-07"},
  // Netherlands
  {id:"L031",co:"Amsterdam Rice Trade BV",     country:"Netherlands", name:"Pieter Van Der Berg",  email:"pieter@amsterdamrice.nl",      phone:"+31 20 123 4567",  cat:"Rice & Grains",          product:"Basmati Rice",        qty:"30 MT/month",         q:"hot",  status:"unassigned", assignedTo:[], addedDate:"2025-04-09"},
  // South Korea
  {id:"L032",co:"Seoul Fashion Imports Co",    country:"South Korea", name:"Kim Ji-Young",         email:"kimjy@seoulfashion.kr",        phone:"+82 2 1234 5678",  cat:"Garments & Apparel",     product:"Women's Kurtas,Ethnic Wear",qty:"3,000 pcs/month", q:"hot",  status:"unassigned", assignedTo:[], addedDate:"2025-04-10"},
  // Malaysia
  {id:"L033",co:"KL Spice Importers Sdn Bhd",  country:"Malaysia",    name:"Ahmad Razali",         email:"ahmad@klspice.com.my",         phone:"+60 12 345 6789",  cat:"Spices & Condiments",    product:"Black Pepper,Star Anise",qty:"2 MT/month",        q:"warm", status:"unassigned", assignedTo:[], addedDate:"2025-04-08"},
  // South Africa
  {id:"L034",co:"Cape Town Textile Imports",   country:"South Africa",name:"Samuel Dlamini",       email:"samuel@capetowntextile.co.za", phone:"+27 21 123 4567",  cat:"Textiles & Fabrics",     product:"Cotton Fabric",       qty:"6,000 meters/month",  q:"new",  status:"unassigned", assignedTo:[], addedDate:"2025-04-07"},
  // Italy
  {id:"L035",co:"Milano Leather Imports SRL",  country:"Italy",       name:"Marco Rossi",          email:"marco@milanoleather.it",       phone:"+39 02 1234 5678", cat:"Leather Products",       product:"Leather Bags,Leather Shoes",qty:"500 pcs/month",  q:"hot",  status:"assigned",   assignedTo:["c8"], addedDate:"2025-04-09"},
  // Egypt
  {id:"L036",co:"Nile Distributors LLC",       country:"Egypt",       name:"Kareem Fahmy",         email:"k.fahmy@niledistr.eg",         phone:"+20 10 1234 5678", cat:"Organic Food",           product:"Organic Rice",        qty:"8 MT/month",          q:"new",  status:"unassigned", assignedTo:[], addedDate:"2025-04-06"},
  // New entries for variety
  {id:"L037",co:"Istanbul Textile Group",      country:"Turkey",      name:"Mehmet Yilmaz",        email:"mehmet@istanbultextile.com",   phone:"+90 212 123 4567", cat:"Textiles & Fabrics",     product:"Woolen Fabric,Linen", qty:"5,000 meters/month",  q:"warm", status:"unassigned", assignedTo:[], addedDate:"2025-04-09"},
  {id:"L038",co:"Sao Paulo Organic Imports",   country:"Brazil",      name:"Carlos Oliveira",      email:"carlos@sporganic.com.br",      phone:"+55 11 1234 5678", cat:"Organic Food",           product:"Organic Tea,Organic Coffee",qty:"300 kg/month",   q:"new",  status:"unassigned", assignedTo:[], addedDate:"2025-04-08"},
  {id:"L039",co:"Mexico City Spice Co",        country:"Mexico",      name:"Maria Gonzalez",       email:"maria@mexicospice.mx",         phone:"+52 55 1234 5678", cat:"Spices & Condiments",    product:"Turmeric,Cumin",      qty:"1.5 MT/month",        q:"warm", status:"unassigned", assignedTo:[], addedDate:"2025-04-07"},
  {id:"L040",co:"Nairobi Grain Imports Ltd",   country:"Kenya",       name:"John Kamau",           email:"john@nairobigrain.co.ke",      phone:"+254 722 123 456", cat:"Rice & Grains",          product:"Basmati Rice,Wheat",  qty:"25 MT/month",         q:"hot",  status:"unassigned", assignedTo:[], addedDate:"2025-04-10"},
];

/* ── MESSAGES (chat between admin/RM and client) ── */
BGX.MESSAGES = {
  c1: [
    {from:"rm",  text:"Hello Rajesh! I'm Priya, your Relationship Manager. Your April batch of 12 verified buyers is live. How can I help?", time:"10:30 AM", date:"Today"},
    {from:"rm",  text:"Your balance: 188 leads remaining out of 500. Renewal: July 1, 2025.", time:"10:31 AM", date:"Today"},
  ],
  c2: [
    {from:"rm",  text:"Hi Priya! Your Professional plan leads are ready. 1840 leads used, 160 remaining. Any queries?", time:"9:00 AM", date:"Today"},
  ],
  c3: [
    {from:"rm",  text:"Hello Kiran! You're running low on leads — 12 remaining. Would you like to top up or upgrade?", time:"11:00 AM", date:"Today"},
    {from:"client", text:"Yes please, what are my options?", time:"11:05 AM", date:"Today"},
  ],
  c4: [{from:"rm", text:"Hi Suresh! Your organic food leads are performing well. 8.4% conversion rate this month.", time:"Yesterday", date:"Yesterday"}],
  c5: [{from:"rm", text:"Hi Manish, your plan has expired. Shall we renew? WhatsApp us at +91 98181 87246.", time:"2 days ago", date:"2 days ago"}],
  c6: [{from:"rm", text:"Welcome to BuyGenix, Deepa! Your Growth plan is active. First lead batch assigned.", time:"Apr 1", date:"Apr 1"}],
  c7: [{from:"rm", text:"Hi Amit! 15 new rice buyer leads assigned from UAE, Saudi Arabia, Netherlands.", time:"Yesterday", date:"Yesterday"}],
  c8: [{from:"rm", text:"Hello Fatima! Your leather leads from Italy and USA are live. Great quality batch this month.", time:"Today", date:"Today"}],
};

/* ── PURCHASE HISTORY ── */
BGX.PURCHASES = {
  c1: [
    {date:"Apr 01, 2025", plan:"Growth Plan — Monthly",  qty:"500 Leads", amount:"₹12,999", status:"active"},
    {date:"Mar 01, 2025", plan:"Growth Plan — Monthly",  qty:"500 Leads", amount:"₹12,999", status:"done"},
    {date:"Feb 01, 2025", plan:"Starter Plan — Monthly", qty:"100 Leads", amount:"₹4,999",  status:"done"},
    {date:"Jan 01, 2025", plan:"Starter Plan — Monthly", qty:"100 Leads", amount:"₹4,999",  status:"done"},
    {date:"Dec 12, 2024", plan:"GST Registration",        qty:"1 Filing",  amount:"₹999",    status:"done"},
  ],
  c2: [
    {date:"Mar 01, 2025", plan:"Professional Plan — Annual", qty:"24,000 Leads", amount:"₹2,49,999", status:"active"},
  ],
  c3: [
    {date:"Feb 01, 2025", plan:"Starter Plan — Monthly", qty:"100 Leads", amount:"₹4,999", status:"active"},
    {date:"Jan 01, 2025", plan:"Starter Plan — Monthly", qty:"100 Leads", amount:"₹4,999", status:"done"},
  ],
  c4: [
    {date:"Jan 20, 2025", plan:"Growth Plan — Monthly", qty:"500 Leads", amount:"₹12,999", status:"active"},
  ],
  c5: [
    {date:"Oct 01, 2024", plan:"Starter Plan — Monthly", qty:"100 Leads", amount:"₹4,999", status:"expired"},
  ],
  c6: [
    {date:"Apr 01, 2025", plan:"Growth Plan — Monthly", qty:"500 Leads", amount:"₹12,999", status:"active"},
  ],
  c7: [
    {date:"Feb 01, 2025", plan:"Growth Plan — Monthly", qty:"500 Leads", amount:"₹12,999", status:"active"},
  ],
  c8: [
    {date:"Mar 15, 2025", plan:"Professional Plan — Monthly", qty:"2,000 Leads", amount:"₹24,999", status:"active"},
  ],
};

/* ── TICKETS ── */
BGX.TICKETS = [
  {id:"#BGX-0042", clientId:"c1", client:"Rajesh Sharma",  type:"Missing Lead",    priority:"urgent", desc:"April batch missing 3 UAE contacts — Al Habtoor followup.", date:"2h ago",    status:"open"},
  {id:"#BGX-0041", clientId:"c5", client:"MK Garments",    type:"Billing",         priority:"urgent", desc:"Duplicate charge on renewal invoice April 2025.",            date:"5h ago",    status:"open"},
  {id:"#BGX-0040", clientId:"c3", client:"Kiran Handicrafts",type:"Lead Quality",  priority:"high",   desc:"3 leads have wrong/disconnected phone numbers.",             date:"Yesterday", status:"open"},
  {id:"#BGX-0039", clientId:"c4", client:"Agro Fresh Ltd",  type:"Upgrade Query",  priority:"normal", desc:"Interested in moving to Professional plan.",                 date:"2 days ago",status:"open"},
  {id:"#BGX-0038", clientId:"c2", client:"Priya Exports",   type:"RM Change",      priority:"normal", desc:"Request to change assigned Relationship Manager.",           date:"3 days ago",status:"resolved"},
];

/* ── REFERRALS ── */
BGX.REFERRALS = [
  {referrer:"Rajesh Sharma", referrerId:"c1", referred:"Mehta Ceramics",   plan:"Growth",       commission:"₹2,000",  date:"Apr 2025", status:"pending"},
  {referrer:"Priya Verma",   referrerId:"c2", referred:"Kerala Spices Co", plan:"Professional", commission:"₹5,000",  date:"Mar 2025", status:"paid"},
  {referrer:"Suresh Patil",  referrerId:"c4", referred:"Punjab Agro",       plan:"Starter",      commission:"₹500",    date:"Feb 2025", status:"paid"},
];

/* ── HELPER FUNCTIONS ── */
BGX.getClient = (id) => BGX.CLIENTS.find(c => c.id === id);
BGX.getRM     = (id) => BGX.RMS.find(r => r.id === id);
BGX.getPlan   = (key) => BGX.PLANS[key] || BGX.PLANS.starter;
BGX.getLeadsForClient = (clientId) => BGX.LEADS.filter(l => l.assignedTo.includes(clientId));
BGX.getUnassignedLeads = () => BGX.LEADS.filter(l => l.status === 'unassigned');
BGX.getClientByEmail = (email) => BGX.CLIENTS.find(c => c.email.toLowerCase() === email.toLowerCase());

BGX.assignLeads = function(leadIds, clientId) {
  leadIds.forEach(lid => {
    const lead = BGX.LEADS.find(l => l.id === lid);
    if (lead && !lead.assignedTo.includes(clientId)) {
      lead.assignedTo.push(clientId);
      lead.status = 'assigned';
      const client = BGX.getClient(clientId);
      if (client) client.used = Math.min(client.used + 1, client.limit);
    }
  });
};

BGX.addMessage = function(clientId, from, text) {
  if (!BGX.MESSAGES[clientId]) BGX.MESSAGES[clientId] = [];
  const now = new Date();
  BGX.MESSAGES[clientId].push({
    from, text,
    time: now.toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'}),
    date: 'Today'
  });
};

BGX.addRM = function(rm) {
  rm.id = 'rm' + (BGX.RMS.length + 1);
  rm.clients = rm.clients || [];
  rm.initials = rm.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  BGX.RMS.push(rm);
  return rm;
};

BGX.addLead = function(lead) {
  lead.id = 'L' + String(BGX.LEADS.length + 1).padStart(3, '0');
  lead.status = 'unassigned';
  lead.assignedTo = [];
  lead.addedDate = new Date().toISOString().split('T')[0];
  BGX.LEADS.push(lead);
  return lead;
};

BGX.addClient = function(client) {
  client.id = 'c' + (BGX.CLIENTS.length + 1);
  client.used = 0;
  client.status = 'active';
  client.joinDate = new Date().toISOString().split('T')[0];
  BGX.CLIENTS.push(client);
  BGX.MESSAGES[client.id] = [{
    from: 'rm',
    text: `Welcome to BuyGenix, ${client.name.split(' ')[0]}! I'm your Relationship Manager. Your ${BGX.getPlan(client.plan).label} is now active. Your first lead batch will be assigned shortly.`,
    time: new Date().toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'}),
    date: 'Today'
  }];
  BGX.PURCHASES[client.id] = [{
    date: new Date().toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'}),
    plan: BGX.getPlan(client.plan).label + ' — ' + (client.billing === 'annual' ? 'Annual' : 'Monthly'),
    qty: BGX.getPlan(client.plan).limit + ' Leads',
    amount: '₹' + BGX.getPlan(client.plan).price.toLocaleString('en-IN'),
    status: 'active'
  }];
  return client;
};

console.log('✅ BGX Data loaded:', BGX.CLIENTS.length, 'clients,', BGX.LEADS.length, 'leads,', BGX.RMS.length, 'RMs');
