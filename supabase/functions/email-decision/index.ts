import { createClient } from 'npm:@supabase/supabase-js@2';
import { verifyDecisionToken } from '../_shared/email-decision-token.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-csrf-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
const URL_ = Deno.env.get('SUPABASE_URL') ?? '';
const KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const db = createClient(URL_, KEY);
const internal = (fn: string, body: unknown) => fetch(`${URL_}/functions/v1/${fn}`, { method: 'POST', headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

const OPEN_BUSINESS = ['pending_verification', 'pending_review', 'needs_more_info'];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405);
  let b: { op?: string; kind?: string; id?: string; d?: string; t?: string };
  try { b = await req.json(); } catch { return json({ error: 'Invalid request' }, 400); }
  const { op, kind, id = '', d = '', t = '' } = b ?? {};
  if (!['preview', 'decide'].includes(op ?? '') || !['investor', 'business'].includes(kind ?? '') || !/^[0-9a-f-]{36}$/i.test(id) || !['approve', 'deny'].includes(d)) return json({ error: 'This link is not valid.' }, 400);
  if (!await verifyDecisionToken(KEY, kind!, id, d, t)) return json({ error: 'This link is not valid or has expired. Use the Admin Dashboard instead.' }, 403);

  if (kind === 'investor') {
    const { data: r } = await db.from('investor_access_requests').select('id,name,email,firm,status').eq('id', id).maybeSingle();
    if (!r) return json({ error: 'Request not found.' }, 404);
    const open = r.status === 'pending';
    if (op === 'preview') return json({ ok: true, title: 'Investor data room request', name: r.name, details: [r.firm, r.email], status: r.status, open });
    if (!open) return json({ ok: false, title: 'Already decided', message: `This request was already ${r.status}.` }, 409);
    const status = d === 'approve' ? 'approved' : 'denied';
    const { data: saved } = await db.from('investor_access_requests').update({ status, reviewed_at: new Date().toISOString(), admin_notes: 'Decided from email' }).eq('id', id).eq('status', 'pending').select('id').maybeSingle();
    if (!saved) return json({ ok: false, title: 'Not saved', message: 'Someone else may have decided first. Check the Admin Dashboard.' }, 409);
    if (d === 'deny') return json({ ok: true, title: 'Request declined', message: `${r.name} will not receive access.` });
    const res = await internal('send-investor-approval', { request_id: id });
    return json({ ok: true, title: 'Investor approved', message: res.ok ? `The NDA and passcode email was sent to ${r.email}.` : `Approved, but the passcode email could not be sent. Resend it from the Admin Dashboard.` });
  }

  const { data: s } = await db.from('business_submissions').select('id,business_name,owner_name,city,state,email,status').eq('id', id).maybeSingle();
  if (!s) return json({ error: 'Submission not found.' }, 404);
  const open = OPEN_BUSINESS.includes(s.status);
  if (op === 'preview') return json({ ok: true, title: 'New business listing', name: s.business_name, details: [s.owner_name, `${s.city}, ${s.state}`, s.email], status: s.status, open });
  if (!open) return json({ ok: false, title: 'Already decided', message: `This submission was already ${s.status.replace(/_/g, ' ')}.` }, 409);
  // Claim the submission first so a double tap cannot create two listings.
  const { data: claimed } = await db.from('business_submissions').update({ status: 'pending_review', admin_notes: 'Decided from email' }).eq('id', id).eq('status', s.status).select('id').maybeSingle();
  if (!claimed) return json({ ok: false, title: 'Not saved', message: 'Someone else may have decided first. Check the Admin Dashboard.' }, 409);
  const res = await internal('approve-business-submission', { submission_id: id, action: d === 'approve' ? 'approve' : 'reject', admin_notes: 'Decided from email' });
  const out = await res.json().catch(() => ({}));
  if (!res.ok || !out.ok) return json({ ok: false, title: 'Not saved', message: 'The decision could not be saved. Try the Admin Dashboard.' }, 500);
  return json({ ok: true, title: d === 'approve' ? 'Business approved' : 'Business declined', message: d === 'approve' ? `${s.business_name} is now live in the directory, and the owner was emailed.` : `${s.business_name} was not added.` });
});
