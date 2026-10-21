import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { z } from "https://esm.sh/zod@3.23.8";
import { accessRequestEmail, approvedContent, confirmationPage } from './confirmation.ts';
import { decisionCookieName, validDecisionSubmission } from './decision-confirmation.ts';
import { clinicalEmailRouting } from './email-routing.ts';

import { administerDecision } from './admin-decision.ts';
import { sendClinicalApproval } from './approval-email.ts';
import { requestNotification } from './notification-result.ts';
import { validateCsrf } from '../_shared/csrf-guard.ts';

const cors = {
  ...corsHeaders,
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token, x-hc-preview-token, x-hc-preview-device",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const FN_URL = `${Deno.env.get("SUPABASE_URL")}/functions/v1/health-access`;

const db = createClient(Deno.env.get("SUPABASE_URL") ?? '', Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? '');
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c));
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });
const page = (title: string, msg: string) => new Response(
  confirmationPage(title, msg),
  { headers: { ...cors, "Content-Type": "text/html; charset=utf-8" } },
);

const Request = z.object({
  action: z.literal("request"),
  full_name: z.string().trim().min(2).max(120),
  organization: z.string().trim().min(2).max(160),
  role: z.string().trim().min(2).max(80),
  work_email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(40),
  nda: z.literal(true),
});
const Verify = z.object({ action: z.enum(["verify", "end"]), token: z.string().regex(/^[a-f0-9]{48}$/), device: z.string().regex(/^[a-f0-9]{32}$/), path: z.string().max(200).optional() });
const WINDOW_DAYS = 7;
const AdminDecision = z.object({ action: z.literal('admin_decision'), request_id: z.string().uuid(), decision: z.enum(['approve', 'deny', 'revoke', 'reopen', 'extend']), expected_status: z.enum(['pending', 'approved', 'expired']), confirmed: z.literal(true) }).strict();
const EmailDecision = z.object({ action: z.enum(['email_preview', 'email_decide']), id: z.string().regex(/^[0-9a-f-]{36}$/), t: z.string().regex(/^[a-f0-9]{48}$/), d: z.enum(['approve', 'deny', 'revoke']) }).strict();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const ua = (req.headers.get("user-agent") ?? "").slice(0, 300);

  // Saves one email decision for a request already matched by its secret decision token.
  // Every write is conditional on the current status, so repeated taps cannot double-apply.
  type R = Record<string, any>;
  const decideFromEmail = async (r: R, id: string, t: string, d: string): Promise<{ ok: boolean; title: string; message: string; html?: string }> => {
    if (d === "revoke") {
      if (r.status === "revoked") return { ok: false, title: "Already revoked", message: `${r.full_name} is already locked out.` };
      const { data: saved, error } = await db.from("hc_access_requests").update({ status: "revoked", access_token: null, revoked_at: new Date().toISOString() }).eq("id", id).eq('decision_token', t).eq('status', r.status).select('id,status,access_token').maybeSingle();
      if (error || !saved || saved.status !== 'revoked' || saved.access_token !== null) return { ok: false, title: 'Revocation not saved', message: 'No successful revocation could be confirmed. Please try again.' };
      return { ok: true, title: "Access revoked", message: `${r.full_name} (${r.work_email}) is locked out. An open preview locks at its next access check, normally within 15 seconds.` };
    }
    if (r.status !== "pending") return { ok: false, title: "Already decided", message: `This request was already ${r.status}.` };
    if (d === "deny") {
      const { data: saved, error } = await db.from("hc_access_requests").update({ status: "denied", decided_at: new Date().toISOString() }).eq("id", id).eq("status", "pending").select('id,status').maybeSingle();
      if (error || saved?.status !== 'denied') return { ok: false, title: 'Denial not saved', message: 'No successful denial could be confirmed. Please try again.' };
      return { ok: true, title: "Request denied", message: `${r.full_name} will not receive access.` };
    }
    const access = Array.from(crypto.getRandomValues(new Uint8Array(24)), (b) => b.toString(16).padStart(2, "0")).join("");
    const expires = new Date(Date.now() + WINDOW_DAYS * 86400000);
    const { data: approved, error: approvalError } = await db.from("hc_access_requests").update({ status: "approved", access_token: access, decided_at: new Date().toISOString(), expires_at: expires.toISOString(), device_id: null, first_entered_at: null, viewing_expires_at: null }).eq("id", id).eq("status", "pending").select("id").maybeSingle();
    if (approvalError || !approved) return { ok: false, title: 'Approval not saved', message: 'Your approval could not be saved. Please try again.' };
    let accepted = false;
    try { accepted = await sendClinicalApproval(message => resend.emails.send(message), r as never, access, expires); } catch { accepted = false; }
    return {
      ok: true, title: "Access approved",
      message: `${r.full_name} can now open one twenty-minute viewing. ${accepted ? 'Their invitation email was accepted for sending.' : 'Sending their invitation could not be confirmed — resend from the Admin Dashboard.'}`,
      html: approvedContent(r.full_name, r.work_email, expires, `${FN_URL}?id=${id}&t=${t}&d=revoke`, accepted),
    };
  };
  const SITE_DECISION = 'https://1325.ai/email-decision';

  // GET is read-only: email links open a confirmation screen on 1325.ai (works on phones); nothing changes until the button is tapped.
  if (req.method === 'GET' || (req.method === 'POST' && (req.headers.get('content-type') ?? '').includes('application/x-www-form-urlencoded'))) {
    const u = new URL(req.url);
    const id = u.searchParams.get("id") ?? "", t = u.searchParams.get("t") ?? "", d = u.searchParams.get("d");
    if (!/^[0-9a-f-]{36}$/.test(id) || !/^[a-f0-9]{48}$/.test(t) || (d !== "approve" && d !== "deny" && d !== "revoke")) return page("Invalid link", "This link is not valid.");
    if (req.method === 'GET') {
      return new Response(null, { status: 302, headers: { ...cors, Location: `${SITE_DECISION}?k=clinical&id=${id}&d=${d}&t=${t}`, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });
    }
    const { data: r } = await db.from("hc_access_requests").select("*").eq("id", id).eq("decision_token", t).maybeSingle();
    if (!r) return page("Invalid link", "This request was not found.");
    const form = await req.formData();
    if (!validDecisionSubmission(req, String(form.get('nonce') ?? ''))) return page('Confirmation required', 'Reopen your email decision link and confirm the action there. No access change was made.');
    const result = await decideFromEmail(r, id, t, d);
    const response = page(result.title, result.html ?? `<p>${esc(result.message)}</p>`);
    if (result.ok) response.headers.set('Set-Cookie', `${decisionCookieName(id, d)}=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/functions/v1/health-access`);
    response.headers.set('Cache-Control', 'no-store');
    return response;
  }

  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405);
  let body: unknown;
  try { body = await req.json(); } catch { return json({ error: "Invalid request" }, 400); }

  // Phone-friendly email decisions: the 1325.ai confirmation screen posts the secret link token back after a deliberate tap.
  const em = EmailDecision.safeParse(body);
  if (em.success) {
    const { id, t, d } = em.data;
    const { data: r } = await db.from("hc_access_requests").select("*").eq("id", id).eq("decision_token", t).maybeSingle();
    if (!r) return json({ error: 'This link is not valid.' }, 404);
    if (em.data.action === 'email_preview') {
      const open = d === 'revoke' ? r.status !== 'revoked' && r.status !== 'denied' : r.status === 'pending';
      return json({ ok: true, title: '1325 Clinical EMR / EHR preview request', name: r.full_name, details: [r.organization, r.role, r.work_email], status: r.status, open });
    }
    const result = await decideFromEmail(r, id, t, d);
    return json({ ok: result.ok, title: result.title, message: result.message }, result.ok ? 200 : 409);
  }

  if ((body as { action?: string } | null)?.action === 'admin_decision') {
    if (!validateCsrf(req).valid) return json({ error: 'Reload this page before confirming your decision.' }, 403);
    const parsed = AdminDecision.safeParse(body);
    if (!parsed.success) return json({ error: 'A valid request and confirmed decision are required.' }, 400);
    try {
      const result = await administerDecision(parsed.data, {
        authorize: async () => {
          const jwt = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
          if (!jwt) return false;
          const { data, error } = await db.auth.getUser(jwt);
          if (error || !data.user) return false;
          const role = await db.rpc('has_role', { _user_id: data.user.id, _role: 'admin' });
          return !role.error && role.data === true;
        },
        read: async id => {
          const { data, error } = await db.from('hc_access_requests').select('id,status,revoked_at,full_name,work_email,first_entered_at,viewing_expires_at').eq('id', id).maybeSingle();
          if (error) throw error;
          return data;
        },
        save: async (id, expected, changes) => {
          const { data, error } = await db.from('hc_access_requests').update(changes).eq('id', id).eq('status', expected).is('revoked_at', null).select('id,status').maybeSingle();
          return !error && data?.status === changes.status;
        },
        sendApproval: (r, access, expires) => sendClinicalApproval(message => resend.emails.send(message), r, access, expires),
      });
      return json(result.body, result.status);
    } catch { return json({ error: 'Could not confirm the decision. Refresh to check its status before retrying.' }, 500); }
  }

  // Admins (verified server-side via user_roles) always have access
  if ((body as { action?: string })?.action === "admin") {
    const jwt = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
    if (!jwt) return json({ ok: false });
    const { data: u } = await db.auth.getUser(jwt);
    if (!u?.user) return json({ ok: false });
    const { data: isAdmin } = await db.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
    if (!isAdmin) return json({ ok: false });
    return json({ ok: true, admin: true, name: typeof u.user.user_metadata?.full_name === "string" ? u.user.user_metadata.full_name : "Administrator", email: u.user.email ?? "" });
  }

  const v = Verify.safeParse(body);
  if (v.success) {
    const { data: grant, error } = await db.rpc("hc_verify_preview_access", {
      p_token: v.data.token, p_device: v.data.device, p_end: v.data.action === "end",
    });
    if (error || !grant) return json({ ok: false, reason: "unavailable" }, 503);
    if (grant.ok && grant.request_id) {
      // Heartbeats validate access without producing a new visit-log entry.
      if (v.data.path) await db.from("hc_access_views").insert({ request_id: grant.request_id, path: v.data.path, user_agent: ua });
      const { request_id, ...visible } = grant;
      return json(visible);
    }
    return json(grant);
  }

  const p = Request.safeParse(body);
  if (!p.success) return json({ error: "Please fill every required field and accept the confidentiality terms." }, 400);
  const email = p.data.work_email.toLowerCase();
  const since = new Date(Date.now() - 86400000).toISOString();
  const { count } = await db.from("hc_access_requests").select("id", { count: "exact", head: true }).eq("work_email", email).gte("created_at", since);
  if ((count ?? 0) >= 3) return json({ error: "Too many requests. Please try again tomorrow." }, 429);

  const { data: r, error } = await db.from("hc_access_requests").insert({
    full_name: p.data.full_name, organization: p.data.organization, role: p.data.role,
    work_email: email, phone: p.data.phone || null, user_agent: ua,
  }).select("id, decision_token").single();
  if (error || !r) return json({ error: "Could not save your request." }, 500);

  const link = (d: string) => `${FN_URL}?id=${r.id}&t=${r.decision_token}&d=${d}`;
  const requestEmail = accessRequestEmail({ ...p.data, work_email: email }, {
    approve: link('approve'), deny: link('deny'), revoke: link('revoke'),
  });
  const notificationAccepted = await requestNotification(() => resend.emails.send({
    ...clinicalEmailRouting(),
    subject: `New 1325 Clinical EMR / EHR access request: ${p.data.full_name} — ${p.data.organization}`,
    ...requestEmail,
  }));
  return json({ ok: true, notification_accepted: notificationAccepted });
});
