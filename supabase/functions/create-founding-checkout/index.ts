import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const FOUNDING_PRICE_ID = "price_1TRNO1AsptTW1mCm7jTSG7CL";
const SLOT_CAP = 100;

const log = (step: string, details?: unknown) =>
  console.log(
    `[CREATE-FOUNDING-CHECKOUT] ${step}${details ? ` - ${JSON.stringify(details)}` : ""}`,
  );

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    log("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    // Auth user (anon client + bearer token)
    const supabaseAnon = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } =
      await supabaseAnon.auth.getUser(token);
    if (userError || !userData.user?.email) {
      throw new Error("User not authenticated or missing email");
    }
    const user = userData.user;
    log("User authenticated", { userId: user.id });

    // Service-role client for slot count + business lookup
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    // Slot capacity pre-check
    const { count: claimedCount, error: countError } = await supabaseAdmin
      .from("founding_member_slots")
      .select("*", { count: "exact", head: true });
    if (countError) throw countError;
    if ((claimedCount ?? 0) >= SLOT_CAP) {
      log("Slots full", { claimedCount });
      return new Response(
        JSON.stringify({ error: "SLOTS_FULL", claimed: claimedCount }),
        {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Already a founding member?
    const { data: existing } = await supabaseAdmin
      .from("founding_member_slots")
      .select("slot_number")
      .eq("user_id", user.id)
      .maybeSingle();
    if (existing) {
      return new Response(
        JSON.stringify({
          error: "ALREADY_FOUNDING_MEMBER",
          slot_number: existing.slot_number,
        }),
        {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Look up business id (optional)
    const { data: business } = await supabaseAdmin
      .from("businesses")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();
    const businessId = business?.id ?? null;

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Reuse existing Stripe customer if present
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    const origin = req.headers.get("origin") ?? "https://www.mansamusamarketplace.com";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      payment_method_types: ["card"],
      line_items: [{ price: FOUNDING_PRICE_ID, quantity: 1 }],
      mode: "subscription",
      success_url: `${origin}/founding-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      metadata: {
        user_id: user.id,
        business_id: businessId ?? "",
        tier: "founding_pro",
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          business_id: businessId ?? "",
          tier: "founding_pro",
        },
      },
    });

    log("Checkout session created", { sessionId: session.id });

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
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
