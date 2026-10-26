import { createClient } from 'npm:@supabase/supabase-js@2';
import { Resend } from 'https://esm.sh/resend@2.0.0';
import { decisionLinks, decisionButtonsHtml } from '../_shared/email-decision-token.ts';
import { decideOsRequest, hashToken, esc, OS_FROM, OS_OWNER_EMAIL, OS_VIEW_MINUTES } from '../_shared/os-access.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
const URL_ = Deno.env.get('SUPABASE_URL') ?? '';
const KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const ANON = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const db = createClient(URL_, KEY);
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const send = (m: Record<string, unknown>) => resend.emails.send(m as never) as never;
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

async function isAdmin(req: Request) {
  const auth = req.headers.get('Authorization') ?? '';
  if (!auth.startsWith('Bearer ')) return false;
  const user = createClient(URL_, ANON, { global: { headers: { Authorization: auth } } });
  const { data } = await user.rpc('is_admin_secure');
  return data === true;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405);
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json({ error: 'Invalid request' }, 400); }

  if (b.action === 'request') {
    const full_name = str(b.name, 100), company = str(b.company, 150), role = str(b.role, 100), email = str(b.email, 255).toLowerCase(), phone = str(b.phone, 30);
    if (!full_name || !company || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Please fill in your name, business and a valid email.' }, 400);
    const since = new Date(Date.now() - 3600_000).toISOString();
    const { count } = await db.from('os_access_requests').select('id', { count: 'exact', head: true }).eq('email', email).gte('created_at', since);
    if ((count ?? 0) >= 2) return json({ ok: true, saved: true });
    const { data: row, error } = await db.from('os_access_requests').insert({ full_name, company, role: role || null, email, phone: phone || null }).select('id').single();
    if (error || !row) return json({ error: 'Your request could not be saved.' }, 500);
    const links = await decisionLinks(KEY, 'os', row.id);
    const lines = [`Name: ${full_name}`, `Business: ${company}`, `Role: ${role || '—'}`, `Email: ${email}`, `Phone: ${phone || '—'}`];
    try {
      await resend.emails.send({ from: OS_FROM, to: [OS_OWNER_EMAIL], reply_to: email, subject: `1325 OS walkthrough request: ${full_name} (${company})`,
        text: `New 1325 OS walkthrough request\n\n${lines.join('\n')}\n\nApprove: ${links.approve}\nDecline: ${links.deny}`,
        html: `<h2>New 1325 OS walkthrough request</h2>${lines.map(l => `<p style="margin:4px 0">${esc(l)}</p>`).join('')}${decisionButtonsHtml(links)}<p>Approving sends them a ${OS_VIEW_MINUTES}-minute private viewing link.</p>` });
    } catch { /* request is saved; admin can still decide from the dashboard */ }
    return json({ ok: true, saved: true });
  }

  if (b.action === 'open') {
    const token = str(b.token, 128);
    if (!/^[a-f0-9]{64}$/.test(token)) return json({ error: 'This link is not valid.' }, 400);
    const hash = await hashToken(token);
    const { data: r } = await db.from('os_access_requests').select('id,full_name,email,status,viewing_started_at,viewing_expires_at').eq('access_token_hash', hash).maybeSingle();
    if (!r || r.status !== 'approved') return json({ error: 'This link is not valid.' }, 403);
    let expires = r.viewing_expires_at as string | null;
    if (!r.viewing_started_at) {
      const now = new Date();
      const exp = new Date(now.getTime() + OS_VIEW_MINUTES * 60_000).toISOString();
      const { data: started } = await db.from('os_access_requests').update({ viewing_started_at: now.toISOString(), viewing_expires_at: exp, updated_at: now.toISOString() }).eq('id', r.id).is('viewing_started_at', null).select('viewing_expires_at').maybeSingle();
      if (started) expires = started.viewing_expires_at;
      else expires = (await db.from('os_access_requests').select('viewing_expires_at').eq('id', r.id).single()).data?.viewing_expires_at ?? null;
    }
    const serverNow = new Date().toISOString();
    if (!expires || Date.parse(expires) <= Date.now()) return json({ error: 'Your viewing hour has ended. Request a new walkthrough to see it again.', expired: true }, 403);
    return json({ ok: true, name: r.full_name, email: r.email, viewing_expires_at: expires, server_now: serverNow });
  }

  if (b.action === 'admin_decide') {
    if (!await isAdmin(req)) return json({ error: 'Admins only.' }, 403);
    const id = str(b.id, 36), d = b.d;
    if (!/^[0-9a-f-]{36}$/i.test(id) || (d !== 'approve' && d !== 'deny')) return json({ error: 'Invalid request' }, 400);
    const out = await decideOsRequest(db, send, id, d);
    return json(out, out.status);
  }

  return json({ error: 'Unknown action' }, 400);
});
