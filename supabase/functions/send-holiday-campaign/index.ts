import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@2.0.0";
import { requireAdmin } from "../_shared/auth-guard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const SITE = "https://1325.ai";
const FROM = "1325.AI <Partner@1325.AI>";
const MAX_BATCH = 200;
const FAIL_STOP_RATE = 0.05;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const WAVES: Record<number, { subject: string; kicker: string; intro: string }> = {
  1: {
    subject: "Holiday Special: 1325.AI Pro for $149/mo, locked in forever",
    kicker: "HOLIDAY SPECIAL · OCT 1 – DEC 31",
    intro: "your business is already listed in the 1325.AI directory. This holiday season, you can upgrade to Pro for $149 a month, and that price is locked in for as long as you stay.",
  },
  2: {
    subject: "Reminder: your $149 Pro price is still available",
    kicker: "HOLIDAY SPECIAL · HALFWAY POINT",
    intro: "a quick reminder: the 1325.AI Holiday Special is still open. Upgrade to Pro for $149 a month, locked in forever, before December 31.",
  },
  3: {
    subject: "Last chance: Holiday Special ends December 31",
    kicker: "LAST CHANCE · ENDS DEC 31",
    intro: "the 1325.AI Holiday Special ends on December 31. After that, Pro goes back to $299 a month. Lock in $149 a month forever while you still can.",
  },
};

function renderEmail(wave: number, name: string, city: string | null, unsubUrl: string) {
  const w = WAVES[wave];
  const greet = name ? `Hi ${esc(name)} team,` : "Hello,";
  const where = city ? ` in ${esc(city)}` : "";
  return `<!DOCTYPE html><html><body style="margin:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1a1a1a">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
<tr><td style="background:#003366;padding:28px 32px;border-radius:12px 12px 0 0">
<div style="color:#FFB300;font-size:12px;letter-spacing:2px;font-weight:700">${w.kicker}</div>
<div style="color:#ffffff;font-size:28px;font-weight:800;margin-top:8px">1325.AI Pro — $149/mo</div>
<div style="color:#ffffff;font-size:15px;margin-top:6px">Locked in forever. Regular price $299/mo.</div>
</td></tr>
<tr><td style="padding:28px 32px;border:1px solid #e5e5e5;border-top:0;border-radius:0 0 12px 12px">
<p style="font-size:16px;line-height:1.6;margin:0 0 14px">${greet}</p>
<p style="font-size:16px;line-height:1.6;margin:0 0 14px">Customers${where} are finding your business on 1325.AI. ${w.intro}</p>
<p style="font-size:16px;line-height:1.6;margin:0 0 6px"><strong>With Pro you get:</strong></p>
<ul style="font-size:15px;line-height:1.7;margin:0 0 20px;padding-left:20px">
<li>Kayla and the 42 Agentic AI Employees working for your business</li>
<li>Online booking and appointment requests from customers</li>
<li>Priority placement and a verified, claimed profile</li>
<li>~4 Roles Covered — over $18,000 a month in staff time saved</li>
</ul>
<p style="text-align:center;margin:26px 0"><a href="${SITE}/holiday-special?utm_source=email&utm_campaign=holiday_2026&utm_content=wave${wave}" style="background:#FFB300;color:#1a1a1a;text-decoration:none;font-weight:800;font-size:17px;padding:14px 30px;border-radius:8px;display:inline-block">Lock in $149/mo</a></p>
<p style="font-size:14px;line-height:1.6;color:#555;margin:0">Offer valid for sign-ups October 1 – December 31, 2026. Price stays $149/month as long as your subscription stays active. Questions? Call 312.900.6004.</p>
</td></tr>
<tr><td style="padding:18px 32px;font-size:12px;line-height:1.6;color:#777;text-align:center">
You're receiving this because your business is listed in the 1325.AI directory.<br>
Mansa Musa Marketplace, Inc. d/b/a 1325.AI · Chicago, IL · contact@mansamusamarketplace.com<br>
<a href="${unsubUrl}" style="color:#777">Unsubscribe</a>
</td></tr></table></td></tr></table></body></html>`;
}

async function unsubUrlFor(supabase: any, email: string) {
  const { data: existing } = await supabase
    .from("email_unsubscribe_tokens").select("token").eq("email", email).is("used_at", null).limit(1).maybeSingle();
  let token = existing?.token;
  if (!token) {
    token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
    await supabase.from("email_unsubscribe_tokens").insert({ token, email });
  }
  return `${SITE}/email-unsubscribe?token=${token}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const auth = await requireAdmin(req, corsHeaders);
    if (!auth.authenticated) return json({ error: auth.error }, auth.status ?? 401);

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) return json({ error: "RESEND_API_KEY is not configured" }, 500);
    const resend = new Resend(apiKey);
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!) as any;

    const body = await req.json().catch(() => ({}));
    const action = String(body.action ?? "");
    const wave = Number(body.wave);
    if (![1, 2, 3].includes(wave) && action !== "stats") return json({ error: "wave must be 1, 2 or 3" }, 400);

    if (action === "stats") {
      const { data, error } = await supabase.rpc("get_holiday_campaign_stats");
      if (error) throw error;
      return json(data);
    }

    if (action === "test") {
      const to = String(body.to ?? "").trim().toLowerCase();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) return json({ error: "Enter a valid test email" }, 400);
      const { error } = await resend.emails.send({
        from: FROM, to: [to], subject: `[TEST] ${WAVES[wave].subject}`,
        html: renderEmail(wave, "Sample Business", "Chicago", `${SITE}/email-unsubscribe`),
      });
      if (error) return json({ error: error.message }, 502);
      return json({ success: true });
    }

    if (action === "send_batch") {
      if (body.confirm !== "SEND") return json({ error: "Confirmation required" }, 400);
      const limit = Math.min(Math.max(Number(body.limit) || 50, 1), MAX_BATCH);
      const { data: recipients, error } = await supabase.rpc("get_holiday_campaign_recipients", { _wave: wave, _limit: limit });
      if (error) throw error;
      let sent = 0, failed = 0, stopped = false;
      for (const r of recipients ?? []) {
        const unsub = await unsubUrlFor(supabase, r.email);
        const { data, error: sendErr } = await resend.emails.send({
          from: FROM, to: [r.email], subject: WAVES[wave].subject,
          html: renderEmail(wave, r.business_name ?? "", r.city, unsub),
          headers: { "List-Unsubscribe": `<${unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
          tags: [{ name: "campaign", value: "holiday_2026" }, { name: "wave", value: String(wave) }],
        });
        if (sendErr) failed++; else sent++;
        await supabase.from("holiday_campaign_sends").upsert({
          business_id: r.business_id, email: r.email, wave,
          status: sendErr ? "failed" : "sent", error: sendErr?.message ?? null, resend_id: data?.id ?? null,
        }, { onConflict: "email,wave" });
        const done = sent + failed;
        if (done >= 20 && failed / done > FAIL_STOP_RATE) { stopped = true; break; }
        await new Promise((res) => setTimeout(res, 120)); // stay under provider rate limits
      }
      return json({ sent, failed, stopped });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    console.error("[send-holiday-campaign]", e);
    return json({ error: e instanceof Error ? e.message : "Internal error" }, 500);
  }
});
