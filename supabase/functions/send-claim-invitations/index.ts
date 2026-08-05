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
const MAILING_ADDRESS = "1325.AI · Mansa Musa Marketplace, 200 E Randolph St, Suite 5100, Chicago, IL 60601";

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
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5;">
        <tr><td style="background:#000000;padding:24px;text-align:center;">
          <div style="color:#FFB300;font-size:22px;font-weight:700;letter-spacing:1px;">1325.AI</div>
          <div style="color:#ffffff;opacity:.7;font-size:12px;margin-top:4px;">Verified Black-Owned Business Directory</div>
        </td></tr>
        <tr><td style="padding:32px 28px;color:#111111;">
          <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;">${esc(opts.businessName)} is already listed on 1325.AI</h1>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#333;">
            We found and verified <strong>${esc(opts.businessName)}</strong>${loc ? ` in ${esc(loc)}` : ""} and added it to our directory of Black-owned businesses at no cost to you.
          </p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#333;">
            Claim your free listing to control your profile, add photos and hours, respond to reviews, and get discovered by AI assistants that shop on your customers' behalf.
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
            <tr><td style="background:#FFB300;border-radius:8px;">
              <a href="${opts.claimUrl}" style="display:inline-block;padding:14px 32px;color:#000000;font-weight:700;font-size:16px;text-decoration:none;">Claim Your Free Listing</a>
            </td></tr>
          </table>
          <p style="margin:0 0 8px;font-size:13px;color:#666;">This link is unique to your business and expires in 30 days.</p>
          <p style="margin:0;font-size:13px;color:#666;">Not the owner? You can safely ignore this email.</p>
        </td></tr>
        <tr><td style="padding:20px 28px;background:#fafafa;border-top:1px solid #eee;font-size:11px;color:#888;line-height:1.6;">
          ${esc(MAILING_ADDRESS)}<br/>
          You received this because your business appears in our public directory.
          <a href="${opts.unsubUrl}" style="color:#666;text-decoration:underline;">Unsubscribe</a> to never hear from us again.
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

        const { error: tokErr } = await supabase
          .from("businesses")
          .update({
            claim_token: token,
            claim_token_expires_at: expires,
            claim_invited_at: new Date().toISOString(),
          })
          .eq("id", biz.id);
        if (tokErr) throw new Error(tokErr.message);

        const { error: sendErr } = await resend.emails.send({
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
