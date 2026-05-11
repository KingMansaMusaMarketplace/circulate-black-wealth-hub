import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

const TIER_PRICING: Record<string, { amount: number; name: string; sla_hours: number }> = {
  priority: { amount: 4900, name: "Priority Verification (4-hour SLA)", sla_hours: 4 },
  same_day: { amount: 9900, name: "Same-Day Verification (1-hour SLA)", sla_hours: 1 },
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

    const { businessId, tier } = await req.json();
    if (!businessId || !tier) throw new Error("businessId and tier are required");
    const pricing = TIER_PRICING[tier];
    if (!pricing) throw new Error("Invalid tier");

    // Verify caller owns business
    const { data: biz } = await supabase
      .from("businesses")
      .select("id, owner_id, name")
      .eq("id", businessId)
      .maybeSingle();
    if (!biz || biz.owner_id !== user.id) throw new Error("Not authorized for this business");

    // Verify a pending verification exists
    const { data: ver } = await supabase
      .from("business_verifications")
      .select("id, verification_status, priority_tier")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!ver) throw new Error("No verification found. Submit verification first.");
    if (ver.verification_status !== "pending") throw new Error("Verification is no longer pending");
    if (ver.priority_tier && ver.priority_tier !== "standard") {
      throw new Error("Priority already purchased for this verification");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2025-08-27.basil",
    });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    const customerId = customers.data[0]?.id;
    const origin = req.headers.get("origin") || "https://1325.ai";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          unit_amount: pricing.amount,
          product_data: {
            name: pricing.name,
            description: `Fast-track verification for ${biz.name}.`,
          },
        },
        quantity: 1,
      }],
      success_url: `${origin}/business-dashboard?priority=success`,
      cancel_url: `${origin}/business-dashboard?priority=cancelled`,
      metadata: {
        type: "verification_priority",
        businessId,
        verificationId: ver.id,
        userId: user.id,
        tier,
        slaHours: String(pricing.sla_hours),
      },
    });

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
