import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const log = (step: string, details?: unknown) =>
  console.log(
    `[VERIFY-FOUNDING-CHECKOUT] ${step}${details ? ` - ${JSON.stringify(details)}` : ""}`,
  );

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseAnon = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } =
      await supabaseAnon.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Not authenticated");
    const user = userData.user;

    const body = await req.json().catch(() => ({}));
    const sessionId = body?.session_id as string | undefined;
    if (!sessionId) throw new Error("session_id is required");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      log("Payment not completed", { sessionId, status: session.payment_status });
      return new Response(
        JSON.stringify({ error: "PAYMENT_NOT_COMPLETED" }),
        {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;
    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id;
    if (!subscriptionId || !customerId) {
      throw new Error("Missing subscription or customer on session");
    }

    const metadataUserId = session.metadata?.user_id;
    if (metadataUserId && metadataUserId !== user.id) {
      throw new Error("Session does not belong to this user");
    }
    const businessId = session.metadata?.business_id || null;

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    const { data: slot, error: claimError } = await supabaseAdmin.rpc(
      "claim_founding_slot",
      {
        _user_id: user.id,
        _business_id: businessId || null,
        _stripe_subscription_id: subscriptionId,
        _stripe_customer_id: customerId,
      },
    );

    if (claimError) {
      log("Claim failed", { claimError });
      const isFull = String(claimError.message ?? "").includes(
        "FOUNDING_SLOTS_FULL",
      );
      return new Response(
        JSON.stringify({
          error: isFull ? "SLOTS_FULL" : claimError.message,
        }),
        {
          status: isFull ? 409 : 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    log("Slot claimed", { slot, userId: user.id });

    return new Response(
      JSON.stringify({ slot_number: slot, success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log("ERROR", { message });
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
