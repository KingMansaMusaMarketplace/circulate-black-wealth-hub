// Stripe Identity webhook - marks profile verified when session completes
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature, x-csrf-token",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2025-08-27.basil" });
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_IDENTITY_WEBHOOK_SECRET");
  const body = await req.text();

  // SECURITY: Reject requests that are not signed. Never fall back to unverified JSON.
  if (!signature || !webhookSecret) {
    console.error("Missing stripe-signature header or STRIPE_IDENTITY_WEBHOOK_SECRET");
    return new Response(JSON.stringify({ error: "signature required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (e) {
    console.error("Signature verification failed:", e);
    return new Response(JSON.stringify({ error: "invalid signature" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  if (
    event.type === "identity.verification_session.verified" ||
    event.type === "identity.verification_session.requires_input" ||
    event.type === "identity.verification_session.canceled"
  ) {
    const session = event.data.object as Stripe.Identity.VerificationSession;
    const userId = session.metadata?.user_id;
    if (userId) {
      const status =
        event.type === "identity.verification_session.verified" ? "verified" :
        event.type === "identity.verification_session.canceled" ? "canceled" : "requires_input";

      await admin
        .from("profiles")
        .update({
          identity_status: status,
          identity_verified_at: status === "verified" ? new Date().toISOString() : null,
        })
        .eq("id", userId);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
