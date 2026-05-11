import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token",
};

const PACKS: Record<string, { credits: number; amount: number; name: string }> = {
  starter: { credits: 25, amount: 900, name: "25 Marketing Credits" },
  pro: { credits: 100, amount: 2500, name: "100 Marketing Credits" },
  studio: { credits: 500, amount: 7900, name: "500 Marketing Credits" },
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

    const { businessId, pack } = await req.json();
    if (!businessId || !pack) throw new Error("businessId and pack are required");
    const p = PACKS[pack];
    if (!p) throw new Error("Invalid pack");

    const { data: biz } = await supabase
      .from("businesses")
      .select("id, owner_id, name")
      .eq("id", businessId)
      .maybeSingle();
    if (!biz || biz.owner_id !== user.id) throw new Error("Not authorized for this business");

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
          unit_amount: p.amount,
          product_data: { name: p.name, description: `Marketing Studio top-up for ${biz.name}.` },
        },
        quantity: 1,
      }],
      success_url: `${origin}/marketing-studio?topup=success`,
      cancel_url: `${origin}/marketing-studio?topup=cancelled`,
      metadata: {
        type: "marketing_topup",
        businessId,
        userId: user.id,
        pack,
        credits: String(p.credits),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
