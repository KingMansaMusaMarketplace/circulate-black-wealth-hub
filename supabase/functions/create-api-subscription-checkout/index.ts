/**
 * Create Stripe Checkout for API tier subscription.
 * Tiers: pro ($299/mo, 10k calls) | enterprise ($999/mo, 100k calls)
 * Free tier requires no payment.
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

const TIER_PRICING: Record<
  string,
  { amount: number; name: string; calls: number }
> = {
  pro: {
    amount: 29900,
    name: "API Pro — 10,000 calls/mo",
    calls: 10000,
  },
  enterprise: {
    amount: 99900,
    name: "API Enterprise — 100,000 calls/mo",
    calls: 100000,
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization");
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
    } = await supabase.auth.getUser(token);
    if (!user?.email) throw new Error("Unauthorized");

    const { tier } = await req.json();
    if (!tier) throw new Error("tier is required");
    const pricing = TIER_PRICING[tier];
    if (!pricing) throw new Error("Invalid tier");

    // Verify caller has a developer account
    const { data: dev } = await supabase
      .from("developer_accounts")
      .select("id, user_id, company_name, stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!dev) throw new Error("No developer account found");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2025-08-27.basil",
    });

    let customerId = dev.stripe_customer_id;
    if (!customerId) {
      const existing = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });
      customerId = existing.data[0]?.id ?? null;
    }

    const origin = req.headers.get("origin") || "https://1325.ai";

    const session = await stripe.checkout.sessions.create({
      customer: customerId ?? undefined,
      customer_email: customerId ? undefined : user.email,
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: pricing.amount,
            recurring: { interval: "month" },
            product_data: {
              name: pricing.name,
              description: `Institutional Data API access — ${pricing.calls.toLocaleString()} requests per month.`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/developer?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/developer?status=cancelled`,
      metadata: {
        developerId: dev.id,
        userId: user.id,
        tier,
        callLimit: String(pricing.calls),
        type: "api_subscription",
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
