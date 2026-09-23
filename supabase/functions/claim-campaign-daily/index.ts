// Daily job: (1) one polite reminder to unclaimed invitees 5+ days after the first email,
// (2) a summary email of yesterday's campaign numbers to the admin inbox.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@2.0.0";
import { requireAdminOrCron } from "../_shared/auth-guard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token, x-cron-secret, x-job-token",
};
const SITE_URL = Deno.env.get("FRONTEND_URL") || "https://1325.ai";
const FROM = "1325.AI <listings@1325.ai>";
const DIGEST_TO = Deno.env.get("CAMPAIGN_DIGEST_TO") || "partner@1325.ai";
const MAILING_ADDRESS = "1325.AI · Mansa Musa Marketplace, 200 E Randolph St, Suite 5100, Chicago, IL 60601";
const MAX_REMINDERS = 200;

const esc = (s: string) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

function reminderHtml(name: string, claimUrl: string, unsubUrl: string) {
  return `<!DOCTYPE html><html><body style="margin:0;background:#f5f5f5;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" style="padding:24px 12px;"><tr><td align="center">
<table role="presentation" width="100%" style="max-width:560px;background:#fff;border-radius:12px;border:1px solid #e5e5e5;overflow:hidden;">
<tr><td style="background:#000;padding:24px;text-align:center;"><div style="color:#FFB300;font-size:22px;font-weight:700;">1325.AI</div></td></tr>
<tr><td style="padding:32px 28px;color:#111;">
<h1 style="margin:0 0 16px;font-size:21px;">A quick reminder about ${esc(name)}</h1>
<p style="font-size:15px;line-height:1.6;color:#333;">Your free listing on 1325.AI is still waiting for you. Claiming it takes about two minutes and lets you update your hours, photos and contact details so customers can find you.</p>
<table role="presentation" style="margin:24px auto;"><tr><td style="background:#FFB300;border-radius:8px;">
<a href="${claimUrl}" style="display:inline-block;padding:14px 32px;color:#000;font-weight:700;text-decoration:none;">Claim Your Free Listing</a></td></tr></table>
<p style="font-size:13px;color:#666;">This is the only reminder we'll send.</p>
</td></tr>
<tr><td style="padding:20px 28px;background:#fafafa;border-top:1px solid #eee;font-size:11px;color:#888;">
${esc(MAILING_ADDRESS)}<br/><a href="${unsubUrl}" style="color:#666;">Unsubscribe</a></td></tr>
</table></td></tr></table></body></html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!) as any;
  let allowed = false;
  const jobToken = req.headers.get("x-job-token");
  if (jobToken) {
    const { data: t } = await supabase.from("internal_job_tokens").select("token").eq("name", "claim-campaign-daily").maybeSingle();
    allowed = !!t?.token && t.token === jobToken;
  }
  const auth = allowed ? { authenticated: true } as any : await requireAdminOrCron(req, corsHeaders);
  if (!auth.authenticated) {
    return new Response(JSON.stringify({ error: auth.error }), {
      status: auth.status ?? 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return new Response(JSON.stringify({ error: "RESEND_API_KEY missing" }), { status: 500, headers: corsHeaders });
  const resend = new Resend(key);
  const body = await req.json().catch(() => ({}));
  const skipReminders = body?.skip_reminders === true;

  // ---------- 1. Reminders ----------
  let reminded = 0, reminderFailed = 0;
  if (!skipReminders) {
    const cutoff = new Date(Date.now() - 5 * 86400000).toISOString();
    const { data: due } = await supabase
      .from("business_claim_invites")
      .select("id, business_id, email")
      .eq("status", "sent")
      .is("claimed_at", null)
      .is("reminder_sent_at", null)
      .is("bounced_at", null)
      .lt("sent_at", cutoff)
      .limit(MAX_REMINDERS);

    const list = (due ?? []) as any[];
    const ids = [...new Set(list.map((d) => d.business_id))];
    const emails = [...new Set(list.map((d) => String(d.email).trim().toLowerCase()))];
    const [{ data: bizRows }, { data: optRows }, { data: tokRows }] = await Promise.all([
      ids.length ? supabase.from("businesses").select("id, business_name, claim_status").in("id", ids) : { data: [] },
      emails.length ? supabase.from("claim_email_optouts").select("email").in("email", emails) : { data: [] },
      ids.length ? supabase.from("businesses_claim_tokens").select("business_id, claim_token").in("business_id", ids) : { data: [] },
    ]);
    const biz = new Map((bizRows ?? []).map((b: any) => [b.id, b]));
    const blocked = new Set((optRows ?? []).map((o: any) => o.email));
    const tokens = new Map((tokRows ?? []).map((t: any) => [t.business_id, t.claim_token]));
    const newExpiry = new Date(Date.now() + 30 * 86400000).toISOString();

    for (const inv of list) {
      const b: any = biz.get(inv.business_id);
      const email = String(inv.email).trim();
      if (!b || b.claim_status !== "unclaimed" || blocked.has(email.toLowerCase()) || !tokens.get(inv.business_id)) {
        await supabase.from("business_claim_invites").update({ reminder_sent_at: new Date().toISOString() }).eq("id", inv.id);
        continue;
      }
      // Extend the claim link so the reminder link still works
      await supabase.from("businesses_claim_tokens").update({ claim_token_expires_at: newExpiry }).eq("business_id", inv.business_id);
      const claimUrl = `${SITE_URL}/claim-business?token=${tokens.get(inv.business_id)}&type=directory`;
      const unsubUrl = `${SITE_URL}/email-unsubscribe?email=${encodeURIComponent(email)}`;
      const { error } = await resend.emails.send({
        from: FROM,
        to: [email],
        subject: `Reminder: claim ${b.business_name} on 1325.AI`,
        html: reminderHtml(b.business_name, claimUrl, unsubUrl),
        headers: { "List-Unsubscribe": `<${unsubUrl}>` },
      });
      await supabase.from("business_claim_invites").update({ reminder_sent_at: new Date().toISOString() }).eq("id", inv.id);
      if (error) reminderFailed++; else reminded++;
    }
  }

  // ---------- 2. Daily summary ----------
  const since = new Date(Date.now() - 86400000).toISOString();
  const count = async (table: string, col: string, extra?: (q: any) => any) => {
    let q = supabase.from(table).select("id", { count: "exact", head: true }).gte(col, since);
    if (extra) q = extra(q);
    const { count: c } = await q;
    return c ?? 0;
  };
  const [cSent, cFailed, cOpened, cClicked, cClaimed, cBounced, hSent, hOpened, hClicked, hBounced] = await Promise.all([
    count("business_claim_invites", "created_at", (q) => q.eq("status", "sent")),
    count("business_claim_invites", "created_at", (q) => q.eq("status", "failed")),
    count("business_claim_invites", "opened_at"),
    count("business_claim_invites", "clicked_at"),
    count("business_claim_invites", "claimed_at"),
    count("business_claim_invites", "bounced_at"),
    count("holiday_campaign_sends", "created_at", (q) => q.eq("status", "sent")),
    count("holiday_campaign_sends", "opened_at"),
    count("holiday_campaign_sends", "clicked_at"),
    count("holiday_campaign_sends", "bounced_at"),
  ]);

  const row = (label: string, v: number) =>
    `<tr><td style="padding:8px 0;color:#333;border-bottom:1px solid #eee;">${label}</td><td style="padding:8px 0;text-align:right;font-weight:700;border-bottom:1px solid #eee;">${v.toLocaleString()}</td></tr>`;
  const html = `<!DOCTYPE html><html><body style="margin:0;background:#f5f5f5;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" style="padding:24px 12px;"><tr><td align="center">
<table role="presentation" width="100%" style="max-width:560px;background:#fff;border-radius:12px;border:1px solid #e5e5e5;overflow:hidden;">
<tr><td style="background:#000;padding:22px 28px;"><div style="color:#FFB300;font-size:20px;font-weight:700;">1325.AI · Daily Campaign Summary</div>
<div style="color:#fff;font-size:13px;margin-top:4px;">Last 24 hours</div></td></tr>
<tr><td style="padding:24px 28px;">
<h2 style="font-size:16px;margin:0 0 8px;color:#003366;">Claim campaigns</h2>
<table width="100%" style="font-size:14px;border-collapse:collapse;">
${row("Emails sent", cSent)}${row("Reminders sent", reminded)}${row("Opened", cOpened)}${row("Clicked Claim", cClicked)}${row("Claimed", cClaimed)}${row("Bounced (removed)", cBounced)}${row("Failed", cFailed + reminderFailed)}
</table>
<h2 style="font-size:16px;margin:24px 0 8px;color:#003366;">Holiday Special</h2>
<table width="100%" style="font-size:14px;border-collapse:collapse;">
${row("Emails sent", hSent)}${row("Opened", hOpened)}${row("Clicked", hClicked)}${row("Bounced (removed)", hBounced)}
</table>
<p style="margin:24px 0 0;"><a href="${SITE_URL}/admin/claim-campaigns" style="background:#FFB300;color:#000;padding:12px 22px;border-radius:8px;font-weight:700;text-decoration:none;">Open campaigns</a></p>
</td></tr></table></td></tr></table></body></html>`;

  const nothing = cSent + reminded + cOpened + cClicked + cClaimed + cBounced + hSent + hOpened + hClicked + hBounced === 0;
  let digestSent = false;
  if (!nothing || body?.force_digest === true) {
    const { error } = await resend.emails.send({ from: FROM, to: [DIGEST_TO], subject: "1325.AI daily campaign summary", html });
    digestSent = !error;
  }

  return new Response(JSON.stringify({ success: true, reminded, reminderFailed, digestSent }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
