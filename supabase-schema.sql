-- ═══════════════════════════════════════════════════════
--  BuyGenix Solutions — Complete Database Schema v4.0
--  Run this ENTIRE file in Supabase SQL Editor once
-- ═══════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 1. ADMIN USERS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username    TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  name        TEXT NOT NULL,
  role        TEXT DEFAULT 'rm',
  initials    TEXT,
  phone       TEXT,
  email       TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO admin_users (username,password,name,role,initials,email,phone) VALUES
  ('admin',      'buygenix2025',  'Admin',        'admin',      'A',  'admin@buygenixsolutions.com',  '+91 98181 87246'),
  ('superadmin', 'BGX@Super#99',  'Super Admin',  'superadmin', 'SA', 'super@buygenixsolutions.com',  '+91 98181 87246'),
  ('priya',      'priya@rm123',   'Priya Mehra',  'rm',         'PM', 'priya@buygenixsolutions.com',   '+91 90000 11111'),
  ('arjun',      'arjun@rm123',   'Arjun Kapoor', 'rm',         'AK', 'arjun@buygenixsolutions.com',   '+91 90000 22222'),
  ('divya',      'divya@rm123',   'Divya Singh',  'rm',         'DS', 'divya@buygenixsolutions.com',   '+91 90000 33333')
ON CONFLICT (username) DO NOTHING;

-- ─── 2. MEMBERSHIP PLANS (admin can create custom) ────
CREATE TABLE IF NOT EXISTS membership_plans (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  label        TEXT NOT NULL,
  lead_limit   INTEGER NOT NULL DEFAULT 0,
  price_monthly INTEGER NOT NULL DEFAULT 0,
  price_quarterly INTEGER DEFAULT 0,
  price_annual INTEGER DEFAULT 0,
  features     TEXT[],
  is_active    BOOLEAN DEFAULT true,
  sort_order   INTEGER DEFAULT 0,
  created_by   UUID REFERENCES admin_users(id),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO membership_plans (name,label,lead_limit,price_monthly,price_quarterly,price_annual,features,sort_order) VALUES
  ('none',         'No Plan',           0,     0,      0,       0,       ARRAY['Account registered','Pending activation'],                                                      0),
  ('starter',      'Starter Plan',      100,   4999,   13999,   49999,   ARRAY['100 leads/month','Phone + Email contacts','CSV export','Basic RM support'],                    1),
  ('growth',       'Growth Plan',       500,   12999,  36999,   129999,  ARRAY['500 leads/month','Phone + Email + WhatsApp','CSV export','Dedicated RM','Priority support'],   2),
  ('professional', 'Professional Plan', 2000,  24999,  69999,   249999,  ARRAY['2000 leads/month','All contact types','CSV export','Senior RM','Priority + WhatsApp support'], 3),
  ('enterprise',   'Enterprise Plan',   99999, 0,      0,       0,       ARRAY['Unlimited leads','All contact types','Custom RM team','24/7 support','Custom reporting'],      4)
ON CONFLICT DO NOTHING;

-- ─── 3. CLIENTS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                    TEXT NOT NULL,
  business_name           TEXT,
  email                   TEXT UNIQUE NOT NULL,
  phone                   TEXT,
  city                    TEXT,
  state                   TEXT,
  gstin                   TEXT,
  category                TEXT,
  products                TEXT[],
  otp                     TEXT DEFAULT '123456',
  plan                    TEXT DEFAULT 'none',
  plan_label              TEXT DEFAULT 'No Plan',
  billing_cycle           TEXT DEFAULT 'monthly',
  lead_limit              INTEGER DEFAULT 0,
  leads_used              INTEGER DEFAULT 0,
  plan_status             TEXT DEFAULT 'pending',
  renewal_date            DATE,
  plan_price              INTEGER DEFAULT 0,
  rm_id                   UUID REFERENCES admin_users(id),
  membership_plan_id      UUID REFERENCES membership_plans(id),
  membership_assigned_by  UUID REFERENCES admin_users(id),
  membership_assigned_at  TIMESTAMPTZ,
  join_date               TIMESTAMPTZ DEFAULT NOW(),
  notes                   TEXT,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Sample clients
INSERT INTO clients (name,business_name,email,phone,city,state,category,otp,plan,plan_label,plan_status,lead_limit,leads_used,billing_cycle,plan_price) VALUES
  ('Rajesh Sharma',  'RS Textiles Pvt Ltd',   'rajesh@rstextiles.com',    '+91 98765 43210','Delhi',   'Delhi',       'Textiles & Fabrics',   '123456','growth',       'Growth Plan',       'active',  500,  120,'monthly',12999),
  ('Priya Verma',    'Priya Spice Exports',    'priya@priyaspice.com',     '+91 98765 11111','Mumbai',  'Maharashtra', 'Spices & Condiments',  '123456','professional', 'Professional Plan', 'active',  2000, 890,'monthly',24999),
  ('Kiran Joshi',    'Kiran Handicrafts',      'kiran@handicrafts.com',    '+91 98765 22222','Jaipur',  'Rajasthan',   'Handicrafts & Artware','123456','starter',      'Starter Plan',      'active',  100,  45, 'monthly',4999),
  ('Suresh Patil',   'Agro Fresh Exports Ltd', 'suresh@agrofresh.com',     '+91 98765 33333','Pune',    'Maharashtra', 'Organic Food',         '123456','growth',       'Growth Plan',       'active',  500,  201,'monthly',12999),
  ('Manish Kumar',   'MK Garments & Co',       'mk@mkgarments.com',        '+91 98765 44444','Surat',   'Gujarat',     'Garments & Apparel',   '123456','starter',      'Starter Plan',      'expired', 100,  0,  'monthly',4999),
  ('Fatima Sheikh',  'Sheikh Leather Works',   'fatima@sheikhleather.com', '+91 98765 55555','Kanpur',  'UP',          'Leather Products',     '123456','professional', 'Professional Plan', 'active',  2000, 890,'monthly',24999)
ON CONFLICT (email) DO NOTHING;

-- ─── 4. ENQUIRIES ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS enquiries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  business    TEXT,
  city        TEXT,
  category    TEXT,
  message     TEXT,
  interest    TEXT DEFAULT 'general',
  status      TEXT DEFAULT 'new',
  assigned_to UUID REFERENCES admin_users(id),
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 5. MEMBERSHIP ASSIGNMENTS ────────────────────────
CREATE TABLE IF NOT EXISTS membership_assignments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id       UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  plan            TEXT NOT NULL,
  plan_label      TEXT,
  billing_cycle   TEXT DEFAULT 'monthly',
  lead_limit      INTEGER NOT NULL,
  price           INTEGER NOT NULL,
  start_date      DATE DEFAULT CURRENT_DATE,
  end_date        DATE,
  assigned_by     UUID REFERENCES admin_users(id),
  status          TEXT DEFAULT 'active',
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 6. BUY LEADS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS buy_leads (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company      TEXT NOT NULL,
  country      TEXT NOT NULL,
  contact_name TEXT,
  email        TEXT,
  phone        TEXT,
  category     TEXT,
  product      TEXT,
  quantity     TEXT,
  quality      TEXT DEFAULT 'new',
  source       TEXT,
  status       TEXT DEFAULT 'unassigned',
  notes        TEXT,
  added_by     UUID REFERENCES admin_users(id),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Sample leads
INSERT INTO buy_leads (company,country,contact_name,email,phone,category,product,quantity,quality,status) VALUES
  ('Al Habtoor Trading LLC',   'UAE',         'Mohammed Al Rashid','m.rashid@alhabtoor.ae',   '+971 50 234 5678','Textiles & Fabrics',   'Cotton Fabric',       '5,000 m/mo',  'hot',  'assigned'),
  ('Gulf Fresh Foods FZCO',    'UAE',         'Ahmad Khalil',      'ahmad@gulffresh.ae',       '+971 55 876 4321','Spices & Condiments',  'Turmeric, Cumin',     '2 MT/mo',     'hot',  'assigned'),
  ('Euro Fresh GmbH',          'Germany',     'Klaus Weber',       'k.weber@eurofresh.de',     '+49 30 1234 5678','Organic Food',         'Organic Rice',        '10 MT/mo',    'new',  'unassigned'),
  ('Meridian Foods Inc',       'USA',         'Sarah Mitchell',    'sarah@meridianfoods.com',  '+1 415 234 5678', 'Rice & Grains',        'Basmati Rice',        '20 MT/mo',    'hot',  'assigned'),
  ('Pacific Agro Ltd',         'Australia',   'James Thornton',    'james@pacificagro.com.au', '+61 412 345 678', 'Spices & Condiments',  'Turmeric, Cumin',     '2 MT/mo',     'warm', 'unassigned'),
  ('Gulf Traders LLC',         'Saudi Arabia','Ahmad Al-Saud',     'ahmad@gulftraders.sa',     '+966 55 123 4567','Garments & Apparel',   "Men's Shirts",        '2,000 pc/mo', 'hot',  'assigned'),
  ('Amsterdam Rice Trade BV',  'Netherlands', 'Pieter Van Berg',   'pieter@amsterdamrice.nl',  '+31 20 123 4567', 'Rice & Grains',        'Basmati Rice',        '30 MT/mo',    'hot',  'unassigned'),
  ('Seoul Fashion Imports',    'South Korea', 'Kim Ji-Young',      'kimjy@seoulfashion.kr',    '+82 2 1234 5678', 'Garments & Apparel',   "Women's Kurtas",      '3,000 pc/mo', 'hot',  'unassigned'),
  ('Milano Leather SRL',       'Italy',       'Marco Rossi',       'marco@milanoleather.it',   '+39 02 1234 5678','Leather Products',     'Leather Bags',        '500 pc/mo',   'hot',  'assigned'),
  ('Toronto Spice Market',     'Canada',      'Anita Patel',       'anita@torontospice.ca',    '+1 416 876 5432', 'Spices & Condiments',  'Turmeric, Fenugreek', '1.5 MT/mo',   'warm', 'unassigned'),
  ('Nairobi Grain Imports',    'Kenya',       'John Kamau',        'john@nairobigrain.co.ke',  '+254 722 123456', 'Rice & Grains',        'Basmati Rice, Wheat', '25 MT/mo',    'hot',  'unassigned'),
  ('Tokyo Home Goods Co',      'Japan',       'Hiroshi Tanaka',    'h.tanaka@tokyohome.co.jp', '+81 3 1234 5678', 'Handicrafts & Artware','Brass Handicrafts',   '200 pc/mo',   'warm', 'unassigned')
ON CONFLICT DO NOTHING;

-- ─── 7. LEAD ASSIGNMENTS ──────────────────────────────
CREATE TABLE IF NOT EXISTS lead_assignments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id     UUID NOT NULL REFERENCES buy_leads(id) ON DELETE CASCADE,
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES admin_users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  is_visible  BOOLEAN DEFAULT true,
  UNIQUE(lead_id, client_id)
);

-- ─── 8. TICKETS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS tickets (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  type        TEXT,
  priority    TEXT DEFAULT 'normal',
  description TEXT NOT NULL,
  status      TEXT DEFAULT 'open',
  assigned_to UUID REFERENCES admin_users(id),
  resolved_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 9. PURCHASES ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS purchases (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity    TEXT,
  amount      INTEGER,
  status      TEXT DEFAULT 'active',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 10. REFERRALS ────────────────────────────────────
CREATE TABLE IF NOT EXISTS referrals (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id    UUID REFERENCES clients(id),
  referred_name  TEXT NOT NULL,
  referred_email TEXT,
  plan           TEXT,
  commission     INTEGER,
  status         TEXT DEFAULT 'pending',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── DISABLE RLS (for development) ───────────────────
ALTER TABLE clients              DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users          DISABLE ROW LEVEL SECURITY;
ALTER TABLE buy_leads            DISABLE ROW LEVEL SECURITY;
ALTER TABLE lead_assignments     DISABLE ROW LEVEL SECURITY;
ALTER TABLE tickets              DISABLE ROW LEVEL SECURITY;
ALTER TABLE purchases            DISABLE ROW LEVEL SECURITY;
ALTER TABLE referrals            DISABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries            DISABLE ROW LEVEL SECURITY;
ALTER TABLE membership_assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE membership_plans     DISABLE ROW LEVEL SECURITY;

-- ─── VIEWS ────────────────────────────────────────────
DROP VIEW IF EXISTS client_dashboard;
CREATE VIEW client_dashboard AS
SELECT
  c.id, c.name, c.business_name, c.email, c.phone,
  c.category, c.city, c.state, c.gstin,
  c.plan, c.plan_label, c.plan_status, c.billing_cycle,
  c.lead_limit, c.leads_used,
  GREATEST(c.lead_limit - c.leads_used, 0) AS leads_remaining,
  c.renewal_date, c.plan_price, c.otp,
  c.join_date, c.notes, c.rm_id,
  c.membership_assigned_at,
  a.name       AS rm_name,
  a.phone      AS rm_phone,
  a.email      AS rm_email,
  a.initials   AS rm_initials,
  a.role       AS rm_role,
  COUNT(la.id) AS assigned_leads_count
FROM clients c
LEFT JOIN admin_users a ON a.id = c.rm_id
LEFT JOIN lead_assignments la ON la.client_id = c.id
GROUP BY c.id, a.id;
