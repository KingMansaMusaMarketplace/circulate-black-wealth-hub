// Cron-triggered: auto-refund $99 lease fees for leases cancelled within 7-day window
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Auth: require CRON_SECRET in header
  const cronSecret = req.headers.get("x-cron-secret");
  if (cronSecret !== Deno.env.get("CRON_SECRET")) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2025-08-27.basil" });

  // Find leases that are cancelled, still within refund window, fee charged, not yet refunded
  const { data: leases, error } = await admin
    .from("lease_agreements")
    .select("*")
    .eq("status", "cancelled")
    .not("fee_charged_at", "is", null)
    .is("refunded_at", null)
    .not("stripe_payment_intent_id", "is", null)
    .gte("refund_eligible_until", new Date().toISOString())
    .limit(50);

  if (error) {
    console.error("Query error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const results: Array<{ id: string; status: string; error?: string }> = [];

  for (const lease of leases ?? []) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: lease.stripe_payment_intent_id,
        reason: "requested_by_customer",
      });

      await admin.from("lease_fee_refunds").insert({
        lease_agreement_id: lease.id,
        landlord_id: lease.landlord_id,
        refund_amount: lease.fee_amount,
        currency: lease.fee_currency,
        stripe_refund_id: refund.id,
        reason: "Auto-refund: lease cancelled within 7-day window",
        status: refund.status === "succeeded" ? "succeeded" : "processing",
      });

      await admin
        .from("lease_agreements")
        .update({ status: "refunded", refunded_at: new Date().toISOString() })
        .eq("id", lease.id);

      results.push({ id: lease.id, status: "refunded" });
    } catch (e) {
      console.error(`Refund failed for ${lease.id}:`, e);
      results.push({ id: lease.id, status: "failed", error: (e as Error).message });
    }
  }

  return new Response(JSON.stringify({ processed: results.length, results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
