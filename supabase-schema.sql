-- ═══════════════════════════════════════════════════════
--  BuyGenix Solutions — Complete Database Schema
--  Run this entire file in Supabase SQL Editor
--  Project: buygenix
-- ═══════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ═══════════════════════
--  1. ADMIN USERS
-- ═══════════════════════
CREATE TABLE IF NOT EXISTS admin_users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username    TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,         -- store hashed in production
  name        TEXT NOT NULL,
  role        TEXT DEFAULT 'rm',     -- 'admin' | 'superadmin' | 'rm'
  initials    TEXT,
  phone       TEXT,
  email       TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Default admin accounts
INSERT INTO admin_users (username, password, name, role, initials, email) VALUES
  ('admin',       'buygenix2025',  'Admin',        'admin',       'A',  'admin@buygenixsolutions.com'),
  ('superadmin',  'BGX@Super#99',  'Super Admin',  'superadmin',  'SA', 'super@buygenixsolutions.com'),
  ('priya',       'priya@rm123',   'Priya Mehra',  'rm',          'PM', 'priya@buygenixsolutions.com'),
  ('arjun',       'arjun@rm123',   'Arjun Kapoor', 'rm',          'AK', 'arjun@buygenixsolutions.com'),
  ('divya',       'divya@rm123',   'Divya Singh',  'rm',          'DS', 'divya@buygenixsolutions.com');


-- ═══════════════════════
--  2. CLIENTS
-- ═══════════════════════
CREATE TABLE IF NOT EXISTS clients (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  business_name   TEXT,
  email           TEXT UNIQUE NOT NULL,
  phone           TEXT,
  city            TEXT,
  state           TEXT,
  gstin           TEXT,
  category        TEXT,
  products        TEXT[],            -- array of product names
  otp             TEXT DEFAULT '123456',
  plan            TEXT DEFAULT 'none',   -- 'none'|'starter'|'growth'|'professional'|'enterprise'
  billing_cycle   TEXT DEFAULT 'monthly',
  lead_limit      INTEGER DEFAULT 0,
  leads_used      INTEGER DEFAULT 0,
  plan_status     TEXT DEFAULT 'pending', -- 'pending'|'active'|'expired'|'suspended'
  renewal_date    DATE,
  rm_id           UUID REFERENCES admin_users(id),
  membership_assigned_by UUID REFERENCES admin_users(id),
  membership_assigned_at TIMESTAMPTZ,
  join_date       TIMESTAMPTZ DEFAULT NOW(),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ═══════════════════════
--  3. CONTACT / ENQUIRIES
--     (from website contact form)
-- ═══════════════════════
CREATE TABLE IF NOT EXISTS enquiries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  business    TEXT,
  city        TEXT,
  category    TEXT,
  message     TEXT,
  interest    TEXT DEFAULT 'general',  -- 'membership'|'leads'|'gst'|'general'
  status      TEXT DEFAULT 'new',      -- 'new'|'contacted'|'converted'|'closed'
  assigned_to UUID REFERENCES admin_users(id),
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ═══════════════════════
--  4. MEMBERSHIP ASSIGNMENTS
--     (admin assigns a plan to a client)
-- ═══════════════════════
CREATE TABLE IF NOT EXISTS membership_assignments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id       UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  plan            TEXT NOT NULL,
  billing_cycle   TEXT DEFAULT 'monthly',
  lead_limit      INTEGER NOT NULL,
  price           INTEGER NOT NULL,
  start_date      DATE DEFAULT CURRENT_DATE,
  end_date        DATE,
  assigned_by     UUID REFERENCES admin_users(id),
  status          TEXT DEFAULT 'active',  -- 'active'|'expired'|'suspended'
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ═══════════════════════
--  5. BUY LEADS (global pool)
-- ═══════════════════════
CREATE TABLE IF NOT EXISTS buy_leads (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company     TEXT NOT NULL,
  country     TEXT NOT NULL,
  contact_name TEXT,
  email       TEXT,
  phone       TEXT,
  category    TEXT,
  product     TEXT,
  quantity    TEXT,
  quality     TEXT DEFAULT 'new',   -- 'hot'|'warm'|'new'
  source      TEXT,
  status      TEXT DEFAULT 'unassigned', -- 'unassigned'|'assigned'|'converted'
  notes       TEXT,
  added_by    UUID REFERENCES admin_users(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ═══════════════════════
--  6. LEAD ASSIGNMENTS
--     (which leads are assigned to which client)
-- ═══════════════════════
CREATE TABLE IF NOT EXISTS lead_assignments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id       UUID NOT NULL REFERENCES buy_leads(id) ON DELETE CASCADE,
  client_id     UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  assigned_by   UUID REFERENCES admin_users(id),
  assigned_at   TIMESTAMPTZ DEFAULT NOW(),
  is_visible    BOOLEAN DEFAULT true,  -- admin can hide a lead from client
  UNIQUE(lead_id, client_id)           -- no duplicate assignments
);


-- ═══════════════════════
--  7. MESSAGES / CHAT
-- ═══════════════════════
CREATE TABLE IF NOT EXISTS messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  sender      TEXT NOT NULL,   -- 'rm' | 'client'
  sender_name TEXT,
  text        TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ═══════════════════════
--  8. SUPPORT TICKETS
-- ═══════════════════════
CREATE TABLE IF NOT EXISTS tickets (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  type        TEXT,
  priority    TEXT DEFAULT 'normal',  -- 'normal'|'high'|'urgent'
  description TEXT NOT NULL,
  status      TEXT DEFAULT 'open',    -- 'open'|'in_progress'|'resolved'
  assigned_to UUID REFERENCES admin_users(id),
  resolved_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ═══════════════════════
--  9. PURCHASE HISTORY
-- ═══════════════════════
CREATE TABLE IF NOT EXISTS purchases (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity    TEXT,
  amount      INTEGER,           -- in rupees
  status      TEXT DEFAULT 'active',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ═══════════════════════
-- 10. REFERRALS
-- ═══════════════════════
CREATE TABLE IF NOT EXISTS referrals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id     UUID REFERENCES clients(id),
  referred_name   TEXT NOT NULL,
  referred_email  TEXT,
  plan            TEXT,
  commission      INTEGER,   -- rupees
  status          TEXT DEFAULT 'pending',  -- 'pending'|'paid'
  created_at      TIMESTAMPTZ DEFAULT NOW()
);


-- ═══════════════════════════════════════
--  ROW LEVEL SECURITY (RLS)
--  Clients can only see their OWN data
-- ═══════════════════════════════════════

ALTER TABLE clients           ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_assignments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE buy_leads         ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets           ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases         ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals         ENABLE ROW LEVEL SECURITY;

-- Public read for buy_leads (clients can see country/category/product but NOT contact details — handled in app)
CREATE POLICY "Public can view lead pool basics" ON buy_leads
  FOR SELECT USING (true);

-- Clients see only their own messages
CREATE POLICY "Clients see own messages" ON messages
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert messages" ON messages
  FOR INSERT WITH CHECK (true);

-- Lead assignments — all readable (contact blur done in JS)
CREATE POLICY "Lead assignments readable" ON lead_assignments
  FOR SELECT USING (true);

-- Clients readable for portal login lookup
CREATE POLICY "Clients readable for auth" ON clients
  FOR SELECT USING (true);

CREATE POLICY "Clients updatable" ON clients
  FOR UPDATE USING (true);

-- Enquiries — insert allowed from website
CREATE POLICY "Enquiries insertable" ON enquiries
  FOR INSERT WITH CHECK (true);

-- Tickets insertable
CREATE POLICY "Tickets insertable" ON tickets
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Tickets readable" ON tickets
  FOR SELECT USING (true);

-- Purchases readable
CREATE POLICY "Purchases readable" ON purchases
  FOR SELECT USING (true);

-- Referrals readable
CREATE POLICY "Referrals readable" ON referrals
  FOR SELECT USING (true);

CREATE POLICY "Referrals insertable" ON referrals
  FOR INSERT WITH CHECK (true);

-- Admin full access
CREATE POLICY "Admin full access on clients" ON clients
  FOR ALL USING (true);

CREATE POLICY "Admin full access on buy_leads" ON buy_leads
  FOR ALL USING (true);

CREATE POLICY "Admin full access on lead_assignments" ON lead_assignments
  FOR ALL USING (true);

CREATE POLICY "Admin full access on memberships" ON membership_assignments
  FOR ALL USING (true);

CREATE POLICY "Admin full access on enquiries" ON enquiries
  FOR ALL USING (true);

ALTER TABLE enquiries           ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users         ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin users readable" ON admin_users FOR SELECT USING (true);


-- ═══════════════════════════════════════
--  SAMPLE DATA — remove in production
-- ═══════════════════════════════════════

-- Sample clients (plan_status = 'pending' until admin assigns membership)
INSERT INTO clients (name, business_name, email, phone, city, state, category, products, otp, plan, plan_status, lead_limit, leads_used) VALUES
  ('Rajesh Sharma',  'RS Textiles Pvt Ltd',    'rajesh@rstextiles.com',   '+91 98765 43210', 'Delhi',     'Delhi',       'Textiles & Fabrics',   ARRAY['Cotton Fabric','Silk Fabric'],      '123456', 'growth',       'active',  500,  312),
  ('Priya Verma',    'Priya Spice Exports',     'priya@priyaspice.com',    '+91 98765 11111', 'Mumbai',    'Maharashtra', 'Spices & Condiments',  ARRAY['Turmeric','Black Pepper'],          '123456', 'professional', 'active',  2000, 1840),
  ('Kiran Joshi',    'Kiran Handicrafts',       'kiran@handicrafts.com',   '+91 98765 22222', 'Jaipur',    'Rajasthan',   'Handicrafts & Artware',ARRAY['Brass Handicrafts','Marble Items'], '123456', 'starter',      'active',  100,  88),
  ('Suresh Patil',   'Agro Fresh Exports Ltd',  'suresh@agrofresh.com',    '+91 98765 33333', 'Pune',      'Maharashtra', 'Organic Food',         ARRAY['Organic Turmeric','Organic Rice'],  '123456', 'growth',       'active',  500,  201),
  ('Manish Kumar',   'MK Garments & Co',        'mk@mkgarments.com',       '+91 98765 44444', 'Surat',     'Gujarat',     'Garments & Apparel',   ARRAY['Men''s Shirts','Denim Jeans'],      '123456', 'starter',      'expired', 100,  0),
  ('Fatima Sheikh',  'Sheikh Leather Works',    'fatima@sheikhleather.com','+91 98765 55555', 'Kanpur',    'UP',          'Leather Products',     ARRAY['Leather Bags','Leather Shoes'],     '123456', 'professional', 'active',  2000, 890);

-- Sample buy leads
INSERT INTO buy_leads (company, country, contact_name, email, phone, category, product, quantity, quality, status) VALUES
  ('Al Habtoor Trading LLC',  'UAE',          'Mohammed Al Rashid', 'm.rashid@alhabtoor.ae',     '+971 50 234 5678', 'Textiles & Fabrics',    'Cotton Fabric',     '5,000 meters/month', 'hot',  'assigned'),
  ('Gulf Fresh Foods FZCO',   'UAE',          'Ahmad Khalil',       'ahmad@gulffresh.ae',         '+971 55 876 4321', 'Spices & Condiments',   'Turmeric, Cumin',   '2 MT/month',         'hot',  'assigned'),
  ('Euro Fresh GmbH',         'Germany',      'Klaus Weber',        'k.weber@eurofresh.de',       '+49 30 1234 5678', 'Organic Food',          'Organic Rice',      '10 MT/month',        'new',  'unassigned'),
  ('Meridian Foods Inc',      'USA',          'Sarah Mitchell',     'sarah@meridianfoods.com',    '+1 415 234 5678',  'Rice & Grains',         'Basmati Rice',      '20 MT/month',        'hot',  'assigned'),
  ('Pacific Agro Ltd',        'Australia',    'James Thornton',     'james@pacificagro.com.au',   '+61 412 345 678',  'Spices & Condiments',   'Turmeric, Cumin',   '2 MT/month',         'warm', 'assigned'),
  ('Nakamura Corp',           'Japan',        'Hiroshi Nakamura',   'h.n@nakamura.co.jp',         '+81 3 1234 5678',  'Handicrafts & Artware', 'Metal Sculptures',  '100 pcs/month',      'conv', 'converted'),
  ('Gulf Traders LLC',        'Saudi Arabia', 'Ahmad Al-Saud',      'ahmad@gulftraders.sa',       '+966 55 123 4567', 'Garments & Apparel',    'Men''s Shirts',     '2,000 pcs/month',    'hot',  'assigned'),
  ('Amsterdam Rice Trade BV', 'Netherlands',  'Pieter Van Der Berg','pieter@amsterdamrice.nl',    '+31 20 123 4567',  'Rice & Grains',         'Basmati Rice',      '30 MT/month',        'hot',  'unassigned'),
  ('Seoul Fashion Imports',   'South Korea',  'Kim Ji-Young',       'kimjy@seoulfashion.kr',      '+82 2 1234 5678',  'Garments & Apparel',    'Women''s Kurtas',   '3,000 pcs/month',    'hot',  'unassigned'),
  ('Milano Leather SRL',      'Italy',        'Marco Rossi',        'marco@milanoleather.it',     '+39 02 1234 5678', 'Leather Products',      'Leather Bags',      '500 pcs/month',      'hot',  'assigned'),
  ('Toronto Spice Market',    'Canada',       'Anita Patel',        'anita@torontospice.ca',      '+1 416 876 5432',  'Spices & Condiments',   'Turmeric, Fenugreek','1.5 MT/month',      'warm', 'unassigned'),
  ('Nairobi Grain Imports',   'Kenya',        'John Kamau',         'john@nairobigrain.co.ke',    '+254 722 123 456', 'Rice & Grains',         'Basmati Rice, Wheat','25 MT/month',       'hot',  'unassigned');


-- ═══════════════════════════════════════
--  USEFUL VIEWS
-- ═══════════════════════════════════════

-- Client dashboard view: shows each client's leads count and RM name
CREATE OR REPLACE VIEW client_dashboard AS
SELECT
  c.id,
  c.name,
  c.business_name,
  c.email,
  c.plan,
  c.plan_status,
  c.lead_limit,
  c.leads_used,
  c.lead_limit - c.leads_used AS leads_remaining,
  c.renewal_date,
  a.name AS rm_name,
  a.phone AS rm_phone,
  a.email AS rm_email,
  a.initials AS rm_initials,
  COUNT(la.id) AS assigned_leads_count
FROM clients c
LEFT JOIN admin_users a ON a.id = c.rm_id
LEFT JOIN lead_assignments la ON la.client_id = c.id
GROUP BY c.id, a.id;

-- Unread messages count per client
CREATE OR REPLACE VIEW unread_message_counts AS
SELECT client_id, COUNT(*) AS unread_count
FROM messages
WHERE sender = 'client' AND is_read = false
GROUP BY client_id;
