import { createClient } from "npm:@supabase/supabase-js@2";
import { SIGNATURE_HTML } from "../_shared/email-signature.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const authHeader = req.headers.get("Authorization") ?? "";
    // Caller must be a signed-in admin or reviewer
    const asUser = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
    const { data: ok, error: roleErr } = await asUser.rpc("can_review_businesses");
    if (roleErr || !ok) return json({ error: "Not authorized" }, 403);

    const { requestId } = await req.json();
    if (typeof requestId !== "string") return json({ error: "requestId required" }, 400);

    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!) as any;
    const { data: r } = await admin.from("lead_claim_requests")
      .select("id, user_id, lead_id, business_id, status").eq("id", requestId).maybeSingle();
    if (!r || r.status !== "approved") return json({ error: "Claim is not approved" }, 400);

    let name = "your business";
    if (r.business_id) {
      const { data } = await admin.from("businesses").select("business_name").eq("id", r.business_id).maybeSingle();
      name = data?.business_name ?? name;
    } else if (r.lead_id) {
      const { data } = await admin.from("b2b_external_leads").select("business_name").eq("id", r.lead_id).maybeSingle();
      name = data?.business_name ?? name;
    }
    const { data: u } = await admin.auth.admin.getUserById(r.user_id);
    const to = u?.user?.email;
    if (!to) return json({ error: "Owner has no email" }, 400);

    const key = Deno.env.get("RESEND_API_KEY");
    if (!key) throw new Error("RESEND_API_KEY is not configured");
    const safe = esc(name);
    const html = `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#222;max-width:560px">
<p>Hello,</p>
<p>Good news — our team has confirmed you as the owner of <strong>${safe}</strong> on 1325.AI.</p>
<p>You can now sign in and update your listing: photos, hours, services, phone number and more.</p>
<p><a href="https://1325.ai/business-dashboard" style="display:inline-block;background:#003366;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600">Manage my listing</a></p>
<p>Questions? Just reply to this email.</p>
${SIGNATURE_HTML}</div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Thomas at 1325.AI <Partner@1325.AI>",
        reply_to: "Partner@1325.AI",
        to: [to],
        subject: `You're confirmed as the owner of ${name} on 1325.AI`,
        html,
      }),
    });
    if (!res.ok) return json({ error: `Email failed: ${await res.text()}` }, 502);
    return json({ success: true });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
