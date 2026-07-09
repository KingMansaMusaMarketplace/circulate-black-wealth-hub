import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import Stripe from "https://esm.sh/stripe@18.5.0";

// Stripe webhook to mark lease fee as paid + set 7-day refund window.
// Configure endpoint URL in Stripe dashboard and set STRIPE_LEASE_WEBHOOK_SECRET.

serve(async (req) => {
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
    apiVersion: "2025-08-27.basil",
  });
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  const secret = Deno.env.get("STRIPE_LEASE_WEBHOOK_SECRET");

  // SECURITY: Reject requests without a verified Stripe signature.
  if (!sig || !secret) {
    console.error("Missing stripe-signature header or STRIPE_LEASE_WEBHOOK_SECRET");
    return new Response(JSON.stringify({ error: "signature required" }), { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, secret);
  } catch (e) {
    return new Response(`Webhook Error: ${(e as Error).message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const leaseAgreementId = session.metadata?.lease_agreement_id;
    if (leaseAgreementId) {
      const admin = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      const now = new Date();
      const refundEligibleUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      await admin
        .from("lease_agreements")
        .update({
          fee_charged_at: now.toISOString(),
          stripe_payment_intent_id: session.payment_intent as string,
          refund_eligible_until: refundEligibleUntil.toISOString(),
        })
        .eq("id", leaseAgreementId);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
