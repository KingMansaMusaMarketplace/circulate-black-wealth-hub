import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { z } from "https://esm.sh/zod@3.23.8";

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
  `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title><body style="font-family:system-ui;background:#001a33;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0"><div style="max-width:480px;padding:32px;border:1px solid #FFB300;border-radius:16px"><h1 style="color:#FFB300">${title}</h1><p>${msg}</p></div></body>`,
  { headers: { "Content-Type": "text/html; charset=utf-8" } },
);

const Request = z.object({
  action: z.literal("request"),
  full_name: z.string().trim().min(2).max(120),
  organization: z.string().trim().min(2).max(160),
  role: z.string().trim().min(2).max(80),
  work_email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().default(""),
  nda: z.literal(true),
});
const Verify = z.object({ action: z.literal("verify"), token: z.string().regex(/^[a-f0-9]{48}$/), path: z.string().max(200).optional() });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const ua = (req.headers.get("user-agent") ?? "").slice(0, 300);

  // Approve / deny link clicked from Thomas's email
  if (req.method === "GET") {
    const u = new URL(req.url);
    const id = u.searchParams.get("id") ?? "", t = u.searchParams.get("t") ?? "", d = u.searchParams.get("d");
    if (!/^[0-9a-f-]{36}$/.test(id) || !/^[a-f0-9]{48}$/.test(t) || (d !== "approve" && d !== "deny")) return page("Invalid link", "This link is not valid.");
    const { data: r } = await db.from("hc_access_requests").select("*").eq("id", id).eq("decision_token", t).maybeSingle();
    if (!r) return page("Invalid link", "This request was not found.");
    if (r.status !== "pending") return page("Already decided", `This request was already ${esc(r.status)}.`);
    if (d === "deny") {
      await db.from("hc_access_requests").update({ status: "denied", decided_at: new Date().toISOString() }).eq("id", id);
      return page("Request denied", `${esc(r.full_name)} will not receive access.`);
    }
    const bytes = crypto.getRandomValues(new Uint8Array(24));
    const access = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    await db.from("hc_access_requests").update({ status: "approved", access_token: access, decided_at: new Date().toISOString() }).eq("id", id);
    await resend.emails.send({
      from: FROM, to: [r.work_email], subject: "Your private access to 1325 Clinical",
      html: `<p>Hello ${esc(r.full_name)},</p><p>Your request to view the 1325 Clinical private physician preview has been approved.</p><p><a href="${SITE}/?access=${access}">Open your private preview</a></p><p>This link is personal to you. Please don't forward it. All materials are proprietary and confidential to 1325.AI (U.S. Provisional Patent Application No. 63/969,202 — 46 claims pending).</p><p>Thomas<br>1325.AI</p>`,
    });
    return page("Approved", `${esc(r.full_name)} (${esc(r.work_email)}) has been sent a private access link.`);
  }

  let body: unknown;
  try { body = await req.json(); } catch { return json({ error: "Invalid request" }, 400); }

  const v = Verify.safeParse(body);
  if (v.success) {
    const { data: r } = await db.from("hc_access_requests").select("id, full_name").eq("access_token", v.data.token).eq("status", "approved").maybeSingle();
    if (!r) return json({ ok: false });
    await db.from("hc_access_views").insert({ request_id: r.id, path: v.data.path ?? null, user_agent: ua });
    return json({ ok: true, name: r.full_name });
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
  const row = (k: string, val: string) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td><b>${esc(val)}</b></td></tr>`;
  await resend.emails.send({
    from: FROM, to: [OWNER], reply_to: email,
    subject: `New 1325 Clinical access request: ${p.data.full_name} — ${p.data.organization}`,
    html: `<h2>New access request for health.1325.ai</h2><table>${row("Name", p.data.full_name)}${row("Organization", p.data.organization)}${row("Role", p.data.role)}${row("Work email", email)}${row("Phone", p.data.phone || "—")}${row("Agreed to confidentiality", "Yes")}</table>
<p><a href="${link("approve")}" style="background:#1a7f37;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Approve</a> &nbsp; <a href="${link("deny")}" style="background:#b42318;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Deny</a></p>`,
  });
  return json({ ok: true });
});
