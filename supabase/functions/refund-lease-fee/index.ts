import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, x-csrf-token",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: userData } = await supabaseUser.auth.getUser();
    const user = userData?.user;
    if (!user) throw new Error("Not authenticated");

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { leaseAgreementId, reason } = await req.json();
    const { data: agreement } = await admin
      .from("lease_agreements")
      .select("*")
      .eq("id", leaseAgreementId)
      .single();

    if (!agreement) throw new Error("Not found");
    if (agreement.landlord_id !== user.id) throw new Error("Only landlord can request refund");
    if (!agreement.fee_charged_at) throw new Error("No fee was charged");
    if (agreement.refunded_at) throw new Error("Already refunded");
    if (!agreement.refund_eligible_until || new Date(agreement.refund_eligible_until) < new Date()) {
      throw new Error("Refund window (7 days) has expired");
    }
    if (!agreement.stripe_payment_intent_id) throw new Error("No payment to refund");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2025-08-27.basil",
    });

    const refund = await stripe.refunds.create({
      payment_intent: agreement.stripe_payment_intent_id,
      reason: "requested_by_customer",
    });

    await admin.from("lease_fee_refunds").insert({
      lease_agreement_id: agreement.id,
      landlord_id: agreement.landlord_id,
      refund_amount: agreement.fee_amount,
      currency: agreement.fee_currency,
      stripe_refund_id: refund.id,
      reason: reason || "Landlord requested within 7-day window",
      status: refund.status === "succeeded" ? "succeeded" : "processing",
    });

    await admin
      .from("lease_agreements")
      .update({ status: "refunded", refunded_at: new Date().toISOString() })
      .eq("id", agreement.id);

    return new Response(JSON.stringify({ success: true, refund_id: refund.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
