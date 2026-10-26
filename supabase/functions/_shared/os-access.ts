/** 1325 OS walkthrough approvals: one shared decision path for email buttons and the Admin Dashboard. */
import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';

export const OS_OWNER_EMAIL = 'Thomas@1325.ai';
export const OS_FROM = `"Thomas at 1325.AI" <${OS_OWNER_EMAIL}>`;
export const OS_VIEW_MINUTES = 60;

const enc = new TextEncoder();
export async function hashToken(token: string) {
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(token))), b => b.toString(16).padStart(2, '0')).join('');
}
export const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

type Send = (m: Record<string, unknown>) => Promise<{ data?: { id?: string } | null; error?: unknown }>;

export async function decideOsRequest(db: SupabaseClient, send: Send, id: string, decision: 'approve' | 'deny') {
  const { data: r } = await db.from('os_access_requests').select('id,full_name,email,status').eq('id', id).maybeSingle();
  if (!r) return { ok: false, status: 404, title: 'Not found', message: 'Request not found.' };
  if (r.status !== 'pending') return { ok: false, status: 409, title: 'Already decided', message: `This request was already ${r.status}.` };
  const now = new Date().toISOString();
  if (decision === 'deny') {
    const { data: saved } = await db.from('os_access_requests').update({ status: 'declined', decided_at: now, updated_at: now }).eq('id', id).eq('status', 'pending').select('id').maybeSingle();
    if (!saved) return { ok: false, status: 409, title: 'Not saved', message: 'Someone else may have decided first.' };
    return { ok: true, status: 200, title: 'Request declined', message: `${r.full_name} will not receive access.` };
  }
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
  const { data: saved } = await db.from('os_access_requests').update({ status: 'approved', decided_at: now, updated_at: now, access_token_hash: await hashToken(token) }).eq('id', id).eq('status', 'pending').select('id').maybeSingle();
  if (!saved) return { ok: false, status: 409, title: 'Not saved', message: 'Someone else may have decided first.' };
  const link = `https://1325.ai/os-dashboard?access=${token}`;
  const name = esc(r.full_name);
  let accepted = false;
  try {
    const res = await send({
      from: OS_FROM, to: [r.email], reply_to: OS_OWNER_EMAIL,
      subject: 'Your private 1325 Operating System walkthrough is approved',
      text: `Hello ${r.full_name},\n\nYour walkthrough of the 1325 Operating System is approved.\nOpen it here: ${link}\n\nYou can view it for ${OS_VIEW_MINUTES} minutes, starting the first time you open the link. The walkthrough uses a sample business only.\n\nThomas at 1325.AI\n1000 E. 111th St. Suite 1100, Chicago IL 60628 · 1-312-900-6004`,
      html: `<p>Hello ${name},</p><p>Your walkthrough of the <strong>1325 Operating System</strong> is approved.</p><p><a href="${link}" style="display:inline-block;padding:14px 22px;background:#FFB300;color:#003366;font-weight:700;text-decoration:none;border-radius:6px">Open my walkthrough</a></p><p>You can view it for ${OS_VIEW_MINUTES} minutes, starting the first time you open the link. The walkthrough uses a sample business only.</p><p>Thomas at 1325.AI<br>1000 E. 111th St. Suite 1100, Chicago IL 60628 · 1-312-900-6004</p><p style="font-size:11px;color:#b00">PRIVATE & CONFIDENTIAL — DO NOT COPY, FORWARD, OR DISTRIBUTE.</p>`,
    });
    accepted = !res.error && typeof res.data?.id === 'string' && res.data.id.length > 0;
  } catch { accepted = false; }
  return { ok: true, status: 200, title: 'Walkthrough approved', message: `${r.full_name} can now open one ${OS_VIEW_MINUTES}-minute viewing. ${accepted ? 'Their email was accepted for sending.' : 'Sending their email could not be confirmed — check the Admin Dashboard.'}` };
}
