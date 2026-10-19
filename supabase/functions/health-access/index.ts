import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { z } from "https://esm.sh/zod@3.23.8";
import { accessRequestEmail, approvedContent, confirmationPage } from './confirmation.ts';
import { decisionCookieName, validDecisionSubmission } from './decision-confirmation.ts';
import { clinicalEmailRouting } from './email-routing.ts';

import { administerDecision } from './admin-decision.ts';
import { sendClinicalApproval } from './approval-email.ts';
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const ua = (req.headers.get("user-agent") ?? "").slice(0, 300);

  // GET is read-only: email security scanners must not approve, deny or revoke.
  if (req.method === 'GET' || (req.method === 'POST' && (req.headers.get('content-type') ?? '').includes('application/x-www-form-urlencoded'))) {
    const u = new URL(req.url);
    const id = u.searchParams.get("id") ?? "", t = u.searchParams.get("t") ?? "", d = u.searchParams.get("d");
    if (!/^[0-9a-f-]{36}$/.test(id) || !/^[a-f0-9]{48}$/.test(t) || (d !== "approve" && d !== "deny" && d !== "revoke")) return page("Invalid link", "This link is not valid.");
    const { data: r } = await db.from("hc_access_requests").select("*").eq("id", id).eq("decision_token", t).maybeSingle();
    if (!r) return page("Invalid link", "This request was not found.");
    if (req.method === 'GET') {
      const nonce = Array.from(crypto.getRandomValues(new Uint8Array(24)), b => b.toString(16).padStart(2, '0')).join('');
      return new Response(confirmationPage('Confirm access decision', `<p>Confirm <strong>${esc(d)}</strong> for ${esc(r.full_name)} (${esc(r.work_email)}). Opening this link has not changed access.</p><form method="post" action="${esc(req.url)}"><input type="hidden" name="nonce" value="${nonce}"><button type="submit">Confirm ${esc(d)}</button></form>`), { headers: { ...cors, 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer', 'Set-Cookie': `${decisionCookieName(id, d)}=${nonce}; HttpOnly; Secure; SameSite=Strict; Max-Age=600; Path=/functions/v1/health-access` } });
    }
    const form = await req.formData();
    if (!validDecisionSubmission(req, String(form.get('nonce') ?? ''))) return page('Confirmation required', 'Reopen your email decision link and confirm the action there. No access change was made.');
    const confirmedPage = (title: string, msg: string) => {
      const response = page(title, msg);
      response.headers.set('Set-Cookie', `${decisionCookieName(id, d)}=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/functions/v1/health-access`);
      response.headers.set('Cache-Control', 'no-store');
      response.headers.set('Referrer-Policy', 'no-referrer');
      return response;
    };
    if (d === "revoke") {
      if (r.status === "revoked") return page("Already revoked", `${esc(r.full_name)} is already locked out.`);
      const { data: saved, error } = await db.from("hc_access_requests").update({ status: "revoked", access_token: null, revoked_at: new Date().toISOString() }).eq("id", id).eq('decision_token', t).eq('status', r.status).select('id,status,access_token').maybeSingle();
      if (error || !saved || saved.status !== 'revoked' || saved.access_token !== null) return page('Revocation not saved', 'No successful revocation could be confirmed. Reopen the email link and try again.');
      return confirmedPage("Access revoked", `${esc(r.full_name)} (${esc(r.work_email)}) cannot make further clinical requests. An open preview locks at its next access check, normally within 15 seconds.`);
    }
    if (r.status !== "pending") return page("Already decided", `This request was already ${esc(r.status)}.`);
    if (d === "deny") {
      const { data: saved, error } = await db.from("hc_access_requests").update({ status: "denied", decided_at: new Date().toISOString() }).eq("id", id).eq("status", "pending").select('id,status').maybeSingle();
      if (error || saved?.status !== 'denied') return page('Denial not saved', 'No successful denial could be confirmed. Please try again.');
      return confirmedPage("Request denied", `${esc(r.full_name)} will not receive access.`);
    }
    const bytes = crypto.getRandomValues(new Uint8Array(24));
    const access = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    const expires = new Date(Date.now() + WINDOW_DAYS * 86400000);
    const { data: approved, error: approvalError } = await db.from("hc_access_requests").update({ status: "approved", access_token: access, decided_at: new Date().toISOString(), expires_at: expires.toISOString(), device_id: null, first_entered_at: null, viewing_expires_at: null }).eq("id", id).eq("status", "pending").select("id").maybeSingle();
    if (approvalError || !approved) return page('Approval not saved', '<p>Your approval could not be saved. Please try again from your request email.</p>');
    let accepted = false;
    try {
    accepted = await sendClinicalApproval(message => resend.emails.send(message), r, access, expires);
    } catch {
      accepted = false;
    }
    const revoke = `${FN_URL}?id=${id}&t=${t}&d=revoke`;
    return confirmedPage("Access Approved", approvedContent(r.full_name, r.work_email, expires, revoke, accepted));
  }

  if (req.method !== 'POST') return json({ error: 'Use POST' }, 405);
  let body: unknown;
  try { body = await req.json(); } catch { return json({ error: "Invalid request" }, 400); }

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
    if (error || !grant) return json({ ok: false, reason: "invalid" }, 503);
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
  await resend.emails.send({
    ...clinicalEmailRouting(),
    subject: `New 1325 Clinical access request: ${p.data.full_name} — ${p.data.organization}`,
    ...requestEmail,
  });
  return json({ ok: true });
});
