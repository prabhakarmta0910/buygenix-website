-- ═══════════════════════════════════════════════════════
-- BuyGenix Solutions — Supabase Database Schema v3.0
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── MEMBERS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS members (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name       TEXT NOT NULL,
  business_name   TEXT,
  email           TEXT,
  phone           TEXT,
  gstin           TEXT,
  product_category TEXT,
  plan            TEXT DEFAULT 'starter' CHECK (plan IN ('starter','growth','professional','enterprise')),
  rm_name         TEXT DEFAULT 'Priya Mehra',
  rm_role         TEXT DEFAULT 'Senior Export Consultant',
  rm_phone        TEXT DEFAULT '+91 98181 87246',
  status          TEXT DEFAULT 'active' CHECK (status IN ('active','inactive','expired','pending')),
  start_date      DATE DEFAULT CURRENT_DATE,
  renewal_date    DATE DEFAULT (CURRENT_DATE + INTERVAL '1 year'),
  leads_indian    INTEGER DEFAULT 0,
  leads_international INTEGER DEFAULT 0,
  leads_delivered INTEGER DEFAULT 0,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── LEADS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  member_id       UUID REFERENCES members(id) ON DELETE CASCADE,
  member_name     TEXT,
  country         TEXT NOT NULL,
  product         TEXT NOT NULL,
  quantity        TEXT,
  buyer_company   TEXT,
  buyer_contact   TEXT,
  buyer_email     TEXT,
  notes           TEXT,
  status          TEXT DEFAULT 'new' CHECK (status IN ('new','hot','verified','delivered','responded','closed')),
  is_international BOOLEAN DEFAULT FALSE,
  delivered_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── ENQUIRIES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enquiries (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name       TEXT,
  business_name   TEXT,
  email           TEXT,
  phone           TEXT,
  product_category TEXT,
  interested_in   TEXT,
  message         TEXT,
  source          TEXT DEFAULT 'website',
  status          TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','converted','closed','spam')),
  assigned_to     TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── MEMBERSHIP PLANS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS membership_plans (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key             TEXT UNIQUE NOT NULL,
  label           TEXT NOT NULL,
  badge           TEXT,
  price           INTEGER NOT NULL DEFAULT 0,
  price_original  INTEGER DEFAULT 0,
  savings         INTEGER DEFAULT 0,
  best_for        TEXT,
  indian_leads    INTEGER DEFAULT 0,
  intl_leads      INTEGER DEFAULT 0,
  features        JSONB DEFAULT '[]',
  cta             TEXT DEFAULT 'Get Started',
  is_popular      BOOLEAN DEFAULT FALSE,
  is_active       BOOLEAN DEFAULT TRUE,
  sort_order      INTEGER DEFAULT 1,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── PERFORMANCE REPORTS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS performance_reports (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  member_id       UUID REFERENCES members(id) ON DELETE CASCADE,
  period          TEXT,
  leads_sent      INTEGER DEFAULT 0,
  leads_responded INTEGER DEFAULT 0,
  deals_closed    INTEGER DEFAULT 0,
  notes           TEXT,
  report_url      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── REFERRALS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS referrals (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  referrer_id     UUID REFERENCES members(id),
  referred_name   TEXT,
  referred_phone  TEXT,
  referred_plan   TEXT,
  commission_due  INTEGER DEFAULT 0,
  commission_paid INTEGER DEFAULT 0,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','converted','paid','cancelled')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── UPDATED_AT TRIGGER ────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER members_updated_at   BEFORE UPDATE ON members   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER leads_updated_at     BEFORE UPDATE ON leads     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER enquiries_updated_at BEFORE UPDATE ON enquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER plans_updated_at     BEFORE UPDATE ON membership_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── ROW LEVEL SECURITY ────────────────────────────────────
ALTER TABLE members             ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads               ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries           ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_plans    ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals           ENABLE ROW LEVEL SECURITY;

-- Members: own record only
CREATE POLICY "Members: own record" ON members
  FOR ALL USING (auth.uid() = user_id);

-- Members: admin full access (set your admin user_id below)
CREATE POLICY "Admin: full members access" ON members
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'admin@buygenixsolutions.com'
  );

-- Leads: member sees own leads
CREATE POLICY "Leads: own leads" ON leads
  FOR SELECT USING (
    member_id IN (SELECT id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Admin: full leads access" ON leads
  FOR ALL USING (auth.jwt() ->> 'email' = 'admin@buygenixsolutions.com');

-- Enquiries: admin only
CREATE POLICY "Admin: full enquiries access" ON enquiries
  FOR ALL USING (auth.jwt() ->> 'email' = 'admin@buygenixsolutions.com');

-- Anyone can insert an enquiry (contact form)
CREATE POLICY "Public: insert enquiry" ON enquiries
  FOR INSERT WITH CHECK (true);

-- Plans: public read
CREATE POLICY "Public: read plans" ON membership_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin: manage plans" ON membership_plans
  FOR ALL USING (auth.jwt() ->> 'email' = 'admin@buygenixsolutions.com');

-- Reports: own
CREATE POLICY "Reports: own" ON performance_reports
  FOR SELECT USING (
    member_id IN (SELECT id FROM members WHERE user_id = auth.uid())
  );

-- ── SEED MEMBERSHIP PLANS ─────────────────────────────────
INSERT INTO membership_plans (key,label,badge,price,price_original,savings,best_for,indian_leads,intl_leads,features,cta,is_popular,sort_order)
VALUES
('starter','Starter','',13500,15000,1500,
 'New businesses entering global trade',10,0,
 '["10 Indian buyer leads per year","Dedicated Relationship Manager","Product page on BuyGenix website","Virtual Business Card (1)","IEC & MSME registration assistance","GST registration assistance","WhatsApp & email lead delivery","Email support"]',
 'Get Started',FALSE,1),
('growth','Growth','Most Popular',27000,30000,3000,
 'Growing businesses expanding internationally',15,10,
 '["15 Indian + 10 international buyer leads","Dedicated Relationship Manager","Product page + 10-product digital catalogue","Virtual Business Card (1)","IEC, MSME & FSSAI registration assistance","GST registration assistance","SEO optimisation for your product pages","Quarterly social media promotion","WhatsApp & email lead delivery","Performance reports on request"]',
 'Choose Growth',TRUE,2),
('professional','Professional','Best Value',45000,50000,5000,
 'Established exporters seeking premium exposure',20,20,
 '["20 Indian + 20 international buyer leads","Dedicated Senior Relationship Manager","Full product catalogue (unlimited products)","Virtual Business Card (3)","All registrations: IEC, MSME, FSSAI, GST","Full SEO + Social Media Optimisation","Monthly social media promotion","Monthly performance & analytics reports","Priority WhatsApp support","Quarterly export strategy consultation","30-minute onboarding strategy call"]',
 'Go Professional',FALSE,3),
('enterprise','Enterprise','Custom',0,0,0,
 'Large exporters & trading houses',NULL,NULL,
 '["Unlimited buyer leads (all categories)","Dedicated Account Manager team","Full catalogue + website integration","Unlimited virtual business cards","All registrations included","Custom SEO, SMO & content strategy","Weekly performance reports","Priority 24/7 WhatsApp support","Monthly strategy consultation","Custom CRM integration","Co-branded marketing materials"]',
 'Contact Us',FALSE,4)
ON CONFLICT (key) DO NOTHING;

-- ═══════════════════════════════════════════════════════
-- DONE! Schema created. Update admin email above to match
-- your actual Supabase admin account email.
-- ═══════════════════════════════════════════════════════
