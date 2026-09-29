// Shared helpers for the server-rendered directory pages.
// The anon key is the same public key the website already uses (js/shared.js).
const SUPABASE_URL = 'https://qzaeshegpdoknsiuvidr.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6YWVzaGVncGRva25zaXV2aWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NjIzMzcsImV4cCI6MjA5MzQzODMzN30.3TOujIaRbZPkvL_hewvJEONcOwApOIRQA5EjTdihW-s';
const SITE = 'https://www.buygenixsolutions.com';

async function rpc(name, args) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args || {}),
  });
  if (!r.ok) throw new Error(`${name} ${r.status}`);
  return r.json();
}

const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

module.exports = { rpc, esc, SITE };
