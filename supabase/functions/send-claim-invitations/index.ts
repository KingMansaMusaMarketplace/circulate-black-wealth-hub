import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@2.0.0";
import { requireAdminOrCron } from "../_shared/auth-guard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_KEY = Deno.env.get("RESEND_API_KEY");
const SITE_URL = Deno.env.get("FRONTEND_URL") || "https://1325.ai";
const FROM = "1325.AI <listings@1325.ai>";
const MAILING_ADDRESS = "1325.AI · Mansa Musa Marketplace, 1000 E. 111th Street, Suite 1100, Chicago, Illinois 60628, USA";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function esc(s: string): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}

function buildEmail(opts: {
  businessName: string;
  city: string | null;
  state: string | null;
  claimUrl: string;
  unsubUrl: string;
}) {
  const loc = [opts.city, opts.state].filter(Boolean).join(", ");
  const LOGO = "https://agoclnqfyinwjxdmjnns.supabase.co/storage/v1/object/public/marketing-assets/email/1325ai-logo.jpg";
  const now = new Date();
  const holidayOn = now >= new Date("2026-10-01T00:00:00-05:00") && now < new Date("2027-01-01T00:00:00-06:00");
  const benefit = (t: string, d: string) => `<tr><td valign="top" style="padding:0 12px 12px 0;width:22px;color:#FFB300;font-size:16px;font-weight:700;">&#10003;</td><td style="padding:0 0 12px;font-size:14px;line-height:1.55;color:#333;"><strong style="color:#003366;">${t}</strong> ${d}</td></tr>`;
  const holiday = holidayOn ? `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;background:#003366;background-image:linear-gradient(135deg,#002347 0%,#003366 60%,#0b4a85 100%);border-radius:12px;">
            <tr><td style="padding:26px 24px;text-align:center;">
              <div style="display:inline-block;background:#FFB300;color:#000;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;padding:6px 14px;border-radius:999px;">Holiday Special &middot; Oct 1 &ndash; Dec 31</div>
              <div style="color:#ffffff;font-size:20px;font-weight:700;margin:16px 0 6px;">Upgrade to 1325.AI Pro</div>
              <div style="margin:0 0 6px;"><span style="color:#FFB300;font-size:44px;font-weight:800;line-height:1;">$149</span><span style="color:#ffffff;font-size:16px;">/month</span></div>
              <div style="color:#c9d6e6;font-size:14px;margin:0 0 4px;">Regularly <span style="text-decoration:line-through;">$299/month</span> &mdash; save $150 every month</div>
              <div style="color:#ffffff;font-size:13px;margin:0 0 14px;">Lock in $149 for as long as you stay subscribed. Sign up by December 31.</div>
              <div style="color:#FFB300;font-size:12px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 8px;">What Pro includes</div>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 18px;text-align:left;">
                <tr><td style="color:#FFB300;font-size:14px;padding:3px 8px 3px 0;vertical-align:top;">&#10003;</td><td style="color:#ffffff;font-size:14px;padding:3px 0;">Kayla and the 42 Agentic AI Employees working for your business</td></tr>
                <tr><td style="color:#FFB300;font-size:14px;padding:3px 8px 3px 0;vertical-align:top;">&#10003;</td><td style="color:#ffffff;font-size:14px;padding:3px 0;">Online booking and appointment requests from customers</td></tr>
                <tr><td style="color:#FFB300;font-size:14px;padding:3px 8px 3px 0;vertical-align:top;">&#10003;</td><td style="color:#ffffff;font-size:14px;padding:3px 0;">Priority placement and a verified, claimed profile</td></tr>
                <tr><td style="color:#FFB300;font-size:14px;padding:3px 8px 3px 0;vertical-align:top;">&#10003;</td><td style="color:#ffffff;font-size:14px;padding:3px 0;">~4 Roles Covered &mdash; over $18,000 a month in staff time saved</td></tr>
              </table>
              <a href="${SITE_URL}/holiday-special" style="display:inline-block;border:2px solid #FFB300;color:#FFB300;font-weight:700;font-size:14px;text-decoration:none;padding:10px 24px;border-radius:8px;">See the Holiday Special</a>
            </td></tr>
          </table>` : "";
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#eef1f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f5;padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,35,71,.12);">
        <tr><td style="background:#0a2a52;padding:28px 24px 22px;text-align:center;">
          <img src="${LOGO}" width="150" height="150" alt="1325.AI" style="display:block;margin:0 auto;border-radius:14px;border:0;" />
          <div style="color:#FFB300;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-top:14px;">Verified Black-Owned Business Directory</div>
        </td></tr>
        <tr><td style="height:4px;background:#FFB300;line-height:4px;font-size:0;">&nbsp;</td></tr>
        <tr><td style="padding:34px 32px 30px;color:#111111;">
          <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;color:#0a2a52;">${esc(opts.businessName)} is already listed on 1325.AI</h1>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#333;">
            We found and verified <strong>${esc(opts.businessName)}</strong>${loc ? ` in ${esc(loc)}` : ""} and added it to our directory of Black-owned businesses at no cost to you.
          </p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#333;">
            Claim your free listing to control your profile, add photos and hours, respond to reviews, and get discovered by AI assistants that shop on your customers' behalf.
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 30px;">
            <tr><td style="background:#FFB300;border-radius:10px;box-shadow:0 4px 14px rgba(255,179,0,.35);">
              <a href="${opts.claimUrl}" style="display:inline-block;padding:16px 38px;color:#000000;font-weight:800;font-size:17px;text-decoration:none;">Claim Your Free Listing</a>
            </td></tr>
          </table>
          <p style="font-size:15px;font-weight:700;color:#0a2a52;text-align:center;margin:0 0 8px;">Watch the tour</p>
          <a href="${SITE_URL}/tour?claim=${encodeURIComponent(opts.claimUrl)}&utm_source=email&utm_campaign=claim_invite" style="display:block;text-decoration:none;margin:0 0 30px;"><img src="${SITE_URL}/videos/${holidayOn ? "tour-holiday-thumb" : "tour-thumb"}.jpg" alt="Watch the 1325.AI tour" width="504" style="display:block;width:100%;max-width:504px;height:auto;border-radius:10px;border:2px solid #FFB300;margin:0 auto;"/></a>
          <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#003366;margin:0 0 14px;border-top:1px solid #e6eaf0;padding-top:24px;">Why 1325.AI is different</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
            ${benefit("Found by AI assistants.", "When customers ask an AI assistant for a Black-owned business nearby, 1325.AI can point them to you.")}
            ${benefit("More than a listing.", "Customers can call, book appointments, and pay you right from your page.")}
            ${benefit("Verified means trusted.", "Every business is checked, so customers know you're the real deal.")}
            ${benefit("Free to claim.", "No credit card needed.")}
          </table>${holiday}
          <p style="margin:0 0 6px;font-size:13px;color:#666;">This link is unique to your business and expires in 30 days.</p>
          <p style="margin:0;font-size:13px;color:#666;">Not the owner? You can safely ignore this email.</p>
        </td></tr>
        <tr><td style="padding:22px 32px;background:#0a2a52;font-size:11px;color:#b8c6d8;line-height:1.7;text-align:center;">
          <div style="color:#FFB300;font-weight:700;font-size:13px;letter-spacing:1px;margin-bottom:6px;">1325.AI</div>
          ${esc(MAILING_ADDRESS)}<br/>
          You received this because your business appears in our public directory.
          <a href="${opts.unsubUrl}" style="color:#ffffff;text-decoration:underline;">Unsubscribe</a> to never hear from us again.
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const auth = await requireAdminOrCron(req, corsHeaders);
  if (!auth.authenticated) {
    return new Response(JSON.stringify({ error: auth.error }), {
      status: auth.status ?? 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY) as any;

  try {
    if (!RESEND_KEY) throw new Error("RESEND_API_KEY is not configured");
    const resend = new Resend(RESEND_KEY);

    const body = await req.json().catch(() => ({}));

    // Test mode: send one sample email to an admin-chosen address. No records written.
    if (typeof body?.test_to === "string") {
      const to = body.test_to.trim().toLowerCase();
      if (!EMAIL_RE.test(to) || to.length > 255) throw new Error("Enter a valid test email");
      const html = buildEmail({
        businessName: "Sample Business",
        city: "Chicago",
        state: "IL",
        claimUrl: `${SITE_URL}/claim-business`,
        unsubUrl: `${SITE_URL}/unsubscribe`,
      });
      const { error: tErr } = await resend.emails.send({
        from: FROM,
        to: [to],
        subject: "[TEST] Sample Business is listed on 1325.AI — claim it free",
        html,
      });
      if (tErr) throw new Error(tErr.message);
      return new Response(JSON.stringify({ success: true, test: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const campaignId: string | undefined = body?.campaign_id;
    const dryRun: boolean = body?.dry_run === true;
    if (!campaignId) throw new Error("campaign_id is required");

    const { data: campaign, error: cErr } = await supabase
      .from("business_claim_campaigns")
      .select("*")
      .eq("id", campaignId)
      .single();
    if (cErr || !campaign) throw new Error("Campaign not found");

    const limit = Math.min(Math.max(Number(campaign.daily_limit) || 200, 1), 500);

    // Candidate listings: live, unclaimed, never invited, has an email
    let q = supabase
      .from("businesses")
      .select("id, business_name, email, city, state")
      .eq("listing_status", "live")
      .eq("claim_status", "unclaimed")
      .is("claim_invited_at", null)
      .not("email", "is", null)
      .limit(limit);

    if (campaign.target_city) q = q.eq("city", campaign.target_city);
    if (campaign.target_state) q = q.eq("state", campaign.target_state);
    if (campaign.target_category) q = q.eq("category", campaign.target_category);

    const { data: rows, error: bErr } = await q;
    if (bErr) throw new Error(`Failed to load listings: ${bErr.message}`);

    const candidates = (rows ?? []).filter(
      (b: any) => typeof b.email === "string" && EMAIL_RE.test(b.email.trim())
    );

    if (candidates.length === 0) {
      await supabase
        .from("business_claim_campaigns")
        .update({ status: "completed", last_run_at: new Date().toISOString() })
        .eq("id", campaignId);
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "No remaining listings match this campaign." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Drop opted-out addresses
    const emails = [...new Set(candidates.map((b: any) => b.email.trim().toLowerCase()))];
    const { data: optouts } = await supabase
      .from("claim_email_optouts")
      .select("email")
      .in("email", emails);
    const blocked = new Set((optouts ?? []).map((o: any) => o.email));

    const targets = candidates.filter((b: any) => !blocked.has(b.email.trim().toLowerCase()));

    if (dryRun) {
      return new Response(
        JSON.stringify({ success: true, dry_run: true, would_send: targets.length, blocked: blocked.size }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let sent = 0;
    let failed = 0;
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    for (const biz of targets) {
      const email = biz.email.trim();
      try {
        const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
        const claimUrl = `${SITE_URL}/claim-business?token=${token}&type=directory`;
        const unsubUrl = `${SITE_URL}/email-unsubscribe?email=${encodeURIComponent(email)}`;

        // Claim tokens live in a private, admin-only table (never publicly readable)
        const { error: tokErr } = await supabase
          .from("businesses_claim_tokens")
          .upsert({
            business_id: biz.id,
            claim_token: token,
            claim_token_expires_at: expires,
          }, { onConflict: "business_id" });
        if (tokErr) throw new Error(tokErr.message);

        const { error: invErr } = await supabase
          .from("businesses")
          .update({ claim_invited_at: new Date().toISOString() })
          .eq("id", biz.id);
        if (invErr) throw new Error(invErr.message);


        const { data: sendData, error: sendErr } = await resend.emails.send({
          from: FROM,
          to: [email],
          subject: `${biz.business_name} is listed on 1325.AI — claim it free`,
          html: buildEmail({
            businessName: biz.business_name,
            city: biz.city,
            state: biz.state,
            claimUrl,
            unsubUrl,
          }),
          headers: { "List-Unsubscribe": `<${unsubUrl}>` },
        });
        if (sendErr) throw new Error(String((sendErr as any)?.message ?? sendErr));

        await supabase.from("business_claim_invites").insert({
          campaign_id: campaignId,
          business_id: biz.id,
          email,
          status: "sent",
          sent_at: new Date().toISOString(),
          resend_id: (sendData as any)?.id ?? null,
        });
        sent++;
      } catch (e) {
        failed++;
        console.error(`[send-claim-invitations] Failed for ${biz.id}:`, e);
        await supabase.from("business_claim_invites").insert({
          campaign_id: campaignId,
          business_id: biz.id,
          email,
          status: "failed",
          error_message: e instanceof Error ? e.message : String(e),
        });
      }
    }

    await supabase
      .from("business_claim_campaigns")
      .update({
        status: "running",
        total_sent: (campaign.total_sent ?? 0) + sent,
        last_run_at: new Date().toISOString(),
      })
      .eq("id", campaignId);

    return new Response(JSON.stringify({ success: true, sent, failed, skipped_optout: blocked.size }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[send-claim-invitations] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
