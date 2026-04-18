import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Founders' Lock price ID (Kayla AI Pro $149/mo lifetime)
const FOUNDERS_PRICE_ID = "price_1TGzewAsptTW1mCmYKjYk0Fn";
const FOUNDERS_LIMIT = 100;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Count active + trialing subscriptions on the founders price
    let count = 0;
    let hasMore = true;
    let startingAfter: string | undefined = undefined;

    while (hasMore) {
      const subs: Stripe.ApiList<Stripe.Subscription> = await stripe.subscriptions.list({
        price: FOUNDERS_PRICE_ID,
        status: "all",
        limit: 100,
        starting_after: startingAfter,
      });

      for (const sub of subs.data) {
        if (sub.status === "active" || sub.status === "trialing" || sub.status === "past_due") {
          count++;
        }
      }

      hasMore = subs.has_more;
      if (hasMore && subs.data.length > 0) {
        startingAfter = subs.data[subs.data.length - 1].id;
      }
    }

    const remaining = Math.max(0, FOUNDERS_LIMIT - count);
    const isAvailable = remaining > 0;

    return new Response(
      JSON.stringify({
        count,
        limit: FOUNDERS_LIMIT,
        remaining,
        isAvailable,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[founders-count] error:", message);
    return new Response(
      JSON.stringify({
        error: message,
        // Fail-open: assume available so the card still renders
        count: 0,
        limit: FOUNDERS_LIMIT,
        remaining: FOUNDERS_LIMIT,
        isAvailable: true,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  }
});
