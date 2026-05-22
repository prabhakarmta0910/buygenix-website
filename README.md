# BuyGenix Solutions — Complete Website v3.0

India's premier B2B export-import platform. Full frontend + backend CRM.

---

## 📁 File Structure

```
buygenix/
├── index.html            — Homepage
├── services.html         — Services
├── about.html            — About Us
├── membership.html       — Membership Plans (dynamic from Supabase)
├── contact.html          — Contact Form (saves to Supabase)
├── gst.html              — GST Registration
├── login.html            — Client Login (Supabase Auth)
├── client-portal.html    — Client Dashboard (auth protected)
├── admin-portal.html     — Admin CRM (auth protected)
├── terms.html            — Terms & Conditions
├── privacy.html          — Privacy Policy
├── css/
│   └── shared.css        — Master stylesheet (all pages)
├── js/
│   ├── shared.js         — Shared JS (navbar, counters, canvas, auth helpers)
│   └── bgx-data.js       — Data store (plans, categories, RMs, leads)
├── assets/
│   └── logo.png          — Place your logo here
├── supabase-schema.sql   — Database schema (run in Supabase SQL Editor)
├── vercel.json           — Vercel deployment config
└── README.md             — This file
```

---

## 🚀 Deployment Guide

### Step 1 — Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Open the **SQL Editor** and paste the contents of `supabase-schema.sql`
3. Run the SQL to create all tables, policies, and seed data
4. Note your **Project URL** and **anon public key** from Settings → API
5. Update the credentials in `js/shared.js`:
   ```js
   const BGX_SUPABASE_URL  = 'https://YOUR-PROJECT.supabase.co';
   const BGX_SUPABASE_ANON = 'YOUR-ANON-KEY';
   ```
   Also update in `js/bgx-data.js` (BGX_SUPABASE_URL reference)

### Step 2 — Set Up Supabase Auth

1. In Supabase → Authentication → Settings:
   - Enable email/password sign-in
   - Set your site URL to your Vercel domain
   - Add redirect URLs: `https://yourdomain.com/login.html`

2. Create your admin account in Supabase → Authentication → Users
   - Email: `admin@buygenixsolutions.com` (or your preferred email)
   - Update the email in `supabase-schema.sql` RLS policies if changed

### Step 3 — Add Your Logo

1. Place your logo file at `assets/logo.png`
2. The logo displays in the navbar on all pages
3. A text fallback ("Buygenix Solutions") shows if the image is missing

### Step 4 — Deploy to GitHub

```bash
git init
git add .
git commit -m "Initial BuyGenix v3 deployment"
git remote add origin https://github.com/YOUR_USERNAME/buygenix-solutions.git
git push -u origin main
```

### Step 5 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Framework: **Other** (static site)
4. Root directory: `./` (project root)
5. Deploy — Vercel auto-detects `vercel.json`
6. Add your custom domain in Vercel → Domains

---

## 🔧 Configuration

### Update Your Supabase Keys

In `js/shared.js`, line 1–2:
```js
const BGX_SUPABASE_URL  = 'https://qzaeshegpdoknsiuvidr.supabase.co';
const BGX_SUPABASE_ANON = 'eyJhbGci...';
```
Replace with your actual Supabase project URL and anon key.

### Update Admin Credentials

In `admin-portal.html`, around line 380:
```js
const ADMIN_EMAIL = 'admin@buygenixsolutions.com';
const ADMIN_PASS  = 'BGX@Admin2025';
```
Change these to your actual admin credentials (or rely solely on Supabase auth).

### Update Phone & Email

In every HTML file, replace:
- `+91 98181 87246` → your actual phone number
- `Buygenixsolutions@gmail.com` → your actual email
- `https://wa.me/919818187246` → your actual WhatsApp link

---

## 📱 Pages & URLs

| Page              | URL                  | Description                        |
|-------------------|----------------------|------------------------------------|
| Home              | `/`                  | Landing page with hero + leads     |
| Services          | `/services`          | All 7 services detailed            |
| About             | `/about`             | Company, team, countries           |
| Membership        | `/membership`        | Plans + comparison + FAQ           |
| Contact           | `/contact`           | Enquiry form → Supabase            |
| GST Registration  | `/gst`               | GST guide + callback form          |
| Login             | `/login`             | Supabase auth sign-in              |
| Client Portal     | `/portal`            | Member dashboard (auth protected)  |
| Admin CRM         | `/admin`             | Full CRM (admin only)              |
| Terms             | `/terms`             | Terms & Conditions                 |
| Privacy           | `/privacy`           | Privacy Policy                     |

---

## 🗄️ Supabase Tables

| Table                | Purpose                                    |
|----------------------|--------------------------------------------|
| `members`            | All member accounts and plan details       |
| `leads`              | Buyer leads assigned to members            |
| `enquiries`          | Contact form and GST enquiries             |
| `membership_plans`   | Dynamic plan prices and features           |
| `performance_reports`| Member monthly reports                     |
| `referrals`          | Referral programme tracking                |

---

## 🛡️ Security Notes

- All tables have Row Level Security (RLS) enabled
- Members can only see their own records and leads
- Enquiries are insert-only for public; admin-only for reads
- Admin access controlled via Supabase Auth email check
- Change admin credentials before going live
- Never expose your Supabase service_role key in frontend code

---

## ✅ Checklist Before Going Live

- [ ] Replace Supabase URL and anon key in `js/shared.js`
- [ ] Run `supabase-schema.sql` in your Supabase SQL Editor
- [ ] Create admin user in Supabase Auth
- [ ] Place `logo.png` in `assets/` folder
- [ ] Update phone number, email, WhatsApp link in all HTML files
- [ ] Set site URL and redirect URLs in Supabase Auth settings
- [ ] Push to GitHub and deploy on Vercel
- [ ] Add custom domain on Vercel
- [ ] Test contact form submission
- [ ] Test client login and portal
- [ ] Test admin portal login

---

## 📞 Support

Built for BuyGenix Solutions — Delhi, India 🇮🇳  
Email: Buygenixsolutions@gmail.com  
WhatsApp: +91 98181 87246
