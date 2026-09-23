import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-csrf-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Holiday Special 2026: Pro at $149/mo, locked forever. Same $149 price as Founders' Lock.
const HOLIDAY_PRICE_ID = "price_1TRNO1AsptTW1mCm7jTSG7CL";
// Oct 1 00:00 to Dec 31 23:59:59 America/Chicago (CDT/CST)
const START = Date.parse("2026-10-01T05:00:00Z");
const END = Date.parse("2027-01-01T06:00:00Z");

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const now = Date.now();
    if (now < START) return json({ error: "NOT_STARTED" }, 409);
    if (now >= END) return json({ error: "ENDED" }, 409);

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not configured");
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "AUTH_REQUIRED" }, 401);

    const anon = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: u } = await anon.auth.getUser(authHeader.replace("Bearer ", ""));
    const user = u.user;
    if (!user?.email) return json({ error: "AUTH_REQUIRED" }, 401);

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false },
    });
    const { data: business } = await admin.from("businesses").select("id").eq("owner_id", user.id).maybeSingle();

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    const customerId = customers.data[0]?.id;
    const meta = {
      user_id: user.id,
      business_id: business?.id ?? "",
      tier: "kayla_pro_founders",
      campaign: "holiday_2026",
      userType: "business",
      email: user.email,
    };
    const origin = req.headers.get("origin") ?? "https://1325.ai";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [{ price: HOLIDAY_PRICE_ID, quantity: 1 }],
      mode: "subscription",
      success_url: `${origin}/payment-confirmation?session_id={CHECKOUT_SESSION_ID}&tier=kayla_pro_founders`,
      cancel_url: `${origin}/holiday-special`,
      metadata: meta,
      subscription_data: { metadata: meta },
    });
    return json({ url: session.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[CREATE-HOLIDAY-CHECKOUT]", message);
    return json({ error: message }, 500);
  }
});
