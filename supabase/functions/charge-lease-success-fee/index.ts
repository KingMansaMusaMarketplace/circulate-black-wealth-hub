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
    if (!user?.email) throw new Error("Not authenticated");

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { leaseAgreementId } = await req.json();
    if (!leaseAgreementId) throw new Error("leaseAgreementId required");

    const { data: agreement, error: aErr } = await admin
      .from("lease_agreements")
      .select("*")
      .eq("id", leaseAgreementId)
      .single();
    if (aErr || !agreement) throw new Error("Lease agreement not found");
    if (agreement.landlord_id !== user.id) throw new Error("Only landlord can pay the lease fee");
    if (agreement.status !== "confirmed") throw new Error("Both parties must confirm before charging");
    if (agreement.fee_charged_at) throw new Error("Fee already charged");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2025-08-27.basil",
    });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    const customerId = customers.data[0]?.id;

    const origin = req.headers.get("origin") || "https://mansamusamarketplace.com";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: "Mansa Stays — Lease Success Fee",
            description: `One-time success fee for confirmed lease. 7-day refund window applies.`,
          },
          unit_amount: Math.round(Number(agreement.fee_amount || 99) * 100),
        },
        quantity: 1,
      }],
      metadata: {
        lease_agreement_id: agreement.id,
        landlord_id: agreement.landlord_id,
        property_id: agreement.property_id,
      },
      success_url: `${origin}/stays/host/lease/${agreement.property_id}?paid=1&agreement=${agreement.id}`,
      cancel_url: `${origin}/stays/host/lease/${agreement.property_id}?canceled=1`,
    });

    await admin
      .from("lease_agreements")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", agreement.id);

    return new Response(JSON.stringify({ url: session.url }), {
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
