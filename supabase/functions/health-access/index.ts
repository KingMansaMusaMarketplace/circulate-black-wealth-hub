import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { z } from "https://esm.sh/zod@3.23.8";
import { accessRequestEmail, approvedContent, confirmationPage, emailWasAccepted } from './confirmation.ts';

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
const OWNER = "Thomas@1325.ai";
const FROM = '"Thomas at 1325.AI" <Partner@1325.AI>';
const SITE = "https://health.1325.ai";
const FN_URL = `${Deno.env.get("SUPABASE_URL")}/functions/v1/health-access`;

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, "Content-Type": "application/json" } });
const page = (title: string, msg: string) => new Response(
  confirmationPage(title, msg),
  { headers: { "Content-Type": "text/html; charset=utf-8" } },
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
const Verify = z.object({ action: z.literal("verify"), token: z.string().regex(/^[a-f0-9]{48}$/), device: z.string().regex(/^[a-f0-9]{32}$/), path: z.string().max(200).optional() });
const WINDOW_DAYS = 7;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const ua = (req.headers.get("user-agent") ?? "").slice(0, 300);

  // Approve / deny / revoke link clicked from Thomas's email
  if (req.method === "GET") {
    const u = new URL(req.url);
    const id = u.searchParams.get("id") ?? "", t = u.searchParams.get("t") ?? "", d = u.searchParams.get("d");
    if (!/^[0-9a-f-]{36}$/.test(id) || !/^[a-f0-9]{48}$/.test(t) || (d !== "approve" && d !== "deny" && d !== "revoke")) return page("Invalid link", "This link is not valid.");
    const { data: r } = await db.from("hc_access_requests").select("*").eq("id", id).eq("decision_token", t).maybeSingle();
    if (!r) return page("Invalid link", "This request was not found.");
    if (d === "revoke") {
      if (r.status === "revoked") return page("Already revoked", `${esc(r.full_name)} is already locked out.`);
      await db.from("hc_access_requests").update({ status: "revoked", access_token: null, revoked_at: new Date().toISOString() }).eq("id", id);
      return page("Access revoked", `${esc(r.full_name)} (${esc(r.work_email)}) is locked out immediately.`);
    }
    if (r.status !== "pending") return page("Already decided", `This request was already ${esc(r.status)}.`);
    if (d === "deny") {
      await db.from("hc_access_requests").update({ status: "denied", decided_at: new Date().toISOString() }).eq("id", id);
      return page("Request denied", `${esc(r.full_name)} will not receive access.`);
    }
    const bytes = crypto.getRandomValues(new Uint8Array(24));
    const access = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    const expires = new Date(Date.now() + WINDOW_DAYS * 86400000);
    const { error: approvalError } = await db.from("hc_access_requests").update({ status: "approved", access_token: access, decided_at: new Date().toISOString(), expires_at: expires.toISOString(), device_id: null }).eq("id", id);
    if (approvalError) return page('Approval not saved', '<p>Your approval could not be saved. Please try again from your request email.</p>');
    let accepted = false;
    try {
    const emailResult = await resend.emails.send({
      from: FROM, to: [r.work_email], subject: "Your private access to 1325 Clinical",
      reply_to: 'Partner@1325.AI',
      text: `Hello ${r.full_name},\n\nThomas approved your request to view 1325 Clinical.\n\nOpen your preview: ${SITE}/?access=${access}\n\nYour link expires ${expires.toUTCString()}. Each visit lasts 45 minutes. Use the same device for every visit and do not forward your link.\n\nIf this message reached Spam/Junk, mark it Not Junk and add Partner@1325.AI to your contacts.\n\nThomas\n1325.AI\nPartner@1325.AI\n\nPrivate and confidential. Do not copy, share or reproduce preview materials. U.S. Provisional Patent Application No. 63/969,202 — 46 claims pending.`,
      html: `<p>Hello ${esc(r.full_name)},</p><p>Thomas approved your request to view 1325 Clinical.</p><p><a href="${SITE}/?access=${access}">Open your preview</a></p><p>Your link expires ${expires.toUTCString()}. Each visit lasts 45 minutes. Use the same device for every visit and do not forward your link.</p><p>If this message reached Spam/Junk, mark it Not Junk and add Partner@1325.AI to your contacts.</p><p>Thomas<br>1325.AI<br>Partner@1325.AI</p><p>Private and confidential. Do not copy, share or reproduce preview materials. U.S. Provisional Patent Application No. 63/969,202 — 46 claims pending.</p>`,
    });
    accepted = emailWasAccepted(emailResult);
    } catch {
      accepted = false;
    }
    const revoke = `${FN_URL}?id=${id}&t=${t}&d=revoke`;
    return page("Access Approved", approvedContent(r.full_name, r.work_email, expires, revoke, accepted));
  }

  let body: unknown;
  try { body = await req.json(); } catch { return json({ error: "Invalid request" }, 400); }

  // Admins (verified server-side via user_roles) always have access
  if ((body as { action?: string })?.action === "admin") {
    const jwt = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
    if (!jwt) return json({ ok: false });
    const { data: u } = await db.auth.getUser(jwt);
    if (!u?.user) return json({ ok: false });
    const { data: isAdmin } = await db.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
    if (!isAdmin) return json({ ok: false });
    return json({ ok: true, admin: true });
  }

  const v = Verify.safeParse(body);
  if (v.success) {
    const { data: r } = await db.from("hc_access_requests").select("id, full_name, expires_at, device_id").eq("access_token", v.data.token).eq("status", "approved").maybeSingle();
    if (!r) return json({ ok: false, reason: "invalid" });
    if (!r.expires_at || new Date(r.expires_at).getTime() < Date.now()) {
      await db.from("hc_access_requests").update({ status: "expired", access_token: null }).eq("id", r.id);
      return json({ ok: false, reason: "expired" });
    }
    if (!r.device_id) {
      await db.from("hc_access_requests").update({ device_id: v.data.device }).eq("id", r.id).is("device_id", null);
      const { data: again } = await db.from("hc_access_requests").select("device_id").eq("id", r.id).single();
      if (again?.device_id !== v.data.device) return json({ ok: false, reason: "device" });
    } else if (r.device_id !== v.data.device) {
      await db.from("hc_access_views").insert({ request_id: r.id, path: "BLOCKED: other device", user_agent: ua });
      return json({ ok: false, reason: "device" });
    }
    await db.from("hc_access_views").insert({ request_id: r.id, path: v.data.path ?? null, user_agent: ua });
    return json({ ok: true, name: r.full_name, expires_at: r.expires_at });
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
    from: FROM, to: [OWNER], reply_to: email,
    subject: `New 1325 Clinical access request: ${p.data.full_name} — ${p.data.organization}`,
    ...requestEmail,
  });
  return json({ ok: true });
});
