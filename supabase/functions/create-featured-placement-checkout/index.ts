import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

// Tier -> Stripe price (monthly) + placement priority
const TIER_PRICING: Record<string, { price: string; amount: number; name: string; priority: number }> = {
  bronze: { price: "price_1UFRyzAsptTW1mCmAzgAfdD8", amount: 2900, name: "Bronze Featured Placement", priority: 100 },
  silver: { price: "price_1UFRzNAsptTW1mCmX4dWwfXM", amount: 7900, name: "Silver Featured Placement", priority: 200 },
  gold: { price: "price_1UFRzfAsptTW1mCmmmIiV0Zf", amount: 14900, name: "Gold Featured Placement", priority: 300 },
  platinum: { price: "price_1UFS01AsptTW1mCmoQdkd8OE", amount: 29900, name: "Platinum Featured Placement", priority: 400 },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization");
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user?.email) throw new Error("Unauthorized");

    const { businessId, tier, category, city } = await req.json();
    if (!businessId || !tier) throw new Error("businessId and tier are required");
    const pricing = TIER_PRICING[tier];
    if (!pricing) throw new Error("Invalid tier");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2025-08-27.basil",
    });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    const customerId = customers.data[0]?.id;

    const origin = req.headers.get("origin") || "https://1325.ai";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      mode: "subscription",
      line_items: [{ price: pricing.price, quantity: 1 }],
      success_url: `${origin}/business/featured-placement?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/business/featured-placement?status=cancelled`,
      metadata: {
        businessId,
        ownerUserId: user.id,
        tier,
        category: category || "",
        city: city || "",
        type: "featured_placement",
      },
    });

    // Insert pending placement row (no Stripe IDs on public table)
    const { data: placement, error: placementErr } = await supabase
      .from("featured_placements")
      .insert({
        business_id: businessId,
        owner_user_id: user.id,
        tier,
        category: category || null,
        city: city || null,
        priority_score: pricing.priority,
        status: "pending",
      })
      .select("id")
      .single();
    if (placementErr) throw new Error(placementErr.message);

    // Store Stripe customer id in the private companion table
    if (placement?.id && customerId) {
      await supabase.from("featured_placements_private").upsert(
        {
          placement_id: placement.id,
          owner_user_id: user.id,
          stripe_customer_id: customerId,
        },
        { onConflict: "placement_id" }
      );
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
