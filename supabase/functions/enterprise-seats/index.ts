import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-csrf-token, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const ENTERPRISE_PER_SEAT_PRICE_ID = "price_1TNLU6AsptTW1mCmvlaqtQsZ";
const ENTERPRISE_BASE_PRICE_ID = "price_1TNLTCAsptTW1mCmVEccEd1D";
const BASE_PRICE_USD = 899;
const PER_SEAT_USD = 50;

const log = (step: string, details?: unknown) => {
  console.log(`[ENTERPRISE-SEATS] ${step}${details ? ` - ${JSON.stringify(details)}` : ""}`);
};

const postSchema = z.object({ seatCount: z.number().int().min(1).max(500) });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr) throw new Error(`Auth error: ${userErr.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Find the user's Stripe customer + active Enterprise subscription
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) throw new Error("No Stripe customer for this user");
    const customerId = customers.data[0].id;

    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 10,
    });
    // Find subscription containing the Enterprise base price and currently active/trialing
    const enterpriseSub = subs.data.find(
      (s) =>
        ["active", "trialing", "past_due"].includes(s.status) &&
        s.items.data.some((it) => it.price.id === ENTERPRISE_BASE_PRICE_ID),
    );
    if (!enterpriseSub) throw new Error("No active Enterprise subscription found");

    let seatItem = enterpriseSub.items.data.find(
      (it) => it.price.id === ENTERPRISE_PER_SEAT_PRICE_ID,
    );
    log("Located subscription", {
      subId: enterpriseSub.id,
      seatItemId: seatItem?.id,
      currentSeats: seatItem?.quantity ?? 0,
    });

    if (req.method === "GET") {
      const currentSeats = seatItem?.quantity ?? 0;
      return new Response(
        JSON.stringify({
          subscription_id: enterpriseSub.id,
          seat_count: currentSeats,
          base_price_usd: BASE_PRICE_USD,
          per_seat_usd: PER_SEAT_USD,
          monthly_total_usd: BASE_PRICE_USD + currentSeats * PER_SEAT_USD,
          current_period_end: new Date(enterpriseSub.current_period_end * 1000).toISOString(),
          status: enterpriseSub.status,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
      );
    }

    if (req.method === "POST") {
      const body = await req.json();
      const parsed = postSchema.safeParse(body);
      if (!parsed.success) {
        return new Response(
          JSON.stringify({ error: "Invalid input", details: parsed.error.errors }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const { seatCount } = parsed.data;

      if (seatItem) {
        await stripe.subscriptionItems.update(seatItem.id, {
          quantity: seatCount,
          proration_behavior: "create_prorations",
        });
        log("Updated seat quantity", { seatItemId: seatItem.id, seatCount });
      } else {
        const created = await stripe.subscriptionItems.create({
          subscription: enterpriseSub.id,
          price: ENTERPRISE_PER_SEAT_PRICE_ID,
          quantity: seatCount,
          proration_behavior: "create_prorations",
        });
        seatItem = created as any;
        log("Created seat item", { seatItemId: created.id, seatCount });
      }

      // Upsert tracking row (service role bypasses RLS)
      await supabase.from("enterprise_seats").upsert(
        {
          owner_user_id: user.id,
          stripe_customer_id: customerId,
          stripe_subscription_id: enterpriseSub.id,
          stripe_seat_item_id: seatItem?.id ?? null,
          seat_count: seatCount,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "stripe_subscription_id" },
      );

      return new Response(
        JSON.stringify({
          ok: true,
          seat_count: seatCount,
          monthly_total_usd: BASE_PRICE_USD + seatCount * PER_SEAT_USD,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
      );
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    log("ERROR", { msg });
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
