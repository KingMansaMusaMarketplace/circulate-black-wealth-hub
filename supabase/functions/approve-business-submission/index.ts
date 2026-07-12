// Approve or Reject a Business Submission
// Admin-only. On approve: creates a public business listing and (best effort)
// emails the owner. On reject: records the reason.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Placeholder owner (same one used by kayla-verify-and-promote) — an admin
// account that holds unclaimed listings until the real owner claims them.
const PLACEHOLDER_OWNER_ID = "bd72a75e-1310-4f40-9c74-380443b09d9b";

async function requireAdmin(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return { ok: false, status: 401, error: "Unauthorized" };

  const supabaseAuth = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const token = authHeader.replace("Bearer ", "");
  const { data: claims, error } = await supabaseAuth.auth.getClaims(token);
  if (error || !claims?.claims?.sub) return { ok: false, status: 401, error: "Invalid token" };

  const userId = claims.claims.sub as string;
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { data: isAdmin } = await admin.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!isAdmin) return { ok: false, status: 403, error: "Admin required" };

  return { ok: true, userId, admin };
}

async function sendApprovalEmail(email: string, businessName: string, listingUrl: string) {
  // Best effort — attempt via Resend if key exists, otherwise no-op.
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) return { sent: false, reason: "no RESEND_API_KEY" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
      },
      body: JSON.stringify({
        from: "1325.AI <hello@1325.ai>",
        to: [email],
        subject: `🎉 ${businessName} is now live on 1325.AI`,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#000;color:#fff">
            <h1 style="color:#FFB300">Welcome to the 1325.AI directory!</h1>
            <p>Great news — <strong>${businessName}</strong> has been verified and is now live in our Black-owned business directory.</p>
            <p style="margin:24px 0"><a href="${listingUrl}" style="background:#FFB300;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">View Your Listing →</a></p>
            <p>Your business is now discoverable by:</p>
            <ul>
              <li>Thousands of intentional shoppers on 1325.AI</li>
              <li>AI assistants like ChatGPT and Claude via our directory MCP</li>
              <li>Corporate sponsors looking for verified Black-owned partners</li>
            </ul>
            <hr style="border-color:#333;margin:32px 0"/>
            <h3 style="color:#FFB300">Want premium placement?</h3>
            <p>Founding Sponsor businesses appear at the top of category searches and get featured across the platform.</p>
            <p><a href="https://1325.ai/subscription" style="color:#FFB300">Explore Founding Sponsor tiers →</a></p>
            <p style="color:#888;font-size:12px;margin-top:32px">You're receiving this because you submitted your business on 1325.AI. Reply to this email if you have questions.</p>
          </div>
        `,
      }),
    });
    return { sent: res.ok, status: res.status };
  } catch (err: any) {
    return { sent: false, reason: err?.message ?? "unknown" };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return new Response(JSON.stringify({ error: auth.error }), {
      status: auth.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const { userId, admin } = auth;

  try {
    const { submission_id, action, admin_notes } = await req.json();
    if (!submission_id || !["approve", "reject", "needs_more_info"].includes(action)) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: submission, error: fetchErr } = await admin
      .from("business_submissions")
      .select("*")
      .eq("id", submission_id)
      .single();
    if (fetchErr || !submission) {
      return new Response(JSON.stringify({ error: "Submission not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "reject") {
      await admin
        .from("business_submissions")
        .update({
          status: "rejected",
          reviewed_by: userId,
          reviewed_at: new Date().toISOString(),
          admin_notes: admin_notes ?? null,
        })
        .eq("id", submission_id);
      return new Response(JSON.stringify({ ok: true, status: "rejected" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "needs_more_info") {
      await admin
        .from("business_submissions")
        .update({
          status: "needs_more_info",
          reviewed_by: userId,
          reviewed_at: new Date().toISOString(),
          admin_notes: admin_notes ?? null,
        })
        .eq("id", submission_id);
      return new Response(JSON.stringify({ ok: true, status: "needs_more_info" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // approve: create a business listing
    const { data: business, error: bizErr } = await admin
      .from("businesses")
      .insert({
        owner_id: PLACEHOLDER_OWNER_ID,
        business_name: submission.business_name,
        name: submission.business_name,
        description: `${submission.business_name} — verified Black-owned ${submission.category} business.`,
        category: submission.category,
        city: submission.city,
        state: submission.state,
        phone: submission.phone,
        email: submission.email,
        website: submission.website,
        is_verified: true,
      })
      .select("id")
      .single();

    if (bizErr) {
      console.error("Business insert failed:", bizErr);
      return new Response(JSON.stringify({ error: "Could not create business", detail: bizErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await admin
      .from("business_submissions")
      .update({
        status: "approved",
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
        admin_notes: admin_notes ?? null,
        approved_business_id: business.id,
      })
      .eq("id", submission_id);

    const listingUrl = `https://1325.ai/business/${business.id}`;
    const emailResult = await sendApprovalEmail(submission.email, submission.business_name, listingUrl);

    return new Response(
      JSON.stringify({
        ok: true,
        status: "approved",
        business_id: business.id,
        listing_url: listingUrl,
        email: emailResult,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error("approve-business-submission error:", err);
    return new Response(JSON.stringify({ error: err?.message ?? "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
