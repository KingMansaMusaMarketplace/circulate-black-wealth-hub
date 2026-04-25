import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InquiryPayload {
  companyName: string;
  contactName: string;
  title?: string;
  email: string;
  phone: string;
  website?: string;
  sponsorshipTier: string;
  industry: string;
  companySize: string;
  budget: string;
  objective: string;
  timeline: string;
  message?: string;
}

const TIER_LABELS: Record<string, string> = {
  recommend: "Not sure — recommend a tier",
  founding: "Founding Sponsor — $21K/yr",
  bronze: "Bronze Partner — $60K/yr",
  silver: "Silver Partner — $180K/yr",
  gold: "Gold Partner — $300K/yr",
  platinum: "Platinum Partner — $600K/yr",
  partner: "Founding Partner — by invitation",
};

const TIER_DEAL_VALUE: Record<string, number> = {
  founding: 21000,
  bronze: 60000,
  silver: 180000,
  gold: 300000,
  platinum: 600000,
};

// Map form → DB CHECK constraint allowed values
const COMPANY_SIZE_MAP: Record<string, string> = {
  "1-50": "small",
  "51-500": "medium",
  "501-5000": "large",
  "5000+": "enterprise",
};

// DB allows: bronze|silver|gold|platinum|custom
const TIER_DB_MAP: Record<string, string> = {
  founding: "custom",
  bronze: "bronze",
  silver: "silver",
  gold: "gold",
  platinum: "platinum",
  partner: "custom",
  recommend: "custom",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as InquiryPayload;
    console.log("New sponsorship inquiry:", payload.companyName, payload.email);

    if (!payload.companyName || !payload.email || !payload.contactName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as any ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Insert into sponsor_prospects
    const { data: prospect, error: insertError } = await supabase
      .from("sponsor_prospects")
      .insert({
        company_name: payload.companyName,
        industry: payload.industry,
        company_size: payload.companySize,
        website: payload.website || null,
        primary_contact_name: payload.contactName,
        primary_contact_title: payload.title || null,
        primary_contact_email: payload.email,
        primary_contact_phone: payload.phone,
        source: "corporate_sponsorship_page",
        source_details: `Tier: ${payload.sponsorshipTier} · Budget: ${payload.budget} · Timeline: ${payload.timeline} · Objective: ${payload.objective}`,
        pipeline_stage: "new_lead",
        expected_tier: payload.sponsorshipTier,
        deal_value: TIER_DEAL_VALUE[payload.sponsorshipTier] ?? null,
        notes: payload.message || null,
        priority: payload.timeline === "this-quarter" ? "high" : "medium",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error(`DB insert failed: ${insertError.message}`);
    }

    // Email the partnerships team
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "Thomas@1325.AI";
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    try {
      await resend.emails.send({
        from: "Partnerships <partnerships@1325.ai>",
        to: [adminEmail],
        replyTo: payload.email,
        subject: `New Partnership Inquiry — ${payload.companyName} (${TIER_LABELS[payload.sponsorshipTier] ?? payload.sponsorshipTier})`,
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 640px;">
            <h2 style="color: #B8860B;">New Corporate Sponsorship Inquiry</h2>
            <table style="border-collapse: collapse; width: 100%;">
              <tr><td style="padding:8px 12px;background:#f8f8f8;font-weight:600;">Company</td><td style="padding:8px 12px;">${payload.companyName}</td></tr>
              <tr><td style="padding:8px 12px;background:#f8f8f8;font-weight:600;">Contact</td><td style="padding:8px 12px;">${payload.contactName}${payload.title ? ` · ${payload.title}` : ""}</td></tr>
              <tr><td style="padding:8px 12px;background:#f8f8f8;font-weight:600;">Email</td><td style="padding:8px 12px;"><a href="mailto:${payload.email}">${payload.email}</a></td></tr>
              <tr><td style="padding:8px 12px;background:#f8f8f8;font-weight:600;">Phone</td><td style="padding:8px 12px;">${payload.phone}</td></tr>
              <tr><td style="padding:8px 12px;background:#f8f8f8;font-weight:600;">Website</td><td style="padding:8px 12px;">${payload.website || "—"}</td></tr>
              <tr><td style="padding:8px 12px;background:#f8f8f8;font-weight:600;">Industry</td><td style="padding:8px 12px;">${payload.industry}</td></tr>
              <tr><td style="padding:8px 12px;background:#f8f8f8;font-weight:600;">Company Size</td><td style="padding:8px 12px;">${payload.companySize}</td></tr>
              <tr><td style="padding:8px 12px;background:#f8f8f8;font-weight:600;">Budget</td><td style="padding:8px 12px;">${payload.budget}</td></tr>
              <tr><td style="padding:8px 12px;background:#f8f8f8;font-weight:600;">Tier Interest</td><td style="padding:8px 12px;">${TIER_LABELS[payload.sponsorshipTier] ?? payload.sponsorshipTier}</td></tr>
              <tr><td style="padding:8px 12px;background:#f8f8f8;font-weight:600;">Objective</td><td style="padding:8px 12px;">${payload.objective}</td></tr>
              <tr><td style="padding:8px 12px;background:#f8f8f8;font-weight:600;">Timeline</td><td style="padding:8px 12px;">${payload.timeline}</td></tr>
            </table>
            ${payload.message ? `<h3 style="margin-top:24px;">Additional Context</h3><p style="white-space:pre-wrap;background:#f8f8f8;padding:12px;border-radius:6px;">${payload.message}</p>` : ""}
            <p style="margin-top:24px;color:#666;font-size:12px;">Prospect ID: ${prospect.id}</p>
          </div>
        `,
      });

      // Acknowledgement to the prospect
      await resend.emails.send({
        from: "1325.AI Partnerships <partnerships@1325.ai>",
        to: [payload.email],
        subject: "We received your partnership inquiry — 1325.AI",
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 600px;">
            <h2 style="color:#B8860B;">Thank you, ${payload.contactName.split(" ")[0]}.</h2>
            <p>We've received ${payload.companyName}'s partnership inquiry and a member of our Partnerships team will respond within <strong>1 business day</strong> to schedule your discovery call.</p>
            <p>In the meantime, you can review our institutional brief at <a href="https://1325.ai/corporate-sponsorship">1325.ai/corporate-sponsorship</a>.</p>
            <p style="margin-top:32px;color:#666;font-size:12px;">— The 1325.AI Partnerships Team<br/>U.S. Patent Pending 63/969,202</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Email send failed (non-fatal):", emailErr);
      // Don't fail the request — the prospect record is saved
    }

    return new Response(
      JSON.stringify({ success: true, prospectId: prospect.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("submit-sponsorship-inquiry error:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
